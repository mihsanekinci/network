---
title: "Project Knowledge Index"
created: "2026-10-16"
updated: "2026-10-16"
type: overview
tags:
  - moc
  - project/index
---

# 🌐 NetWork Bilgi Haritası (MOC)

Bu kasa, **NetWork** projesinin tüm geliştirme oturumlarını, mimari ve stratejik kararlarını (ADR), atomik graf algoritmalarını ve çözülen problemlerini nöral bir ağ gibi birbirine bağlar.

---

## 🧭 Hızlı Erişim
- 🎯 **Temel Amaç:** Kişi, kurum ve kavramlar arası ilişkileri görselleştiren ve analiz eden genel amaçlı Node-Edge harita platformu.
- 📌 **Mevcut Durum:** Aktif / İleri Seviye SaaS Özellikleri & Ağ Analitiği Tamamlandı.
- 🏛️ **Eski MOC / Başlangıç:** [[00 - Ana Harita]]

---

## 🗂️ Bilgi Haritası Kategorileri

### 10. Oturum Günlükleri (Sessions & Logs)
- [[2026-10-16 - Advanced Features and Obsidian Brain Integration]] - İleri seviye 5 özellik (Export/Import, Dagre Auto-Layout, Pathfinder, Avatarlar, Kısayollar) ve Obsidian Brain entegrasyonu.
- [[2026-10-16 - UI and Connection Refinements]] - Özel ilişki şablonları, 4 yönlü multi-slot bağlantılar, açılır-kapanır sidebar ve kompakt navbar seçenekler menüsü.
- [[2026-10-16 - Backend Hardening and Modular Architecture]] - Zod çalışma zamanı doğrulaması, merkezi hata yönetimi, Prisma indeksleri, ACID transaction ve 143 API entegrasyon testi.
- [[2026-10-18 - Frontend UI UX Overhaul and Tactile Craft]] - "AI slop"tan Linear/Figma kalitesine geçiş; Lucide ikonları, yüzen ada toolbar, taktil düğüm kartları ve tasarım tokenları.

### 20. Kararlar ve Tercihler (Decisions & Strategy - ADR)
- [[Frontend UI UX Overhaul and Design Tokens]] - Tasarım tokenları (Design Tokens), tek doğruluk kaynağı, taktil cam arayüz ve yeknesak ikonografi mimarisi (ADR 0005).
- [[Backend Resilience and Validation Strategy]] - Zod şema doğrulaması, AppError hiyerarşisi ve Prisma ACID transaction mimarisi (ADR 0004).
- [[Export Import and Backup Strategy]] - PNG görsel ve JSON tam paket yedekleme/içe aktarma mimarisi.
- [[Graph Auto Layout Strategy]] - Dagre algoritması ile tek tıkla hiyerarşik düzenleme ve toplu konum kalıcılığı.
- [[Network Insights and Path Finding]] - Ağ yoğunluğu analizi, kilit aktörler ve BFS ile en kısa yol bulma.

### 30. Kavramlar ve Bilgi Dağarcığı (Core Knowledge)
- [[Breadth First Search Shortest Path]] - İki aktör arasındaki en kısa referans/tanışıklık zincirini bulan BFS graf gezintisi.
- [[Dagre Hierarchical Layout]] - Yönlendirilmiş graflarda katmanlı ve kesişimsiz hiyerarşik yerleşim motoru.

### 40. Sorunlar ve Çözümler (Troubleshooting)
- [[MacBook Sleep and Broken Pipe]] - Ekran kilitleme, sistem uykusu ve kopan SSE TCP bağlantılarının kök nedeni ve çözümü.

### 50. Kaynaklar ve Referanslar (Resources)
- [[Calistirma Rehberi]] - Projenin backend ve frontend servislerini ayağa kaldırma rehberi.
- [[Katmanli Mimari]] - React UI'dan Prisma veritabanına uzanan katı katmanlı mimari standartları.
