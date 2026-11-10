import React from "react";
import { Trash2, Save } from "lucide-react";

interface DrawerFooterProps {
  yukleniyor: boolean;
  kaydediliyor: boolean;
  kaydetDevreDisi: boolean;
  onSil: () => void;
  onVazgec: () => void;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({
  yukleniyor,
  kaydediliyor,
  kaydetDevreDisi,
  onSil,
  onVazgec,
}) => {
  return (
    <div className="p-4.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200/90 dark:border-slate-800 flex items-center justify-between shrink-0">
      <button
        type="button"
        onClick={onSil}
        disabled={yukleniyor || kaydediliyor}
        className="text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200/80 dark:border-red-900/80 rounded-xl px-3.5 py-2.5 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 btn-tactile"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Düğümü Sil</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onVazgec}
          className="text-xs font-semibold text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-4 py-2.5 cursor-pointer transition-all btn-tactile"
        >
          Vazgeç
        </button>
        <button
          type="submit"
          form="dugum-detay-form"
          disabled={kaydetDevreDisi}
          className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5 py-2.5 shadow-xs active:bg-indigo-800 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 btn-tactile"
        >
          {kaydediliyor ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Kaydediliyor...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Değişiklikleri Kaydet</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
