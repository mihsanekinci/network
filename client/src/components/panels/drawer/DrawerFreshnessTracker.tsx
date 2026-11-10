import React, { useMemo } from "react";
import { Clock, Calendar, CheckCircle2, AlertTriangle, Moon, HelpCircle } from "lucide-react";
import {
  hesaplaTazelik,
  VARSAYILAN_HEDEF_ARALIK_GUN,
} from "../../../utils/relationshipFreshness";
import type { TazelikDurumu } from "../../../types";

interface DrawerFreshnessTrackerProps {
  ozellikler: Record<string, unknown>;
  onOzellikDegistir: (alan: string, deger: unknown) => void;
}

const HEDEF_ARALIK_SECENEKLERI = [
  { deger: 15, etiket: "15 günde bir (Çok Sıkı)" },
  { deger: 30, etiket: "30 günde bir (Aylık)" },
  { deger: 60, etiket: "60 günde bir (2 Ayda Bir)" },
  { deger: 90, etiket: "90 günde bir (Çeyreklik - Önerilen)" },
  { deger: 180, etiket: "180 günde bir (6 Ayda Bir)" },
  { deger: 365, etiket: "Yılda bir (Yıllık Hatırlatma)" },
];

const ROZET_STILLERI: Record<
  TazelikDurumu,
  {
    arkaPlan: string;
    kenarlik: string;
    metin: string;
    Simge: typeof Clock;
    etiket: string;
  }
> = {
  taze: {
    arkaPlan: "bg-emerald-50 dark:bg-emerald-950/40",
    kenarlik: "border-emerald-200 dark:border-emerald-800",
    metin: "text-emerald-700 dark:text-emerald-300",
    Simge: CheckCircle2,
    etiket: "Taze Bağlantı",
  },
  ilgi_bekliyor: {
    arkaPlan: "bg-amber-50 dark:bg-amber-950/40",
    kenarlik: "border-amber-200 dark:border-amber-800",
    metin: "text-amber-700 dark:text-amber-300",
    Simge: AlertTriangle,
    etiket: "İlgi Bekliyor",
  },
  uykuda: {
    arkaPlan: "bg-rose-50 dark:bg-rose-950/40",
    kenarlik: "border-rose-200 dark:border-rose-800",
    metin: "text-rose-700 dark:text-rose-300",
    Simge: Moon,
    etiket: "Uykuda (Dormant)",
  },
  belirsiz: {
    arkaPlan: "bg-slate-50 dark:bg-slate-800/60",
    kenarlik: "border-slate-200 dark:border-slate-700",
    metin: "text-slate-600 dark:text-slate-400",
    Simge: HelpCircle,
    etiket: "Temas Belirsiz",
  },
};

export const DrawerFreshnessTracker: React.FC<DrawerFreshnessTrackerProps> = ({
  ozellikler,
  onOzellikDegistir,
}) => {
  const tazelik = useMemo(() => hesaplaTazelik(ozellikler), [ozellikler]);
  const rozet = ROZET_STILLERI[tazelik.durum];
  const DurumSimgesi = rozet.Simge;

  const hedefAralik =
    typeof ozellikler.hedefTemasAraligiGun === "number"
      ? ozellikler.hedefTemasAraligiGun
      : VARSAYILAN_HEDEF_ARALIK_GUN;

  const sonTemasDegeri = typeof ozellikler.sonTemasTarihi === "string"
    ? ozellikler.sonTemasTarihi
    : "";

  const bugunuKaydet = () => {
    const bugunStr = new Date().toISOString().slice(0, 10);
    onOzellikDegistir("sonTemasTarihi", bugunStr);
  };

  return (
    <div className="p-4.5 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex flex-col gap-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>İlişki Tazeliği & Zaman Sayacı</span>
        </h4>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${rozet.arkaPlan} ${rozet.kenarlik} ${rozet.metin}`}
        >
          <DurumSimgesi className="w-3 h-3" />
          <span>{rozet.etiket}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-400" />
            <span>Son Temas Tarihi</span>
          </label>
          <input
            type="date"
            value={sonTemasDegeri}
            onChange={(e) => onOzellikDegistir("sonTemasTarihi", e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Hedef Temas Sıklığı
          </label>
          <select
            value={hedefAralik}
            onChange={(e) =>
              onOzellikDegistir("hedefTemasAraligiGun", Number(e.target.value))
            }
            className="w-full h-10 px-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            {HEDEF_ARALIK_SECENEKLERI.map((secenek) => (
              <option key={secenek.deger} value={secenek.deger}>
                {secenek.etiket}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Durum Göstergesi
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {tazelik.etiket}
          </span>
        </div>
        <button
          type="button"
          onClick={bugunuKaydet}
          className="h-8 px-3 text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg shadow-2xs transition-all cursor-pointer btn-tactile"
        >
          Bugün Temas Kuruldu
        </button>
      </div>
    </div>
  );
};
