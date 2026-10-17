import React, { useState, useMemo } from "react";
import {
  Activity,
  Route,
  X,
  Search,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Network,
} from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";
import { TUR_TASARIM_TOKENLARI } from "../../constants/designTokens";
import { hesaplaAgMetrikleri, enKisaYoluBul } from "../../utils/networkAnalysis";

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

  const dugumBul = (id: string) => dugumler.find((d) => d.id === id);

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
            <>
              {/* İstatistik Kartları */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Toplam Düğüm
                  </span>
                  <span className="text-2xl font-bold text-slate-800 mt-1">
                    {metrikler.toplamDugum}
                  </span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Bağlantı Sayısı
                  </span>
                  <span className="text-2xl font-bold text-indigo-600 mt-1">
                    {metrikler.toplamKenar}
                  </span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ağ Yoğunluğu
                  </span>
                  <span className="text-2xl font-bold text-emerald-600 mt-1">
                    %{Math.round(metrikler.yogunluk * 100)}
                  </span>
                </div>
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl flex flex-col shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ort. Bağlantı
                  </span>
                  <span className="text-2xl font-bold text-purple-600 mt-1">
                    {metrikler.ortalamaDerece}
                  </span>
                </div>
              </div>

              {/* Tür Dağılımı */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Düğüm Türleri Dağılımı
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {(["kisi", "kurum", "kavram", "diger"] as const).map((turKodu) => {
                    const token = TUR_TASARIM_TOKENLARI[turKodu];
                    const Simge = token.simge;
                    const sayi = metrikler.turDagilimi[turKodu];

                    return (
                      <div
                        key={turKodu}
                        className={`px-3 py-2 border rounded-xl flex items-center justify-between text-xs shadow-2xs ${token.rozet.arkaPlan} ${token.rozet.kenarlik}`}
                      >
                        <span className={`flex items-center gap-1.5 font-medium ${token.rozet.metin}`}>
                          <Simge className="w-3.5 h-3.5" style={{ color: token.renkKodu }} />
                          <span>{token.etiket}</span>
                        </span>
                        <span className="font-bold text-slate-800">{sayi}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* En Kilit Düğümler (Top Hubs) */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ağın En Kilit Aktörleri (En Çok Bağlantılı 5 Düğüm)
                </h4>
                {metrikler.enKilitDugumler.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Henüz yeterli bağlantı bulunmuyor.</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {metrikler.enKilitDugumler.map((item, index) => {
                      const token = TUR_TASARIM_TOKENLARI[item.dugum.tur] ?? TUR_TASARIM_TOKENLARI.diger;
                      const Simge = token.simge;

                      return (
                        <div
                          key={item.dugum.id}
                          className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between transition-colors shadow-2xs tactile-card"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                              {index + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                                style={{ color: token.renkKodu }}
                              >
                                <Simge className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-bold text-slate-800">
                                {item.dugum.etiket}
                              </span>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${token.rozet.arkaPlan} ${token.rozet.metin} ${token.rozet.kenarlik}`}
                            >
                              <span className={`w-1 h-1 rounded-full ${token.rozet.nokta}`} />
                              {token.etiket}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                              {item.derece} Bağlantı
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                secilenDugumuAyarla(item.dugum.id);
                                kapat();
                              }}
                              className="text-xs font-medium text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer btn-tactile"
                            >
                              Detay
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Pathfinder / En Kısa Yol */
            <div className="flex flex-col gap-4.5">
              <p className="text-xs text-slate-500">
                Ağınızdaki iki kişi, kurum veya kavram arasındaki bağlantı zincirini tespit edin.
              </p>

              {/* Seçim Formu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">1. Başlangıç Düğümü</label>
                  <select
                    value={kaynakId}
                    onChange={(e) => {
                      setKaynakId(e.target.value);
                      setAramaYapildi(false);
                    }}
                    className="h-10 px-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 shadow-2xs"
                  >
                    <option value="">Başlangıç düğümü seçin...</option>
                    {dugumler.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.etiket} ({d.tur})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">2. Hedef Düğüm</label>
                  <select
                    value={hedefId}
                    onChange={(e) => {
                      setHedefId(e.target.value);
                      setAramaYapildi(false);
                    }}
                    className="h-10 px-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 shadow-2xs"
                  >
                    <option value="">Hedef düğüm seçin...</option>
                    {dugumler
                      .filter((d) => d.id !== kaynakId)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.etiket} ({d.tur})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAramaYapildi(true)}
                disabled={!kaynakId || !hedefId}
                className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start btn-tactile shadow-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>En Kısa Yolu Hesapla</span>
              </button>

              {/* Arama Sonucu */}
              {aramaYapildi && yolSonucu && (
                <div className="mt-1 p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col gap-3">
                  {yolSonucu.bulundu ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
                          <span>Bağlantı Yolu Bulundu ({yolSonucu.mesafe} Adım)</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleYoluVurgula}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 btn-tactile"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Tuvalde Parlat ve Vurgula</span>
                        </button>
                      </div>

                      {/* Yol Görsel Adımları */}
                      <div className="flex items-center flex-wrap gap-2 pt-2">
                        {yolSonucu.dugumIdleri.map((dId, idx) => {
                          const dugum = dugumBul(dId);
                          const kenarId = yolSonucu.kenarIdleri[idx];
                          const kenar = kenarlar.find((k) => k.id === kenarId);

                          return (
                            <React.Fragment key={dId}>
                              <div className="px-3 py-1.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-900 shadow-2xs">
                                {dugum?.etiket ?? "Düğüm"}
                              </div>
                              {idx < yolSonucu.dugumIdleri.length - 1 && (
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold px-1">
                                  {kenar?.etiket && (
                                    <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                      {kenar.etiket}
                                    </span>
                                  )}
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-amber-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Bu iki düğüm arasında doğrudan veya dolaylı bir bağlantı yolu bulunamadı.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
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
