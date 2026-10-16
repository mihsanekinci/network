/**
 * NetWork uygulaması için temel hata sınıfı.
 * Tüm operasyonel özel hatalar bu sınıftan türetilir.
 */
export class AppError extends Error {
  public readonly durumKodu: number;
  public readonly operasyonelMi: boolean;
  public readonly detaylar?: unknown;

  constructor(
    mesaj: string,
    durumKodu: number = 500,
    operasyonelMi: boolean = true,
    detaylar?: unknown
  ) {
    super(mesaj);
    this.name = "AppError";
    this.durumKodu = durumKodu;
    this.operasyonelMi = operasyonelMi;
    this.detaylar = detaylar;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default AppError;
