// DTO: Data Transfer Objects — client ↔ server arası veri sözleşmesi

export interface HaritaDTO {
  id: string;
  baslik: string;
  aciklama?: string;
  olusturulmaTarihi: string;
  guncellenmeTarihi: string;
}

export interface HaritaOlusturDTO {
  baslik: string;
  aciklama?: string;
}

export interface HaritaGuncelleDTO {
  baslik?: string;
  aciklama?: string;
}

export type DugumTuru = "kisi" | "kurum" | "kavram" | "diger";

export interface DugumDTO {
  id: string;
  haritaId: string;
  etiket: string;
  tur: DugumTuru;
  pozisyonX: number;
  pozisyonY: number;
  ozellikler: Record<string, unknown>;
  olusturulmaTarihi: string;
  guncellenmeTarihi: string;
}

export interface DugumOlusturDTO {
  haritaId: string;
  etiket: string;
  tur: DugumTuru;
  pozisyonX: number;
  pozisyonY: number;
  ozellikler?: Record<string, unknown>;
}

export interface DugumGuncelleDTO {
  etiket?: string;
  tur?: DugumTuru;
  pozisyonX?: number;
  pozisyonY?: number;
  ozellikler?: Record<string, unknown>;
}

export type KenarYonu = "tek_yonlu" | "cift_yonlu" | "yonsuz";

export interface KenarDTO {
  id: string;
  haritaId: string;
  kaynakId: string;
  hedefId: string;
  etiket?: string;
  yon: KenarYonu;
  olusturulmaTarihi: string;
  guncellenmeTarihi: string;
}

export interface KenarOlusturDTO {
  haritaId: string;
  kaynakId: string;
  hedefId: string;
  etiket?: string;
  yon?: KenarYonu;
}

export interface KenarGuncelleDTO {
  etiket?: string;
  yon?: KenarYonu;
}

export interface DugumKonumGuncellemeDTO {
  id: string;
  pozisyonX: number;
  pozisyonY: number;
}

export interface HaritaPaketiDTO {
  surum: string;
  disaAktarmaTarihi: string;
  harita: {
    baslik: string;
    aciklama?: string;
  };
  dugumler: Array<{
    id?: string;
    etiket: string;
    tur: DugumTuru;
    pozisyonX: number;
    pozisyonY: number;
    ozellikler?: Record<string, unknown>;
  }>;
  kenarlar: Array<{
    id?: string;
    kaynakId: string;
    hedefId: string;
    etiket?: string;
    yon?: KenarYonu;
  }>;
}

export interface ApiYaniti<T> {
  basarili: boolean;
  veri?: T;
  hata?: string;
}

// Kişisel CRM & NetWork MCP Alanları

export type IletisimUslubu = "resmi" | "yari_resmi" | "samimi" | "akademik" | "diger";

export type EtkilesimTuru =
  | "kahve_yemek"
  | "toplanti"
  | "eposta"
  | "mesaj"
  | "arama"
  | "etkinlik"
  | "diger";

export interface EtkilesimKaydi {
  id: string;
  tarih: string; // YYYY-MM-DD
  tur: EtkilesimTuru;
  ozet: string;
  notlar?: string;
}

export type TazelikDurumu = "taze" | "ilgi_bekliyor" | "uykuda" | "belirsiz";

export interface TazelikBilgisi {
  durum: TazelikDurumu;
  gecenGun: number | null;
  hedefAralikGun: number;
  kalanGun: number | null;
  etiket: string;
}


