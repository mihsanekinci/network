import type { LucideIcon } from "lucide-react";
import { User, Building2, Lightbulb, Component, Network } from "lucide-react";
import type { DugumTuru } from "../types";

export interface TurTasarimOzellikleri {
  tur: DugumTuru;
  etiket: string;
  simge: LucideIcon;
  renkKodu: string;
  rozet: {
    arkaPlan: string;
    metin: string;
    kenarlik: string;
    nokta: string;
  };
  kart: {
    kenarlik: string;
    hoverKenarlik: string;
    seciliHalka: string;
    vurguArkaPlan: string;
  };
  avatar: {
    gradyan: string;
    metin: string;
  };
  baglantiNoktasi: {
    renk: string;
    border: string;
  };
}

/**
 * NetWork Düğüm Türleri Tasarım Sistemi (Design Tokens)
 * Kişi, Kurum, Kavram ve Diğer için taktil, yüksek kontrastlı ve tutarlı görsel dil.
 */
export const TUR_TASARIM_TOKENLARI: Record<DugumTuru, TurTasarimOzellikleri> = {
  kisi: {
    tur: "kisi",
    etiket: "Kişi",
    simge: User,
    renkKodu: "#0284c7", // sky-600
    rozet: {
      arkaPlan: "bg-sky-50",
      metin: "text-sky-900 font-bold",
      kenarlik: "border-sky-200",
      nokta: "bg-sky-600",
    },
    kart: {
      kenarlik: "border-slate-200/90 hover:border-sky-300",
      hoverKenarlik: "hover:border-sky-300 hover:shadow-md",
      seciliHalka: "border-sky-600 ring-4 ring-sky-500/20 shadow-lg scale-[1.02]",
      vurguArkaPlan: "bg-sky-50/20",
    },
    avatar: {
      gradyan: "from-sky-500 to-indigo-600",
      metin: "text-white",
    },
    baglantiNoktasi: {
      renk: "!bg-sky-500 hover:!bg-sky-600",
      border: "!border-white",
    },
  },
  kurum: {
    tur: "kurum",
    etiket: "Kurum",
    simge: Building2,
    renkKodu: "#059669", // emerald-600
    rozet: {
      arkaPlan: "bg-emerald-50",
      metin: "text-emerald-900 font-bold",
      kenarlik: "border-emerald-200",
      nokta: "bg-emerald-600",
    },
    kart: {
      kenarlik: "border-slate-200/90 hover:border-emerald-300",
      hoverKenarlik: "hover:border-emerald-300 hover:shadow-md",
      seciliHalka: "border-emerald-600 ring-4 ring-emerald-500/20 shadow-lg scale-[1.02]",
      vurguArkaPlan: "bg-emerald-50/20",
    },
    avatar: {
      gradyan: "from-emerald-500 to-teal-600",
      metin: "text-white",
    },
    baglantiNoktasi: {
      renk: "!bg-emerald-500 hover:!bg-emerald-600",
      border: "!border-white",
    },
  },
  kavram: {
    tur: "kavram",
    etiket: "Kavram",
    simge: Lightbulb,
    renkKodu: "#d97706", // amber-600
    rozet: {
      arkaPlan: "bg-amber-50",
      metin: "text-amber-950 font-bold",
      kenarlik: "border-amber-200",
      nokta: "bg-amber-600",
    },
    kart: {
      kenarlik: "border-slate-200/90 hover:border-amber-300",
      hoverKenarlik: "hover:border-amber-300 hover:shadow-md",
      seciliHalka: "border-amber-600 ring-4 ring-amber-500/20 shadow-lg scale-[1.02]",
      vurguArkaPlan: "bg-amber-50/20",
    },
    avatar: {
      gradyan: "from-amber-500 to-orange-600",
      metin: "text-white",
    },
    baglantiNoktasi: {
      renk: "!bg-amber-500 hover:!bg-amber-600",
      border: "!border-white",
    },
  },
  diger: {
    tur: "diger",
    etiket: "Diğer",
    simge: Component,
    renkKodu: "#7c3aed", // violet-600
    rozet: {
      arkaPlan: "bg-purple-50",
      metin: "text-purple-950 font-bold",
      kenarlik: "border-purple-200",
      nokta: "bg-purple-600",
    },
    kart: {
      kenarlik: "border-slate-200/90 hover:border-purple-300",
      hoverKenarlik: "hover:border-purple-300 hover:shadow-md",
      seciliHalka: "border-purple-600 ring-4 ring-purple-500/20 shadow-lg scale-[1.02]",
      vurguArkaPlan: "bg-purple-50/20",
    },
    avatar: {
      gradyan: "from-purple-500 to-pink-600",
      metin: "text-white",
    },
    baglantiNoktasi: {
      renk: "!bg-purple-500 hover:!bg-purple-600",
      border: "!border-white",
    },
  },
};

/**
 * Filtreleme seçenekleri için liste (Tüm Türler dahil)
 */
export const FILTRE_TUR_SECENEKLERI = [
  { tur: "hepsi" as const, etiket: "Tüm Türler", simge: Network, renkKodu: "#6366f1" },
  { tur: "kisi" as const, etiket: "Kişiler", simge: User, renkKodu: "#0284c7" },
  { tur: "kurum" as const, etiket: "Kurumlar", simge: Building2, renkKodu: "#059669" },
  { tur: "kavram" as const, etiket: "Kavramlar", simge: Lightbulb, renkKodu: "#d97706" },
  { tur: "diger" as const, etiket: "Diğer", simge: Component, renkKodu: "#7c3aed" },
];
