import { Dugum, Prisma } from "@prisma/client";
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
    try {
      return await prisma.dugum.update({
        where: { id },
        data: {
          ...kalanVeri,
          ...(ozellikler !== undefined && {
            ozellikler: JSON.stringify(ozellikler),
          }),
        },
      });
    } catch (hata) {
      if (hata instanceof Prisma.PrismaClientKnownRequestError && hata.code === "P2025") {
        throw new Error("Düğüm bulunamadı");
      }
      throw hata;
    }
  }

  // Cascade delete: şemadaki onDelete:Cascade kenarları otomatik siler
  async sil(id: string): Promise<void> {
    try {
      await prisma.dugum.delete({ where: { id } });
    } catch (hata) {
      if (hata instanceof Prisma.PrismaClientKnownRequestError && hata.code === "P2025") {
        return;
      }
      throw hata;
    }
  }

  async topluKonumGuncelle(
    konumlar: Array<{ id: string; pozisyonX: number; pozisyonY: number }>
  ): Promise<void> {
    await prisma.$transaction(
      konumlar.map((k) =>
        prisma.dugum.update({
          where: { id: k.id },
          data: { pozisyonX: k.pozisyonX, pozisyonY: k.pozisyonY },
        })
      )
    );
  }
}

export default new DugumRepository();
