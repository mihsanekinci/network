import { z } from "zod";
import { prisma } from "../db/client.js";

export const searchNetworkSchema = {
  query: z.string().describe("Search query to look up across node names, titles, companies, clusters, or notes"),
  type: z.enum(["kisi", "kurum", "kavram", "diger", "all"]).optional().describe("Optional filter by node type"),
  map_id: z.string().optional().describe("Optional Map ID filter"),
  limit: z.number().optional().describe("Maximum number of results to return (default 15)"),
};

export async function handleSearchNetwork(args: {
  query: string;
  type?: "kisi" | "kurum" | "kavram" | "diger" | "all";
  map_id?: string;
  limit?: number;
}) {
  const q = args.query.trim().toLocaleLowerCase("tr");
  const maxResults = args.limit || 15;

  const nodes = await prisma.dugum.findMany({
    where: {
      ...(args.type && args.type !== "all" ? { tur: args.type } : {}),
      ...(args.map_id ? { haritaId: args.map_id } : {}),
    },
    include: {
      harita: { select: { id: true, baslik: true } },
      _count: {
        select: { gidentKenarlar: true, gelenKenarlar: true },
      },
    },
  });

  const matches = nodes.filter((n) => {
    if (!q) return true;
    if (n.etiket.toLocaleLowerCase("tr").includes(q)) return true;

    try {
      const oz = JSON.parse(n.ozellikler || "{}");
      const metinler = [
        oz.unvan,
        oz.sirket,
        oz.notlar,
        oz.aciklama,
        oz.kume,
        oz.eposta,
        oz.telefon,
        oz.uslupNotu,
      ];
      return metinler.some(
        (m) => typeof m === "string" && m.toLocaleLowerCase("tr").includes(q)
      );
    } catch {
      return false;
    }
  });

  const results = matches.slice(0, maxResults).map((n) => {
    let oz: Record<string, unknown> = {};
    try {
      oz = JSON.parse(n.ozellikler || "{}");
    } catch {
      oz = {};
    }

    return {
      id: n.id,
      name: n.etiket,
      type: n.tur,
      map: n.harita.baslik,
      cluster: typeof oz.kume === "string" ? oz.kume : null,
      title: typeof oz.unvan === "string" ? oz.unvan : null,
      company: typeof oz.sirket === "string" ? oz.sirket : null,
      notes_snippet: typeof oz.notlar === "string" ? oz.notlar.slice(0, 100) : null,
      total_connections: n._count.gidentKenarlar + n._count.gelenKenarlar,
    };
  });

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            query: args.query,
            total_matches: matches.length,
            showing: results.length,
            results,
          },
          null,
          2
        ),
      },
    ],
  };
}
