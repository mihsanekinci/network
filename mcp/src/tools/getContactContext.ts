import { z } from "zod";
import { prisma } from "../db/client.js";
import { hesaplaTazelik, type EtkilesimKaydi } from "../utils/freshness.js";

export const getContactContextSchema = {
  name: z.string().describe("Name, title, or search keyword for the person or institution (e.g., 'Hilal Abla', 'mayaICT')"),
  map_id: z.string().optional().describe("Optional Map ID to narrow the search. Defaults to all maps if omitted."),
};

export async function handleGetContactContext(args: { name: string; map_id?: string }) {
  const searchTerm = args.name.trim();

  // 1. İsim veya etikete göre düğümü ara (Case-insensitive)
  const candidates = await prisma.dugum.findMany({
    where: {
      ...(args.map_id ? { haritaId: args.map_id } : {}),
      etiket: {
        contains: searchTerm,
      },
    },
    include: {
      harita: {
        select: { id: true, baslik: true },
      },
      gidentKenarlar: {
        include: {
          hedef: { select: { id: true, etiket: true, tur: true } },
        },
      },
      gelenKenarlar: {
        include: {
          kaynak: { select: { id: true, etiket: true, tur: true } },
        },
      },
    },
    take: 5,
  });

  if (candidates.length === 0) {
    // Öneri için benzer isimleri getir
    const allNodes = await prisma.dugum.findMany({
      select: { etiket: true, tur: true },
      take: 10,
    });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              found: false,
              message: `No contact found matching '${searchTerm}'.`,
              suggestions: allNodes.map((n) => `${n.etiket} (${n.tur})`),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  // En yakın eşleşeni al (Tam eşleşen varsa öncele)
  const exactMatch = candidates.find(
    (c) => c.etiket.toLocaleLowerCase("tr") === searchTerm.toLocaleLowerCase("tr")
  );
  const target = exactMatch || candidates[0];

  // 2. Özellikleri JSON olarak ayrıştır
  let ozellikler: Record<string, unknown> = {};
  try {
    ozellikler = JSON.parse(target.ozellikler || "{}");
  } catch {
    ozellikler = {};
  }

  // 3. Tazelik metriğini hesapla
  const freshness = hesaplaTazelik(ozellikler);

  // 4. Doğrudan ilişkileri (Network Connections) derle
  const connections = [
    ...target.gidentKenarlar.map((k) => ({
      relation: k.etiket || "bağlantılı",
      direction: k.yon === "cift_yonlu" ? "mutual" : "outgoing",
      connected_to: k.hedef.etiket,
      connected_type: k.hedef.tur,
    })),
    ...target.gelenKenarlar.map((k) => ({
      relation: k.etiket || "bağlantılı",
      direction: k.yon === "cift_yonlu" ? "mutual" : "incoming",
      connected_to: k.kaynak.etiket,
      connected_type: k.kaynak.tur,
    })),
  ];

  // 5. Etkileşim geçmişini al
  const interactions = Array.isArray(ozellikler.etkilesimler)
    ? (ozellikler.etkilesimler as EtkilesimKaydi[])
    : [];

  const responsePayload = {
    found: true,
    contact: {
      id: target.id,
      name: target.etiket,
      type: target.tur,
      map: { id: target.harita.id, title: target.harita.baslik },
      cluster: typeof ozellikler.kume === "string" ? ozellikler.kume : null,
      title: typeof ozellikler.unvan === "string" ? ozellikler.unvan : null,
      company: typeof ozellikler.sirket === "string" ? ozellikler.sirket : null,
      email: typeof ozellikler.eposta === "string" ? ozellikler.eposta : null,
      phone: typeof ozellikler.telefon === "string" ? ozellikler.telefon : null,
      notes: typeof ozellikler.notlar === "string" ? ozellikler.notlar : null,
      communication_tone: {
        tone: typeof ozellikler.iletisimUslubu === "string" ? ozellikler.iletisimUslubu : "belirtilmemis",
        guidance: typeof ozellikler.uslupNotu === "string" ? ozellikler.uslupNotu : null,
      },
      freshness: {
        status: freshness.durum,
        last_contact: freshness.etiket,
        days_since_last_contact: freshness.gecenGun >= 0 ? freshness.gecenGun : null,
        target_frequency_days: freshness.hedefAralikGun,
        remaining_days: freshness.kalanGun,
      },
      recent_interactions: interactions.slice(0, 5),
      network_connections: connections,
    },
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(responsePayload, null, 2),
      },
    ],
  };
}
