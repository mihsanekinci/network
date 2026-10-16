import React from "react";
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

  const haritayiSilOnayli = (e: React.MouseEvent, id: string, baslik: string) => {
    e.stopPropagation();
    const onay = window.confirm(`"${baslik}" haritasını ve tüm bağlantılarını silmek istediğinize emin misiniz?`);
    if (onay) {
      haritaSil(id);
    }
  };

  return (
    <aside
      className={`h-full bg-white flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden z-20 ${
        acik
          ? "w-80 border-r border-slate-200/80 opacity-100"
          : "w-0 border-r-0 opacity-0 pointer-events-none"
      }`}
    >
      {/* Üst Başlık & Logo */}
      <div className="p-4.5 border-b border-slate-100 flex items-center justify-between shrink-0 min-w-80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            N
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">NetWork</h1>
            <p className="text-xs text-slate-500 font-medium">Node-Edge Harita</p>
          </div>
        </div>

        {/* Kenar Çubuğunu Kapat Butonu */}
        <button
          type="button"
          onClick={kapat}
          title="Kenar Çubuğunu Gizle (⌘B)"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Yeni Harita Butonu */}
      <button
        type="button"
        onClick={yeniHaritaAc}
        className="mx-4 my-3 h-11 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shrink-0"
      >
        <span className="text-base leading-none">＋</span>
        <span>Yeni Harita Oluştur</span>
      </button>

      {/* Harita Listesi */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5">
        <div className="px-1 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Haritalar ({haritalar.length})
        </div>

        {haritalar.length === 0 && !yukleniyor && (
          <div className="text-center py-10 px-4 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Kayıtlı harita bulunmuyor. Yeni bir tane oluşturarak başlayın.
          </div>
        )}

        {haritalar.map((harita) => {
          const aktif = secilenHaritaId === harita.id;
          return (
            <div
              key={harita.id}
              onClick={() => haritaSec(harita.id)}
              className={`group relative flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                aktif
                  ? "bg-indigo-50/70 border-indigo-200 text-indigo-950 font-bold shadow-xs"
                  : "bg-white hover:bg-slate-50/90 border-slate-200/80 text-slate-700 shadow-2xs"
              }`}
            >
              {/* Aktif Harita Sol Renkli Belirteç Çubuğu */}
              {aktif && (
                <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-indigo-600 rounded-r-full" />
              )}

              <div className="flex-1 min-w-0 pr-2 pl-3 flex flex-col gap-1">
                <div className={`text-sm leading-snug truncate ${aktif ? "font-bold text-indigo-950" : "font-semibold text-slate-800"}`}>
                  {harita.baslik}
                </div>
                {harita.aciklama && (
                  <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {harita.aciklama}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => haritayiSilOnayli(e, harita.id, harita.baslik)}
                title="Haritayı Sil"
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all text-xs shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Alt Kısım (Footer) */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Backend Bağlı
        </span>
        <span className="text-slate-300 font-medium">v1.0.0</span>
      </div>
    </aside>
  );
};

export default SidebarPanel;
