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
    if (!baslik.trim()) return;

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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-800">Yeni Harita Oluştur</h3>
          <button
            type="button"
            onClick={kapat}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={formuGonder} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Harita Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              placeholder="Örn: 2026 Staj Network Ağı"
              className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Açıklama (İsteğe bağlı)
            </label>
            <textarea
              rows={3}
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Haritanın amacı veya kapsamı..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={kapat}
              className="h-10 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={yukleniyor || !baslik.trim()}
              className="h-10 px-5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {yukleniyor ? "Oluşturuluyor..." : "Haritayı Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MapModal;
