import type { SliceCreator, HaritaSlice } from "../types";
import * as haritaServisi from "../../services/haritaServisi";

export const createHaritaSlice: SliceCreator<HaritaSlice> = (set, get) => ({
  secilenHaritaId: null,
  haritalar: [],

  secilenHaritayiAyarla: (id) => set({ secilenHaritaId: id }),
  haritalariAyarla: (haritalar) => set({ haritalar }),

  haritalariYukle: async () => {
    set({ yukleniyor: true, hata: null });
    const yanit = await haritaServisi.haritalariGetir();
    if (yanit.basarili && yanit.veri) {
      set({ haritalar: yanit.veri, yukleniyor: false });
    } else {
      set({ hata: yanit.hata ?? "Haritalar yüklenemedi", yukleniyor: false });
    }
  },

  haritaSec: async (id) => {
    set({
      secilenHaritaId: id,
      secilenDugumId: null,
      secilenKenarId: null,
      aramaMetni: "",
      secilenTurFiltresi: "hepsi",
      vurgulananDugumIdler: new Set(),
      vurgulananKenarIdler: new Set(),
      otomatikDuzenlendi: false,
      otomatikDuzenlemeTiklamaSayisi: 0,
      otomatikDuzenlemeUyarisi: null,
    });
    if (!id) {
      set({ dugumler: [], kenarlar: [] });
      return;
    }
    await Promise.all([get().dugumleriYukle(id), get().kenarlariYukle(id)]);
  },

  haritaOlustur: async (veri) => {
    set({ yukleniyor: true, hata: null });
    const yanit = await haritaServisi.haritaOlustur(veri);
    if (yanit.basarili && yanit.veri) {
      const yeniHarita = yanit.veri;
      set((s) => ({
        haritalar: [yeniHarita, ...s.haritalar],
        secilenHaritaId: yeniHarita.id,
        secilenDugumId: null,
        secilenKenarId: null,
        dugumler: [],
        kenarlar: [],
        yukleniyor: false,
      }));
      return yeniHarita;
    }
    set({ hata: yanit.hata ?? "Harita oluşturulamadı", yukleniyor: false });
    return null;
  },

  haritaIceAktar: async (paket) => {
    set({ yukleniyor: true, hata: null });
    const yanit = await haritaServisi.haritaIceAktar(paket);
    if (yanit.basarili && yanit.veri) {
      const yeniHarita = yanit.veri;
      set((s) => ({
        haritalar: [yeniHarita, ...s.haritalar],
        secilenHaritaId: yeniHarita.id,
        secilenDugumId: null,
        secilenKenarId: null,
        yukleniyor: false,
      }));
      await Promise.all([get().dugumleriYukle(yeniHarita.id), get().kenarlariYukle(yeniHarita.id)]);
      return yeniHarita;
    }
    set({ hata: yanit.hata ?? "Harita içe aktarılamadı", yukleniyor: false });
    return null;
  },

  haritaGuncelle: async (id, veri) => {
    set({ yukleniyor: true, hata: null });
    const yanit = await haritaServisi.haritaGuncelle(id, veri);
    if (yanit.basarili && yanit.veri) {
      const guncel = yanit.veri;
      set((s) => ({
        haritalar: s.haritalar.map((h) => (h.id === id ? guncel : h)),
        yukleniyor: false,
      }));
      return guncel;
    }
    set({ hata: yanit.hata ?? "Harita güncellenemedi", yukleniyor: false });
    return null;
  },

  haritaSil: async (id) => {
    set({ yukleniyor: true, hata: null });
    const yanit = await haritaServisi.haritaSil(id);
    if (yanit.basarili) {
      set((s) => ({
        haritalar: s.haritalar.filter((h) => h.id !== id),
        secilenHaritaId: s.secilenHaritaId === id ? null : s.secilenHaritaId,
        secilenDugumId: s.secilenHaritaId === id ? null : s.secilenDugumId,
        secilenKenarId: s.secilenHaritaId === id ? null : s.secilenKenarId,
        dugumler: s.secilenHaritaId === id ? [] : s.dugumler,
        kenarlar: s.secilenHaritaId === id ? [] : s.kenarlar,
        aramaMetni: s.secilenHaritaId === id ? "" : s.aramaMetni,
        secilenTurFiltresi: s.secilenHaritaId === id ? "hepsi" : s.secilenTurFiltresi,
        yukleniyor: false,
      }));
      return true;
    }
    set({ hata: yanit.hata ?? "Harita silinemedi", yukleniyor: false });
    return false;
  },
});
