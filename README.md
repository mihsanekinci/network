# NetWork

Kişiler arası ve kavramlar arası ilişkileri görselleştiren, genel amaçlı bir **Node-Edge harita uygulaması**.
İlk kullanım senaryosu staj network takibidir; mimari zihin haritası ve kavram haritası gibi senaryolara açıktır.

## Özellikler
- Birden fazla harita oluşturma, seçme ve silme
- 4 düğüm türü: **kişi**, **kurum**, **kavram**, **diğer**
- Düğümleri sürükleyip bırakma (konum otomatik kaydedilir)
- Düğümler arasında bağlantı (kenar) çizme, bağlantıya tıklayarak silme
- Mini harita, yakınlaştırma ve ızgara arka planı

## Teknolojiler
| Alan | Teknoloji |
| :--- | :--- |
| Frontend (`client/`) | React, TypeScript, Vite, React Flow, Zustand, Tailwind CSS |
| Backend (`server/`) | Node.js, Express, TypeScript, Prisma ORM |
| Veritabanı | SQLite (geliştirme), PostgreSQL'e hazır |
| Ortak tipler (`shared/`) | TypeScript tip tanımları |

## Gereksinimler
- Node.js (güncel LTS) ve npm

## Kurulum
```bash
git clone https://github.com/mihsanekinci/network.git
cd network

# Backend
cd server
npm install
cp .env.example .env
npx prisma migrate dev
cd ..

# Frontend
cd client
npm install
```

## Çalıştırma
İki ayrı terminal gerekir:

| Terminal | Komut | Adres |
| :--- | :--- | :--- |
| Backend | `cd server && npm run dev` | http://localhost:3000 |
| Frontend | `cd client && npm run dev` | http://localhost:5173 |

Tarayıcıda http://localhost:5173 adresini açın. İsteğe bağlı: `cd server && npx prisma studio` veritabanını görsel arayüzle açar.

## Mimari
Katman sırası asla atlanmaz:

```
React (UI) → client servisleri → HTTP → rotalar → controller → servis → repository → Prisma → SQLite
```

```
network/
├── client/   # React arayüzü (components, services, store, types)
├── server/   # Express API (routes, controllers, services, repositories, prisma)
├── shared/   # Ortak tip tanımları
└── docs/     # Obsidian notları (mimari, API, ilerleme günlüğü)
```

## API Özeti
Tüm uçlar `/api` önekiyle de erişilebilir.

| Kaynak | Uçlar |
| :--- | :--- |
| Haritalar | `GET/POST /haritalar`, `GET/PUT/DELETE /haritalar/:id` |
| Düğümler | `GET/POST /haritalar/:haritaId/dugumler`, `PATCH/PUT/DELETE .../dugumler/:id` |
| Kenarlar | `GET/POST /haritalar/:haritaId/kenarlar`, `DELETE .../kenarlar/:id` |

Ayrıntılar için `docs/API/Rotalar ve Controllers.md`.

## Tip Kontrolü
```bash
cd client && npx tsc --noEmit -p tsconfig.app.json
cd server && npx tsc --noEmit
```

## Geliştirme Kuralları
İsimlendirme (Türkçe kod, İngilizce dosya adı), SOLID, commit ve PR kuralları [CLAUDE.md](CLAUDE.md) dosyasındadır.
`main` branch'ine direkt push yapılmaz, PR açılır.

## Dokümantasyon
Proje notları `docs/` klasöründe, [Obsidian](https://obsidian.md) ile açılacak şekilde hazırlanmıştır. Başlangıç noktası: `docs/00 - Ana Harita.md`.
