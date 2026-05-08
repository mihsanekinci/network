import type { HaritaDTO, HaritaOlusturDTO, ApiYaniti } from "../types";

const API_TABANURL = "http://localhost:3000";

export async function haritalariGetir(): Promise<ApiYaniti<HaritaDTO[]>> {
  const yanit = await fetch(`${API_TABANURL}/haritalar`);
  return yanit.json();
}

export async function haritaGetir(id: string): Promise<ApiYaniti<HaritaDTO>> {
  const yanit = await fetch(`${API_TABANURL}/haritalar/${id}`);
  return yanit.json();
}

export async function haritaOlustur(
  veri: HaritaOlusturDTO
): Promise<ApiYaniti<HaritaDTO>> {
  const yanit = await fetch(`${API_TABANURL}/haritalar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(veri),
  });
  return yanit.json();
}

export async function haritaSil(id: string): Promise<ApiYaniti<void>> {
  const yanit = await fetch(`${API_TABANURL}/haritalar/${id}`, {
    method: "DELETE",
  });
  return yanit.json();
}
