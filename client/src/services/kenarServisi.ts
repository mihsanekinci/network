import type { KenarDTO, KenarOlusturDTO, ApiYaniti } from "../types";

const API_TABANURL = "http://localhost:3000";

export async function kenarilariGetir(
  haritaId: string
): Promise<ApiYaniti<KenarDTO[]>> {
  const yanit = await fetch(`${API_TABANURL}/haritalar/${haritaId}/kenarlar`);
  return yanit.json();
}

export async function kenarOlustur(
  veri: KenarOlusturDTO
): Promise<ApiYaniti<KenarDTO>> {
  const yanit = await fetch(
    `${API_TABANURL}/haritalar/${veri.haritaId}/kenarlar`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(veri),
    }
  );
  return yanit.json();
}

export async function kenarSil(
  haritaId: string,
  kenarId: string
): Promise<ApiYaniti<void>> {
  const yanit = await fetch(
    `${API_TABANURL}/haritalar/${haritaId}/kenarlar/${kenarId}`,
    { method: "DELETE" }
  );
  return yanit.json();
}
