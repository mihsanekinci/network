import { create } from "zustand";
import type { HaritaDTO, DugumDTO, KenarDTO } from "../types";

interface HaritaStore {
  secilenHaritaId: string | null;
  haritalar: HaritaDTO[];
  dugumler: DugumDTO[];
  kenarlar: KenarDTO[];

  secilenHaritayiAyarla: (id: string | null) => void;
  haritalariAyarla: (haritalar: HaritaDTO[]) => void;
  dugumleriAyarla: (dugumler: DugumDTO[]) => void;
  kenarlariAyarla: (kenarlar: KenarDTO[]) => void;
}

export const haritaStore = create<HaritaStore>((set) => ({
  secilenHaritaId: null,
  haritalar: [],
  dugumler: [],
  kenarlar: [],

  secilenHaritayiAyarla: (id) => set({ secilenHaritaId: id }),
  haritalariAyarla: (haritalar) => set({ haritalar }),
  dugumleriAyarla: (dugumler) => set({ dugumler }),
  kenarlariAyarla: (kenarlar) => set({ kenarlar }),
}));
