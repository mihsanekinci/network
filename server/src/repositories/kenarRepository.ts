import { Kenar } from "@prisma/client";
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
    await prisma.kenar.delete({ where: { id } });
  }
}

export default new KenarRepository();
