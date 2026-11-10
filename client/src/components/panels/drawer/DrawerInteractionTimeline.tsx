import React, { useState } from "react";
import {
  History,
  Plus,
  Trash2,
  Users,
  Coffee,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  Activity,
  Calendar,
} from "lucide-react";
import {
  ETKILESIM_TURU_SECENEKLERI,
  yeniEtkilesimOlustur,
  enGuncelTemasTarihi,
} from "../../../utils/relationshipFreshness";
import type { EtkilesimKaydi, EtkilesimTuru } from "../../../types";

interface DrawerInteractionTimelineProps {
  ozellikler: Record<string, unknown>;
  onOzellikDegistir: (alan: string, deger: unknown) => void;
}

const ETKILESIM_SIMGELERI: Record<EtkilesimTuru, typeof Users> = {
  toplanti: Users,
  kahve_yemek: Coffee,
  eposta: Mail,
  mesaj: MessageSquare,
  arama: Phone,
  etkinlik: Sparkles,
  diger: Activity,
};

export const DrawerInteractionTimeline: React.FC<DrawerInteractionTimelineProps> = ({
  ozellikler,
  onOzellikDegistir,
}) => {
  const [formAcik, setFormAcik] = useState(false);
  const [tur, setTur] = useState<EtkilesimTuru>("kahve_yemek");
  const [tarih, setTarih] = useState(() => new Date().toISOString().slice(0, 10));
  const [ozet, setOzet] = useState("");
  const [notlar, setNotlar] = useState("");

  const hamEtkilesimler = Array.isArray(ozellikler.etkilesimler)
    ? (ozellikler.etkilesimler as EtkilesimKaydi[])
    : [];

  const siraliEtkilesimler = [...hamEtkilesimler].sort((a, b) =>
    b.tarih.localeCompare(a.tarih)
  );

  const etkilesimEkle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ozet.trim()) return;

    const yeniKayit = yeniEtkilesimOlustur(tur, ozet, notlar, tarih);
    const guncelListe = [yeniKayit, ...hamEtkilesimler];
    onOzellikDegistir("etkilesimler", guncelListe);

    const sonTarih = enGuncelTemasTarihi({
      sonTemasTarihi: ozellikler.sonTemasTarihi,
      etkilesimler: guncelListe,
    });
    if (sonTarih) {
      onOzellikDegistir("sonTemasTarihi", sonTarih);
    }

    setOzet("");
    setNotlar("");
    setFormAcik(false);
  };

  const etkilesimSil = (id: string) => {
    const filtrelenmis = hamEtkilesimler.filter((kayit) => kayit.id !== id);
    onOzellikDegistir("etkilesimler", filtrelenmis);

    const yeniSonTarih = enGuncelTemasTarihi({
      sonTemasTarihi: undefined,
      etkilesimler: filtrelenmis,
    });
    onOzellikDegistir("sonTemasTarihi", yeniSonTarih || "");
  };

  return (
    <div className="p-4.5 bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl flex flex-col gap-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Etkileşim Zaman Çizelgesi
          </h4>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {siraliEtkilesimler.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setFormAcik(!formAcik)}
          className="h-7 px-2.5 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1 btn-tactile"
        >
          <Plus className="w-3 h-3" />
          <span>{formAcik ? "Kapat" : "Temas Ekle"}</span>
        </button>
      </div>

      {formAcik && (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-xl flex flex-col gap-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Tarih</label>
              <input
                type="date"
                value={tarih}
                onChange={(e) => setTarih(e.target.value)}
                className="h-8.5 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Temas Türü</label>
              <select
                value={tur}
                onChange={(e) => setTur(e.target.value as EtkilesimTuru)}
                className="h-8.5 px-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              >
                {ETKILESIM_TURU_SECENEKLERI.map((s) => (
                  <option key={s.tur} value={s.tur}>
                    {s.etiket}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Görüşme Özeti</label>
            <input
              type="text"
              value={ozet}
              onChange={(e) => setOzet(e.target.value)}
              placeholder="Örn: Staj değerlendirmesi yapıldı, proje onaylandı..."
              className="h-8.5 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Notlar (Opsiyonel)</label>
            <textarea
              rows={2}
              value={notlar}
              onChange={(e) => setNotlar(e.target.value)}
              placeholder="Konuşulan detaylar, takip edilecek işler..."
              className="p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setFormAcik(false)}
              className="h-7.5 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={etkilesimEkle}
              disabled={!ozet.trim()}
              className="h-7.5 px-3.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}

      {siraliEtkilesimler.length === 0 ? (
        <div className="py-5 text-center flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500">
          <Calendar className="w-5 h-5 stroke-[1.5] text-slate-300 dark:text-slate-600" />
          <p className="text-xs">Kayıtlı etkileşim geçmişi bulunmuyor.</p>
          <p className="text-[10px]">İlk görüşme veya yazışmayı ekleyin.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
          {siraliEtkilesimler.map((kayit) => {
            const Simge = ETKILESIM_SIMGELERI[kayit.tur] || Activity;
            return (
              <div
                key={kayit.id}
                className="group relative p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-2xs">
                  <Simge className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                      {kayit.ozet}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                      {kayit.tarih}
                    </span>
                  </div>
                  {kayit.notlar && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                      {kayit.notlar}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => etkilesimSil(kayit.id)}
                  title="Etkileşimi Sil"
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
