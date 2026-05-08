import { Dugum } from "@prisma/client";
import { DugumDTO, DugumOlusturDTO, DugumGuncelleDTO, DugumTuru } from "../../../shared/types";
import dugumRepositoryVarsayilan from "../repositories/dugumRepository";

interface DugumRepo {
  haritayaGoreGetir(haritaId: string): Promise<Dugum[]>;
  idileGetir(id: string): Promise<Dugum | null>;
  olustur(veri: DugumOlusturDTO): Promise<Dugum>;
  guncelle(id: string, veri: DugumGuncelleDTO): Promise<Dugum>;
  sil(id: string): Promise<void>;
}

function donustur(dugum: Dugum): DugumDTO {
  return {
    id: dugum.id,
    haritaId: dugum.haritaId,
    etiket: dugum.etiket,
    tur: dugum.tur as DugumTuru,
    pozisyonX: dugum.pozisyonX,
    pozisyonY: dugum.pozisyonY,
    ozellikler: JSON.parse(dugum.ozellikler) as Record<string, unknown>,
    olusturulmaTarihi: dugum.olusturulmaTarihi.toISOString(),
    guncellenmeTarihi: dugum.guncellenmeTarihi.toISOString(),
  };
}

class DugumServisi {
  constructor(private readonly dugumRepository: DugumRepo) {}

  async haritayaGoreGetir(haritaId: string): Promise<DugumDTO[]> {
    const dugumler = await this.dugumRepository.haritayaGoreGetir(haritaId);
    return dugumler.map(donustur);
  }

  async olustur(veri: DugumOlusturDTO): Promise<DugumDTO> {
    if (!veri.etiket.trim()) throw new Error("Etiket boş olamaz");
    const mevcutlar = await this.dugumRepository.haritayaGoreGetir(veri.haritaId);
    if (mevcutlar.some((d) => d.etiket === veri.etiket)) {
      throw new Error("Bu etiket zaten kullanılıyor");
    }
    const dugum = await this.dugumRepository.olustur(veri);
    return donustur(dugum);
  }

  async guncelle(id: string, veri: DugumGuncelleDTO): Promise<DugumDTO> {
    await this.varliginiDogrula(id);
    const dugum = await this.dugumRepository.guncelle(id, veri);
    return donustur(dugum);
  }

  async sil(id: string): Promise<void> {
    await this.varliginiDogrula(id);
    await this.dugumRepository.sil(id);
  }

  private async varliginiDogrula(id: string): Promise<Dugum> {
    const dugum = await this.dugumRepository.idileGetir(id);
    if (!dugum) throw new Error("Düğüm bulunamadı");
    return dugum;
  }
}

export default new DugumServisi(dugumRepositoryVarsayilan);
