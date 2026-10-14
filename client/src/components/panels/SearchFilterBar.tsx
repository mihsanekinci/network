import React, { useMemo } from "react";
import { useHaritaStore } from "../../store/haritaStore";
import type { DugumTuru } from "../../types";

const TUR_SECENEKLERI: { tur: DugumTuru | "hepsi"; etiket: string }[] = [
  { tur: "hepsi", etiket: "Hepsi" },
  { tur: "kisi", etiket: "👤 Kişiler" },
  { tur: "kurum", etiket: "🏢 Kurumlar" },
  { tur: "kavram", etiket: "💡 Kavramlar" },
  { tur: "diger", etiket: "📌 Diğer" },
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
    <div className="flex items-center gap-3">
      {/* Arama Input Alanı */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none text-sm">
          🔍
        </span>
        <input
          type="text"
          value={aramaMetni}
          onChange={(e) => aramaMetniniAyarla(e.target.value)}
          placeholder="Düğümlerde ara..."
          className="w-64 h-10 px-3.5 pl-9 pr-8 text-sm rounded-xl bg-slate-100/80 border border-slate-200/80 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
        />
        {aramaMetni && (
          <button
            type="button"
            onClick={() => aramaMetniniAyarla("")}
            title="Aramayı Temizle"
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tür Hap Filtreleri (Pills) */}
      <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
        {TUR_SECENEKLERI.map((secenek) => {
          const aktif = secilenTurFiltresi === secenek.tur;
          return (
            <button
              key={secenek.tur}
              type="button"
              onClick={() => turFiltresiniAyarla(secenek.tur)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                aktif
                  ? "bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/80"
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
        className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70 whitespace-nowrap transition-all ${
          filtreAktif ? "ring-2 ring-indigo-500/15 shadow-xs" : ""
        }`}
        title={`${dugumler.length} düğüm arasından ${eslesenDugumSayisi} tanesi eşleşti`}
      >
        {eslesenDugumSayisi}/{dugumler.length} düğüm
      </div>
    </div>
  );
};

export default SearchFilterBar;
