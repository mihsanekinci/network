import React, { useMemo } from "react";
import { useHaritaStore } from "../../store/haritaStore";
import type { DugumTuru } from "../../types";

const TUR_SECENEKLERI: { tur: DugumTuru | "hepsi"; etiket: string }[] = [
  { tur: "hepsi", etiket: "Hepsi" },
  { tur: "kisi", etiket: "Kişi" },
  { tur: "kurum", etiket: "Kurum" },
  { tur: "kavram", etiket: "Kavram" },
  { tur: "diger", etiket: "Diğer" },
];

export const SearchFilterBar: React.FC = () => {
  const {
    aramaMetni,
    aramaMetniniAyarla,
    secilenTurFiltresi,
    turFiltresiniAyarla,
    dugumler,
  } = useHaritaStore();

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

  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Arama Input Alanı */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 pointer-events-none text-xs">
          🔍
        </span>
        <input
          type="text"
          value={aramaMetni}
          onChange={(e) => aramaMetniniAyarla(e.target.value)}
          placeholder="Düğümlerde ara..."
          className="w-44 focus:w-56 h-8.5 pl-8 pr-7 text-xs rounded-lg bg-slate-100/90 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800"
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

      {/* Tür Hap Filtreleri (Pills) */}
      <div className="hidden lg:flex items-center gap-0.5 bg-slate-100/70 p-0.5 rounded-lg border border-slate-200/80">
        {TUR_SECENEKLERI.map((secenek) => {
          const aktif = secilenTurFiltresi === secenek.tur;
          return (
            <button
              key={secenek.tur}
              type="button"
              onClick={() => turFiltresiniAyarla(secenek.tur)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                aktif
                  ? "bg-white text-indigo-700 shadow-2xs font-semibold ring-1 ring-slate-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              {secenek.etiket}
            </button>
          );
        })}
      </div>

      {/* Sayaç Çipi */}
      <div
        className={`px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70 whitespace-nowrap transition-all ${
          filtreAktif ? "ring-2 ring-indigo-500/15 shadow-2xs" : ""
        }`}
        title={`${dugumler.length} düğüm arasından ${eslesenDugumSayisi} tanesi eşleşti`}
      >
        {eslesenDugumSayisi}/{dugumler.length} düğüm
      </div>
    </div>
  );
};

export default SearchFilterBar;
