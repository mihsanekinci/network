import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, PanelLeftClose, Folder, Map, Check, X } from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";

interface YanPanelOzellikleri {
  acik: boolean;
  kapat: () => void;
  yeniHaritaAc: () => void;
}

export const SidebarPanel: React.FC<YanPanelOzellikleri> = ({
  acik,
  kapat,
  yeniHaritaAc,
}) => {
  const { haritalar, secilenHaritaId, haritaSec, haritaSil, yukleniyor } = useHaritaStore();

  // Manuel Ayarlanabilir Genişlik (Resizable Sidebar - 240px - 560px)
  const [genislik, setGenislik] = useState<number>(() => {
    const kayitli = localStorage.getItem("network_sidebar_genislik");
    const parsed = kayitli ? parseInt(kayitli, 10) : 320;
    return isNaN(parsed) ? 320 : Math.min(Math.max(parsed, 240), 560);
  });

  const [surukleniyor, setSurukleniyor] = useState(false);

  const suruklemeyiBaslat = (e: React.MouseEvent) => {
    e.preventDefault();
    setSurukleniyor(true);
  };

  useEffect(() => {
    if (!surukleniyor) return;

    const handleMouseMove = (e: MouseEvent) => {
      const yeniGenislik = Math.min(Math.max(e.clientX, 240), 560);
      setGenislik(yeniGenislik);
      localStorage.setItem("network_sidebar_genislik", String(yeniGenislik));
    };

    const handleMouseUp = () => {
      setSurukleniyor(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [surukleniyor]);

  const [silinecekHaritaId, setSilinecekHaritaId] = useState<string | null>(null);
  const [siliniyor, setSiliniyor] = useState(false);
  const silinecekHaritaRef = useRef<HTMLDivElement>(null);

  // Ekranda herhangi bir yere tıklandığında veya ESC basıldığında harita silme onayını kapat
  useEffect(() => {
    if (!silinecekHaritaId) return;

    const disariTiklandi = (e: MouseEvent) => {
      if (silinecekHaritaRef.current && !silinecekHaritaRef.current.contains(e.target as Node)) {
        setSilinecekHaritaId(null);
      }
    };

    const tusDinle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSilinecekHaritaId(null);
      }
    };

    document.addEventListener("mousedown", disariTiklandi, true);
    window.addEventListener("keydown", tusDinle);

    return () => {
      document.removeEventListener("mousedown", disariTiklandi, true);
      window.removeEventListener("keydown", tusDinle);
    };
  }, [silinecekHaritaId]);

  return (
    <aside
      style={{
        width: acik ? `${genislik}px` : "0px",
        transition: surukleniyor ? "none" : "width 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`h-full bg-white dark:bg-slate-900 flex flex-col shrink-0 relative overflow-hidden z-20 transition-colors ${
        acik
          ? "border-r border-slate-200/90 dark:border-slate-800 opacity-100"
          : "border-r-0 opacity-0 pointer-events-none"
      }`}
    >
      <div style={{ width: `${genislik}px` }} className="h-full flex flex-col shrink-0">
        {/* Üst Başlık & Logo */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-xs tracking-tight">
              NW
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight tracking-tight">NetWork</h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Node-Edge Harita</p>
            </div>
          </div>

          {/* Kenar Çubuğunu Kapat Butonu */}
          <button
            type="button"
            onClick={kapat}
            title="Kenar Çubuğunu Gizle (⌘B)"
            className="w-8 h-8 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer btn-tactile"
          >
            <PanelLeftClose className="w-4 h-4 stroke-[1.8]" />
          </button>
        </div>

        {/* Yeni Harita Butonu */}
        <div className="p-3 pb-2 shrink-0">
          <button
            type="button"
            onClick={yeniHaritaAc}
            className="w-full h-10 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-2xs hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer btn-tactile active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>Yeni Harita Oluştur</span>
          </button>
        </div>

        {/* Harita Listesi */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
          <div className="px-1.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Kayıtlı Haritalar</span>
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-500 dark:text-slate-400">
              {haritalar.length}
            </span>
          </div>

          {haritalar.length === 0 && !yukleniyor && (
            <div className="text-center py-8 px-4 text-xs text-slate-400 dark:text-slate-500 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center shadow-2xs">
                <Map className="w-4 h-4 text-slate-400" />
              </span>
              <span>Kayıtlı harita bulunmuyor. Yeni bir tane oluşturun.</span>
            </div>
          )}

          {haritalar.map((harita) => {
            const aktif = secilenHaritaId === harita.id;
            return (
              <div
                key={harita.id}
                onClick={() => haritaSec(harita.id)}
                className={`group relative flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer tactile-card ${
                  aktif
                    ? "bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 font-bold shadow-xs ring-1 ring-indigo-500/10"
                    : "bg-white dark:bg-slate-800/80 hover:bg-slate-50/90 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 shadow-2xs"
                }`}
              >
                {/* Aktif Harita Sol Renkli Belirteç Çubuğu */}
                {aktif && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r-full" />
                )}

                <div className="flex-1 min-w-0 pr-2 pl-2 flex items-start gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      aktif
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 group-hover:bg-slate-200/70 dark:group-hover:bg-slate-600"
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5" />
                  </span>
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div
                      className={`text-xs leading-snug truncate ${
                        aktif
                          ? "font-bold text-indigo-950 dark:text-indigo-200"
                          : "font-semibold text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {harita.baslik}
                    </div>
                    {harita.aciklama && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                        {harita.aciklama}
                      </div>
                    )}
                  </div>
                </div>

                {silinecekHaritaId === harita.id ? (
                  <div
                    ref={silinecekHaritaRef}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 shrink-0 animate-in fade-in duration-150 z-10"
                  >
                    <button
                      type="button"
                      disabled={siliniyor}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setSiliniyor(true);
                        try {
                          await haritaSil(harita.id);
                          setSilinecekHaritaId(null);
                        } finally {
                          setSiliniyor(false);
                        }
                      }}
                      className="px-2 py-1 text-[11px] font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-2xs flex items-center gap-1 transition-colors cursor-pointer btn-tactile disabled:opacity-50"
                    >
                      {siliniyor ? (
                        <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <Check className="w-3 h-3 stroke-[2.2]" />
                          <span>Sil</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSilinecekHaritaId(null);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                      title="Vazgeç"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSilinecekHaritaId(harita.id);
                    }}
                    title="Haritayı Sil"
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition-all shrink-0 cursor-pointer btn-tactile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Alt Kısım (Footer) */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-2xs" />
            Backend Bağlı
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-mono">v1.0.0</span>
        </div>
      </div>

      {/* Manuel Yeniden Boyutlandırma Sürükleme Çubuğu (Resizable Drag Handle) */}
      {acik && (
        <div
          onMouseDown={suruklemeyiBaslat}
          title="Sidebar genişliğini ayarlamak için sürükleyin"
          className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-indigo-500/30 active:bg-indigo-600 transition-colors z-30 group flex items-center justify-center select-none"
        >
          <div className="w-0.5 h-8 bg-slate-300 group-hover:bg-indigo-500 group-active:bg-indigo-600 rounded-full transition-colors" />
        </div>
      )}
    </aside>
  );
};

export default SidebarPanel;
