import { useEffect, useState, useCallback, useRef } from "react";
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
  const [seceneklerMenusuAcik, setSeceneklerMenusuAcik] = useState(false);
  const seceneklerRef = useRef<HTMLDivElement>(null);

  // Kenar Çubuğu (Sidebar) açık/kapalı durumu - LocalStorage destekli
  const [sidebarAcik, setSidebarAcik] = useState<boolean>(() => {
    return localStorage.getItem("network_sidebar_acik") !== "false";
  });

  const sidebarDurumuDegistir = useCallback((yeniDurum: boolean) => {
    setSidebarAcik(yeniDurum);
    localStorage.setItem("network_sidebar_acik", String(yeniDurum));
  }, []);

  useEffect(() => {
    haritalariYukle();
  }, [haritalariYukle]);

  // Seçenekler menüsü dışına tıklandığında kapat
  useEffect(() => {
    const disariTiklandi = (e: MouseEvent) => {
      if (seceneklerRef.current && !seceneklerRef.current.contains(e.target as Node)) {
        setSeceneklerMenusuAcik(false);
      }
    };
    if (seceneklerMenusuAcik) {
      document.addEventListener("mousedown", disariTiklandi);
    }
    return () => document.removeEventListener("mousedown", disariTiklandi);
  }, [seceneklerMenusuAcik]);

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
    setSeceneklerMenusuAcik(false);
  }, []);

  // Klavye Kısayolları Kancası (Global Hook)
  useKeyboardShortcuts({
    onOpenNewNode: () => setDugumModaliAcik(true),
    onToggleShortcuts: () => setKisayollarModaliAcik((prev) => !prev),
    onAutoLayout: handleOtomatikDuzenle,
    onFocusSearch: handleAramayaOdaklan,
    onCloseModals: handleModallariKapat,
    onToggleSidebar: () => sidebarDurumuDegistir(!sidebarAcik),
  });

  const secilenHarita = haritalar.find((h) => h.id === secilenHaritaId);

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-slate-100 font-sans">
      {/* Sol Kenar Çubuğu (Açılır-Kapanır) */}
      <SidebarPanel
        acik={sidebarAcik}
        kapat={() => sidebarDurumuDegistir(false)}
        yeniHaritaAc={() => setHaritaModaliAcik(true)}
      />

      {/* Ana Çalışma Alanı */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Üst Bilgi ve Kontrol Çubuğu (Navbar) */}
        <header className="h-14 px-4 sm:px-5 border-b border-slate-200/80 bg-white/85 backdrop-blur-md flex items-center justify-between gap-2.5 shrink-0 z-10">
          {/* Sol: Kenar Çubuğu Butonu + Harita Başlığı ve Alt Bilgileri */}
          <div className="flex items-center gap-2.5 min-w-0 shrink">
            <button
              type="button"
              onClick={() => sidebarDurumuDegistir(!sidebarAcik)}
              title={sidebarAcik ? "Kenar Çubuğunu Gizle (⌘B)" : "Kenar Çubuğunu Göster (⌘B)"}
              className="w-8.5 h-8.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            {!sidebarAcik && (
              <div className="hidden sm:flex items-center gap-1.5 shrink-0 pr-1 border-r border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  N
                </div>
                <span className="font-bold text-slate-800 text-xs mr-2">NetWork</span>
              </div>
            )}

            <div className="flex flex-col min-w-0 shrink">
              {secilenHarita ? (
                <>
                  <h2
                    className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-44 md:max-w-64 leading-tight"
                    title={secilenHarita.baslik}
                  >
                    {secilenHarita.baslik}
                  </h2>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 leading-tight truncate">
                    <span className="text-indigo-600 font-semibold">{dugumler.length} Düğüm</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-semibold">{kenarlar.length} Bağlantı</span>
                    {secilenHarita.aciklama && (
                      <>
                        <span className="text-slate-300 hidden md:inline">•</span>
                        <span
                          className="hidden md:inline truncate max-w-44 text-slate-400 font-normal"
                          title={secilenHarita.aciklama}
                        >
                          {secilenHarita.aciklama}
                        </span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Aktif bir harita seçilmedi</span>
              )}
            </div>
          </div>

          {/* Orta: Kompakt Arama ve Filtreleme Çubuğu */}
          <div className="flex-1 flex justify-center items-center px-1 min-w-0">
            {secilenHaritaId && <SearchFilterBar />}
          </div>

          {/* Sağ: Aksiyon Butonları & Seçenekler Menüsü */}
          <div className="flex items-center gap-2 shrink-0">
            {/* + Düğüm Ekle Butonu (Ana Aksiyon) */}
            <button
              onClick={() => setDugumModaliAcik(true)}
              disabled={!secilenHaritaId}
              title="Yeni Düğüm Ekle (⌘N)"
              className="h-8.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="text-sm leading-none font-bold">＋</span>
              <span className="hidden sm:inline">Düğüm Ekle</span>
            </button>

            {/* Seçenekler / Araçlar Açılır Menüsü (Dropdown) */}
            <div className="relative" ref={seceneklerRef}>
              <button
                type="button"
                onClick={() => setSeceneklerMenusuAcik((prev) => !prev)}
                disabled={!secilenHaritaId}
                title="Harita Seçenekleri & Araçlar"
                className="h-8.5 px-3 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>⚙️</span>
                <span className="hidden sm:inline">Seçenekler</span>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {seceneklerMenusuAcik && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Harita Araçları
                  </div>

                  {/* Ağ Analitiği */}
                  <button
                    type="button"
                    onClick={() => {
                      setSeceneklerMenusuAcik(false);
                      setAnalizModaliAcik(true);
                    }}
                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-sm shrink-0">
                      📊
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        Ağ Analitiği
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        En kısa rota ve merkeziyet analizi
                      </div>
                    </div>
                  </button>

                  {/* Otomatik Düzenle */}
                  <button
                    type="button"
                    onClick={() => {
                      setSeceneklerMenusuAcik(false);
                      handleOtomatikDuzenle();
                    }}
                    disabled={dugumler.length === 0 || duzenleniyor}
                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center text-sm shrink-0">
                      <span className={duzenleniyor ? "animate-spin" : ""}>✨</span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                        <span>{duzenleniyor ? "Hizalanıyor..." : "Otomatik Düzenle"}</span>
                        <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500 bg-slate-100 rounded border border-slate-200">
                          ⌘D
                        </kbd>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Düğümleri hiyerarşik hizala
                      </div>
                    </div>
                  </button>

                  {/* Dışa / İçe Aktar */}
                  <button
                    type="button"
                    onClick={() => {
                      setSeceneklerMenusuAcik(false);
                      setDisaIceAktarModaliAcik(true);
                    }}
                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                      📤
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                        Dışa / İçe Aktar
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        JSON paketi veya PNG görseli
                      </div>
                    </div>
                  </button>

                  <div className="my-0.5 border-t border-slate-100" />

                  {/* Klavye Kısayolları */}
                  <button
                    type="button"
                    onClick={() => {
                      setSeceneklerMenusuAcik(false);
                      setKisayollarModaliAcik(true);
                    }}
                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center text-sm shrink-0">
                      ⌨️
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition-colors flex items-center justify-between">
                        <span>Klavye Kısayolları</span>
                        <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500 bg-slate-100 rounded border border-slate-200">
                          ⌘K
                        </kbd>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Tüm hızlı tuşları görüntüle
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
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

