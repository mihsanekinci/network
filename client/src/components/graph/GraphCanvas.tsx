import React, { useCallback, useMemo, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Node,
  type Edge,
  MarkerType,
  BackgroundVariant,
  type NodeChange,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useHaritaStore } from "../../store/haritaStore";
import CustomNode from "./CustomNode";

const DUGUM_TURLERI = {
  ozelDugum: CustomNode,
};

export const GraphCanvas: React.FC = () => {
  const {
    secilenHaritaId,
    dugumler,
    kenarlar,
    kenarEkle,
    kenarSil,
    dugumGuncelle,
    dugumSil,
    yukleniyor,
  } = useHaritaStore();

  const [yerelDugumler, setYerelDugumler] = useState<Node[]>([]);

  // Düğümleri React Flow formatına dönüştür
  const donusturulmusDugumler = useMemo<Node[]>(() => {
    return dugumler.map((d) => ({
      id: d.id,
      type: "ozelDugum",
      position: { x: d.pozisyonX, y: d.pozisyonY },
      data: {
        id: d.id,
        etiket: d.etiket,
        tur: d.tur,
        ozellikler: d.ozellikler,
        onSil: dugumSil,
      },
    }));
  }, [dugumler, dugumSil]);

  useEffect(() => {
    setYerelDugumler(donusturulmusDugumler);
  }, [donusturulmusDugumler]);

  // Kenarları React Flow formatına dönüştür
  const donusturulmusKenarlar = useMemo<Edge[]>(() => {
    return kenarlar.map((k) => ({
      id: k.id,
      source: k.kaynakId,
      target: k.hedefId,
      label: k.etiket ?? undefined,
      animated: k.yon === "tek_yonlu",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#6366f1",
      },
      style: {
        stroke: "#6366f1",
        strokeWidth: 2,
      },
      labelStyle: {
        fill: "#475569",
        fontWeight: 600,
        fontSize: 12,
      },
      labelBgStyle: {
        fill: "#f8fafc",
        fillOpacity: 0.9,
      },
    }));
  }, [kenarlar]);

  // Sürükleme durumunda yerel konumu güncelle
  const dugumlerDegisti = useCallback((degisiklikler: NodeChange[]) => {
    setYerelDugumler((mevcut) => applyNodeChanges(degisiklikler, mevcut));
  }, []);

  // Sürükleme bittiğinde backend ve store'a kalıcı kaydet
  const suruklemeBitti = useCallback(
    (_etkinlik: React.MouseEvent, dugum: Node) => {
      dugumGuncelle(dugum.id, {
        pozisyonX: Math.round(dugum.position.x),
        pozisyonY: Math.round(dugum.position.y),
      });
    },
    [dugumGuncelle]
  );

  // İki düğüm arasında yeni kenar bağlantısı kurma
  const baglantiKuruldu = useCallback(
    (baglanti: Connection) => {
      if (!secilenHaritaId || !baglanti.source || !baglanti.target) return;
      kenarEkle({
        haritaId: secilenHaritaId,
        kaynakId: baglanti.source,
        hedefId: baglanti.target,
        yon: "tek_yonlu",
      });
    },
    [secilenHaritaId, kenarEkle]
  );

  // Kenara tıklandığında silme onayı
  const kenaraTiklandi = useCallback(
    (_etkinlik: React.MouseEvent, kenar: Edge) => {
      const onay = window.confirm("Bu bağlantıyı silmek istediğinizden emin misiniz?");
      if (onay) {
        kenarSil(kenar.id);
      }
    },
    [kenarSil]
  );

  if (!secilenHaritaId) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-slate-50 text-slate-500 p-8 text-center select-none">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl shadow-sm">
          🗺️
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Harita Seçilmedi</h2>
        <p className="max-w-md text-sm text-slate-600">
          Sol panelden mevcut bir haritayı seçin veya <strong>"+ Yeni Harita"</strong> butonuna tıklayarak ilk haritanızı oluşturun.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full relative bg-slate-50">
      {yukleniyor && (
        <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-xs text-indigo-600 font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          Senkronize ediliyor...
        </div>
      )}

      {yerelDugumler.length === 0 && !yukleniyor && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 text-center p-6">
          <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-slate-200 shadow-sm max-w-sm">
            <span className="text-2xl mb-2 block">✨</span>
            <p className="text-sm font-semibold text-slate-700">Bu haritada henüz düğüm yok</p>
            <p className="text-xs text-slate-500 mt-1">
              Yukarıdaki <strong>"+ Düğüm Ekle"</strong> butonunu kullanarak kişi, şirket veya kavram ekleyin.
            </p>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={yerelDugumler}
        edges={donusturulmusKenarlar}
        nodeTypes={DUGUM_TURLERI}
        onNodesChange={dugumlerDegisti}
        onNodeDragStop={suruklemeBitti}
        onConnect={baglantiKuruldu}
        onEdgeClick={kenaraTiklandi}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#cbd5e1" />
        <Controls className="!bg-white !border-slate-200 !shadow-sm !rounded-xl overflow-hidden" />
        <MiniMap
          nodeColor={(node) => {
            const tur = (node.data as { tur?: string })?.tur;
            if (tur === "kisi") return "#60a5fa";
            if (tur === "kurum") return "#34d399";
            if (tur === "kavram") return "#fbbf24";
            return "#c084fc";
          }}
          className="!bg-white !border-slate-200 !shadow-sm !rounded-xl overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;
