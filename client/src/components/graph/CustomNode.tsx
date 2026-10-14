import React, { useMemo } from "react";
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
  { kenarlik: string; rozet: string; etiket: string; simge: string }
> = {
  kisi: {
    kenarlik: "border-blue-200 hover:border-blue-300",
    rozet: "bg-blue-50 text-blue-700 border border-blue-200/70",
    etiket: "Kişi",
    simge: "👤",
  },
  kurum: {
    kenarlik: "border-emerald-200 hover:border-emerald-300",
    rozet: "bg-emerald-50 text-emerald-700 border border-emerald-200/70",
    etiket: "Kurum",
    simge: "🏢",
  },
  kavram: {
    kenarlik: "border-amber-200 hover:border-amber-300",
    rozet: "bg-amber-50 text-amber-700 border border-amber-200/70",
    etiket: "Kavram",
    simge: "💡",
  },
  diger: {
    kenarlik: "border-purple-200 hover:border-purple-300",
    rozet: "bg-purple-50 text-purple-700 border border-purple-200/70",
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

  const altBilgi = useMemo(() => {
    if (data.tur === "kisi") {
      const unvan =
        typeof data.ozellikler?.unvan === "string" ? data.ozellikler.unvan.trim() : "";
      const sirket =
        typeof data.ozellikler?.sirket === "string" ? data.ozellikler.sirket.trim() : "";
      if (unvan && sirket) return `${unvan} • ${sirket}`;
      if (unvan) return unvan;
      if (sirket) return sirket;
    }
    if (data.tur === "kurum") {
      const sektor =
        typeof data.ozellikler?.sektor === "string" ? data.ozellikler.sektor.trim() : "";
      if (sektor) return sektor;
    }
    if (data.tur === "kavram") {
      const aciklama =
        typeof data.ozellikler?.aciklama === "string" ? data.ozellikler.aciklama.trim() : "";
      if (aciklama) return aciklama;
    }
    return null;
  }, [data.tur, data.ozellikler]);

  const filtreDisi = Boolean(data.filtreAktif && !data.eslesiyor);
  const filtreEslesiyor = Boolean(data.filtreAktif && data.eslesiyor);

  // Durum tabanlı sınıf belirleme
  let durumSinifi = turBilgisi.kenarlik;

  if (filtreDisi) {
    durumSinifi =
      "border-slate-200 opacity-30 grayscale-[60%] [filter:grayscale(60%)] scale-95 pointer-events-none !shadow-none";
  } else if (secili) {
    durumSinifi = "border-indigo-600 ring-4 ring-indigo-500/20 shadow-lg scale-[1.02] z-10";
  } else if (filtreEslesiyor) {
    durumSinifi = `${turBilgisi.kenarlik} ring-2 ring-indigo-500/40 shadow-md scale-[1.01]`;
  }

  // Bağlantı noktaları (Handles) sınıfları: normalde gizli, hover veya seçim durumunda görünür
  const handleSinifi = `!w-2.5 !h-2.5 !bg-indigo-500 !border-2 !border-white shadow-sm transition-opacity duration-150 ${
    secili ? "!opacity-100" : "opacity-0 group-hover:opacity-100"
  }`;

  return (
    <div
      className={`min-w-56 max-w-72 p-4 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all duration-200 relative group flex flex-col gap-2 cursor-pointer ${durumSinifi}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={handleSinifi}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="sol"
        className={handleSinifi}
      />

      {/* Silme Butonu (Sağ üst köşe) */}
      {data.onSil && (
        <button
          type="button"
          onClick={dugumuSil}
          title="Düğümü Sil"
          className="absolute top-3 right-3 nodrag nopan opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Tür Rozeti */}
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full self-start flex items-center gap-1.5 ${turBilgisi.rozet}`}
      >
        <span>{turBilgisi.simge}</span>
        <span>{turBilgisi.etiket}</span>
      </span>

      {/* Düğüm Adı (Etiket) */}
      <div
        className="text-sm font-bold text-slate-800 leading-snug break-words line-clamp-2"
        title={data.etiket}
      >
        {data.etiket}
      </div>

      {/* Unvan / Rol / Ek Bilgi */}
      {altBilgi && (
        <div
          className="text-xs text-slate-500 font-medium truncate flex items-center gap-1.5"
          title={altBilgi}
        >
          <svg
            className="w-3.5 h-3.5 text-slate-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate">{altBilgi}</span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="sag"
        className={handleSinifi}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={handleSinifi}
      />
    </div>
  );
};

export default CustomNode;
