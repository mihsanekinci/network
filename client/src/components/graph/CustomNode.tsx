import React, { useMemo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Trash2, Briefcase, Building2, AlignLeft, type LucideIcon } from "lucide-react";
import type { DugumTuru } from "../../types";
import { TUR_TASARIM_TOKENLARI } from "../../constants/designTokens";

interface OzelDugumVerisi {
  id: string;
  etiket: string;
  tur: DugumTuru;
  ozellikler?: Record<string, unknown>;
  secili?: boolean;
  eslesiyor?: boolean;
  filtreAktif?: boolean;
  yolAktif?: boolean;
  yolParcasi?: boolean;
  onSil?: (id: string) => void;
}

const SLOT_YUZDELERI = ["15%", "32%", "50%", "68%", "85%"] as const;

const YON_TANIMLARI = [
  { yon: "ust", pozisyon: Position.Top, eksen: "left" },
  { yon: "sag", pozisyon: Position.Right, eksen: "top" },
  { yon: "alt", pozisyon: Position.Bottom, eksen: "left" },
  { yon: "sol", pozisyon: Position.Left, eksen: "top" },
] as const;

/**
 * NetWork Taktil Özel Düğüm Kartı (Linear / Raycast / Figma Craftmanship)
 */
export const CustomNode: React.FC<NodeProps<OzelDugumVerisi>> = ({ data, id, selected }) => {
  const turBilgisi = TUR_TASARIM_TOKENLARI[data.tur] ?? TUR_TASARIM_TOKENLARI.diger;
  const TurSimgesi = turBilgisi.simge;
  const secili = Boolean(selected || data.secili);

  const dugumuSil = (etkinlik: React.MouseEvent) => {
    etkinlik.stopPropagation();
    if (data.onSil) {
      data.onSil(id);
    }
  };

  const basHarfler = useMemo(() => {
    if (!data.etiket) return "?";
    const kelimeler = data.etiket.trim().split(/\s+/);
    if (kelimeler.length === 1) return kelimeler[0].slice(0, 2).toUpperCase();
    return (kelimeler[0][0] + kelimeler[kelimeler.length - 1][0]).toUpperCase();
  }, [data.etiket]);

  const fotografUrl = useMemo(() => {
    const hamVeri = data.ozellikler?.fotograf ?? data.ozellikler?.avatarUrl;
    return typeof hamVeri === "string" && hamVeri.trim().startsWith("http") ? hamVeri.trim() : null;
  }, [data.ozellikler]);

  const altBilgiDetayi = useMemo<{ metin: string; Simge: LucideIcon } | null>(() => {
    if (data.tur === "kisi") {
      const unvan =
        typeof data.ozellikler?.unvan === "string" ? data.ozellikler.unvan.trim() : "";
      const sirket =
        typeof data.ozellikler?.sirket === "string" ? data.ozellikler.sirket.trim() : "";
      if (unvan && sirket) return { metin: `${unvan} • ${sirket}`, Simge: Briefcase };
      if (unvan) return { metin: unvan, Simge: Briefcase };
      if (sirket) return { metin: sirket, Simge: Building2 };
    }
    if (data.tur === "kurum") {
      const sektor =
        typeof data.ozellikler?.sektor === "string" ? data.ozellikler.sektor.trim() : "";
      if (sektor) return { metin: sektor, Simge: Building2 };
    }
    if (data.tur === "kavram") {
      const aciklama =
        typeof data.ozellikler?.aciklama === "string" ? data.ozellikler.aciklama.trim() : "";
      if (aciklama) return { metin: aciklama, Simge: AlignLeft };
    }
    if (data.tur === "diger") {
      const detay =
        typeof data.ozellikler?.aciklama === "string"
          ? data.ozellikler.aciklama.trim()
          : typeof data.ozellikler?.not === "string"
          ? data.ozellikler.not.trim()
          : "";
      if (detay) return { metin: detay, Simge: AlignLeft };
    }
    return null;
  }, [data.tur, data.ozellikler]);

  const filtreDisi = Boolean(data.filtreAktif && !data.eslesiyor);
  const filtreEslesiyor = Boolean(data.filtreAktif && data.eslesiyor);

  // Kart Çerçeve Durumu (Taktil ve reaktif geri bildirim)
  let durumSinifi = `${turBilgisi.kart.kenarlik} ${turBilgisi.kart.hoverKenarlik}`;

  if (data.yolAktif) {
    if (data.yolParcasi) {
      durumSinifi =
        "border-amber-500 ring-4 ring-amber-400/35 shadow-xl scale-[1.03] z-30 bg-amber-50/30 animate-pulse";
    } else {
      durumSinifi =
        "border-slate-200/60 opacity-25 grayscale-[70%] scale-95 pointer-events-none !shadow-none";
    }
  } else if (filtreDisi) {
    durumSinifi =
      "border-slate-200/60 opacity-25 grayscale-[60%] scale-95 pointer-events-none !shadow-none";
  } else if (secili) {
    durumSinifi = `${turBilgisi.kart.seciliHalka} z-20 ${turBilgisi.kart.vurguArkaPlan}`;
  } else if (filtreEslesiyor) {
    durumSinifi = `${turBilgisi.kart.kenarlik} ring-3 ring-indigo-500/30 shadow-md scale-[1.01] ring-offset-2 ring-offset-white animate-pulse`;
  }

  // Taktil iğne ucu bağlantı noktaları (Handles)
  const baglantiNoktasiSinifi = `!w-2.5 !h-2.5 ${turBilgisi.baglantiNoktasi.renk} ${turBilgisi.baglantiNoktasi.border} !border-2 shadow-xs transition-transform duration-150 cursor-crosshair ${
    secili
      ? "!opacity-100 hover:!scale-125"
      : "opacity-0 group-hover:opacity-100 hover:!scale-125"
  }`;

  return (
    <div
      className={`min-w-56 max-w-72 tactile-card rounded-2xl border bg-white p-3.5 select-none relative group flex flex-col gap-2 cursor-pointer transition-all duration-200 ${durumSinifi}`}
    >
      {/* 4 YÖNLÜ BAĞLANTI NOKTALARI (Her kenarda 5 slot: %15, %32, %50, %68, %85) */}
      {YON_TANIMLARI.map(({ yon, pozisyon, eksen }) =>
        SLOT_YUZDELERI.map((yuzde, indeks) => {
          const slotNo = indeks + 1;
          const stil = { [eksen]: yuzde };
          return (
            <React.Fragment key={`${yon}-${slotNo}`}>
              <Handle
                type="target"
                position={pozisyon}
                id={`${yon}-hedef-${slotNo}`}
                style={stil}
                className={baglantiNoktasiSinifi}
              />
              <Handle
                type="source"
                position={pozisyon}
                id={`${yon}-kaynak-${slotNo}`}
                style={stil}
                className={baglantiNoktasiSinifi}
              />
            </React.Fragment>
          );
        })
      )}

      {/* Silme Butonu (Group-hover ile zarifçe beliren taktil buton) */}
      {data.onSil && (
        <button
          type="button"
          onClick={dugumuSil}
          title="Düğümü Sil"
          className="nodrag nopan absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-white border border-slate-200/90 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center shadow-xs transition-all duration-150 cursor-pointer z-30 active:scale-90"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* Üst Çubuk: Tür Rozeti ve Monogram/Fotoğraf Avatarı */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] leading-tight font-semibold shadow-2xs backdrop-blur-xs transition-colors ${turBilgisi.rozet.arkaPlan} ${turBilgisi.rozet.metin} ${turBilgisi.rozet.kenarlik}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${turBilgisi.rozet.nokta}`} />
          <TurSimgesi className="w-3 h-3 shrink-0" />
          <span>{turBilgisi.etiket}</span>
        </span>

        {/* Profil Fotoğrafı veya 2 Harfli Monogram Avatar */}
        {fotografUrl ? (
          <img
            src={fotografUrl}
            alt={data.etiket}
            className="w-7 h-7 rounded-full object-cover border border-slate-200/80 shadow-2xs shrink-0 ring-1 ring-slate-100"
            onError={(etkinlik) => {
              (etkinlik.currentTarget as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div
            className={`w-7 h-7 rounded-full bg-gradient-to-tr ${turBilgisi.avatar.gradyan} ${turBilgisi.avatar.metin} font-semibold text-[10px] tracking-tight flex items-center justify-center shrink-0 shadow-2xs ring-1 ring-white/20 select-none`}
            title={data.etiket}
          >
            {basHarfler}
          </div>
        )}
      </div>

      {/* Gövde: Düğüm Adı (Etiket) */}
      <div
        className="font-semibold text-slate-800 tracking-tight leading-snug line-clamp-2 text-[13px] select-text pt-0.5"
        title={data.etiket}
      >
        {data.etiket}
      </div>

      {/* Alt Bilgi: Unvan / Şirket / Sektör / Açıklama */}
      {altBilgiDetayi && (
        <div
          className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1.5 pt-0.5"
          title={altBilgiDetayi.metin}
        >
          <altBilgiDetayi.Simge className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{altBilgiDetayi.metin}</span>
        </div>
      )}
    </div>
  );
};

export default CustomNode;
