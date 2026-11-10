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
          onChange={(e) => onEtiketDegistir(e.target.value)}
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
          value={fotografUrl}
          onChange={(e) => onFotografDegistir(e.target.value)}
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
                onClick={() => onTurDegistir(secenek.deger)}
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
  );
};
