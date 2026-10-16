import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Veritabanı İndeks Güvenliği (Prisma Şema Doğrulaması)", () => {
  const schemaPath = path.resolve(__dirname, "../../../prisma/schema.prisma");
  const schemaIcerik = fs.readFileSync(schemaPath, "utf-8");

  describe("Dugum Modeli İndeksleri", () => {
    it("@@index([haritaId]) indeksi tanımlanmış olmalı", () => {
      expect(schemaIcerik).toContain("@@index([haritaId])");
    });

    it("@@index([haritaId, etiket]) bileşik indeksi tanımlanmış olmalı", () => {
      expect(schemaIcerik).toContain("@@index([haritaId, etiket])");
    });

    it("Dugum model bloğu içerisinde indeksler bulunmalı", () => {
      const baslangic = schemaIcerik.indexOf("model Dugum");
      const bitis = schemaIcerik.indexOf("model Kenar");
      expect(baslangic).toBeGreaterThan(-1);
      expect(bitis).toBeGreaterThan(baslangic);

      const dugumModelGovde = schemaIcerik.slice(baslangic, bitis);
      expect(dugumModelGovde).toMatch(/@@index\(\[haritaId\]\)/);
      expect(dugumModelGovde).toMatch(/@@index\(\[haritaId,\s*etiket\]\)/);
    });
  });

  describe("Kenar Modeli İndeksleri", () => {
    it("@@index([haritaId]) indeksi tanımlanmış olmalı", () => {
      expect(schemaIcerik).toContain("@@index([haritaId])");
    });

    it("@@index([kaynakId, hedefId]) bileşik indeksi tanımlanmış olmalı", () => {
      expect(schemaIcerik).toContain("@@index([kaynakId, hedefId])");
    });

    it("@@index([hedefId]) indeksi tanımlanmış olmalı", () => {
      expect(schemaIcerik).toContain("@@index([hedefId])");
    });

    it("Kenar model bloğu içerisinde indeksler bulunmalı", () => {
      const baslangic = schemaIcerik.indexOf("model Kenar");
      expect(baslangic).toBeGreaterThan(-1);

      const kenarModelGovde = schemaIcerik.slice(baslangic);
      expect(kenarModelGovde).toMatch(/@@index\(\[haritaId\]\)/);
      expect(kenarModelGovde).toMatch(/@@index\(\[kaynakId,\s*hedefId\]\)/);
      expect(kenarModelGovde).toMatch(/@@index\(\[hedefId\]\)/);
    });
  });
});
