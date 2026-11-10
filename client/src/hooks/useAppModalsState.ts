import { useState, useCallback } from "react";

export const useAppModalsState = () => {
  const [haritaModaliAcik, setHaritaModaliAcik] = useState(false);
  const [dugumModaliAcik, setDugumModaliAcik] = useState(false);
  const [analizModaliAcik, setAnalizModaliAcik] = useState(false);
  const [disaIceAktarModaliAcik, setDisaIceAktarModaliAcik] = useState(false);
  const [kisayollarModaliAcik, setKisayollarModaliAcik] = useState(false);
  const [seceneklerMenusuAcik, setSeceneklerMenusuAcik] = useState(false);

  const modallariKapat = useCallback(() => {
    setHaritaModaliAcik(false);
    setDugumModaliAcik(false);
    setAnalizModaliAcik(false);
    setDisaIceAktarModaliAcik(false);
    setKisayollarModaliAcik(false);
    setSeceneklerMenusuAcik(false);
  }, []);

  return {
    haritaModaliAcik,
    setHaritaModaliAcik,
    dugumModaliAcik,
    setDugumModaliAcik,
    analizModaliAcik,
    setAnalizModaliAcik,
    disaIceAktarModaliAcik,
    setDisaIceAktarModaliAcik,
    kisayollarModaliAcik,
    setKisayollarModaliAcik,
    seceneklerMenusuAcik,
    setSeceneklerMenusuAcik,
    modallariKapat,
  };
};
