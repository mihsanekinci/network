import { Dugum } from "@prisma/client";
import type {
  DugumDTO,
  DugumOlusturDTO,
  DugumGuncelleDTO,
  DugumTuru,
  DugumKonumGuncellemeDTO,
} from "../types";
import dugumRepositoryVarsayilan from "../repositories/dugumRepository";
import { NotFoundError, ValidationError, ConflictError } from "../errors";

interface DugumRepo {
  haritayaGoreGetir(haritaId: string): Promise<Dugum[]>;
  idileGetir(id: string): Promise<Dugum | null>;
  olustur(veri: DugumOlusturDTO): Promise<Dugum>;
  guncelle(id: string, veri: DugumGuncelleDTO): Promise<Dugum>;
  sil(id: string): Promise<void>;
  topluKonumGuncelle(konumlar: DugumKonumGuncellemeDTO[]): Promise<void>;
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
    if (!veri.etiket.trim()) throw new ValidationError("Etiket boş olamaz");
    const mevcutlar = await this.dugumRepository.haritayaGoreGetir(veri.haritaId);
    if (mevcutlar.some((d) => d.etiket === veri.etiket)) {
      throw new ConflictError("Bu etiket zaten kullanılıyor");
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

  async topluKonumGuncelle(
    _haritaId: string,
    konumlar: DugumKonumGuncellemeDTO[]
  ): Promise<void> {
    if (!Array.isArray(konumlar) || konumlar.length === 0) return;
    await this.dugumRepository.topluKonumGuncelle(konumlar);
  }

  private async varliginiDogrula(id: string): Promise<Dugum> {
    const dugum = await this.dugumRepository.idileGetir(id);
    if (!dugum) throw new NotFoundError("Düğüm bulunamadı");
    return dugum;
  }
}

export { DugumServisi, type DugumRepo };
export default new DugumServisi(dugumRepositoryVarsayilan);
