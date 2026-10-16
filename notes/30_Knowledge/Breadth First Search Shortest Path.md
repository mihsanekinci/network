---
title: "Breadth First Search Shortest Path"
created: "2026-10-16 14:05"
updated: "2026-10-16 14:05"
type: concept
tags:
  - knowledge/atomic
  - algorithm/graph
aliases:
  - "Genişlik Öncelikli Arama ile En Kısa Yol"
summary: "Ağırlıksız graflarda iki düğüm arasındaki en az adımdan oluşan yolu bulan temel arama algoritması."
---

# 💡 Breadth First Search Shortest Path

## 📖 Tanım
**Genişlik Öncelikli Arama (BFS - Breadth-First Search)**, bir graf yapısında başlangıç düğümünden başlayarak önce en yakın komşuları, ardından onların komşularını katman katman ziyaret eden bir graf gezinti algoritmasıdır. Kenar ağırlıklarının eşit (veya 1) kabul edildiği graflarda iki düğüm arasındaki **en kısa yolu (en az adım sayısını)** garanti eder.

## ⚙️ NetWork İçindeki Rolü ve Uygulama
NetWork uygulamasında kullanıcı iki aktör seçtiğinde (örneğin *Stajyer* ve *Google*):
1. Graf bir komşuluk haritasına (`komsuluk: Map<string, Array<{ komsuId, kenarId }>>`) dönüştürülür.
2. Bir FIFO (First-In, First-Out) kuyruğu (`kuyruk`) ve ziyaret kümesi (`ziyaretEdildi`) kullanılarak hedef düğüme ulaşılana kadar arama yapılır.
3. Her adımda `onceki` haritasında hangi düğümden hangi kenarla gelindiği tutulur.
4. Hedefe ulaşıldığında rota sondan başa doğru takip edilerek (`backtracking`) düğüm ve kenar kimlikleri listesi çıkarılır.

## ⏱️ Zaman ve Alan Karmaşıklığı
- **Zaman:** $O(V + E)$ — Burada $V$ düğüm (vertex) sayısı, $E$ kenar (edge) sayısıdır.
- **Bellek:** $O(V)$ — Ziyaret edilen düğümlerin kuyrukta ve kümede tutulması için gereken alan.

## 🔗 İlgili Bağlantılar
- Karar: [[Network Insights and Path Finding]]
- İlgili: [[Graph Auto Layout Strategy]]
