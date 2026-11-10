import React from "react";
import { Activity, Wand2, Share2, Keyboard, Loader2, Moon, Sun } from "lucide-react";

interface AppOptionsMenuProps {
  acik: boolean;
  duzenleniyor: boolean;
  dugumSayisi: number;
  isDark: boolean;
  onKapat: () => void;
  onAnalizAc: () => void;
  onOtomatikDuzenle: () => void;
  onDisaIceAktarAc: () => void;
  onKisayollarAc: () => void;
  onToggleDarkMode: () => void;
}

export const AppOptionsMenu: React.FC<AppOptionsMenuProps> = ({
  acik,
  duzenleniyor,
  dugumSayisi,
  isDark,
  onKapat,
  onAnalizAc,
  onOtomatikDuzenle,
  onDisaIceAktarAc,
  onKisayollarAc,
  onToggleDarkMode,
}) => {
  if (!acik) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5">
      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100/90 dark:border-slate-800 flex items-center justify-between">
        <span>Harita Araçları</span>
      </div>

      {/* Ağ Analitiği */}
      <button
        type="button"
        onClick={() => {
          onKapat();
          onAnalizAc();
        }}
        className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Activity className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Ağ Analitiği
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            En kısa rota ve merkeziyet analizi
          </div>
        </div>
      </button>

      {/* Otomatik Düzenle */}
      <button
        type="button"
        onClick={() => {
          onKapat();
          onOtomatikDuzenle();
        }}
        disabled={dugumSayisi === 0 || duzenleniyor}
        className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 disabled:opacity-40 transition-colors flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {duzenleniyor ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wand2 className="w-3.5 h-3.5" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center justify-between">
            <span>Otomatik Düzenle</span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
              ⌘D
            </kbd>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            Düğümleri hiyerarşik hizala
          </div>
        </div>
      </button>

      {/* Dışa / İçe Aktar */}
      <button
        type="button"
        onClick={() => {
          onKapat();
          onDisaIceAktarAc();
        }}
        className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Share2 className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Dışa / İçe Aktar
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            JSON paketi veya PNG görseli
          </div>
        </div>
      </button>

      {/* Tema Değiştir (Karanlık / Aydınlık Mod) */}
      <button
        type="button"
        onClick={() => {
          onKapat();
          onToggleDarkMode();
        }}
        className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
            <span>{isDark ? "Aydınlık Mod" : "Karanlık Mod"}</span>
            <span className="text-[10px] text-slate-400 font-normal">{isDark ? "Gündüz" : "Gece"}</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {isDark ? "Aydınlık renk temasına geç" : "Göz yormayan koyu tema"}
          </div>
        </div>
      </button>

      <div className="my-0.5 border-t border-slate-100 dark:border-slate-800" />

      {/* Klavye Kısayolları */}
      <button
        type="button"
        onClick={() => {
          onKapat();
          onKisayollarAc();
        }}
        className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Keyboard className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex items-center justify-between">
            <span>Klavye Kısayolları</span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            Tüm hızlı tuşları görüntüle
          </div>
        </div>
      </button>
    </div>
  );
};
