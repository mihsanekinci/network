import { useEffect, useState, useCallback, useRef } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Wand2,
  MoreHorizontal,
  Activity,
  Layers,
  Keyboard,
  Loader2,
  AlertCircle,
  X,
  Network,
  Sparkles,
} from "lucide-react";
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
    otomatikDuzenlendi,
    otomatikDuzenlemeUyarisi,
    otomatikDuzenlemeUyarisiAyarla,
    otomatikDuzenlemeyiIsaretle,
    otomatikDuzenlemeTekrarTiklandi,
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

  // Otomatik düzenleme uyarı balonunu otomatik kapat
  useEffect(() => {
    if (otomatikDuzenlemeUyarisi) {
      const zamanlayici = setTimeout(() => {
        otomatikDuzenlemeUyarisiAyarla(null);
      }, 2600);
      return () => clearTimeout(zamanlayici);
    }
  }, [otomatikDuzenlemeUyarisi, otomatikDuzenlemeUyarisiAyarla]);

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

    // Eğer zaten otomatik hizalanmışsa uyarı ver
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
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Üst Yüzen Cam Adacık (Floating Glass Island Header) */}
        <header className="glass-floating rounded-2xl mx-3 sm:mx-4 mt-3 mb-2 px-3 sm:px-4 py-2 flex items-center justify-between gap-2.5 sm:gap-3 shrink-0 z-20">
          {/* Sol Kısım: Kenar Çubuğu Butonu + Harita Başlığı ve Sayaç Rozetleri */}
          <div className="flex items-center gap-2.5 min-w-0 shrink">
            <button
              type="button"
              onClick={() => sidebarDurumuDegistir(!sidebarAcik)}
              title={sidebarAcik ? "Kenar Çubuğunu Gizle (⌘B)" : "Kenar Çubuğunu Göster (⌘B)"}
              className="w-8.5 h-8.5 rounded-xl border border-slate-200/90 bg-white/80 hover:bg-slate-50 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs btn-tactile"
            >
              {sidebarAcik ? (
                <PanelLeftClose className="w-4 h-4 text-slate-600" />
              ) : (
                <PanelLeftOpen className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {!sidebarAcik && (
              <div className="hidden md:flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-200/80">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  <Network className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-800 text-xs">NetWork</span>
              </div>
            )}

            <div className="flex flex-col min-w-0 shrink">
              {secilenHarita ? (
                <>
                  <h2
                    className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-36 sm:max-w-48 md:max-w-60 leading-tight"
                    title={secilenHarita.baslik}
                  >
                    {secilenHarita.baslik}
                  </h2>
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 leading-tight truncate mt-0.5">
                    <span className="inline-flex items-center text-indigo-600 font-semibold">
                      {dugumler.length} düğüm
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center text-slate-600 font-semibold">
                      {kenarlar.length} bağlantı
                    </span>
                    {secilenHarita.aciklama && (
                      <>
                        <span className="text-slate-300 hidden lg:inline">•</span>
                        <span
                          className="hidden lg:inline truncate max-w-40 text-slate-400 font-normal"
                          title={secilenHarita.aciklama}
                        >
                          {secilenHarita.aciklama}
                        </span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Aktif harita seçilmedi</span>
              )}
            </div>
          </div>

          {/* Orta Kısım: Kompakt Arama ve Filtreleme Çubuğu */}
          <div className="flex-1 flex justify-center items-center px-1 min-w-0">
            {secilenHaritaId && <SearchFilterBar />}
          </div>

          {/* Sağ Kısım: Aksiyon Butonları & Seçenekler Menüsü */}
          <div className="flex items-center gap-2 shrink-0">
            {/* + Düğüm Ekle Butonu */}
            <button
              type="button"
              onClick={() => setDugumModaliAcik(true)}
              disabled={!secilenHaritaId}
              title="Yeni Düğüm Ekle (⌘N)"
              className="h-8.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-2xs hover:shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer btn-tactile shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Düğüm Ekle</span>
            </button>

            {/* Otomatik Düzenle Butonu */}
            <button
              type="button"
              onClick={handleOtomatikDuzenle}
              disabled={!secilenHaritaId || dugumler.length === 0 || duzenleniyor}
              title={
                otomatikDuzenlendi
                  ? "Otomatik düzenleme etkin (Tekrar düzenlemek için düğümleri sürükleyin)"
                  : "Otomatik Hiyerarşik Hizala (⌘D)"
              }
              className={`h-8.5 px-2.5 sm:px-3 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer btn-tactile ${
                otomatikDuzenlendi
                  ? "bg-slate-100/90 border border-slate-200 text-slate-400 opacity-60 hover:opacity-100 hover:bg-slate-100"
                  : "bg-white/90 hover:bg-white active:scale-95 border border-slate-200/90 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 hover:text-slate-900"
              }`}
            >
              {duzenleniyor ? (
                <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              ) : (
                <Wand2 className={`w-3.5 h-3.5 ${otomatikDuzenlendi ? "text-slate-400" : "text-amber-500"}`} />
              )}
              <span className="hidden md:inline">
                {duzenleniyor ? "Düzenleniyor..." : "Düzenle"}
              </span>
            </button>

            {/* ⋯ Seçenekler / Araçlar Açılır Menüsü */}
            <div className="relative" ref={seceneklerRef}>
              <button
                type="button"
                onClick={() => setSeceneklerMenusuAcik((prev) => !prev)}
                disabled={!secilenHaritaId}
                title="Diğer Seçenekler ve Araçlar"
                className={`h-8.5 w-8.5 bg-white/90 hover:bg-white active:scale-95 border border-slate-200/90 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 rounded-xl shadow-2xs transition-all flex items-center justify-center cursor-pointer btn-tactile shrink-0 ${
                  seceneklerMenusuAcik ? "ring-2 ring-indigo-500/20 border-indigo-300 bg-white" : ""
                }`}
              >
                <MoreHorizontal className="w-4 h-4 text-slate-600" />
              </button>

              {seceneklerMenusuAcik && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/90 flex items-center justify-between">
                    <span>Harita Araçları</span>
                  </div>

                  {/* Ağ Analitiği */}
                  <button
                    type="button"
                    onClick={() => {
                      setSeceneklerMenusuAcik(false);
                      setAnalizModaliAcik(true);
                    }}
                    className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Activity className="w-3.5 h-3.5" />
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
                    className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {duzenleniyor ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                        <span>Otomatik Düzenle</span>
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
                    className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Layers className="w-3.5 h-3.5" />
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
                    className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Keyboard className="w-3.5 h-3.5" />
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

        {/* Otomatik Düzenleme Bilgi/Uyarı Balonu */}
        {otomatikDuzenlemeUyarisi && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/95 text-white rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2 border border-slate-700/60 font-medium select-none">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{otomatikDuzenlemeUyarisi}</span>
          </div>
        )}

        {/* Hata Bildirimi (Varsa) */}
        {hata && (
          <div className="mx-3 sm:mx-4 mb-2 px-3.5 py-2 rounded-xl bg-red-50/90 border border-red-200 text-xs text-red-700 flex items-center justify-between shadow-2xs backdrop-blur-sm z-20">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="truncate font-medium">{hata}</span>
            </div>
            <button
              onClick={hatayiTemizle}
              title="Bildirimi Kapat"
              className="p-1 rounded-md text-red-400 hover:text-red-700 hover:bg-red-100/60 transition-colors cursor-pointer shrink-0 ml-2"
            >
              <X className="w-3.5 h-3.5" />
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
