import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";
import prisma from "../../lib/prismaIstemcisi";
import haritaRepository from "../haritaRepository";
import type { HaritaPaketiDTO } from "../../types";

vi.mock("../../lib/prismaIstemcisi", () => {
  return {
    default: {
      harita: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      dugum: {
        create: vi.fn(),
      },
      kenar: {
        create: vi.fn(),
      },
      $transaction: vi.fn(),
    },
  };
});

describe("HaritaRepository", () => {
  let mockTx: {
    harita: { create: ReturnType<typeof vi.fn> };
    dugum: { create: ReturnType<typeof vi.fn> };
    kenar: { create: ReturnType<typeof vi.fn> };
  };

  const ornekTarih = new Date("2026-10-16T12:00:00.000Z");

  beforeEach(() => {
    vi.clearAllMocks();

    mockTx = {
      harita: { create: vi.fn() },
      dugum: { create: vi.fn() },
      kenar: { create: vi.fn() },
    };

    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      if (typeof callback === "function") {
        return callback(mockTx);
      }
      return Promise.all(callback);
    });
  });

  describe("iceAktar (ACID Transaction)", () => {
    const gecerliPaket: HaritaPaketiDTO = {
      surum: "1.0",
      disaAktarmaTarihi: "2026-10-16T12:00:00.000Z",
      harita: {
        baslik: "Mikroservis Mimarisi",
        aciklama: "Sistem bileşenleri haritası",
      },
      dugumler: [
        {
          id: "eski-dugum-1",
          etiket: "Auth Servisi",
          tur: "kavram",
          pozisyonX: 100,
          pozisyonY: 150,
          ozellikler: { port: 4000 },
        },
        {
          id: "eski-dugum-2",
          etiket: "Veritabanı",
          tur: "kurum",
          pozisyonX: 300,
          pozisyonY: 150,
        },
      ],
      kenarlar: [
        {
          id: "eski-kenar-1",
          kaynakId: "eski-dugum-1",
          hedefId: "eski-dugum-2",
          etiket: "bağlanır",
          yon: "tek_yonlu",
        },
      ],
    };

    it("başarılı durumda harita, düğümler ve kenarları tek transaction içinde atomik oluşturmalı", async () => {
      const olusanHarita = {
        id: "yeni-harita-cuid",
        baslik: "Mikroservis Mimarisi",
        aciklama: "Sistem bileşenleri haritası",
        olusturulmaTarihi: ornekTarih,
        guncellenmeTarihi: ornekTarih,
      };

      mockTx.harita.create.mockResolvedValue(olusanHarita);
      mockTx.dugum.create
        .mockResolvedValueOnce({
          id: "yeni-dugum-cuid-1",
          haritaId: olusanHarita.id,
          etiket: "Auth Servisi",
          tur: "kavram",
          pozisyonX: 100,
          pozisyonY: 150,
          ozellikler: JSON.stringify({ port: 4000 }),
          olusturulmaTarihi: ornekTarih,
          guncellenmeTarihi: ornekTarih,
        })
        .mockResolvedValueOnce({
          id: "yeni-dugum-cuid-2",
          haritaId: olusanHarita.id,
          etiket: "Veritabanı",
          tur: "kurum",
          pozisyonX: 300,
          pozisyonY: 150,
          ozellikler: "{}",
          olusturulmaTarihi: ornekTarih,
          guncellenmeTarihi: ornekTarih,
        });

      mockTx.kenar.create.mockResolvedValue({
        id: "yeni-kenar-cuid-1",
        haritaId: olusanHarita.id,
        kaynakId: "yeni-dugum-cuid-1",
        hedefId: "yeni-dugum-cuid-2",
        etiket: "bağlanır",
        yon: "tek_yonlu",
        olusturulmaTarihi: ornekTarih,
        guncellenmeTarihi: ornekTarih,
      });

      const sonuc = await haritaRepository.iceAktar(gecerliPaket);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockTx.harita.create).toHaveBeenCalledWith({
        data: {
          baslik: "Mikroservis Mimarisi",
          aciklama: "Sistem bileşenleri haritası",
        },
      });

      expect(mockTx.dugum.create).toHaveBeenCalledTimes(2);
      expect(mockTx.dugum.create).toHaveBeenNthCalledWith(1, {
        data: {
          haritaId: "yeni-harita-cuid",
          etiket: "Auth Servisi",
          tur: "kavram",
          pozisyonX: 100,
          pozisyonY: 150,
          ozellikler: JSON.stringify({ port: 4000 }),
        },
      });

      expect(mockTx.kenar.create).toHaveBeenCalledTimes(1);
      expect(mockTx.kenar.create).toHaveBeenCalledWith({
        data: {
          haritaId: "yeni-harita-cuid",
          kaynakId: "yeni-dugum-cuid-1",
          hedefId: "yeni-dugum-cuid-2",
          etiket: "bağlanır",
          yon: "tek_yonlu",
        },
      });

      expect(sonuc).toEqual(olusanHarita);
    });

    it("düğüm oluşturulurken hata çıkarsa transaction başarısız olmalı ve kenar oluşturulmamalı (rollback)", async () => {
      mockTx.harita.create.mockResolvedValue({
        id: "yeni-harita-cuid",
        baslik: "Mikroservis Mimarisi",
      });
      mockTx.dugum.create.mockRejectedValue(new Error("Veritabanı bağlantı hatası"));

      await expect(haritaRepository.iceAktar(gecerliPaket)).rejects.toThrow(
        "Veritabanı bağlantı hatası"
      );

      expect(mockTx.harita.create).toHaveBeenCalledTimes(1);
      expect(mockTx.dugum.create).toHaveBeenCalledTimes(1);
      expect(mockTx.kenar.create).not.toHaveBeenCalled();
    });

    it("kenar oluşturulurken hata çıkarsa transaction başarısız olmalı (rollback)", async () => {
      mockTx.harita.create.mockResolvedValue({
        id: "yeni-harita-cuid",
        baslik: "Mikroservis Mimarisi",
      });
      mockTx.dugum.create
        .mockResolvedValueOnce({ id: "yeni-dugum-cuid-1" })
        .mockResolvedValueOnce({ id: "yeni-dugum-cuid-2" });
      mockTx.kenar.create.mockRejectedValue(new Error("Kenar foreign key kısıt hatası"));

      await expect(haritaRepository.iceAktar(gecerliPaket)).rejects.toThrow(
        "Kenar foreign key kısıt hatası"
      );

      expect(mockTx.kenar.create).toHaveBeenCalledTimes(1);
    });

    it("harita oluşturulurken hata çıkarsa hiçbir düğüm ve kenar eklenmemeli (rollback)", async () => {
      mockTx.harita.create.mockRejectedValue(new Error("Harita tablosu kilitli"));

      await expect(haritaRepository.iceAktar(gecerliPaket)).rejects.toThrow(
        "Harita tablosu kilitli"
      );

      expect(mockTx.harita.create).toHaveBeenCalledTimes(1);
      expect(mockTx.dugum.create).not.toHaveBeenCalled();
      expect(mockTx.kenar.create).not.toHaveBeenCalled();
    });
  });

  describe("CRUD operasyonları", () => {
    it("tumunuGetir haritaları oluşturulma tarihine göre azalan sırada getirmeli", async () => {
      const haritalar = [{ id: "h1", baslik: "Harita 1" }];
      (prisma.harita.findMany as any).mockResolvedValue(haritalar);

      const sonuc = await haritaRepository.tumunuGetir();

      expect(prisma.harita.findMany).toHaveBeenCalledWith({
        orderBy: { olusturulmaTarihi: "desc" },
      });
      expect(sonuc).toEqual(haritalar);
    });

    it("idileGetir belirtilen haritayı getirmeli", async () => {
      const harita = { id: "h1", baslik: "Harita 1" };
      (prisma.harita.findUnique as any).mockResolvedValue(harita);

      const sonuc = await haritaRepository.idileGetir("h1");

      expect(prisma.harita.findUnique).toHaveBeenCalledWith({ where: { id: "h1" } });
      expect(sonuc).toEqual(harita);
    });

    it("olustur yeni harita kaydetmeli", async () => {
      const yeni = { id: "h1", baslik: "Test" };
      (prisma.harita.create as any).mockResolvedValue(yeni);

      const sonuc = await haritaRepository.olustur({ baslik: "Test" });

      expect(prisma.harita.create).toHaveBeenCalledWith({ data: { baslik: "Test" } });
      expect(sonuc).toEqual(yeni);
    });

    it("guncelle bulunamayan harita için Harita bulunamadı hatası fırlatmalı", async () => {
      const p2025Hata = new Prisma.PrismaClientKnownRequestError("Kayıt yok", {
        code: "P2025",
        clientVersion: "5.13.0",
      });
      (prisma.harita.update as any).mockRejectedValue(p2025Hata);

      await expect(
        haritaRepository.guncelle("olmayan-id", { baslik: "Yeni" })
      ).rejects.toThrow("Harita bulunamadı");
    });

    it("sil bulunamayan harita durumunda (P2025) sessizce tamamlanmalı", async () => {
      const p2025Hata = new Prisma.PrismaClientKnownRequestError("Kayıt yok", {
        code: "P2025",
        clientVersion: "5.13.0",
      });
      (prisma.harita.delete as any).mockRejectedValue(p2025Hata);

      await expect(haritaRepository.sil("olmayan-id")).resolves.toBeUndefined();
    });
  });
});
