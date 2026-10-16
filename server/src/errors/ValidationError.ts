import { AppError } from "./AppError";

/**
 * 400 Geçersiz İstek / Doğrulama hatası.
 * Eksik veya geçersiz parametre/gövde durumlarında fırlatılır.
 */
export class ValidationError extends AppError {
  constructor(mesaj: string = "Geçersiz istek verisi", detaylar?: unknown) {
    super(mesaj, 400, true, detaylar);
    this.name = "ValidationError";
  }
}

export default ValidationError;
