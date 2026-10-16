import React from "react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-base">
              ⌨️
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Klavye Kısayolları (Power-User)</h3>
              <p className="text-xs text-slate-500">Hızlı tuval kontrolü ve eylemler</p>
            </div>
          </div>
          <button
            onClick={kapat}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Liste */}
        <div className="p-6 flex flex-col gap-2.5">
          {kisayollar.map((k) => (
            <div
              key={k.aciklama}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between"
            >
              <span className="text-xs font-medium text-slate-700">{k.aciklama}</span>
              <kbd className="px-2.5 py-1 text-[11px] font-mono font-bold text-slate-600 bg-white border border-slate-200 rounded-md shadow-2xs">
                {k.mac}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={kapat}
            className="h-8.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal;
