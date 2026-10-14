import React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { DugumTuru } from "../../types";

interface OzelDugumVerisi {
  id: string;
  etiket: string;
  tur: DugumTuru;
  ozellikler?: Record<string, unknown>;
  secili?: boolean;
  eslesiyor?: boolean;
  filtreAktif?: boolean;
  onSil?: (id: string) => void;
}

const TUR_STILLERI: Record<
  DugumTuru,
  { arkaplan: string; kenarlik: string; rozet: string; etiket: string; simge: string }
> = {
  kisi: {
    arkaplan: "bg-blue-50/90 hover:bg-blue-100/90",
    kenarlik: "border-blue-300 hover:border-blue-400",
    rozet: "bg-blue-100 text-blue-700",
    etiket: "Kişi",
    simge: "👤",
  },
  kurum: {
    arkaplan: "bg-emerald-50/90 hover:bg-emerald-100/90",
    kenarlik: "border-emerald-300 hover:border-emerald-400",
    rozet: "bg-emerald-100 text-emerald-700",
    etiket: "Kurum",
    simge: "🏢",
  },
  kavram: {
    arkaplan: "bg-amber-50/90 hover:bg-amber-100/90",
    kenarlik: "border-amber-300 hover:border-amber-400",
    rozet: "bg-amber-100 text-amber-700",
    etiket: "Kavram",
    simge: "💡",
  },
  diger: {
    arkaplan: "bg-purple-50/90 hover:bg-purple-100/90",
    kenarlik: "border-purple-300 hover:border-purple-400",
    rozet: "bg-purple-100 text-purple-700",
    etiket: "Diğer",
    simge: "📌",
  },
};

export const CustomNode: React.FC<NodeProps<OzelDugumVerisi>> = ({ data, id, selected }) => {
  const turBilgisi = TUR_STILLERI[data.tur] ?? TUR_STILLERI.diger;
  const secili = Boolean(selected || data.secili);

  const dugumuSil = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onSil) {
      data.onSil(id);
    }
  };

  const unvan =
    data.tur === "kisi" && typeof data.ozellikler?.unvan === "string"
      ? data.ozellikler.unvan.trim()
      : null;

  const filtreDurumuSinifi = data.filtreAktif
    ? data.eslesiyor
      ? "ring-2 ring-indigo-500 shadow-md scale-[1.02]"
      : "opacity-30 grayscale scale-95"
    : "";

  const seciliSinifi = secili
    ? "border-indigo-600 ring-2 ring-indigo-500 ring-offset-2 shadow-md"
    : `${turBilgisi.kenarlik} shadow-sm`;

  return (
    <div
      className={`min-w-52 px-4.5 py-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${turBilgisi.arkaplan} ${seciliSinifi} ${filtreDurumuSinifi}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-slate-300 hover:!bg-indigo-600 !border-2 !border-white transition-colors"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="sol"
        className="!w-2.5 !h-2.5 !bg-slate-300 hover:!bg-indigo-600 !border-2 !border-white transition-colors"
      />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${turBilgisi.rozet}`}>
          {turBilgisi.simge} {turBilgisi.etiket}
        </span>
        {data.onSil && (
          <button
            type="button"
            onClick={dugumuSil}
            title="Düğümü Sil"
            className="nodrag nopan text-slate-400 hover:text-red-600 w-5 h-5 flex items-center justify-center rounded-md hover:bg-white/80 transition-colors text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      <div className="text-sm font-bold text-slate-800 truncate leading-snug" title={data.etiket}>
        {data.etiket}
      </div>

      {unvan && (
        <div className="text-xs text-slate-500 font-normal truncate mt-0.5 leading-tight" title={unvan}>
          {unvan}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="sag"
        className="!w-2.5 !h-2.5 !bg-slate-300 hover:!bg-indigo-600 !border-2 !border-white transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-slate-300 hover:!bg-indigo-600 !border-2 !border-white transition-colors"
      />
    </div>
  );
};

export default CustomNode;
