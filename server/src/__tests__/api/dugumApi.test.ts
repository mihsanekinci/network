import { describe, it, expect, beforeAll, afterAll } from "vitest";
import uygulama from "../../index";
import prisma from "../../lib/prismaIstemcisi";
import { TestIstemcisi } from "./testIstemcisi";

describe("Düğüm API Uç Noktaları Entegrasyon Testleri (/dugumler)", () => {
  let istemci: TestIstemcisi;
  let haritaId: string;
  let haritaId2: string;
  const olusturulanHaritaIdleri: string[] = [];

  beforeAll(async () => {
    istemci = new TestIstemcisi(uygulama);
    await istemci.baslat();

    // Test haritaları oluştur
    const harita1 = await istemci.post("/haritalar", {
      baslik: "Düğüm Entegrasyon Test Haritası 1",
    });
    haritaId = harita1.govde.veri.id;
    olusturulanHaritaIdleri.push(haritaId);

    const harita2 = await istemci.post("/haritalar", {
      baslik: "Düğüm Entegrasyon Test Haritası 2",
    });
    haritaId2 = harita2.govde.veri.id;
    olusturulanHaritaIdleri.push(haritaId2);
  });

  afterAll(async () => {
    if (olusturulanHaritaIdleri.length > 0) {
      await prisma.harita.deleteMany({
        where: { id: { in: olusturulanHaritaIdleri } },
      });
    }
    await istemci.durdur();
  });

  describe("POST /haritalar/:haritaId/dugumler - Nested Düğüm Oluşturma", () => {
    it("geçerli verilerle harita altına düğüm oluşturmalı ve 201 Created dönmeli", async () => {
      const gonderilen = {
        etiket: "Kullanıcı Servisi",
        tur: "kavram",
        pozisyonX: 120,
        pozisyonY: 240,
        ozellikler: { version: "v1.2", port: 8080 },
      };

      const yanit = await istemci.post(`/haritalar/${haritaId}/dugumler`, gonderilen);

      expect(yanit.durum).toBe(201);
      expect(yanit.govde.basarili).toBe(true);
      expect(yanit.govde.veri.id).toBeDefined();
      expect(yanit.govde.veri.haritaId).toBe(haritaId);
      expect(yanit.govde.veri.etiket).toBe(gonderilen.etiket);
      expect(yanit.govde.veri.tur).toBe("kavram");
      expect(yanit.govde.veri.pozisyonX).toBe(120);
      expect(yanit.govde.veri.pozisyonY).toBe(240);
      expect(yanit.govde.veri.ozellikler).toEqual({ version: "v1.2", port: 8080 });
    });

    it("tür belirtilmediğinde varsayılan olarak 'diger' türünü atamalı", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket: "Varsayılan Tür Düğümü",
        pozisyonX: 50,
        pozisyonY: 50,
      });

      expect(yanit.durum).toBe(201);
      expect(yanit.govde.basarili).toBe(true);
      expect(yanit.govde.veri.tur).toBe("diger");
    });
  });

  describe("POST /dugumler - Bağımsız Düğüm Oluşturma Uç Noktası", () => {
    it("gövdede haritaId ile doğrudan /dugumler uç noktasından düğüm oluşturulabilmeli", async () => {
      const yanit = await istemci.post("/dugumler", {
        haritaId,
        etiket: "Ödeme Servisi",
        tur: "kurum",
        pozisyonX: 300,
        pozisyonY: 400,
      });

      expect(yanit.durum).toBe(201);
      expect(yanit.govde.basarili).toBe(true);
      expect(yanit.govde.veri.etiket).toBe("Ödeme Servisi");
      expect(yanit.govde.veri.haritaId).toBe(haritaId);
    });

    it("haritaId gövdede belirtilmediğinde 400 Bad Request dönmeli", async () => {
      const yanit = await istemci.post("/dugumler", {
        etiket: "Haritasız Düğüm",
        pozisyonX: 10,
        pozisyonY: 20,
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
      expect(yanit.govde.detaylar.some((d: any) => d.alan === "haritaId")).toBe(true);
    });
  });

  describe("Zod Doğrulama Hataları (400 Bad Request)", () => {
    it("geçersiz tür ('tur: gecersiz') gönderildiğinde Zod 400 dönmeli", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket: "Hatalı Tür Düğümü",
        tur: "gecersiz",
        pozisyonX: 100,
        pozisyonY: 100,
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(yanit.govde.hata).toBe("Geçersiz istek verisi");
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
      expect(yanit.govde.detaylar.some((d: any) => d.alan === "tur")).toBe(true);
    });

    it("boş etiket gönderildiğinde Zod 400 Bad Request dönmeli", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket: "   ",
        pozisyonX: 10,
        pozisyonY: 10,
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
      expect(yanit.govde.detaylar.some((d: any) => d.alan === "etiket")).toBe(true);
    });

    it("pozisyon koordinatları eksik gönderildiğinde Zod 400 Bad Request dönmeli", async () => {
      const yanit = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket: "Koordinatsız Düğüm",
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
      expect(
        yanit.govde.detaylar.some((d: any) => d.alan === "pozisyonX" || d.alan === "pozisyonY")
      ).toBe(true);
    });
  });

  describe("409 Conflict - Mükerrer Etiket Kuralı", () => {
    it("aynı harita içinde aynı etiketle ikinci düğüm eklendiğinde 409 Conflict dönmeli", async () => {
      const benzersizEtiket = "Mükerrer Test Etiketi";

      // 1. Düğümü ekle
      const ilkYanit = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket: benzersizEtiket,
        pozisyonX: 100,
        pozisyonY: 100,
      });
      expect(ilkYanit.durum).toBe(201);

      // 2. Aynı etiketle aynı haritaya tekrar ekle
      const mukerrerYanit = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket: benzersizEtiket,
        pozisyonX: 150,
        pozisyonY: 150,
      });

      expect(mukerrerYanit.durum).toBe(409);
      expect(mukerrerYanit.govde).toEqual({
        basarili: false,
        hata: "Bu etiket zaten kullanılıyor",
      });
    });

    it("farklı bir harita içinde aynı etiketle düğüm başarıyla oluşturulabilmeli", async () => {
      const etiket = "Çapraz Harita Etiketi";

      // Harita 1'e ekle
      const ilk = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket,
        pozisyonX: 10,
        pozisyonY: 10,
      });
      expect(ilk.durum).toBe(201);

      // Harita 2'ye aynı etiketle ekle
      const ikinci = await istemci.post(`/haritalar/${haritaId2}/dugumler`, {
        etiket,
        pozisyonX: 20,
        pozisyonY: 20,
      });
      expect(ikinci.durum).toBe(201);
      expect(ikinci.govde.veri.etiket).toBe(etiket);
      expect(ikinci.govde.veri.haritaId).toBe(haritaId2);
    });
  });

  describe("Toplu Konum Güncelleme (PATCH /haritalar/:haritaId/dugumler/toplu-konum)", () => {
    it("birden fazla düğümün konumunu tek işlemde güncellemeli ve 200 OK dönmeli", async () => {
      // İki düğüm oluştur
      const d1 = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket: "Toplu Konum Düğüm 1",
        pozisyonX: 10,
        pozisyonY: 20,
      });
      const d2 = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket: "Toplu Konum Düğüm 2",
        pozisyonX: 30,
        pozisyonY: 40,
      });

      const d1Id = d1.govde.veri.id;
      const d2Id = d2.govde.veri.id;

      // Toplu konum güncelleme isteği gönder
      const topluYanit = await istemci.patch(`/haritalar/${haritaId}/dugumler/toplu-konum`, {
        konumlar: [
          { id: d1Id, pozisyonX: 250, pozisyonY: 350 },
          { id: d2Id, pozisyonX: 450, pozisyonY: 550 },
        ],
      });

      expect(topluYanit.durum).toBe(200);
      expect(topluYanit.govde).toEqual({ basarili: true });

      // Güncellenmiş düğümleri doğrula
      const dugumlerListesi = await istemci.get(`/haritalar/${haritaId}/dugumler`);
      expect(dugumlerListesi.durum).toBe(200);

      const guncelD1 = dugumlerListesi.govde.veri.find((d: any) => d.id === d1Id);
      const guncelD2 = dugumlerListesi.govde.veri.find((d: any) => d.id === d2Id);

      expect(guncelD1.pozisyonX).toBe(250);
      expect(guncelD1.pozisyonY).toBe(350);
      expect(guncelD2.pozisyonX).toBe(450);
      expect(guncelD2.pozisyonY).toBe(550);
    });
  });

  describe("Düğüm CRUD Akışları (GET, PATCH, DELETE)", () => {
    it("haritadaki düğümleri listeleyebilmeli, tekil düğüm güncelleyebilmeli ve silebilmeli", async () => {
      // 1. Düğüm ekle
      const olustur = await istemci.post(`/haritalar/${haritaId}/dugumler`, {
        etiket: "CRUD Düğümü",
        tur: "kisi",
        pozisyonX: 100,
        pozisyonY: 200,
      });
      const dugumId = olustur.govde.veri.id;

      // 2. Haritaya göre getir
      const liste = await istemci.get(`/haritalar/${haritaId}/dugumler`);
      expect(liste.durum).toBe(200);
      expect(liste.govde.veri.some((d: any) => d.id === dugumId)).toBe(true);

      // 3. Güncelle
      const guncelle = await istemci.patch(`/dugumler/${dugumId}`, {
        etiket: "CRUD Düğümü Güncellendi",
        pozisyonX: 180,
      });
      expect(guncelle.durum).toBe(200);
      expect(guncelle.govde.veri.etiket).toBe("CRUD Düğümü Güncellendi");
      expect(guncelle.govde.veri.pozisyonX).toBe(180);

      // 4. Sil
      const sil = await istemci.delete(`/dugumler/${dugumId}`);
      expect(sil.durum).toBe(200);
      expect(sil.govde).toEqual({ basarili: true });

      // 5. Silindiğini doğrula
      const sonListe = await istemci.get(`/haritalar/${haritaId}/dugumler`);
      expect(sonListe.govde.veri.some((d: any) => d.id === dugumId)).toBe(false);
    });
  });
});
