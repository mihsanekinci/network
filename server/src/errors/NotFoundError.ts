import { AppError } from "./AppError";

/**
 * 404 Bulunamadı hatası.
 * İstenen kaynak (harita, düğüm, kenar vb.) bulunamadığında fırlatılır.
 */
export class NotFoundError extends AppError {
  constructor(mesaj: string = "Kaynak bulunamadı") {
    super(mesaj, 404, true);
    this.name = "NotFoundError";
  }
}

export default NotFoundError;
