import React, { useState, useEffect } from "react";
import { Link2, X, Trash2, Save, Check } from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";
import type { KenarDTO, KenarYonu } from "../../types";
import { EdgeDirectionSelector } from "./edge/EdgeDirectionSelector";
import { EdgeRelationshipTemplates } from "./edge/EdgeRelationshipTemplates";
import { EdgeEndpointPreview } from "./edge/EdgeEndpointPreview";

interface EdgeModalIcerikProps {
  kenar: KenarDTO;
}

const EdgeModalIcerik: React.FC<EdgeModalIcerikProps> = ({ kenar }) => {
  const { secilenKenariAyarla, dugumler, kenarGuncelle, kenarSil } = useHaritaStore();

  const kaynakDugum = dugumler.find((d) => d.id === kenar.kaynakId);
  const hedefDugum = dugumler.find((d) => d.id === kenar.hedefId);

  const [etiket, setEtiket] = useState(kenar.etiket ?? "");
  const [yon, setYon] = useState<KenarYonu>(kenar.yon ?? "tek_yonlu");
  const [silOnayGoster, setSilOnayGoster] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [siliniyor, setSiliniyor] = useState(false);

  // ESC tuşuyla modalı kapat
  useEffect(() => {
    const tusDinle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        secilenKenariAyarla(null);
      }
    };
    window.addEventListener("keydown", tusDinle);
    return () => window.removeEventListener("keydown", tusDinle);
  }, [secilenKenariAyarla]);

  const formuGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kaydediliyor) return;

    setKaydediliyor(true);
    try {
      const guncel = await kenarGuncelle(kenar.id, {
        etiket: etiket.trim(),
        yon,
      });
      if (guncel) {
        secilenKenariAyarla(null);
      }
    } finally {
      setKaydediliyor(false);
    }
  };

  const baglantiyiSil = async () => {
    if (siliniyor) return;

    setSiliniyor(true);
    try {
      const basarili = await kenarSil(kenar.id);
      if (basarili) {
        secilenKenariAyarla(null);
      }
    } finally {
      setSiliniyor(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) secilenKenariAyarla(null);
      }}
      className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="glass-floating rounded-2xl w-full max-w-lg p-6 flex flex-col gap-4.5 animate-in zoom-in-95 duration-200">
        {/* Başlık Barı */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
              <Link2 className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Bağlantı Detayı & İlişki Düzenleme
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Düğümler arası ilişki tipini ve yönünü güncelleyin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => secilenKenariAyarla(null)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer btn-tactile"
            title="Kapat (ESC)"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Bağlantı Uçları Kartı (Görsel Önizleme) */}
        <EdgeEndpointPreview
          kaynakDugum={kaynakDugum}
          hedefDugum={hedefDugum}
          etiket={etiket}
          yon={yon}
        />

        <form onSubmit={formuGonder} className="flex flex-col gap-4">
          {/* Hızlı İlişki Şablonları */}
          <EdgeRelationshipTemplates
            seciliEtiket={etiket}
            onEtiketSec={(yeniEtiket) => setEtiket(yeniEtiket)}
          />

          {/* İlişki Etiketi Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">İlişki Etiketi</label>
            <input
              type="text"
              value={etiket}
              onChange={(e) => setEtiket(e.target.value)}
              placeholder="Örn: Mentörlük Etti, Referans Oldu, Eski Çalışanı..."
              className="h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
            />
          </div>

          {/* Bağlantı Yönü Seçimi */}
          <EdgeDirectionSelector yon={yon} onChange={setYon} />

          {/* Footer Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* Sol: Bağlantıyı Sil Butonu */}
            <div>
              {silOnayGoster ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-red-600 dark:text-red-400 font-semibold hidden sm:inline">
                    Emin misiniz?
                  </span>
                  <button
                    type="button"
                    onClick={baglantiyiSil}
                    disabled={siliniyor}
                    className="h-9 px-3 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1 btn-tactile"
                  >
                    {siliniyor ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.2]" />
                        <span>Evet, Sil</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSilOnayGoster(false)}
                    className="h-9 px-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer btn-tactile"
                  >
                    Vazgeç
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSilOnayGoster(true)}
                  className="h-9 px-3 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300 rounded-xl border border-red-200 dark:border-red-900/60 transition-colors cursor-pointer flex items-center gap-1.5 btn-tactile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bağlantıyı Sil</span>
                </button>
              )}
            </div>

            {/* Sağ: Vazgeç ve Kaydet Butonları */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => secilenKenariAyarla(null)}
                className="h-9 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer btn-tactile"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={kaydediliyor}
                className="h-9 px-5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 btn-tactile"
              >
                {kaydediliyor ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EdgeModal: React.FC = () => {
  const { secilenKenarId, kenarlar } = useHaritaStore();
  const secilenKenar = kenarlar.find((k) => k.id === secilenKenarId);

  if (!secilenKenarId || !secilenKenar) {
    return null;
  }

  return <EdgeModalIcerik key={secilenKenar.id} kenar={secilenKenar} />;
};

export default EdgeModal;
