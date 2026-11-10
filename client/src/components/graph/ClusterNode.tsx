import React from "react";
import type { NodeProps } from "reactflow";
import { Layers } from "lucide-react";
import type { KumeKutusuVerisi } from "./clusterEngine";

export const ClusterNode: React.FC<NodeProps<KumeKutusuVerisi>> = ({ data }) => {
  const { kumeAdi, dugumSayisi, tema, genislik, yukseklik } = data;

  return (
    <div
      style={{ width: `${genislik}px`, height: `${yukseklik}px` }}
      className={`rounded-3xl border-2 border-dashed ${tema.borderClass} ${tema.bgClass} relative pointer-events-none transition-all duration-200 select-none`}
    >
      {/* Küme Başlık Şeridi */}
      <div className="absolute -top-3.5 left-5 pointer-events-auto">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold border shadow-xs backdrop-blur-md ${tema.badgeClass} transition-colors`}
        >
          <Layers className="w-3.5 h-3.5 stroke-[2.2]" style={{ color: tema.hex }} />
          <span className="tracking-tight">{kumeAdi}</span>
          <span className="text-[10px] font-semibold opacity-75 bg-white/60 dark:bg-black/30 px-1.5 py-0.5 rounded-md">
            {dugumSayisi}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClusterNode;
