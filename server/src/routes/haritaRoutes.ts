import { Router } from "express";
import haritaController from "../controllers/haritaController";
import dugumRotalari from "./dugumRoutes";
import kenarRotalari from "./kenarRoutes";

const haritaRotalari = Router();

// Harita alt rotaları (nested routes)
haritaRotalari.use("/:haritaId/dugumler", dugumRotalari);
haritaRotalari.use("/:haritaId/kenarlar", kenarRotalari);

// Harita CRUD rotaları
haritaRotalari.get("/", haritaController.tumunuGetir);
haritaRotalari.post("/", haritaController.olustur);
haritaRotalari.get("/:id", haritaController.idileGetir);
haritaRotalari.put("/:id", haritaController.guncelle);
haritaRotalari.delete("/:id", haritaController.sil);

export default haritaRotalari;
