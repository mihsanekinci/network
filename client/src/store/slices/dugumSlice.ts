import type { SliceCreator, DugumSlice } from "../types";
import * as dugumServisi from "../../services/dugumServisi";

export const createDugumSlice: SliceCreator<DugumSlice> = (set, get) => ({
  secilenDugumId: null,
  dugumler: [],

  secilenDugumuAyarla: (id) => set({ secilenDugumId: id }),
  dugumleriAyarla: (dugumler) => set({ dugumler }),

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

    const dugumVarMi = get().dugumler.some((d) => d.id === id);
    if (!dugumVarMi) return null;

    const yanit = await dugumServisi.dugumGuncelle(haritaId, id, veri);
    if (yanit.basarili && yanit.veri) {
      const guncel = yanit.veri;
      set((s) => ({
        dugumler: s.dugumler.map((d) => (d.id === id ? guncel : d)),
      }));
      return guncel;
    }

    if (yanit.hata?.toLowerCase().includes("bulunamadı")) {
      return null;
    }

    set({ hata: yanit.hata ?? "Düğüm güncellenemedi" });
    return null;
  },

  dugumKonumlariTopluGuncelle: async (konumlar) => {
    const haritaId = get().secilenHaritaId;
    if (!haritaId || konumlar.length === 0) return false;

    const konumMap = new Map(konumlar.map((k) => [k.id, k]));
    set((s) => ({
      dugumler: s.dugumler.map((d) => {
        const yeniKonum = konumMap.get(d.id);
        if (
          !yeniKonum ||
          (d.pozisyonX === yeniKonum.pozisyonX && d.pozisyonY === yeniKonum.pozisyonY)
        ) {
          return d;
        }
        return {
          ...d,
          pozisyonX: yeniKonum.pozisyonX,
          pozisyonY: yeniKonum.pozisyonY,
        };
      }),
    }));

    const yanit = await dugumServisi.topluKonumGuncelle(haritaId, konumlar);
    if (!yanit.basarili) {
      set({ hata: yanit.hata ?? "Düğüm konumları kaydedilemedi" });
      return false;
    }
    return true;
  },

  dugumSil: async (id) => {
    const haritaId = get().secilenHaritaId;
    if (!haritaId) return false;
    const yanit = await dugumServisi.dugumSil(haritaId, id);
    if (yanit.basarili) {
      set((s) => ({
        dugumler: s.dugumler.filter((d) => d.id !== id),
        kenarlar: s.kenarlar.filter((k) => k.kaynakId !== id && k.hedefId !== id),
        secilenDugumId: s.secilenDugumId === id ? null : s.secilenDugumId,
        secilenKenarId:
          s.secilenKenarId &&
          s.kenarlar.some((k) => k.id === s.secilenKenarId && (k.kaynakId === id || k.hedefId === id))
            ? null
            : s.secilenKenarId,
      }));
      return true;
    }
    set({ hata: yanit.hata ?? "Düğüm silinemedi" });
    return false;
  },
});
