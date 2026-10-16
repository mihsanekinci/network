import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { dogrulaGovde, dogrulaParametre } from "../validate";

describe("Validate Middleware", () => {
  const testSemasi = z.object({
    baslik: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
    yas: z.number().optional(),
  });

  it("geçerli veride next() çağrılmalı ve req.body güncellenmeli", () => {
    const req = {
      body: { baslik: "Test Başlık", fazlalik: "silinecek" },
      params: {},
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    const middleware = dogrulaGovde(testSemasi);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(req.body).toEqual({ baslik: "Test Başlık" });
  });

  it("geçersiz veride 400 ve detaylı hata dönmeli", () => {
    const req = {
      body: { baslik: "ab" },
      params: {},
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    const middleware = dogrulaGovde(testSemasi);
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      basarili: false,
      hata: "Geçersiz istek verisi",
      detaylar: [
        {
          alan: "baslik",
          mesaj: "Başlık en az 3 karakter olmalıdır",
        },
      ],
    });
  });

  it("nested rotalarda haritaId parametresi istek gövdesine aktarılmalı", () => {
    const dugumSemasi = z.object({
      haritaId: z.string().min(1),
      etiket: z.string().min(1),
    });

    const req = {
      params: { haritaId: "harita-999" },
      body: { etiket: "Yeni Düğüm" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    const middleware = dogrulaGovde(dugumSemasi);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.body.haritaId).toBe("harita-999");
    expect(req.body.etiket).toBe("Yeni Düğüm");
  });

  it("dogrulaParametre geçersiz parametre durumunda 400 dönmeli", () => {
    const paramSemasi = z.object({
      id: z.string().min(5, "ID en az 5 karakter olmalıdır"),
    });

    const req = {
      params: { id: "123" },
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    const middleware = dogrulaParametre(paramSemasi);
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      basarili: false,
      hata: "Geçersiz istek parametresi",
      detaylar: [
        {
          alan: "id",
          mesaj: "ID en az 5 karakter olmalıdır",
        },
      ],
    });
  });
});
