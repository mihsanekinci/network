import React, { useEffect, useRef, useState, useCallback } from "react";
import { useHaritaStore } from "./store/haritaStore";
import SidebarPanel from "./components/panels/SidebarPanel";
import GraphCanvas from "./components/graph/GraphCanvas";
import { AppHeader } from "./components/layout/AppHeader";
import { AppModals } from "./components/layout/AppModals";
import { AppAlertToasts } from "./components/layout/AppAlertToasts";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useSidebarState } from "./hooks/useSidebarState";
import { useAppModalsState } from "./hooks/useAppModalsState";
import { useAutoLayoutAction } from "./hooks/useAutoLayoutAction";
import { useDarkMode } from "./hooks/useDarkMode";

export const App: React.FC = () => {
  const {
    haritalariYukle,
    haritalar,
    secilenHaritaId,
    secilenDugumId,
    secilenKenarId,
    dugumler,
    kenarlar,
    dugumSil,
    kenarSil,
    hata,
    hatayiTemizle,
    otomatikDuzenlendi,
    otomatikDuzenlemeUyarisi,
    otomatikDuzenlemeUyarisiAyarla,
  } = useHaritaStore();

  const modals = useAppModalsState();
  const sidebar = useSidebarState();
  const layout = useAutoLayoutAction();
  const { isDark, toggleDarkMode } = useDarkMode();
  const seceneklerRef = useRef<HTMLDivElement>(null);
  const [siliniyor, setSiliniyor] = useState(false);

  useEffect(() => {
    haritalariYukle();
  }, [haritalariYukle]);

  useEffect(() => {
    if (!otomatikDuzenlemeUyarisi) return;
    const zamanlayici = setTimeout(() => {
      otomatikDuzenlemeUyarisiAyarla(null);
    }, 2600);
    return () => clearTimeout(zamanlayici);
  }, [otomatikDuzenlemeUyarisi, otomatikDuzenlemeUyarisiAyarla]);

  useEffect(() => {
    const disariTiklandi = (e: MouseEvent) => {
      if (seceneklerRef.current && !seceneklerRef.current.contains(e.target as Node)) {
        modals.setSeceneklerMenusuAcik(false);
      }
    };
    if (modals.seceneklerMenusuAcik) {
      document.addEventListener("mousedown", disariTiklandi);
    }
    return () => document.removeEventListener("mousedown", disariTiklandi);
  }, [modals]);

  // Klavye Delete/Backspace ile güvenli silme teyidi tetikleme
  const handleSilmeIstegi = useCallback(() => {
    if (secilenDugumId) {
      const dugum = dugumler.find((d) => d.id === secilenDugumId);
      modals.setSilmeHedefi({
        tur: "dugum",
        id: secilenDugumId,
        baslik: dugum?.etiket || "Seçili Düğüm",
      });
    } else if (secilenKenarId) {
      const kenar = kenarlar.find((k) => k.id === secilenKenarId);
      modals.setSilmeHedefi({
        tur: "kenar",
        id: secilenKenarId,
        baslik: kenar?.etiket || "Seçili Bağlantı",
      });
    }
  }, [secilenDugumId, secilenKenarId, dugumler, kenarlar, modals]);

  const handleSilmeOnayla = useCallback(async () => {
    if (!modals.silmeHedefi || siliniyor) return;
    setSiliniyor(true);
    try {
      if (modals.silmeHedefi.tur === "dugum") {
        await dugumSil(modals.silmeHedefi.id);
      } else {
        await kenarSil(modals.silmeHedefi.id);
      }
      modals.setSilmeHedefi(null);
    } finally {
      setSiliniyor(false);
    }
  }, [modals, siliniyor, dugumSil, kenarSil]);

  useKeyboardShortcuts({
    onOpenNewNode: () => modals.setDugumModaliAcik(true),
    onToggleShortcuts: () => modals.setKisayollarModaliAcik(!modals.kisayollarModaliAcik),
    onAutoLayout: layout.otomatikDuzenle,
    onFocusSearch: () => {
      const input = document.getElementById("arama-input") as HTMLInputElement | null;
      if (input) {
        input.focus();
        input.select();
      }
    },
    onCloseModals: modals.modallariKapat,
    onToggleSidebar: sidebar.toggleSidebar,
    onRequestDelete: handleSilmeIstegi,
  });

  const secilenHarita = haritalar.find((h) => h.id === secilenHaritaId);

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans transition-colors">
      <SidebarPanel
        acik={sidebar.sidebarAcik}
        kapat={() => sidebar.sidebarDurumuDegistir(false)}
        yeniHaritaAc={() => modals.setHaritaModaliAcik(true)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <AppHeader
          sidebarAcik={sidebar.sidebarAcik}
          onSidebarToggle={sidebar.toggleSidebar}
          secilenHaritaId={secilenHaritaId}
          secilenHarita={secilenHarita}
          dugumler={dugumler}
          kenarlar={kenarlar}
          duzenleniyor={layout.duzenleniyor}
          otomatikDuzenlendi={otomatikDuzenlendi}
          seceneklerMenusuAcik={modals.seceneklerMenusuAcik}
          seceneklerRef={seceneklerRef}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
          onSeceneklerToggle={() =>
            modals.setSeceneklerMenusuAcik(!modals.seceneklerMenusuAcik)
          }
          onSeceneklerKapat={() => modals.setSeceneklerMenusuAcik(false)}
          onDugumEkle={() => modals.setDugumModaliAcik(true)}
          onOtomatikDuzenle={layout.otomatikDuzenle}
          onAnalizAc={() => modals.setAnalizModaliAcik(true)}
          onDisaIceAktarAc={() => modals.setDisaIceAktarModaliAcik(true)}
          onKisayollarAc={() => modals.setKisayollarModaliAcik(true)}
        />

        <AppAlertToasts
          otomatikDuzenlemeUyarisi={otomatikDuzenlemeUyarisi}
          hata={hata}
          onHatayiTemizle={hatayiTemizle}
        />

        <div className="flex-1 w-full h-full overflow-hidden relative">
          <GraphCanvas />
        </div>
      </main>

      <AppModals
        haritaModaliAcik={modals.haritaModaliAcik}
        dugumModaliAcik={modals.dugumModaliAcik}
        analizModaliAcik={modals.analizModaliAcik}
        disaIceAktarModaliAcik={modals.disaIceAktarModaliAcik}
        kisayollarModaliAcik={modals.kisayollarModaliAcik}
        silmeHedefi={modals.silmeHedefi}
        siliniyor={siliniyor}
        setHaritaModaliAcik={modals.setHaritaModaliAcik}
        setDugumModaliAcik={modals.setDugumModaliAcik}
        setAnalizModaliAcik={modals.setAnalizModaliAcik}
        setDisaIceAktarModaliAcik={modals.setDisaIceAktarModaliAcik}
        setKisayollarModaliAcik={modals.setKisayollarModaliAcik}
        onSilmeKapat={() => modals.setSilmeHedefi(null)}
        onSilmeOnayla={handleSilmeOnayla}
      />
    </div>
  );
};

export default App;
