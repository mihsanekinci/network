import { useEffect, useState } from "react";
import { useHaritaStore } from "./store/haritaStore";
import SidebarPanel from "./components/panels/SidebarPanel";
import GraphCanvas from "./components/graph/GraphCanvas";
import MapModal from "./components/panels/MapModal";
import NodeModal from "./components/panels/NodeModal";
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
        <header className="h-16 px-6 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          {/* Sol: Harita Başlığı ve Sayaçlar */}
          <div className="flex items-center gap-3.5 min-w-0">
            {secilenHarita ? (
              <>
                <h2 className="text-base font-bold text-slate-900 truncate" title={secilenHarita.baslik}>
                  {secilenHarita.baslik}
                </h2>
                {secilenHarita.aciklama && (
                  <span className="hidden xl:inline text-xs text-slate-500 border-l border-slate-200 pl-3 truncate max-w-xs" title={secilenHarita.aciklama}>
                    {secilenHarita.aciklama}
                  </span>
                )}
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <span className="bg-slate-100/80 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                    {dugumler.length} Düğüm
                  </span>
                  <span className="bg-slate-100/80 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                    {kenarlar.length} Bağlantı
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm text-slate-400 font-medium">
                Aktif bir harita seçilmedi
              </span>
            )}
          </div>

          {/* Orta: Arama ve Filtreleme Çubuğu (Aktif Harita Varken) */}
          {secilenHaritaId && (
            <div className="flex-1 flex justify-center max-w-2xl px-2">
              <SearchFilterBar />
            </div>
          )}

          {/* Sağ: Eylem Butonları */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setDugumModaliAcik(true)}
              disabled={!secilenHaritaId}
              className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span className="text-base leading-none">＋</span>
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
      <NodeDetailDrawer />
    </div>
  );
}

export default App;
