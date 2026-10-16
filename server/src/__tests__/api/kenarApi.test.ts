import { describe, it, expect, beforeAll, afterAll } from "vitest";
import uygulama from "../../index";
import prisma from "../../lib/prismaIstemcisi";
import { TestIstemcisi } from "./testIstemcisi";

describe("Kenar API Uç Noktaları Entegrasyon Testleri (/kenarlar)", () => {
  let istemci: TestIstemcisi;
  let haritaId1: string;
  let haritaId2: string;
  let dugumAId: string;
  let dugumBId: string;
  let dugumCId: string;
  let harita2DugumId: string;
  const olusturulanHaritaIdleri: string[] = [];

  beforeAll(async () => {
    istemci = new TestIstemcisi(uygulama);
    await istemci.baslat();

    // 1. Harita ve düğümleri oluştur
    const harita1Yanit = await istemci.post("/haritalar", {
      baslik: "Kenar Entegrasyon Haritası 1",
    });
    haritaId1 = harita1Yanit.govde.veri.id;
    olusturulanHaritaIdleri.push(haritaId1);

    const dugumA = await istemci.post(`/haritalar/${haritaId1}/dugumler`, {
      etiket: "Servis A",
      pozisyonX: 100,
      pozisyonY: 100,
    });
    dugumAId = dugumA.govde.veri.id;

    const dugumB = await istemci.post(`/haritalar/${haritaId1}/dugumler`, {
      etiket: "Servis B",
      pozisyonX: 200,
      pozisyonY: 200,
    });
    dugumBId = dugumB.govde.veri.id;

    const dugumC = await istemci.post(`/haritalar/${haritaId1}/dugumler`, {
      etiket: "Servis C",
      pozisyonX: 300,
      pozisyonY: 300,
    });
    dugumCId = dugumC.govde.veri.id;

    // 2. Harita ve düğümünü oluştur (çapraz harita kontrolleri için)
    const harita2Yanit = await istemci.post("/haritalar", {
      baslik: "Kenar Entegrasyon Haritası 2",
    });
    haritaId2 = harita2Yanit.govde.veri.id;
    olusturulanHaritaIdleri.push(haritaId2);

    const dugumD = await istemci.post(`/haritalar/${haritaId2}/dugumler`, {
      etiket: "Farklı Harita Servisi",
      pozisyonX: 50,
      pozisyonY: 50,
    });
    harita2DugumId = dugumD.govde.veri.id;
  });

  afterAll(async () => {
    if (olusturulanHaritaIdleri.length > 0) {
      await prisma.harita.deleteMany({
        where: { id: { in: olusturulanHaritaIdleri } },
      });
    }
    await istemci.durdur();
  });

  describe("POST /kenarlar ve POST /haritalar/:haritaId/kenarlar - Kenar Oluşturma", () => {
    it("geçerli verilerle yeni bir kenar oluşturmalı ve 201 Created dönmeli", async () => {
      const gonderilenVeri = {
        kaynakId: dugumAId,
        hedefId: dugumBId,
        etiket: "gRPC Çağrısı",
        yon: "tek_yonlu",
      };

      const yanit = await istemci.post(`/haritalar/${haritaId1}/kenarlar`, gonderilenVeri);

      expect(yanit.durum).toBe(201);
      expect(yanit.govde.basarili).toBe(true);
      expect(yanit.govde.veri.id).toBeDefined();
      expect(yanit.govde.veri.haritaId).toBe(haritaId1);
      expect(yanit.govde.veri.kaynakId).toBe(dugumAId);
      expect(yanit.govde.veri.hedefId).toBe(dugumBId);
      expect(yanit.govde.veri.etiket).toBe("gRPC Çağrısı");
      expect(yanit.govde.veri.yon).toBe("tek_yonlu");
    });

    it("yön belirtilmediğinde varsayılan olarak 'yonsuz' atanmalı", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId1}/kenarlar`, {
        kaynakId: dugumAId,
        hedefId: dugumCId,
      });

      expect(yanit.durum).toBe(201);
      expect(yanit.govde.basarili).toBe(true);
      expect(yanit.govde.veri.yon).toBe("yonsuz");
    });

    it("bağımsız /kenarlar uç noktasından gövdede haritaId ile kenar oluşturulabilmeli", async () => {
      const yanit = await istemci.post("/kenarlar", {
        haritaId: haritaId1,
        kaynakId: dugumBId,
        hedefId: dugumCId,
        etiket: "RabbitMQ Olayı",
        yon: "cift_yonlu",
      });

      expect(yanit.durum).toBe(201);
      expect(yanit.govde.basarili).toBe(true);
      expect(yanit.govde.veri.etiket).toBe("RabbitMQ Olayı");
      expect(yanit.govde.veri.yon).toBe("cift_yonlu");
    });
  });

  describe("Zod 400 Bad Request - Doğrulama Hataları", () => {
    it("geçersiz yön ('yon: gecersiz') gönderildiğinde Zod 400 Bad Request dönmeli", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId1}/kenarlar`, {
        kaynakId: dugumAId,
        hedefId: dugumBId,
        yon: "gecersiz",
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(yanit.govde.hata).toBe("Geçersiz istek verisi");
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
      expect(yanit.govde.detaylar.some((d: any) => d.alan === "yon")).toBe(true);
    });

    it("kaynak veya hedef düğüm ID eksik olduğunda Zod 400 dönmeli", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId1}/kenarlar`, {
        kaynakId: dugumAId,
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
      expect(yanit.govde.detaylar.some((d: any) => d.alan === "hedefId")).toBe(true);
    });
  });

  describe("409 Conflict - Mükerrer Kenar Bağlantısı", () => {
    it("aynı kaynak ve hedef arasında tekrar kenar eklendiğinde 409 Conflict dönmeli", async () => {
      // dugumAId -> dugumBId bağlantısı yukarıdaki ilk testte zaten oluşturuldu
      const mukerrerYanit = await istemci.post(`/haritalar/${haritaId1}/kenarlar`, {
        kaynakId: dugumAId,
        hedefId: dugumBId,
        etiket: "İkinci Mükerrer Kenar",
      });

      expect(mukerrerYanit.durum).toBe(409);
      expect(mukerrerYanit.govde).toEqual({
        basarili: false,
        hata: "Bu bağlantı zaten mevcut",
      });
    });
  });

  describe("İş Mantığı ve Doğrulama Hataları (404 Not Found & 400 Validation)", () => {
    it("olmayan bir kaynak düğüm ile kenar oluşturulmaya çalışıldığında 404 Not Found dönmeli", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId1}/kenarlar`, {
        kaynakId: "olmayan-kaynak-id-999",
        hedefId: dugumBId,
      });

      expect(yanit.durum).toBe(404);
      expect(yanit.govde).toEqual({
        basarili: false,
        hata: "Kaynak düğüm bulunamadı",
      });
    });

    it("olmayan bir hedef düğüm ile kenar oluşturulmaya çalışıldığında 404 Not Found dönmeli", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId1}/kenarlar`, {
        kaynakId: dugumAId,
        hedefId: "olmayan-hedef-id-999",
      });

      expect(yanit.durum).toBe(404);
      expect(yanit.govde).toEqual({
        basarili: false,
        hata: "Hedef düğüm bulunamadı",
      });
    });

    it("farklı haritalardaki düğümler bağlanmaya çalışıldığında 400 Bad Request dönmeli", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId1}/kenarlar`, {
        kaynakId: dugumAId,
        hedefId: harita2DugumId,
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde).toEqual({
        basarili: false,
        hata: "Kaynak ve hedef düğümler aynı haritada olmalıdır",
      });
    });
  });

  describe("Kenar CRUD Akışları (GET, PATCH, DELETE)", () => {
    it("kenarları listelemeli, kenarı güncellemeli ve silmeli", async () => {
      // 1. Kenarları listele
      const liste = await istemci.get(`/haritalar/${haritaId1}/kenarlar`);
      expect(liste.durum).toBe(200);
      expect(liste.govde.basarili).toBe(true);
      expect(Array.isArray(liste.govde.veri)).toBe(true);
      expect(liste.govde.veri.length).toBeGreaterThanOrEqual(1);

      const ilkKenar = liste.govde.veri[0];

      // 2. Kenarı güncelle
      const guncelle = await istemci.patch(`/kenarlar/${ilkKenar.id}`, {
        etiket: "Güncellenmiş Kenar Etiketi",
        yon: "cift_yonlu",
      });
      expect(guncelle.durum).toBe(200);
      expect(guncelle.govde.veri.etiket).toBe("Güncellenmiş Kenar Etiketi");
      expect(guncelle.govde.veri.yon).toBe("cift_yonlu");

      // 3. Kenarı sil
      const sil = await istemci.delete(`/kenarlar/${ilkKenar.id}`);
      expect(sil.durum).toBe(200);
      expect(sil.govde).toEqual({ basarili: true });

      // 4. Silindiğini doğrula
      const guncelListe = await istemci.get(`/haritalar/${haritaId1}/kenarlar`);
      expect(guncelListe.govde.veri.some((k: any) => k.id === ilkKenar.id)).toBe(false);
    });
  });
});
