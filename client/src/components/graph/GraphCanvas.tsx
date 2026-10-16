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
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import { useHaritaStore } from "../../store/haritaStore";
import CustomNode from "./CustomNode";

const DUGUM_TURLERI = {
  ozelDugum: CustomNode,
};

type YonTipi = "ust" | "sag" | "alt" | "sol";

interface DugumKonumu {
  x: number;
  y: number;
}

interface KenarUcu {
  kenarId: string;
  rol: "kaynak" | "hedef";
  karsiKonum: DugumKonumu;
}

const slotBelirle = (sira: number, toplam: number): number => {
  if (toplam <= 1) return 3;
  if (toplam === 2) {
    const slotlar = [2, 4];
    return slotlar[sira % 2];
  }
  if (toplam === 3) {
    const slotlar = [1, 3, 5];
    return slotlar[sira % 3];
  }
  if (toplam === 4) {
    const slotlar = [1, 2, 4, 5];
    return slotlar[sira % 4];
  }
  return (sira % 5) + 1;
};

const yonBelirle = (
  kaynakId: string,
  hedefId: string,
  kaynak: DugumKonumu,
  hedef: DugumKonumu
): { kaynakYon: YonTipi; hedefYon: YonTipi } => {
  if (kaynakId === hedefId) {
    return { kaynakYon: "sag", hedefYon: "ust" };
  }

  const dx = hedef.x - kaynak.x;
  const dy = hedef.y - kaynak.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { kaynakYon: "sag", hedefYon: "sol" }
      : { kaynakYon: "sol", hedefYon: "sag" };
  }
  return dy >= 0
    ? { kaynakYon: "alt", hedefYon: "ust" }
    : { kaynakYon: "ust", hedefYon: "alt" };
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
  } = useHaritaStore();

  const [yerelDugumler, setYerelDugumler] = useState<Node[]>([]);

  const filtreAktif = aramaMetni.trim() !== "" || secilenTurFiltresi !== "hepsi";
  const yolAktif = vurgulananDugumIdler.size > 0;

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
          yolAktif,
          yolParcasi: vurgulananDugumIdler.has(d.id),
          onSil: dugumSil,
        },
      };
    });
  }, [
    dugumler,
    secilenDugumId,
    dugumSil,
    aramaMetni,
    secilenTurFiltresi,
    filtreAktif,
    yolAktif,
    vurgulananDugumIdler,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYerelDugumler(donusturulmusDugumler);
  }, [donusturulmusDugumler]);

  // Düğüm konum haritası
  const dugumKonumHaritasi = useMemo(() => {
    const harita = new Map<string, DugumKonumu>();
    for (const d of yerelDugumler) {
      harita.set(d.id, { x: d.position.x, y: d.position.y });
    }
    return harita;
  }, [yerelDugumler]);

  // Kenarları React Flow formatına dönüştür ve bağlantı noktalarını dağıt
  const donusturulmusKenarlar = useMemo<Edge[]>(() => {
    // 1. Adım: Her kenar için ideal yönleri belirle
    const kenarYonleri = kenarlar.map((k) => {
      const kaynakKonum = dugumKonumHaritasi.get(k.kaynakId) ?? { x: 0, y: 0 };
      const hedefKonum = dugumKonumHaritasi.get(k.hedefId) ?? { x: 200, y: 0 };
      const { kaynakYon, hedefYon } = yonBelirle(
        k.kaynakId,
        k.hedefId,
        kaynakKonum,
        hedefKonum
      );
      return { kenar: k, kaynakKonum, hedefKonum, kaynakYon, hedefYon };
    });

    // 2. Adım: Her düğümün her bir yüzeyine bağlanan tüm uçları (kaynak veya hedef) topla
    const baglantiNoktalari = new Map<string, KenarUcu[]>();
    for (const item of kenarYonleri) {
      const kAnahtar = `${item.kenar.kaynakId}:::${item.kaynakYon}`;
      const kListe = baglantiNoktalari.get(kAnahtar) ?? [];
      kListe.push({
        kenarId: item.kenar.id,
        rol: "kaynak",
        karsiKonum: item.hedefKonum,
      });
      baglantiNoktalari.set(kAnahtar, kListe);

      const hAnahtar = `${item.kenar.hedefId}:::${item.hedefYon}`;
      const hListe = baglantiNoktalari.get(hAnahtar) ?? [];
      hListe.push({
        kenarId: item.kenar.id,
        rol: "hedef",
        karsiKonum: item.kaynakKonum,
      });
      baglantiNoktalari.set(hAnahtar, hListe);
    }

    // 3. Adım: Çakışmaları ve kesişmeleri önlemek için her yöndeki uçları karşı konuma göre sırala ve slot ata
    const atananSlotlar = new Map<string, number>();

    for (const [anahtar, liste] of baglantiNoktalari.entries()) {
      const [, yon] = anahtar.split(":::") as [string, YonTipi];
      const sirali = [...liste].sort((a, b) => {
        if (yon === "sag" || yon === "sol") {
          const fark = a.karsiKonum.y - b.karsiKonum.y;
          if (fark !== 0) return fark;
        } else {
          const fark = a.karsiKonum.x - b.karsiKonum.x;
          if (fark !== 0) return fark;
        }
        return a.kenarId.localeCompare(b.kenarId);
      });

      const toplam = sirali.length;
      sirali.forEach((item, sira) => {
        const slot = slotBelirle(sira, toplam);
        atananSlotlar.set(`${item.kenarId}:::${item.rol}`, slot);
      });
    }

    return kenarYonleri.map(({ kenar: k, kaynakYon, hedefYon }) => {
      const kaynakSlot = atananSlotlar.get(`${k.id}:::kaynak`) ?? 3;
      const hedefSlot = atananSlotlar.get(`${k.id}:::hedef`) ?? 3;

      const sourceHandle = `${kaynakYon}-kaynak-${kaynakSlot}`;
      const targetHandle = `${hedefYon}-hedef-${hedefSlot}`;

      const yolKenari = vurgulananKenarIdler.has(k.id);
      const secili = k.id === secilenKenarId;

      let renk = secili ? "#4f46e5" : "#6366f1";
      let strokeWidth = secili ? 3 : 1.75;
      let animated = k.yon === "tek_yonlu";

      if (yolAktif) {
        if (yolKenari) {
          renk = "#f59e0b"; // Altın/amber vurgusu
          strokeWidth = 3.5;
          animated = true;
        } else {
          renk = "#cbd5e1";
          strokeWidth = 1;
          animated = false;
        }
      }

      const markerEnd: Edge["markerEnd"] =
        k.yon === "yonsuz"
          ? undefined
          : {
              type: MarkerType.ArrowClosed,
              color: renk,
            };

      const markerStart: Edge["markerStart"] =
        k.yon === "cift_yonlu"
          ? {
              type: MarkerType.ArrowClosed,
              color: renk,
            }
          : undefined;

      return {
        id: k.id,
        source: k.kaynakId,
        target: k.hedefId,
        sourceHandle,
        targetHandle,
        selected: secili,
        label: k.etiket || undefined,
        animated,
        markerStart,
        markerEnd,
        style: {
          stroke: renk,
          strokeWidth,
        },
        labelStyle: {
          fill: yolAktif && yolKenari ? "#b45309" : "#1e293b",
          fontWeight: 700,
          fontSize: 11,
        },
        labelBgStyle: {
          fill: "#ffffff",
          fillOpacity: 0.95,
          stroke: yolAktif && yolKenari ? "#f59e0b" : secili ? "#4f46e5" : "#cbd5e1",
          strokeWidth: yolAktif && yolKenari ? 2 : 1.5,
        },
        labelBgPadding: [8, 5] as [number, number],
        labelBgBorderRadius: 8,
      };
    });
  }, [
    kenarlar,
    secilenKenarId,
    yolAktif,
    vurgulananKenarIdler,
    dugumKonumHaritasi,
  ]);

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

  // Kenara tıklandığında düzenleme modalını aç
  const kenaraTiklandi = useCallback(
    (_etkinlik: React.MouseEvent, kenar: Edge) => {
      secilenKenariAyarla(kenar.id);
    },
    [secilenKenariAyarla]
  );

  // Düğüme tıklandığında detay panelini aç
  const dugumeTiklandi = useCallback(
    (_etkinlik: React.MouseEvent, dugum: Node) => {
      secilenKenariAyarla(null);
      secilenDugumuAyarla(dugum.id);
    },
    [secilenDugumuAyarla, secilenKenariAyarla]
  );

  // Tuvaldeki boş alana tıklandığında seçimi kaldır
  const paneTiklandi = useCallback(() => {
    secilenDugumuAyarla(null);
    secilenKenariAyarla(null);
  }, [secilenDugumuAyarla, secilenKenariAyarla]);

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

      {/* Rota Vurgulama Aktif Uyarısı */}
      {yolAktif && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-slate-900/90 text-white rounded-full shadow-xl backdrop-blur-md flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-amber-400">✨</span>
            <span>İlişki Rotası Vurgulandı ({vurgulananDugumIdler.size} Düğüm)</span>
          </span>
          <button
            onClick={yolVurgusunuTemizle}
            className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] transition-colors cursor-pointer"
          >
            Vurguyu Temizle ✕
          </button>
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
