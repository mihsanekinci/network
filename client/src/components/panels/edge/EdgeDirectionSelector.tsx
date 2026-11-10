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
      <label className="block text-xs font-bold text-slate-700">Bağlantı Yönü</label>
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
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Simge className={`w-3.5 h-3.5 ${secili ? "text-indigo-600" : "text-slate-500"}`} />
                <span className="font-bold text-xs">{secenek.etiket}</span>
              </div>
              <span className="text-[10px] text-slate-500 leading-tight">
                {secenek.aciklama}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
