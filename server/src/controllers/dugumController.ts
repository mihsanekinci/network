import { Request, Response } from "express";
import dugumServisiVarsayilan from "../services/dugumServisi";
import { DugumDTO, DugumOlusturDTO, DugumGuncelleDTO, ApiYaniti } from "../../../shared/types";

interface DugumServisArayuzu {
  haritayaGoreGetir(haritaId: string): Promise<DugumDTO[]>;
  olustur(veri: DugumOlusturDTO): Promise<DugumDTO>;
  guncelle(id: string, veri: DugumGuncelleDTO): Promise<DugumDTO>;
  sil(id: string): Promise<void>;
}

export class DugumController {
  constructor(private readonly dugumServisi: DugumServisArayuzu) {}

  haritayaGoreGetir = async (
    istek: Request,
    yanit: Response<ApiYaniti<DugumDTO[]>>
  ): Promise<void> => {
    try {
      const haritaId = istek.params.haritaId ?? (istek.query.haritaId as string);
      if (!haritaId) {
        yanit.status(400).json({ basarili: false, hata: "Harita ID belirtilmelidir" });
        return;
      }
      const dugumler = await this.dugumServisi.haritayaGoreGetir(haritaId);
      yanit.status(200).json({ basarili: true, veri: dugumler });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Düğümler getirilemedi";
      yanit.status(500).json({ basarili: false, hata: mesaj });
    }
  };

  olustur = async (
    istek: Request,
    yanit: Response<ApiYaniti<DugumDTO>>
  ): Promise<void> => {
    try {
      const haritaId = istek.params.haritaId ?? istek.body.haritaId;
      if (!haritaId) {
        yanit.status(400).json({ basarili: false, hata: "Harita ID belirtilmelidir" });
        return;
      }
      const veri: DugumOlusturDTO = { ...istek.body, haritaId };
      const yeniDugum = await this.dugumServisi.olustur(veri);
      yanit.status(201).json({ basarili: true, veri: yeniDugum });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Düğüm oluşturulamadı";
      yanit.status(400).json({ basarili: false, hata: mesaj });
    }
  };

  guncelle = async (
    istek: Request,
    yanit: Response<ApiYaniti<DugumDTO>>
  ): Promise<void> => {
    try {
      const id = istek.params.id ?? istek.params.dugumId;
      const guncelDugum = await this.dugumServisi.guncelle(id, istek.body);
      yanit.status(200).json({ basarili: true, veri: guncelDugum });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Düğüm güncellenemedi";
      const durumKodu = mesaj === "Düğüm bulunamadı" ? 404 : 400;
      yanit.status(durumKodu).json({ basarili: false, hata: mesaj });
    }
  };

  sil = async (
    istek: Request,
    yanit: Response<ApiYaniti<void>>
  ): Promise<void> => {
    try {
      const id = istek.params.id ?? istek.params.dugumId;
      await this.dugumServisi.sil(id);
      yanit.status(200).json({ basarili: true });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Düğüm silinemedi";
      const durumKodu = mesaj === "Düğüm bulunamadı" ? 404 : 400;
      yanit.status(durumKodu).json({ basarili: false, hata: mesaj });
    }
  };
}

export default new DugumController(dugumServisiVarsayilan);
