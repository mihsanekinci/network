import React, { useState, useRef } from "react";
import { useHaritaStore } from "../../store/haritaStore";
import { haritayiJsonIndir, haritayiPngIndir, haritaDosyasiniOku } from "../../utils/exportUtils";
import type { HaritaPaketiDTO } from "../../types";

interface ImportExportModalProps {
  acik: boolean;
  kapat: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ acik, kapat }) => {
  const { haritalar, secilenHaritaId, dugumler, kenarlar, haritaIceAktar } = useHaritaStore();
  const [yuklenenPaket, setYuklenenPaket] = useState<HaritaPaketiDTO | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [pngIndiriliyor, setPngIndiriliyor] = useState(false);
  const dosyaGirdisiRef = useRef<HTMLInputElement>(null);

  const aktifHarita = haritalar.find((h) => h.id === secilenHaritaId);

  if (!acik) return null;

  const handlePngExport = async () => {
    setPngIndiriliyor(true);
    try {
      const baslik = aktifHarita?.baslik || "network-harita";
      const dosyaAdi = `${baslik.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;
      await haritayiPngIndir(dosyaAdi);
    } finally {
      setPngIndiriliyor(false);
    }
  };

  const handleJsonExport = () => {
    if (!aktifHarita) return;
    haritayiJsonIndir(aktifHarita, dugumler, kenarlar);
  };

  const handleDosyaSec = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    setHata(null);

    try {
      const paket = await haritaDosyasiniOku(dosya);
      setYuklenenPaket(paket);
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Dosya okunamadı");
      setYuklenenPaket(null);
    }
  };

  const handleIceAktarOnayla = async () => {
    if (!yuklenenPaket) return;
    setYukleniyor(true);
    try {
      const yeniHarita = await haritaIceAktar(yuklenenPaket);
      if (yeniHarita) {
        kapat();
      }
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-base">
              📤
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-800">Dışa & İçe Aktarma</h3>
              <p className="text-xs text-slate-500">
                Görsel dışa aktarımı veya JSON yedekleme / geri yükleme
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

        {/* İçerik */}
        <div className="p-6 flex flex-col gap-6">
          {/* Dışa Aktarma Bölümü */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dışa Aktar (Aktif Harita: {aktifHarita?.baslik ?? "Seçilmedi"})
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePngExport}
                disabled={!aktifHarita || pngIndiriliyor}
                className="p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">🖼️</span>
                <span className="text-xs font-bold text-slate-800">
                  {pngIndiriliyor ? "Oluşturuluyor..." : "PNG Görsel İndir"}
                </span>
                <span className="text-[10px] text-slate-500">Yüksek çözünürlük</span>
              </button>

              <button
                onClick={handleJsonExport}
                disabled={!aktifHarita}
                className="p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">💾</span>
                <span className="text-xs font-bold text-slate-800">JSON Yedeği İndir</span>
                <span className="text-[10px] text-slate-500">Tam harita paketi</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* İçe Aktarma Bölümü */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              İçe Aktar (JSON Dosyası Yükle)
            </h4>

            <input
              type="file"
              ref={dosyaGirdisiRef}
              accept=".json"
              onChange={handleDosyaSec}
              className="hidden"
            />

            {!yuklenenPaket ? (
              <button
                type="button"
                onClick={() => dosyaGirdisiRef.current?.click()}
                className="p-5 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-slate-500 hover:text-indigo-600"
              >
                <span className="text-2xl">📁</span>
                <span className="text-xs font-bold">Bir JSON Yedek Dosyası Seçin</span>
                <span className="text-[10px] text-slate-400">Önceden indirilmiş .json dosyaları</span>
              </button>
            ) : (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>✓</span>
                    <span>{yuklenenPaket.harita.baslik}</span>
                  </span>
                  <button
                    onClick={() => setYuklenenPaket(null)}
                    className="text-xs text-slate-400 hover:text-red-600"
                  >
                    Vazgeç
                  </button>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-emerald-800 font-medium">
                  <span>{yuklenenPaket.dugumler.length} Düğüm</span>
                  <span>•</span>
                  <span>{yuklenenPaket.kenarlar.length} Bağlantı</span>
                </div>
                <button
                  onClick={handleIceAktarOnayla}
                  disabled={yukleniyor}
                  className="mt-2 w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{yukleniyor ? "Yükleniyor..." : "Haritayı Sisteme İçe Aktar"}</span>
                </button>
              </div>
            )}

            {hata && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                ⚠️ {hata}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={kapat}
            className="h-8.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;
