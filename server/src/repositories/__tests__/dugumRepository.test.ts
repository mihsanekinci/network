import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";
import prisma from "../../lib/prismaIstemcisi";
import dugumRepository from "../dugumRepository";
import type { DugumKonumGuncellemeDTO } from "../../types";

vi.mock("../../lib/prismaIstemcisi", () => {
  return {
    default: {
      dugum: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      $transaction: vi.fn(),
    },
  };
});

describe("DugumRepository", () => {
  let mockTx: {
    dugum: {
      update: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockTx = {
      dugum: {
        update: vi.fn(),
      },
    };

    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      if (typeof callback === "function") {
        return callback(mockTx);
      }
      return Promise.all(callback);
    });
  });

  describe("topluKonumGuncelle (ACID Transaction)", () => {
    const ornekKonumlar: DugumKonumGuncellemeDTO[] = [
      { id: "dugum-1", pozisyonX: 120, pozisyonY: 250 },
      { id: "dugum-2", pozisyonX: 300, pozisyonY: 450 },
      { id: "dugum-3", pozisyonX: 50, pozisyonY: 80 },
    ];

    it("verilen tüm konum güncellemelerini tek bir transaction içinde atomik yapmalı", async () => {
      mockTx.dugum.update.mockResolvedValue({});

      await dugumRepository.topluKonumGuncelle(ornekKonumlar);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockTx.dugum.update).toHaveBeenCalledTimes(3);

      expect(mockTx.dugum.update).toHaveBeenNthCalledWith(1, {
        where: { id: "dugum-1" },
        data: { pozisyonX: 120, pozisyonY: 250 },
      });
      expect(mockTx.dugum.update).toHaveBeenNthCalledWith(2, {
        where: { id: "dugum-2" },
        data: { pozisyonX: 300, pozisyonY: 450 },
      });
      expect(mockTx.dugum.update).toHaveBeenNthCalledWith(3, {
        where: { id: "dugum-3" },
        data: { pozisyonX: 50, pozisyonY: 80 },
      });
    });

    it("güncellemelerden biri başarısız olduğunda transaction hata fırlatmalı ve sonraki güncellemeler çalıştırılmamalı (rollback)", async () => {
      mockTx.dugum.update
        .mockResolvedValueOnce({})
        .mockRejectedValueOnce(new Error("Düğüm güncellenemedi: DB hatası"));

      await expect(
        dugumRepository.topluKonumGuncelle(ornekKonumlar)
      ).rejects.toThrow("Düğüm güncellenemedi: DB hatası");

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockTx.dugum.update).toHaveBeenCalledTimes(2);
      expect(mockTx.dugum.update).not.toHaveBeenCalledWith({
        where: { id: "dugum-3" },
        data: expect.anything(),
      });
    });

    it("boş dizi gönderildiğinde hiçbir işlem ve transaction tetiklenmemeli", async () => {
      await dugumRepository.topluKonumGuncelle([]);

      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(mockTx.dugum.update).not.toHaveBeenCalled();
    });
  });

  describe("CRUD operasyonları", () => {
    it("haritayaGoreGetir doğru filtre ile sorgulamalı", async () => {
      const dugumler = [{ id: "d1", haritaId: "h1", etiket: "D1" }];
      (prisma.dugum.findMany as any).mockResolvedValue(dugumler);

      const sonuc = await dugumRepository.haritayaGoreGetir("h1");

      expect(prisma.dugum.findMany).toHaveBeenCalledWith({ where: { haritaId: "h1" } });
      expect(sonuc).toEqual(dugumler);
    });

    it("idileGetir belirtilen düğümü getirmeli", async () => {
      const dugum = { id: "d1", etiket: "D1" };
      (prisma.dugum.findUnique as any).mockResolvedValue(dugum);

      const sonuc = await dugumRepository.idileGetir("d1");

      expect(prisma.dugum.findUnique).toHaveBeenCalledWith({ where: { id: "d1" } });
      expect(sonuc).toEqual(dugum);
    });

    it("olustur özellikler nesnesini JSON string'e dönüştürerek kaydetmeli", async () => {
      const olusturVerisi = {
        haritaId: "h1",
        etiket: "Backend API",
        tur: "kavram",
        pozisyonX: 10,
        pozisyonY: 20,
        ozellikler: { framework: "express" },
      };
      (prisma.dugum.create as any).mockResolvedValue({ id: "d1", ...olusturVerisi });

      await dugumRepository.olustur(olusturVerisi);

      expect(prisma.dugum.create).toHaveBeenCalledWith({
        data: {
          haritaId: "h1",
          etiket: "Backend API",
          tur: "kavram",
          pozisyonX: 10,
          pozisyonY: 20,
          ozellikler: JSON.stringify({ framework: "express" }),
        },
      });
    });

    it("guncelle bulunamayan düğüm için Düğüm bulunamadı hatası fırlatmalı", async () => {
      const p2025Hata = new Prisma.PrismaClientKnownRequestError("Kayıt yok", {
        code: "P2025",
        clientVersion: "5.13.0",
      });
      (prisma.dugum.update as any).mockRejectedValue(p2025Hata);

      await expect(
        dugumRepository.guncelle("olmayan-id", { etiket: "Yeni" })
      ).rejects.toThrow("Düğüm bulunamadı");
    });

    it("sil bulunamayan düğüm durumunda (P2025) sessizce tamamlanmalı", async () => {
      const p2025Hata = new Prisma.PrismaClientKnownRequestError("Kayıt yok", {
        code: "P2025",
        clientVersion: "5.13.0",
      });
      (prisma.dugum.delete as any).mockRejectedValue(p2025Hata);

      await expect(dugumRepository.sil("olmayan-id")).resolves.toBeUndefined();
    });
  });
});
