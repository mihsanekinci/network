import { describe, it, expect } from "vitest";
import prisma from "../../lib/prismaIstemcisi";

describe("Veritabanı Bağlantı ve Şema Hazırlığı", () => {
  it("harita, düğüm ve kenar tabloları sorgulanabilir ve sağlıklı olmalı", async () => {
    const haritaSayisi = await prisma.harita.count();
    const dugumSayisi = await prisma.dugum.count();
    const kenarSayisi = await prisma.kenar.count();
    expect(haritaSayisi).toBeGreaterThanOrEqual(0);
    expect(dugumSayisi).toBeGreaterThanOrEqual(0);
    expect(kenarSayisi).toBeGreaterThanOrEqual(0);
  });
});
