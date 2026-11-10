import React from "react";
import { MessageSquareText, Sparkles } from "lucide-react";
import { ILETISIM_USLUBU_SECENEKLERI } from "../../../utils/relationshipFreshness";
import type { IletisimUslubu } from "../../../types";

interface DrawerCommunicationToneProps {
  ozellikler: Record<string, unknown>;
  onOzellikDegistir: (alan: string, deger: unknown) => void;
}

export const DrawerCommunicationTone: React.FC<DrawerCommunicationToneProps> = ({
  ozellikler,
  onOzellikDegistir,
}) => {
  const aktifUslup =
    (ozellikler.iletisimUslubu as IletisimUslubu) ?? "yari_resmi";
  const uslupNotu = (ozellikler.uslupNotu as string) ?? "";

  return (
    <div className="p-4.5 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex flex-col gap-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <MessageSquareText className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          <span>İletişim Üslubu & Hitap Rehberi</span>
        </h4>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/50 px-2 py-0.5 rounded-full border border-violet-200/80 dark:border-violet-800">
          <Sparkles className="w-2.5 h-2.5 text-violet-500" />
          <span>NetWork MCP</span>
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Tercih Edilen Hitap / Üslup
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ILETISIM_USLUBU_SECENEKLERI.map((secenek) => {
            const secili = aktifUslup === secenek.uslup;
            return (
              <button
                key={secenek.uslup}
                type="button"
                onClick={() => onOzellikDegistir("iletisimUslubu", secenek.uslup)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 btn-tactile ${
                  secili
                    ? "bg-violet-50 dark:bg-violet-950/40 border-violet-300 dark:border-violet-700 ring-2 ring-violet-500/20"
                    : "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    secili
                      ? "text-violet-900 dark:text-violet-200"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {secenek.etiket}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {secenek.aciklama}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Özel İletişim Notu & Ajan Talimatı
        </label>
        <textarea
          rows={3}
          value={uslupNotu}
          onChange={(e) => onOzellikDegistir("uslupNotu", e.target.value)}
          placeholder="Örn: E-postalarda 'Sayın Hocam' ile başla; teknik sorulara maddeler halinde kısa cevaplar ver; WhatsApp'tan sadece mesai saatlerinde yaz."
          className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 min-h-[75px] leading-relaxed shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-y"
        />
      </div>
    </div>
  );
};
