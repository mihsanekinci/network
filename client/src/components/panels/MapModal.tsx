import React, { useState } from "react";
import { Map, X, Plus, FileText } from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";

interface HaritaModaliOzellikleri {
  acik: boolean;
  kapat: () => void;
}

export const MapModal: React.FC<HaritaModaliOzellikleri> = ({ acik, kapat }) => {
  const { haritaOlustur, yukleniyor } = useHaritaStore();
  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");

  if (!acik) return null;

  const formuGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baslik.trim() || yukleniyor) return;

    const sonuc = await haritaOlustur({
      baslik: baslik.trim(),
      aciklama: aciklama.trim() || undefined,
    });

    if (sonuc) {
      setBaslik("");
      setAciklama("");
      kapat();
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) kapat();
      }}
      className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="glass-floating rounded-2xl w-full max-w-md p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Map className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">Yeni Harita Oluştur</h3>
              <p className="text-[11px] text-slate-400 font-medium">Yeni bir ağ analiz tuvali başlatın</p>
            </div>
          </div>
          <button
            type="button"
            onClick={kapat}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer btn-tactile"
            title="Kapat (ESC)"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        <form onSubmit={formuGonder} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                Harita Başlığı <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              placeholder="Örn: 2026 Staj & Ekip Network Ağı"
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Açıklama</span>
              <span className="text-slate-400 font-normal text-[11px]">(İsteğe bağlı)</span>
            </label>
            <textarea
              rows={3}
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Haritanın amacı, kapsamı veya genel notları..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[90px] leading-relaxed shadow-2xs text-slate-800 placeholder:text-slate-400 resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={kapat}
              className="h-9 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer btn-tactile"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={yukleniyor || !baslik.trim()}
              className="h-9 px-5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 btn-tactile"
            >
              {yukleniyor ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Haritayı Oluştur</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MapModal;
