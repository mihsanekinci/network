import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import { HaritaController } from "../haritaController";
import { DugumController } from "../dugumController";
import { KenarController } from "../kenarController";
import { NotFoundError, ValidationError } from "../../errors";

describe("Controller Katmanı ve asyncHandler Entegrasyonu", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { params: {}, body: {}, query: {} };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  describe("HaritaController", () => {
    let mockHaritaServisi: any;
    let controller: HaritaController;

    beforeEach(() => {
      mockHaritaServisi = {
        tumunuGetir: vi.fn(),
        idileGetir: vi.fn(),
        olustur: vi.fn(),
        guncelle: vi.fn(),
        sil: vi.fn(),
        iceAktar: vi.fn(),
      };
      controller = new HaritaController(mockHaritaServisi);
    });

    it("tumunuGetir başarılı sonuçta 200 dönmeli", async () => {
      const haritalar = [{ id: "h1", baslik: "Harita 1" }];
      mockHaritaServisi.tumunuGetir.mockResolvedValue(haritalar);

      await controller.tumunuGetir(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ basarili: true, veri: haritalar });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("idileGetir hata fırlatıldığında hatayı next'e iletmeli", async () => {
      const hata = new NotFoundError("Harita bulunamadı");
      mockHaritaServisi.idileGetir.mockRejectedValue(hata);
      mockReq.params = { id: "olmayan-id" };

      await controller.idileGetir(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(hata);
    });

    it("olustur başarılı olduğunda 201 dönmeli", async () => {
      const yeniHarita = { id: "h2", baslik: "Yeni Harita" };
      mockHaritaServisi.olustur.mockResolvedValue(yeniHarita);
      mockReq.body = { baslik: "Yeni Harita" };

      await controller.olustur(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ basarili: true, veri: yeniHarita });
    });

    it("sil başarılı olduğunda 200 dönmeli", async () => {
      mockHaritaServisi.sil.mockResolvedValue(undefined);
      mockReq.params = { id: "h1" };

      await controller.sil(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ basarili: true });
    });
  });

  describe("DugumController", () => {
    let mockDugumServisi: any;
    let controller: DugumController;

    beforeEach(() => {
      mockDugumServisi = {
        haritayaGoreGetir: vi.fn(),
        olustur: vi.fn(),
        guncelle: vi.fn(),
        sil: vi.fn(),
        topluKonumGuncelle: vi.fn(),
      };
      controller = new DugumController(mockDugumServisi);
    });

    it("haritaId eksik olduğunda ValidationError fırlatıp next'e iletmeli", async () => {
      mockReq.params = {};
      mockReq.query = {};

      await controller.haritayaGoreGetir(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      const arg = vi.mocked(mockNext).mock.calls[0][0];
      expect(arg).toBeInstanceOf(ValidationError);
      expect((arg as ValidationError).message).toBe("Harita ID belirtilmelidir");
    });

    it("olustur sırasında haritaId eksikse ValidationError next'e iletilmeli", async () => {
      mockReq.params = {};
      mockReq.body = { etiket: "Düğüm 1" };

      await controller.olustur(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      const arg = vi.mocked(mockNext).mock.calls[0][0];
      expect(arg).toBeInstanceOf(ValidationError);
    });

    it("olustur başarılı olduğunda 201 dönmeli", async () => {
      const olusanDugum = { id: "d1", etiket: "Düğüm 1" };
      mockDugumServisi.olustur.mockResolvedValue(olusanDugum);
      mockReq.params = { haritaId: "h1" };
      mockReq.body = { etiket: "Düğüm 1" };

      await controller.olustur(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ basarili: true, veri: olusanDugum });
    });
  });

  describe("KenarController", () => {
    let mockKenarServisi: any;
    let controller: KenarController;

    beforeEach(() => {
      mockKenarServisi = {
        haritayaGoreGetir: vi.fn(),
        olustur: vi.fn(),
        guncelle: vi.fn(),
        sil: vi.fn(),
      };
      controller = new KenarController(mockKenarServisi);
    });

    it("haritaId eksik olduğunda ValidationError fırlatıp next'e iletmeli", async () => {
      mockReq.params = {};
      mockReq.query = {};

      await controller.haritayaGoreGetir(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      const arg = vi.mocked(mockNext).mock.calls[0][0];
      expect(arg).toBeInstanceOf(ValidationError);
      expect((arg as ValidationError).message).toBe("Harita ID belirtilmelidir");
    });

    it("olustur başarılı olduğunda 201 dönmeli", async () => {
      const olusanKenar = { id: "k1", kaynakId: "d1", hedefId: "d2" };
      mockKenarServisi.olustur.mockResolvedValue(olusanKenar);
      mockReq.params = { haritaId: "h1" };
      mockReq.body = { kaynakId: "d1", hedefId: "d2" };

      await controller.olustur(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ basarili: true, veri: olusanKenar });
    });
  });
});
