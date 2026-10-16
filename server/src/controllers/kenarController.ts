import { Request, Response } from "express";
import kenarServisiVarsayilan from "../services/kenarServisi";
import type { KenarDTO, KenarOlusturDTO, KenarGuncelleDTO, ApiYaniti } from "../types";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ValidationError } from "../errors";

interface KenarServisArayuzu {
  haritayaGoreGetir(haritaId: string): Promise<KenarDTO[]>;
  olustur(veri: KenarOlusturDTO): Promise<KenarDTO>;
  guncelle(id: string, veri: KenarGuncelleDTO): Promise<KenarDTO>;
  sil(id: string): Promise<void>;
}

export class KenarController {
  constructor(private readonly kenarServisi: KenarServisArayuzu) {}

  haritayaGoreGetir = asyncHandler(
    async (
      istek: Request,
      yanit: Response<ApiYaniti<KenarDTO[]>>
    ): Promise<void> => {
      const haritaId = istek.params.haritaId ?? (istek.query.haritaId as string);
      if (!haritaId) {
        throw new ValidationError("Harita ID belirtilmelidir");
      }
      const kenarlar = await this.kenarServisi.haritayaGoreGetir(haritaId);
      yanit.status(200).json({ basarili: true, veri: kenarlar });
    }
  );

  olustur = asyncHandler(
    async (
      istek: Request,
      yanit: Response<ApiYaniti<KenarDTO>>
    ): Promise<void> => {
      const haritaId = istek.params.haritaId ?? istek.body.haritaId;
      if (!haritaId) {
        throw new ValidationError("Harita ID belirtilmelidir");
      }
      const veri: KenarOlusturDTO = { ...istek.body, haritaId };
      const yeniKenar = await this.kenarServisi.olustur(veri);
      yanit.status(201).json({ basarili: true, veri: yeniKenar });
    }
  );

  guncelle = asyncHandler(
    async (
      istek: Request,
      yanit: Response<ApiYaniti<KenarDTO>>
    ): Promise<void> => {
      const id = istek.params.id ?? istek.params.kenarId;
      const guncelKenar = await this.kenarServisi.guncelle(id, istek.body);
      yanit.status(200).json({ basarili: true, veri: guncelKenar });
    }
  );

  sil = asyncHandler(
    async (
      istek: Request,
      yanit: Response<ApiYaniti<void>>
    ): Promise<void> => {
      const id = istek.params.id ?? istek.params.kenarId;
      await this.kenarServisi.sil(id);
      yanit.status(200).json({ basarili: true });
    }
  );
}

export default new KenarController(kenarServisiVarsayilan);
