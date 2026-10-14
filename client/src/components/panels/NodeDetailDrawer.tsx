import React, { useState, useEffect, useMemo } from "react";
import { useHaritaStore } from "../../store/haritaStore";
import type { DugumDTO, DugumTuru } from "../../types";

const TUR_METADATA: Record<
  DugumTuru,
  { etiket: string; simge: string; renkSinifi: string; rozetSinifi: string }
> = {
  kisi: {
    etiket: "Kişi",
    simge: "👤",
    renkSinifi: "text-blue-700 bg-blue-50 border-blue-200",
    rozetSinifi: "bg-blue-100 text-blue-800",
  },
  kurum: {
    etiket: "Kurum",
    simge: "🏢",
    renkSinifi: "text-emerald-700 bg-emerald-50 border-emerald-200",
    rozetSinifi: "bg-emerald-100 text-emerald-800",
  },
  kavram: {
    etiket: "Kavram",
    simge: "💡",
    renkSinifi: "text-amber-700 bg-amber-50 border-amber-200",
    rozetSinifi: "bg-amber-100 text-amber-800",
  },
  diger: {
    etiket: "Diğer",
    simge: "📌",
    renkSinifi: "text-purple-700 bg-purple-50 border-purple-200",
    rozetSinifi: "bg-purple-100 text-purple-800",
  },
};

interface NodeDetailDrawerContentProps {
  dugum: DugumDTO;
}

const NodeDetailDrawerContent: React.FC<NodeDetailDrawerContentProps> = ({ dugum }) => {
  const {
    secilenDugumuAyarla,
    dugumler,
    kenarlar,
    dugumGuncelle,
    dugumSil,
    yukleniyor,
  } = useHaritaStore();

  const [etiket, setEtiket] = useState(dugum.etiket);
  const [tur, setTur] = useState<DugumTuru>(dugum.tur);
  const [ozellikler, setOzellikler] = useState<Record<string, unknown>>(
    dugum.ozellikler ? { ...dugum.ozellikler } : {}
  );
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [bildirim, setBildirim] = useState<string | null>(null);

  // ESC tuşuyla paneli kapatma
  useEffect(() => {
    const escTusuYakala = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        secilenDugumuAyarla(null);
      }
    };
    window.addEventListener("keydown", escTusuYakala);
    return () => window.removeEventListener("keydown", escTusuYakala);
  }, [secilenDugumuAyarla]);

  // Bağlantı istatistikleri ve listeleri
  const { gelenBaglantilar, gidenBaglantilar, toplamBaglantiSayisi } = useMemo(() => {
    const gelen = kenarlar
      .filter((k) => k.hedefId === dugum.id)
      .map((k) => {
        const kaynakDugum = dugumler.find((d) => d.id === k.kaynakId);
        return { ...k, bagliDugumAdi: kaynakDugum?.etiket ?? "Bilinmeyen Düğüm" };
      });

    const giden = kenarlar
      .filter((k) => k.kaynakId === dugum.id)
      .map((k) => {
        const hedefDugum = dugumler.find((d) => d.id === k.hedefId);
        return { ...k, bagliDugumAdi: hedefDugum?.etiket ?? "Bilinmeyen Düğüm" };
      });

    return {
      gelenBaglantilar: gelen,
      gidenBaglantilar: giden,
      toplamBaglantiSayisi: gelen.length + giden.length,
    };
  }, [dugum.id, kenarlar, dugumler]);

  const handleOzellikDegistir = (alan: string, deger: unknown) => {
    setOzellikler((onceki) => ({
      ...onceki,
      [alan]: deger,
    }));
  };

  const handleKaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!etiket.trim()) return;

    setKaydediliyor(true);
    setBildirim(null);

    const sonuc = await dugumGuncelle(dugum.id, {
      etiket: etiket.trim(),
      tur,
      ozellikler,
    });

    setKaydediliyor(false);
    if (sonuc) {
      setBildirim("Değişiklikler başarıyla kaydedildi.");
      setTimeout(() => setBildirim(null), 3000);
    }
  };

  const handleSil = async () => {
    const onay = window.confirm(
      `"${dugum.etiket}" düğümünü ve bağlı ${toplamBaglantiSayisi} bağlantıyı silmek istediğinizden emin misiniz?`
    );
    if (onay) {
      await dugumSil(dugum.id);
    }
  };

  const aktifTurMeta = TUR_METADATA[tur] ?? TUR_METADATA.diger;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Dışarı tıklama / Arka plan karartması */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Paneli Kapat"
        onClick={() => secilenDugumuAyarla(null)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") secilenDugumuAyarla(null);
        }}
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Sağdan Kayarak Açılan Drawer Paneli */}
      <div className="relative z-50 w-full max-w-lg bg-white shadow-2xl h-full flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
        {/* Üst Başlık & Kapatma Butonu */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{aktifTurMeta.simge}</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">Düğüm Detayı & Düzenleme</h3>
              <p className="text-xs text-slate-500 mt-0.5">ID: {dugum.id.slice(0, 8)}...</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => secilenDugumuAyarla(null)}
            title="Kapat (Esc)"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Başarı Bildirimi */}
        {bildirim && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <span>✓</span> {bildirim}
          </div>
        )}

        {/* Kaydırılabilir İçerik & Form */}
        <form onSubmit={handleKaydet} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Bağlantı İstatistikleri Kartı */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
              <span>Bağlantı Özeti</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                {toplamBaglantiSayisi} Bağlantı
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-400 font-medium">Gelen (Hedef)</div>
                <div className="font-bold text-slate-800 text-lg mt-0.5">{gelenBaglantilar.length}</div>
                {gelenBaglantilar.length > 0 && (
                  <div className="text-xs text-slate-500 mt-1 truncate" title={gelenBaglantilar.map((b) => b.bagliDugumAdi).join(", ")}>
                    {gelenBaglantilar.map((b) => b.bagliDugumAdi).join(", ")}
                  </div>
                )}
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-400 font-medium">Giden (Kaynak)</div>
                <div className="font-bold text-slate-800 text-lg mt-0.5">{gidenBaglantilar.length}</div>
                {gidenBaglantilar.length > 0 && (
                  <div className="text-xs text-slate-500 mt-1 truncate" title={gidenBaglantilar.map((b) => b.bagliDugumAdi).join(", ")}>
                    {gidenBaglantilar.map((b) => b.bagliDugumAdi).join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Temel Bilgiler: Etiket */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Düğüm Adı / Etiketi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={etiket}
              onChange={(e) => setEtiket(e.target.value)}
              placeholder="Örn: Ahmet Yılmaz"
              className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
            />
          </div>

          {/* Düğüm Türü Seçimi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Düğüm Türü
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { deger: "kisi", etiket: "👤 Kişi" },
                  { deger: "kurum", etiket: "🏢 Kurum" },
                  { deger: "kavram", etiket: "💡 Kavram" },
                  { deger: "diger", etiket: "📌 Diğer" },
                ] as const
              ).map((secenek) => (
                <button
                  type="button"
                  key={secenek.deger}
                  onClick={() => setTur(secenek.deger)}
                  className={`h-10 px-3.5 rounded-xl border text-left cursor-pointer transition-all text-xs font-semibold flex items-center justify-between ${
                    tur === secenek.deger
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-2xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{secenek.etiket}</span>
                  {tur === secenek.deger && <span className="text-indigo-600 text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Türe Özel Dinamik Alanlar */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span>{aktifTurMeta.simge}</span>
              <span>{aktifTurMeta.etiket} Özel Bilgileri</span>
            </h4>

            {/* KİŞİ ALANLARI */}
            {tur === "kisi" && (
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Unvan / Rol
                  </label>
                  <input
                    type="text"
                    value={(ozellikler.unvan as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("unvan", e.target.value)}
                    placeholder="Örn: Kıdemli Yazılım Mühendisi"
                    className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Şirket / Organizasyon
                  </label>
                  <input
                    type="text"
                    value={(ozellikler.sirket as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("sirket", e.target.value)}
                    placeholder="Örn: NetWork Labs Inc."
                    className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={(ozellikler.eposta as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("eposta", e.target.value)}
                    placeholder="ornek@sirket.com"
                    className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={(ozellikler.linkedin as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/kullanici"
                    className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={(ozellikler.telefon as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("telefon", e.target.value)}
                    placeholder="+90 555 123 4567"
                    className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Görüşme & İletişim Notları
                  </label>
                  <textarea
                    rows={3}
                    value={(ozellikler.notlar as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("notlar", e.target.value)}
                    placeholder="Tanışma vesilesi, ortak projeler, son görüşme..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs resize-none"
                  />
                </div>
              </div>
            )}

            {/* KURUM ALANLARI */}
            {tur === "kurum" && (
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Sektör / Faaliyet Alanı
                  </label>
                  <input
                    type="text"
                    value={(ozellikler.sektor as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("sektor", e.target.value)}
                    placeholder="Örn: Finans & Teknoloji"
                    className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Web Sitesi
                  </label>
                  <input
                    type="url"
                    value={(ozellikler.webSitesi as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("webSitesi", e.target.value)}
                    placeholder="https://sirket.com"
                    className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Lokasyon (Şehir / Ülke)
                  </label>
                  <input
                    type="text"
                    value={(ozellikler.lokasyon as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("lokasyon", e.target.value)}
                    placeholder="Örn: İstanbul, Türkiye"
                    className="w-full h-10 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Kurum Notları
                  </label>
                  <textarea
                    rows={3}
                    value={(ozellikler.notlar as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("notlar", e.target.value)}
                    placeholder="Şirket kültürü, iş birliği fırsatları, önemli detaylar..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs resize-none"
                  />
                </div>
              </div>
            )}

            {/* KAVRAM VEYA DİĞER ALANLARI */}
            {(tur === "kavram" || tur === "diger") && (
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    {tur === "kavram" ? "Kavram Açıklaması / Tanımı" : "Açıklama"}
                  </label>
                  <textarea
                    rows={3}
                    value={(ozellikler.aciklama as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("aciklama", e.target.value)}
                    placeholder="Bu kavram veya varlığın haritadaki anlamı ve önemi..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600">
                    Ek Notlar
                  </label>
                  <textarea
                    rows={2}
                    value={(ozellikler.notlar as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("notlar", e.target.value)}
                    placeholder="Referans kaynaklar, bağlantılı fikirler..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Alt Butonlar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSil}
            disabled={yukleniyor || kaydediliyor}
            className="h-10 px-4 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>🗑️</span> Düğümü Sil
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => secilenDugumuAyarla(null)}
              className="h-10 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={handleKaydet}
              disabled={yukleniyor || kaydediliyor || !etiket.trim()}
              className="h-10 px-5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {kaydediliyor ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Kaydet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NodeDetailDrawer: React.FC = () => {
  const { secilenDugumId, dugumler } = useHaritaStore();

  const secilenDugum = useMemo(
    () => dugumler.find((d) => d.id === secilenDugumId) ?? null,
    [dugumler, secilenDugumId]
  );

  if (!secilenDugumId || !secilenDugum) {
    return null;
  }

  return <NodeDetailDrawerContent key={secilenDugum.id} dugum={secilenDugum} />;
};

export default NodeDetailDrawer;
