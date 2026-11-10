import React, { useCallback, useMemo, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
  type NodeChange,
  applyNodeChanges,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import { Loader2 } from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";
import CustomNode from "./CustomNode";
import type { DugumKonumu } from "./edgeRouting";
import { useCanvasNodes, useCanvasEdges } from "./useGraphElements";
import {
  GraphNoMapSelected,
  GraphNoNodesCreated,
  GraphPathHighlightBadge,
} from "./GraphEmptyState";

const DUGUM_TURLERI = {
  ozelDugum: CustomNode,
};

export const GraphCanvas: React.FC = () => {
  const {
    secilenHaritaId,
    secilenDugumId,
    secilenDugumuAyarla,
    secilenKenarId,
    secilenKenariAyarla,
    dugumler,
    kenarlar,
    kenarEkle,
    dugumGuncelle,
    dugumSil,
    yukleniyor,
    aramaMetni,
    secilenTurFiltresi,
    vurgulananDugumIdler,
    vurgulananKenarIdler,
    yolVurgusunuTemizle,
    otomatikDuzenlemeDurumunuSifirla,
  } = useHaritaStore();

  const [yerelDugumler, setYerelDugumler] = useState<Node[]>([]);

  const filtreAktif = aramaMetni.trim() !== "" || secilenTurFiltresi !== "hepsi";
  const yolAktif = vurgulananDugumIdler.size > 0;

  const donusturulmusDugumler = useCanvasNodes({
    dugumler,
    secilenDugumId,
    dugumSil,
    aramaMetni,
    secilenTurFiltresi,
    filtreAktif,
    yolAktif,
    vurgulananDugumIdler,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYerelDugumler(donusturulmusDugumler);
  }, [donusturulmusDugumler]);

  const dugumKonumHaritasi = useMemo(() => {
    const harita = new Map<string, DugumKonumu>();
    for (const d of yerelDugumler) {
      harita.set(d.id, { x: d.position.x, y: d.position.y });
    }
    return harita;
  }, [yerelDugumler]);

  const donusturulmusKenarlar = useCanvasEdges({
    kenarlar,
    secilenKenarId,
    yolAktif,
    vurgulananKenarIdler,
    dugumKonumHaritasi,
  });

  const dugumlerDegisti = useCallback((degisiklikler: NodeChange[]) => {
    setYerelDugumler((mevcut) => applyNodeChanges(degisiklikler, mevcut));
  }, []);

  const suruklemeBitti = useCallback(
    (_etkinlik: React.MouseEvent, dugum: Node) => {
      otomatikDuzenlemeDurumunuSifirla();
      dugumGuncelle(dugum.id, {
        pozisyonX: Math.round(dugum.position.x),
        pozisyonY: Math.round(dugum.position.y),
      });
    },
    [dugumGuncelle, otomatikDuzenlemeDurumunuSifirla]
  );

  const baglantiKuruldu = useCallback(
    async (baglanti: Connection) => {
      if (!secilenHaritaId || !baglanti.source || !baglanti.target) return;
      const yeniKenar = await kenarEkle({
        haritaId: secilenHaritaId,
        kaynakId: baglanti.source,
        hedefId: baglanti.target,
        yon: "tek_yonlu",
      });
      if (yeniKenar) {
        secilenKenariAyarla(yeniKenar.id);
      }
    },
    [secilenHaritaId, kenarEkle, secilenKenariAyarla]
  );

  const kenaraTiklandi = useCallback(
    (_etkinlik: React.MouseEvent, kenar: Edge) => {
      secilenKenariAyarla(kenar.id);
    },
    [secilenKenariAyarla]
  );

  const dugumeTiklandi = useCallback(
    (_etkinlik: React.MouseEvent, dugum: Node) => {
      secilenKenariAyarla(null);
      secilenDugumuAyarla(dugum.id);
    },
    [secilenDugumuAyarla, secilenKenariAyarla]
  );

  const paneTiklandi = useCallback(() => {
    secilenDugumuAyarla(null);
    secilenKenariAyarla(null);
  }, [secilenDugumuAyarla, secilenKenariAyarla]);

  if (!secilenHaritaId) {
    return <GraphNoMapSelected />;
  }

  return (
    <div className="flex-1 h-full relative bg-slate-50">
      {yukleniyor && (
        <div className="absolute top-4 right-4 z-10 glass-panel px-3 py-1.5 rounded-xl shadow-xs text-xs text-indigo-600 font-medium flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Senkronize ediliyor...</span>
        </div>
      )}

      {yolAktif && (
        <GraphPathHighlightBadge
          sayi={vurgulananDugumIdler.size}
          onTemizle={yolVurgusunuTemizle}
        />
      )}

      {yerelDugumler.length === 0 && !yukleniyor && <GraphNoNodesCreated />}

      <ReactFlow
        nodes={yerelDugumler}
        edges={donusturulmusKenarlar}
        nodeTypes={DUGUM_TURLERI}
        connectionMode={ConnectionMode.Loose}
        onNodesChange={dugumlerDegisti}
        onNodeDragStop={suruklemeBitti}
        onConnect={baglantiKuruldu}
        onEdgeClick={kenaraTiklandi}
        onNodeClick={dugumeTiklandi}
        onPaneClick={paneTiklandi}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#cbd5e1" />
        <Controls className="!bg-white !rounded-2xl !shadow-md !border !border-slate-200 !overflow-hidden !m-4" />
        <MiniMap
          nodeColor={(node) => {
            const tur = (node.data as { tur?: string })?.tur;
            if (tur === "kisi") return "#3b82f6";
            if (tur === "kurum") return "#10b981";
            if (tur === "kavram") return "#f59e0b";
            return "#8b5cf6";
          }}
          nodeStrokeColor="#ffffff"
          nodeStrokeWidth={2}
          nodeBorderRadius={8}
          maskColor="rgba(241, 245, 249, 0.75)"
          className="!bg-white !rounded-2xl !shadow-md !border !border-slate-200 !overflow-hidden !m-4"
        />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;
