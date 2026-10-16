import { AppError } from "./AppError";

/**
 * 409 Çakışma hatası.
 * Mükerrer kayıt, benzersiz alan çakışması veya mevcut bağlantı durumlarında fırlatılır.
 */
export class ConflictError extends AppError {
  constructor(mesaj: string = "Çakışma tespit edildi") {
    super(mesaj, 409, true);
    this.name = "ConflictError";
  }
}

export default ConflictError;
