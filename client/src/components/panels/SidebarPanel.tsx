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
    <aside className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Üst Başlık & Logo */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            N
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-base leading-tight">NetWork</h1>
            <p className="text-[11px] text-slate-500 font-medium">Node-Edge Harita</p>
          </div>
        </div>
      </div>

      {/* Yeni Harita Butonu */}
      <div className="p-3">
        <button
          onClick={yeniHaritaAc}
          className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>＋</span> Yeni Harita Oluştur
        </button>
      </div>

      {/* Harita Listesi */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Haritalar ({haritalar.length})
        </div>

        {haritalar.length === 0 && !yukleniyor && (
          <div className="text-center py-8 px-4 text-xs text-slate-400">
            Kayıtlı harita bulunmuyor. Yeni bir tane oluşturarak başlayın.
          </div>
        )}

        {haritalar.map((harita) => {
          const aktif = secilenHaritaId === harita.id;
          return (
            <div
              key={harita.id}
              onClick={() => haritaSec(harita.id)}
              className={`group flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                aktif
                  ? "bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold shadow-xs"
                  : "text-slate-700 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div className="truncate pr-2">
                <div className="truncate">{harita.baslik}</div>
                {harita.aciklama && (
                  <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                    {harita.aciklama}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => haritayiSilOnayli(e, harita.id, harita.baslik)}
                title="Haritayı Sil"
                className="opacity-0 group-hover:opacity-100 hover:text-red-600 text-slate-400 p-1 rounded transition-all text-xs"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Alt Bilgi */}
      <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Backend Bağlı
        </span>
        <span className="text-slate-300">v1.0.0</span>
      </div>
    </aside>
  );
};

export default SidebarPanel;
