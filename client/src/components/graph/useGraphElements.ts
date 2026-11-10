import { useMemo } from "react";
import type { Node, Edge } from "reactflow";
import { MarkerType } from "reactflow";
import type { DugumDTO, KenarDTO, DugumTuru } from "../../types";
import {
  type YonTipi,
  type DugumKonumu,
  type KenarUcu,
  slotBelirle,
  yonBelirle,
} from "./edgeRouting";

interface UseCanvasNodesParams {
  dugumler: DugumDTO[];
  secilenDugumId: string | null;
  dugumSil: (id: string) => Promise<boolean>;
  aramaMetni: string;
  secilenTurFiltresi: DugumTuru | "hepsi";
  filtreAktif: boolean;
  yolAktif: boolean;
  vurgulananDugumIdler: Set<string>;
}

export const useCanvasNodes = ({
  dugumler,
  secilenDugumId,
  dugumSil,
  aramaMetni,
  secilenTurFiltresi,
  filtreAktif,
  yolAktif,
  vurgulananDugumIdler,
}: UseCanvasNodesParams): Node[] => {
  return useMemo<Node[]>(() => {
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
};

interface UseCanvasEdgesParams {
  kenarlar: KenarDTO[];
  secilenKenarId: string | null;
  yolAktif: boolean;
  vurgulananKenarIdler: Set<string>;
  dugumKonumHaritasi: Map<string, DugumKonumu>;
}

export const useCanvasEdges = ({
  kenarlar,
  secilenKenarId,
  yolAktif,
  vurgulananKenarIdler,
  dugumKonumHaritasi,
}: UseCanvasEdgesParams): Edge[] => {
  return useMemo<Edge[]>(() => {
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
          renk = "#f59e0b";
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
};
