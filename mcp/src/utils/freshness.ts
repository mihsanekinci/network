export type TazelikDurumu = "taze" | "ilgi_bekliyor" | "uykuda" | "belirsiz";

export interface TazelikBilgisi {
  durum: TazelikDurumu;
  gecenGun: number;
  hedefAralikGun: number;
  kalanGun: number;
  etiket: string;
}

export interface EtkilesimKaydi {
  id: string;
  tarih: string; // YYYY-MM-DD
  tur: "toplanti" | "kahve_yemek" | "eposta" | "mesaj" | "arama" | "etkinlik" | "diger";
  ozet: string;
  notlar?: string;
}

export const DEFAULT_TARGET_INTERVAL_DAYS = 90;

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

export function hesaplaTazelik(
  ozellikler?: Record<string, unknown>,
  referansTarih?: string | Date
): TazelikBilgisi {
  const hedefAralikGun =
    typeof ozellikler?.hedefSiklikGun === "number" && ozellikler.hedefSiklikGun > 0
      ? ozellikler.hedefSiklikGun
      : DEFAULT_TARGET_INTERVAL_DAYS;

  const guncelTemas = enGuncelTemasTarihi(ozellikler);

  if (!guncelTemas) {
    return {
      durum: "belirsiz",
      gecenGun: -1,
      hedefAralikGun,
      kalanGun: 0,
      etiket: "Temas Yok",
    };
  }

  const refDate = referansTarih ? new Date(referansTarih) : new Date();
  const temasDate = new Date(guncelTemas);

  const refMidnight = new Date(Date.UTC(refDate.getFullYear(), refDate.getMonth(), refDate.getDate()));
  const temasMidnight = new Date(Date.UTC(temasDate.getFullYear(), temasDate.getMonth(), temasDate.getDate()));

  const farkMs = refMidnight.getTime() - temasMidnight.getTime();
  const gecenGun = Math.max(0, Math.floor(farkMs / (1000 * 60 * 60 * 24)));
  const kalanGun = hedefAralikGun - gecenGun;

  return {
    durum: durumBelirle(gecenGun, hedefAralikGun),
    gecenGun,
    hedefAralikGun,
    kalanGun,
    etiket: etiketFormatla(gecenGun, hedefAralikGun),
  };
}
