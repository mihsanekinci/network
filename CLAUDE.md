# NetWork — Geliştirici Kılavuzu

## Proje Vizyonu
Kişiler arası ve kavramlar arası ilişkileri görselleştiren,
genel amaçlı bir Node-Edge harita uygulaması.
İlk kullanım senaryosu staj network takibi olmakla birlikte
mimari baştan genel tutulmuştur — zihin haritası, kavram haritası
gibi farklı kullanım senaryolarına açıktır.

## Tech Stack
### Frontend (client/)
- React 18 + TypeScript (strict mod)
- Vite (geliştirme ortamı)
- React Flow (graf canvas)
- Zustand (global state yönetimi)
- Tailwind CSS (stillendirme)

### Backend (server/)
- Node.js + Express + TypeScript
- Prisma ORM
- SQLite (geliştirme) → PostgreSQL (production)

### Ortak (shared/)
- TypeScript tip tanımları her iki tarafça kullanılır

## Mimari: Pragmatik Katmanlı Mimari
Katman sırası şu şekilde işler, bu sıra asla atlanamaz:

React (UI) → servisler (client) → HTTP → rotalar → controller → servis → repository → Prisma → SQLite

## Klasör Yapısı
network/
├── client/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   ├── graph/
│       │   └── panels/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── types/
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── types/
│   └── prisma/
├── docs/
│   ├── 00 - Ana Harita.md
│   ├── Mimariler/
│   ├── Veritabani/
│   ├── API/
│   └── Ilerleme/
├── shared/
│   └── types/
└── CLAUDE.md

## SOLID Prensipleri — Uygulama Kuralları

### S — Single Responsibility
Her dosyanın tek bir sorumluluğu vardır.
- Controller sadece isteği alır ve yanıtı gönderir, iş kuralı bilmez
- Service sadece iş kurallarını uygular, veritabanı bilmez
- Repository sadece veritabanı işlemleri yapar, iş kuralı bilmez

### O — Open/Closed
Mevcut kodu değiştirmek yerine genişlet.
Yeni düğüm türü eklenecekse mevcut sınıflar değişmez,
yeni sınıf eklenir.

### L — Liskov Substitution
Arayüzleri (interface) uygulayan sınıflar
birbirinin yerine geçebilir olmalıdır.

### I — Interface Segregation
Büyük arayüzler yerine küçük, odaklı arayüzler kullan.

### D — Dependency Inversion
Sınıflar somut implementasyona değil,
soyutlamaya (interface) bağımlı olmalıdır.

## İsimlendirme Kuralları
- Tüm değişken, fonksiyon, sınıf isimleri Türkçe olacak
- Dosya isimleri İngilizce kalacak (OS uyumluluğu için)
- camelCase: değişkenler ve fonksiyonlar (dugumEkle, haritaId)
- PascalCase: sınıflar ve React bileşenleri (DugumServisi, GraphCanvas)
- UPPER_SNAKE_CASE: sabitler (VARSAYILAN_RENK, MAX_DUGUM_SAYISI)
- Interface isimleri I öneki almaz (DugumRepository, DugumServisi)

## Veritabanı Kuralları
- Her tablonun id alanı cuid() ile üretilir
- Tarih alanları her zaman UTC olarak saklanır
- Düğüme özgü esnek özellikler ozellikler JSON alanında tutulur
- Şema değişikliklerinde prisma migrate dev kullanılır, direkt SQL yazılmaz

## Kod Kalite Kuralları
- Her fonksiyon tek iş yapar, 20 satırı geçmez
- Magic number kullanılmaz, sabit tanımlanır
- Her hata fırlatıldığında (throw) anlamlı Türkçe mesaj içerir
- TODO yorumları bırakılmaz, ya yapılır ya issue açılır

## Test Stratejisi
- Her Service fonksiyonu için unit test yazılır
- Test dosyaları ilgili dosyanın yanına __tests__ klasörüne konur
- Test isimleri Türkçe açıklayıcı olur:
  "dugum etiketi boş olunca hata fırlatmalı"

## Git Kuralları
- Her commit tek bir iş yapar
- Commit mesajları Türkçe yazılır
- Örnek: "feat: düğüm ekleme endpoint'i oluşturuldu"
- Örnek: "fix: boş etiket kontrolü eklendi"
- main branch'e direkt push yapılmaz, PR açılır

## Geliştirme Ortamı Komutları
### Projeyi başlatmak için
cd client && npm run dev    # Frontend: http://localhost:5173
cd server && npm run dev    # Backend:  http://localhost:3000

### Veritabanı işlemleri
cd server && npx prisma migrate dev    # Şema değişikliği uygula
cd server && npx prisma studio         # Veritabanını görsel arayüzle aç

## Obsidian / Dokümantasyon Otomasyon Kuralı
- Projede yeni bir katman, API ucu veya veritabanı modeli eklendiğinde/güncellendiğinde `docs/` altındaki ilgili `.md` dosyasını otomatik güncelle.
- Yapılan her önemli özelliğin (feature) veya kod geliştirmesinin ardından `docs/Ilerleme/Gunluk.md` dosyasına günün tarihini atarak kısa bir özet ve tamamlanan adımları ekle.
- Yeni oluşturulan kavramlar veya modüller için Obsidian WikiLink (`[[Konu Basligi]]`) formatını koru.
