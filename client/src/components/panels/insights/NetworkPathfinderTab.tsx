import React from "react";
import { Search, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import type { DugumDTO, KenarDTO } from "../../../types";
import type { YolSonucu } from "../../../utils/networkAnalysis";

interface NetworkPathfinderTabProps {
  dugumler: DugumDTO[];
  kenarlar: KenarDTO[];
  kaynakId: string;
  hedefId: string;
  aramaYapildi: boolean;
  yolSonucu: YolSonucu | null;
  onKaynakDegistir: (id: string) => void;
  onHedefDegistir: (id: string) => void;
  onHesapla: () => void;
  onYoluVurgula: () => void;
}

export const NetworkPathfinderTab: React.FC<NetworkPathfinderTabProps> = ({
  dugumler,
  kenarlar,
  kaynakId,
  hedefId,
  aramaYapildi,
  yolSonucu,
  onKaynakDegistir,
  onHedefDegistir,
  onHesapla,
  onYoluVurgula,
}) => {
  const dugumBul = (id: string) => dugumler.find((d) => d.id === id);

  return (
    <div className="flex flex-col gap-4.5">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Ağınızdaki iki kişi, kurum veya kavram arasındaki bağlantı zincirini tespit edin.
      </p>

      {/* Seçim Formu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">1. Başlangıç Düğümü</label>
          <select
            value={kaynakId}
            onChange={(e) => onKaynakDegistir(e.target.value)}
            className="h-10 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 dark:text-slate-100 shadow-2xs"
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
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">2. Hedef Düğüm</label>
          <select
            value={hedefId}
            onChange={(e) => onHedefDegistir(e.target.value)}
            className="h-10 px-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 dark:text-slate-100 shadow-2xs"
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
        onClick={onHesapla}
        disabled={!kaynakId || !hedefId}
        className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start btn-tactile shadow-xs"
      >
        <Search className="w-3.5 h-3.5" />
        <span>En Kısa Yolu Hesapla</span>
      </button>

      {/* Arama Sonucu */}
      {aramaYapildi && yolSonucu && (
        <div className="mt-1 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-2xs flex flex-col gap-3">
          {yolSonucu.bulundu ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
                  <span>Bağlantı Yolu Bulundu ({yolSonucu.mesafe} Adım)</span>
                </span>
                <button
                  type="button"
                  onClick={onYoluVurgula}
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
                      <div className="px-3 py-1.5 bg-indigo-50/70 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-bold text-indigo-900 dark:text-indigo-200 shadow-2xs">
                        {dugum?.etiket ?? "Düğüm"}
                      </div>
                      {idx < yolSonucu.dugumIdleri.length - 1 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold px-1">
                          {kenar?.etiket && (
                            <span className="text-[10px] text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                              {kenar.etiket}
                            </span>
                          )}
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Bu iki düğüm arasında doğrudan veya dolaylı bir bağlantı yolu bulunamadı.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
