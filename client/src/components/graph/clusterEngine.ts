import type { Node } from "reactflow";

export interface KumeRenkTemasi {
  id: string;
  ad: string;
  borderClass: string;
  bgClass: string;
  badgeClass: string;
  textClass: string;
  hex: string;
}

export const KUME_RENKLERI: KumeRenkTemasi[] = [
  {
    id: "indigo",
    ad: "İndigo",
    borderClass: "border-indigo-400/50 dark:border-indigo-500/40",
    bgClass: "bg-indigo-500/5 dark:bg-indigo-500/10",
    badgeClass: "bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    textClass: "text-indigo-700 dark:text-indigo-300",
    hex: "#6366f1",
  },
  {
    id: "emerald",
    ad: "Zümrüt",
    borderClass: "border-emerald-400/50 dark:border-emerald-500/40",
    bgClass: "bg-emerald-500/5 dark:bg-emerald-500/10",
    badgeClass: "bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    textClass: "text-emerald-700 dark:text-emerald-300",
    hex: "#10b981",
  },
  {
    id: "amber",
    ad: "Kehribar",
    borderClass: "border-amber-400/50 dark:border-amber-500/40",
    bgClass: "bg-amber-500/5 dark:bg-amber-500/10",
    badgeClass: "bg-amber-100/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    textClass: "text-amber-800 dark:text-amber-300",
    hex: "#f59e0b",
  },
  {
    id: "violet",
    ad: "Mor",
    borderClass: "border-violet-400/50 dark:border-violet-500/40",
    bgClass: "bg-violet-500/5 dark:bg-violet-500/10",
    badgeClass: "bg-violet-100/90 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    textClass: "text-violet-700 dark:text-violet-300",
    hex: "#8b5cf6",
  },
  {
    id: "rose",
    ad: "Gül",
    borderClass: "border-rose-400/50 dark:border-rose-500/40",
    bgClass: "bg-rose-500/5 dark:bg-rose-500/10",
    badgeClass: "bg-rose-100/90 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    textClass: "text-rose-700 dark:text-rose-300",
    hex: "#f43f5e",
  },
  {
    id: "cyan",
    ad: "Camgöbeği",
    borderClass: "border-cyan-400/50 dark:border-cyan-500/40",
    bgClass: "bg-cyan-500/5 dark:bg-cyan-500/10",
    badgeClass: "bg-cyan-100/90 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    textClass: "text-cyan-700 dark:text-cyan-300",
    hex: "#06b6d4",
  },
];

export const kumeRengiBelirle = (kumeAdi: string): KumeRenkTemasi => {
  let hash = 0;
  for (let i = 0; i < kumeAdi.length; i++) {
    hash = (hash << 5) - hash + kumeAdi.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % KUME_RENKLERI.length;
  return KUME_RENKLERI[index];
};

const DUGUM_GENISLIK = 240;
const DUGUM_YUKSEKLIK = 100;
const DOLGU_YATAY = 28;
const DOLGU_UST = 42;
const DOLGU_ALT = 24;

export interface KumeKutusuVerisi {
  kumeAdi: string;
  dugumSayisi: number;
  tema: KumeRenkTemasi;
  genislik: number;
  yukseklik: number;
}

export interface KumelenebilirKonum {
  id: string;
  x: number;
  y: number;
  kume: string;
}

export const dugumlerdenKumeleriCikar = (dugumler: Node[]): Map<string, KumelenebilirKonum[]> => {
  const gruplar = new Map<string, KumelenebilirKonum[]>();
  for (const d of dugumler) {
    if (d.type !== "ozelDugum") continue;
    const hamKume = (d.data as { ozellikler?: { kume?: unknown } })?.ozellikler?.kume;
    if (typeof hamKume === "string" && hamKume.trim()) {
      const kumeAdi = hamKume.trim();
      const liste = gruplar.get(kumeAdi) ?? [];
      liste.push({
        id: d.id,
        x: d.position.x,
        y: d.position.y,
        kume: kumeAdi,
      });
      gruplar.set(kumeAdi, liste);
    }
  }
  return gruplar;
};

export const kumeSinirlariniHesapla = (noktalar: KumelenebilirKonum[]) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of noktalar) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  const x = Math.round(minX - DOLGU_YATAY);
  const y = Math.round(minY - DOLGU_UST);
  const genislik = Math.round(maxX - minX + DUGUM_GENISLIK + DOLGU_YATAY * 2);
  const yukseklik = Math.round(maxY - minY + DUGUM_YUKSEKLIK + DOLGU_UST + DOLGU_ALT);

  return { x, y, genislik, yukseklik };
};

export const yerelDugumlerdenKumeDugumleriOlustur = (
  yerelDugumler: Node[]
): Node<KumeKutusuVerisi>[] => {
  const gruplar = dugumlerdenKumeleriCikar(yerelDugumler);
  const kumeDugumleri: Node<KumeKutusuVerisi>[] = [];

  for (const [kumeAdi, noktalar] of gruplar.entries()) {
    const { x, y, genislik, yukseklik } = kumeSinirlariniHesapla(noktalar);
    const tema = kumeRengiBelirle(kumeAdi);

    kumeDugumleri.push({
      id: `kume-${kumeAdi}`,
      type: "kumeDugum",
      position: { x, y },
      selectable: false,
      draggable: false,
      zIndex: -1,
      data: {
        kumeAdi,
        dugumSayisi: noktalar.length,
        tema,
        genislik,
        yukseklik,
      },
    });
  }

  return kumeDugumleri;
};
