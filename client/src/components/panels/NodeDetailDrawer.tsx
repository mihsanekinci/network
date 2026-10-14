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

const TUR_SECENEKLERI: {
  deger: DugumTuru;
  etiket: string;
  simge: string;
  aciklama: string;
}[] = [
  { deger: "kisi", etiket: "Kişi", simge: "👤", aciklama: "Bağlantı veya stajyer" },
  { deger: "kurum", etiket: "Kurum", simge: "🏢", aciklama: "Şirket veya topluluk" },
  { deger: "kavram", etiket: "Kavram", simge: "💡", aciklama: "Zihin haritası / fikir" },
  { deger: "diger", etiket: "Diğer", simge: "📌", aciklama: "Genel not veya varlık" },
];

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

  const handleKaydet = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!etiket.trim() || yukleniyor || kaydediliyor) return;

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
      <div className="relative z-50 w-full max-w-lg bg-slate-50/60 shadow-2xl h-full flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
        {/* Üst Başlık & Kapatma Butonu */}
        <div className="p-5 border-b border-slate-200/90 flex items-center justify-between bg-white/90 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-center text-xl">
              {aktifTurMeta.simge}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-base leading-tight">
                  {etiket.trim() || dugum.etiket || "Düğüm Detayı"}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${aktifTurMeta.rozetSinifi}`}>
                  {aktifTurMeta.etiket}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {dugum.id.slice(0, 8)}...</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => secilenDugumuAyarla(null)}
            title="Kapat (Esc)"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Başarı Bildirimi */}
        {bildirim && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in shrink-0">
            <span>✓</span> {bildirim}
          </div>
        )}

        {/* Kaydırılabilir İçerik & Form Alanları */}
        <form
          id="dugum-detay-form"
          onSubmit={handleKaydet}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
        >
          {/* 1. Bağlantı Özeti Kartı */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-xs">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🔗</span>
                <span>Bağlantı Özeti</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {toplamBaglantiSayisi} Bağlantı
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Gelen (Hedef)</span>
                  <span className="font-bold text-slate-800 text-xs bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {gelenBaglantilar.length}
                  </span>
                </div>
                {gelenBaglantilar.length > 0 ? (
                  <div
                    className="text-[11px] text-slate-600 truncate font-medium mt-1"
                    title={gelenBaglantilar.map((b) => b.bagliDugumAdi).join(", ")}
                  >
                    {gelenBaglantilar.map((b) => b.bagliDugumAdi).join(", ")}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic mt-1">Bağlantı yok</div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Giden (Kaynak)</span>
                  <span className="font-bold text-slate-800 text-xs bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {gidenBaglantilar.length}
                  </span>
                </div>
                {gidenBaglantilar.length > 0 ? (
                  <div
                    className="text-[11px] text-slate-600 truncate font-medium mt-1"
                    title={gidenBaglantilar.map((b) => b.bagliDugumAdi).join(", ")}
                  >
                    {gidenBaglantilar.map((b) => b.bagliDugumAdi).join(", ")}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic mt-1">Bağlantı yok</div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Temel Bilgiler Kartı */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-0.5">
              <span>📌</span> Temel Bilgiler
            </h4>

            {/* Düğüm Adı / Etiketi */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Düğüm Adı / Etiketi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={etiket}
                onChange={(e) => setEtiket(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Düğüm Türü Seçimi: 2 Sütunlu Kartlar */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Düğüm Türü
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TUR_SECENEKLERI.map((secenek) => {
                  const secili = tur === secenek.deger;
                  return (
                    <button
                      type="button"
                      key={secenek.deger}
                      onClick={() => setTur(secenek.deger)}
                      className={`p-3.5 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer flex flex-col justify-between gap-1 ${
                        secili
                          ? "bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs"
                          : "bg-white border-slate-200 hover:bg-slate-50/80 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-1.5">
                          <span>{secenek.simge}</span>
                          <span>{secenek.etiket}</span>
                        </span>
                        {secili && <span className="text-indigo-600 text-xs font-bold">✓</span>}
                      </div>
                      <span className="text-[11px] font-normal text-slate-500 block">
                        {secenek.aciklama}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Detay & İletişim Kartı (Türe Göre Dinamik) */}
          {tur === "kisi" && (
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-0.5">
                <span>👤</span> Kişi Detay & İletişim Bilgileri
              </h4>

              {/* Unvan ve Şirket (2 sütun) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Unvan / Rol
                  </label>
                  <input
                    type="text"
                    value={(ozellikler.unvan as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("unvan", e.target.value)}
                    placeholder="Örn: Kıdemli Yazılım Mühendisi"
                    className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Şirket / Organizasyon
                  </label>
                  <input
                    type="text"
                    value={(ozellikler.sirket as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("sirket", e.target.value)}
                    placeholder="Örn: NetWork Labs Inc."
                    className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* E-posta ve Telefon (2 sütun) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={(ozellikler.eposta as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("eposta", e.target.value)}
                    placeholder="ornek@sirket.com"
                    className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={(ozellikler.telefon as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("telefon", e.target.value)}
                    placeholder="+90 555 123 4567"
                    className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* LinkedIn tam genişlik */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={(ozellikler.linkedin as string) ?? ""}
                  onChange={(e) => handleOzellikDegistir("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/kullanici"
                  className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {tur === "kurum" && (
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-0.5">
                <span>🏢</span> Kurumsal Bilgiler
              </h4>

              {/* Sektör ve Web Sitesi (2 sütun) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Sektör / Faaliyet Alanı
                  </label>
                  <input
                    type="text"
                    value={(ozellikler.sektor as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("sektor", e.target.value)}
                    placeholder="Örn: Finans & Teknoloji"
                    className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Web Sitesi
                  </label>
                  <input
                    type="url"
                    value={(ozellikler.webSitesi as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("webSitesi", e.target.value)}
                    placeholder="https://sirket.com"
                    className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Lokasyon tam genişlik */}
              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Lokasyon (Şehir / Ülke)
                </label>
                <input
                  type="text"
                  value={(ozellikler.lokasyon as string) ?? ""}
                  onChange={(e) => handleOzellikDegistir("lokasyon", e.target.value)}
                  placeholder="Örn: İstanbul, Türkiye"
                  className="w-full h-11 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {(tur === "kavram" || tur === "diger") && (
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-xs">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-0.5">
                <span>{tur === "kavram" ? "💡" : "📌"}</span>{" "}
                {tur === "kavram" ? "Kavram Detayları" : "Detaylar"}
              </h4>

              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {tur === "kavram" ? "Kavram Açıklaması / Tanımı" : "Açıklama"}
                </label>
                <textarea
                  rows={3}
                  value={(ozellikler.aciklama as string) ?? ""}
                  onChange={(e) => handleOzellikDegistir("aciklama", e.target.value)}
                  placeholder="Bu kavram veya varlığın haritadaki anlamı ve önemi..."
                  className="w-full p-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[95px] leading-relaxed shadow-xs text-slate-800 placeholder:text-slate-400 resize-y"
                />
              </div>
            </div>
          )}

          {/* 4. Notlar Alanı Kartı */}
          <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-0.5">
              <span>📝</span>{" "}
              {tur === "kisi"
                ? "Görüşme & İletişim Notları"
                : tur === "kurum"
                ? "Kurum Notları"
                : "Ek Notlar"}
            </h4>
            <div className="flex flex-col gap-1.5">
              <textarea
                rows={3}
                value={(ozellikler.notlar as string) ?? ""}
                onChange={(e) => handleOzellikDegistir("notlar", e.target.value)}
                placeholder={
                  tur === "kisi"
                    ? "Tanışma vesilesi, ortak projeler, son görüşme..."
                    : tur === "kurum"
                    ? "Şirket kültürü, iş birliği fırsatları, önemli detaylar..."
                    : "Referans kaynaklar, bağlantılı fikirler..."
                }
                className="w-full p-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[95px] leading-relaxed shadow-xs text-slate-800 placeholder:text-slate-400 resize-y"
              />
            </div>
          </div>
        </form>

        {/* 5. Alt Butonlar Barı (Drawer Footer) */}
        <div className="p-5 pb-6 bg-slate-50/95 backdrop-blur border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleSil}
            disabled={yukleniyor || kaydediliyor}
            className="text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200/80 rounded-xl px-3.5 py-2.5 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 active:scale-98"
          >
            <span>🗑️</span> Düğümü Sil
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => secilenDugumuAyarla(null)}
              className="text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl px-4 py-2.5 cursor-pointer transition-all active:scale-98"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              form="dugum-detay-form"
              disabled={yukleniyor || kaydediliyor || !etiket.trim()}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5 py-2.5 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {kaydediliyor ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Değişiklikleri Kaydet</span>
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
