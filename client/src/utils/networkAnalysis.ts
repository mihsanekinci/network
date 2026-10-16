import type { DugumDTO, KenarDTO, DugumTuru } from "../types";

export interface AgMetrikleri {
  toplamDugum: number;
  toplamKenar: number;
  turDagilimi: Record<DugumTuru, number>;
  yogunluk: number;
  ortalamaDerece: number;
  enKilitDugumler: Array<{
    dugum: DugumDTO;
    derece: number;
    gelenSayisi: number;
    gidenSayisi: number;
  }>;
}

export interface YolSonucu {
  bulundu: boolean;
  dugumIdleri: string[];
  kenarIdleri: string[];
  mesafe: number;
}

/**
 * Haritadaki ağın genel metriklerini ve en etkili aktörlerini hesaplar.
 */
export function hesaplaAgMetrikleri(
  dugumler: DugumDTO[],
  kenarlar: KenarDTO[]
): AgMetrikleri {
  const n = dugumler.length;
  const m = kenarlar.length;

  const turDagilimi: Record<DugumTuru, number> = {
    kisi: 0,
    kurum: 0,
    kavram: 0,
    diger: 0,
  };

  dugumler.forEach((d) => {
    turDagilimi[d.tur] = (turDagilimi[d.tur] || 0) + 1;
  });

  // Derece hesaplamaları
  const gelen = new Map<string, number>();
  const giden = new Map<string, number>();

  dugumler.forEach((d) => {
    gelen.set(d.id, 0);
    giden.set(d.id, 0);
  });

  kenarlar.forEach((k) => {
    giden.set(k.kaynakId, (giden.get(k.kaynakId) || 0) + 1);
    gelen.set(k.hedefId, (gelen.get(k.hedefId) || 0) + 1);

    if (k.yon === "cift_yonlu") {
      giden.set(k.hedefId, (giden.get(k.hedefId) || 0) + 1);
      gelen.set(k.kaynakId, (gelen.get(k.kaynakId) || 0) + 1);
    }
  });

  const dugumDereceleri = dugumler.map((d) => {
    const gidenSayisi = giden.get(d.id) || 0;
    const gelenSayisi = gelen.get(d.id) || 0;
    return {
      dugum: d,
      derece: gidenSayisi + gelenSayisi,
      gelenSayisi,
      gidenSayisi,
    };
  });

  // En yüksek dereceye sahip düğümleri sırala
  dugumDereceleri.sort((a, b) => b.derece - a.derece);

  const olasiBaglanti = n > 1 ? (n * (n - 1)) / 2 : 1;
  const yogunluk = n > 1 ? Math.min(1, Math.round((m / olasiBaglanti) * 100) / 100) : 0;
  const ortalamaDerece = n > 0 ? Math.round(((m * 2) / n) * 10) / 10 : 0;

  return {
    toplamDugum: n,
    toplamKenar: m,
    turDagilimi,
    yogunluk,
    ortalamaDerece,
    enKilitDugumler: dugumDereceleri.slice(0, 5),
  };
}

/**
 * BFS (Breadth-First Search) ile iki düğüm arasındaki en kısa yolu bulur.
 */
export function enKisaYoluBul(
  kaynakId: string,
  hedefId: string,
  dugumler: DugumDTO[],
  kenarlar: KenarDTO[]
): YolSonucu {
  if (kaynakId === hedefId) {
    return {
      bulundu: true,
      dugumIdleri: [kaynakId],
      kenarIdleri: [],
      mesafe: 0,
    };
  }

  // Komşuluk listesi: düğümId -> Array<{ hedefId: string, kenarId: string }>
  const komsuluk = new Map<string, Array<{ komsuId: string; kenarId: string }>>();
  dugumler.forEach((d) => komsuluk.set(d.id, []));

  kenarlar.forEach((k) => {
    komsuluk.get(k.kaynakId)?.push({ komsuId: k.hedefId, kenarId: k.id });

    // Çift yönlü veya yönsüz bağlantılarda ters yön de aranabilir
    if (k.yon === "cift_yonlu" || k.yon === "yonsuz") {
      komsuluk.get(k.hedefId)?.push({ komsuId: k.kaynakId, kenarId: k.id });
    }
  });

  const kuyruk: string[] = [kaynakId];
  const ziyaretEdildi = new Set<string>([kaynakId]);
  const onceki = new Map<string, { dugumId: string; kenarId: string }>();

  let bulundu = false;

  while (kuyruk.length > 0) {
    const mevcutId = kuyruk.shift()!;

    if (mevcutId === hedefId) {
      bulundu = true;
      break;
    }

    const komsular = komsuluk.get(mevcutId) || [];
    for (const { komsuId, kenarId } of komsular) {
      if (!ziyaretEdildi.has(komsuId)) {
        ziyaretEdildi.add(komsuId);
        onceki.set(komsuId, { dugumId: mevcutId, kenarId });
        kuyruk.push(komsuId);
      }
    }
  }

  if (!bulundu) {
    return {
      bulundu: false,
      dugumIdleri: [],
      kenarIdleri: [],
      mesafe: -1,
    };
  }

  // Rotayı geriye doğru yeniden oluştur
  const dugumIdleri: string[] = [];
  const kenarIdleri: string[] = [];

  let gezgin = hedefId;
  dugumIdleri.unshift(gezgin);

  while (gezgin !== kaynakId) {
    const kayit = onceki.get(gezgin);
    if (!kayit) break;
    kenarIdleri.unshift(kayit.kenarId);
    gezgin = kayit.dugumId;
    dugumIdleri.unshift(gezgin);
  }

  return {
    bulundu: true,
    dugumIdleri,
    kenarIdleri,
    mesafe: kenarIdleri.length,
  };
}
