import type { SliceCreator, KenarSlice } from "../types";
import * as kenarServisi from "../../services/kenarServisi";

export const createKenarSlice: SliceCreator<KenarSlice> = (set, get) => ({
  secilenKenarId: null,
  kenarlar: [],

  secilenKenariAyarla: (id) => set({ secilenKenarId: id }),
  kenarlariAyarla: (kenarlar) => set({ kenarlar }),

  kenarlariYukle: async (haritaId) => {
    set({ yukleniyor: true, hata: null });
    const yanit = await kenarServisi.kenarlariGetir(haritaId);
    if (yanit.basarili && yanit.veri) {
      set({ kenarlar: yanit.veri, yukleniyor: false });
    } else {
      set({ hata: yanit.hata ?? "Kenarlar yüklenemedi", yukleniyor: false });
    }
  },

  kenarEkle: async (veri) => {
    set({ yukleniyor: true, hata: null });
    const yanit = await kenarServisi.kenarOlustur(veri);
    if (yanit.basarili && yanit.veri) {
      const yeniKenar = yanit.veri;
      set((s) => ({ kenarlar: [...s.kenarlar, yeniKenar], yukleniyor: false }));
      return yeniKenar;
    }
    set({ hata: yanit.hata ?? "Kenar oluşturulamadı", yukleniyor: false });
    return null;
  },

  kenarGuncelle: async (id, veri) => {
    const haritaId = get().secilenHaritaId;
    if (!haritaId) return null;

    set({ yukleniyor: true, hata: null });
    const yanit = await kenarServisi.kenarGuncelle(haritaId, id, veri);
    if (yanit.basarili && yanit.veri) {
      const guncel = yanit.veri;
      set((s) => ({
        kenarlar: s.kenarlar.map((k) => (k.id === id ? guncel : k)),
        yukleniyor: false,
      }));
      return guncel;
    }
    set({ hata: yanit.hata ?? "Kenar güncellenemedi", yukleniyor: false });
    return null;
  },

  kenarSil: async (id) => {
    const haritaId = get().secilenHaritaId;
    if (!haritaId) return false;
    const yanit = await kenarServisi.kenarSil(haritaId, id);
    if (yanit.basarili) {
      set((s) => ({
        kenarlar: s.kenarlar.filter((k) => k.id !== id),
        secilenKenarId: s.secilenKenarId === id ? null : s.secilenKenarId,
      }));
      return true;
    }
    set({ hata: yanit.hata ?? "Kenar silinemedi" });
    return false;
  },
});
