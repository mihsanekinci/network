import type { ApiYaniti } from "../types";

export const API_TABANURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const SUNUCUYA_ULASILAMADI_MESAJI =
  "Sunucuya ulaşılamadı. Backend'in (http://localhost:3000) çalıştığından emin olun.";

export async function istekGonder<T>(url: string, ayarlar?: RequestInit): Promise<ApiYaniti<T>> {
  try {
    const yanit = await fetch(url, ayarlar);
    return await yanit.json();
  } catch {
    return { basarili: false, hata: SUNUCUYA_ULASILAMADI_MESAJI };
  }
}
