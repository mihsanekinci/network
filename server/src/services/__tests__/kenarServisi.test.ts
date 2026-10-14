import { describe, it, expect, vi, beforeEach } from "vitest";
import { Dugum, Kenar } from "@prisma/client";
import type { KenarOlusturDTO, KenarGuncelleDTO } from "../../types";
import { KenarServisi, type KenarRepo, type DugumRepo } from "../kenarServisi";

describe("KenarServisi", () => {
  let sahteKenarRepo: KenarRepo;
  let sahteDugumRepo: DugumRepo;
  let kenarServisi: KenarServisi;

  const ornekTarih = new Date("2026-01-01T12:00:00.000Z");

  const ornekDugum1: Dugum = {
    id: "dugum-1",
    haritaId: "harita-1",
    etiket: "Kaynak Düğüm",
    tur: "kisi",
    pozisyonX: 100,
    pozisyonY: 100,
    ozellikler: "{}",
    olusturulmaTarihi: ornekTarih,
    guncellenmeTarihi: ornekTarih,
  };

  const ornekDugum2: Dugum = {
    id: "dugum-2",
    haritaId: "harita-1",
    etiket: "Hedef Düğüm",
    tur: "kurum",
    pozisyonX: 200,
    pozisyonY: 200,
    ozellikler: "{}",
    olusturulmaTarihi: ornekTarih,
    guncellenmeTarihi: ornekTarih,
  };

  const ornekKenar: Kenar = {
    id: "kenar-1",
    haritaId: "harita-1",
    kaynakId: "dugum-1",
    hedefId: "dugum-2",
    etiket: "çalışıyor",
    yon: "tek_yonlu",
    olusturulmaTarihi: ornekTarih,
    guncellenmeTarihi: ornekTarih,
  };

  beforeEach(() => {
    sahteKenarRepo = {
      haritayaGoreGetir: vi.fn(),
      idIleGetir: vi.fn(),
      olustur: vi.fn(),
      guncelle: vi.fn(),
      sil: vi.fn(),
    };
    sahteDugumRepo = {
      idileGetir: vi.fn(),
    };
    kenarServisi = new KenarServisi(sahteKenarRepo, sahteDugumRepo);
  });

  describe("haritayaGoreGetir", () => {
    it("haritaya ait kenarları getirmeli", async () => {
      vi.mocked(sahteKenarRepo.haritayaGoreGetir).mockResolvedValue([ornekKenar]);

      const sonuc = await kenarServisi.haritayaGoreGetir("harita-1");

      expect(sahteKenarRepo.haritayaGoreGetir).toHaveBeenCalledWith("harita-1");
      expect(sonuc).toEqual([
        {
          id: "kenar-1",
          haritaId: "harita-1",
          kaynakId: "dugum-1",
          hedefId: "dugum-2",
          etiket: "çalışıyor",
          yon: "tek_yonlu",
          olusturulmaTarihi: ornekTarih.toISOString(),
          guncellenmeTarihi: ornekTarih.toISOString(),
        },
      ]);
    });

    it("etiketi olmayan kenarları da doğru dönüştürmeli", async () => {
      const etiketsizKenar: Kenar = {
        ...ornekKenar,
        id: "kenar-2",
        etiket: null,
      };
      vi.mocked(sahteKenarRepo.haritayaGoreGetir).mockResolvedValue([etiketsizKenar]);

      const sonuc = await kenarServisi.haritayaGoreGetir("harita-1");

      expect(sonuc[0].etiket).toBeUndefined();
    });
  });

  describe("olustur", () => {
    const yeniKenarVerisi: KenarOlusturDTO = {
      haritaId: "harita-1",
      kaynakId: "dugum-1",
      hedefId: "dugum-2",
      etiket: "çalışıyor",
      yon: "tek_yonlu",
    };

    it("kaynak düğüm bulunamadığında hata fırlatmalı", async () => {
      vi.mocked(sahteDugumRepo.idileGetir).mockResolvedValue(null);

      await expect(kenarServisi.olustur(yeniKenarVerisi)).rejects.toThrow(
        "Kaynak düğüm bulunamadı"
      );
      expect(sahteDugumRepo.idileGetir).toHaveBeenCalledWith("dugum-1");
      expect(sahteKenarRepo.olustur).not.toHaveBeenCalled();
    });

    it("hedef düğüm bulunamadığında hata fırlatmalı", async () => {
      vi.mocked(sahteDugumRepo.idileGetir)
        .mockResolvedValueOnce(ornekDugum1)
        .mockResolvedValueOnce(null);

      await expect(kenarServisi.olustur(yeniKenarVerisi)).rejects.toThrow(
        "Hedef düğüm bulunamadı"
      );
      expect(sahteDugumRepo.idileGetir).toHaveBeenCalledWith("dugum-2");
      expect(sahteKenarRepo.olustur).not.toHaveBeenCalled();
    });

    it("kaynak ve hedef düğümler farklı haritalarda ise hata fırlatmalı", async () => {
      const farkliHaritaDugumu: Dugum = {
        ...ornekDugum2,
        haritaId: "baska-harita",
      };

      vi.mocked(sahteDugumRepo.idileGetir)
        .mockResolvedValueOnce(ornekDugum1)
        .mockResolvedValueOnce(farkliHaritaDugumu);

      await expect(kenarServisi.olustur(yeniKenarVerisi)).rejects.toThrow(
        "Kaynak ve hedef düğümler aynı haritada olmalıdır"
      );
      expect(sahteKenarRepo.olustur).not.toHaveBeenCalled();
    });

    it("aynı bağlantı zaten mevcutsa hata fırlatmalı", async () => {
      vi.mocked(sahteDugumRepo.idileGetir)
        .mockResolvedValueOnce(ornekDugum1)
        .mockResolvedValueOnce(ornekDugum2);
      vi.mocked(sahteKenarRepo.haritayaGoreGetir).mockResolvedValue([ornekKenar]);

      await expect(kenarServisi.olustur(yeniKenarVerisi)).rejects.toThrow(
        "Bu bağlantı zaten mevcut"
      );
      expect(sahteKenarRepo.olustur).not.toHaveBeenCalled();
    });

    it("yeni kenarı başarıyla oluşturmalı", async () => {
      vi.mocked(sahteDugumRepo.idileGetir)
        .mockResolvedValueOnce(ornekDugum1)
        .mockResolvedValueOnce(ornekDugum2);
      vi.mocked(sahteKenarRepo.haritayaGoreGetir).mockResolvedValue([]);
      vi.mocked(sahteKenarRepo.olustur).mockResolvedValue(ornekKenar);

      const sonuc = await kenarServisi.olustur(yeniKenarVerisi);

      expect(sahteKenarRepo.olustur).toHaveBeenCalledWith(yeniKenarVerisi);
      expect(sonuc).toEqual({
        id: "kenar-1",
        haritaId: "harita-1",
        kaynakId: "dugum-1",
        hedefId: "dugum-2",
        etiket: "çalışıyor",
        yon: "tek_yonlu",
        olusturulmaTarihi: ornekTarih.toISOString(),
        guncellenmeTarihi: ornekTarih.toISOString(),
      });
    });
  });

  describe("guncelle", () => {
    it("kenar etiketini ve yonunu basariyla guncellemeli", async () => {
      const guncelKenar: Kenar = {
        ...ornekKenar,
        etiket: "ortak",
        yon: "cift_yonlu",
        guncellenmeTarihi: new Date("2026-01-02T12:00:00.000Z"),
      };
      vi.mocked(sahteKenarRepo.idIleGetir).mockResolvedValue(ornekKenar);
      vi.mocked(sahteKenarRepo.guncelle).mockResolvedValue(guncelKenar);

      const guncellemeVerisi: KenarGuncelleDTO = {
        etiket: "ortak",
        yon: "cift_yonlu",
      };

      const sonuc = await kenarServisi.guncelle("kenar-1", guncellemeVerisi);

      expect(sahteKenarRepo.idIleGetir).toHaveBeenCalledWith("kenar-1");
      expect(sahteKenarRepo.guncelle).toHaveBeenCalledWith("kenar-1", {
        etiket: "ortak",
        yon: "cift_yonlu",
      });
      expect(sonuc).toEqual({
        id: "kenar-1",
        haritaId: "harita-1",
        kaynakId: "dugum-1",
        hedefId: "dugum-2",
        etiket: "ortak",
        yon: "cift_yonlu",
        olusturulmaTarihi: ornekTarih.toISOString(),
        guncellenmeTarihi: "2026-01-02T12:00:00.000Z",
      });
    });

    it("olmayan kenar icin hata firlatmali", async () => {
      vi.mocked(sahteKenarRepo.idIleGetir).mockResolvedValue(null);

      await expect(
        kenarServisi.guncelle("olmayan-kenar", { etiket: "yeni" })
      ).rejects.toThrow("Kenar bulunamadı");
      expect(sahteKenarRepo.idIleGetir).toHaveBeenCalledWith("olmayan-kenar");
      expect(sahteKenarRepo.guncelle).not.toHaveBeenCalled();
    });

    it("gecersiz yon degeri icin hata firlatmali", async () => {
      vi.mocked(sahteKenarRepo.idIleGetir).mockResolvedValue(ornekKenar);

      await expect(
        kenarServisi.guncelle("kenar-1", { yon: "gecersiz_yon" as any })
      ).rejects.toThrow("Geçersiz yön değeri");
      expect(sahteKenarRepo.idIleGetir).toHaveBeenCalledWith("kenar-1");
      expect(sahteKenarRepo.guncelle).not.toHaveBeenCalled();
    });
  });

  describe("sil", () => {
    it("kenarı başarıyla silmeli", async () => {
      vi.mocked(sahteKenarRepo.sil).mockResolvedValue(undefined);

      await kenarServisi.sil("kenar-1");

      expect(sahteKenarRepo.sil).toHaveBeenCalledWith("kenar-1");
    });
  });
});
