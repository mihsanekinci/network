import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";
import prisma from "../../lib/prismaIstemcisi";
import kenarRepository from "../kenarRepository";

vi.mock("../../lib/prismaIstemcisi", () => {
  return {
    default: {
      kenar: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

describe("KenarRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("haritayaGoreGetir", () => {
    it("haritaId filtresine göre kenarları getirmeli", async () => {
      const kenarlar = [{ id: "k1", haritaId: "h1", kaynakId: "d1", hedefId: "d2" }];
      (prisma.kenar.findMany as any).mockResolvedValue(kenarlar);

      const sonuc = await kenarRepository.haritayaGoreGetir("h1");

      expect(prisma.kenar.findMany).toHaveBeenCalledWith({ where: { haritaId: "h1" } });
      expect(sonuc).toEqual(kenarlar);
    });
  });

  describe("idIleGetir", () => {
    it("belirtilen id'ye sahip kenarı getirmeli", async () => {
      const kenar = { id: "k1", haritaId: "h1", kaynakId: "d1", hedefId: "d2" };
      (prisma.kenar.findUnique as any).mockResolvedValue(kenar);

      const sonuc = await kenarRepository.idIleGetir("k1");

      expect(prisma.kenar.findUnique).toHaveBeenCalledWith({ where: { id: "k1" } });
      expect(sonuc).toEqual(kenar);
    });
  });

  describe("olustur", () => {
    it("yeni kenarı kaydetmeli", async () => {
      const veri = {
        haritaId: "h1",
        kaynakId: "d1",
        hedefId: "d2",
        etiket: "ilişki",
        yon: "yonsuz",
      };
      (prisma.kenar.create as any).mockResolvedValue({ id: "k1", ...veri });

      const sonuc = await kenarRepository.olustur(veri);

      expect(prisma.kenar.create).toHaveBeenCalledWith({ data: veri });
      expect(sonuc.id).toBe("k1");
    });
  });

  describe("guncelle", () => {
    it("kenarı başarıyla güncellemeli", async () => {
      const guncel = { id: "k1", etiket: "yeni-etiket", yon: "tek_yonlu" };
      (prisma.kenar.update as any).mockResolvedValue(guncel);

      const sonuc = await kenarRepository.guncelle("k1", { etiket: "yeni-etiket", yon: "tek_yonlu" });

      expect(prisma.kenar.update).toHaveBeenCalledWith({
        where: { id: "k1" },
        data: { etiket: "yeni-etiket", yon: "tek_yonlu" },
      });
      expect(sonuc).toEqual(guncel);
    });
  });

  describe("sil", () => {
    it("var olan kenarı silmeli", async () => {
      (prisma.kenar.delete as any).mockResolvedValue({});

      await kenarRepository.sil("k1");

      expect(prisma.kenar.delete).toHaveBeenCalledWith({ where: { id: "k1" } });
    });

    it("bulunamayan kenar durumunda (P2025) hata fırlatmadan sessizce tamamlanmalı", async () => {
      const p2025Hata = new Prisma.PrismaClientKnownRequestError("Kayıt yok", {
        code: "P2025",
        clientVersion: "5.13.0",
      });
      (prisma.kenar.delete as any).mockRejectedValue(p2025Hata);

      await expect(kenarRepository.sil("olmayan-id")).resolves.toBeUndefined();
    });
  });
});
