import { useEffect, useState } from "react";
import { useHaritaStore } from "./store/haritaStore";
import SidebarPanel from "./components/panels/SidebarPanel";
import GraphCanvas from "./components/graph/GraphCanvas";
import MapModal from "./components/panels/MapModal";
import NodeModal from "./components/panels/NodeModal";

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
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            {secilenHarita ? (
              <>
                <h2 className="text-sm font-bold text-slate-800">{secilenHarita.baslik}</h2>
                {secilenHarita.aciklama && (
                  <span className="text-xs text-slate-400 border-l border-slate-200 pl-3">
                    {secilenHarita.aciklama}
                  </span>
                )}
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                    {dugumler.length} Düğüm
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDugumModaliAcik(true)}
              disabled={!secilenHaritaId}
              className="py-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>＋</span> Düğüm Ekle
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

      {/* Modallar */}
      <MapModal acik={haritaModaliAcik} kapat={() => setHaritaModaliAcik(false)} />
      <NodeModal acik={dugumModaliAcik} kapat={() => setDugumModaliAcik(false)} />
    </div>
  );
}

export default App;
