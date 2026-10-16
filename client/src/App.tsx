import { useEffect, useState, useCallback } from "react";
import { useHaritaStore } from "./store/haritaStore";
import SidebarPanel from "./components/panels/SidebarPanel";
import GraphCanvas from "./components/graph/GraphCanvas";
import MapModal from "./components/panels/MapModal";
import NodeModal from "./components/panels/NodeModal";
import EdgeModal from "./components/panels/EdgeModal";
import NodeDetailDrawer from "./components/panels/NodeDetailDrawer";
import SearchFilterBar from "./components/panels/SearchFilterBar";
import NetworkInsightsModal from "./components/panels/NetworkInsightsModal";
import ImportExportModal from "./components/panels/ImportExportModal";
import ShortcutsModal from "./components/panels/ShortcutsModal";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { otomatikKonumlandir } from "./utils/autoLayout";

export function App() {
  const {
    haritalariYukle,
    haritalar,
    secilenHaritaId,
    dugumler,
    kenarlar,
    hata,
    hatayiTemizle,
    dugumKonumlariTopluGuncelle,
  } = useHaritaStore();

  const [haritaModaliAcik, setHaritaModaliAcik] = useState(false);
  const [dugumModaliAcik, setDugumModaliAcik] = useState(false);
  const [analizModaliAcik, setAnalizModaliAcik] = useState(false);
  const [disaIceAktarModaliAcik, setDisaIceAktarModaliAcik] = useState(false);
  const [kisayollarModaliAcik, setKisayollarModaliAcik] = useState(false);
  const [duzenleniyor, setDuzenleniyor] = useState(false);

  useEffect(() => {
    haritalariYukle();
  }, [haritalariYukle]);

  // Otomatik Yerleşim (Dagre Auto-Layout) Eylemi
  const handleOtomatikDuzenle = useCallback(async () => {
    if (!secilenHaritaId || dugumler.length === 0 || duzenleniyor) return;
    setDuzenleniyor(true);
    try {
      const yeniKonumlar = otomatikKonumlandir(dugumler, kenarlar, "TB");
      await dugumKonumlariTopluGuncelle(yeniKonumlar);
    } finally {
      setDuzenleniyor(false);
    }
  }, [secilenHaritaId, dugumler, kenarlar, duzenleniyor, dugumKonumlariTopluGuncelle]);

  // Arama çubuğuna odaklanma
  const handleAramayaOdaklan = useCallback(() => {
    const input = document.getElementById("arama-input") as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  // Tüm açık modalları kapatma
  const handleModallariKapat = useCallback(() => {
    setHaritaModaliAcik(false);
    setDugumModaliAcik(false);
    setAnalizModaliAcik(false);
    setDisaIceAktarModaliAcik(false);
    setKisayollarModaliAcik(false);
  }, []);

  // Klavye Kısayolları Kancası (Global Hook)
  useKeyboardShortcuts({
    onOpenNewNode: () => setDugumModaliAcik(true),
    onToggleShortcuts: () => setKisayollarModaliAcik((prev) => !prev),
    onAutoLayout: handleOtomatikDuzenle,
    onFocusSearch: handleAramayaOdaklan,
    onCloseModals: handleModallariKapat,
  });

  const secilenHarita = haritalar.find((h) => h.id === secilenHaritaId);

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-slate-100 font-sans">
      {/* Sol Kenar Çubuğu */}
      <SidebarPanel yeniHaritaAc={() => setHaritaModaliAcik(true)} />

      {/* Ana Çalışma Alanı */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Üst Bilgi ve Kontrol Çubuğu */}
        <header className="h-14 px-5 border-b border-slate-200/80 bg-white/85 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          {/* Sol: Harita Başlığı ve Sayaçlar */}
          <div className="flex items-center gap-2.5 min-w-0 shrink">
            {secilenHarita ? (
              <>
                <h2
                  className="text-sm font-bold text-slate-900 truncate max-w-44"
                  title={secilenHarita.baslik}
                >
                  {secilenHarita.baslik}
                </h2>
                {secilenHarita.aciklama && (
                  <span
                    className="hidden 2xl:inline text-xs text-slate-400 border-l border-slate-200 pl-2.5 truncate max-w-xs"
                    title={secilenHarita.aciklama}
                  >
                    {secilenHarita.aciklama}
                  </span>
                )}
                <div className="hidden md:flex items-center gap-1.5 shrink-0">
                  <span className="bg-slate-100 text-slate-600 border border-slate-200/80 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                    {dugumler.length} Düğüm
                  </span>
                  <span className="bg-slate-100 text-slate-600 border border-slate-200/80 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                    {kenarlar.length} Bağlantı
                  </span>
                </div>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-medium">Aktif bir harita seçilmedi</span>
            )}
          </div>

          {/* Orta: Arama ve Filtreleme Çubuğu */}
          <div className="flex-1 flex justify-center items-center px-2 min-w-0">
            {secilenHaritaId && <SearchFilterBar />}
          </div>

          {/* Sağ: Eylem Butonları */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Ağ Analitiği Butonu */}
            <button
              onClick={() => setAnalizModaliAcik(true)}
              disabled={!secilenHaritaId}
              title="Ağ Analitiği & Rota Bulucu"
              className="h-8.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>📊</span>
              <span className="hidden lg:inline">Analiz</span>
            </button>

            {/* Otomatik Hizala / Layout Butonu */}
            <button
              onClick={handleOtomatikDuzenle}
              disabled={!secilenHaritaId || dugumler.length === 0 || duzenleniyor}
              title="Düğümleri Otomatik Düzenle (⌘D)"
              className="h-8.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className={duzenleniyor ? "animate-spin" : ""}>✨</span>
              <span className="hidden lg:inline">
                {duzenleniyor ? "Hizalanıyor..." : "Otomatik Düzenle"}
              </span>
            </button>

            {/* Dışa / İçe Aktarma Butonu */}
            <button
              onClick={() => setDisaIceAktarModaliAcik(true)}
              title="Görsel veya JSON Dışa/İçe Aktar"
              className="h-8.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 active:scale-98 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>📤</span>
              <span className="hidden sm:inline">Dışa/İçe Aktar</span>
            </button>

            {/* Klavye Kısayolları Butonu */}
            <button
              onClick={() => setKisayollarModaliAcik(true)}
              title="Klavye Kısayolları (⌘K)"
              className="h-8.5 w-8.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 active:scale-98 text-slate-600 text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center justify-center cursor-pointer"
            >
              ⌨️
            </button>

            {/* + Düğüm Ekle Butonu */}
            <button
              onClick={() => setDugumModaliAcik(true)}
              disabled={!secilenHaritaId}
              title="Yeni Düğüm Ekle (⌘N)"
              className="h-8.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="text-sm leading-none font-bold">＋</span>
              <span>Düğüm Ekle</span>
            </button>
          </div>
        </header>

        {/* Hata Bildirimi (Varsa) */}
        {hata && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-700 flex items-center justify-between">
            <span>⚠️ {hata}</span>
            <button onClick={hatayiTemizle} className="text-red-500 hover:text-red-800 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Graf Tuvali (React Flow Canvas) */}
        <div className="flex-1 w-full h-full overflow-hidden relative">
          <GraphCanvas />
        </div>
      </main>

      {/* Modallar ve Detay Paneli */}
      <MapModal acik={haritaModaliAcik} kapat={() => setHaritaModaliAcik(false)} />
      <NodeModal acik={dugumModaliAcik} kapat={() => setDugumModaliAcik(false)} />
      <EdgeModal />
      <NodeDetailDrawer />
      <NetworkInsightsModal acik={analizModaliAcik} kapat={() => setAnalizModaliAcik(false)} />
      <ImportExportModal
        acik={disaIceAktarModaliAcik}
        kapat={() => setDisaIceAktarModaliAcik(false)}
      />
      <ShortcutsModal acik={kisayollarModaliAcik} kapat={() => setKisayollarModaliAcik(false)} />
    </div>
  );
}

export default App;

