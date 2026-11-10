import React from "react";
import { Layers, Clock, CheckCircle2, AlertTriangle, Moon, HelpCircle } from "lucide-react";
import { TUR_TASARIM_TOKENLARI } from "../../../constants/designTokens";
import type { AgMetrikleri } from "../../../utils/networkAnalysis";

interface NetworkMetricsTabProps {
  metrikler: AgMetrikleri;
  onDugumDetay: (dugumId: string) => void;
}

export const NetworkMetricsTab: React.FC<NetworkMetricsTabProps> = ({
  metrikler,
  onDugumDetay,
}) => {
  return (
    <>
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-xl flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Toplam Düğüm
          </span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
            {metrikler.toplamDugum}
          </span>
        </div>
        <div className="p-3.5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-xl flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Bağlantı Sayısı
          </span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {metrikler.toplamKenar}
          </span>
        </div>
        <div className="p-3.5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-xl flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Ağ Yoğunluğu
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            %{Math.round(metrikler.yogunluk * 100)}
          </span>
        </div>
        <div className="p-3.5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-xl flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Ort. Bağlantı
          </span>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {metrikler.ortalamaDerece}
          </span>
        </div>
      </div>

      {/* Tür Dağılımı */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Düğüm Türleri Dağılımı
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {(["kisi", "kurum", "kavram", "diger"] as const).map((turKodu) => {
            const token = TUR_TASARIM_TOKENLARI[turKodu];
            const Simge = token.simge;
            const sayi = metrikler.turDagilimi[turKodu];

            return (
              <div
                key={turKodu}
                className={`px-3 py-2 border rounded-xl flex items-center justify-between text-xs shadow-2xs ${token.rozet.arkaPlan} ${token.rozet.kenarlik}`}
              >
                <span className={`flex items-center gap-1.5 font-medium ${token.rozet.metin}`}>
                  <Simge className="w-3.5 h-3.5" style={{ color: token.renkKodu }} />
                  <span>{token.etiket}</span>
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{sayi}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Küme Dağılımı (Clusters) */}
      {Object.keys(metrikler.kumeDagilimi).length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Kümeler Dağılımı</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(metrikler.kumeDagilimi).map(([kumeAdi, sayi]) => (
              <div
                key={kumeAdi}
                className="px-3 py-2 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 rounded-xl flex items-center justify-between text-xs shadow-2xs"
              >
                <span className="font-medium text-indigo-900 dark:text-indigo-200 truncate pr-2">
                  {kumeAdi}
                </span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                  {sayi} düğüm
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* İlişki Tazeliği Dağılımı (CRM Health) */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Kişisel CRM & İlişki Tazeliği Sağlığı</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="px-3 py-2 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Taze</span>
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">
              {metrikler.tazelikDagilimi.taze}
            </span>
          </div>
          <div className="px-3 py-2 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>İlgi Bekliyor</span>
            </span>
            <span className="font-bold text-amber-700 dark:text-amber-300">
              {metrikler.tazelikDagilimi.ilgiBekliyor}
            </span>
          </div>
          <div className="px-3 py-2 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-between text-xs shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium text-rose-800 dark:text-rose-300">
              <Moon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Uykuda</span>
            </span>
            <span className="font-bold text-rose-700 dark:text-rose-300">
              {metrikler.tazelikDagilimi.uykuda}
            </span>
          </div>
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Belirsiz</span>
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {metrikler.tazelikDagilimi.belirsiz}
            </span>
          </div>
        </div>
      </div>

      {/* En Kilit Düğümler (Top Hubs) */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Ağın En Kilit Aktörleri (En Çok Bağlantılı 5 Düğüm)
        </h4>
        {metrikler.enKilitDugumler.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">Henüz yeterli bağlantı bulunmuyor.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {metrikler.enKilitDugumler.map((item, index) => {
              const token = TUR_TASARIM_TOKENLARI[item.dugum.tur] ?? TUR_TASARIM_TOKENLARI.diger;
              const Simge = token.simge;

              return (
                <div
                  key={item.dugum.id}
                  className="px-4 py-2.5 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700 rounded-xl flex items-center justify-between transition-colors shadow-2xs tactile-card"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                        style={{ color: token.renkKodu }}
                      >
                        <Simge className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {item.dugum.etiket}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${token.rozet.arkaPlan} ${token.rozet.metin} ${token.rozet.kenarlik}`}
                    >
                      <span className={`w-1 h-1 rounded-full ${token.rozet.nokta}`} />
                      {token.etiket}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 px-2.5 py-1 rounded-md">
                      {item.derece} Bağlantı
                    </span>
                    <button
                      type="button"
                      onClick={() => onDugumDetay(item.dugum.id)}
                      className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer btn-tactile"
                    >
                      Detay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
