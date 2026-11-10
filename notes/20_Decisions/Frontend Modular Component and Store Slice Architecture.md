---
title: "Frontend Modular Component and Store Slice Architecture"
created: "2026-11-10"
type: adr
tags:
  - adr
  - frontend
  - refactor
  - modular-architect
  - zustand
  - clean-code
---

# 🧱 ADR 0006: Frontend Modüler Bileşen ve Zustand Slice Mimarisi (SRP Hijyeni)

## 📌 Bağlam ve Problem (Context)
Faz 21 sonrasında NetWork frontend arayüzü görsel ve dokunsal olarak üst seviyeye taşınmış olsa da, bileşen ve durum yönetimi seviyesinde monolitik birikmeler yaşanmıştı:
- `NodeDetailDrawer.tsx` (643 satır), `EdgeModal.tsx` (546 satır), `GraphCanvas.tsx` (480 satır) ve `App.tsx` (444 satır) dosyaları SRP (Single Responsibility Principle) ve 300 satırlık mimari fitness sınırını aşıyordu.
- `haritaStore.ts` (406 satır) tüm harita, düğüm, kenar, filtreleme ve arayüz durumlarını tek bir dev Zustand nesnesi içinde barındırıyordu.
- `arch_audit.py` sensörü `client/` üzerinde 7 adet SRP ihlali (`FAIL`) raporluyordu.

---

## 🏛️ Alınan Mimari Kararlar (Decisions)

### 1. Zustand Slice Pattern ile Durum Ayrıştırması
`client/src/store/` dizini Arketip C (Frontend UI) kurallarına göre dilimlere (slices) ayrıldı:
- `types.ts`: Ortak `HaritaStore` birleşim arayüzü ve dilim tipleri.
- `slices/haritaSlice.ts`: Harita CRUD ve seçim operasyonları.
- `slices/dugumSlice.ts`: Düğüm CRUD, toplu konum optimizasyonu ve silme işlemleri.
- `slices/kenarSlice.ts`: Kenar CRUD ve bağlantı yönetimi.
- `slices/uiSlice.ts`: Filtreleme, yol vurgulama, layout durumu ve hata bildirimleri.
- `haritaStore.ts`: Yalnızca dilimleri birleştiren 15 satırlık temiz bir ana gövde.

### 2. Şişman Bileşenlerin (Fat Components) Atomik Parçalanması
- **`NodeDetailDrawer` (643 -> 175 satır):**
  - `DrawerHeader`: Başlık, CUID kopyalama ve rozet.
  - `DrawerConnectionSummary`: Gelen/giden kenar listesi ve sayaçlar.
  - `DrawerBasicFields`: Etiket, avatar URL ve tür seçimi kartları.
  - `DrawerAttributesEditor`: Kişi, kurum ve kavram nitelik alanları.
  - `DrawerFooter`: Kaydet, sil ve vazgeç eylemleri.
- **`EdgeModal` (546 -> 195 satır):**
  - `EdgeEndpointPreview`: Kaynak-hedef bağlantı kartı.
  - `EdgeRelationshipTemplates`: Hızlı ve özel ilişki şablonları yönetimi.
  - `EdgeDirectionSelector`: Yön seçim butonları.
- **`NetworkInsightsModal` (373 -> 152 satır):**
  - `NetworkMetricsTab`: Genel yoğunluk ve kilit aktör listesi.
  - `NetworkPathfinderTab`: BFS en kısa yol arama formu ve rota görünümü.
- **`GraphCanvas` (480 -> 193 satır):**
  - `edgeRouting.ts`: Matematiksel yön ve slot dağıtım algoritması.
  - `useGraphElements.ts`: Düğüm ve kenar React Flow memo kancaları (`useCanvasNodes`, `useCanvasEdges`).
  - `GraphEmptyState.tsx`: Boş harita, boş düğüm ve aktif rota rozeti.
- **`App.tsx` (444 -> 145 satır):**
  - `AppHeader`: Yüzen ada navigasyonu.
  - `AppOptionsMenu`: Araçlar ve modallar açılır menüsü.
  - `AppModals`: Diyalog pencereleri montajı.
  - `AppAlertToasts`: Hata ve otomatik düzenleme bildirimleri.
  - `useAppModalsState`, `useSidebarState`, `useAutoLayoutAction`: Özel mantık kancaları.

---

## 🧪 Doğrulama ve Sonuçlar (Consequences)

- **`arch_audit.py` Fitness Kapısı:**
  - `server/`: 47 dosya, **0 ihlal (PASS)**
  - `client/`: 52 dosya, **0 ihlal (PASS)**
- **TypeScript Derleme:** `tsc -b` sıfır hata.
- **Lint:** ESLint `react-refresh/only-export-components` uyumuyla sıfır hata, sıfır uyarı.
- **Testler:** Backend Vitest 143 testin 143'ü de başarılı.
