import { create } from "zustand";
import type {
  HaritaDTO,
  HaritaOlusturDTO,
  HaritaGuncelleDTO,
  DugumDTO,
  DugumOlusturDTO,
  DugumGuncelleDTO,
  DugumTuru,
  KenarDTO,
  KenarOlusturDTO,
  KenarGuncelleDTO,
  HaritaPaketiDTO,
  DugumKonumGuncellemeDTO,
} from "../types";
import * as haritaServisi from "../services/haritaServisi";
import * as dugumServisi from "../services/dugumServisi";
import * as kenarServisi from "../services/kenarServisi";

interface HaritaStore {
  secilenHaritaId: string | null;
  secilenDugumId: string | null;
  secilenKenarId: string | null;
  haritalar: HaritaDTO[];
  dugumler: DugumDTO[];
  kenarlar: KenarDTO[];
  yukleniyor: boolean;
  hata: string | null;

  // Arama ve Filtreleme Durumu
  aramaMetni: string;
  secilenTurFiltresi: DugumTuru | "hepsi";
  aramaMetniniAyarla: (metin: string) => void;
  turFiltresiniAyarla: (tur: DugumTuru | "hepsi") => void;

  // Yol Analizi ve Vurgulama
  vurgulananDugumIdler: Set<string>;
  vurgulananKenarIdler: Set<string>;
  yolVurgula: (dugumIdler: string[], kenarIdler: string[]) => void;
  yolVurgusunuTemizle: () => void;

  // Senkron durum güncelleyiciler
  secilenHaritayiAyarla: (id: string | null) => void;
  secilenDugumuAyarla: (id: string | null) => void;
  secilenKenariAyarla: (id: string | null) => void;
  haritalariAyarla: (haritalar: HaritaDTO[]) => void;
  dugumleriAyarla: (dugumler: DugumDTO[]) => void;
  kenarlariAyarla: (kenarlar: KenarDTO[]) => void;
  hatayiTemizle: () => void;

  // Asenkron Harita Eylemleri
  haritalariYukle: () => Promise<void>;
  haritaSec: (id: string | null) => Promise<void>;
  haritaOlustur: (veri: HaritaOlusturDTO) => Promise<HaritaDTO | null>;
  haritaIceAktar: (paket: HaritaPaketiDTO) => Promise<HaritaDTO | null>;
  haritaGuncelle: (id: string, veri: HaritaGuncelleDTO) => Promise<HaritaDTO | null>;
  haritaSil: (id: string) => Promise<boolean>;

  // Asenkron Düğüm Eylemleri
  dugumleriYukle: (haritaId: string) => Promise<void>;
  dugumEkle: (veri: DugumOlusturDTO) => Promise<DugumDTO | null>;
  dugumGuncelle: (id: string, veri: DugumGuncelleDTO) => Promise<DugumDTO | null>;
  dugumKonumlariTopluGuncelle: (konumlar: DugumKonumGuncellemeDTO[]) => Promise<boolean>;
  dugumSil: (id: string) => Promise<boolean>;

  // Asenkron Kenar Eylemleri
  kenarlariYukle: (haritaId: string) => Promise<void>;
  kenarEkle: (veri: KenarOlusturDTO) => Promise<KenarDTO | null>;
  kenarGuncelle: (id: string, veri: KenarGuncelleDTO) => Promise<KenarDTO | null>;
  kenarSil: (id: string) => Promise<boolean>;
}

export const useHaritaStore = create<HaritaStore>((set, get) => ({
  secilenHaritaId: null,
  secilenDugumId: null,
  secilenKenarId: null,
  haritalar: [],
  dugumler: [],
  kenarlar: [],
  yukleniyor: false,
  hata: null,
  aramaMetni: "",
  secilenTurFiltresi: "hepsi",
  vurgulananDugumIdler: new Set<string>(),
  vurgulananKenarIdler: new Set<string>(),

  aramaMetniniAyarla: (metin) => set({ aramaMetni: metin }),
  turFiltresiniAyarla: (tur) => set({ secilenTurFiltresi: tur }),
  yolVurgula: (dugumIdler, kenarIdler) =>
    set({
      vurgulananDugumIdler: new Set(dugumIdler),
      vurgulananKenarIdler: new Set(kenarIdler),
    }),
  yolVurgusunuTemizle: () =>
    set({
      vurgulananDugumIdler: new Set(),
      vurgulananKenarIdler: new Set(),
    }),
  secilenHaritayiAyarla: (id) => set({ secilenHaritaId: id }),
  secilenDugumuAyarla: (id) => set({ secilenDugumId: id }),
  secilenKenariAyarla: (id) => set({ secilenKenarId: id }),
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
    set({
      secilenHaritaId: id,
      secilenDugumId: null,
      secilenKenarId: null,
      aramaMetni: "",
      secilenTurFiltresi: "hepsi",
      vurgulananDugumIdler: new Set(),
      vurgulananKenarIdler: new Set(),
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

    // Düğüm zaten mevcut listede yoksa (silinmişse) sunucuya istek gönderme
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

    // Silinmiş/bulunamayan düğümün konum güncelleme hatasını ekrana yansıtma
    if (yanit.hata?.toLowerCase().includes("bulunamadı")) {
      return null;
    }

    set({ hata: yanit.hata ?? "Düğüm güncellenemedi" });
    return null;
  },

  dugumKonumlariTopluGuncelle: async (konumlar) => {
    const haritaId = get().secilenHaritaId;
    if (!haritaId || konumlar.length === 0) return false;

    // Önce yerel durumu anında güncelle (hızlı ve akıcı UI)
    const konumMap = new Map(konumlar.map((k) => [k.id, k]));
    set((s) => ({
      dugumler: s.dugumler.map((d) => {
        const yeniKonum = konumMap.get(d.id);
        if (yeniKonum) {
          return {
            ...d,
            pozisyonX: yeniKonum.pozisyonX,
            pozisyonY: yeniKonum.pozisyonY,
          };
        }
        return d;
      }),
    }));

    // Sunucuya arka planda kalıcı hale getir
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
}));

export const haritaStore = useHaritaStore;
