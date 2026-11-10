import React, { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";

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

interface EdgeRelationshipTemplatesProps {
  seciliEtiket: string;
  onEtiketSec: (etiket: string) => void;
}

export const EdgeRelationshipTemplates: React.FC<EdgeRelationshipTemplatesProps> = ({
  seciliEtiket,
  onEtiketSec,
}) => {
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
    onEtiketSec(temizAd);
    setYeniSablonMetni("");
    setYeniSablonGirisAcik(false);
  };

  const ozelSablonuSil = (silinecek: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const guncel = ozelSablonlar.filter((s) => s !== silinecek);
    setOzelSablonlar(guncel);
    yerelSablonlariKaydet(guncel);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700">
          Hızlı İlişki Şablonları
        </label>
        <button
          type="button"
          onClick={() => setYeniSablonGirisAcik((prev) => !prev)}
          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors btn-tactile"
        >
          <Plus className="w-3 h-3 stroke-[2.2]" />
          <span>{yeniSablonGirisAcik ? "İptal" : "Yeni Şablon"}</span>
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
            className="h-8 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer shrink-0 btn-tactile"
          >
            Ekle
          </button>
          <button
            type="button"
            onClick={() => {
              setYeniSablonGirisAcik(false);
              setYeniSablonMetni("");
            }}
            className="h-8 w-8 flex items-center justify-center text-slate-500 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0 btn-tactile"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-0.5">
        {/* Varsayılan Şablonlar */}
        {VARSAYILAN_ILISKI_SABLONLARI.map((sablon) => {
          const secili = seciliEtiket.trim().toLowerCase() === sablon.toLowerCase();
          return (
            <button
              type="button"
              key={sablon}
              onClick={() => onEtiketSec(sablon)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer border btn-tactile ${
                secili
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 shadow-2xs"
              }`}
            >
              {sablon}
            </button>
          );
        })}

        {/* Kullanıcının Eklediği Özel Şablonlar */}
        {ozelSablonlar.map((sablon) => {
          const secili = seciliEtiket.trim().toLowerCase() === sablon.toLowerCase();
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
                onClick={() => onEtiketSec(secili ? "" : sablon)}
                className="px-2 py-1 cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>{sablon}</span>
              </button>
              <button
                type="button"
                onClick={(e) => ozelSablonuSil(sablon, e)}
                title="Şablonu Sil"
                className={`pr-1.5 pl-0.5 py-1 hover:text-red-500 cursor-pointer ${
                  secili ? "text-indigo-200" : "text-indigo-400"
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
