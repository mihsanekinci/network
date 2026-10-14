import React, { useState } from "react";
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm">
              🗺️
            </div>
            <h3 className="text-base font-bold text-slate-800">Yeni Harita Oluştur</h3>
          </div>
          <button
            type="button"
            onClick={kapat}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={formuGonder} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Harita Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              placeholder="Örn: 2026 Staj Network Ağı"
              className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Açıklama (İsteğe bağlı)
            </label>
            <textarea
              rows={3}
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Haritanın amacı veya kapsamı..."
              className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[95px] leading-relaxed shadow-xs text-slate-800 placeholder:text-slate-400 resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={kapat}
              className="h-10 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={yukleniyor || !baslik.trim()}
              className="h-10 px-5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {yukleniyor ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                "Haritayı Oluştur"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MapModal;
