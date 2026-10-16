import React, { useMemo, useState, useRef, useEffect } from "react";
import { useHaritaStore } from "../../store/haritaStore";
import type { DugumTuru } from "../../types";

const TUR_SECENEKLERI: { tur: DugumTuru | "hepsi"; etiket: string; simge: string }[] = [
  { tur: "hepsi", etiket: "Tüm Türler", simge: "🎯" },
  { tur: "kisi", etiket: "Kişi", simge: "👤" },
  { tur: "kurum", etiket: "Kurum", simge: "🏢" },
  { tur: "kavram", etiket: "Kavram", simge: "💡" },
  { tur: "diger", etiket: "Diğer", simge: "📌" },
];

export const SearchFilterBar: React.FC = () => {
  const {
    aramaMetni,
    aramaMetniniAyarla,
    secilenTurFiltresi,
    turFiltresiniAyarla,
    dugumler,
  } = useHaritaStore();

  const [filtreMenusuAcik, setFiltreMenusuAcik] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Menü dışına tıklandığında kapat
  useEffect(() => {
    const disariTiklandi = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setFiltreMenusuAcik(false);
      }
    };
    if (filtreMenusuAcik) {
      document.addEventListener("mousedown", disariTiklandi);
    }
    return () => document.removeEventListener("mousedown", disariTiklandi);
  }, [filtreMenusuAcik]);

  // Her türe ait düğüm sayıları
  const turSayilari = useMemo(() => {
    const sayac: Record<string, number> = { hepsi: dugumler.length };
    for (const d of dugumler) {
      sayac[d.tur] = (sayac[d.tur] ?? 0) + 1;
    }
    return sayac;
  }, [dugumler]);

  const eslesenDugumSayisi = useMemo(() => {
    const arama = aramaMetni.trim().toLocaleLowerCase("tr");
    return dugumler.filter((d) => {
      const turUyuyor = secilenTurFiltresi === "hepsi" || d.tur === secilenTurFiltresi;
      if (!turUyuyor) return false;
      if (!arama) return true;

      const etiketVar = d.etiket.toLocaleLowerCase("tr").includes(arama);
      const unvanVar =
        typeof d.ozellikler?.unvan === "string" &&
        d.ozellikler.unvan.toLocaleLowerCase("tr").includes(arama);
      const sirketVar =
        typeof d.ozellikler?.sirket === "string" &&
        d.ozellikler.sirket.toLocaleLowerCase("tr").includes(arama);
      const notlarVar =
        typeof d.ozellikler?.notlar === "string" &&
        d.ozellikler.notlar.toLocaleLowerCase("tr").includes(arama);
      const aciklamaVar =
        typeof d.ozellikler?.aciklama === "string" &&
        d.ozellikler.aciklama.toLocaleLowerCase("tr").includes(arama);

      return etiketVar || unvanVar || sirketVar || notlarVar || aciklamaVar;
    }).length;
  }, [dugumler, aramaMetni, secilenTurFiltresi]);

  const filtreAktif = aramaMetni.trim() !== "" || secilenTurFiltresi !== "hepsi";
  const seciliTurBilgisi =
    TUR_SECENEKLERI.find((s) => s.tur === secilenTurFiltresi) ?? TUR_SECENEKLERI[0];

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Arama Input Alanı */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 pointer-events-none text-xs">
          🔍
        </span>
        <input
          id="arama-input"
          type="text"
          value={aramaMetni}
          onChange={(e) => aramaMetniniAyarla(e.target.value)}
          placeholder="Düğümlerde ara... (⌘F)"
          className="w-40 sm:w-48 focus:w-56 h-8.5 pl-8 pr-7 text-xs rounded-xl bg-slate-100/90 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 shadow-2xs"
        />
        {aramaMetni && (
          <button
            type="button"
            onClick={() => aramaMetniniAyarla("")}
            title="Aramayı Temizle"
            className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600 text-[10px] cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Kompakt Tür Filtre Açılır Menüsü (Dropdown) */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setFiltreMenusuAcik((prev) => !prev)}
          className={`h-8.5 px-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
            secilenTurFiltresi !== "hepsi"
              ? "bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-500/15"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
          }`}
          title="Türe göre filtrele"
        >
          <span>{seciliTurBilgisi.simge}</span>
          <span className="hidden sm:inline">{seciliTurBilgisi.etiket}</span>
          <span className="text-[10px] text-slate-400 ml-0.5">▾</span>
        </button>

        {filtreMenusuAcik && (
          <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Düğüm Türü
            </div>
            {TUR_SECENEKLERI.map((secenek) => {
              const aktif = secilenTurFiltresi === secenek.tur;
              const sayi = turSayilari[secenek.tur] ?? 0;
              return (
                <button
                  key={secenek.tur}
                  type="button"
                  onClick={() => {
                    turFiltresiniAyarla(secenek.tur);
                    setFiltreMenusuAcik(false);
                  }}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center justify-between cursor-pointer ${
                    aktif
                      ? "bg-indigo-50 text-indigo-700 font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{secenek.simge}</span>
                    <span>{secenek.etiket}</span>
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      aktif
                        ? "bg-indigo-200/60 text-indigo-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {sayi}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Kompakt Eşleşme Çipi */}
      <div
        className={`px-2 py-1 rounded-xl text-[11px] font-bold border transition-all whitespace-nowrap shadow-2xs ${
          filtreAktif
            ? "bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-500/15"
            : "bg-white text-slate-600 border-slate-200/90"
        }`}
        title={`${dugumler.length} düğüm arasından ${eslesenDugumSayisi} tanesi eşleşti`}
      >
        <span>{eslesenDugumSayisi}</span>
        <span className="text-slate-400 font-normal">/{dugumler.length}</span>
      </div>
    </div>
  );
};

export default SearchFilterBar;
