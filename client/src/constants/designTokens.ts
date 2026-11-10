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
      arkaPlan: "bg-sky-50 dark:bg-sky-950/80",
      metin: "text-sky-900 dark:text-sky-200 font-bold",
      kenarlik: "border-sky-200 dark:border-sky-800",
      nokta: "bg-sky-600 dark:bg-sky-400",
    },
    kart: {
      kenarlik: "border-slate-200/90 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600",
      hoverKenarlik: "hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-md",
      seciliHalka: "border-sky-600 dark:border-sky-500 ring-4 ring-sky-500/20 dark:ring-sky-500/30 shadow-lg scale-[1.02]",
      vurguArkaPlan: "bg-sky-50/20 dark:bg-sky-950/30",
    },
    avatar: {
      gradyan: "from-sky-500 to-indigo-600",
      metin: "text-white",
    },
    baglantiNoktasi: {
      renk: "!bg-sky-500 hover:!bg-sky-600",
      border: "!border-white dark:!border-slate-900",
    },
  },
  kurum: {
    tur: "kurum",
    etiket: "Kurum",
    simge: Building2,
    renkKodu: "#059669", // emerald-600
    rozet: {
      arkaPlan: "bg-emerald-50 dark:bg-emerald-950/80",
      metin: "text-emerald-900 dark:text-emerald-200 font-bold",
      kenarlik: "border-emerald-200 dark:border-emerald-800",
      nokta: "bg-emerald-600 dark:bg-emerald-400",
    },
    kart: {
      kenarlik: "border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600",
      hoverKenarlik: "hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-md",
      seciliHalka: "border-emerald-600 dark:border-emerald-500 ring-4 ring-emerald-500/20 dark:ring-emerald-500/30 shadow-lg scale-[1.02]",
      vurguArkaPlan: "bg-emerald-50/20 dark:bg-emerald-950/30",
    },
    avatar: {
      gradyan: "from-emerald-500 to-teal-600",
      metin: "text-white",
    },
    baglantiNoktasi: {
      renk: "!bg-emerald-500 hover:!bg-emerald-600",
      border: "!border-white dark:!border-slate-900",
    },
  },
  kavram: {
    tur: "kavram",
    etiket: "Kavram",
    simge: Lightbulb,
    renkKodu: "#d97706", // amber-600
    rozet: {
      arkaPlan: "bg-amber-50 dark:bg-amber-950/80",
      metin: "text-amber-950 dark:text-amber-200 font-bold",
      kenarlik: "border-amber-200 dark:border-amber-800",
      nokta: "bg-amber-600 dark:bg-amber-400",
    },
    kart: {
      kenarlik: "border-slate-200/90 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600",
      hoverKenarlik: "hover:border-amber-300 dark:hover:border-amber-500 hover:shadow-md",
      seciliHalka: "border-amber-600 dark:border-amber-500 ring-4 ring-amber-500/20 dark:ring-amber-500/30 shadow-lg scale-[1.02]",
      vurguArkaPlan: "bg-amber-50/20 dark:bg-amber-950/30",
    },
    avatar: {
      gradyan: "from-amber-500 to-orange-600",
      metin: "text-white",
    },
    baglantiNoktasi: {
      renk: "!bg-amber-500 hover:!bg-amber-600",
      border: "!border-white dark:!border-slate-900",
    },
  },
  diger: {
    tur: "diger",
    etiket: "Diğer",
    simge: Component,
    renkKodu: "#7c3aed", // violet-600
    rozet: {
      arkaPlan: "bg-purple-50 dark:bg-purple-950/80",
      metin: "text-purple-950 dark:text-purple-200 font-bold",
      kenarlik: "border-purple-200 dark:border-purple-800",
      nokta: "bg-purple-600 dark:bg-purple-400",
    },
    kart: {
      kenarlik: "border-slate-200/90 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600",
      hoverKenarlik: "hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md",
      seciliHalka: "border-purple-600 dark:border-purple-500 ring-4 ring-purple-500/20 dark:ring-purple-500/30 shadow-lg scale-[1.02]",
      vurguArkaPlan: "bg-purple-50/20 dark:bg-purple-950/30",
    },
    avatar: {
      gradyan: "from-purple-500 to-pink-600",
      metin: "text-white",
    },
    baglantiNoktasi: {
      renk: "!bg-purple-500 hover:!bg-purple-600",
      border: "!border-white dark:!border-slate-900",
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
