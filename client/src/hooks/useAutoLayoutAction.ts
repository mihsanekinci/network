import { useState, useCallback } from "react";
import { useHaritaStore } from "../store/haritaStore";
import { otomatikKonumlandir } from "../utils/autoLayout";
import type { DugumDTO, DugumKonumGuncellemeDTO } from "../types";

const konumlarFarkliMi = (
  dugumler: DugumDTO[],
  yeniKonumlar: DugumKonumGuncellemeDTO[]
): boolean => {
  const mevcutHarita = new Map(dugumler.map((d) => [d.id, d]));
  return yeniKonumlar.some((y) => {
    const mevcut = mevcutHarita.get(y.id);
    if (!mevcut) return false;
    return (
      Math.abs(Math.round(mevcut.pozisyonX) - y.pozisyonX) > 1 ||
      Math.abs(Math.round(mevcut.pozisyonY) - y.pozisyonY) > 1
    );
  });
};

export const useAutoLayoutAction = () => {
  const {
    secilenHaritaId,
    dugumler,
    kenarlar,
    dugumKonumlariTopluGuncelle,
    otomatikDuzenlendi,
    otomatikDuzenlemeyiIsaretle,
    otomatikDuzenlemeTekrarTiklandi,
  } = useHaritaStore();

  const [duzenleniyor, setDuzenleniyor] = useState(false);

  const calistir = useCallback(async () => {
    if (!secilenHaritaId || dugumler.length === 0 || duzenleniyor) return;

    if (otomatikDuzenlendi) {
      otomatikDuzenlemeTekrarTiklandi();
      return;
    }

    const yeniKonumlar = otomatikKonumlandir(dugumler, kenarlar, "TB");
    const hareketVar = konumlarFarkliMi(dugumler, yeniKonumlar);

    if (!hareketVar) {
      otomatikDuzenlemeyiIsaretle();
      otomatikDuzenlemeTekrarTiklandi();
      return;
    }

    setDuzenleniyor(true);
    try {
      await dugumKonumlariTopluGuncelle(yeniKonumlar);
      otomatikDuzenlemeyiIsaretle();
    } finally {
      setDuzenleniyor(false);
    }
  }, [
    secilenHaritaId,
    dugumler,
    kenarlar,
    duzenleniyor,
    otomatikDuzenlendi,
    otomatikDuzenlemeTekrarTiklandi,
    otomatikDuzenlemeyiIsaretle,
    dugumKonumlariTopluGuncelle,
  ]);

  return {
    duzenleniyor,
    otomatikDuzenle: calistir,
  };
};
