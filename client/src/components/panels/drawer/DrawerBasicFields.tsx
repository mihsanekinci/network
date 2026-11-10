import React from "react";
import { FileText, Check } from "lucide-react";
import { TUR_TASARIM_TOKENLARI } from "../../../constants/designTokens";
import type { DugumTuru } from "../../../types";

const TUR_SECENEKLERI: {
  deger: DugumTuru;
  aciklama: string;
}[] = [
  { deger: "kisi", aciklama: "Bağlantı veya stajyer" },
  { deger: "kurum", aciklama: "Şirket veya topluluk" },
  { deger: "kavram", aciklama: "Zihin haritası / fikir" },
  { deger: "diger", aciklama: "Genel not veya varlık" },
];

interface DrawerBasicFieldsProps {
  etiket: string;
  tur: DugumTuru;
  fotografUrl: string;
  onEtiketDegistir: (yeniEtiket: string) => void;
  onTurDegistir: (yeniTur: DugumTuru) => void;
  onFotografDegistir: (yeniUrl: string) => void;
}

export const DrawerBasicFields: React.FC<DrawerBasicFieldsProps> = ({
  etiket,
  tur,
  fotografUrl,
  onEtiketDegistir,
  onTurDegistir,
  onFotografDegistir,
}) => {
  return (
    <div className="p-4.5 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex flex-col gap-4 shadow-2xs">
      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
        <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Temel Bilgiler</span>
      </h4>

      {/* Düğüm Adı / Etiketi */}
      <div className="flex flex-col gap-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Düğüm Adı / Etiketi <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={etiket}
          onChange={(e) => onEtiketDegistir(e.target.value)}
          placeholder="Örn: Ahmet Yılmaz"
          className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Fotoğraf / Logo URL */}
      <div className="flex flex-col gap-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Fotoğraf / Logo URL <span className="text-slate-400 dark:text-slate-400 font-normal">(İsteğe Bağlı)</span>
        </label>
        <input
          type="url"
          value={fotografUrl}
          onChange={(e) => onFotografDegistir(e.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600/80 bg-white dark:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-2xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Düğüm Türü Seçimi: 2 Sütunlu Kartlar (Lucide İkonlu) */}
      <div className="flex flex-col gap-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
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
                onClick={() => onTurDegistir(secenek.deger)}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer flex flex-col justify-between gap-1 btn-tactile ${
                  secili
                    ? `${token.rozet.arkaPlan} border-2 border-indigo-600 dark:border-indigo-400 shadow-xs ring-2 ring-indigo-500/15`
                    : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        secili
                          ? "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 shadow-2xs"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Simge className="w-3.5 h-3.5" style={{ color: token.renkKodu }} />
                    </span>
                    <span
                      className={
                        secili
                          ? "font-bold text-slate-900 dark:text-white"
                          : "font-semibold text-slate-800 dark:text-slate-200"
                      }
                    >
                      {token.etiket}
                    </span>
                  </span>
                  {secili && (
                    <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                  )}
                </div>
                <span
                  className={`text-[11px] block pl-8 ${
                    secili
                      ? "text-slate-600 dark:text-slate-300 font-medium"
                      : "text-slate-400 dark:text-slate-400 font-normal"
                  }`}
                >
                  {secenek.aciklama}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
