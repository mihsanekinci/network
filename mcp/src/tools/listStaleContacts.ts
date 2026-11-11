import { z } from "zod";
import { prisma } from "../db/client.js";
import { hesaplaTazelik } from "../utils/freshness.js";

export const listStaleContactsSchema = {
  status: z
    .enum(["all", "uykuda", "ilgi_bekliyor", "taze", "belirsiz"])
    .optional()
    .describe("Filter by status: 'uykuda' (dormant / overdue), 'ilgi_bekliyor' (attention needed soon), 'taze' (recently contacted), 'belirsiz' (no contact logged yet), or 'all'."),
  map_id: z.string().optional().describe("Optional Map ID to filter"),
  limit: z.number().optional().describe("Max number of contacts to return (default 10)"),
};

export async function handleListStaleContacts(args: {
  status?: "all" | "uykuda" | "ilgi_bekliyor" | "taze" | "belirsiz";
  map_id?: string;
  limit?: number;
}) {
  const filterStatus = args.status || "uykuda";
  const maxResults = args.limit || 10;

  // Kişi ve kurum düğümlerini çek
  const nodes = await prisma.dugum.findMany({
    where: {
      tur: { in: ["kisi", "kurum"] },
      ...(args.map_id ? { haritaId: args.map_id } : {}),
    },
    include: {
      harita: { select: { id: true, baslik: true } },
    },
  });

  const parsedContacts = nodes.map((n) => {
    let oz: Record<string, unknown> = {};
    try {
      oz = JSON.parse(n.ozellikler || "{}");
    } catch {
      oz = {};
    }
    const freshness = hesaplaTazelik(oz);
    return {
      id: n.id,
      name: n.etiket,
      type: n.tur,
      map: n.harita.baslik,
      title: typeof oz.unvan === "string" ? oz.unvan : null,
      company: typeof oz.sirket === "string" ? oz.sirket : null,
      email: typeof oz.eposta === "string" ? oz.eposta : null,
      phone: typeof oz.telefon === "string" ? oz.telefon : null,
      tone: typeof oz.iletisimUslubu === "string" ? oz.iletisimUslubu : "belirtilmemis",
      freshness,
    };
  });

  // İstenen duruma göre filtrele
  const filtered = parsedContacts.filter((c) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "uykuda") return c.freshness.durum === "uykuda" || c.freshness.durum === "ilgi_bekliyor";
    return c.freshness.durum === filterStatus;
  });

  // En acil olanları başa sırala (kalan gün sayısı en küçük/negatif olanlar)
  filtered.sort((a, b) => a.freshness.kalanGun - b.freshness.kalanGun);

  const results = filtered.slice(0, maxResults).map((c) => ({
    name: c.name,
    type: c.type,
    company: c.company,
    title: c.title,
    communication_tone: c.tone,
    status: c.freshness.durum,
    last_contact: c.freshness.etiket,
    days_since: c.freshness.gecenGun >= 0 ? c.freshness.gecenGun : "Never",
    target_frequency_days: c.freshness.hedefAralikGun,
    overdue_days: c.freshness.kalanGun < 0 ? Math.abs(c.freshness.kalanGun) : 0,
  }));

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            total_stale_found: filtered.length,
            showing: results.length,
            contacts: results,
          },
          null,
          2
        ),
      },
    ],
  };
}
