import { useState, useCallback } from "react";
import { useHaritaStore } from "../store/haritaStore";
import { otomatikKonumlandir } from "../utils/autoLayout";

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
    setDuzenleniyor(true);
    try {
      const yeniKonumlar = otomatikKonumlandir(dugumler, kenarlar, "TB");
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
