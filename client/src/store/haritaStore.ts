import { create } from "zustand";
import type {
  HaritaDTO,
  HaritaOlusturDTO,
  HaritaGuncelleDTO,
  DugumDTO,
  DugumOlusturDTO,
  DugumGuncelleDTO,
  KenarDTO,
  KenarOlusturDTO,
} from "../types";
import * as haritaServisi from "../services/haritaServisi";
import * as dugumServisi from "../services/dugumServisi";
import * as kenarServisi from "../services/kenarServisi";

interface HaritaStore {
  secilenHaritaId: string | null;
  haritalar: HaritaDTO[];
  dugumler: DugumDTO[];
  kenarlar: KenarDTO[];
  yukleniyor: boolean;
  hata: string | null;

  // Senkron durum güncelleyiciler
  secilenHaritayiAyarla: (id: string | null) => void;
  haritalariAyarla: (haritalar: HaritaDTO[]) => void;
  dugumleriAyarla: (dugumler: DugumDTO[]) => void;
  kenarlariAyarla: (kenarlar: KenarDTO[]) => void;
  hatayiTemizle: () => void;

  // Asenkron Harita Eylemleri
  haritalariYukle: () => Promise<void>;
  haritaSec: (id: string | null) => Promise<void>;
  haritaOlustur: (veri: HaritaOlusturDTO) => Promise<HaritaDTO | null>;
  haritaGuncelle: (id: string, veri: HaritaGuncelleDTO) => Promise<HaritaDTO | null>;
  haritaSil: (id: string) => Promise<boolean>;

  // Asenkron Düğüm Eylemleri
  dugumleriYukle: (haritaId: string) => Promise<void>;
  dugumEkle: (veri: DugumOlusturDTO) => Promise<DugumDTO | null>;
  dugumGuncelle: (id: string, veri: DugumGuncelleDTO) => Promise<DugumDTO | null>;
  dugumSil: (id: string) => Promise<boolean>;

  // Asenkron Kenar Eylemleri
  kenarlariYukle: (haritaId: string) => Promise<void>;
  kenarEkle: (veri: KenarOlusturDTO) => Promise<KenarDTO | null>;
  kenarSil: (id: string) => Promise<boolean>;
}

export const useHaritaStore = create<HaritaStore>((set, get) => ({
  secilenHaritaId: null,
  haritalar: [],
  dugumler: [],
  kenarlar: [],
  yukleniyor: false,
  hata: null,

  secilenHaritayiAyarla: (id) => set({ secilenHaritaId: id }),
  haritalariAyarla: (haritalar) => set({ haritalar }),
  dugumleriAyarla: (dugumler) => set({ dugumler }),
  kenarlariAyarla: (kenarlar) => set({ kenarlar }),
  hatayiTemizle: () => set({ hata: null }),

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
    set({ secilenHaritaId: id });
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
        dugumler: [],
        kenarlar: [],
        yukleniyor: false,
      }));
      return yeniHarita;
    }
    set({ hata: yanit.hata ?? "Harita oluşturulamadı", yukleniyor: false });
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
        dugumler: s.secilenHaritaId === id ? [] : s.dugumler,
        kenarlar: s.secilenHaritaId === id ? [] : s.kenarlar,
        yukleniyor: false,
      }));
      return true;
    }
    set({ hata: yanit.hata ?? "Harita silinemedi", yukleniyor: false });
    return false;
  },

  dugumleriYukle: async (haritaId) => {
    set({ yukleniyor: true, hata: null });
    const yanit = await dugumServisi.dugumleriGetir(haritaId);
    if (yanit.basarili && yanit.veri) {
      set({ dugumler: yanit.veri, yukleniyor: false });
    } else {
      set({ hata: yanit.hata ?? "Düğümler yüklenemedi", yukleniyor: false });
    }
  },

  dugumEkle: async (veri) => {
    set({ yukleniyor: true, hata: null });
    const yanit = await dugumServisi.dugumOlustur(veri);
    if (yanit.basarili && yanit.veri) {
      const yeniDugum = yanit.veri;
      set((s) => ({ dugumler: [...s.dugumler, yeniDugum], yukleniyor: false }));
      return yeniDugum;
    }
    set({ hata: yanit.hata ?? "Düğüm oluşturulamadı", yukleniyor: false });
    return null;
  },

  dugumGuncelle: async (id, veri) => {
    const haritaId = get().secilenHaritaId;
    if (!haritaId) return null;
    const yanit = await dugumServisi.dugumGuncelle(haritaId, id, veri);
    if (yanit.basarili && yanit.veri) {
      const guncel = yanit.veri;
      set((s) => ({
        dugumler: s.dugumler.map((d) => (d.id === id ? guncel : d)),
      }));
      return guncel;
    }
    set({ hata: yanit.hata ?? "Düğüm güncellenemedi" });
    return null;
  },

  dugumSil: async (id) => {
    const haritaId = get().secilenHaritaId;
    if (!haritaId) return false;
    const yanit = await dugumServisi.dugumSil(haritaId, id);
    if (yanit.basarili) {
      set((s) => ({
        dugumler: s.dugumler.filter((d) => d.id !== id),
        kenarlar: s.kenarlar.filter((k) => k.kaynakId !== id && k.hedefId !== id),
      }));
      return true;
    }
    set({ hata: yanit.hata ?? "Düğüm silinemedi" });
    return false;
  },

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

  kenarSil: async (id) => {
    const haritaId = get().secilenHaritaId;
    if (!haritaId) return false;
    const yanit = await kenarServisi.kenarSil(haritaId, id);
    if (yanit.basarili) {
      set((s) => ({
        kenarlar: s.kenarlar.filter((k) => k.id !== id),
      }));
      return true;
    }
    set({ hata: yanit.hata ?? "Kenar silinemedi" });
    return false;
  },
}));

export const haritaStore = useHaritaStore;
