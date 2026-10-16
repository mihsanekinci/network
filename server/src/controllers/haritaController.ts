import { Request, Response } from "express";
import haritaServisiVarsayilan from "../services/haritaServisi";
import type { HaritaDTO, HaritaOlusturDTO, HaritaGuncelleDTO, ApiYaniti } from "../types";
import { asyncHandler } from "../middlewares/asyncHandler";

interface HaritaServisArayuzu {
  tumunuGetir(): Promise<HaritaDTO[]>;
  idileGetir(id: string): Promise<HaritaDTO>;
  olustur(veri: HaritaOlusturDTO): Promise<HaritaDTO>;
  guncelle(id: string, veri: HaritaGuncelleDTO): Promise<HaritaDTO>;
  sil(id: string): Promise<void>;
  iceAktar(paket: any): Promise<HaritaDTO>;
}

export class HaritaController {
  constructor(private readonly haritaServisi: HaritaServisArayuzu) {}

  tumunuGetir = asyncHandler(
    async (_istek: Request, yanit: Response<ApiYaniti<HaritaDTO[]>>): Promise<void> => {
      const haritalar = await this.haritaServisi.tumunuGetir();
      yanit.status(200).json({ basarili: true, veri: haritalar });
    }
  );

  idileGetir = asyncHandler(
    async (istek: Request, yanit: Response<ApiYaniti<HaritaDTO>>): Promise<void> => {
      const harita = await this.haritaServisi.idileGetir(istek.params.id);
      yanit.status(200).json({ basarili: true, veri: harita });
    }
  );

  olustur = asyncHandler(
    async (istek: Request, yanit: Response<ApiYaniti<HaritaDTO>>): Promise<void> => {
      const yeniHarita = await this.haritaServisi.olustur(istek.body);
      yanit.status(201).json({ basarili: true, veri: yeniHarita });
    }
  );

  iceAktar = asyncHandler(
    async (istek: Request, yanit: Response<ApiYaniti<HaritaDTO>>): Promise<void> => {
      const yeniHarita = await this.haritaServisi.iceAktar(istek.body);
      yanit.status(201).json({ basarili: true, veri: yeniHarita });
    }
  );

  guncelle = asyncHandler(
    async (istek: Request, yanit: Response<ApiYaniti<HaritaDTO>>): Promise<void> => {
      const guncelHarita = await this.haritaServisi.guncelle(istek.params.id, istek.body);
      yanit.status(200).json({ basarili: true, veri: guncelHarita });
    }
  );

  sil = asyncHandler(
    async (istek: Request, yanit: Response<ApiYaniti<void>>): Promise<void> => {
      await this.haritaServisi.sil(istek.params.id);
      yanit.status(200).json({ basarili: true });
    }
  );
}

export default new HaritaController(haritaServisiVarsayilan);
