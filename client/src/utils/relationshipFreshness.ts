import type {
  EtkilesimKaydi,
  EtkilesimTuru,
  IletisimUslubu,
  TazelikBilgisi,
  TazelikDurumu,
} from "../types";

export const VARSAYILAN_HEDEF_ARALIK_GUN = 90;

export const ILETISIM_USLUBU_SECENEKLERI: Array<{
  uslup: IletisimUslubu;
  etiket: string;
  aciklama: string;
}> = [
  {
    uslup: "resmi",
    etiket: "Resmi",
    aciklama: "Kurumsal ve mesafeli hitap ('Siz', 'Sayın')",
  },
  {
    uslup: "yari_resmi",
    etiket: "Yarı Resmi",
    aciklama: "Profesyonel ama samimi ('Siz', 'Bey / Hanım')",
  },
  {
    uslup: "samimi",
    etiket: "Samimi",
    aciklama: "Rahat ve doğrudan hitap ('Sen', dostça)",
  },
  {
    uslup: "akademik",
    etiket: "Akademik",
    aciklama: "Akademik saygı çerçevesi ('Hocam', unvanlar)",
  },
  {
    uslup: "diger",
    etiket: "Özel",
    aciklama: "Kişiye veya kuruma özel tanımlanan üslup",
  },
];

export const ETKILESIM_TURU_SECENEKLERI: Array<{
  tur: EtkilesimTuru;
  etiket: string;
}> = [
  { tur: "toplanti", etiket: "Toplantı" },
  { tur: "kahve_yemek", etiket: "Kahve / Yemek" },
  { tur: "eposta", etiket: "E-posta" },
  { tur: "mesaj", etiket: "Mesaj / WhatsApp" },
  { tur: "arama", etiket: "Telefon Araması" },
  { tur: "etkinlik", etiket: "Etkinlik / Zirve" },
  { tur: "diger", etiket: "Diğer Temas" },
];

/**
 * Verilen etkileşim listesi veya doğrudan alan üzerinden en güncel temas tarihini döndürür.
 */
export function enGuncelTemasTarihi(
  ozellikler?: Record<string, unknown>
): string | null {
  if (!ozellikler) return null;

  const adayTarihler: string[] = [];
  if (typeof ozellikler.sonTemasTarihi === "string" && ozellikler.sonTemasTarihi.trim()) {
    adayTarihler.push(ozellikler.sonTemasTarihi.trim());
  }

  if (Array.isArray(ozellikler.etkilesimler)) {
    for (const item of ozellikler.etkilesimler) {
      if (item && typeof item === "object" && typeof item.tarih === "string") {
        adayTarihler.push(item.tarih.trim());
      }
    }
  }

  if (adayTarihler.length === 0) return null;
  adayTarihler.sort((a, b) => b.localeCompare(a));
  return adayTarihler[0];
}

function etiketFormatla(gecenGun: number, hedefAralikGun: number): string {
  if (gecenGun === 0) return "Bugün";
  if (gecenGun === 1) return "Dün";
  if (gecenGun < hedefAralikGun) return `${gecenGun} gün önce`;
  return `${gecenGun} gündür uykuda`;
}

function durumBelirle(gecenGun: number, hedefAralikGun: number): TazelikDurumu {
  if (gecenGun <= Math.round(hedefAralikGun * 0.65)) return "taze";
  if (gecenGun <= hedefAralikGun) return "ilgi_bekliyor";
  return "uykuda";
}

/**
 * Düğümün ilişki tazeliği metriğini hesaplar.
 */
export function hesaplaTazelik(
  ozellikler?: Record<string, unknown>,
  referansTarih?: string | Date
): TazelikBilgisi {
  const hedef =
    typeof ozellikler?.hedefTemasAraligiGun === "number" && ozellikler.hedefTemasAraligiGun > 0
      ? ozellikler.hedefTemasAraligiGun
      : VARSAYILAN_HEDEF_ARALIK_GUN;

  const sonTemas = enGuncelTemasTarihi(ozellikler);
  if (!sonTemas) {
    return {
      durum: "belirsiz",
      gecenGun: null,
      hedefAralikGun: hedef,
      kalanGun: null,
      etiket: "Temas kaydı yok",
    };
  }

  const simdi = referansTarih ? new Date(referansTarih) : new Date();
  const temas = new Date(sonTemas);
  const farkMs = simdi.getTime() - temas.getTime();
  const gecenGun = Math.max(0, Math.floor(farkMs / (1000 * 60 * 60 * 24)));
  const kalanGun = hedef - gecenGun;

  return {
    durum: durumBelirle(gecenGun, hedef),
    gecenGun,
    hedefAralikGun: hedef,
    kalanGun,
    etiket: etiketFormatla(gecenGun, hedef),
  };
}

/**
 * Yeni bir Etkileşim kaydı nesnesi üretir.
 */
export function yeniEtkilesimOlustur(
  tur: EtkilesimTuru,
  ozet: string,
  notlar?: string,
  tarih?: string
): EtkilesimKaydi {
  const bugun = new Date().toISOString().slice(0, 10);
  const rastgeleId = `etk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  return {
    id: rastgeleId,
    tarih: tarih && tarih.trim() ? tarih.trim() : bugun,
    tur,
    ozet: ozet.trim(),
    ...(notlar && notlar.trim() ? { notlar: notlar.trim() } : {}),
  };
}
