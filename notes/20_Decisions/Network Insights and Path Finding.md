---
title: "Network Insights and Path Finding"
created: "2026-10-16 14:05"
updated: "2026-10-16 14:05"
type: decision
tags:
  - decision/adr
  - status/accepted
aliases:
  - "Ağ Analitiği ve Rota Bulma Stratejisi"
summary: "Graf metriklerinin hesaplanması, merkezi düğümlerin tespiti ve BFS ile en kısa yolun tuvalde parlatılması."
---

# ⚖️ Network Insights and Path Finding

- **Durum:** Kabul Edildi (Accepted)
- **Kaynak Oturum:** [[2026-10-16 - Advanced Features and Obsidian Brain Integration]]
- **Etkilenen Alanlar:** [[Breadth First Search Shortest Path]], [[React Flow Tuval Mimarisi]]

## 1. Bağlam ve Problem (Context)
Ağ haritası büyüdükçe iki temel ihtiyaç ortaya çıktı:
1. Ağın en kilit aktörlerini (en çok bağlantıya sahip kişileri veya kurumları) tek bakışta analiz etmek.
2. *"A kişisinden C kişisine veya bir hedef şirkete kimler üzerinden ulaşabilirim?"* sorusuna cevap bulmak.

## 2. Alınan Karar (Decision)
- **Metrik Analizi:** Düğüm dereceleri (gelen ve giden bağlantı sayıları), ağ yoğunluğu ve tür dağılımı `hesaplaAgMetrikleri` fonksiyonuyla hesaplandı. En yüksek dereceye sahip ilk 5 düğüm "Kilit Aktörler" olarak listelendi.
- **En Kısa Yol Bulucu (Pathfinder):** Yönsüz ve çift yönlü kenarları da dikkate alan **BFS (Genişlik Öncelikli Arama)** algoritması inşa edildi.
- **Tuvalde Vurgulama:** Bulunan rota adımları tuvale aktarıldığında rota üzerindeki düğüm ve kenarlar altın/amber renkle parlatılır (`ring-amber-400`, `stroke-amber-500`), diğer tüm düğümler odaklanmayı kolaylaştırmak için grileştirilir ve opaklaştırılır.

## 3. Gerekçe ve Artılar / Eksiler (Trade-offs)
- **Avantajlar:**
  - $O(V + E)$ zaman karmaşıklığı ile tarayıcıda anlık ve gecikmesiz hesaplama.
  - Somut staj/network senaryolarında referans zincirlerini görsel olarak ortaya çıkarma.
- **Sonuçlar:**
  - NetWork artık sadece statik bir çizim aracı değil, karar destek sağlayan analitik bir graf platformudur.
