import { Dugum } from "@prisma/client";
import prisma from "../lib/prismaIstemcisi";

interface DugumOlusturGirdisi {
  haritaId: string;
  etiket: string;
  tur: string;
  pozisyonX: number;
  pozisyonY: number;
  ozellikler?: Record<string, unknown>;
}

interface DugumGuncelleGirdisi {
  etiket?: string;
  tur?: string;
  pozisyonX?: number;
  pozisyonY?: number;
  ozellikler?: Record<string, unknown>;
}

class DugumRepository {
  async haritayaGoreGetir(haritaId: string): Promise<Dugum[]> {
    return prisma.dugum.findMany({ where: { haritaId } });
  }

  async idileGetir(id: string): Promise<Dugum | null> {
    return prisma.dugum.findUnique({ where: { id } });
  }

  async olustur(veri: DugumOlusturGirdisi): Promise<Dugum> {
    const { ozellikler, ...kalanVeri } = veri;
    return prisma.dugum.create({
      data: {
        ...kalanVeri,
        ozellikler: JSON.stringify(ozellikler ?? {}),
      },
    });
  }

  async guncelle(id: string, veri: DugumGuncelleGirdisi): Promise<Dugum> {
    const { ozellikler, ...kalanVeri } = veri;
    return prisma.dugum.update({
      where: { id },
      data: {
        ...kalanVeri,
        ...(ozellikler !== undefined && {
          ozellikler: JSON.stringify(ozellikler),
        }),
      },
    });
  }

  // Cascade delete: şemadaki onDelete:Cascade kenarları otomatik siler
  async sil(id: string): Promise<void> {
    await prisma.dugum.delete({ where: { id } });
  }
}

export default new DugumRepository();
