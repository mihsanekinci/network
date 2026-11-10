import React from "react";
import MapModal from "../panels/MapModal";
import NodeModal from "../panels/NodeModal";
import EdgeModal from "../panels/EdgeModal";
import NodeDetailDrawer from "../panels/NodeDetailDrawer";
import NetworkInsightsModal from "../panels/NetworkInsightsModal";
import ImportExportModal from "../panels/ImportExportModal";
import ShortcutsModal from "../panels/ShortcutsModal";

interface AppModalsProps {
  haritaModaliAcik: boolean;
  dugumModaliAcik: boolean;
  analizModaliAcik: boolean;
  disaIceAktarModaliAcik: boolean;
  kisayollarModaliAcik: boolean;
  setHaritaModaliAcik: (acik: boolean) => void;
  setDugumModaliAcik: (acik: boolean) => void;
  setAnalizModaliAcik: (acik: boolean) => void;
  setDisaIceAktarModaliAcik: (acik: boolean) => void;
  setKisayollarModaliAcik: (acik: boolean) => void;
}

export const AppModals: React.FC<AppModalsProps> = ({
  haritaModaliAcik,
  dugumModaliAcik,
  analizModaliAcik,
  disaIceAktarModaliAcik,
  kisayollarModaliAcik,
  setHaritaModaliAcik,
  setDugumModaliAcik,
  setAnalizModaliAcik,
  setDisaIceAktarModaliAcik,
  setKisayollarModaliAcik,
}) => {
  return (
    <>
      <MapModal acik={haritaModaliAcik} kapat={() => setHaritaModaliAcik(false)} />
      <NodeModal acik={dugumModaliAcik} kapat={() => setDugumModaliAcik(false)} />
      <EdgeModal />
      <NodeDetailDrawer />
      <NetworkInsightsModal
        acik={analizModaliAcik}
        kapat={() => setAnalizModaliAcik(false)}
      />
      <ImportExportModal
        acik={disaIceAktarModaliAcik}
        kapat={() => setDisaIceAktarModaliAcik(false)}
      />
      <ShortcutsModal
        acik={kisayollarModaliAcik}
        kapat={() => setKisayollarModaliAcik(false)}
      />
    </>
  );
};
