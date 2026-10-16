import React, { useState, useMemo } from "react";
import { useHaritaStore } from "../../store/haritaStore";
import { hesaplaAgMetrikleri, enKisaYoluBul } from "../../utils/networkAnalysis";

interface NetworkInsightsModalProps {
  acik: boolean;
  kapat: () => void;
}

export const NetworkInsightsModal: React.FC<NetworkInsightsModalProps> = ({ acik, kapat }) => {
  const { dugumler, kenarlar, yolVurgula, secilenDugumuAyarla } = useHaritaStore();
  const [aktifSekme, setAktifSekme] = useState<"metrikler" | "yol">("metrikler");

  // En Kısa Yol Seçimleri
  const [kaynakId, setKaynakId] = useState<string>("");
  const [hedefId, setHedefId] = useState<string>("");
  const [aramaYapildi, setAramaYapildi] = useState(false);

  const metrikler = useMemo(() => {
    return hesaplaAgMetrikleri(dugumler, kenarlar);
  }, [dugumler, kenarlar]);

  const yolSonucu = useMemo(() => {
    if (!kaynakId || !hedefId || !aramaYapildi) return null;
    return enKisaYoluBul(kaynakId, hedefId, dugumler, kenarlar);
  }, [kaynakId, hedefId, aramaYapildi, dugumler, kenarlar]);

  if (!acik) return null;

  const handleYoluVurgula = () => {
    if (yolSonucu && yolSonucu.bulundu) {
      yolVurgula(yolSonucu.dugumIdleri, yolSonucu.kenarIdleri);
      kapat();
    }
  };

  const dugumBul = (id: string) => dugumler.find((d) => d.id === id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-base">
              📊
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-800">Ağ ve İlişki Analizi</h3>
              <p className="text-xs text-slate-500">
                Haritanızdaki bağlantı yoğunluğu ve aktörler arası rotalar
              </p>
            </div>
          </div>
          <button
            onClick={kapat}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Sekme Seçici */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/30">
          <button
            onClick={() => setAktifSekme("metrikler")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              aktifSekme === "metrikler"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📈</span>
            <span>Genel Metrikler & Kilit Düğümler</span>
          </button>
          <button
            onClick={() => setAktifSekme("yol")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              aktifSekme === "yol"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>🧭</span>
            <span>En Kısa Yol Rotası (Pathfinder)</span>
          </button>
        </div>

        {/* İçerik */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {aktifSekme === "metrikler" ? (
            <>
              {/* İstatistik Kartları */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Toplam Düğüm
                  </span>
                  <span className="text-2xl font-bold text-slate-800 mt-1">
                    {metrikler.toplamDugum}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Bağlantı Sayısı
                  </span>
                  <span className="text-2xl font-bold text-indigo-600 mt-1">
                    {metrikler.toplamKenar}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Ağ Yoğunluğu
                  </span>
                  <span className="text-2xl font-bold text-emerald-600 mt-1">
                    %{Math.round(metrikler.yogunluk * 100)}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Ort. Bağlantı
                  </span>
                  <span className="text-2xl font-bold text-purple-600 mt-1">
                    {metrikler.ortalamaDerece}
                  </span>
                </div>
              </div>

              {/* Tür Dağılımı */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Düğüm Türleri Dağılımı
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="px-3 py-2 bg-blue-50/70 border border-blue-100 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-blue-700 font-medium">👤 Kişi</span>
                    <span className="font-bold text-blue-900">{metrikler.turDagilimi.kisi}</span>
                  </div>
                  <div className="px-3 py-2 bg-emerald-50/70 border border-emerald-100 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-medium">🏢 Kurum</span>
                    <span className="font-bold text-emerald-900">{metrikler.turDagilimi.kurum}</span>
                  </div>
                  <div className="px-3 py-2 bg-amber-50/70 border border-amber-100 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-amber-700 font-medium">💡 Kavram</span>
                    <span className="font-bold text-amber-900">{metrikler.turDagilimi.kavram}</span>
                  </div>
                  <div className="px-3 py-2 bg-purple-50/70 border border-purple-100 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-purple-700 font-medium">📌 Diğer</span>
                    <span className="font-bold text-purple-900">{metrikler.turDagilimi.diger}</span>
                  </div>
                </div>
              </div>

              {/* En Kilit Düğümler (Top Hubs) */}
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ağın En Kilit Aktörleri (En Çok Bağlantılı 5 Düğüm)
                </h4>
                {metrikler.enKilitDugumler.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Henüz yeterli bağlantı bulunmuyor.</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {metrikler.enKilitDugumler.map((item, index) => (
                      <div
                        key={item.dugum.id}
                        className="px-4 py-2.5 bg-slate-50 hover:bg-indigo-50/40 border border-slate-100 rounded-xl flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-slate-800">
                            {item.dugum.etiket}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 capitalize">
                            {item.dugum.tur}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                            {item.derece} Bağlantı
                          </span>
                          <button
                            onClick={() => {
                              secilenDugumuAyarla(item.dugum.id);
                              kapat();
                            }}
                            className="text-xs text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer"
                          >
                            Detay
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Pathfinder / En Kısa Yol */
            <div className="flex flex-col gap-5">
              <p className="text-xs text-slate-500">
                Ağınızdaki iki kişi, kurum veya kavram arasındaki bağlantı zincirini tespit edin.
              </p>

              {/* Seçim Formu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">1. Başlangıç Düğümü</label>
                  <select
                    value={kaynakId}
                    onChange={(e) => {
                      setKaynakId(e.target.value);
                      setAramaYapildi(false);
                    }}
                    className="h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    <option value="">Başlangıç düğümü seçin...</option>
                    {dugumler.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.etiket} ({d.tur})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">2. Hedef Düğüm</label>
                  <select
                    value={hedefId}
                    onChange={(e) => {
                      setHedefId(e.target.value);
                      setAramaYapildi(false);
                    }}
                    className="h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    <option value="">Hedef düğüm seçin...</option>
                    {dugumler
                      .filter((d) => d.id !== kaynakId)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.etiket} ({d.tur})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setAramaYapildi(true)}
                disabled={!kaynakId || !hedefId}
                className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 self-start"
              >
                <span>🔍</span>
                <span>En Kısa Yolu Hesapla</span>
              </button>

              {/* Arama Sonucu */}
              {aramaYapildi && yolSonucu && (
                <div className="mt-2 p-4 rounded-xl border border-slate-200 bg-slate-50/80 flex flex-col gap-3">
                  {yolSonucu.bulundu ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                          <span>✓</span>
                          <span>Bağlantı Yolu Bulundu ({yolSonucu.mesafe} Adım)</span>
                        </span>
                        <button
                          onClick={handleYoluVurgula}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>✨</span>
                          <span>Tuvalde Parlat ve Vurgula</span>
                        </button>
                      </div>

                      {/* Yol Görsel Adımları */}
                      <div className="flex items-center flex-wrap gap-2 pt-2">
                        {yolSonucu.dugumIdleri.map((dId, idx) => {
                          const dugum = dugumBul(dId);
                          const kenarId = yolSonucu.kenarIdleri[idx];
                          const kenar = kenarlar.find((k) => k.id === kenarId);

                          return (
                            <React.Fragment key={dId}>
                              <div className="px-3 py-1.5 bg-white border-2 border-indigo-500 rounded-lg text-xs font-bold text-indigo-900 shadow-2xs">
                                {dugum?.etiket ?? "Düğüm"}
                              </div>
                              {idx < yolSonucu.dugumIdleri.length - 1 && (
                                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold px-1">
                                  {kenar?.etiket && (
                                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                      {kenar.etiket}
                                    </span>
                                  )}
                                  <span>➔</span>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-amber-700 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Bu iki düğüm arasında doğrudan veya dolaylı bir bağlantı yolu bulunamadı.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={kapat}
            className="h-9 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkInsightsModal;
