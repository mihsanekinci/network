import { Harita, Prisma } from "@prisma/client";
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
    try {
      return await prisma.harita.update({ where: { id }, data: veri });
    } catch (hata) {
      if (hata instanceof Prisma.PrismaClientKnownRequestError && hata.code === "P2025") {
        throw new Error("Harita bulunamadı");
      }
      throw hata;
    }
  }

  async sil(id: string): Promise<void> {
    try {
      await prisma.harita.delete({ where: { id } });
    } catch (hata) {
      if (hata instanceof Prisma.PrismaClientKnownRequestError && hata.code === "P2025") {
        return;
      }
      throw hata;
    }
  }
}

export default new HaritaRepository();
