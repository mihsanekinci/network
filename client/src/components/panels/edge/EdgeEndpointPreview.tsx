import React from "react";
import { ArrowRight, ArrowLeftRight, Minus } from "lucide-react";
import { TUR_TASARIM_TOKENLARI } from "../../../constants/designTokens";
import type { DugumDTO, KenarYonu } from "../../../types";

interface EdgeEndpointPreviewProps {
  kaynakDugum?: DugumDTO;
  hedefDugum?: DugumDTO;
  etiket: string;
  yon: KenarYonu;
}

export const EdgeEndpointPreview: React.FC<EdgeEndpointPreviewProps> = ({
  kaynakDugum,
  hedefDugum,
  etiket,
  yon,
}) => {
  const kaynakTur = kaynakDugum?.tur ?? "diger";
  const hedefTur = hedefDugum?.tur ?? "diger";
  const kaynakToken = TUR_TASARIM_TOKENLARI[kaynakTur] ?? TUR_TASARIM_TOKENLARI.diger;
  const hedefToken = TUR_TASARIM_TOKENLARI[hedefTur] ?? TUR_TASARIM_TOKENLARI.diger;
  const KaynakSimge = kaynakToken.simge;
  const HedefSimge = hedefToken.simge;

  return (
    <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-inner">
      {/* Kaynak Düğüm */}
      <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col gap-1 min-w-0">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
          Kaynak
        </span>
        <div className="flex items-center gap-1.5 truncate">
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
            style={{ color: kaynakToken.renkKodu }}
          >
            <KaynakSimge className="w-3.5 h-3.5" />
          </span>
          <span
            className="text-xs font-bold text-slate-800 truncate"
            title={kaynakDugum?.etiket ?? "Bilinmeyen Düğüm"}
          >
            {kaynakDugum?.etiket ?? "Bilinmeyen Düğüm"}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 w-fit text-[10px] font-semibold px-2 py-0.5 rounded-md border ${kaynakToken.rozet.arkaPlan} ${kaynakToken.rozet.metin} ${kaynakToken.rozet.kenarlik}`}
        >
          <span className={`w-1 h-1 rounded-full ${kaynakToken.rozet.nokta}`} />
          {kaynakToken.etiket}
        </span>
      </div>

      {/* İlişki ve Yön Önizleme */}
      <div className="flex flex-col items-center justify-center px-1 shrink-0">
        <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full max-w-[120px] truncate mb-1 shadow-2xs">
          {etiket.trim() || "İlişkili"}
        </div>
        <div className="text-indigo-600 flex items-center justify-center">
          {yon === "tek_yonlu" && <ArrowRight className="w-5 h-5 stroke-[2.2]" />}
          {yon === "cift_yonlu" && <ArrowLeftRight className="w-5 h-5 stroke-[2.2]" />}
          {yon === "yonsuz" && <Minus className="w-5 h-5 stroke-[3]" />}
        </div>
      </div>

      {/* Hedef Düğüm */}
      <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col gap-1 min-w-0">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
          Hedef
        </span>
        <div className="flex items-center gap-1.5 truncate">
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
            style={{ color: hedefToken.renkKodu }}
          >
            <HedefSimge className="w-3.5 h-3.5" />
          </span>
          <span
            className="text-xs font-bold text-slate-800 truncate"
            title={hedefDugum?.etiket ?? "Bilinmeyen Düğüm"}
          >
            {hedefDugum?.etiket ?? "Bilinmeyen Düğüm"}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 w-fit text-[10px] font-semibold px-2 py-0.5 rounded-md border ${hedefToken.rozet.arkaPlan} ${hedefToken.rozet.metin} ${hedefToken.rozet.kenarlik}`}
        >
          <span className={`w-1 h-1 rounded-full ${hedefToken.rozet.nokta}`} />
          {hedefToken.etiket}
        </span>
      </div>
    </div>
  );
};
