import { describe, it, expect } from "vitest";
import {
  haritaOlusturSemasi,
  haritaGuncelleSemasi,
  haritaPaketiSemasi,
} from "../haritaSchema";
import {
  dugumOlusturSemasi,
  dugumGuncelleSemasi,
  dugumTopluKonumSemasi,
} from "../dugumSchema";
import {
  kenarOlusturSemasi,
  kenarGuncelleSemasi,
} from "../kenarSchema";

describe("Zod Şema Doğrulamaları", () => {
  describe("haritaSchema", () => {
    it("geçerli harita oluşturma verisini doğrulamalı ve kırpmalı (trim)", () => {
      const sonuc = haritaOlusturSemasi.safeParse({
        baslik: "  Proje Mimarisi  ",
        aciklama: "Açıklama metni",
      });
      expect(sonuc.success).toBe(true);
      if (sonuc.success) {
        expect(sonuc.data.baslik).toBe("Proje Mimarisi");
        expect(sonuc.data.aciklama).toBe("Açıklama metni");
      }
    });

    it("boş veya sadece boşluktan oluşan başlığı reddetmeli", () => {
      const sonuc = haritaOlusturSemasi.safeParse({
        baslik: "   ",
      });
      expect(sonuc.success).toBe(false);
    });

    it("100 karakterden uzun başlığı reddetmeli", () => {
      const sonuc = haritaOlusturSemasi.safeParse({
        baslik: "a".repeat(101),
      });
      expect(sonuc.success).toBe(false);
    });

    it("500 karakterden uzun açıklamayı reddetmeli", () => {
      const sonuc = haritaOlusturSemasi.safeParse({
        baslik: "Geçerli Başlık",
        aciklama: "a".repeat(501),
      });
      expect(sonuc.success).toBe(false);
    });

    it("harita paketini eksiksiz doğrulamalı", () => {
      const sonuc = haritaPaketiSemasi.safeParse({
        surum: "1.0",
        disaAktarmaTarihi: "2026-10-16T12:00:00.000Z",
        harita: { baslik: "Test Haritası", aciklama: "Test Açıklaması" },
        dugumler: [
          {
            id: "d1",
            etiket: "Düğüm 1",
            tur: "kisi",
            pozisyonX: 100,
            pozisyonY: 200,
          },
        ],
        kenarlar: [
          {
            id: "k1",
            kaynakId: "d1",
            hedefId: "d2",
            yon: "tek_yonlu",
          },
        ],
      });
      expect(sonuc.success).toBe(true);
    });
  });

  describe("dugumSchema", () => {
    it("geçerli düğüm oluşturma verisini doğrulamalı", () => {
      const sonuc = dugumOlusturSemasi.safeParse({
        haritaId: "harita-123",
        etiket: "  React.js  ",
        tur: "kavram",
        pozisyonX: 150,
        pozisyonY: 250,
        ozellikler: { version: "19" },
      });
      expect(sonuc.success).toBe(true);
      if (sonuc.success) {
        expect(sonuc.data.etiket).toBe("React.js");
        expect(sonuc.data.tur).toBe("kavram");
      }
    });

    it("geçersiz düğüm türünü reddetmeli", () => {
      const sonuc = dugumOlusturSemasi.safeParse({
        haritaId: "harita-123",
        etiket: "Node",
        tur: "bilinmeyen_tur",
        pozisyonX: 0,
        pozisyonY: 0,
      });
      expect(sonuc.success).toBe(false);
    });

    it("toplu konum güncellemesinde hem dizi hem nesne formatını desteklemeli", () => {
      const diziFormati = dugumTopluKonumSemasi.safeParse([
        { id: "d1", pozisyonX: 10, pozisyonY: 20 },
      ]);
      expect(diziFormati.success).toBe(true);

      const nesneFormati = dugumTopluKonumSemasi.safeParse({
        konumlar: [{ id: "d1", pozisyonX: 10, pozisyonY: 20 }],
      });
      expect(nesneFormati.success).toBe(true);
    });
  });

  describe("kenarSchema", () => {
    it("geçerli kenar oluşturma verisini doğrulamalı ve varsayılan yönü atamalı", () => {
      const sonuc = kenarOlusturSemasi.safeParse({
        haritaId: "harita-1",
        kaynakId: "d1",
        hedefId: "d2",
        etiket: "bağlantılı",
      });
      expect(sonuc.success).toBe(true);
      if (sonuc.success) {
        expect(sonuc.data.yon).toBe("yonsuz");
      }
    });

    it("geçersiz yön değerini reddetmeli", () => {
      const sonuc = kenarOlusturSemasi.safeParse({
        haritaId: "harita-1",
        kaynakId: "d1",
        hedefId: "d2",
        yon: "ucgen",
      });
      expect(sonuc.success).toBe(false);
    });

    it("kenar güncelleme şemasında yön ve etiket güncellenebilmeli", () => {
      const sonuc = kenarGuncelleSemasi.safeParse({
        yon: "cift_yonlu",
        etiket: "ilişkili",
      });
      expect(sonuc.success).toBe(true);
    });
  });
});
