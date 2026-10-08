import type { HaritaDTO, HaritaOlusturDTO, HaritaGuncelleDTO, ApiYaniti } from "../types";
import { API_TABANURL, istekGonder } from "./istemci";


export async function haritalariGetir(): Promise<ApiYaniti<HaritaDTO[]>> {
  return istekGonder(`${API_TABANURL}/haritalar`);
}

export async function haritaGetir(id: string): Promise<ApiYaniti<HaritaDTO>> {
  return istekGonder(`${API_TABANURL}/haritalar/${id}`);
}

export async function haritaOlustur(
  veri: HaritaOlusturDTO
): Promise<ApiYaniti<HaritaDTO>> {
  return istekGonder(`${API_TABANURL}/haritalar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(veri),
  });
}

export async function haritaGuncelle(
  id: string,
  veri: HaritaGuncelleDTO
): Promise<ApiYaniti<HaritaDTO>> {
  return istekGonder(`${API_TABANURL}/haritalar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(veri),
  });
}

export async function haritaSil(id: string): Promise<ApiYaniti<void>> {
  return istekGonder(`${API_TABANURL}/haritalar/${id}`, {
    method: "DELETE",
  });
}
