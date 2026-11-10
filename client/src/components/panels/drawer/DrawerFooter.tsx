import React, { useState } from "react";
import { Trash2, Save, Check } from "lucide-react";

interface DrawerFooterProps {
  yukleniyor: boolean;
  kaydediliyor: boolean;
  kaydetDevreDisi: boolean;
  siliniyor?: boolean;
  onSil: () => void;
  onVazgec: () => void;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({
  yukleniyor,
  kaydediliyor,
  kaydetDevreDisi,
  siliniyor = false,
  onSil,
  onVazgec,
}) => {
  const [onayGoster, setOnayGoster] = useState(false);

  return (
    <div className="p-4.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200/90 dark:border-slate-800 flex items-center justify-between shrink-0">
      {onayGoster ? (
        <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
          <span className="text-xs text-red-600 dark:text-red-400 font-semibold hidden sm:inline">
            Emin misiniz?
          </span>
          <button
            type="button"
            onClick={onSil}
            disabled={siliniyor}
            className="h-9 px-3 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1 btn-tactile disabled:opacity-50"
          >
            {siliniyor ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Evet, Sil</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOnayGoster(false)}
            className="h-9 px-2.5 text-xs font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer btn-tactile"
          >
            Vazgeç
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOnayGoster(true)}
          disabled={yukleniyor || kaydediliyor}
          className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50/40 dark:bg-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/60 border border-red-200/90 dark:border-red-900/80 rounded-xl px-3.5 py-2.5 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs btn-tactile"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Düğümü Sil</span>
        </button>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onVazgec}
          className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 rounded-xl px-4 py-2.5 cursor-pointer transition-all shadow-2xs btn-tactile"
        >
          Vazgeç
        </button>
        <button
          type="submit"
          form="dugum-detay-form"
          disabled={kaydetDevreDisi}
          className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl px-5 py-2.5 shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 btn-tactile"
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
