# ▶️ Çalıştırma Rehberi

> Projeyi sıfırdan ayağa kaldırmak için gereken komutlar. Üst Not: [[00 - Ana Harita]]

## İlk Kurulum (Sıfırdan Başlarken)

```bash
# Backend kurulumu
cd server && npm install
cp .env.example .env
npx prisma migrate dev
cd ..

# Frontend kurulumu
cd client && npm install
cd ..
```

## Günlük Kullanım — 2 Terminal

| Terminal | Komut | Adres |
| :--- | :--- | :--- |
| **1 — Backend** | `cd server && npm run dev` | http://localhost:3000 |
| **2 — Frontend** | `cd client && npm run dev` | http://localhost:5173 |

Sonra tarayıcıda http://localhost:5173 adresini aç. Backend kapalıysa ekranda "Sunucuya ulaşılamadı" uyarısı görünür (bkz. [[Zustand ve Servisler]]).

## İsteğe Bağlı (3. Terminal)

```bash
cd server && npx prisma studio         # Veritabanını görsel arayüzle aç
cd server && npx prisma migrate dev    # Şema değişikliğini uygula (ilk kurulumda backend'den önce)
```

## Tip Kontrolü

```bash
cd client && npx tsc --noEmit -p tsconfig.app.json
cd server && npx tsc --noEmit
```

## Sorun Giderme
- **Beyaz ekran:** Tarayıcı konsolunu kontrol et. `reactflow` tipleri `import { type X }` ile alınmalı (bkz. [[React Flow Canvas]]).
- **Port dolu:** `lsof -i :3000` veya `lsof -i :5173` ile eski süreci bul ve kapat.

---
*İlgili Notlar:* [[00 - Ana Harita]] | [[Gunluk]]
