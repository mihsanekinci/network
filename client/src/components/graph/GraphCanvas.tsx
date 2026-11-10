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
import { useDarkMode } from "../../hooks/useDarkMode";
import CustomNode from "./CustomNode";
import ClusterNode from "./ClusterNode";
import { yerelDugumlerdenKumeDugumleriOlustur } from "./clusterEngine";
import type { DugumKonumu } from "./edgeRouting";
import { useCanvasNodes, useCanvasEdges } from "./useGraphElements";
import {
  GraphNoMapSelected,
  GraphNoNodesCreated,
  GraphPathHighlightBadge,
} from "./GraphEmptyState";

const DUGUM_TURLERI = {
  ozelDugum: CustomNode,
  kumeDugum: ClusterNode,
};

const getMiniMapNodeColor = (node: Node, isDark: boolean): string => {
  if (node.type === "kumeDugum") return isDark ? "rgba(99, 102, 241, 0.45)" : "#e0e7ff";
  const tur = (node.data as { tur?: string })?.tur;
  if (tur === "kisi") return isDark ? "#38bdf8" : "#0284c7";
  if (tur === "kurum") return isDark ? "#34d399" : "#059669";
  if (tur === "kavram") return isDark ? "#fbbf24" : "#d97706";
  return isDark ? "#c084fc" : "#7c3aed";
};

const getMiniMapNodeStroke = (node: Node, isDark: boolean): string => {
  if (node.type === "kumeDugum") return isDark ? "#818cf8" : "#6366f1";
  return isDark ? "rgba(255, 255, 255, 0.4)" : "#ffffff";
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
  const { isDark } = useDarkMode();

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
    isDark,
  });

  const kumeDugumleri = useMemo(() => {
    return yerelDugumlerdenKumeDugumleriOlustur(yerelDugumler);
  }, [yerelDugumler]);

  const tumCanvasDugumleri = useMemo(() => {
    return [...kumeDugumleri, ...yerelDugumler];
  }, [kumeDugumleri, yerelDugumler]);

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
    <div className="flex-1 h-full relative bg-slate-50 dark:bg-slate-950 transition-colors">
      {yukleniyor && (
        <div className="absolute top-4 right-4 z-10 glass-panel px-3 py-1.5 rounded-xl shadow-xs text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-2">
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
        nodes={tumCanvasDugumleri}
        edges={donusturulmusKenarlar}
        nodeTypes={DUGUM_TURLERI}
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode={null}
        onNodesChange={dugumlerDegisti}
        onNodeDragStop={suruklemeBitti}
        onConnect={baglantiKuruldu}
        onEdgeClick={kenaraTiklandi}
        onNodeClick={dugumeTiklandi}
        onPaneClick={paneTiklandi}
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
          color={isDark ? "#334155" : "#cbd5e1"}
        />
        <Controls className="!bg-white/95 dark:!bg-slate-900/95 !rounded-2xl !shadow-xl !border !border-slate-200/90 dark:!border-slate-700/80 !overflow-hidden !m-4 backdrop-blur-md" />
        <MiniMap
          nodeColor={(node) => getMiniMapNodeColor(node, isDark)}
          nodeStrokeColor={(node) => getMiniMapNodeStroke(node, isDark)}
          nodeStrokeWidth={1.5}
          nodeBorderRadius={6}
          maskColor={isDark ? "rgba(2, 6, 23, 0.78)" : "rgba(241, 245, 249, 0.75)"}
          maskStrokeColor={isDark ? "#818cf8" : "#6366f1"}
          maskStrokeWidth={2.5}
          pannable={true}
          zoomable={true}
          ariaLabel="Ağ Haritası Gezgini"
          className="!bg-white/95 dark:!bg-slate-900/95 !rounded-2xl !shadow-xl !border !border-slate-200/90 dark:!border-indigo-500/30 !overflow-hidden !m-4 backdrop-blur-md cursor-grab active:cursor-grabbing hover:border-indigo-400/50 transition-all"
        />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;
