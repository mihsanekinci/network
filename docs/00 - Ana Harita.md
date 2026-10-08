# 🗺️ 00 - Ana Harita (MOC - Map of Content)

> **NetWork** projesinin İkinci Beyin (Second Brain) ana haritasıdır. Projenin mimarisi, veritabanı tasarımı, API katmanları ve gelişim süreci bu merkezden dallanır.

---

## 📌 Proje Özeti ve Vizyon
**NetWork**, kişi ve kavramlar arasındaki çok boyutlu ilişkileri görselleştirmek amacıyla tasarlanmış açık uçlu bir **Node-Edge harita uygulamasıdır**. 

İlk somut senaryo **staj network takibi** olsa da; mimari, zihin haritaları (mind maps) ve kavram haritaları gibi farklı kullanım senaryolarına genişleyebilecek şekilde genel ve soyut tasarlanmıştır.

---

## 🧠 İkinci Beyin Notları (Knowledge Graph)

Aşağıdaki bağlantılar üzerinden projenin tüm teknik detaylarına ulaşabilirsiniz:

- 🏛️ **[[Katmanli Mimari|Mimariler: Katmanlı Mimari]]**:
  Uygulamanın omurgasını oluşturan *Pragmatik Katmanlı Mimari* ve SOLID prensipleri uygulama standartları.
  
- 🗄️ **[[Prisma ve SQLite|Veritabanı: Prisma ve SQLite]]**:
  SQLite geliştirme veritabanı, Prisma ORM şeması, CUID anahtar yapısı ve veri modelleri (`Harita`, `Dugum`, `Kenar`).

- 🔌 **[[Rotalar ve Controllers|API: Rotalar ve Controllers]]**:
  Express.js REST API uç noktaları, controller yapısı, istek doğrulama ve hata yönetim stratejisi.

- ⚛️ **[[Zustand ve Servisler|Frontend: Zustand ve API Servisleri]]**:
  İstemci HTTP API servisleri (`client/src/services`), `useHaritaStore` Zustand durumu ve asenkron veri akışı.

- 🎨 **[[React Flow Canvas|Frontend: React Flow Canvas ve Paneller]]**:
  Görsel graf canvas motoru (`GraphCanvas`), özel renkli düğüm kartları (`CustomNode`), sidebar ve modallar.

- ▶️ **[[Calistirma Rehberi|Çalıştırma Rehberi]]**:
  Projeyi ayağa kaldırmak için terminal komutları (2 terminal: backend + frontend).

- 📈 **[[Gunluk|İlerleme: Geliştirme Günlüğü & Yol Haritası]]**:
  Tamamlanan commit'ler, mevcut durum, sıradaki adımlar ve mimari karar kayıtları (ADR).

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Alan | Teknolojiler | Rol |
| :--- | :--- | :--- |
| **Frontend (`client/`)** | React 18, TypeScript, Vite | Kullanıcı Arayüzü & İstemci |
| **Canvas & Görselleştirme** | React Flow | Node-Edge İnteraktif Graf Motoru |
| **State Yönetimi** | Zustand | İstemci Tarafı Reaktif Durum |
| **Stillendirme** | Tailwind CSS | Modern, Hızlı Bileşen Tasarımı |
| **Backend (`server/`)** | Node.js, Express, TypeScript | REST API & İş Mantığı Sunucusu |
| **ORM & Veritabanı** | Prisma ORM, SQLite | Veri Modelleme & Kalıcı Depolama |
| **Ortak Tipler (`shared/`)** | TypeScript Interface / Tipleri | Uçtan Uca Tip Güvenliği |

---

## 📐 Temel Mühendislik Kuralları

1. **Katman Sırası Asla Atlanamaz:**
   $$\text{React UI} \rightarrow \text{İstemci Servisi} \rightarrow \text{HTTP} \rightarrow \text{Rota} \rightarrow \text{Controller} \rightarrow \text{Servis} \rightarrow \text{Repository} \rightarrow \text{Prisma} \rightarrow \text{SQLite}$$
   *(Ayrıntılar için: [[Katmanli Mimari]])*

2. **Türkçe İsimlendirme, İngilizce Dosya Adları:**
   - Değişken, fonksiyon, sınıf ve hata mesajları **Türkçe** (`dugumEkle`, `DugumServisi`).
   - Dosya adları işletim sistemi ve modül uyumluluğu için **İngilizce** (`dugumServisi.ts`, `schema.prisma`).

3. **CUID & UTC Standartları:**
   - Bütün tablolarda kimlikler `cuid()` ile üretilir.
   - Zaman damgaları daima UTC kaydedilir.
   *(Ayrıntılar için: [[Prisma ve SQLite]])*

4. **Küçük ve Odaklı Fonksiyonlar:**
   - Her fonksiyon tek bir iş yapar (SRP) ve 20 satırı geçmez.
   - Sihirli sayılar (magic numbers) yasaktır; sabit tanımlanır.

---

## 🚀 Hızlı Başlangıç Komutları

> Backend ve frontend **ayrı terminallerde** çalışır. Ayrıntı: [[Calistirma Rehberi]]

```bash
# Frontend Geliştirme Sunucusu (http://localhost:5173)
cd client && npm run dev

# Backend API Sunucusu (http://localhost:3000)
cd server && npm run dev

# Veritabanı Değişikliği Uygulama (Prisma Migrate)
cd server && npx prisma migrate dev

# Veritabanı Görsel Yönetim Paneli
cd server && npx prisma studio
```

---
*İlgili Bağlantılar:* [[Katmanli Mimari]] | [[Prisma ve SQLite]] | [[Rotalar ve Controllers]] | [[Zustand ve Servisler]] | [[React Flow Canvas]] | [[Gunluk]]
