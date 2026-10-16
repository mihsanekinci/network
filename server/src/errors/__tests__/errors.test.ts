import { describe, it, expect } from "vitest";
import {
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
  DatabaseError,
} from "../index";

describe("Özel Hata Sınıfları Hiyerarşisi", () => {
  describe("AppError (Temel Hata Sınıfı)", () => {
    it("varsayılan değerler ile doğru oluşturulmalı", () => {
      const hata = new AppError("Genel bir hata oluştu");

      expect(hata).toBeInstanceOf(Error);
      expect(hata).toBeInstanceOf(AppError);
      expect(hata.name).toBe("AppError");
      expect(hata.message).toBe("Genel bir hata oluştu");
      expect(hata.durumKodu).toBe(500);
      expect(hata.operasyonelMi).toBe(true);
      expect(hata.detaylar).toBeUndefined();
      expect(hata.stack).toBeDefined();
    });

    it("özel durum kodu ve operasyonel bayrağı kabul etmeli", () => {
      const detaylar = [{ alan: "test", mesaj: "hata" }];
      const hata = new AppError("Özel hata", 418, false, detaylar);

      expect(hata.durumKodu).toBe(418);
      expect(hata.operasyonelMi).toBe(false);
      expect(hata.detaylar).toEqual(detaylar);
    });
  });

  describe("NotFoundError (404)", () => {
    it("varsayılan mesaj ile 404 kodu üretmeli", () => {
      const hata = new NotFoundError();

      expect(hata).toBeInstanceOf(Error);
      expect(hata).toBeInstanceOf(AppError);
      expect(hata).toBeInstanceOf(NotFoundError);
      expect(hata.name).toBe("NotFoundError");
      expect(hata.message).toBe("Kaynak bulunamadı");
      expect(hata.durumKodu).toBe(404);
      expect(hata.operasyonelMi).toBe(true);
    });

    it("özel mesaj verildiğinde doğru ayarlanmalı", () => {
      const hata = new NotFoundError("Harita bulunamadı");

      expect(hata.message).toBe("Harita bulunamadı");
      expect(hata.durumKodu).toBe(404);
    });
  });

  describe("ValidationError (400)", () => {
    it("varsayılan mesaj ile 400 kodu üretmeli", () => {
      const hata = new ValidationError();

      expect(hata).toBeInstanceOf(Error);
      expect(hata).toBeInstanceOf(AppError);
      expect(hata).toBeInstanceOf(ValidationError);
      expect(hata.name).toBe("ValidationError");
      expect(hata.message).toBe("Geçersiz istek verisi");
      expect(hata.durumKodu).toBe(400);
      expect(hata.operasyonelMi).toBe(true);
    });

    it("özel mesaj ve doğrulama detaylarını taşımalı", () => {
      const detaylar = [{ alan: "baslik", mesaj: "Başlık boş olamaz" }];
      const hata = new ValidationError("Geçersiz başlık", detaylar);

      expect(hata.message).toBe("Geçersiz başlık");
      expect(hata.durumKodu).toBe(400);
      expect(hata.detaylar).toEqual(detaylar);
    });
  });

  describe("ConflictError (409)", () => {
    it("varsayılan mesaj ile 409 kodu üretmeli", () => {
      const hata = new ConflictError();

      expect(hata).toBeInstanceOf(Error);
      expect(hata).toBeInstanceOf(AppError);
      expect(hata).toBeInstanceOf(ConflictError);
      expect(hata.name).toBe("ConflictError");
      expect(hata.message).toBe("Çakışma tespit edildi");
      expect(hata.durumKodu).toBe(409);
      expect(hata.operasyonelMi).toBe(true);
    });

    it("özel mesaj verildiğinde doğru ayarlanmalı", () => {
      const hata = new ConflictError("Bu etiket zaten kullanılıyor");

      expect(hata.message).toBe("Bu etiket zaten kullanılıyor");
      expect(hata.durumKodu).toBe(409);
    });
  });

  describe("DatabaseError (500)", () => {
    it("varsayılan mesaj ile 500 kodu üretmeli", () => {
      const hata = new DatabaseError();

      expect(hata).toBeInstanceOf(Error);
      expect(hata).toBeInstanceOf(AppError);
      expect(hata).toBeInstanceOf(DatabaseError);
      expect(hata.name).toBe("DatabaseError");
      expect(hata.message).toBe("Veritabanı işlemi sırasında hata oluştu");
      expect(hata.durumKodu).toBe(500);
      expect(hata.operasyonelMi).toBe(true);
    });

    it("özel veritabanı hata mesajı ile doğru oluşturulmalı", () => {
      const hata = new DatabaseError("Bağlantı zaman aşımına uğradı");

      expect(hata.message).toBe("Bağlantı zaman aşımına uğradı");
      expect(hata.durumKodu).toBe(500);
    });
  });
});
