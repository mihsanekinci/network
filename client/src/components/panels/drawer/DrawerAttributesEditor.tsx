import React from "react";
import {
  FileText,
  Briefcase,
  Building,
  Mail,
  Phone,
  ExternalLink,
  Globe,
  MapPin,
} from "lucide-react";
import type { DugumTuru } from "../../../types";

interface DrawerAttributesEditorProps {
  tur: DugumTuru;
  ozellikler: Record<string, unknown>;
  onOzellikDegistir: (alan: string, deger: unknown) => void;
}

export const DrawerAttributesEditor: React.FC<DrawerAttributesEditorProps> = ({
  tur,
  ozellikler,
  onOzellikDegistir,
}) => {
  return (
    <>
      {/* 1. Kişi Özel Alanları */}
      {tur === "kisi" && (
        <div className="p-4.5 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex flex-col gap-4 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Kişi Detay ve İletişim Bilgileri</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Unvan / Rol</label>
              <input
                type="text"
                value={(ozellikler.unvan as string) ?? ""}
                onChange={(e) => onOzellikDegistir("unvan", e.target.value)}
                placeholder="Örn: Kıdemli Mühendis"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Şirket / Organizasyon</label>
              <input
                type="text"
                value={(ozellikler.sirket as string) ?? ""}
                onChange={(e) => onOzellikDegistir("sirket", e.target.value)}
                placeholder="Örn: NetWork Inc."
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400 dark:text-slate-400" />
                <span>E-posta</span>
              </label>
              <input
                type="email"
                value={(ozellikler.eposta as string) ?? ""}
                onChange={(e) => onOzellikDegistir("eposta", e.target.value)}
                placeholder="ornek@sirket.com"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400 dark:text-slate-400" />
                <span>Telefon</span>
              </label>
              <input
                type="tel"
                value={(ozellikler.telefon as string) ?? ""}
                onChange={(e) => onOzellikDegistir("telefon", e.target.value)}
                placeholder="+90 555 123 4567"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-400" />
              <span>LinkedIn URL</span>
            </label>
            <input
              type="url"
              value={(ozellikler.linkedin as string) ?? ""}
              onChange={(e) => onOzellikDegistir("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/kullanici"
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      )}

      {/* 2. Kurum Özel Alanları */}
      {tur === "kurum" && (
        <div className="p-4.5 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex flex-col gap-4 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Kurumsal Bilgiler</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Sektör / Faaliyet Alanı</label>
              <input
                type="text"
                value={(ozellikler.sektor as string) ?? ""}
                onChange={(e) => onOzellikDegistir("sektor", e.target.value)}
                placeholder="Örn: Finans & Teknoloji"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400 dark:text-slate-400" />
                <span>Web Sitesi</span>
              </label>
              <input
                type="url"
                value={(ozellikler.webSitesi as string) ?? ""}
                onChange={(e) => onOzellikDegistir("webSitesi", e.target.value)}
                placeholder="https://sirket.com"
                className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-400" />
              <span>Lokasyon (Şehir / Ülke)</span>
            </label>
            <input
              type="text"
              value={(ozellikler.lokasyon as string) ?? ""}
              onChange={(e) => onOzellikDegistir("lokasyon", e.target.value)}
              placeholder="Örn: İstanbul, Türkiye"
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      )}

      {/* 3. Kavram / Diğer Açıklama Alanı */}
      {(tur === "kavram" || tur === "diger") && (
        <div className="p-4.5 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex flex-col gap-4 shadow-2xs">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{tur === "kavram" ? "Kavram Detayları" : "Detaylar"}</span>
          </h4>

          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {tur === "kavram" ? "Kavram Açıklaması / Tanımı" : "Açıklama"}
            </label>
            <textarea
              rows={3}
              value={(ozellikler.aciklama as string) ?? ""}
              onChange={(e) => onOzellikDegistir("aciklama", e.target.value)}
              placeholder="Bu kavram veya varlığın haritadaki anlamı ve önemi..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 min-h-[90px] leading-relaxed shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-y"
            />
          </div>
        </div>
      )}

      {/* 4. Notlar Alanı */}
      <div className="p-4.5 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex flex-col gap-4 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
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
            onChange={(e) => onOzellikDegistir("notlar", e.target.value)}
            placeholder={
              tur === "kisi"
                ? "Tanışma vesilesi, ortak projeler, son görüşme..."
                : tur === "kurum"
                ? "Şirket kültürü, iş birliği fırsatları, önemli detaylar..."
                : "Referans kaynaklar, bağlantılı fikirler..."
            }
            className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 min-h-[90px] leading-relaxed shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-y"
          />
        </div>
      </div>
    </>
  );
};
