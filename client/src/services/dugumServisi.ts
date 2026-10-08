import type { DugumDTO, DugumOlusturDTO, DugumGuncelleDTO, ApiYaniti } from "../types";
import { API_TABANURL, istekGonder } from "./istemci";


export async function dugumleriGetir(
  haritaId: string
): Promise<ApiYaniti<DugumDTO[]>> {
  return istekGonder(`${API_TABANURL}/haritalar/${haritaId}/dugumler`);
}

export async function dugumOlustur(
  veri: DugumOlusturDTO
): Promise<ApiYaniti<DugumDTO>> {
  return istekGonder(
    `${API_TABANURL}/haritalar/${veri.haritaId}/dugumler`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(veri),
    }
  );
}

export async function dugumGuncelle(
  haritaId: string,
  dugumId: string,
  veri: DugumGuncelleDTO
): Promise<ApiYaniti<DugumDTO>> {
  return istekGonder(
    `${API_TABANURL}/haritalar/${haritaId}/dugumler/${dugumId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(veri),
    }
  );
}

export async function dugumSil(
  haritaId: string,
  dugumId: string
): Promise<ApiYaniti<void>> {
  return istekGonder(
    `${API_TABANURL}/haritalar/${haritaId}/dugumler/${dugumId}`,
    { method: "DELETE" }
  );
}
