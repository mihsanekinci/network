import { Router } from "express";
import dugumController from "../controllers/dugumController";

const dugumRotalari = Router({ mergeParams: true });

dugumRotalari.get("/", dugumController.haritayaGoreGetir);
dugumRotalari.post("/", dugumController.olustur);
dugumRotalari.patch("/:id", dugumController.guncelle);
dugumRotalari.put("/:id", dugumController.guncelle);
dugumRotalari.delete("/:id", dugumController.sil);

export default dugumRotalari;
