import { Harita } from "@prisma/client";
import prisma from "../lib/prismaIstemcisi";

interface HaritaOlusturGirdisi {
  baslik: string;
  aciklama?: string;
}

interface HaritaGuncelleGirdisi {
  baslik?: string;
  aciklama?: string;
}

class HaritaRepository {
  async tumunuGetir(): Promise<Harita[]> {
    return prisma.harita.findMany({
      orderBy: { olusturulmaTarihi: "desc" },
    });
  }

  async idileGetir(id: string): Promise<Harita | null> {
    return prisma.harita.findUnique({ where: { id } });
  }

  async olustur(veri: HaritaOlusturGirdisi): Promise<Harita> {
    return prisma.harita.create({ data: veri });
  }

  async guncelle(id: string, veri: HaritaGuncelleGirdisi): Promise<Harita> {
    return prisma.harita.update({ where: { id }, data: veri });
  }

  async sil(id: string): Promise<void> {
    await prisma.harita.delete({ where: { id } });
  }
}

export default new HaritaRepository();
