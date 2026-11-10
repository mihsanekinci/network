import React, { useState } from "react";
import { X, Check, Copy } from "lucide-react";
import type { TurTasarimOzellikleri } from "../../../constants/designTokens";

interface DrawerHeaderProps {
  etiket: string;
  dugumId: string;
  aktifToken: TurTasarimOzellikleri;
  fotografUrl?: string;
  onKapat: () => void;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
  etiket,
  dugumId,
  aktifToken,
  fotografUrl,
  onKapat,
}) => {
  const [idKopyalandi, setIdKopyalandi] = useState(false);
  const [resimHatasi, setResimHatasi] = useState(false);
  const AktifSimge = aktifToken.simge;

  const handleIdKopyala = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(dugumId);
    setIdKopyalandi(true);
    setTimeout(() => setIdKopyalandi(false), 2000);
  };

  const gecerliFotograf = Boolean(fotografUrl && fotografUrl.trim().startsWith("http") && !resimHatasi);

  return (
    <div className="p-5 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {gecerliFotograf ? (
          <img
            src={fotografUrl}
            alt={etiket}
            onError={() => setResimHatasi(true)}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200/80 dark:border-slate-700 shadow-xs ring-1 ring-slate-100 dark:ring-slate-800 shrink-0"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${aktifToken.avatar.gradyan} text-white shadow-xs flex items-center justify-center shrink-0`}
          >
            <AktifSimge className="w-5 h-5 stroke-[2]" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight truncate">
              {etiket || "Düğüm Detayı"}
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${aktifToken.rozet.arkaPlan} ${aktifToken.rozet.metin} ${aktifToken.rozet.kenarlik}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${aktifToken.rozet.nokta}`} />
              {aktifToken.etiket}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <button
              type="button"
              onClick={handleIdKopyala}
              title={`Benzersiz veritabanı CUID anahtarını kopyala: ${dugumId}`}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 active:scale-95 border border-slate-200/80 dark:border-slate-700/80 text-[10px] font-mono text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer btn-tactile group/id"
            >
              <span className="text-slate-400 font-sans font-medium">ID:</span>
              <span className="text-slate-600 dark:text-slate-300 font-mono font-medium">{dugumId.slice(0, 10)}...</span>
              {idKopyalandi ? (
                <Check className="w-3 h-3 text-emerald-600 animate-in zoom-in" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400 group-hover/id:text-slate-600 dark:group-hover/id:text-slate-300 transition-colors" />
              )}
              {idKopyalandi && (
                <span className="text-[10px] text-emerald-600 font-sans font-semibold">Kopyalandı!</span>
              )}
            </button>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onKapat}
        title="Kapat (Esc)"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer btn-tactile shrink-0"
      >
        <X className="w-4 h-4 stroke-[2]" />
      </button>
    </div>
  );
};
