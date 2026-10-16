import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../asyncHandler";
import { errorHandler } from "../errorHandler";
import {
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
  DatabaseError,
} from "../../errors";

describe("asyncHandler ve errorHandler Middleware Testleri", () => {
  describe("asyncHandler", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
      mockReq = {};
      mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      mockNext = vi.fn();
    });

    it("başarılı asenkron fonksiyon çalıştığında next çağrılmamalı", async () => {
      const basariliHandler = asyncHandler(async (_req, res) => {
        res.status(200).json({ basarili: true });
      });

      await basariliHandler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ basarili: true });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("asenkron fonksiyonda hata fırlatıldığında next(hata) çağrılmalı", async () => {
      const beklenenHata = new NotFoundError("Kayıt bulunamadı");
      const hataliHandler = asyncHandler(async () => {
        throw beklenenHata;
      });

      await hataliHandler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(beklenenHata);
    });

    it("asenkron fonksiyonda Promise reject olduğunda next(hata) çağrılmalı", async () => {
      const beklenenHata = new Error("Beklenmeyen promise hatası");
      const hataliHandler = asyncHandler(async () => {
        return Promise.reject(beklenenHata);
      });

      await hataliHandler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(beklenenHata);
    });
  });

  describe("errorHandler", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      mockReq = {};
      mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      mockNext = vi.fn();
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("AppError fırlatıldığında durum kodunu ve mesajını dönmeli", () => {
      const hata = new AppError("Özel bir hata", 418);

      errorHandler(hata, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(418);
      expect(mockRes.json).toHaveBeenCalledWith({
        basarili: false,
        hata: "Özel bir hata",
      });
    });

    it("NotFoundError durumunda 404 dönmeli", () => {
      const hata = new NotFoundError("Harita bulunamadı");

      errorHandler(hata, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        basarili: false,
        hata: "Harita bulunamadı",
      });
    });

    it("ConflictError durumunda 409 dönmeli", () => {
      const hata = new ConflictError("Bu etiket zaten kullanılıyor");

      errorHandler(hata, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        basarili: false,
        hata: "Bu etiket zaten kullanılıyor",
      });
    });

    it("ValidationError durumunda 400 ve varsa detayları dönmeli", () => {
      const detaylar = [{ alan: "baslik", mesaj: "Başlık boş olamaz" }];
      const hata = new ValidationError("Geçersiz veri", detaylar);

      errorHandler(hata, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        basarili: false,
        hata: "Geçersiz veri",
        detaylar,
      });
    });

    it("DatabaseError durumunda 500 kodu dönmeli", () => {
      const hata = new DatabaseError("Veritabanı bağlantı hatası");

      errorHandler(hata, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        basarili: false,
        hata: "Veritabanı bağlantı hatası",
      });
    });

    it("Bilinmeyen standart Error için 500 ve genel hata mesajı dönmeli", () => {
      const beklenmeyenHata = new Error("Bilinmeyen çekirdek hatası");

      errorHandler(beklenmeyenHata, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith("Beklenmeyen Hata:", beklenmeyenHata);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        basarili: false,
        hata: "Sunucu içi beklenmeyen bir hata oluştu",
      });
    });
  });
});
