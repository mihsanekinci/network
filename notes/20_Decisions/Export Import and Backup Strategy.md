---
title: "Export Import and Backup Strategy"
created: "2026-10-16 14:05"
updated: "2026-10-16 14:05"
type: decision
tags:
  - decision/adr
  - status/accepted
aliases:
  - "Dışa ve İçe Aktarma Stratejisi"
summary: "Harita verilerinin JSON yedekleme ve yüksek çözünürlüklü PNG görsel dışa aktarımı ile taşınabilirlik standardı."
---

# ⚖️ Export Import and Backup Strategy

- **Durum:** Kabul Edildi (Accepted)
- **Kaynak Oturum:** [[2026-10-16 - Advanced Features and Obsidian Brain Integration]]
- **Etkilenen Alanlar:** [[Harita Veri Modeli]], [[React Flow Tuval Mimarisi]]

## 1. Bağlam ve Problem (Context)
NetWork kullanıcılarının oluşturdukları karmaşık kişi ve kavram haritalarını diğer platformlarda (sunumlar, LinkedIn, raporlar) paylaşabilmeleri ve farklı cihazlar arasında kayıpsız taşıyabilmeleri gerekiyordu. 

Alternatifler:
1. Yalnızca ekran görüntüsü alma (kalitesiz ve taşınamaz).
2. Yalnızca veritabanı yedeği (kullanıcı dostu değil).
3. **Seçilen Yöntem:** Hem yüksek çözünürlüklü 2x retina PNG görseli hem de standartlaştırılmış `HaritaPaketiDTO` JSON taşınabilirlik formatı.

## 2. Alınan Karar (Decision)
- **Görsel Dışa Aktarım:** `html-to-image` kütüphanesi kullanılarak `.react-flow__viewport` elementi 2x piksel oranıyla yakalanıp PNG olarak indirilir. Kontrol butonları ve mini harita filtrelenerek temiz bir çıktı üretilir.
- **JSON Yedekleme & Geri Yükleme:** Harita meta verileri, düğümler ve kenarlar tek bir paket halinde JSON olarak dışa aktarılır. İçe aktarma sırasında `POST /api/haritalar/ice-aktar` ucu üzerinden Prisma transaction ile eski düğüm ID'leri yeni oluşturulan CUID'lerle eşleştirilerek ilişkiler bozulmadan veritabanına kaydedilir.

## 3. Gerekçe ve Artılar / Eksiler (Trade-offs)
- **Avantajlar:**
  - Sıfır veri kaybı ile tam taşınabilirlik.
  - İlişkisel bütünlüğün Prisma transaction ile garanti altına alınması.
  - Haritanın anında görsel olarak paylaşılabilmesi.
- **Maliyet / Dikkat:**
  - Çok büyük haritalarda PNG oluşturma işlemi birkaç saniye alabilir; bu nedenle buton üzerinde yükleniyor göstergesi sağlandı.

## 4. Sonuçlar (Consequences)
Kullanıcılar haritalarını yerel JSON dosyaları olarak saklayabilir, arkadaşlarıyla paylaşabilir ve tek tıkla sisteme aktarabilir.
