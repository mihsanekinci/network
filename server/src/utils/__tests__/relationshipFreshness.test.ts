import { describe, it, expect } from "vitest";
import {
  hesaplaTazelik,
  enGuncelTemasTarihi,
  yeniEtkilesimOlustur,
  VARSAYILAN_HEDEF_ARALIK_GUN,
} from "../relationshipFreshness";

describe("Relationship Freshness Utility", () => {
  const referansBugun = "2026-11-10T12:00:00.000Z";

  describe("enGuncelTemasTarihi", () => {
    it("boş veya tanımsız özelliklerde null dönmeli", () => {
      expect(enGuncelTemasTarihi(undefined)).toBeNull();
      expect(enGuncelTemasTarihi({})).toBeNull();
    });

    it("sadece sonTemasTarihi varsa onu dönmeli", () => {
      const ozellikler = { sonTemasTarihi: "2026-11-01" };
      expect(enGuncelTemasTarihi(ozellikler)).toBe("2026-11-01");
    });

    it("etkilesimler dizisindeki en yeni tarihi tespit etmeli", () => {
      const ozellikler = {
        sonTemasTarihi: "2026-10-15",
        etkilesimler: [
          { id: "1", tarih: "2026-09-01", tur: "eposta", ozet: "Eski e-posta" },
          { id: "2", tarih: "2026-11-05", tur: "toplanti", ozet: "Yeni toplantı" },
          { id: "3", tarih: "2026-10-20", tur: "arama", ozet: "Telefon" },
        ],
      };
      expect(enGuncelTemasTarihi(ozellikler)).toBe("2026-11-05");
    });
  });

  describe("hesaplaTazelik", () => {
    it("hiç temas tarihi yoksa 'belirsiz' durumu dönmeli", () => {
      const sonuc = hesaplaTazelik({}, referansBugun);
      expect(sonuc.durum).toBe("belirsiz");
      expect(sonuc.gecenGun).toBeNull();
      expect(sonuc.kalanGun).toBeNull();
      expect(sonuc.hedefAralikGun).toBe(VARSAYILAN_HEDEF_ARALIK_GUN);
      expect(sonuc.etiket).toBe("Temas kaydı yok");
    });

    it("bugün yapılmış temas için 'taze' ve 'Bugün' dönmeli", () => {
      const ozellikler = { sonTemasTarihi: "2026-11-10" };
      const sonuc = hesaplaTazelik(ozellikler, referansBugun);
      expect(sonuc.durum).toBe("taze");
      expect(sonuc.gecenGun).toBe(0);
      expect(sonuc.etiket).toBe("Bugün");
    });

    it("dün yapılmış temas için 'taze' ve 'Dün' dönmeli", () => {
      const ozellikler = { sonTemasTarihi: "2026-11-09" };
      const sonuc = hesaplaTazelik(ozellikler, referansBugun);
      expect(sonuc.durum).toBe("taze");
      expect(sonuc.gecenGun).toBe(1);
      expect(sonuc.etiket).toBe("Dün");
    });

    it("hedef aralığın %65'i ile %100'ü arasındaki temas için 'ilgi_bekliyor' dönmeli", () => {
      // Hedef 90 gün ise %65'i 59 gündür. 70 gün önce ilgi bekliyor olmalı.
      const ozellikler = {
        sonTemasTarihi: "2026-09-01",
        hedefTemasAraligiGun: 90,
      };
      const sonuc = hesaplaTazelik(ozellikler, referansBugun);
      expect(sonuc.durum).toBe("ilgi_bekliyor");
      expect(sonuc.gecenGun).toBeGreaterThan(58);
      expect(sonuc.gecenGun).toBeLessThanOrEqual(90);
    });

    it("hedef aralığı aşmış temas için 'uykuda' dönmeli", () => {
      const ozellikler = {
        sonTemasTarihi: "2026-06-01",
        hedefTemasAraligiGun: 60,
      };
      const sonuc = hesaplaTazelik(ozellikler, referansBugun);
      expect(sonuc.durum).toBe("uykuda");
      expect(sonuc.etiket).toContain("uykuda");
    });
  });

  describe("yeniEtkilesimOlustur", () => {
    it("geçerli bir etkileşim nesnesi üretmeli", () => {
      const etk = yeniEtkilesimOlustur(
        "kahve_yemek",
        "  Öğle yemeği ve sohbet  ",
        "  Proje detayları konuşuldu  ",
        "2026-11-08"
      );
      expect(etk.id).toMatch(/^etk_/);
      expect(etk.tur).toBe("kahve_yemek");
      expect(etk.ozet).toBe("Öğle yemeği ve sohbet");
      expect(etk.notlar).toBe("Proje detayları konuşuldu");
      expect(etk.tarih).toBe("2026-11-08");
    });
  });
});
