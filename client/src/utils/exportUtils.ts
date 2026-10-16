import { toPng } from "html-to-image";
import type { HaritaDTO, DugumDTO, KenarDTO, HaritaPaketiDTO } from "../types";

/**
 * Haritayı JSON dosyası olarak bilgisayara indirir.
 */
export function haritayiJsonIndir(
  harita: HaritaDTO,
  dugumler: DugumDTO[],
  kenarlar: KenarDTO[]
): void {
  const paket: HaritaPaketiDTO = {
    surum: "1.0",
    disaAktarmaTarihi: new Date().toISOString(),
    harita: {
      baslik: harita.baslik,
      aciklama: harita.aciklama,
    },
    dugumler: dugumler.map((d) => ({
      id: d.id,
      etiket: d.etiket,
      tur: d.tur,
      pozisyonX: d.pozisyonX,
      pozisyonY: d.pozisyonY,
      ozellikler: d.ozellikler,
    })),
    kenarlar: kenarlar.map((k) => ({
      id: k.id,
      kaynakId: k.kaynakId,
      hedefId: k.hedefId,
      etiket: k.etiket,
      yon: k.yon,
    })),
  };

  const veriStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(paket, null, 2));
  const dosyaAdi = `${harita.baslik.toLowerCase().replace(/[^a-z0-9]/g, "-")}-yedek.json`;

  const indirmeLinki = document.createElement("a");
  indirmeLinki.setAttribute("href", veriStr);
  indirmeLinki.setAttribute("download", dosyaAdi);
  document.body.appendChild(indirmeLinki);
  indirmeLinki.click();
  indirmeLinki.remove();
}

/**
 * React Flow graf tuvalini PNG görseli olarak dışa aktarır ve indirir.
 */
export async function haritayiPngIndir(
  dosyaAdi: string = "network-harita.png"
): Promise<boolean> {
  const canvasElement = document.querySelector(".react-flow__viewport") as HTMLElement | null;
  if (!canvasElement) return false;

  try {
    const dataUrl = await toPng(canvasElement, {
      backgroundColor: "#f8fafc",
      quality: 1,
      pixelRatio: 2, // Retina netliği
      filter: (node: HTMLElement) => {
        // Kontrol panellerini ve mini haritayı görselden hariç tut
        if (
          node.classList?.contains("react-flow__panel") ||
          node.classList?.contains("react-flow__controls") ||
          node.classList?.contains("react-flow__minimap")
        ) {
          return false;
        }
        return true;
      },
    });

    const link = document.createElement("a");
    link.download = dosyaAdi;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  } catch (hata) {
    console.error("PNG dışa aktarılırken hata oluştu:", hata);
    return false;
  }
}

/**
 * Kullanıcının seçtiği JSON yedek dosyasını doğrular ve ayrıştırır.
 */
export async function haritaDosyasiniOku(dosya: File): Promise<HaritaPaketiDTO> {
  return new Promise((resolve, reject) => {
    const okuyucu = new FileReader();
    okuyucu.onload = (e) => {
      try {
        const icerik = e.target?.result as string;
        const veri = JSON.parse(icerik) as HaritaPaketiDTO;

        if (!veri.harita || !veri.harita.baslik) {
          throw new Error("Geçerli bir harita başlığı bulunamadı");
        }
        if (!Array.isArray(veri.dugumler)) {
          throw new Error("Düğüm listesi bulunamadı");
        }
        if (!Array.isArray(veri.kenarlar)) {
          throw new Error("Kenar listesi bulunamadı");
        }

        resolve(veri);
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Dosya okunamadı veya biçimi geçersiz"));
      }
    };
    okuyucu.onerror = () => reject(new Error("Dosya okunamadı"));
    okuyucu.readAsText(dosya);
  });
}
