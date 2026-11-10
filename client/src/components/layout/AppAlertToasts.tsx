import React from "react";
import { Sparkles, AlertCircle, X } from "lucide-react";

interface AppAlertToastsProps {
  otomatikDuzenlemeUyarisi: string | null;
  hata: string | null;
  onHatayiTemizle: () => void;
}

export const AppAlertToasts: React.FC<AppAlertToastsProps> = ({
  otomatikDuzenlemeUyarisi,
  hata,
  onHatayiTemizle,
}) => {
  return (
    <>
      {/* Otomatik Düzenleme Bilgi/Uyarı Balonu */}
      {otomatikDuzenlemeUyarisi && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/95 text-white rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2 border border-slate-700/60 font-medium select-none">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{otomatikDuzenlemeUyarisi}</span>
        </div>
      )}

      {/* Hata Bildirimi (Varsa) */}
      {hata && (
        <div className="mx-3 sm:mx-4 mb-2 px-3.5 py-2 rounded-xl bg-red-50/90 border border-red-200 text-xs text-red-700 flex items-center justify-between shadow-2xs backdrop-blur-sm z-20">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="truncate font-medium">{hata}</span>
          </div>
          <button
            onClick={onHatayiTemizle}
            title="Bildirimi Kapat"
            className="p-1 rounded-md text-red-400 hover:text-red-700 hover:bg-red-100/60 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};
