import { z } from "zod";
import { prisma } from "../db/client.js";

export const findIntroductionPathSchema = {
  target_name: z.string().describe("Name of the person or entity you want to reach (e.g., 'Hilal Abla', 'Kemal Bey')"),
  start_name: z.string().optional().describe("Optional starting person or entity. If omitted, searches from any connected central contact."),
  map_id: z.string().optional().describe("Optional Map ID to narrow the graph search."),
};

interface PathStep {
  from_name: string;
  from_type: string;
  to_name: string;
  to_type: string;
  relation_label: string;
}

export async function handleFindIntroductionPath(args: {
  target_name: string;
  start_name?: string;
  map_id?: string;
}) {
  const targetTerm = args.target_name.trim().toLocaleLowerCase("tr");

  // Haritadaki tüm düğümleri ve kenarları çek
  const [dugumler, kenarlar] = await Promise.all([
    prisma.dugum.findMany({
      where: args.map_id ? { haritaId: args.map_id } : {},
      select: { id: true, etiket: true, tur: true },
    }),
    prisma.kenar.findMany({
      where: args.map_id ? { haritaId: args.map_id } : {},
      select: { id: true, kaynakId: true, hedefId: true, etiket: true, yon: true },
    }),
  ]);

  const dugumMap = new Map(dugumler.map((d) => [d.id, d]));

  // Hedef düğümü bul
  const hedefDugum = dugumler.find((d) =>
    d.etiket.toLocaleLowerCase("tr").includes(targetTerm)
  );

  if (!hedefDugum) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              found: false,
              message: `Target '${args.target_name}' not found in the graph.`,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  // Başlangıç düğümü varsa bul, yoksa en çok bağlantıya sahip kişiyi başlangıç al
  let baslangicDugum = args.start_name
    ? dugumler.find((d) =>
        d.etiket.toLocaleLowerCase("tr").includes(args.start_name!.trim().toLocaleLowerCase("tr"))
      )
    : null;

  if (!baslangicDugum) {
    // Kişi türündeki ve hedeften farklı bir düğüm seç
    baslangicDugum = dugumler.find((d) => d.tur === "kisi" && d.id !== hedefDugum.id) || dugumler[0];
  }

  if (!baslangicDugum || baslangicDugum.id === hedefDugum.id) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              found: true,
              message: "Start and target are the same contact.",
              contact: hedefDugum.etiket,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  // Komşuluk grafını oluştur (Çift yönlü ve yönsüz kenarları iki yönlü ekle)
  const komsuluk = new Map<string, Array<{ komsuId: string; etiket: string }>>();
  for (const d of dugumler) {
    komsuluk.set(d.id, []);
  }

  for (const k of kenarlar) {
    const etiket = k.etiket || "bağlantılı";
    komsuluk.get(k.kaynakId)?.push({ komsuId: k.hedefId, etiket });
    if (k.yon === "cift_yonlu" || k.yon === "yonsuz") {
      komsuluk.get(k.hedefId)?.push({ komsuId: k.kaynakId, etiket });
    }
  }

  // BFS ile en kısa yolu bul
  const kuyruk: Array<{ dugumId: string; yol: Array<{ fromId: string; toId: string; label: string }> }> = [
    { dugumId: baslangicDugum.id, yol: [] },
  ];
  const ziyaretEdilen = new Set<string>([baslangicDugum.id]);

  let bulunanYol: Array<{ fromId: string; toId: string; label: string }> | null = null;

  while (kuyruk.length > 0) {
    const { dugumId, yol } = kuyruk.shift()!;

    if (dugumId === hedefDugum.id) {
      bulunanYol = yol;
      break;
    }

    const komsular = komsuluk.get(dugumId) || [];
    for (const { komsuId, etiket } of komsular) {
      if (!ziyaretEdilen.has(komsuId)) {
        ziyaretEdilen.add(komsuId);
        kuyruk.push({
          dugumId: komsuId,
          yol: [...yol, { fromId: dugumId, toId: komsuId, label: etiket }],
        });
      }
    }
  }

  if (!bulunanYol) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              found: false,
              message: `No connection path exists between '${baslangicDugum.etiket}' and '${hedefDugum.etiket}'. They belong to disconnected components of the network.`,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  const steps: PathStep[] = bulunanYol.map((p) => {
    const from = dugumMap.get(p.fromId)!;
    const to = dugumMap.get(p.toId)!;
    return {
      from_name: from.etiket,
      from_type: from.tur,
      to_name: to.etiket,
      to_type: to.tur,
      relation_label: p.label,
    };
  });

  const chainString = steps
    .map((s, idx) => (idx === 0 ? `[${s.from_name}] --(${s.relation_label})--> [${s.to_name}]` : ` --(${s.relation_label})--> [${s.to_name}]`))
    .join("");

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            found: true,
            start_contact: baslangicDugum.etiket,
            target_contact: hedefDugum.etiket,
            degrees_of_separation: steps.length,
            introduction_chain: chainString,
            detailed_steps: steps,
          },
          null,
          2
        ),
      },
    ],
  };
}
