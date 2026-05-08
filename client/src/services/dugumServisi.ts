import type { DugumDTO, DugumOlusturDTO, DugumGuncelleDTO, ApiYaniti } from "../types";

const API_TABANURL = "http://localhost:3000";

export async function dugumleriGetir(
  haritaId: string
): Promise<ApiYaniti<DugumDTO[]>> {
  const yanit = await fetch(`${API_TABANURL}/haritalar/${haritaId}/dugumler`);
  return yanit.json();
}

export async function dugumOlustur(
  veri: DugumOlusturDTO
): Promise<ApiYaniti<DugumDTO>> {
  const yanit = await fetch(
    `${API_TABANURL}/haritalar/${veri.haritaId}/dugumler`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(veri),
    }
  );
  return yanit.json();
}

export async function dugumGuncelle(
  haritaId: string,
  dugumId: string,
  veri: DugumGuncelleDTO
): Promise<ApiYaniti<DugumDTO>> {
  const yanit = await fetch(
    `${API_TABANURL}/haritalar/${haritaId}/dugumler/${dugumId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(veri),
    }
  );
  return yanit.json();
}

export async function dugumSil(
  haritaId: string,
  dugumId: string
): Promise<ApiYaniti<void>> {
  const yanit = await fetch(
    `${API_TABANURL}/haritalar/${haritaId}/dugumler/${dugumId}`,
    { method: "DELETE" }
  );
  return yanit.json();
}
