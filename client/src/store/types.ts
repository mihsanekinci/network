import type { StateCreator } from "zustand";
import type {
  HaritaDTO,
  HaritaOlusturDTO,
  HaritaGuncelleDTO,
  DugumDTO,
  DugumOlusturDTO,
  DugumGuncelleDTO,
  DugumTuru,
  KenarDTO,
  KenarOlusturDTO,
  KenarGuncelleDTO,
  HaritaPaketiDTO,
  DugumKonumGuncellemeDTO,
} from "../types";

export interface UiSlice {
  yukleniyor: boolean;
  hata: string | null;
  aramaMetni: string;
  secilenTurFiltresi: DugumTuru | "hepsi";
  vurgulananDugumIdler: Set<string>;
  vurgulananKenarIdler: Set<string>;
  otomatikDuzenlendi: boolean;
  otomatikDuzenlemeTiklamaSayisi: number;
  otomatikDuzenlemeUyarisi: string | null;
  karanlikMod: boolean;
  hatayiTemizle: () => void;
  karanlikModDegistir: () => void;
  aramaMetniniAyarla: (metin: string) => void;
  turFiltresiniAyarla: (tur: DugumTuru | "hepsi") => void;
  yolVurgula: (dugumIdler: string[], kenarIdler: string[]) => void;
  yolVurgusunuTemizle: () => void;
  otomatikDuzenlemeUyarisiAyarla: (uyari: string | null) => void;
  otomatikDuzenlemeDurumunuSifirla: () => void;
  otomatikDuzenlemeyiIsaretle: () => void;
  otomatikDuzenlemeTekrarTiklandi: () => string;
}

export interface HaritaSlice {
  secilenHaritaId: string | null;
  haritalar: HaritaDTO[];
  secilenHaritayiAyarla: (id: string | null) => void;
  haritalariAyarla: (haritalar: HaritaDTO[]) => void;
  haritalariYukle: () => Promise<void>;
  haritaSec: (id: string | null) => Promise<void>;
  haritaOlustur: (veri: HaritaOlusturDTO) => Promise<HaritaDTO | null>;
  haritaIceAktar: (paket: HaritaPaketiDTO) => Promise<HaritaDTO | null>;
  haritaGuncelle: (id: string, veri: HaritaGuncelleDTO) => Promise<HaritaDTO | null>;
  haritaSil: (id: string) => Promise<boolean>;
}

export interface DugumSlice {
  secilenDugumId: string | null;
  dugumler: DugumDTO[];
  secilenDugumuAyarla: (id: string | null) => void;
  dugumleriAyarla: (dugumler: DugumDTO[]) => void;
  dugumleriYukle: (haritaId: string) => Promise<void>;
  dugumEkle: (veri: DugumOlusturDTO) => Promise<DugumDTO | null>;
  dugumGuncelle: (id: string, veri: DugumGuncelleDTO) => Promise<DugumDTO | null>;
  dugumKonumlariTopluGuncelle: (konumlar: DugumKonumGuncellemeDTO[]) => Promise<boolean>;
  dugumSil: (id: string) => Promise<boolean>;
}

export interface KenarSlice {
  secilenKenarId: string | null;
  kenarlar: KenarDTO[];
  secilenKenariAyarla: (id: string | null) => void;
  kenarlariAyarla: (kenarlar: KenarDTO[]) => void;
  kenarlariYukle: (haritaId: string) => Promise<void>;
  kenarEkle: (veri: KenarOlusturDTO) => Promise<KenarDTO | null>;
  kenarGuncelle: (id: string, veri: KenarGuncelleDTO) => Promise<KenarDTO | null>;
  kenarSil: (id: string) => Promise<boolean>;
}

export type HaritaStore = UiSlice & HaritaSlice & DugumSlice & KenarSlice;

export type SliceCreator<T> = StateCreator<HaritaStore, [], [], T>;
