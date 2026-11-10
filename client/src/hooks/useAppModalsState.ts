import { useState, useCallback } from "react";

export type SilmeHedefi =
  | { tur: "dugum"; id: string; baslik: string }
  | { tur: "kenar"; id: string; baslik: string }
  | null;

export const useAppModalsState = () => {
  const [haritaModaliAcik, setHaritaModaliAcik] = useState(false);
  const [dugumModaliAcik, setDugumModaliAcik] = useState(false);
  const [analizModaliAcik, setAnalizModaliAcik] = useState(false);
  const [disaIceAktarModaliAcik, setDisaIceAktarModaliAcik] = useState(false);
  const [kisayollarModaliAcik, setKisayollarModaliAcik] = useState(false);
  const [seceneklerMenusuAcik, setSeceneklerMenusuAcik] = useState(false);
  const [silmeHedefi, setSilmeHedefi] = useState<SilmeHedefi>(null);

  const modallariKapat = useCallback(() => {
    setHaritaModaliAcik(false);
    setDugumModaliAcik(false);
    setAnalizModaliAcik(false);
    setDisaIceAktarModaliAcik(false);
    setKisayollarModaliAcik(false);
    setSeceneklerMenusuAcik(false);
    setSilmeHedefi(null);
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
    silmeHedefi,
    setSilmeHedefi,
    modallariKapat,
  };
};
