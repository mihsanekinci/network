import { AppError } from "./AppError";

/**
 * 500 Veritabanı hatası.
 * Veritabanı işlemleri veya sorgu yürütme sırasında oluşan hatalarda fırlatılır.
 */
export class DatabaseError extends AppError {
  constructor(mesaj: string = "Veritabanı işlemi sırasında hata oluştu") {
    super(mesaj, 500, true);
    this.name = "DatabaseError";
  }
}

export default DatabaseError;
