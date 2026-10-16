import express from "express";
import cors from "cors";

import haritaRotalari from "./routes/haritaRoutes";
import dugumRotalari from "./routes/dugumRoutes";
import kenarRotalari from "./routes/kenarRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const uygulama = express();
const PORT = process.env.PORT ?? 3000;

uygulama.use(cors());
uygulama.use(express.json());

uygulama.get("/saglik", (_istek, yanit) => {
  yanit.json({ durum: "calisıyor" });
});

// Harita ana rotaları (nested düğüm ve kenar rotalarını da içerir)
uygulama.use("/haritalar", haritaRotalari);
uygulama.use("/api/haritalar", haritaRotalari);

// Bağımsız düğüm ve kenar uç noktaları
uygulama.use("/dugumler", dugumRotalari);
uygulama.use("/api/dugumler", dugumRotalari);
uygulama.use("/kenarlar", kenarRotalari);
uygulama.use("/api/kenarlar", kenarRotalari);

// Merkezi hata yönetimi middleware'i (tüm rotalardan sonra eklenmelidir)
uygulama.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  uygulama.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  });
}


export default uygulama;
