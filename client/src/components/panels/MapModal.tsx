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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Yeni Harita Oluştur</h3>
          <button onClick={kapat} className="text-slate-400 hover:text-slate-600 text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={formuGonder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Harita Başlığı *
            </label>
            <input
              type="text"
              required
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              placeholder="Örn: 2026 Staj Network Ağı"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Açıklama (İsteğe bağlı)
            </label>
            <textarea
              rows={3}
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Haritanın amacı veya kapsamı..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={kapat}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={yukleniyor || !baslik.trim()}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
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
