import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import type { ApiYaniti } from "../types";

/**
 * Zod doğrulama hatasını istemciye uygun formata dönüştürür
 */
function hataDetaylariniBicimlendir(hata: ZodError): Array<{ alan: string; mesaj: string }> {
  return hata.issues.map((sorun) => ({
    alan: sorun.path.join(".") || "govde",
    mesaj: sorun.message,
  }));
}

/**
 * İstek gövdesini (req.body) verilen Zod şemasına göre doğrular.
 * Harita alt rotalarında haritaId istek parametresinden geliyorsa gövdeye otomatik aktarır.
 */
export function dogrulaGovde(sema: ZodSchema) {
  return (istek: Request, yanit: Response<ApiYaniti<never>>, next: NextFunction): void => {
    const veri = { ...istek.body };

    // Nested route durumunda haritaId url params'tan gelebilir
    if (istek.params?.haritaId && !veri.haritaId) {
      veri.haritaId = istek.params.haritaId;
    }

    const sonuc = sema.safeParse(veri);

    if (!sonuc.success) {
      yanit.status(400).json({
        basarili: false,
        hata: "Geçersiz istek verisi",
        detaylar: hataDetaylariniBicimlendir(sonuc.error),
      });
      return;
    }

    istek.body = sonuc.data;
    next();
  };
}

/**
 * Türkçe karakter uyumluluğu için alias
 */
export const dogrulaGövde = dogrulaGovde;

/**
 * İstek parametrelerini (req.params) verilen Zod şemasına göre doğrular.
 */
export function dogrulaParametre(sema: ZodSchema) {
  return (istek: Request, yanit: Response<ApiYaniti<never>>, next: NextFunction): void => {
    const sonuc = sema.safeParse(istek.params);

    if (!sonuc.success) {
      yanit.status(400).json({
        basarili: false,
        hata: "Geçersiz istek parametresi",
        detaylar: hataDetaylariniBicimlendir(sonuc.error),
      });
      return;
    }

    istek.params = sonuc.data as Record<string, string>;
    next();
  };
}

export default {
  dogrulaGovde,
  dogrulaGövde,
  dogrulaParametre,
};
