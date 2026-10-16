import { Router } from "express";
import dugumController from "../controllers/dugumController";
import { dogrulaGovde } from "../middlewares/validate";
import {
  dugumOlusturSemasi,
  dugumGuncelleSemasi,
  dugumTopluKonumSemasi,
} from "../schemas/dugumSchema";

const dugumRotalari = Router({ mergeParams: true });

dugumRotalari.get("/", dugumController.haritayaGoreGetir);
dugumRotalari.post("/", dogrulaGovde(dugumOlusturSemasi), dugumController.olustur);
dugumRotalari.patch(
  "/toplu-konum",
  dogrulaGovde(dugumTopluKonumSemasi),
  dugumController.topluKonumGuncelle
);
dugumRotalari.patch("/:id", dogrulaGovde(dugumGuncelleSemasi), dugumController.guncelle);
dugumRotalari.put("/:id", dogrulaGovde(dugumGuncelleSemasi), dugumController.guncelle);
dugumRotalari.delete("/:id", dugumController.sil);

export default dugumRotalari;
