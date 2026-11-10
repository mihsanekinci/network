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

interface DeleteConfirmationBarProps {
  siliniyor: boolean;
  onOnayla: () => void;
  onIptal: () => void;
}

const DeleteConfirmationBar: React.FC<DeleteConfirmationBarProps> = ({
  siliniyor,
  onOnayla,
  onIptal,
}) => (
  <div className="p-4 bg-rose-50/90 dark:bg-rose-950/50 border-t border-rose-200/90 dark:border-rose-900/80 flex items-center justify-between shrink-0 animate-in fade-in duration-150">
    <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
      <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
      <span>Düğüm ve tüm bağlantıları silinecek.</span>
    </div>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onIptal}
        className="h-8.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer btn-tactile"
      >
        İptal
      </button>
      <button
        type="button"
        onClick={onOnayla}
        disabled={siliniyor}
        className="h-8.5 px-3.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 btn-tactile disabled:opacity-50"
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
    </div>
  </div>
);

interface DefaultFooterBarProps {
  yukleniyor: boolean;
  kaydediliyor: boolean;
  kaydetDevreDisi: boolean;
  onSilIstegi: () => void;
  onKapat: () => void;
}

const DefaultFooterBar: React.FC<DefaultFooterBarProps> = ({
  yukleniyor,
  kaydediliyor,
  kaydetDevreDisi,
  onSilIstegi,
  onKapat,
}) => (
  <div className="p-4.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200/90 dark:border-slate-800 flex items-center justify-between shrink-0">
    <button
      type="button"
      onClick={onSilIstegi}
      disabled={yukleniyor || kaydediliyor}
      className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/40 dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200/90 dark:border-rose-900/80 rounded-xl px-3.5 py-2.5 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs btn-tactile"
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span>Düğümü Sil</span>
    </button>

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onKapat}
        className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 rounded-xl px-4 py-2.5 cursor-pointer transition-all shadow-2xs btn-tactile"
      >
        Kapat
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

export const DrawerFooter: React.FC<DrawerFooterProps> = ({
  yukleniyor,
  kaydediliyor,
  kaydetDevreDisi,
  siliniyor = false,
  onSil,
  onVazgec,
}) => {
  const [onayGoster, setOnayGoster] = useState(false);

  if (onayGoster) {
    return (
      <DeleteConfirmationBar
        siliniyor={siliniyor}
        onOnayla={onSil}
        onIptal={() => setOnayGoster(false)}
      />
    );
  }

  return (
    <DefaultFooterBar
      yukleniyor={yukleniyor}
      kaydediliyor={kaydediliyor}
      kaydetDevreDisi={kaydetDevreDisi}
      onSilIstegi={() => setOnayGoster(true)}
      onKapat={onVazgec}
    />
  );
};
