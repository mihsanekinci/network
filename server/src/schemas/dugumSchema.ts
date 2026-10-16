import { z } from "zod";

export const dugumTuruSemasi = z.enum(["kisi", "kurum", "kavram", "diger"]);

export const dugumOlusturSemasi = z.object({
  haritaId: z
    .string({ message: "Harita ID gereklidir" })
    .min(1, "Harita ID boş olamaz"),
  etiket: z
    .string({ message: "Düğüm etiketi gereklidir" })
    .trim()
    .min(1, "Düğüm etiketi boş olamaz"),
  tur: dugumTuruSemasi.default("diger"),
  pozisyonX: z.number({ message: "X pozisyonu gereklidir" }),
  pozisyonY: z.number({ message: "Y pozisyonu gereklidir" }),
  ozellikler: z.record(z.string(), z.unknown()).optional().default({}),
});

export const dugumGuncelleSemasi = z.object({
  etiket: z
    .string()
    .trim()
    .min(1, "Düğüm etiketi boş olamaz")
    .optional(),
  tur: dugumTuruSemasi.optional(),
  pozisyonX: z.number().optional(),
  pozisyonY: z.number().optional(),
  ozellikler: z.record(z.string(), z.unknown()).optional(),
});

export const tekDugumKonumSemasi = z.object({
  id: z.string({ message: "Düğüm ID gereklidir" }).min(1, "Düğüm ID boş olamaz"),
  pozisyonX: z.number({ message: "X pozisyonu gereklidir" }),
  pozisyonY: z.number({ message: "Y pozisyonu gereklidir" }),
});

export const dugumTopluKonumSemasi = z.union([
  z.array(tekDugumKonumSemasi),
  z.object({
    konumlar: z.array(tekDugumKonumSemasi),
  }),
]);

export type DugumOlusturGirdisi = z.infer<typeof dugumOlusturSemasi>;
export type DugumGuncelleGirdisi = z.infer<typeof dugumGuncelleSemasi>;
export type DugumTopluKonumGirdisi = z.infer<typeof dugumTopluKonumSemasi>;
