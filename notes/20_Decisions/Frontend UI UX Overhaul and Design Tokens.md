---
title: "Frontend UI/UX Overhaul and Design Tokens"
created: "2026-10-18"
type: adr
tags:
  - adr
  - frontend
  - ui-ux
  - design-system
  - craftsmanship
---

# 🎨 ADR 0005: Frontend UI/UX Craftsmanship ve Tasarım Tokenları Dönüşümü

## 📌 Bağlam ve Problem (Context)
NetWork platformu işlevsel olarak gelişmiş özelliklere (BFS rota analizi, Dagre auto-layout, JSON import/export, Zod doğrulama) sahip olmasına rağmen arayüzü "AI slop" olarak adlandırılan genel şablon hissiyatına sahipti:
- Dağınık ve tutarsız ham emojiler (👤, 🏢, 💡, 📌, 🔍, 🗺️, ✨, ✕),
- Tuvali boğan geleneksel, ekranı ikiye bölen dikdörtgen navbar,
- Rastgele seçilmiş Tailwind renkleri ve taktil derinliği olmayan düz beyaz kartlar,
- Ayrık bileşenlerde mükerrer tanımlanmış tür stilleri.

Bu karar, projenin arayüzünü **Linear, Raycast ve Figma** seviyesinde taktil (dokunsal), tutarlı ve profesyonel bir tuval deneyimine dönüştürme mimarisini belirler.

---

## 🏛️ Alınan Mimari Kararlar (Decisions)

### 1. Tek Doğruluk Kaynağı (Single Source of Truth) - Design Tokens
- Tüm düğüm türleri (`kisi`, `kurum`, `kavram`, `diger`) için `client/src/constants/designTokens.ts` modülü oluşturuldu.
- Renk kodları, rozet sınırları, kart gölgeleri, avatar gradyanları ve Lucide ikon referansları bu token dosyasına bağlandı.

### 2. Yeknesak İkonografi Motoru (`lucide-react`)
- Projedeki tüm ham emojiler ve ilkel inline SVG'ler temizlendi.
- Bütün sistem genelinde tutarlı optik ağırlığa sahip `lucide-react` vektörel ikon seti entegre edildi.

### 3. Taktil Derinlik & Yüzen Cam Adacıklar (Floating Islands)
- Tuvalin üzerindeki katı navbar kaldırılarak `glass-floating` yüzen ada mimarisine geçildi:
  - **Sol Ada:** Harita kimliği ve düğüm/kenar sayaçları.
  - **Orta Ada:** Raycast tarzı `SearchFilterBar` (kısayol rozeti `⌘F`, temizleme ve tip dropdown'u).
  - **Sağ Ada:** Hızlı eylemler (`+ Düğüm Ekle`, Dagre `Düzenle`, `⋯` Seçenekler menüsü).

### 4. Düğüm Kartı Anatomisi (`CustomNode.tsx`)
- `.tactile-card` sınıfı ile hover anında yukarı yaylanma (`translateY(-1.5px)`),
- İki harfli gradyan monogram avatar veya doğrulanmış profil resmi,
- Taktil iğne uçlu 4 yönlü 5'er slotlu bağlantı handle'ları (`!w-2.5 !h-2.5 rounded-full border-2 border-white shadow-xs`).

### 5. Boş Durumlar & Modallar
- Boş tuval ve panel durumlarında minimalist vektörel illüstrasyonlar ve yönlendirici rozetler yerleştirildi.
- Tüm modallar `glass-floating` derinliği ve klavye destekli (`Esc`) modern dialog standartlarına yükseltildi.

---

## ⚖️ Sonuçlar ve Etkiler (Consequences)

### Olumlu:
- "AI Slop" hissi tamamen silindi; özgün, dokunsal ve modern bir tasarım dili sağlandı.
- Bileşenler arası stil kopyalamaları ortadan kalktı; ileride yeni bir tür eklemek sadece `designTokens.ts` dosyasına 1 nesne eklemek kadar basitleşti (SOLID Açık/Kapalı Prensibi).
- `npm run build` ve `npm run lint` testleri sıfır hata ve sıfır uyarı ile geçiyor.

---

## 🔗 İlgili Bağlantılar
- [[2026-10-18 - Frontend UI UX Overhaul and Tactile Craft]]
- [[Katmanli Mimari]]
- [[00_Index]]
