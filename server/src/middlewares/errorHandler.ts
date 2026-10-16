import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import type { ApiYaniti } from "../types";

/**
 * Express merkezi hata yönetimi middleware'i.
 * AppError türevlerini durum kodları ve mesajlarıyla standart API yanıtına dönüştürür.
 * Beklenmeyen sistem hatalarını 500 kodu ile yakalar.
 */
export const errorHandler = (
  hata: Error,
  _istek: Request,
  yanit: Response<ApiYaniti<never>>,
  _next: NextFunction
): void => {
  if (hata instanceof AppError) {
    const yanitVerisi: ApiYaniti<never> = {
      basarili: false,
      hata: hata.message,
    };

    if (hata.detaylar !== undefined && Array.isArray(hata.detaylar) && hata.detaylar.length > 0) {
      yanitVerisi.detaylar = hata.detaylar as Array<{ alan: string; mesaj: string }>;
    }

    yanit.status(hata.durumKodu).json(yanitVerisi);
    return;
  }

  // Operasyonel olmayan / beklenmeyen sistem hataları
  console.error("Beklenmeyen Hata:", hata);
  yanit.status(500).json({
    basarili: false,
    hata: "Sunucu içi beklenmeyen bir hata oluştu",
  });
};

export default errorHandler;
