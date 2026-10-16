---
title: "Dagre Hierarchical Layout"
created: "2026-10-16 14:05"
updated: "2026-10-16 14:05"
type: concept
tags:
  - knowledge/atomic
  - algorithm/layout
aliases:
  - "Dagre Hiyerarşik Graf Yerleşimi"
summary: "Yönlendirilmiş grafları katmanlara ayırarak kenar kesişimlerini en aza indiren Sugiyama tarzı yerleşim motoru."
---

# 💡 Dagre Hierarchical Layout

## 📖 Tanım
**Dagre**, yönlendirilmiş asiklik grafları (DAG) ve genel yönlendirilmiş ağları hiyerarşik katmanlar halinde dizmek için kullanılan hafif bir JavaScript/TypeScript yerleşim kütüphanesidir. Temelinde klasik **Sugiyama algoritması** yatar.

## 📐 Çalışma Aşamaları
1. **Döngü Giderme (Cycle Removal):** Varsa graf içindeki döngüleri tersine çevirerek geçici olarak asiklik hale getirir.
2. **Katman Atama (Layering / Ranking):** Düğümleri yukarıdan aşağıya (TB - Top-to-Bottom) veya soldan sağa (LR - Left-to-Right) düzeylere atar.
3. **Kesişim Azaltma (Crossing Minimization):** Her düzeydeki düğümlerin yatay sırasını değiştirerek çizgilerin üst üste binmesini en aza indirir.
4. **Koordinat Hesaplama (Coordinate Assignment):** Düğümlerin genişlik ve yüksekliklerini hesaba katarak mutlak $(x, y)$ merkez koordinatlarını belirler.

## 🛠️ NetWork Entegrasyonu
React Flow düğümleri sol-üst koordinat referansına (`position: { x, y }`) ihtiyaç duyduğundan; Dagre'nin döndürdüğü merkez koordinatlar kart genişliğinin yarısı (`DUGUM_GENISLIK / 2`) çıkarılarak React Flow tuvaline dönüştürülür:
```typescript
pozisyonX = Math.round(dagreNode.x - DUGUM_GENISLIK / 2);
pozisyonY = Math.round(dagreNode.y - DUGUM_YUKSEKLIK / 2);
```

## 🔗 İlgili Bağlantılar
- Karar: [[Graph Auto Layout Strategy]]
- Konsept: [[Breadth First Search Shortest Path]]
