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
    if (!secilenHaritaId || !etiket.trim() || yukleniyor) return;

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
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm">
              ✨
            </div>
            <h3 className="text-base font-bold text-slate-800">Yeni Düğüm Ekle</h3>
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
              Düğüm Adı / Etiketi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={etiket}
              onChange={(e) => setEtiket(e.target.value)}
              placeholder="Örn: Ahmet Yılmaz veya Frontend Mimarisi"
              className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Düğüm Türü
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { deger: "kisi", etiket: "👤 Kişi", aciklama: "Bağlantı veya stajyer" },
                { deger: "kurum", etiket: "🏢 Kurum", aciklama: "Şirket veya topluluk" },
                { deger: "kavram", etiket: "💡 Kavram", aciklama: "Zihin haritası / fikir" },
                { deger: "diger", etiket: "📌 Diğer", aciklama: "Genel not veya varlık" },
              ].map((secenek) => {
                const secili = tur === secenek.deger;
                return (
                  <button
                    type="button"
                    key={secenek.deger}
                    onClick={() => setTur(secenek.deger as DugumTuru)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-1 ${
                      secili
                        ? "border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between w-full">
                      <span>{secenek.etiket}</span>
                      {secili && <span className="text-indigo-600 text-xs font-bold">✓</span>}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {secenek.aciklama}
                    </div>
                  </button>
                );
              })}
            </div>
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
              disabled={yukleniyor || !etiket.trim()}
              className="h-10 px-5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {yukleniyor ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Ekleniyor...</span>
                </>
              ) : (
                "Düğümü Ekle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeModal;
