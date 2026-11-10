import React, { useState, useMemo } from "react";
import { Activity, Route, X, Network } from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";
import { hesaplaAgMetrikleri, enKisaYoluBul } from "../../utils/networkAnalysis";
import { NetworkMetricsTab } from "./insights/NetworkMetricsTab";
import { NetworkPathfinderTab } from "./insights/NetworkPathfinderTab";

interface NetworkInsightsModalProps {
  acik: boolean;
  kapat: () => void;
}

export const NetworkInsightsModal: React.FC<NetworkInsightsModalProps> = ({ acik, kapat }) => {
  const { dugumler, kenarlar, yolVurgula, secilenDugumuAyarla } = useHaritaStore();
  const [aktifSekme, setAktifSekme] = useState<"metrikler" | "yol">("metrikler");

  // En Kısa Yol Seçimleri
  const [kaynakId, setKaynakId] = useState<string>("");
  const [hedefId, setHedefId] = useState<string>("");
  const [aramaYapildi, setAramaYapildi] = useState(false);

  const metrikler = useMemo(() => {
    return hesaplaAgMetrikleri(dugumler, kenarlar);
  }, [dugumler, kenarlar]);

  const yolSonucu = useMemo(() => {
    if (!kaynakId || !hedefId || !aramaYapildi) return null;
    return enKisaYoluBul(kaynakId, hedefId, dugumler, kenarlar);
  }, [kaynakId, hedefId, aramaYapildi, dugumler, kenarlar]);

  if (!acik) return null;

  const handleYoluVurgula = () => {
    if (yolSonucu && yolSonucu.bulundu) {
      yolVurgula(yolSonucu.dugumIdleri, yolSonucu.kenarIdleri);
      kapat();
    }
  };

  const handleDugumDetay = (dugumId: string) => {
    secilenDugumuAyarla(dugumId);
    kapat();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) kapat();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="glass-floating rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Activity className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">Ağ ve İlişki Analizi</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Haritanızdaki bağlantı yoğunluğu, metrikler ve aktörler arası rotalar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={kapat}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer btn-tactile"
            title="Kapat (ESC)"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Sekme Seçici */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setAktifSekme("metrikler")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 btn-tactile ${
              aktifSekme === "metrikler"
                ? "border-indigo-600 text-indigo-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Genel Metrikler & Kilit Düğümler</span>
          </button>
          <button
            type="button"
            onClick={() => setAktifSekme("yol")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 btn-tactile ${
              aktifSekme === "yol"
                ? "border-indigo-600 text-indigo-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>En Kısa Yol Rotası (Pathfinder)</span>
          </button>
        </div>

        {/* İçerik */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {aktifSekme === "metrikler" ? (
            <NetworkMetricsTab
              metrikler={metrikler}
              onDugumDetay={handleDugumDetay}
            />
          ) : (
            <NetworkPathfinderTab
              dugumler={dugumler}
              kenarlar={kenarlar}
              kaynakId={kaynakId}
              hedefId={hedefId}
              aramaYapildi={aramaYapildi}
              yolSonucu={yolSonucu}
              onKaynakDegistir={(id) => {
                setKaynakId(id);
                setAramaYapildi(false);
              }}
              onHedefDegistir={(id) => {
                setHedefId(id);
                setAramaYapildi(false);
              }}
              onHesapla={() => setAramaYapildi(true)}
              onYoluVurgula={handleYoluVurgula}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-white/70 flex justify-end">
          <button
            type="button"
            onClick={kapat}
            className="h-8.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer btn-tactile"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkInsightsModal;
