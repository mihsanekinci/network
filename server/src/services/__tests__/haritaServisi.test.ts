import { describe, it, expect, vi, beforeEach } from "vitest";
import { HaritaServisi, type HaritaRepo } from "../haritaServisi";
import { Harita } from "@prisma/client";

describe("HaritaServisi", () => {
  let mockRepo: {
    tumunuGetir: ReturnType<typeof vi.fn>;
    idileGetir: ReturnType<typeof vi.fn>;
    olustur: ReturnType<typeof vi.fn>;
    guncelle: ReturnType<typeof vi.fn>;
    sil: ReturnType<typeof vi.fn>;
  };
  let servis: HaritaServisi;

  const sabitTarih = new Date("2026-01-01T10:00:00.000Z");
  const ornekHarita: Harita = {
    id: "harita-1",
    baslik: "Staj Takip Haritası",
    aciklama: "Kişiler ve kurumlar ağı",
    olusturulmaTarihi: sabitTarih,
    guncellenmeTarihi: sabitTarih,
  };

  beforeEach(() => {
    mockRepo = {
      tumunuGetir: vi.fn(),
      idileGetir: vi.fn(),
      olustur: vi.fn(),
      guncelle: vi.fn(),
      sil: vi.fn(),
    };
    servis = new HaritaServisi(mockRepo as unknown as HaritaRepo);
  });

  describe("tumunuGetir", () => {
    it("tüm haritaları DTO formatında getirmeli", async () => {
      const ikinciHarita: Harita = {
        id: "harita-2",
        baslik: "Kavram Haritası",
        aciklama: null,
        olusturulmaTarihi: sabitTarih,
        guncellenmeTarihi: sabitTarih,
      };
      mockRepo.tumunuGetir.mockResolvedValue([ornekHarita, ikinciHarita]);

      const sonuc = await servis.tumunuGetir();

      expect(mockRepo.tumunuGetir).toHaveBeenCalledTimes(1);
      expect(sonuc).toEqual([
        {
          id: "harita-1",
          baslik: "Staj Takip Haritası",
          aciklama: "Kişiler ve kurumlar ağı",
          olusturulmaTarihi: "2026-01-01T10:00:00.000Z",
          guncellenmeTarihi: "2026-01-01T10:00:00.000Z",
        },
        {
          id: "harita-2",
          baslik: "Kavram Haritası",
          aciklama: undefined,
          olusturulmaTarihi: "2026-01-01T10:00:00.000Z",
          guncellenmeTarihi: "2026-01-01T10:00:00.000Z",
        },
      ]);
    });

    it("veritabanında harita yoksa boş dizi dönmeli", async () => {
      mockRepo.tumunuGetir.mockResolvedValue([]);

      const sonuc = await servis.tumunuGetir();

      expect(mockRepo.tumunuGetir).toHaveBeenCalledTimes(1);
      expect(sonuc).toEqual([]);
    });
  });

  describe("idileGetir", () => {
    it("belirtilen id'ye sahip haritayı DTO formatında getirmeli", async () => {
      mockRepo.idileGetir.mockResolvedValue(ornekHarita);

      const sonuc = await servis.idileGetir("harita-1");

      expect(mockRepo.idileGetir).toHaveBeenCalledWith("harita-1");
      expect(sonuc).toEqual({
        id: "harita-1",
        baslik: "Staj Takip Haritası",
        aciklama: "Kişiler ve kurumlar ağı",
        olusturulmaTarihi: "2026-01-01T10:00:00.000Z",
        guncellenmeTarihi: "2026-01-01T10:00:00.000Z",
      });
    });

    it("var olmayan harita istendiğinde hata fırlatmalı", async () => {
      mockRepo.idileGetir.mockResolvedValue(null);

      await expect(servis.idileGetir("olmayan-id")).rejects.toThrow("Harita bulunamadı");
      expect(mockRepo.idileGetir).toHaveBeenCalledWith("olmayan-id");
    });
  });

  describe("olustur", () => {
    it("geçerli veriyle yeni haritayı oluşturup DTO formatında dönmeli", async () => {
      const olusturVeri = {
        baslik: "Yeni Harita",
        aciklama: "Açıklama",
      };
      const olusanHarita: Harita = {
        id: "harita-yeni",
        baslik: "Yeni Harita",
        aciklama: "Açıklama",
        olusturulmaTarihi: sabitTarih,
        guncellenmeTarihi: sabitTarih,
      };
      mockRepo.olustur.mockResolvedValue(olusanHarita);

      const sonuc = await servis.olustur(olusturVeri);

      expect(mockRepo.olustur).toHaveBeenCalledWith(olusturVeri);
      expect(sonuc).toEqual({
        id: "harita-yeni",
        baslik: "Yeni Harita",
        aciklama: "Açıklama",
        olusturulmaTarihi: "2026-01-01T10:00:00.000Z",
        guncellenmeTarihi: "2026-01-01T10:00:00.000Z",
      });
    });

    it("başlık boş olunca hata fırlatmalı", async () => {
      await expect(servis.olustur({ baslik: "" })).rejects.toThrow("Başlık boş olamaz");
      await expect(servis.olustur({ baslik: "   " })).rejects.toThrow("Başlık boş olamaz");
      expect(mockRepo.olustur).not.toHaveBeenCalled();
    });
  });

  describe("guncelle", () => {
    it("haritayı başarıyla güncellemeli", async () => {
      mockRepo.idileGetir.mockResolvedValue(ornekHarita);
      const guncellenmisHarita: Harita = {
        ...ornekHarita,
        baslik: "Güncellenmiş Başlık",
        aciklama: "Güncellenmiş Açıklama",
      };
      mockRepo.guncelle.mockResolvedValue(guncellenmisHarita);

      const guncelleVeri = {
        baslik: "Güncellenmiş Başlık",
        aciklama: "Güncellenmiş Açıklama",
      };
      const sonuc = await servis.guncelle("harita-1", guncelleVeri);

      expect(mockRepo.idileGetir).toHaveBeenCalledWith("harita-1");
      expect(mockRepo.guncelle).toHaveBeenCalledWith("harita-1", guncelleVeri);
      expect(sonuc).toEqual({
        id: "harita-1",
        baslik: "Güncellenmiş Başlık",
        aciklama: "Güncellenmiş Açıklama",
        olusturulmaTarihi: "2026-01-01T10:00:00.000Z",
        guncellenmeTarihi: "2026-01-01T10:00:00.000Z",
      });
    });

    it("var olmayan harita güncellenmek istendiğinde hata fırlatmalı", async () => {
      mockRepo.idileGetir.mockResolvedValue(null);

      await expect(
        servis.guncelle("olmayan-id", { baslik: "Yeni Başlık" })
      ).rejects.toThrow("Harita bulunamadı");
      expect(mockRepo.idileGetir).toHaveBeenCalledWith("olmayan-id");
      expect(mockRepo.guncelle).not.toHaveBeenCalled();
    });
  });

  describe("sil", () => {
    it("haritayı başarıyla silmeli", async () => {
      mockRepo.idileGetir.mockResolvedValue(ornekHarita);
      mockRepo.sil.mockResolvedValue(undefined);

      await servis.sil("harita-1");

      expect(mockRepo.idileGetir).toHaveBeenCalledWith("harita-1");
      expect(mockRepo.sil).toHaveBeenCalledWith("harita-1");
    });

    it("var olmayan harita silinmek istendiğinde hata fırlatmalı", async () => {
      mockRepo.idileGetir.mockResolvedValue(null);

      await expect(servis.sil("olmayan-id")).rejects.toThrow("Harita bulunamadı");
      expect(mockRepo.idileGetir).toHaveBeenCalledWith("olmayan-id");
      expect(mockRepo.sil).not.toHaveBeenCalled();
    });
  });
});
