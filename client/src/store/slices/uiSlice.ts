import type { SliceCreator, UiSlice } from "../types";

const TEMA_ANAHTARI = "network_tema";

const baslangicKaranlikMi = (): boolean => {
  if (typeof window === "undefined") return false;
  const kayitli = localStorage.getItem(TEMA_ANAHTARI);
  if (kayitli) return kayitli === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const domTemaUygula = (karanlik: boolean): void => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (karanlik) {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }
};

const ilkKaranlik = baslangicKaranlikMi();
domTemaUygula(ilkKaranlik);

export const createUiSlice: SliceCreator<UiSlice> = (set, get) => ({
  yukleniyor: false,
  hata: null,
  aramaMetni: "",
  secilenTurFiltresi: "hepsi",
  vurgulananDugumIdler: new Set<string>(),
  vurgulananKenarIdler: new Set<string>(),
  otomatikDuzenlendi: false,
  otomatikDuzenlemeTiklamaSayisi: 0,
  otomatikDuzenlemeUyarisi: null,
  karanlikMod: ilkKaranlik,

  hatayiTemizle: () => set({ hata: null }),
  karanlikModDegistir: () => {
    const yeniMod = !get().karanlikMod;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(TEMA_ANAHTARI, yeniMod ? "dark" : "light");
    }
    domTemaUygula(yeniMod);
    set({ karanlikMod: yeniMod });
  },
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

  otomatikDuzenlemeUyarisiAyarla: (uyari) => set({ otomatikDuzenlemeUyarisi: uyari }),

  otomatikDuzenlemeDurumunuSifirla: () =>
    set({
      otomatikDuzenlendi: false,
      otomatikDuzenlemeTiklamaSayisi: 0,
      otomatikDuzenlemeUyarisi: null,
    }),

  otomatikDuzenlemeyiIsaretle: () =>
    set({
      otomatikDuzenlendi: true,
      otomatikDuzenlemeTiklamaSayisi: 0,
      otomatikDuzenlemeUyarisi: null,
    }),

  otomatikDuzenlemeTekrarTiklandi: () => {
    const sayac = get().otomatikDuzenlemeTiklamaSayisi;
    const mesaj =
      sayac === 0
        ? "Otomatik düzenleme zaten etkin!"
        : "Her şey zaten olması gereken yerde : )";
    if (sayac === 0) {
      set({ otomatikDuzenlemeTiklamaSayisi: 1, otomatikDuzenlemeUyarisi: mesaj });
    } else {
      set({ otomatikDuzenlemeUyarisi: mesaj });
    }
    return mesaj;
  },
});
