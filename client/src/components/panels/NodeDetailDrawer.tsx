import React, { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";
import { useHaritaStore } from "../../store/haritaStore";
import { TUR_TASARIM_TOKENLARI } from "../../constants/designTokens";
import type { DugumDTO, DugumTuru } from "../../types";
import { DrawerHeader } from "./drawer/DrawerHeader";
import {
  DrawerConnectionSummary,
  type BaglantiOgesi,
} from "./drawer/DrawerConnectionSummary";
import { DrawerBasicFields } from "./drawer/DrawerBasicFields";
import { DrawerAttributesEditor } from "./drawer/DrawerAttributesEditor";
import { DrawerFooter } from "./drawer/DrawerFooter";

interface NodeDetailDrawerContentProps {
  dugum: DugumDTO;
}

const NodeDetailDrawerContent: React.FC<NodeDetailDrawerContentProps> = ({ dugum }) => {
  const {
    secilenDugumuAyarla,
    dugumler,
    kenarlar,
    dugumGuncelle,
    dugumSil,
    yukleniyor,
  } = useHaritaStore();

  const [etiket, setEtiket] = useState(dugum.etiket);
  const [tur, setTur] = useState<DugumTuru>(dugum.tur);
  const [ozellikler, setOzellikler] = useState<Record<string, unknown>>(
    dugum.ozellikler ? { ...dugum.ozellikler } : {}
  );
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [bildirim, setBildirim] = useState<string | null>(null);

  // ESC tuşuyla paneli kapatma
  useEffect(() => {
    const escTusuYakala = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        secilenDugumuAyarla(null);
      }
    };
    window.addEventListener("keydown", escTusuYakala);
    return () => window.removeEventListener("keydown", escTusuYakala);
  }, [secilenDugumuAyarla]);

  // Bağlantı istatistikleri ve listeleri
  const { gelenBaglantilar, gidenBaglantilar, toplamBaglantiSayisi } = useMemo(() => {
    const gelen: BaglantiOgesi[] = kenarlar
      .filter((k) => k.hedefId === dugum.id)
      .map((k) => {
        const kaynakDugum = dugumler.find((d) => d.id === k.kaynakId);
        return {
          ...k,
          bagliDugum: kaynakDugum,
          bagliDugumAdi: kaynakDugum?.etiket ?? "Bilinmeyen Düğüm",
        };
      });

    const giden: BaglantiOgesi[] = kenarlar
      .filter((k) => k.kaynakId === dugum.id)
      .map((k) => {
        const hedefDugum = dugumler.find((d) => d.id === k.hedefId);
        return {
          ...k,
          bagliDugum: hedefDugum,
          bagliDugumAdi: hedefDugum?.etiket ?? "Bilinmeyen Düğüm",
        };
      });

    return {
      gelenBaglantilar: gelen,
      gidenBaglantilar: giden,
      toplamBaglantiSayisi: gelen.length + giden.length,
    };
  }, [dugum.id, kenarlar, dugumler]);

  const handleOzellikDegistir = (alan: string, deger: unknown) => {
    setOzellikler((onceki) => ({
      ...onceki,
      [alan]: deger,
    }));
  };

  const handleKaydet = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!etiket.trim() || yukleniyor || kaydediliyor) return;

    setKaydediliyor(true);
    setBildirim(null);

    const sonuc = await dugumGuncelle(dugum.id, {
      etiket: etiket.trim(),
      tur,
      ozellikler,
    });

    setKaydediliyor(false);
    if (sonuc) {
      setBildirim("Değişiklikler başarıyla kaydedildi.");
      setTimeout(() => setBildirim(null), 3000);
    }
  };

  const handleSil = async () => {
    const onay = window.confirm(
      `"${dugum.etiket}" düğümünü ve bağlı ${toplamBaglantiSayisi} bağlantıyı silmek istediğinizden emin misiniz?`
    );
    if (onay) {
      await dugumSil(dugum.id);
    }
  };

  const aktifToken = TUR_TASARIM_TOKENLARI[tur] ?? TUR_TASARIM_TOKENLARI.diger;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Dışarı tıklama / Arka plan karartması */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Paneli Kapat"
        onClick={() => secilenDugumuAyarla(null)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") secilenDugumuAyarla(null);
        }}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Sağdan Kayarak Açılan Drawer Paneli */}
      <div className="relative z-50 w-full max-w-lg bg-slate-50/80 shadow-2xl h-full flex flex-col border-l border-slate-200/90 animate-in slide-in-from-right duration-250 backdrop-blur-xl">
        {/* 1. Üst Başlık & Kapatma Butonu */}
        <DrawerHeader
          etiket={etiket.trim() || dugum.etiket}
          dugumId={dugum.id}
          aktifToken={aktifToken}
          onKapat={() => secilenDugumuAyarla(null)}
        />

        {/* Başarı Bildirimi */}
        {bildirim && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{bildirim}</span>
          </div>
        )}

        {/* 2. Kaydırılabilir İçerik & Form Alanları */}
        <form
          id="dugum-detay-form"
          onSubmit={handleKaydet}
          className="flex-1 overflow-y-auto p-5 flex flex-col gap-4.5"
        >
          {/* Bağlantı Özeti Kartı */}
          <DrawerConnectionSummary
            toplamBaglantiSayisi={toplamBaglantiSayisi}
            gelenBaglantilar={gelenBaglantilar}
            gidenBaglantilar={gidenBaglantilar}
          />

          {/* Temel Bilgiler Kartı */}
          <DrawerBasicFields
            etiket={etiket}
            tur={tur}
            fotografUrl={((ozellikler.fotograf || ozellikler.avatarUrl) as string) ?? ""}
            onEtiketDegistir={setEtiket}
            onTurDegistir={setTur}
            onFotografDegistir={(url) => handleOzellikDegistir("fotograf", url)}
          />

          {/* Dinamik Nitelikler ve Notlar */}
          <DrawerAttributesEditor
            tur={tur}
            ozellikler={ozellikler}
            onOzellikDegistir={handleOzellikDegistir}
          />
        </form>

        {/* 3. Alt Butonlar Barı (Drawer Footer) */}
        <DrawerFooter
          yukleniyor={yukleniyor}
          kaydediliyor={kaydediliyor}
          kaydetDevreDisi={yukleniyor || kaydediliyor || !etiket.trim()}
          onSil={handleSil}
          onVazgec={() => secilenDugumuAyarla(null)}
        />
      </div>
    </div>
  );
};

export const NodeDetailDrawer: React.FC = () => {
  const { secilenDugumId, dugumler } = useHaritaStore();

  const secilenDugum = useMemo(
    () => dugumler.find((d) => d.id === secilenDugumId) ?? null,
    [dugumler, secilenDugumId]
  );

  if (!secilenDugumId || !secilenDugum) {
    return null;
  }

  return <NodeDetailDrawerContent key={secilenDugum.id} dugum={secilenDugum} />;
};

export default NodeDetailDrawer;
