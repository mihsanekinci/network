import React from "react";
import { Keyboard, X, Command } from "lucide-react";

interface ShortcutsModalProps {
  acik: boolean;
  kapat: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ acik, kapat }) => {
  if (!acik) return null;

  const kisayollar = [
    { tuslar: ["⌘", "K"], mac: "⌘K", win: "Ctrl+K", aciklama: "Kısayollar Kılavuzunu Aç" },
    { tuslar: ["⌘", "B"], mac: "⌘B", win: "Ctrl+B", aciklama: "Kenar Çubuğunu Aç / Kapat" },
    { tuslar: ["⌘", "N"], mac: "⌘N", win: "Ctrl+N", aciklama: "Yeni Düğüm Ekle Modalı" },
    { tuslar: ["⌘", "F"], mac: "⌘F", win: "Ctrl+F", aciklama: "Arama Çubuğuna Odaklan" },
    { tuslar: ["⌘", "D"], mac: "⌘D", win: "Ctrl+D", aciklama: "Otomatik Hizala (Dagre Layout)" },
    { tuslar: ["Delete"], mac: "⌫ / Delete", win: "Delete", aciklama: "Seçili Düğümü veya Kenarı Sil" },
    { tuslar: ["Esc"], mac: "Escape", win: "Escape", aciklama: "Modalları, Paneli veya Vurguyu Kapat" },
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) kapat();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="glass-floating rounded-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Keyboard className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">
                Klavye Kısayolları (Power-User)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Hızlı tuval kontrolü ve eylemler</p>
            </div>
          </div>
          <button
            type="button"
            onClick={kapat}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer btn-tactile"
            title="Kapat (ESC)"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Liste */}
        <div className="p-5 flex flex-col gap-2">
          {kisayollar.map((k) => (
            <div
              key={k.aciklama}
              className="px-3.5 py-2.5 bg-white/80 hover:bg-white border border-slate-200/80 rounded-xl flex items-center justify-between shadow-2xs transition-all"
            >
              <div className="flex items-center gap-2">
                <Command className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">{k.aciklama}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2.5 py-1 text-[11px] font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200/90 rounded-lg shadow-2xs">
                  {k.mac}
                </kbd>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-white/70 flex justify-end">
          <button
            type="button"
            onClick={kapat}
            className="h-8.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer btn-tactile"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
