import { Request, Response } from "express";
import kenarServisiVarsayilan from "../services/kenarServisi";
import { KenarDTO, KenarOlusturDTO, ApiYaniti } from "../../../shared/types";

interface KenarServisArayuzu {
  haritayaGoreGetir(haritaId: string): Promise<KenarDTO[]>;
  olustur(veri: KenarOlusturDTO): Promise<KenarDTO>;
  sil(id: string): Promise<void>;
}

export class KenarController {
  constructor(private readonly kenarServisi: KenarServisArayuzu) {}

  haritayaGoreGetir = async (
    istek: Request,
    yanit: Response<ApiYaniti<KenarDTO[]>>
  ): Promise<void> => {
    try {
      const haritaId = istek.params.haritaId ?? (istek.query.haritaId as string);
      if (!haritaId) {
        yanit.status(400).json({ basarili: false, hata: "Harita ID belirtilmelidir" });
        return;
      }
      const kenarlar = await this.kenarServisi.haritayaGoreGetir(haritaId);
      yanit.status(200).json({ basarili: true, veri: kenarlar });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Kenarlar getirilemedi";
      yanit.status(500).json({ basarili: false, hata: mesaj });
    }
  };

  olustur = async (
    istek: Request,
    yanit: Response<ApiYaniti<KenarDTO>>
  ): Promise<void> => {
    try {
      const haritaId = istek.params.haritaId ?? istek.body.haritaId;
      if (!haritaId) {
        yanit.status(400).json({ basarili: false, hata: "Harita ID belirtilmelidir" });
        return;
      }
      const veri: KenarOlusturDTO = { ...istek.body, haritaId };
      const yeniKenar = await this.kenarServisi.olustur(veri);
      yanit.status(201).json({ basarili: true, veri: yeniKenar });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Kenar oluşturulamadı";
      yanit.status(400).json({ basarili: false, hata: mesaj });
    }
  };

  sil = async (
    istek: Request,
    yanit: Response<ApiYaniti<void>>
  ): Promise<void> => {
    try {
      const id = istek.params.id ?? istek.params.kenarId;
      await this.kenarServisi.sil(id);
      yanit.status(200).json({ basarili: true });
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Kenar silinemedi";
      yanit.status(400).json({ basarili: false, hata: mesaj });
    }
  };
}

export default new KenarController(kenarServisiVarsayilan);
