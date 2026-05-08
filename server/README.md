# server — Backend Katmanı

## Sorumluluk
İş kurallarını uygular ve veriyi kalıcı hale getirir. HTTP isteklerini alır,
iş mantığını işler, veritabanıyla etkileşime girer ve yanıt döner.

## Katman Akışı
```
HTTP isteği
  → rotalar (routes/)
    → controller (controllers/)    ← sadece istek/yanıt
      → servis (services/)         ← iş kuralları
        → repository (repositories/) ← sadece DB işlemleri
          → Prisma → SQLite
```

## Klasör Yapısı
| Klasör | Sorumluluk |
|---|---|
| `src/controllers/` | HTTP istek/yanıt yönetimi, iş kuralı bilmez |
| `src/services/` | İş kuralları, DB bilmez |
| `src/repositories/` | Prisma sorguları, iş kuralı bilmez |
| `src/routes/` | Endpoint tanımları, middleware bağlantısı |
| `src/middleware/` | Hata yakalama, kimlik doğrulama vb. |
| `src/types/` | Server-tarafına özgü tip tanımları |
| `prisma/` | Şema ve migrasyon dosyaları |

## Geliştirme
```bash
npm install
npm run db:migrate   # İlk migrasyon (dev.db oluşturur)
npm run dev          # http://localhost:3000
```

## Veritabanı Araçları
```bash
npm run db:studio    # Prisma Studio görsel arayüzü
npm run db:generate  # Prisma client yeniden oluştur
```

## Teknolojiler
- Node.js + Express + TypeScript
- Prisma ORM
- SQLite (geliştirme) → PostgreSQL (production)
