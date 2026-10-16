import { Harita, Prisma } from "@prisma/client";
import prisma from "../lib/prismaIstemcisi";
import type { HaritaPaketiDTO } from "../types";

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

  async iceAktar(paket: HaritaPaketiDTO): Promise<Harita> {
    return prisma.$transaction(async (tx) => {
      const yeniHarita = await tx.harita.create({
        data: {
          baslik: paket.harita.baslik,
          aciklama: paket.harita.aciklama,
        },
      });

      const eskiIdYeniIdEslestirmesi = new Map<string, string>();

      for (const dugum of paket.dugumler) {
        const yeniDugum = await tx.dugum.create({
          data: {
            haritaId: yeniHarita.id,
            etiket: dugum.etiket,
            tur: dugum.tur,
            pozisyonX: dugum.pozisyonX,
            pozisyonY: dugum.pozisyonY,
            ozellikler: JSON.stringify(dugum.ozellikler ?? {}),
          },
        });
        if (dugum.id) {
          eskiIdYeniIdEslestirmesi.set(dugum.id, yeniDugum.id);
        }
      }

      for (const kenar of paket.kenarlar) {
        const yeniKaynakId = eskiIdYeniIdEslestirmesi.get(kenar.kaynakId) ?? kenar.kaynakId;
        const yeniHedefId = eskiIdYeniIdEslestirmesi.get(kenar.hedefId) ?? kenar.hedefId;

        if (yeniKaynakId && yeniHedefId && yeniKaynakId !== yeniHedefId) {
          await tx.kenar.create({
            data: {
              haritaId: yeniHarita.id,
              kaynakId: yeniKaynakId,
              hedefId: yeniHedefId,
              etiket: kenar.etiket,
              yon: kenar.yon ?? "tek_yonlu",
            },
          });
        }
      }

      return yeniHarita;
    });
  }
}

export default new HaritaRepository();
