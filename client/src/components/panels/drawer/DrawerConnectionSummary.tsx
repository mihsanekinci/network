import React from "react";
import { Link2, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { DugumDTO, KenarDTO } from "../../../types";

export interface BaglantiOgesi extends KenarDTO {
  bagliDugum?: DugumDTO;
  bagliDugumAdi: string;
}

interface DrawerConnectionSummaryProps {
  toplamBaglantiSayisi: number;
  gelenBaglantilar: BaglantiOgesi[];
  gidenBaglantilar: BaglantiOgesi[];
}

export const DrawerConnectionSummary: React.FC<DrawerConnectionSummaryProps> = ({
  toplamBaglantiSayisi,
  gelenBaglantilar,
  gidenBaglantilar,
}) => {
  return (
    <div className="p-4.5 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex flex-col gap-3.5 shadow-2xs">
      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2]" />
          <span>Ağ Bağlantıları Özeti</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-700/80">
          {toplamBaglantiSayisi} Bağlantı
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Gelen Bağlantılar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
              <span>Gelen (Hedef)</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
              {gelenBaglantilar.length}
            </span>
          </div>
          {gelenBaglantilar.length > 0 ? (
            <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto pr-1">
              {gelenBaglantilar.map((b) => (
                <div
                  key={b.id}
                  className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 rounded-lg flex items-center justify-between gap-1 text-[11px]"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate" title={b.bagliDugumAdi}>
                    {b.bagliDugumAdi}
                  </span>
                  {b.etiket && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800 shrink-0 font-medium">
                      {b.etiket}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 dark:text-slate-400 italic">Gelen bağlantı yok</div>
          )}
        </div>

        {/* Giden Bağlantılar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 stroke-[2.2]" />
              <span>Giden (Kaynak)</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
              {gidenBaglantilar.length}
            </span>
          </div>
          {gidenBaglantilar.length > 0 ? (
            <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto pr-1">
              {gidenBaglantilar.map((b) => (
                <div
                  key={b.id}
                  className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 rounded-lg flex items-center justify-between gap-1 text-[11px]"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate" title={b.bagliDugumAdi}>
                    {b.bagliDugumAdi}
                  </span>
                  {b.etiket && (
                    <span className="text-[10px] text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 px-1.5 py-0.5 rounded border border-sky-100 dark:border-sky-800 shrink-0 font-medium">
                      {b.etiket}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 dark:text-slate-400 italic">Giden bağlantı yok</div>
          )}
        </div>
      </div>
    </div>
  );
};
