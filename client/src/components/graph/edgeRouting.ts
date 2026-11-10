export type YonTipi = "ust" | "sag" | "alt" | "sol";

export interface DugumKonumu {
  x: number;
  y: number;
}

export interface KenarUcu {
  kenarId: string;
  rol: "kaynak" | "hedef";
  karsiKonum: DugumKonumu;
}

export const slotBelirle = (sira: number, toplam: number): number => {
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

export const yonBelirle = (
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
