import React, { useEffect, useRef } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  acik: boolean;
  baslik: string;
  ogeAdi?: string;
  aciklama?: string;
  onKapat: () => void;
  onOnayla: () => Promise<void> | void;
  yukleniyor?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  acik,
  baslik,
  ogeAdi,
  aciklama = "Bu işlem geri alınamaz ve ilişkili tüm bağlantılar kalıcı olarak silinir.",
  onKapat,
  onOnayla,
  yukleniyor = false,
}) => {
  const iptalButonRef = useRef<HTMLButtonElement>(null);

  // Modal açıldığında güvenli varsayılan olarak İptal butonuna odaklan (Nielsen #5 Hata Önleme)
  useEffect(() => {
    if (acik) {
      const zamanlayici = setTimeout(() => {
        iptalButonRef.current?.focus();
      }, 50);
      return () => clearTimeout(zamanlayici);
    }
  }, [acik]);

  // ESC ile iptal et
  useEffect(() => {
    if (!acik) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onKapat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [acik, onKapat]);

  if (!acik) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="silme-onay-baslik"
      aria-describedby="silme-onay-aciklama"
      onClick={(e) => {
        if (e.target === e.currentTarget && !yukleniyor) onKapat();
      }}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
    >
      <div className="glass-floating rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-rose-300/60 dark:border-rose-900/80 shadow-2xl animate-in zoom-in-95 duration-150 bg-white dark:bg-slate-900">
        {/* Başlık ve Uyarı İkonu */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-2xs">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="silme-onay-baslik"
              className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight"
            >
              {baslik}
            </h3>
            {ogeAdi && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5 truncate">
                «{ogeAdi}»
              </p>
            )}
            <p
              id="silme-onay-aciklama"
              className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed"
            >
              {aciklama}
            </p>
          </div>
          <button
            type="button"
            onClick={onKapat}
            disabled={yukleniyor}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer btn-tactile disabled:opacity-50"
            title="Kapat (ESC)"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Eylem Butonları */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            ref={iptalButonRef}
            type="button"
            onClick={onKapat}
            disabled={yukleniyor}
            className="h-9 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer btn-tactile disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onOnayla}
            disabled={yukleniyor}
            className="h-9 px-4 text-xs font-bold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 btn-tactile disabled:opacity-50"
          >
            {yukleniyor ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Siliniyor...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Evet, Kalıcı Olarak Sil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
