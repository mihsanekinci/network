import { Router } from "express";
import haritaController from "../controllers/haritaController";
import dugumRotalari from "./dugumRoutes";
import kenarRotalari from "./kenarRoutes";
import { dogrulaGovde } from "../middlewares/validate";
import {
  haritaOlusturSemasi,
  haritaGuncelleSemasi,
  haritaPaketiSemasi,
} from "../schemas/haritaSchema";

const haritaRotalari = Router();

// Harita alt rotaları (nested routes)
haritaRotalari.use("/:haritaId/dugumler", dugumRotalari);
haritaRotalari.use("/:haritaId/kenarlar", kenarRotalari);

// Harita CRUD rotaları
haritaRotalari.get("/", haritaController.tumunuGetir);
haritaRotalari.post("/", dogrulaGovde(haritaOlusturSemasi), haritaController.olustur);
haritaRotalari.post("/ice-aktar", dogrulaGovde(haritaPaketiSemasi), haritaController.iceAktar);
haritaRotalari.get("/:id", haritaController.idileGetir);
haritaRotalari.put("/:id", dogrulaGovde(haritaGuncelleSemasi), haritaController.guncelle);
haritaRotalari.delete("/:id", haritaController.sil);

export default haritaRotalari;
