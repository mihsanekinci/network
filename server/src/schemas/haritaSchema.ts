import { z } from "zod";

export const haritaOlusturSemasi = z.object({
  baslik: z
    .string({ message: "Başlık zorunludur" })
    .trim()
    .min(1, "Başlık en az 1 karakter olmalıdır")
    .max(100, "Başlık en fazla 100 karakter olabilir"),
  aciklama: z
    .string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional()
    .nullable()
    .transform((deger) => (deger === null ? undefined : deger)),
});

export const haritaGuncelleSemasi = z.object({
  baslik: z
    .string()
    .trim()
    .min(1, "Başlık en az 1 karakter olmalıdır")
    .max(100, "Başlık en fazla 100 karakter olabilir")
    .optional(),
  aciklama: z
    .string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional()
    .nullable()
    .transform((deger) => (deger === null ? undefined : deger)),
});

export const haritaPaketiSemasi = z.object({
  surum: z.string().min(1, "Sürüm bilgisi gereklidir"),
  disaAktarmaTarihi: z.string().min(1, "Dışa aktarma tarihi gereklidir"),
  harita: z.object({
    baslik: z
      .string({ message: "Harita başlığı gereklidir" })
      .trim()
      .min(1, "Geçerli bir harita başlığı gereklidir")
      .max(100, "Başlık en fazla 100 karakter olabilir"),
    aciklama: z.string().max(500).optional().nullable(),
  }),
  dugumler: z.array(
    z.object({
      id: z.string().optional(),
      etiket: z.string().trim().min(1, "Düğüm etiketi boş olamaz"),
      tur: z.enum(["kisi", "kurum", "kavram", "diger"]).default("diger"),
      pozisyonX: z.number({ message: "pozisyonX gereklidir" }),
      pozisyonY: z.number({ message: "pozisyonY gereklidir" }),
      ozellikler: z.record(z.string(), z.unknown()).optional(),
    })
  ),
  kenarlar: z.array(
    z.object({
      id: z.string().optional(),
      kaynakId: z.string().min(1, "Kaynak düğüm ID gereklidir"),
      hedefId: z.string().min(1, "Hedef düğüm ID gereklidir"),
      etiket: z.string().optional().nullable(),
      yon: z.enum(["tek_yonlu", "cift_yonlu", "yonsuz"]).optional(),
    })
  ),
});

export type HaritaOlusturGirdisi = z.infer<typeof haritaOlusturSemasi>;
export type HaritaGuncelleGirdisi = z.infer<typeof haritaGuncelleSemasi>;
export type HaritaPaketiGirdisi = z.infer<typeof haritaPaketiSemasi>;
