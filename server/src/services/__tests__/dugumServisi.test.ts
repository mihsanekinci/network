import { describe, it, expect, vi, beforeEach } from "vitest";
import { Dugum } from "@prisma/client";
import { DugumOlusturDTO, DugumGuncelleDTO } from "../../../../shared/types";
import { DugumServisi, DugumRepo } from "../dugumServisi";

const sahteDugum: Dugum = {
  id: "dugum-1",
  haritaId: "harita-1",
  etiket: "React",
  tur: "kavram",
  pozisyonX: 100,
  pozisyonY: 200,
  ozellikler: JSON.stringify({ seviye: "ileri", notlar: "Frontend kütüphanesi" }),
  olusturulmaTarihi: new Date("2026-01-01T00:00:00.000Z"),
  guncellenmeTarihi: new Date("2026-01-02T00:00:00.000Z"),
};

describe("DugumServisi", () => {
  let sahteRepo: DugumRepo;
  let dugumServisi: DugumServisi;

  beforeEach(() => {
    sahteRepo = {
      haritayaGoreGetir: vi.fn(),
      idileGetir: vi.fn(),
      olustur: vi.fn(),
      guncelle: vi.fn(),
      sil: vi.fn(),
    };
    dugumServisi = new DugumServisi(sahteRepo);
  });

  describe("haritayaGoreGetir", () => {
    it("haritaya ait düğümleri getirmeli ve ozellikler JSON alanını ayrıştırmalı", async () => {
      vi.mocked(sahteRepo.haritayaGoreGetir).mockResolvedValue([sahteDugum]);

      const sonuc = await dugumServisi.haritayaGoreGetir("harita-1");

      expect(sahteRepo.haritayaGoreGetir).toHaveBeenCalledWith("harita-1");
      expect(sonuc).toEqual([
        {
          id: "dugum-1",
          haritaId: "harita-1",
          etiket: "React",
          tur: "kavram",
          pozisyonX: 100,
          pozisyonY: 200,
          ozellikler: { seviye: "ileri", notlar: "Frontend kütüphanesi" },
          olusturulmaTarihi: "2026-01-01T00:00:00.000Z",
          guncellenmeTarihi: "2026-01-02T00:00:00.000Z",
        },
      ]);
    });
  });

  describe("olustur", () => {
    it("etiket boş olduğunda hata fırlatmalı", async () => {
      const yeniDugumVerisi: DugumOlusturDTO = {
        haritaId: "harita-1",
        etiket: "   ",
        tur: "kavram",
        pozisyonX: 0,
        pozisyonY: 0,
      };

      await expect(dugumServisi.olustur(yeniDugumVerisi)).rejects.toThrow("Etiket boş olamaz");
      expect(sahteRepo.olustur).not.toHaveBeenCalled();
    });

    it("aynı haritada mükerrer etiket kullanıldığında hata fırlatmalı", async () => {
      vi.mocked(sahteRepo.haritayaGoreGetir).mockResolvedValue([sahteDugum]);

      const yeniDugumVerisi: DugumOlusturDTO = {
        haritaId: "harita-1",
        etiket: "React",
        tur: "kavram",
        pozisyonX: 150,
        pozisyonY: 250,
      };

      await expect(dugumServisi.olustur(yeniDugumVerisi)).rejects.toThrow("Bu etiket zaten kullanılıyor");
      expect(sahteRepo.haritayaGoreGetir).toHaveBeenCalledWith("harita-1");
      expect(sahteRepo.olustur).not.toHaveBeenCalled();
    });

    it("yeni düğümü başarıyla oluşturmalı", async () => {
      vi.mocked(sahteRepo.haritayaGoreGetir).mockResolvedValue([]);
      vi.mocked(sahteRepo.olustur).mockResolvedValue(sahteDugum);

      const yeniDugumVerisi: DugumOlusturDTO = {
        haritaId: "harita-1",
        etiket: "React",
        tur: "kavram",
        pozisyonX: 100,
        pozisyonY: 200,
        ozellikler: { seviye: "ileri", notlar: "Frontend kütüphanesi" },
      };

      const sonuc = await dugumServisi.olustur(yeniDugumVerisi);

      expect(sahteRepo.haritayaGoreGetir).toHaveBeenCalledWith("harita-1");
      expect(sahteRepo.olustur).toHaveBeenCalledWith(yeniDugumVerisi);
      expect(sonuc).toEqual({
        id: "dugum-1",
        haritaId: "harita-1",
        etiket: "React",
        tur: "kavram",
        pozisyonX: 100,
        pozisyonY: 200,
        ozellikler: { seviye: "ileri", notlar: "Frontend kütüphanesi" },
        olusturulmaTarihi: "2026-01-01T00:00:00.000Z",
        guncellenmeTarihi: "2026-01-02T00:00:00.000Z",
      });
    });
  });

  describe("guncelle", () => {
    it("var olmayan düğüm güncellenirken hata fırlatmalı", async () => {
      vi.mocked(sahteRepo.idileGetir).mockResolvedValue(null);

      const guncellemeVerisi: DugumGuncelleDTO = { etiket: "Vue" };

      await expect(dugumServisi.guncelle("olmayan-id", guncellemeVerisi)).rejects.toThrow("Düğüm bulunamadı");
      expect(sahteRepo.idileGetir).toHaveBeenCalledWith("olmayan-id");
      expect(sahteRepo.guncelle).not.toHaveBeenCalled();
    });

    it("düğümü başarıyla güncellemeli", async () => {
      const guncellenmisDugum: Dugum = {
        ...sahteDugum,
        etiket: "Vue",
        guncellenmeTarihi: new Date("2026-01-03T00:00:00.000Z"),
      };
      vi.mocked(sahteRepo.idileGetir).mockResolvedValue(sahteDugum);
      vi.mocked(sahteRepo.guncelle).mockResolvedValue(guncellenmisDugum);

      const guncellemeVerisi: DugumGuncelleDTO = { etiket: "Vue" };
      const sonuc = await dugumServisi.guncelle("dugum-1", guncellemeVerisi);

      expect(sahteRepo.idileGetir).toHaveBeenCalledWith("dugum-1");
      expect(sahteRepo.guncelle).toHaveBeenCalledWith("dugum-1", guncellemeVerisi);
      expect(sonuc.etiket).toBe("Vue");
      expect(sonuc.guncellenmeTarihi).toBe("2026-01-03T00:00:00.000Z");
    });
  });

  describe("sil", () => {
    it("var olmayan düğüm silinirken hata fırlatmalı", async () => {
      vi.mocked(sahteRepo.idileGetir).mockResolvedValue(null);

      await expect(dugumServisi.sil("olmayan-id")).rejects.toThrow("Düğüm bulunamadı");
      expect(sahteRepo.idileGetir).toHaveBeenCalledWith("olmayan-id");
      expect(sahteRepo.sil).not.toHaveBeenCalled();
    });

    it("düğümü başarıyla silmeli", async () => {
      vi.mocked(sahteRepo.idileGetir).mockResolvedValue(sahteDugum);
      vi.mocked(sahteRepo.sil).mockResolvedValue();

      await dugumServisi.sil("dugum-1");

      expect(sahteRepo.idileGetir).toHaveBeenCalledWith("dugum-1");
      expect(sahteRepo.sil).toHaveBeenCalledWith("dugum-1");
    });
  });
});
