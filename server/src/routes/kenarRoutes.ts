import { Router } from "express";
import kenarController from "../controllers/kenarController";

const kenarRotalari = Router({ mergeParams: true });

kenarRotalari.get("/", kenarController.haritayaGoreGetir);
kenarRotalari.post("/", kenarController.olustur);
kenarRotalari.delete("/:id", kenarController.sil);

export default kenarRotalari;
