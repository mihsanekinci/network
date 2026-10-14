import React from "react";
import { useHaritaStore } from "../../store/haritaStore";

interface YanPanelOzellikleri {
  yeniHaritaAc: () => void;
}

export const SidebarPanel: React.FC<YanPanelOzellikleri> = ({ yeniHaritaAc }) => {
  const { haritalar, secilenHaritaId, haritaSec, haritaSil, yukleniyor } = useHaritaStore();

  const haritayiSilOnayli = (e: React.MouseEvent, id: string, baslik: string) => {
    e.stopPropagation();
    const onay = window.confirm(`"${baslik}" haritasını ve tüm bağlantılarını silmek istediğinize emin misiniz?`);
    if (onay) {
      haritaSil(id);
    }
  };

  return (
    <aside className="w-80 h-full bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Üst Başlık & Logo */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            N
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-tight">NetWork</h1>
            <p className="text-xs text-slate-500 font-medium">Node-Edge Harita</p>
          </div>
        </div>
      </div>

      {/* Yeni Harita Butonu */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={yeniHaritaAc}
          className="w-full h-10 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="text-base leading-none">＋</span>
          <span>Yeni Harita Oluştur</span>
        </button>
      </div>

      {/* Harita Listesi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
              className={`group relative flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                aktif
                  ? "bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-xs ring-1 ring-indigo-200"
                  : "bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs"
              }`}
            >
              {/* Aktif Harita Sol Renkli Belirteç Çubuğu */}
              {aktif && (
                <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-indigo-600 rounded-r-full" />
              )}

              <div className="flex-1 min-w-0 pr-2 pl-1.5 space-y-1">
                <div className={`text-sm leading-snug truncate ${aktif ? "font-bold text-indigo-950" : "font-semibold text-slate-800"}`}>
                  {harita.baslik}
                </div>
                {harita.aciklama && (
                  <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {harita.aciklama}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => haritayiSilOnayli(e, harita.id, harita.baslik)}
                title="Haritayı Sil"
                className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all text-xs shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Alt Bilgi */}
      <div className="p-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Backend Bağlı
        </span>
        <span className="text-slate-300">v1.0.0</span>
      </div>
    </aside>
  );
};

export default SidebarPanel;
