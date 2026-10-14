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
    secilenDugumId,
    secilenDugumuAyarla,
    dugumler,
    kenarlar,
    kenarEkle,
    kenarSil,
    dugumGuncelle,
    dugumSil,
    yukleniyor,
    aramaMetni,
    secilenTurFiltresi,
  } = useHaritaStore();

  const [yerelDugumler, setYerelDugumler] = useState<Node[]>([]);

  const filtreAktif = aramaMetni.trim() !== "" || secilenTurFiltresi !== "hepsi";

  // Düğümleri React Flow formatına dönüştür
  const donusturulmusDugumler = useMemo<Node[]>(() => {
    const arama = aramaMetni.trim().toLocaleLowerCase("tr");

    return dugumler.map((d) => {
      const turUyuyor = secilenTurFiltresi === "hepsi" || d.tur === secilenTurFiltresi;
      let metinUyuyor = true;
      if (arama) {
        const etiketVar = d.etiket.toLocaleLowerCase("tr").includes(arama);
        const unvanVar =
          typeof d.ozellikler?.unvan === "string" &&
          d.ozellikler.unvan.toLocaleLowerCase("tr").includes(arama);
        const sirketVar =
          typeof d.ozellikler?.sirket === "string" &&
          d.ozellikler.sirket.toLocaleLowerCase("tr").includes(arama);
        const notlarVar =
          typeof d.ozellikler?.notlar === "string" &&
          d.ozellikler.notlar.toLocaleLowerCase("tr").includes(arama);
        const aciklamaVar =
          typeof d.ozellikler?.aciklama === "string" &&
          d.ozellikler.aciklama.toLocaleLowerCase("tr").includes(arama);
        metinUyuyor = Boolean(etiketVar || unvanVar || sirketVar || notlarVar || aciklamaVar);
      }
      const eslesiyor = turUyuyor && metinUyuyor;

      return {
        id: d.id,
        type: "ozelDugum",
        selected: d.id === secilenDugumId,
        position: { x: d.pozisyonX, y: d.pozisyonY },
        data: {
          id: d.id,
          etiket: d.etiket,
          tur: d.tur,
          ozellikler: d.ozellikler,
          secili: d.id === secilenDugumId,
          eslesiyor,
          filtreAktif,
          onSil: dugumSil,
        },
      };
    });
  }, [dugumler, secilenDugumId, dugumSil, aramaMetni, secilenTurFiltresi, filtreAktif]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Düğüme tıklandığında detay panelini aç
  const dugumeTiklandi = useCallback(
    (_etkinlik: React.MouseEvent, dugum: Node) => {
      secilenDugumuAyarla(dugum.id);
    },
    [secilenDugumuAyarla]
  );

  // Tuvaldeki boş alana tıklandığında seçimi kaldır
  const paneTiklandi = useCallback(() => {
    secilenDugumuAyarla(null);
  }, [secilenDugumuAyarla]);

  if (!secilenHaritaId) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-slate-50 text-slate-500 p-8 text-center select-none relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-indigo-50/50 blur-3xl pointer-events-none" />
        <div className="relative bg-white/90 backdrop-blur-md px-10 py-9 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-3xl shadow-sm">
            🗺️
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Harita Seçilmedi</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Sol panelden mevcut bir haritayı seçin veya <strong className="font-semibold text-indigo-600">+ Yeni Harita</strong> butonuna tıklayarak ilk haritanızı oluşturun.
          </p>
        </div>
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
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 text-center p-6 select-none">
          <div className="bg-white/90 backdrop-blur-md px-8 py-7 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 max-w-sm mx-auto">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-indigo-50 to-indigo-100 border border-indigo-200/60 flex items-center justify-center text-indigo-600 text-2xl shadow-sm">
              ✨
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">Bu Haritada Henüz Düğüm Yok</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Ağınızı oluşturmaya başlamak için yukarıdaki <strong className="font-semibold text-indigo-600">+ Düğüm Ekle</strong> butonunu kullanarak kişi, şirket veya kavram ekleyin.
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">👤 Kişi</span>
              <span>•</span>
              <span className="flex items-center gap-1">🏢 Kurum</span>
              <span>•</span>
              <span className="flex items-center gap-1">💡 Kavram</span>
            </div>
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
