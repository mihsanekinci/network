import React, { useMemo, useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Check, Filter } from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";
import { FILTRE_TUR_SECENEKLERI } from "../../constants/designTokens";

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Menü dışına tıklandığında veya ESC basıldığında kapat
  useEffect(() => {
    const disariTiklandi = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setFiltreMenusuAcik(false);
      }
    };
    const tusDinle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFiltreMenusuAcik(false);
      }
    };
    if (filtreMenusuAcik) {
      document.addEventListener("mousedown", disariTiklandi);
      window.addEventListener("keydown", tusDinle);
    }
    return () => {
      document.removeEventListener("mousedown", disariTiklandi);
      window.removeEventListener("keydown", tusDinle);
    };
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
    FILTRE_TUR_SECENEKLERI.find((s) => s.tur === secilenTurFiltresi) ??
    FILTRE_TUR_SECENEKLERI[0];
  const SeciliSimge = seciliTurBilgisi.simge;

  const handleAramaTemizle = () => {
    aramaMetniniAyarla("");
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (aramaMetni) {
        aramaMetniniAyarla("");
      } else {
        inputRef.current?.blur();
      }
    }
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Arama Input Alanı */}
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none transition-colors" />
        <input
          ref={inputRef}
          id="arama-input"
          type="text"
          value={aramaMetni}
          onChange={(e) => aramaMetniniAyarla(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Düğümlerde ara..."
          className="w-36 sm:w-48 focus:w-56 md:focus:w-64 h-8 pl-8 pr-8 text-xs font-medium rounded-xl bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 focus:border-indigo-500/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400 text-slate-800 shadow-2xs"
        />
        {aramaMetni ? (
          <button
            type="button"
            onClick={handleAramaTemizle}
            title="Aramayı Temizle (Esc)"
            className="absolute right-2 p-0.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="absolute right-2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-medium text-slate-400 bg-white/70 rounded border border-slate-200/70 pointer-events-none select-none">
            ⌘F
          </kbd>
        )}
      </div>

      {/* Kompakt Tür Filtre Açılır Menüsü (Dropdown) */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setFiltreMenusuAcik((prev) => !prev)}
          className={`h-8 px-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs btn-tactile ${
            secilenTurFiltresi !== "hepsi"
              ? "bg-indigo-50/90 text-indigo-700 border-indigo-200 ring-2 ring-indigo-500/15"
              : "bg-white/90 hover:bg-white text-slate-700 border-slate-200/90 hover:border-slate-300"
          }`}
          title="Türe göre filtrele"
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: seciliTurBilgisi.renkKodu }}
          />
          <SeciliSimge className="w-3.5 h-3.5 shrink-0 opacity-80" />
          <span className="hidden sm:inline font-medium">{seciliTurBilgisi.etiket}</span>
          {secilenTurFiltresi !== "hepsi" ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                turFiltresiniAyarla("hepsi");
              }}
              title="Tür Filtresini Sıfırla"
              className="text-indigo-400 hover:text-indigo-700 p-0.5 rounded-full hover:bg-indigo-100 transition-colors ml-0.5"
            >
              <X className="w-3 h-3" />
            </span>
          ) : (
            <ChevronDown
              className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${
                filtreMenusuAcik ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {filtreMenusuAcik && (
          <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5">
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100/90 mb-0.5">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>Düğüm Türü</span>
            </div>
            {FILTRE_TUR_SECENEKLERI.map((secenek) => {
              const aktif = secilenTurFiltresi === secenek.tur;
              const TurIcon = secenek.simge;
              const sayi = turSayilari[secenek.tur] ?? 0;
              return (
                <button
                  key={secenek.tur}
                  type="button"
                  onClick={() => {
                    turFiltresiniAyarla(secenek.tur);
                    setFiltreMenusuAcik(false);
                  }}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer group ${
                    aktif
                      ? "bg-indigo-50/90 text-indigo-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: secenek.renkKodu }}
                    />
                    <TurIcon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        aktif ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-700"
                      }`}
                    />
                    <span className="truncate">{secenek.etiket}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                        aktif
                          ? "bg-indigo-200/60 text-indigo-800"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70"
                      }`}
                    >
                      {sayi} düğüm
                    </span>
                    {aktif && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Kompakt Eşleşme Çipi */}
      <div
        className={`h-8 px-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 whitespace-nowrap shadow-2xs ${
          filtreAktif
            ? "bg-indigo-50/90 text-indigo-700 border-indigo-200 ring-2 ring-indigo-500/15"
            : "bg-white/90 text-slate-600 border-slate-200/90"
        }`}
        title={`${dugumler.length} düğüm arasından ${eslesenDugumSayisi} tanesi eşleşti`}
      >
        <span className="font-bold">{eslesenDugumSayisi}</span>
        <span className="text-slate-400 font-normal text-[10px]">/{dugumler.length}</span>
      </div>
    </div>
  );
};

export default SearchFilterBar;
