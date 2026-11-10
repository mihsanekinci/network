import React from "react";
import { Activity, Wand2, Layers, Keyboard, Loader2 } from "lucide-react";

interface AppOptionsMenuProps {
  acik: boolean;
  duzenleniyor: boolean;
  dugumSayisi: number;
  onKapat: () => void;
  onAnalizAc: () => void;
  onOtomatikDuzenle: () => void;
  onDisaIceAktarAc: () => void;
  onKisayollarAc: () => void;
}

export const AppOptionsMenu: React.FC<AppOptionsMenuProps> = ({
  acik,
  duzenleniyor,
  dugumSayisi,
  onKapat,
  onAnalizAc,
  onOtomatikDuzenle,
  onDisaIceAktarAc,
  onKisayollarAc,
}) => {
  if (!acik) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-0.5">
      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/90 flex items-center justify-between">
        <span>Harita Araçları</span>
      </div>

      {/* Ağ Analitiği */}
      <button
        type="button"
        onClick={() => {
          onKapat();
          onAnalizAc();
        }}
        className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Activity className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
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
        className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {duzenleniyor ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wand2 className="w-3.5 h-3.5" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors flex items-center justify-between">
            <span>Otomatik Düzenle</span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500 bg-slate-100 rounded border border-slate-200">
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
        className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Layers className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
            Dışa / İçe Aktar
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            JSON paketi veya PNG görseli
          </div>
        </div>
      </button>

      <div className="my-0.5 border-t border-slate-100" />

      {/* Klavye Kısayolları */}
      <button
        type="button"
        onClick={() => {
          onKapat();
          onKisayollarAc();
        }}
        className="w-full px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer group"
      >
        <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Keyboard className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition-colors flex items-center justify-between">
            <span>Klavye Kısayolları</span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-500 bg-slate-100 rounded border border-slate-200">
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
