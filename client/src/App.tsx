import React, { useEffect, useRef } from "react";
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

export const App: React.FC = () => {
  const {
    haritalariYukle,
    haritalar,
    secilenHaritaId,
    dugumler,
    kenarlar,
    hata,
    hatayiTemizle,
    otomatikDuzenlendi,
    otomatikDuzenlemeUyarisi,
    otomatikDuzenlemeUyarisiAyarla,
  } = useHaritaStore();

  const modals = useAppModalsState();
  const sidebar = useSidebarState();
  const layout = useAutoLayoutAction();
  const seceneklerRef = useRef<HTMLDivElement>(null);

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
  });

  const secilenHarita = haritalar.find((h) => h.id === secilenHaritaId);

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-slate-100 font-sans">
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
        setHaritaModaliAcik={modals.setHaritaModaliAcik}
        setDugumModaliAcik={modals.setDugumModaliAcik}
        setAnalizModaliAcik={modals.setAnalizModaliAcik}
        setDisaIceAktarModaliAcik={modals.setDisaIceAktarModaliAcik}
        setKisayollarModaliAcik={modals.setKisayollarModaliAcik}
      />
    </div>
  );
};

export default App;
