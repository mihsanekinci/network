import type { KenarDTO, KenarOlusturDTO, ApiYaniti } from "../types";
import { API_TABANURL, istekGonder } from "./istemci";


export async function kenarlariGetir(
  haritaId: string
): Promise<ApiYaniti<KenarDTO[]>> {
  return istekGonder(`${API_TABANURL}/haritalar/${haritaId}/kenarlar`);
}

// Geriye dönük uyumluluk için alias
export const kenarilariGetir = kenarlariGetir;

export async function kenarOlustur(
  veri: KenarOlusturDTO
): Promise<ApiYaniti<KenarDTO>> {
  return istekGonder(
    `${API_TABANURL}/haritalar/${veri.haritaId}/kenarlar`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(veri),
    }
  );
}

export async function kenarSil(
  haritaId: string,
  kenarId: string
): Promise<ApiYaniti<void>> {
  return istekGonder(
    `${API_TABANURL}/haritalar/${haritaId}/kenarlar/${kenarId}`,
    { method: "DELETE" }
  );
}
