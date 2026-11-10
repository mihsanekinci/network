import React from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Wand2,
  MoreHorizontal,
  Loader2,
  Network,
  Sun,
  Moon,
} from "lucide-react";
import type { HaritaDTO, DugumDTO, KenarDTO } from "../../types";
import SearchFilterBar from "../panels/SearchFilterBar";
import { AppOptionsMenu } from "./AppOptionsMenu";

interface AppHeaderProps {
  sidebarAcik: boolean;
  onSidebarToggle: () => void;
  secilenHaritaId: string | null;
  secilenHarita?: HaritaDTO;
  dugumler: DugumDTO[];
  kenarlar: KenarDTO[];
  duzenleniyor: boolean;
  otomatikDuzenlendi: boolean;
  seceneklerMenusuAcik: boolean;
  seceneklerRef: React.RefObject<HTMLDivElement | null>;
  isDark: boolean;
  onToggleDarkMode: () => void;
  onSeceneklerToggle: () => void;
  onSeceneklerKapat: () => void;
  onDugumEkle: () => void;
  onOtomatikDuzenle: () => void;
  onAnalizAc: () => void;
  onDisaIceAktarAc: () => void;
  onKisayollarAc: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  sidebarAcik,
  onSidebarToggle,
  secilenHaritaId,
  secilenHarita,
  dugumler,
  kenarlar,
  duzenleniyor,
  otomatikDuzenlendi,
  seceneklerMenusuAcik,
  seceneklerRef,
  isDark,
  onToggleDarkMode,
  onSeceneklerToggle,
  onSeceneklerKapat,
  onDugumEkle,
  onOtomatikDuzenle,
  onAnalizAc,
  onDisaIceAktarAc,
  onKisayollarAc,
}) => {
  return (
    <header className="glass-floating rounded-2xl mx-3 sm:mx-4 mt-3 mb-2 px-3 sm:px-4 py-2 flex items-center justify-between gap-2.5 sm:gap-3 shrink-0 z-20 transition-colors">
      {/* Sol Kısım: Kenar Çubuğu Butonu + Harita Başlığı ve Sayaç Rozetleri */}
      <div className="flex items-center gap-2.5 min-w-0 shrink">
        <button
          type="button"
          onClick={onSidebarToggle}
          title={sidebarAcik ? "Kenar Çubuğunu Gizle (⌘B)" : "Kenar Çubuğunu Göster (⌘B)"}
          className="w-8.5 h-8.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs btn-tactile"
        >
          {sidebarAcik ? (
            <PanelLeftClose className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          )}
        </button>

        {!sidebarAcik && (
          <div className="hidden md:flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-200/80 dark:border-slate-800">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              <Network className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">NetWork</span>
          </div>
        )}

        <div className="flex flex-col min-w-0 shrink">
          {secilenHarita ? (
            <>
              <h2
                className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-36 sm:max-w-48 md:max-w-60 leading-tight"
                title={secilenHarita.baslik}
              >
                {secilenHarita.baslik}
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 leading-tight truncate mt-0.5">
                <span className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold">
                  {dugumler.length} düğüm
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center text-slate-600 dark:text-slate-300 font-semibold">
                  {kenarlar.length} bağlantı
                </span>
                {secilenHarita.aciklama && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700 hidden lg:inline">•</span>
                    <span
                      className="hidden lg:inline truncate max-w-40 text-slate-400 dark:text-slate-500 font-normal"
                      title={secilenHarita.aciklama}
                    >
                      {secilenHarita.aciklama}
                    </span>
                  </>
                )}
              </div>
            </>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Aktif harita seçilmedi</span>
          )}
        </div>
      </div>

      {/* Orta Kısım: Kompakt Arama ve Filtreleme Çubuğu */}
      <div className="flex-1 flex justify-center items-center px-1 min-w-0">
        {secilenHaritaId && <SearchFilterBar />}
      </div>

      {/* Sağ Kısım: Aksiyon Butonları & Seçenekler Menüsü */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Düğüm Ekle Butonu */}
        <button
          type="button"
          onClick={onDugumEkle}
          disabled={!secilenHaritaId}
          title="Yeni Düğüm Ekle (⌘N)"
          className="h-8.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-2xs hover:shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer btn-tactile shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Düğüm Ekle</span>
        </button>

        {/* Otomatik Düzenle Butonu (Sabit genişlikle Layout Shift / CLS sıfırlandı) */}
        <button
          type="button"
          onClick={onOtomatikDuzenle}
          disabled={!secilenHaritaId || dugumler.length === 0 || duzenleniyor}
          title={
            otomatikDuzenlendi
              ? "Otomatik düzenleme etkin (Tekrar düzenlemek için düğümleri sürükleyin)"
              : "Otomatik Hiyerarşik Hizala (⌘D)"
          }
          className={`h-8.5 px-2.5 sm:px-3 rounded-xl shadow-2xs transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer btn-tactile ${
            otomatikDuzenlendi
              ? "bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              : "bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 active:scale-95 border border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {duzenleniyor ? (
            <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin shrink-0" />
          ) : (
            <Wand2 className={`w-3.5 h-3.5 shrink-0 ${otomatikDuzenlendi ? "text-slate-400 dark:text-slate-500" : "text-amber-500"}`} />
          )}
          <span className="hidden md:inline min-w-11 text-center">
            {duzenleniyor ? "Düzenle..." : "Düzenle"}
          </span>
        </button>

        {/* Karanlık Mod Hızlı Geçiş Butonu */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
          className="h-8.5 w-8.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-600 dark:text-amber-400 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs btn-tactile"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 stroke-[2.2]" />
          )}
        </button>

        {/* ⋯ Seçenekler Menüsü */}
        <div className="relative" ref={seceneklerRef}>
          <button
            type="button"
            onClick={onSeceneklerToggle}
            disabled={!secilenHaritaId}
            title="Diğer Seçenekler ve Araçlar"
            className={`h-8.5 w-8.5 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 active:scale-95 border border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 rounded-xl shadow-2xs transition-all flex items-center justify-center cursor-pointer btn-tactile shrink-0 ${
              seceneklerMenusuAcik ? "ring-2 ring-indigo-500/20 border-indigo-300 bg-white dark:bg-slate-800" : ""
            }`}
          >
            <MoreHorizontal className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          <AppOptionsMenu
            acik={seceneklerMenusuAcik}
            duzenleniyor={duzenleniyor}
            dugumSayisi={dugumler.length}
            isDark={isDark}
            onKapat={onSeceneklerKapat}
            onAnalizAc={onAnalizAc}
            onOtomatikDuzenle={onOtomatikDuzenle}
            onDisaIceAktarAc={onDisaIceAktarAc}
            onKisayollarAc={onKisayollarAc}
            onToggleDarkMode={onToggleDarkMode}
          />
        </div>
      </div>
    </header>
  );
};
