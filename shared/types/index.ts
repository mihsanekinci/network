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

export interface ApiYaniti<T> {
  basarili: boolean;
  veri?: T;
  hata?: string;
}
