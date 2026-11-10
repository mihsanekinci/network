import { create } from "zustand";
import type { HaritaStore } from "./types";
import { createUiSlice } from "./slices/uiSlice";
import { createHaritaSlice } from "./slices/haritaSlice";
import { createDugumSlice } from "./slices/dugumSlice";
import { createKenarSlice } from "./slices/kenarSlice";

export const useHaritaStore = create<HaritaStore>()((...a) => ({
  ...createUiSlice(...a),
  ...createHaritaSlice(...a),
  ...createDugumSlice(...a),
  ...createKenarSlice(...a),
}));

export const haritaStore = useHaritaStore;
export type { HaritaStore } from "./types";
