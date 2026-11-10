import React, { useState, useMemo } from "react";
import { Sparkles, X, Plus, Image as ImageIcon, FileText, Layers } from "lucide-react";
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
  const [kume, setKume] = useState("");

  const mevcutKumeler = useMemo(() => {
    const kumeSeti = new Set<string>();
    for (const d of dugumler) {
      const k = d.ozellikler?.kume;
      if (typeof k === "string" && k.trim()) {
        kumeSeti.add(k.trim());
      }
    }
    return Array.from(kumeSeti).sort();
  }, [dugumler]);

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
    if (kume.trim()) {
      ozellikler.kume = kume.trim();
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
      setKume("");
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
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Yeni Düğüm Ekle
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Ağınıza yeni bir aktör veya kavram tanımlayın
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={kapat}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer btn-tactile"
            title="Kapat (ESC)"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        <form onSubmit={formuGonder} className="flex flex-col gap-4">
          {/* Düğüm Adı Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
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
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Düğüm Türü Seçici - Şık Hap Butonlar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Düğüm Türü</label>
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
                        : "bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          secili ? "bg-white/90 dark:bg-slate-800 shadow-2xs" : "bg-slate-100 dark:bg-slate-700"
                        }`}
                      >
                        <Simge className="w-3.5 h-3.5" style={{ color: token.renkKodu }} />
                      </span>
                      <span className={secili ? token.rozet.metin : "text-slate-700 dark:text-slate-200"}>
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

          {/* Küme / Grup Input (İsteğe Bağlı) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Küme / Grup</span>
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">(İsteğe Bağlı)</span>
            </label>
            <input
              type="text"
              list="modal-kume-onerileri"
              value={kume}
              onChange={(e) => setKume(e.target.value)}
              placeholder="Örn: mayaICT Ekibi, Stajyerler, Frontend..."
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {mevcutKumeler.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Öneriler:</span>
                {mevcutKumeler.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKume(kume === k ? "" : k)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      kume === k
                        ? "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            )}
            <datalist id="modal-kume-onerileri">
              {mevcutKumeler.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </div>

          {/* Fotoğraf / Logo URL Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Fotoğraf / Logo URL</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">(İsteğe Bağlı)</span>
            </label>
            <div className="flex items-center gap-2">
              {fotograf && fotograf.trim().startsWith("http") && (
                <img
                  src={fotograf.trim()}
                  alt="Önizleme"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              )}
              <input
                type="url"
                value={fotograf}
                onChange={(e) => setFotograf(e.target.value)}
                placeholder="https://example.com/profil.jpg"
                className="flex-1 h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Footer Eylemleri */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={kapat}
              className="h-9 px-4 text-xs font-semibold text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer btn-tactile"
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
