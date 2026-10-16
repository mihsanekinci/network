import { Harita } from "@prisma/client";
import type { HaritaDTO, HaritaOlusturDTO, HaritaGuncelleDTO, HaritaPaketiDTO } from "../types";
import haritaRepositoryVarsayilan from "../repositories/haritaRepository";

interface HaritaRepo {
  tumunuGetir(): Promise<Harita[]>;
  idileGetir(id: string): Promise<Harita | null>;
  olustur(veri: HaritaOlusturDTO): Promise<Harita>;
  guncelle(id: string, veri: HaritaGuncelleDTO): Promise<Harita>;
  sil(id: string): Promise<void>;
  iceAktar(paket: HaritaPaketiDTO): Promise<Harita>;
}

function donustur(harita: Harita): HaritaDTO {
  return {
    id: harita.id,
    baslik: harita.baslik,
    aciklama: harita.aciklama ?? undefined,
    olusturulmaTarihi: harita.olusturulmaTarihi.toISOString(),
    guncellenmeTarihi: harita.guncellenmeTarihi.toISOString(),
  };
}

class HaritaServisi {
  constructor(private readonly haritaRepository: HaritaRepo) {}

  async tumunuGetir(): Promise<HaritaDTO[]> {
    const haritalar = await this.haritaRepository.tumunuGetir();
    return haritalar.map(donustur);
  }

  async idileGetir(id: string): Promise<HaritaDTO> {
    const harita = await this.varliginiDogrula(id);
    return donustur(harita);
  }

  async olustur(veri: HaritaOlusturDTO): Promise<HaritaDTO> {
    if (!veri.baslik.trim()) throw new Error("Başlık boş olamaz");
    const harita = await this.haritaRepository.olustur(veri);
    return donustur(harita);
  }

  async guncelle(id: string, veri: HaritaGuncelleDTO): Promise<HaritaDTO> {
    await this.varliginiDogrula(id);
    const harita = await this.haritaRepository.guncelle(id, veri);
    return donustur(harita);
  }

  async sil(id: string): Promise<void> {
    await this.varliginiDogrula(id);
    await this.haritaRepository.sil(id);
  }

  async iceAktar(paket: HaritaPaketiDTO): Promise<HaritaDTO> {
    if (!paket || !paket.harita || !paket.harita.baslik?.trim()) {
      throw new Error("Geçerli bir harita başlığı gereklidir");
    }
    if (!Array.isArray(paket.dugumler)) {
      throw new Error("Düğümler listesi gereklidir");
    }
    if (!Array.isArray(paket.kenarlar)) {
      throw new Error("Kenarlar listesi gereklidir");
    }

    const olusturulanHarita = await this.haritaRepository.iceAktar(paket);
    return donustur(olusturulanHarita);
  }

  private async varliginiDogrula(id: string): Promise<Harita> {
    const harita = await this.haritaRepository.idileGetir(id);
    if (!harita) throw new Error("Harita bulunamadı");
    return harita;
  }
}

export { HaritaServisi, type HaritaRepo };
export default new HaritaServisi(haritaRepositoryVarsayilan);
