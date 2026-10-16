import { z } from "zod";

export const kenarYonuSemasi = z.enum(["tek_yonlu", "cift_yonlu", "yonsuz"]);

export const kenarOlusturSemasi = z.object({
  haritaId: z
    .string({ message: "Harita ID gereklidir" })
    .min(1, "Harita ID boş olamaz"),
  kaynakId: z
    .string({ message: "Kaynak düğüm ID gereklidir" })
    .min(1, "Kaynak düğüm ID boş olamaz"),
  hedefId: z
    .string({ message: "Hedef düğüm ID gereklidir" })
    .min(1, "Hedef düğüm ID boş olamaz"),
  etiket: z
    .string()
    .max(200, "Etiket en fazla 200 karakter olabilir")
    .optional()
    .nullable()
    .transform((deger) => (deger === null ? undefined : deger)),
  yon: kenarYonuSemasi.optional().default("yonsuz"),
});

export const kenarGuncelleSemasi = z.object({
  etiket: z
    .string()
    .max(200, "Etiket en fazla 200 karakter olabilir")
    .optional()
    .nullable()
    .transform((deger) => (deger === null ? undefined : deger)),
  yon: kenarYonuSemasi.optional(),
});

export type KenarOlusturGirdisi = z.infer<typeof kenarOlusturSemasi>;
export type KenarGuncelleGirdisi = z.infer<typeof kenarGuncelleSemasi>;
