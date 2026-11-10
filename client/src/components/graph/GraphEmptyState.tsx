import React from "react";
import {
  Map as MapIcon,
  Sparkles,
  Route,
  X,
  User,
  Building2,
  Lightbulb,
  Component,
} from "lucide-react";

export const GraphNoMapSelected: React.FC = () => {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 p-8 text-center select-none relative overflow-hidden transition-colors">
      <div className="absolute w-96 h-96 rounded-full bg-indigo-50/50 dark:bg-indigo-950/20 blur-3xl pointer-events-none" />
      <div className="relative glass-floating px-10 py-9 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
          <MapIcon className="w-8 h-8" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
          Harita Seçilmedi
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
          Sol panelden mevcut bir haritayı seçin veya{" "}
          <strong className="font-semibold text-indigo-600 dark:text-indigo-400">+ Yeni Harita</strong> butonuna
          tıklayarak ilk haritanızı oluşturun.
        </p>
      </div>
    </div>
  );
};

export const GraphNoNodesCreated: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 text-center p-6 select-none">
      <div className="glass-floating px-8 py-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl max-w-sm mx-auto pointer-events-auto">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 tracking-tight">
          Bu Haritada Henüz Düğüm Yok
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-normal">
          Ağınızı oluşturmaya başlamak için yukarıdaki{" "}
          <strong className="font-semibold text-indigo-600 dark:text-indigo-400">+ Düğüm Ekle</strong> butonunu
          kullanarak kişi, kurum veya kavram ekleyin.
        </p>
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-500" /> Kişi
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-500" /> Kurum
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Kavram
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Component className="w-3.5 h-3.5 text-purple-500" /> Diğer
          </span>
        </div>
      </div>
    </div>
  );
};

interface GraphPathHighlightBadgeProps {
  sayi: number;
  onTemizle: () => void;
}

export const GraphPathHighlightBadge: React.FC<GraphPathHighlightBadgeProps> = ({
  sayi,
  onTemizle,
}) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-slate-900/95 text-white rounded-full shadow-xl backdrop-blur-md flex items-center gap-3 text-xs animate-in fade-in slide-from-top-2 border border-slate-700/60">
      <span className="flex items-center gap-2 font-medium">
        <Route className="w-4 h-4 text-amber-400" />
        <span>İlişki Rotası Vurgulandı ({sayi} Düğüm)</span>
      </span>
      <button
        type="button"
        onClick={onTemizle}
        className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[11px] transition-colors cursor-pointer flex items-center gap-1 btn-tactile"
      >
        <span>Temizle</span>
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
