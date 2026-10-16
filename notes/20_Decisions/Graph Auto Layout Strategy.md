---
title: "Graph Auto Layout Strategy"
created: "2026-10-16 14:05"
updated: "2026-10-16 14:05"
type: decision
tags:
  - decision/adr
  - status/accepted
aliases:
  - "Graf Otomatik Hizalama Stratejisi"
summary: "Dagre algoritması ile düğümlerin hiyerarşik olarak otomatik düzenlenmesi ve konumların veritabanında toplu kalıcılaştırılması."
---

# ⚖️ Graph Auto Layout Strategy

- **Durum:** Kabul Edildi (Accepted)
- **Kaynak Oturum:** [[2026-10-16 - Advanced Features and Obsidian Brain Integration]]
- **Etkilenen Alanlar:** [[Dagre Hierarchical Layout]], [[React Flow Tuval Mimarisi]]

## 1. Bağlam ve Problem (Context)
Kullanıcılar onlarca kişi ve bağlantı ekledikçe tuval karmaşıklaşmakta ve düğümleri tek tek elle sürükleyip hizalamak zaman alıcı hale gelmekteydi.

Alternatifler:
1. Basit ızgara (Grid) dizilimi (bağlantı ilişkilerini dikkate almaz).
2. Force-directed fizik motoru (sürekli hareket eden ve performansı zorlayan yapı).
3. **Seçilen Yöntem:** Hiyerarşik yönlendirilmiş graf algoritması olan **Dagre**.

## 2. Alınan Karar (Decision)
- `@dagrejs/dagre` kütüphanesi kullanılarak `otomatikKonumlandir(dugumler, kenarlar, "TB")` fonksiyonu yazıldı.
- Her düğüm için standart kart boyutları (240x120px), yatay (60px) ve dikey (80px) ayırma mesafeleri tanımlandı.
- Hesaplanan yeni koordinatlar istemci tarafında anında gösterilirken, `PATCH /api/haritalar/:haritaId/dugumler/toplu-konum` uç noktası üzerinden Prisma `$transaction` ile tek bir veritabanı turunda kalıcı hale getirildi.

## 3. Gerekçe ve Artılar / Eksiler (Trade-offs)
- **Avantajlar:**
  - Tek tıkla (veya `⌘D` kısayoluyla) anında derli toplu ve okunabilir graf düzeni.
  - Ağ trafiğini minimize eden toplu konum güncelleme mekanizması.
- **Dezavantajlar:**
  - Çok yoğun döngüsel (cyclic) graflarda kenar kesişimleri oluşabilir; kullanıcı manuel ince ayar yapmaya devam edebilir.

## 4. Sonuçlar (Consequences)
Kullanıcılar zihin haritalarını ve staj ağlarını sıfır eforla temiz bir görsel hiyerarşiye kavuşturabilir.
