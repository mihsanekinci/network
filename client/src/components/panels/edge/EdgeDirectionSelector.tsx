import React from "react";
import { ArrowRight, ArrowLeftRight, Minus } from "lucide-react";
import type { KenarYonu } from "../../../types";

const YON_SECENEKLERI: {
  deger: KenarYonu;
  etiket: string;
  simge: typeof ArrowRight;
  aciklama: string;
}[] = [
  {
    deger: "tek_yonlu",
    etiket: "Tek Yönlü",
    simge: ArrowRight,
    aciklama: "Kaynaktan hedefe animasyonlu ok",
  },
  {
    deger: "cift_yonlu",
    etiket: "Çift Yönlü",
    simge: ArrowLeftRight,
    aciklama: "İki uçta da ok başı, karşılıklı",
  },
  {
    deger: "yonsuz",
    etiket: "Yönsüz",
    simge: Minus,
    aciklama: "Düz çizgi, yönsüz bağlantı",
  },
];

interface EdgeDirectionSelectorProps {
  yon: KenarYonu;
  onChange: (yeniYon: KenarYonu) => void;
}

export const EdgeDirectionSelector: React.FC<EdgeDirectionSelectorProps> = ({
  yon,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Bağlantı Yönü</label>
      <div className="grid grid-cols-3 gap-2">
        {YON_SECENEKLERI.map((secenek) => {
          const secili = yon === secenek.deger;
          const Simge = secenek.simge;
          return (
            <button
              type="button"
              key={secenek.deger}
              onClick={() => onChange(secenek.deger)}
              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 btn-tactile ${
                secili
                  ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Simge className={`w-3.5 h-3.5 ${secili ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`} />
                <span className="font-bold text-xs">{secenek.etiket}</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {secenek.aciklama}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
