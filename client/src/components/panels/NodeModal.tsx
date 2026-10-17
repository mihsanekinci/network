import React, { useState } from "react";
import { Sparkles, X, Plus, Image as ImageIcon, FileText } from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";
import { TUR_TASARIM_TOKENLARI } from "../../constants/designTokens";
import type { DugumTuru } from "../../types";

interface DugumModaliOzellikleri {
  acik: boolean;
  kapat: () => void;
}

const TUR_LISTESI: DugumTuru[] = ["kisi", "kurum", "kavram", "diger"];

export const NodeModal: React.FC<DugumModaliOzellikleri> = ({ acik, kapat }) => {
  const { secilenHaritaId, dugumEkle, dugumler, yukleniyor } = useHaritaStore();
  const [etiket, setEtiket] = useState("");
  const [tur, setTur] = useState<DugumTuru>("kisi");
  const [fotograf, setFotograf] = useState("");

  if (!acik) return null;

  const formuGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secilenHaritaId || !etiket.trim() || yukleniyor) return;

    // Yeni düğümün ekranın makul bir yerine yerleşmesi için ofset hesapla
    const mevcutSayi = dugumler.length;
    const pozisyonX = 250 + (mevcutSayi % 4) * 180;
    const pozisyonY = 150 + Math.floor(mevcutSayi / 4) * 120;

    const ozellikler: Record<string, unknown> = {};
    if (fotograf.trim()) {
      ozellikler.fotograf = fotograf.trim();
    }

    const sonuc = await dugumEkle({
      haritaId: secilenHaritaId,
      etiket: etiket.trim(),
      tur,
      pozisyonX,
      pozisyonY,
      ozellikler,
    });

    if (sonuc) {
      setEtiket("");
      setTur("kisi");
      setFotograf("");
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
        {/* Başlık ve Kapatma Butonu */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">
                Yeni Düğüm Ekle
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Ağınıza yeni bir aktör veya kavram tanımlayın
              </p>
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
          {/* Düğüm Adı Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                Düğüm Adı / Etiketi <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={etiket}
              onChange={(e) => setEtiket(e.target.value)}
              placeholder="Örn: Ahmet Yılmaz veya Frontend Mimarisi"
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Düğüm Türü Seçici - Şık Hap Butonlar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Düğüm Türü</label>
            <div className="grid grid-cols-2 gap-2">
              {TUR_LISTESI.map((turKodu) => {
                const token = TUR_TASARIM_TOKENLARI[turKodu];
                const secili = tur === turKodu;
                const Simge = token.simge;

                return (
                  <button
                    type="button"
                    key={turKodu}
                    onClick={() => setTur(turKodu)}
                    className={`h-11 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer btn-tactile ${
                      secili
                        ? `${token.rozet.arkaPlan} ${token.kart.seciliHalka}`
                        : "bg-white/90 border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          secili ? "bg-white/90 shadow-2xs" : "bg-slate-100"
                        }`}
                      >
                        <Simge className="w-3.5 h-3.5" style={{ color: token.renkKodu }} />
                      </span>
                      <span className={secili ? token.rozet.metin : "text-slate-700"}>
                        {token.etiket}
                      </span>
                    </span>
                    {secili && (
                      <span
                        className={`w-2 h-2 rounded-full ${token.rozet.nokta} shadow-xs shrink-0`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fotoğraf / Logo URL Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Fotoğraf / Logo URL</span>
              <span className="text-slate-400 font-normal text-[11px]">(İsteğe Bağlı)</span>
            </label>
            <input
              type="url"
              value={fotograf}
              onChange={(e) => setFotograf(e.target.value)}
              placeholder="https://example.com/profil.jpg"
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Footer Eylemleri */}
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
              disabled={yukleniyor || !etiket.trim()}
              className="h-9 px-5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 btn-tactile"
            >
              {yukleniyor ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Ekleniyor...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Düğümü Ekle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeModal;
