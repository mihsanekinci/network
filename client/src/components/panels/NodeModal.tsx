import React, { useState } from "react";
import { useHaritaStore } from "../../store/haritaStore";
import type { DugumTuru } from "../../types";

interface DugumModaliOzellikleri {
  acik: boolean;
  kapat: () => void;
}

export const NodeModal: React.FC<DugumModaliOzellikleri> = ({ acik, kapat }) => {
  const { secilenHaritaId, dugumEkle, dugumler, yukleniyor } = useHaritaStore();
  const [etiket, setEtiket] = useState("");
  const [tur, setTur] = useState<DugumTuru>("kisi");

  if (!acik) return null;

  const formuGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secilenHaritaId || !etiket.trim()) return;

    // Yeni düğümün ekranın makul bir yerine yerleşmesi için ofset hesapla
    const mevcutSayi = dugumler.length;
    const pozisyonX = 250 + (mevcutSayi % 4) * 180;
    const pozisyonY = 150 + Math.floor(mevcutSayi / 4) * 120;

    const sonuc = await dugumEkle({
      haritaId: secilenHaritaId,
      etiket: etiket.trim(),
      tur,
      pozisyonX,
      pozisyonY,
      ozellikler: {},
    });

    if (sonuc) {
      setEtiket("");
      setTur("kisi");
      kapat();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Yeni Düğüm Ekle</h3>
          <button onClick={kapat} className="text-slate-400 hover:text-slate-600 text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={formuGonder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Düğüm Adı / Etiketi *
            </label>
            <input
              type="text"
              required
              value={etiket}
              onChange={(e) => setEtiket(e.target.value)}
              placeholder="Örn: Ahmet Yılmaz veya Frontend Mimarisi"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Düğüm Türü
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { deger: "kisi", etiket: "👤 Kişi", aciklama: "Bağlantı veya stajyer" },
                { deger: "kurum", etiket: "🏢 Kurum", aciklama: "Şirket veya topluluk" },
                { deger: "kavram", etiket: "💡 Kavram", aciklama: "Zihin haritası / fikir" },
                { deger: "diger", etiket: "📌 Diğer", aciklama: "Genel not veya varlık" },
              ].map((secenek) => (
                <button
                  type="button"
                  key={secenek.deger}
                  onClick={() => setTur(secenek.deger as DugumTuru)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    tur === secenek.deger
                      ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-600"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="font-semibold text-xs">{secenek.etiket}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{secenek.aciklama}</div>
                </button>
              ))}
            </div>
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
              disabled={yukleniyor || !etiket.trim()}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {yukleniyor ? "Ekleniyor..." : "Düğümü Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeModal;
