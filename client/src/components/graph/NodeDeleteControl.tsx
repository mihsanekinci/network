import React, { useState, useRef, useEffect } from "react";
import { Trash2, Check, X } from "lucide-react";

interface NodeDeleteControlProps {
  nodeId: string;
  onDelete?: (id: string) => void;
}

export const NodeDeleteControl: React.FC<NodeDeleteControlProps> = ({
  nodeId,
  onDelete,
}) => {
  const [silOnayAcik, setSilOnayAcik] = useState(false);
  const silOnayKutusuRef = useRef<HTMLDivElement>(null);

  // Ekranda herhangi bir yere tıklandığında veya ESC basıldığında silme onayını kapat
  useEffect(() => {
    if (!silOnayAcik) return;

    const disariTiklandi = (e: MouseEvent) => {
      if (silOnayKutusuRef.current && !silOnayKutusuRef.current.contains(e.target as Node)) {
        setSilOnayAcik(false);
      }
    };

    const tusDinle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSilOnayAcik(false);
      }
    };

    // React Flow canvas stopPropagation yapsa bile capture fazında yakala
    document.addEventListener("mousedown", disariTiklandi, true);
    window.addEventListener("keydown", tusDinle);

    return () => {
      document.removeEventListener("mousedown", disariTiklandi, true);
      window.removeEventListener("keydown", tusDinle);
    };
  }, [silOnayAcik]);

  if (!onDelete) return null;

  if (silOnayAcik) {
    return (
      <div
        ref={silOnayKutusuRef}
        onClick={(e) => e.stopPropagation()}
        className="nodrag nopan absolute -top-3.5 right-0 z-40 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 shadow-md rounded-full px-2 py-0.5 flex items-center gap-1.5 animate-in zoom-in-95 duration-150"
      >
        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 select-none">
          Sil?
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(nodeId);
            setSilOnayAcik(false);
          }}
          className="w-4.5 h-4.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-[10px] shadow-xs cursor-pointer transition-colors"
          title="Evet, Sil"
        >
          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSilOnayAcik(false);
          }}
          className="w-4.5 h-4.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-[10px] cursor-pointer transition-colors"
          title="Vazgeç"
        >
          <X className="w-2.5 h-2.5 stroke-[2]" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setSilOnayAcik(true);
      }}
      title="Düğümü Sil"
      className="nodrag nopan absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center shadow-xs transition-all duration-150 cursor-pointer z-30 active:scale-90"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
};

export default NodeDeleteControl;
