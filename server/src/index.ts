import express from "express";
import cors from "cors";

const uygulama = express();
const PORT = process.env.PORT ?? 3000;

uygulama.use(cors());
uygulama.use(express.json());

uygulama.get("/saglik", (_istek, yanit) => {
  yanit.json({ durum: "calisıyor" });
});

// Rotalar buraya eklenecek

uygulama.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});

export default uygulama;
