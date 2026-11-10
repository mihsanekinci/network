---
title: "Dark Mode and Layout Flicker Prevention"
created: "2026-11-10"
type: session
tags:
  - session-log
  - frontend
  - dark-mode
  - ui-engineering
  - performance
  - cls
---

# 🚀 Oturum Günlüğü: 2026-11-10 - Karanlık Mod & Akıllı Otomatik Düzenleme Titreme Önleyici (Faz 23)

## 🎯 Oturumun Amacı
1. Üst menüdeki "Düzenle" (Dagre Auto-Layout) butonuna basıldığında oluşan mikro titreme, butonun gereksiz sönüp yanması ve düzenlenecek bir fark olmamasına rağmen tetiklenen yenilenme hissinin (UI mühendisliği adlarıyla: *Cumulative Layout Shift*, *Visual Flicker*, *Dirty-State Tracking Eksikliği*) kök nedenini çözmek.
2. Yol haritasındaki Faz 23 kapsamında sistem genelinde kalıcı **Karanlık Mod (Dark Mode)** altyapısını kurmak ve tüm tuval, paneller, modallar ve bağlantı kenarlarıyla kusursuz entegre etmek.

---

## 🔬 UI Mühendisliğindeki Kavramlar ve Kök Neden Analizi

Kullanıcının deneyimlediği durum literatürde şu dört temel UI/UX mühendisliği konseptiyle tanımlanır:

1. **Cumulative Layout Shift (CLS) & Content Thrashing (Düzen Kayması):**
   - Buton içindeki metin *"Düzenle"* halindeyken tıklamayla *"Düzenleniyor..."* haline geçiyordu. Bu ek karakterler buton genişliğini ~30px genişletiyor, yanındaki seçenekler menüsü ve arama çubuğunu milisaniyelik sağa sola iterek gözde "ekran yenilendi" hissi yaratıyordu.
2. **Missing Dirty-State Tracking (Kirli/Temiz Durum Sezgisi Eksikliği):**
   - Tuvaldeki düğümler zaten Dagre hiyerarşisine uygun dizilmiş olsa bile buton aktif görünmeye devam ediyordu. Butona tıklandığında konum farkı olup olmadığı kontrol edilmeden sunucuya asenkron istek atılıyor ve 100ms süren spinner belirip kayboluyordu.
3. **Layout Shift & Visual Flicker (Mikro Titreme):**
   - `Wand2` ikonu ile dönen `Loader2` spinner'ı arasındaki anlık ikon takası, genişlik ve yükseklik farkı yaratarak 60fps render akışında mikro titreşime neden oluyordu.
4. **Redundant Re-render Thrashing (Gereksiz Render Karmaşası):**
   - Sunucudan dönen koordinatlar mevcut koordinatlarla aynı olsa bile yeni nesne referansları atanıyor, bu durum React Flow'un dahili düğüm ağacını baştan monte etmesine yol açıyordu.

---

## 🛠️ Gerçekleştirilen Mühendislik Adımları

### 1. Akıllı Titreme Önleyici & Dirty-Check Algoritması
- `useAutoLayoutAction.ts`: Düğümlerin mevcut koordinatları ile Dagre algoritmasının hesapladığı yeni koordinatlar arasındaki mesafe farkını (`Math.hypot(dx, dy) >= 1`) ölçen `konumlarFarkliMi()` kontrolü yazıldı.
- Eğer düğümler zaten hizalanmışsa sunucu çağrısı ve yükleme spinner'ı atlanarak doğrudan bilgilendirici taktil bildirim (`otomatikDuzenlemeTekrarTiklandi`) tetiklendi.
- `dugumSlice.ts`: Toplu konum güncellemesinde koordinatı değişmeyen düğümlerin nesne referansları (`d === mevcut`) korunarak React Flow memo thrashing'i ortadan kaldırıldı.
- `AppHeader.tsx`: Düzenleme butonuna `min-w-11` sabit metin konteyneri atanarak durum geçişlerindeki genişlik sıçraması (CLS) sıfırlandı.

### 2. Kalıcı Karanlık Mod Mimarisi (`uiSlice.ts` & `index.css`)
- Tailwind CSS v4 sınıf tabanlı karanlık mod standardı için `index.css` dosyasına `@custom-variant dark (&:where(.dark, .dark *));` bildirimi eklendi.
- `uiSlice.ts` içine `karanlikMod: boolean` ve `karanlikModDegistir: () => void` yerleştirildi; `localStorage` (`network_tema`) ve `document.documentElement` (`.dark`) ile store başlatılır başlatılmaz çift yönlü reaktif senkronizasyon kuruldu.
- `useDarkMode()` özel kancası oluşturularak bileşenlerin store'a doğrudan ve zahmetsizce bağlanması sağlandı.

### 3. Tuval ve Bileşen Koyu Tema İyileştirmeleri
- **Grafik Tuvali (`GraphCanvas.tsx`):** Arka plan noktaları (`#334155`), MiniMap maskesi (`rgba(15, 23, 42, 0.75)`), MiniMap kenarlığı ve kontrolleri koyu moda uyarlandı.
- **Bağlantı Kenarları (`useGraphElements.ts`):** Koyu modda kenar etiket arka planı `#1e293b` (slate-800), kenarlığı `#475569` ve metin rengi `#e2e8f0` yapılarak parlama (glare) önlendi.
- **Yüzen Paneller & Modallar:** `SidebarPanel`, `AppHeader`, `SearchFilterBar`, `NodeModal`, `EdgeModal`, `MapModal`, `NetworkInsightsModal`, `ImportExportModal`, `ShortcutsModal` ve `NodeDetailDrawer` (alt bileşenleriyle birlikte) tam koyu tema standartlarına kavuşturuldu.

---

## 🧪 4'lü Deterministik Doğrulama Kapısı

1. **Mimari Fitness (`arch_audit.py`):**
   - Frontend: `PASS | Taranan Dosya: 53 | İhlal: 0` (SRP, dosya satır sayısı <= 300, fonksiyon satır sayısı <= 40 korundu).
2. **Derleme & Tip Denetimi (`tsc -b && vite build`):**
   - TypeScript ve Vite derlemesi 0 hata ile tamamlandı.
3. **Statik Analiz (`eslint .`):**
   - ESLint kuralları 0 hata ve 0 uyarı ile geçti.
4. **Birim & Entegrasyon Testleri (`vitest run`):**
   - 18 test süiti, 143/143 test %100 başarıyla geçti.
