import React, { useState, useEffect } from "react";
import { useHaritaStore } from "../../store/haritaStore";
import type { KenarDTO, KenarYonu, DugumTuru } from "../../types";

const VARSAYILAN_ILISKI_SABLONLARI = [
  "İş Arkadaşı",
  "Referans",
  "Mentör",
  "Eski Çalışan",
  "Proje Ortağı",
  "Stajyer",
  "Danışman",
  "Yatırımcı",
  "Müşteri",
  "Bağlantılı",
];

const OZEL_SABLON_DEPOLAMA_ANAHTARI = "network_ozel_iliski_sablonlari";

const yerelSablonlariGetir = (): string[] => {
  try {
    const ham = localStorage.getItem(OZEL_SABLON_DEPOLAMA_ANAHTARI);
    if (!ham) return [];
    const cozulmus = JSON.parse(ham);
    return Array.isArray(cozulmus) ? cozulmus : [];
  } catch {
    return [];
  }
};

const yerelSablonlariKaydet = (sablonlar: string[]): void => {
  try {
    localStorage.setItem(OZEL_SABLON_DEPOLAMA_ANAHTARI, JSON.stringify(sablonlar));
  } catch {
    // Depolama hatası durumunda sessiz kal
  }
};

const YON_SECENEKLERI: {
  deger: KenarYonu;
  etiket: string;
  aciklama: string;
}[] = [
  {
    deger: "tek_yonlu",
    etiket: "➔ Tek Yönlü",
    aciklama: "Kaynaktan hedefe animasyonlu ok",
  },
  {
    deger: "cift_yonlu",
    etiket: "↔ Çift Yönlü",
    aciklama: "İki uçta da ok başı, karşılıklı ilişki",
  },
  {
    deger: "yonsuz",
    etiket: "— Yönsüz",
    aciklama: "Düz çizgi, yönsüz ilişki",
  },
];

const DUGUM_TUR_BILGILERI: Record<
  DugumTuru,
  { etiket: string; simge: string; rozet: string }
> = {
  kisi: { etiket: "Kişi", simge: "👤", rozet: "bg-blue-50 text-blue-700 border-blue-200/80" },
  kurum: { etiket: "Kurum", simge: "🏢", rozet: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
  kavram: { etiket: "Kavram", simge: "💡", rozet: "bg-amber-50 text-amber-700 border-amber-200/80" },
  diger: { etiket: "Diğer", simge: "📌", rozet: "bg-purple-50 text-purple-700 border-purple-200/80" },
};

interface EdgeModalIcerikProps {
  kenar: KenarDTO;
}

const EdgeModalIcerik: React.FC<EdgeModalIcerikProps> = ({ kenar }) => {
  const {
    secilenKenariAyarla,
    dugumler,
    kenarGuncelle,
    kenarSil,
  } = useHaritaStore();

  const kaynakDugum = dugumler.find((d) => d.id === kenar.kaynakId);
  const hedefDugum = dugumler.find((d) => d.id === kenar.hedefId);

  const [etiket, setEtiket] = useState(kenar.etiket ?? "");
  const [yon, setYon] = useState<KenarYonu>(kenar.yon ?? "tek_yonlu");
  const [silOnayGoster, setSilOnayGoster] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [siliniyor, setSiliniyor] = useState(false);
  const [ozelSablonlar, setOzelSablonlar] = useState<string[]>(yerelSablonlariGetir);
  const [yeniSablonMetni, setYeniSablonMetni] = useState("");
  const [yeniSablonGirisAcik, setYeniSablonGirisAcik] = useState(false);

  const sablonKaydetVeSec = (ad: string) => {
    const temizAd = ad.trim();
    if (!temizAd) return;
    const tumu = [...VARSAYILAN_ILISKI_SABLONLARI, ...ozelSablonlar];
    const zatenVar = tumu.some((s) => s.toLowerCase() === temizAd.toLowerCase());
    if (!zatenVar) {
      const guncel = [...ozelSablonlar, temizAd];
      setOzelSablonlar(guncel);
      yerelSablonlariKaydet(guncel);
    }
    setEtiket(temizAd);
    setYeniSablonMetni("");
    setYeniSablonGirisAcik(false);
  };

  const ozelSablonuSil = (silinecek: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const guncel = ozelSablonlar.filter((s) => s !== silinecek);
    setOzelSablonlar(guncel);
    yerelSablonlariKaydet(guncel);
  };

  // ESC tuşuyla modalı veya şablon girişini kapat
  useEffect(() => {
    const tusDinle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (yeniSablonGirisAcik) {
          e.stopPropagation();
          setYeniSablonGirisAcik(false);
          setYeniSablonMetni("");
          return;
        }
        secilenKenariAyarla(null);
      }
    };
    window.addEventListener("keydown", tusDinle);
    return () => window.removeEventListener("keydown", tusDinle);
  }, [secilenKenariAyarla, yeniSablonGirisAcik]);

  const kaynakTur = kaynakDugum?.tur ?? "diger";
  const hedefTur = hedefDugum?.tur ?? "diger";
  const kaynakBilgi = DUGUM_TUR_BILGILERI[kaynakTur] ?? DUGUM_TUR_BILGILERI.diger;
  const hedefBilgi = DUGUM_TUR_BILGILERI[hedefTur] ?? DUGUM_TUR_BILGILERI.diger;

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
        if (e.target === e.currentTarget) {
          secilenKenariAyarla(null);
        }
      }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-lg p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        {/* Başlık Barı */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-sm shadow-2xs">
              🔗
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Bağlantı Detayı & İlişki Düzenleme
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Düğümler arası ilişki tipini ve yönünü güncelleyin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => secilenKenariAyarla(null)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
            title="Kapat (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Bağlantı Uçları Kartı (Görsel Önizleme) */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-inner">
          {/* Kaynak Düğüm */}
          <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col gap-1 min-w-0">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Kaynak
            </span>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm shrink-0">{kaynakBilgi.simge}</span>
              <span
                className="text-xs font-bold text-slate-800 truncate"
                title={kaynakDugum?.etiket ?? "Bilinmeyen Düğüm"}
              >
                {kaynakDugum?.etiket ?? "Bilinmeyen Düğüm"}
              </span>
            </div>
            <span
              className={`inline-flex items-center w-fit text-[10px] font-semibold px-2 py-0.5 rounded-md border ${kaynakBilgi.rozet}`}
            >
              {kaynakBilgi.etiket}
            </span>
          </div>

          {/* İlişki ve Yön Önizleme */}
          <div className="flex flex-col items-center justify-center px-2 shrink-0">
            <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full max-w-[130px] truncate mb-1 shadow-2xs">
              {etiket.trim() || "İlişkili"}
            </div>
            <div className="text-indigo-600 font-bold text-lg leading-none">
              {yon === "tek_yonlu" && "➔"}
              {yon === "cift_yonlu" && "↔"}
              {yon === "yonsuz" && "——"}
            </div>
          </div>

          {/* Hedef Düğüm */}
          <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col gap-1 min-w-0">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Hedef
            </span>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm shrink-0">{hedefBilgi.simge}</span>
              <span
                className="text-xs font-bold text-slate-800 truncate"
                title={hedefDugum?.etiket ?? "Bilinmeyen Düğüm"}
              >
                {hedefDugum?.etiket ?? "Bilinmeyen Düğüm"}
              </span>
            </div>
            <span
              className={`inline-flex items-center w-fit text-[10px] font-semibold px-2 py-0.5 rounded-md border ${hedefBilgi.rozet}`}
            >
              {hedefBilgi.etiket}
            </span>
          </div>
        </div>

        <form onSubmit={formuGonder} className="flex flex-col gap-4">
          {/* Hızlı İlişki Şablonları */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Hızlı İlişki Şablonları
              </label>
              <button
                type="button"
                onClick={() => setYeniSablonGirisAcik((prev) => !prev)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>＋</span>
                <span>{yeniSablonGirisAcik ? "İptal" : "Yeni Şablon Ekle"}</span>
              </button>
            </div>

            {/* Yeni Şablon Ekleme Girişi */}
            {yeniSablonGirisAcik && (
              <div className="flex items-center gap-1.5 p-2 bg-indigo-50/70 border border-indigo-100 rounded-xl animate-in fade-in duration-150">
                <input
                  type="text"
                  value={yeniSablonMetni}
                  onChange={(e) => setYeniSablonMetni(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sablonKaydetVeSec(yeniSablonMetni);
                    }
                  }}
                  placeholder="Yeni şablon adı (örn: Danışman, Akraba)..."
                  className="h-8 px-3 text-xs rounded-lg border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 flex-1"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => sablonKaydetVeSec(yeniSablonMetni)}
                  disabled={!yeniSablonMetni.trim()}
                  className="h-8 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setYeniSablonGirisAcik(false);
                    setYeniSablonMetni("");
                  }}
                  className="h-8 px-2 text-xs font-semibold text-slate-500 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-0.5">
              {/* Varsayılan Şablonlar */}
              {VARSAYILAN_ILISKI_SABLONLARI.map((sablon) => {
                const secili = etiket.trim().toLowerCase() === sablon.toLowerCase();
                return (
                  <button
                    type="button"
                    key={sablon}
                    onClick={() => setEtiket(sablon)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer border ${
                      secili
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs scale-102"
                        : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200/60"
                    }`}
                  >
                    {sablon}
                  </button>
                );
              })}

              {/* Kullanıcının Eklediği Özel Şablonlar */}
              {ozelSablonlar.map((sablon) => {
                const secili = etiket.trim().toLowerCase() === sablon.toLowerCase();
                return (
                  <div
                    key={sablon}
                    className={`inline-flex items-center rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      secili
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                        : "bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 border-indigo-200/80"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setEtiket(secili ? "" : sablon)}
                      className="px-2 py-1 cursor-pointer"
                    >
                      ★ {sablon}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => ozelSablonuSil(sablon, e)}
                      title="Şablonu Sil"
                      className={`pr-1.5 pl-0.5 py-1 hover:text-red-500 cursor-pointer ${
                        secili ? "text-indigo-200" : "text-indigo-400"
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* İlişki Etiketi Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                İlişki Etiketi
              </label>
              {etiket.trim() &&
                ![...VARSAYILAN_ILISKI_SABLONLARI, ...ozelSablonlar].some(
                  (s) => s.toLowerCase() === etiket.trim().toLowerCase()
                ) && (
                  <button
                    type="button"
                    onClick={() => sablonKaydetVeSec(etiket)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>➕</span>
                    <span>"{etiket.trim()}" şablonlara ekle</span>
                  </button>
                )}
            </div>
            <input
              type="text"
              value={etiket}
              onChange={(e) => setEtiket(e.target.value)}
              placeholder="Örn: Mentörlük Etti, Referans Oldu, Eski Çalışanı..."
              className="h-11 px-4 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 shadow-2xs"
            />
          </div>

          {/* Bağlantı Yönü Seçimi */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Bağlantı Yönü
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {YON_SECENEKLERI.map((secenek) => {
                const secili = yon === secenek.deger;
                return (
                  <button
                    type="button"
                    key={secenek.deger}
                    onClick={() => setYon(secenek.deger)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                      secili
                        ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-bold text-xs">{secenek.etiket}</span>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {secenek.aciklama}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
            {/* Sol: Bağlantıyı Sil Butonu */}
            <div>
              {silOnayGoster ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-red-600 font-semibold hidden sm:inline">
                    Emin misiniz?
                  </span>
                  <button
                    type="button"
                    onClick={baglantiyiSil}
                    disabled={siliniyor}
                    className="h-10 px-3.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {siliniyor ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      "✓ Evet, Sil"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSilOnayGoster(false)}
                    className="h-10 px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Vazgeç
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSilOnayGoster(true)}
                  className="h-10 px-3.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl border border-red-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🗑️</span>
                  <span>Bağlantıyı Sil</span>
                </button>
              )}
            </div>

            {/* Sağ: Vazgeç ve Kaydet Butonları */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => secilenKenariAyarla(null)}
                className="h-10 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={kaydediliyor}
                className="h-10 px-5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {kaydediliyor ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  "💾 Kaydet"
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
