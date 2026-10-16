import { Router } from "express";
import kenarController from "../controllers/kenarController";
import { dogrulaGovde } from "../middlewares/validate";
import { kenarOlusturSemasi, kenarGuncelleSemasi } from "../schemas/kenarSchema";

const kenarRotalari = Router({ mergeParams: true });

kenarRotalari.get("/", kenarController.haritayaGoreGetir);
kenarRotalari.post("/", dogrulaGovde(kenarOlusturSemasi), kenarController.olustur);
kenarRotalari.patch("/:id", dogrulaGovde(kenarGuncelleSemasi), kenarController.guncelle);
kenarRotalari.put("/:id", dogrulaGovde(kenarGuncelleSemasi), kenarController.guncelle);
kenarRotalari.delete("/:id", kenarController.sil);

export default kenarRotalari;
