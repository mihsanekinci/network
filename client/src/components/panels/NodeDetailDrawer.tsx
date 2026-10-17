import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Trash2,
  Save,
  ArrowUpRight,
  ArrowDownLeft,
  Link2,
  Check,
  FileText,
  Mail,
  Phone,
  Briefcase,
  Building,
  Globe,
  MapPin,
  ExternalLink,
  Copy,
} from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";
import { TUR_TASARIM_TOKENLARI } from "../../constants/designTokens";
import type { DugumDTO, DugumTuru } from "../../types";

const TUR_SECENEKLERI: {
  deger: DugumTuru;
  aciklama: string;
}[] = [
  { deger: "kisi", aciklama: "Bağlantı veya stajyer" },
  { deger: "kurum", aciklama: "Şirket veya topluluk" },
  { deger: "kavram", aciklama: "Zihin haritası / fikir" },
  { deger: "diger", aciklama: "Genel not veya varlık" },
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
  const [idKopyalandi, setIdKopyalandi] = useState(false);

  const handleIdKopyala = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(dugum.id);
    setIdKopyalandi(true);
    setTimeout(() => setIdKopyalandi(false), 2000);
  };

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
        return {
          ...k,
          bagliDugum: kaynakDugum,
          bagliDugumAdi: kaynakDugum?.etiket ?? "Bilinmeyen Düğüm",
        };
      });

    const giden = kenarlar
      .filter((k) => k.kaynakId === dugum.id)
      .map((k) => {
        const hedefDugum = dugumler.find((d) => d.id === k.hedefId);
        return {
          ...k,
          bagliDugum: hedefDugum,
          bagliDugumAdi: hedefDugum?.etiket ?? "Bilinmeyen Düğüm",
        };
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

  const aktifToken = TUR_TASARIM_TOKENLARI[tur] ?? TUR_TASARIM_TOKENLARI.diger;
  const AktifSimge = aktifToken.simge;

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
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Sağdan Kayarak Açılan Drawer Paneli */}
      <div className="relative z-50 w-full max-w-lg bg-slate-50/80 shadow-2xl h-full flex flex-col border-l border-slate-200/90 animate-in slide-in-from-right duration-250 backdrop-blur-xl">
        {/* Üst Başlık & Kapatma Butonu */}
        <div className="p-5 border-b border-slate-200/90 flex items-center justify-between bg-white/95 backdrop-blur shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${aktifToken.avatar.gradyan} text-white shadow-xs flex items-center justify-center shrink-0`}
            >
              <AktifSimge className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">
                  {etiket.trim() || dugum.etiket || "Düğüm Detayı"}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 ${aktifToken.rozet.arkaPlan} ${aktifToken.rozet.metin} ${aktifToken.rozet.kenarlik}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${aktifToken.rozet.nokta}`} />
                  {aktifToken.etiket}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={handleIdKopyala}
                  title={`Benzersiz veritabanı CUID anahtarını kopyala: ${dugum.id}`}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100/90 hover:bg-slate-200/80 active:scale-95 border border-slate-200/80 text-[10px] font-mono text-slate-500 hover:text-slate-800 transition-all cursor-pointer btn-tactile group/id"
                >
                  <span className="text-slate-400 font-sans font-medium">ID:</span>
                  <span className="text-slate-600 font-mono font-medium">{dugum.id.slice(0, 10)}...</span>
                  {idKopyalandi ? (
                    <Check className="w-3 h-3 text-emerald-600 animate-in zoom-in" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 group-hover/id:text-slate-600 transition-colors" />
                  )}
                  {idKopyalandi && (
                    <span className="text-[10px] text-emerald-600 font-sans font-semibold">Kopyalandı!</span>
                  )}
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => secilenDugumuAyarla(null)}
            title="Kapat (Esc)"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer btn-tactile shrink-0"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Başarı Bildirimi */}
        {bildirim && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{bildirim}</span>
          </div>
        )}

        {/* Kaydırılabilir İçerik & Form Alanları */}
        <form
          id="dugum-detay-form"
          onSubmit={handleKaydet}
          className="flex-1 overflow-y-auto p-5 flex flex-col gap-4.5"
        >
          {/* 1. Bağlantı Özeti Kartı */}
          <div className="p-4.5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-3.5 shadow-2xs">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-indigo-600 stroke-[2]" />
                <span>Ağ Bağlantıları Özeti</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {toplamBaglantiSayisi} Bağlantı
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Gelen Bağlantılar */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                    <span>Gelen (Hedef)</span>
                  </div>
                  <span className="font-bold text-slate-800 text-xs bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {gelenBaglantilar.length}
                  </span>
                </div>
                {gelenBaglantilar.length > 0 ? (
                  <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {gelenBaglantilar.map((b) => (
                      <div
                        key={b.id}
                        className="p-1.5 bg-white border border-slate-200/70 rounded-lg flex items-center justify-between gap-1 text-[11px]"
                      >
                        <span className="font-medium text-slate-800 truncate" title={b.bagliDugumAdi}>
                          {b.bagliDugumAdi}
                        </span>
                        {b.etiket && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                            {b.etiket}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">Gelen bağlantı yok</div>
                )}
              </div>

              {/* Giden Bağlantılar */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5 text-sky-600 stroke-[2.2]" />
                    <span>Giden (Kaynak)</span>
                  </div>
                  <span className="font-bold text-slate-800 text-xs bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {gidenBaglantilar.length}
                  </span>
                </div>
                {gidenBaglantilar.length > 0 ? (
                  <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {gidenBaglantilar.map((b) => (
                      <div
                        key={b.id}
                        className="p-1.5 bg-white border border-slate-200/70 rounded-lg flex items-center justify-between gap-1 text-[11px]"
                      >
                        <span className="font-medium text-slate-800 truncate" title={b.bagliDugumAdi}>
                          {b.bagliDugumAdi}
                        </span>
                        {b.etiket && (
                          <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 shrink-0">
                            {b.etiket}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">Giden bağlantı yok</div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Temel Bilgiler Kartı */}
          <div className="p-4.5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Temel Bilgiler</span>
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
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Fotoğraf / Logo URL */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Fotoğraf / Logo URL <span className="text-slate-400 font-normal">(İsteğe Bağlı)</span>
              </label>
              <input
                type="url"
                value={((ozellikler.fotograf || ozellikler.avatarUrl) as string) ?? ""}
                onChange={(e) => handleOzellikDegistir("fotograf", e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Düğüm Türü Seçimi: 2 Sütunlu Kartlar (Lucide İkonlu) */}
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Düğüm Türü
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {TUR_SECENEKLERI.map((secenek) => {
                  const secili = tur === secenek.deger;
                  const token = TUR_TASARIM_TOKENLARI[secenek.deger];
                  const Simge = token.simge;
                  return (
                    <button
                      type="button"
                      key={secenek.deger}
                      onClick={() => setTur(secenek.deger)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer flex flex-col justify-between gap-1 btn-tactile ${
                        secili
                          ? `${token.rozet.arkaPlan} border-2 border-indigo-600 shadow-xs ring-2 ring-indigo-500/15`
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              secili ? "bg-white border border-slate-200/60 shadow-2xs" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Simge className="w-3.5 h-3.5" style={{ color: token.renkKodu }} />
                          </span>
                          <span className={secili ? "font-bold text-slate-900" : "font-semibold text-slate-800"}>
                            {token.etiket}
                          </span>
                        </span>
                        {secili && <Check className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />}
                      </div>
                      <span className={`text-[11px] block pl-8 ${secili ? "text-slate-600 font-medium" : "text-slate-400 font-normal"}`}>
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
            <div className="p-4.5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                <span>Kişi Detay ve İletişim Bilgileri</span>
              </h4>

              {/* Unvan ve Şirket (2 sütun) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Unvan / Rol
                  </label>
                  <input
                    type="text"
                    value={(ozellikler.unvan as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("unvan", e.target.value)}
                    placeholder="Örn: Kıdemli Mühendis"
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
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
                    placeholder="Örn: NetWork Inc."
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* E-posta ve Telefon (2 sütun) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>E-posta</span>
                  </label>
                  <input
                    type="email"
                    value={(ozellikler.eposta as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("eposta", e.target.value)}
                    placeholder="ornek@sirket.com"
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Telefon</span>
                  </label>
                  <input
                    type="tel"
                    value={(ozellikler.telefon as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("telefon", e.target.value)}
                    placeholder="+90 555 123 4567"
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* LinkedIn tam genişlik */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span>LinkedIn URL</span>
                </label>
                <input
                  type="url"
                  value={(ozellikler.linkedin as string) ?? ""}
                  onChange={(e) => handleOzellikDegistir("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/kullanici"
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {tur === "kurum" && (
            <div className="p-4.5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kurumsal Bilgiler</span>
              </h4>

              {/* Sektör ve Web Sitesi (2 sütun) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Sektör / Faaliyet Alanı
                  </label>
                  <input
                    type="text"
                    value={(ozellikler.sektor as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("sektor", e.target.value)}
                    placeholder="Örn: Finans & Teknoloji"
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>Web Sitesi</span>
                  </label>
                  <input
                    type="url"
                    value={(ozellikler.webSitesi as string) ?? ""}
                    onChange={(e) => handleOzellikDegistir("webSitesi", e.target.value)}
                    placeholder="https://sirket.com"
                    className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Lokasyon tam genişlik */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Lokasyon (Şehir / Ülke)</span>
                </label>
                <input
                  type="text"
                  value={(ozellikler.lokasyon as string) ?? ""}
                  onChange={(e) => handleOzellikDegistir("lokasyon", e.target.value)}
                  placeholder="Örn: İstanbul, Türkiye"
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {(tur === "kavram" || tur === "diger") && (
            <div className="p-4.5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>{tur === "kavram" ? "Kavram Detayları" : "Detaylar"}</span>
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
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[90px] leading-relaxed shadow-2xs text-slate-800 placeholder:text-slate-400 resize-y"
                />
              </div>
            </div>
          )}

          {/* 4. Notlar Alanı Kartı */}
          <div className="p-4.5 bg-white border border-slate-200/90 rounded-2xl flex flex-col gap-4 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {tur === "kisi"
                  ? "Görüşme ve İletişim Notları"
                  : tur === "kurum"
                  ? "Kurum Notları"
                  : "Ek Notlar"}
              </span>
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
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[90px] leading-relaxed shadow-2xs text-slate-800 placeholder:text-slate-400 resize-y"
              />
            </div>
          </div>
        </form>

        {/* 5. Alt Butonlar Barı (Drawer Footer) */}
        <div className="p-4.5 bg-white/95 backdrop-blur border-t border-slate-200/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleSil}
            disabled={yukleniyor || kaydediliyor}
            className="text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200/80 rounded-xl px-3.5 py-2.5 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 btn-tactile"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Düğümü Sil</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => secilenDugumuAyarla(null)}
              className="text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl px-4 py-2.5 cursor-pointer transition-all btn-tactile"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              form="dugum-detay-form"
              disabled={yukleniyor || kaydediliyor || !etiket.trim()}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-5 py-2.5 shadow-xs active:bg-indigo-800 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 btn-tactile"
            >
              {kaydediliyor ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
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
