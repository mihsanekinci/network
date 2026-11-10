import type { SliceCreator, UiSlice } from "../types";

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

  hatayiTemizle: () => set({ hata: null }),
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
