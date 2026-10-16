import { Request, Response } from "express";
import dugumServisiVarsayilan from "../services/dugumServisi";
import type {
  DugumDTO,
  DugumOlusturDTO,
  DugumGuncelleDTO,
  DugumKonumGuncellemeDTO,
  ApiYaniti,
} from "../types";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ValidationError } from "../errors";

interface DugumServisArayuzu {
  haritayaGoreGetir(haritaId: string): Promise<DugumDTO[]>;
  olustur(veri: DugumOlusturDTO): Promise<DugumDTO>;
  guncelle(id: string, veri: DugumGuncelleDTO): Promise<DugumDTO>;
  sil(id: string): Promise<void>;
  topluKonumGuncelle(haritaId: string, konumlar: DugumKonumGuncellemeDTO[]): Promise<void>;
}

export class DugumController {
  constructor(private readonly dugumServisi: DugumServisArayuzu) {}

  haritayaGoreGetir = asyncHandler(
    async (
      istek: Request,
      yanit: Response<ApiYaniti<DugumDTO[]>>
    ): Promise<void> => {
      const haritaId = istek.params.haritaId ?? (istek.query.haritaId as string);
      if (!haritaId) {
        throw new ValidationError("Harita ID belirtilmelidir");
      }
      const dugumler = await this.dugumServisi.haritayaGoreGetir(haritaId);
      yanit.status(200).json({ basarili: true, veri: dugumler });
    }
  );

  olustur = asyncHandler(
    async (
      istek: Request,
      yanit: Response<ApiYaniti<DugumDTO>>
    ): Promise<void> => {
      const haritaId = istek.params.haritaId ?? istek.body.haritaId;
      if (!haritaId) {
        throw new ValidationError("Harita ID belirtilmelidir");
      }
      const veri: DugumOlusturDTO = { ...istek.body, haritaId };
      const yeniDugum = await this.dugumServisi.olustur(veri);
      yanit.status(201).json({ basarili: true, veri: yeniDugum });
    }
  );

  guncelle = asyncHandler(
    async (
      istek: Request,
      yanit: Response<ApiYaniti<DugumDTO>>
    ): Promise<void> => {
      const id = istek.params.id ?? istek.params.dugumId;
      const guncelDugum = await this.dugumServisi.guncelle(id, istek.body);
      yanit.status(200).json({ basarili: true, veri: guncelDugum });
    }
  );

  sil = asyncHandler(
    async (
      istek: Request,
      yanit: Response<ApiYaniti<void>>
    ): Promise<void> => {
      const id = istek.params.id ?? istek.params.dugumId;
      await this.dugumServisi.sil(id);
      yanit.status(200).json({ basarili: true });
    }
  );

  topluKonumGuncelle = asyncHandler(
    async (
      istek: Request,
      yanit: Response<ApiYaniti<void>>
    ): Promise<void> => {
      const haritaId = istek.params.haritaId;
      const konumlar = Array.isArray(istek.body.konumlar) ? istek.body.konumlar : istek.body;
      await this.dugumServisi.topluKonumGuncelle(haritaId, konumlar);
      yanit.status(200).json({ basarili: true });
    }
  );
}

export default new DugumController(dugumServisiVarsayilan);
