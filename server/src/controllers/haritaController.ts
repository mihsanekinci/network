import { Request, Response } from "express";
import haritaServisiVarsayilan from "../services/haritaServisi";
import { HaritaDTO, HaritaOlusturDTO, HaritaGuncelleDTO, ApiYaniti } from "../../../shared/types";

interface HaritaServisArayuzu {
  tumunuGetir(): Promise<HaritaDTO[]>;
  idileGetir(id: string): Promise<HaritaDTO>;
  olustur(veri: HaritaOlusturDTO): Promise<HaritaDTO>;
  guncelle(id: string, veri: HaritaGuncelleDTO): Promise<HaritaDTO>;
  sil(id: string): Promise<void>;
}

export class HaritaController {
  constructor(private readonly haritaServisi: HaritaServisArayuzu) {}

  tumunuGetir = async (_istek: Request, yanit: Response<ApiYaniti<HaritaDTO[]>>): Promise<void> => {
    try {
      const haritalar = await this.haritaServisi.tumunuGetir();
      yanit.status(200).json({ basarili: true, veri: haritalar });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Haritalar getirilirken hata oluştu";
      yanit.status(500).json({ basarili: false, hata: mesaj });
    }
  };

  idileGetir = async (istek: Request, yanit: Response<ApiYaniti<HaritaDTO>>): Promise<void> => {
    try {
      const harita = await this.haritaServisi.idileGetir(istek.params.id);
      yanit.status(200).json({ basarili: true, veri: harita });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Harita getirilemedi";
      const durumKodu = mesaj === "Harita bulunamadı" ? 404 : 400;
      yanit.status(durumKodu).json({ basarili: false, hata: mesaj });
    }
  };

  olustur = async (istek: Request, yanit: Response<ApiYaniti<HaritaDTO>>): Promise<void> => {
    try {
      const yeniHarita = await this.haritaServisi.olustur(istek.body);
      yanit.status(201).json({ basarili: true, veri: yeniHarita });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Harita oluşturulamadı";
      yanit.status(400).json({ basarili: false, hata: mesaj });
    }
  };

  guncelle = async (istek: Request, yanit: Response<ApiYaniti<HaritaDTO>>): Promise<void> => {
    try {
      const guncelHarita = await this.haritaServisi.guncelle(istek.params.id, istek.body);
      yanit.status(200).json({ basarili: true, veri: guncelHarita });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Harita güncellenemedi";
      const durumKodu = mesaj === "Harita bulunamadı" ? 404 : 400;
      yanit.status(durumKodu).json({ basarili: false, hata: mesaj });
    }
  };

  sil = async (istek: Request, yanit: Response<ApiYaniti<void>>): Promise<void> => {
    try {
      await this.haritaServisi.sil(istek.params.id);
      yanit.status(200).json({ basarili: true });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Harita silinemedi";
      const durumKodu = mesaj === "Harita bulunamadı" ? 404 : 400;
      yanit.status(durumKodu).json({ basarili: false, hata: mesaj });
    }
  };
}

export default new HaritaController(haritaServisiVarsayilan);
