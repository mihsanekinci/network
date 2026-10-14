import { useEffect, useState } from "react";
import { useHaritaStore } from "./store/haritaStore";
import SidebarPanel from "./components/panels/SidebarPanel";
import GraphCanvas from "./components/graph/GraphCanvas";
import MapModal from "./components/panels/MapModal";
import NodeModal from "./components/panels/NodeModal";
import EdgeModal from "./components/panels/EdgeModal";
import NodeDetailDrawer from "./components/panels/NodeDetailDrawer";
import SearchFilterBar from "./components/panels/SearchFilterBar";

export function App() {
  const { haritalariYukle, haritalar, secilenHaritaId, dugumler, kenarlar, hata, hatayiTemizle } =
    useHaritaStore();

  const [haritaModaliAcik, setHaritaModaliAcik] = useState(false);
  const [dugumModaliAcik, setDugumModaliAcik] = useState(false);

  useEffect(() => {
    haritalariYukle();
  }, [haritalariYukle]);

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
                <h2 className="text-sm font-bold text-slate-900 truncate max-w-48" title={secilenHarita.baslik}>
                  {secilenHarita.baslik}
                </h2>
                {secilenHarita.aciklama && (
                  <span className="hidden 2xl:inline text-xs text-slate-400 border-l border-slate-200 pl-2.5 truncate max-w-xs" title={secilenHarita.aciklama}>
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
              <span className="text-xs text-slate-400 font-medium">
                Aktif bir harita seçilmedi
              </span>
            )}
          </div>

          {/* Orta: Arama ve Filtreleme Çubuğu (Aktif Harita Varken) */}
          <div className="flex-1 flex justify-center items-center px-2 min-w-0">
            {secilenHaritaId && <SearchFilterBar />}
          </div>

          {/* Sağ: Eylem Butonları */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDugumModaliAcik(true)}
              disabled={!secilenHaritaId}
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
    </div>
  );
}

export default App;
