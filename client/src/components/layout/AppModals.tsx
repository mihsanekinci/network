import React from "react";
import MapModal from "../panels/MapModal";
import NodeModal from "../panels/NodeModal";
import EdgeModal from "../panels/EdgeModal";
import NodeDetailDrawer from "../panels/NodeDetailDrawer";
import NetworkInsightsModal from "../panels/NetworkInsightsModal";
import ImportExportModal from "../panels/ImportExportModal";
import ShortcutsModal from "../panels/ShortcutsModal";
import DeleteConfirmationModal from "../panels/DeleteConfirmationModal";
import type { SilmeHedefi } from "../../hooks/useAppModalsState";

interface AppModalsProps {
  haritaModaliAcik: boolean;
  dugumModaliAcik: boolean;
  analizModaliAcik: boolean;
  disaIceAktarModaliAcik: boolean;
  kisayollarModaliAcik: boolean;
  silmeHedefi: SilmeHedefi;
  siliniyor?: boolean;
  setHaritaModaliAcik: (acik: boolean) => void;
  setDugumModaliAcik: (acik: boolean) => void;
  setAnalizModaliAcik: (acik: boolean) => void;
  setDisaIceAktarModaliAcik: (acik: boolean) => void;
  setKisayollarModaliAcik: (acik: boolean) => void;
  onSilmeKapat: () => void;
  onSilmeOnayla: () => Promise<void> | void;
}

export const AppModals: React.FC<AppModalsProps> = ({
  haritaModaliAcik,
  dugumModaliAcik,
  analizModaliAcik,
  disaIceAktarModaliAcik,
  kisayollarModaliAcik,
  silmeHedefi,
  siliniyor,
  setHaritaModaliAcik,
  setDugumModaliAcik,
  setAnalizModaliAcik,
  setDisaIceAktarModaliAcik,
  setKisayollarModaliAcik,
  onSilmeKapat,
  onSilmeOnayla,
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
      <DeleteConfirmationModal
        acik={Boolean(silmeHedefi)}
        baslik={
          silmeHedefi?.tur === "dugum"
            ? "Düğümü Silmek İstediğinize Emin misiniz?"
            : "Bağlantıyı Silmek İstediğinize Emin misiniz?"
        }
        ogeAdi={silmeHedefi?.baslik}
        aciklama={
          silmeHedefi?.tur === "dugum"
            ? "Bu düğüm ve bu düğüme ait tüm ilişkiler kalıcı olarak silinecektir. Bu işlem geri alınamaz."
            : "Bu bağlantı kalıcı olarak silinecektir. Bu işlem geri alınamaz."
        }
        onKapat={onSilmeKapat}
        onOnayla={onSilmeOnayla}
        yukleniyor={siliniyor}
      />
    </>
  );
};
