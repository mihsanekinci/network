import React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { DugumTuru } from "../../types";

interface OzelDugumVerisi {
  id: string;
  etiket: string;
  tur: DugumTuru;
  ozellikler?: Record<string, unknown>;
  onSil?: (id: string) => void;
}

const TUR_STILLERI: Record<DugumTuru, { arkaplan: string; kenarlik: string; rozet: string; etiket: string; simge: string }> = {
  kisi: {
    arkaplan: "bg-blue-50 hover:bg-blue-100",
    kenarlik: "border-blue-400",
    rozet: "bg-blue-100 text-blue-700",
    etiket: "Kişi",
    simge: "👤",
  },
  kurum: {
    arkaplan: "bg-emerald-50 hover:bg-emerald-100",
    kenarlik: "border-emerald-400",
    rozet: "bg-emerald-100 text-emerald-700",
    etiket: "Kurum",
    simge: "🏢",
  },
  kavram: {
    arkaplan: "bg-amber-50 hover:bg-amber-100",
    kenarlik: "border-amber-400",
    rozet: "bg-amber-100 text-amber-700",
    etiket: "Kavram",
    simge: "💡",
  },
  diger: {
    arkaplan: "bg-purple-50 hover:bg-purple-100",
    kenarlik: "border-purple-400",
    rozet: "bg-purple-100 text-purple-700",
    etiket: "Diğer",
    simge: "📌",
  },
};

export const CustomNode: React.FC<NodeProps<OzelDugumVerisi>> = ({ data, id }) => {
  const turBilgisi = TUR_STILLERI[data.tur] ?? TUR_STILLERI.diger;

  const dugumuSil = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onSil) {
      data.onSil(id);
    }
  };

  return (
    <div
      className={`min-w-44 px-4 py-3 rounded-xl border-2 shadow-sm transition-all duration-150 ${turBilgisi.arkaplan} ${turBilgisi.kenarlik}`}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-slate-400 hover:!bg-indigo-600" />
      <Handle type="target" position={Position.Left} id="sol" className="!w-3 !h-3 !bg-slate-400 hover:!bg-indigo-600" />

      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${turBilgisi.rozet}`}>
          {turBilgisi.simge} {turBilgisi.etiket}
        </span>
        {data.onSil && (
          <button
            onClick={dugumuSil}
            title="Düğümü Sil"
            className="text-slate-400 hover:text-red-600 text-xs px-1 rounded transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="font-semibold text-slate-800 text-sm truncate" title={data.etiket}>
        {data.etiket}
      </div>

      <Handle type="source" position={Position.Right} id="sag" className="!w-3 !h-3 !bg-slate-400 hover:!bg-indigo-600" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-400 hover:!bg-indigo-600" />
    </div>
  );
};

export default CustomNode;
