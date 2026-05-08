import { Dugum, Kenar } from "@prisma/client";
import { KenarDTO, KenarOlusturDTO, KenarYonu } from "../../../shared/types";
import kenarRepositoryVarsayilan from "../repositories/kenarRepository";
import dugumRepositoryVarsayilan from "../repositories/dugumRepository";

interface KenarRepo {
  haritayaGoreGetir(haritaId: string): Promise<Kenar[]>;
  olustur(veri: KenarOlusturDTO): Promise<Kenar>;
  sil(id: string): Promise<void>;
}

interface DugumRepo {
  idileGetir(id: string): Promise<Dugum | null>;
}

function donustur(kenar: Kenar): KenarDTO {
  return {
    id: kenar.id,
    haritaId: kenar.haritaId,
    kaynakId: kenar.kaynakId,
    hedefId: kenar.hedefId,
    etiket: kenar.etiket ?? undefined,
    yon: kenar.yon as KenarYonu,
    olusturulmaTarihi: kenar.olusturulmaTarihi.toISOString(),
    guncellenmeTarihi: kenar.guncellenmeTarihi.toISOString(),
  };
}

class KenarServisi {
  constructor(
    private readonly kenarRepository: KenarRepo,
    private readonly dugumRepository: DugumRepo
  ) {}

  async haritayaGoreGetir(haritaId: string): Promise<KenarDTO[]> {
    const kenarlar = await this.kenarRepository.haritayaGoreGetir(haritaId);
    return kenarlar.map(donustur);
  }

  async olustur(veri: KenarOlusturDTO): Promise<KenarDTO> {
    await this.dugumlarAyniHaritadaOlmali(veri);
    await this.baglantiYokOlmali(veri);
    const kenar = await this.kenarRepository.olustur(veri);
    return donustur(kenar);
  }

  async sil(id: string): Promise<void> {
    await this.kenarRepository.sil(id);
  }

  private async dugumlarAyniHaritadaOlmali(veri: KenarOlusturDTO): Promise<void> {
    const kaynak = await this.dugumRepository.idileGetir(veri.kaynakId);
    if (!kaynak) throw new Error("Kaynak düğüm bulunamadı");
    const hedef = await this.dugumRepository.idileGetir(veri.hedefId);
    if (!hedef) throw new Error("Hedef düğüm bulunamadı");
    if (kaynak.haritaId !== veri.haritaId || hedef.haritaId !== veri.haritaId) {
      throw new Error("Kaynak ve hedef düğümler aynı haritada olmalıdır");
    }
  }

  private async baglantiYokOlmali(veri: KenarOlusturDTO): Promise<void> {
    const mevcutlar = await this.kenarRepository.haritayaGoreGetir(veri.haritaId);
    const mevcut = mevcutlar.some(
      (k) => k.kaynakId === veri.kaynakId && k.hedefId === veri.hedefId
    );
    if (mevcut) throw new Error("Bu bağlantı zaten mevcut");
  }
}

export default new KenarServisi(kenarRepositoryVarsayilan, dugumRepositoryVarsayilan);
