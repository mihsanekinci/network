import { z } from "zod";
import { prisma } from "../db/client.js";
import { hesaplaTazelik, type EtkilesimKaydi } from "../utils/freshness.js";

export const logInteractionSchema = {
  contact_name: z.string().describe("Name of the person or institution (e.g., 'Hilal Abla')"),
  type: z
    .enum(["toplanti", "kahve_yemek", "eposta", "mesaj", "arama", "etkinlik", "diger"])
    .describe("Interaction channel/type: 'toplanti' (Meeting), 'kahve_yemek' (Coffee/Lunch), 'eposta' (Email), 'mesaj' (Message/WhatsApp), 'arama' (Phone call), 'etkinlik' (Event), 'diger' (Other)"),
  summary: z.string().describe("Brief 1-2 sentence summary of what was discussed or decided"),
  notes: z.string().optional().describe("Optional in-depth notes or action items"),
  date: z.string().optional().describe("Interaction date in YYYY-MM-DD format. Defaults to today if not provided."),
};

export async function handleLogInteraction(args: {
  contact_name: string;
  type: "toplanti" | "kahve_yemek" | "eposta" | "mesaj" | "arama" | "etkinlik" | "diger";
  summary: string;
  notes?: string;
  date?: string;
}) {
  const searchTerm = args.contact_name.trim();

  // 1. Hedef kişiyi bul
  const candidates = await prisma.dugum.findMany({
    where: {
      etiket: {
        contains: searchTerm,
      },
    },
    take: 5,
  });

  if (candidates.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              success: false,
              error: `Contact '${searchTerm}' not found. Please verify the name or search first.`,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  const exactMatch = candidates.find(
    (c) => c.etiket.toLocaleLowerCase("tr") === searchTerm.toLocaleLowerCase("tr")
  );
  const target = exactMatch || candidates[0];

  // 2. Tarihi belirle (Varsayılan: Bugün UTC YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];
  const interactionDate = args.date && /^\d{4}-\d{2}-\d{2}$/.test(args.date.trim())
    ? args.date.trim()
    : todayStr;

  // 3. Özellikleri ayrıştır ve yeni etkileşimi ekle
  let ozellikler: Record<string, unknown> = {};
  try {
    ozellikler = JSON.parse(target.ozellikler || "{}");
  } catch {
    ozellikler = {};
  }

  const mevcutEtkilesimler: EtkilesimKaydi[] = Array.isArray(ozellikler.etkilesimler)
    ? (ozellikler.etkilesimler as EtkilesimKaydi[])
    : [];

  const yeniKayit: EtkilesimKaydi = {
    id: `etk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    tarih: interactionDate,
    tur: args.type,
    ozet: args.summary.trim(),
    ...(args.notes?.trim() ? { notlar: args.notes.trim() } : {}),
  };

  const guncelEtkilesimler = [yeniKayit, ...mevcutEtkilesimler].sort(
    (a, b) => b.tarih.localeCompare(a.tarih)
  );

  ozellikler.etkilesimler = guncelEtkilesimler;
  ozellikler.sonTemasTarihi = guncelEtkilesimler[0].tarih;

  // 4. Veritabanına kaydet
  await prisma.dugum.update({
    where: { id: target.id },
    data: {
      ozellikler: JSON.stringify(ozellikler),
    },
  });

  // 5. Güncel tazeliği hesapla
  const freshness = hesaplaTazelik(ozellikler);

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            success: true,
            message: `Interaction recorded successfully for '${target.etiket}'!`,
            logged_interaction: yeniKayit,
            updated_freshness: {
              status: freshness.durum,
              label: freshness.etiket,
              days_since: freshness.gecenGun,
            },
          },
          null,
          2
        ),
      },
    ],
  };
}
