import dagre from "dagre";
import type { DugumDTO, KenarDTO } from "../types";

export type DuzenYonu = "TB" | "LR";

const DUGUM_GENISLIK = 240;
const DUGUM_YUKSEKLIK = 120;

export function otomatikKonumlandir(
  dugumler: DugumDTO[],
  kenarlar: KenarDTO[],
  yon: DuzenYonu = "TB"
): Array<{ id: string; pozisyonX: number; pozisyonY: number }> {
  if (dugumler.length === 0) return [];

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: yon,
    nodesep: 60,
    ranksep: 80,
    marginx: 50,
    marginy: 50,
  });

  dugumler.forEach((dugum) => {
    dagreGraph.setNode(dugum.id, {
      width: DUGUM_GENISLIK,
      height: DUGUM_YUKSEKLIK,
    });
  });

  kenarlar.forEach((kenar) => {
    if (
      dugumler.some((d) => d.id === kenar.kaynakId) &&
      dugumler.some((d) => d.id === kenar.hedefId)
    ) {
      dagreGraph.setEdge(kenar.kaynakId, kenar.hedefId);
    }
  });

  dagre.layout(dagreGraph);

  return dugumler.map((dugum) => {
    const dugumKonumu = dagreGraph.node(dugum.id);
    // React Flow sol üst köşeyi referans alır; Dagre merkez koordinat verir
    return {
      id: dugum.id,
      pozisyonX: Math.round(dugumKonumu.x - DUGUM_GENISLIK / 2),
      pozisyonY: Math.round(dugumKonumu.y - DUGUM_YUKSEKLIK / 2),
    };
  });
}
