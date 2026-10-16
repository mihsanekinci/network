import { describe, it, expect, beforeAll, afterAll } from "vitest";
import uygulama from "../../index";
import prisma from "../../lib/prismaIstemcisi";
import { TestIstemcisi } from "./testIstemcisi";

describe("Harita API Uç Noktaları Entegrasyon Testleri (/haritalar)", () => {
  let istemci: TestIstemcisi;
  const olusturulanHaritaIdleri: string[] = [];

  beforeAll(async () => {
    istemci = new TestIstemcisi(uygulama);
    await istemci.baslat();
  });

  afterAll(async () => {
    if (olusturulanHaritaIdleri.length > 0) {
      await prisma.harita.deleteMany({
        where: { id: { in: olusturulanHaritaIdleri } },
      });
    }
    await istemci.durdur();
  });

  describe("POST /haritalar - Harita Oluşturma", () => {
    it("geçerli verilerle yeni bir harita oluşturmalı ve 201 Created dönmeli", async () => {
      const gonderilenVeri = {
        baslik: "Mikroservis Mimarisi Entegrasyon Testi",
        aciklama: "Entegrasyon testleri için oluşturuldu",
      };

      const yanit = await istemci.post("/haritalar", gonderilenVeri);

      expect(yanit.durum).toBe(201);
      expect(yanit.govde.basarili).toBe(true);
      expect(yanit.govde.veri).toBeDefined();
      expect(yanit.govde.veri.id).toBeDefined();
      expect(yanit.govde.veri.baslik).toBe(gonderilenVeri.baslik);
      expect(yanit.govde.veri.aciklama).toBe(gonderilenVeri.aciklama);

      olusturulanHaritaIdleri.push(yanit.govde.veri.id);
    });

    it("boş başlık gönderildiğinde Zod 400 Bad Request ve detaylar dönmeli", async () => {
      const yanit = await istemci.post("/haritalar", {
        baslik: "",
        aciklama: "Açıklama mevcut",
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(yanit.govde.hata).toBe("Geçersiz istek verisi");
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
      expect(yanit.govde.detaylar.some((d: any) => d.alan === "baslik")).toBe(true);
    });

    it("100 karakterden uzun başlık gönderildiğinde Zod 400 Bad Request dönmeli", async () => {
      const uzunBaslik = "a".repeat(101);
      const yanit = await istemci.post("/haritalar", {
        baslik: uzunBaslik,
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(yanit.govde.hata).toBe("Geçersiz istek verisi");
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
      const baslikHatasi = yanit.govde.detaylar.find((d: any) => d.alan === "baslik");
      expect(baslikHatasi).toBeDefined();
      expect(baslikHatasi.mesaj).toContain("en fazla 100 karakter");
    });

    it("başlık alanı hiç gönderilmediğinde Zod 400 Bad Request dönmeli", async () => {
      const yanit = await istemci.post("/haritalar", {
        aciklama: "Başlıksız harita",
      });

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
      expect(yanit.govde.detaylar.some((d: any) => d.alan === "baslik")).toBe(true);
    });
  });

  describe("GET /haritalar/:id - Harita Getirme", () => {
    it("olmayan bir harita id'si sorgulandığında 404 Not Found dönmeli", async () => {
      const yanit = await istemci.get("/haritalar/olmayan-harita-cuid-999");

      expect(yanit.durum).toBe(404);
      expect(yanit.govde).toEqual({
        basarili: false,
        hata: "Harita bulunamadı",
      });
    });

    it("mevcut bir harita id'si sorgulandığında 200 OK ve harita verisini dönmeli", async () => {
      const olusturYaniti = await istemci.post("/haritalar", {
        baslik: "Sorgulanacak Harita",
      });
      const haritaId = olusturYaniti.govde.veri.id;
      olusturulanHaritaIdleri.push(haritaId);

      const yanit = await istemci.get(`/haritalar/${haritaId}`);

      expect(yanit.durum).toBe(200);
      expect(yanit.govde.basarili).toBe(true);
      expect(yanit.govde.veri.id).toBe(haritaId);
      expect(yanit.govde.veri.baslik).toBe("Sorgulanacak Harita");
    });
  });

  describe("GET /haritalar - Tüm Haritaları Listeleme", () => {
    it("harita listesini 200 OK ile dönmeli", async () => {
      const yanit = await istemci.get("/haritalar");

      expect(yanit.durum).toBe(200);
      expect(yanit.govde.basarili).toBe(true);
      expect(Array.isArray(yanit.govde.veri)).toBe(true);
    });

    it("/api/haritalar prefiksi ile de erişilebilmeli", async () => {
      const yanit = await istemci.get("/api/haritalar");

      expect(yanit.durum).toBe(200);
      expect(yanit.govde.basarili).toBe(true);
      expect(Array.isArray(yanit.govde.veri)).toBe(true);
    });
  });

  describe("PUT /haritalar/:id - Harita Güncelleme", () => {
    it("harita bilgilerini başarıyla güncellemeli ve 200 OK dönmeli", async () => {
      const olusturYaniti = await istemci.post("/haritalar", {
        baslik: "Güncellenecek Harita",
      });
      const haritaId = olusturYaniti.govde.veri.id;
      olusturulanHaritaIdleri.push(haritaId);

      const guncelleYaniti = await istemci.put(`/haritalar/${haritaId}`, {
        baslik: "Güncellenmiş Harita Başlığı",
        aciklama: "Yeni açıklama eklendi",
      });

      expect(guncelleYaniti.durum).toBe(200);
      expect(guncelleYaniti.govde.basarili).toBe(true);
      expect(guncelleYaniti.govde.veri.baslik).toBe("Güncellenmiş Harita Başlığı");
      expect(guncelleYaniti.govde.veri.aciklama).toBe("Yeni açıklama eklendi");
    });

    it("olmayan bir harita güncellenmeye çalışıldığında 404 dönmeli", async () => {
      const yanit = await istemci.put("/haritalar/olmayan-harita-cuid-999", {
        baslik: "Yeni Başlık",
      });

      expect(yanit.durum).toBe(404);
      expect(yanit.govde.basarili).toBe(false);
      expect(yanit.govde.hata).toBe("Harita bulunamadı");
    });
  });

  describe("DELETE /haritalar/:id - Harita Silme", () => {
    it("mevcut haritayı başarıyla silmeli ve 200 OK dönmeli", async () => {
      const olusturYaniti = await istemci.post("/haritalar", {
        baslik: "Silinecek Harita",
      });
      const haritaId = olusturYaniti.govde.veri.id;

      const silYaniti = await istemci.delete(`/haritalar/${haritaId}`);
      expect(silYaniti.durum).toBe(200);
      expect(silYaniti.govde).toEqual({ basarili: true });

      // Silindiğini doğrula
      const kontrolYaniti = await istemci.get(`/haritalar/${haritaId}`);
      expect(kontrolYaniti.durum).toBe(404);
    });
  });

  describe("POST /haritalar/ice-aktar - Harita Paketi İçe Aktarma", () => {
    it("geçerli harita paketi ile harita, düğümler ve kenarları tek seferde oluşturmalı", async () => {
      const paket = {
        surum: "1.0",
        disaAktarmaTarihi: new Date().toISOString(),
        harita: {
          baslik: "İçe Aktarılan Sistem Haritası",
          aciklama: "JSON paketinden oluşturuldu",
        },
        dugumler: [
          {
            id: "eski-dugum-1",
            etiket: "Web Arayüzü",
            tur: "kavram",
            pozisyonX: 100,
            pozisyonY: 100,
            ozellikler: { framework: "react" },
          },
          {
            id: "eski-dugum-2",
            etiket: "API Gateway",
            tur: "kurum",
            pozisyonX: 300,
            pozisyonY: 100,
          },
        ],
        kenarlar: [
          {
            kaynakId: "eski-dugum-1",
            hedefId: "eski-dugum-2",
            etiket: "HTTP İstekleri",
            yon: "tek_yonlu",
          },
        ],
      };

      const yanit = await istemci.post("/haritalar/ice-aktar", paket);

      expect(yanit.durum).toBe(201);
      expect(yanit.govde.basarili).toBe(true);
      expect(yanit.govde.veri.baslik).toBe(paket.harita.baslik);

      const yeniHaritaId = yanit.govde.veri.id;
      olusturulanHaritaIdleri.push(yeniHaritaId);

      // Düğümlerin de oluştuğunu kontrol et
      const dugumlerYaniti = await istemci.get(`/haritalar/${yeniHaritaId}/dugumler`);
      expect(dugumlerYaniti.durum).toBe(200);
      expect(dugumlerYaniti.govde.veri.length).toBe(2);

      // Kenarın da oluştuğunu kontrol et
      const kenarlarYaniti = await istemci.get(`/haritalar/${yeniHaritaId}/kenarlar`);
      expect(kenarlarYaniti.durum).toBe(200);
      expect(kenarlarYaniti.govde.veri.length).toBe(1);
      expect(kenarlarYaniti.govde.veri[0].etiket).toBe("HTTP İstekleri");
    });

    it("eksik sürüm veya harita başlığı içeren pakette Zod 400 hatası dönmeli", async () => {
      const gecersizPaket = {
        harita: {
          baslik: "",
        },
        dugumler: [],
        kenarlar: [],
      };

      const yanit = await istemci.post("/haritalar/ice-aktar", gecersizPaket);

      expect(yanit.durum).toBe(400);
      expect(yanit.govde.basarili).toBe(false);
      expect(yanit.govde.hata).toBe("Geçersiz istek verisi");
      expect(Array.isArray(yanit.govde.detaylar)).toBe(true);
    });
  });
});
