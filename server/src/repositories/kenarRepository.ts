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

  async idIleGetir(id: string): Promise<Kenar | null> {
    return prisma.kenar.findUnique({ where: { id } });
  }

  async olustur(veri: KenarOlusturGirdisi): Promise<Kenar> {
    return prisma.kenar.create({ data: veri });
  }

  async guncelle(id: string, veri: { etiket?: string; yon?: string }): Promise<Kenar> {
    return prisma.kenar.update({ where: { id }, data: veri });
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
