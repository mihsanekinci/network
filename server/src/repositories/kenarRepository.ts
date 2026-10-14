import { Kenar, Prisma } from "@prisma/client";
import prisma from "../lib/prismaIstemcisi";

interface KenarOlusturGirdisi {
  haritaId: string;
  kaynakId: string;
  hedefId: string;
  etiket?: string;
  yon?: string;
}

class KenarRepository {
  async haritayaGoreGetir(haritaId: string): Promise<Kenar[]> {
    return prisma.kenar.findMany({ where: { haritaId } });
  }

  async olustur(veri: KenarOlusturGirdisi): Promise<Kenar> {
    return prisma.kenar.create({ data: veri });
  }

  async sil(id: string): Promise<void> {
    try {
      await prisma.kenar.delete({ where: { id } });
    } catch (hata) {
      if (hata instanceof Prisma.PrismaClientKnownRequestError && hata.code === "P2025") {
        return;
      }
      throw hata;
    }
  }
}

export default new KenarRepository();
