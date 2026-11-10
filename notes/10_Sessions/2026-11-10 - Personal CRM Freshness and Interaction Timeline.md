---
title: "Personal CRM Freshness, Communication Tone, and Interaction Timeline"
created: "2026-11-10"
type: session
tags:
  - session-log
  - personal-crm
  - freshness
  - touchpoints
  - communication-tone
  - mcp-vision
---

# 🚀 Oturum Günlüğü: 2026-11-10 - Kişisel CRM, İlişki Tazeliği ve Etkileşim Zaman Çizelgesi (Faz 25 - NetWork MCP Temelleri)

## 🎯 Oturumun Kapsamı ve Çözülen Problemler

NetWork MCP vizyonunun ilk adımı olarak, sosyal ve profesyonel ağdaki aktörlerle olan bağların zaman içinde soğumasını (dormancy) önleyen, her temasın kaydını tutan ve AI ajanlarına bağlamsal üslup rehberliği sunan **Kişisel CRM (Personal CRM)** motoru tasarlandı ve uygulandı.

### 1. Veri Sözleşmesi ve Ortak Tipler (`shared/types/index.ts`)
- **İletişim Üslubu (`IletisimUslubu`):** `"resmi"` (Siz, kurumsal), `"yari_resmi"` (Siz, Bey/Hanım), `"samimi"` (Sen, dostça), `"akademik"` (Hocam), `"diger"`.
- **Etkileşim Türü (`EtkilesimTuru`):** `"toplanti"`, `"kahve_yemek"`, `"eposta"`, `"mesaj"`, `"arama"`, `"etkinlik"`, `"diger"`.
- **Etkileşim Kaydı (`EtkilesimKaydi`):** Benzersiz kimlik, tarih (YYYY-MM-DD), tür, özet ve notlar.
- **Tazelik Durumu (`TazelikBilgisi`):** `durum` ("taze", "ilgi_bekliyor", "uykuda", "belirsiz"), geçen gün, hedef aralık, kalan gün ve kullanıcı dostu Türkçe zaman etiketi ("Bugün", "Dün", "X gün önce", "X gündür uykuda").

### 2. İlişki Tazeliği & Algoritma Motoru (`relationshipFreshness.ts`)
- `hesaplaTazelik(ozellikler, referansTarih)`: Kişinin veya kurumun son temas tarihi ve hedef temas sıklığı (15, 30, 60, 90, 180, 365 gün) parametrelerine göre tazelik durumunu hesaplar.
- `enGuncelTemasTarihi(ozellikler)`: Doğrudan girilen `sonTemasTarihi` ile `etkilesimler` zaman çizelgesindeki kayıtları karşılaştırarak en güncel temas tarihini belirler.
- `yeniEtkilesimOlustur(...)`: Otomatik ID üretimi ve metin kırpma (trim) ile yeni touchpoint üretir.
- **Birim Testleri:** `server/src/utils/__tests__/relationshipFreshness.test.ts` altında 9 test yazılarak Vitest ile doğrulandı.

### 3. Modüler Drawer Bileşenleri (`client/src/components/panels/drawer/`)
- **`DrawerFreshnessTracker.tsx`:** Dinamik tazelik rozeti (🟢 Taze, 🟡 İlgi Bekliyor, 🔴 Uykuda, ⚪ Belirsiz), son temas tarihi seçici, hedef sıklık menüsü ve tek tıkla "Bugün Temas Kuruldu" aksiyonu.
- **`DrawerCommunicationTone.tsx`:** NetWork MCP için tercih edilen hitap şekli seçici ve yapay zeka ajanlarının e-posta/mesaj üretirken uyması gereken kuralları belirten özel talimat alanı.
- **`DrawerInteractionTimeline.tsx`:** Kronolojik touchpoint listesi, tür simgeleri, mini etkileşim ekleme formu ve silme desteği. Yeni etkileşim eklendiğinde `sonTemasTarihi` otomatik olarak senkronize edilir.

### 4. Tuval Üzerinde Canlı Görselleştirme (`CustomNode.tsx`)
- Kişi ve kurum düğümlerinde avatarın sağ alt köşesine renkli ve nabız atan durum noktası eklendi:
  - 🟢 Yeşil: Taze bağlantı
  - 🟡 Sarı (animate-pulse): İlgi bekliyor (hedef sıklık yaklaşıyor)
  - 🔴 Kırmızı: Uykuda (dormant)
  - Tooltip: Hover anında temas gününü ve durumunu gösterir.

### 5. Ağ Analitiği & Arama Entegrasyonu
- **`NetworkMetricsTab.tsx`:** Ağ Analiz Modalı'na harita genelindeki ilişki sağlığı dağılımı (Taze, İlgi Bekliyor, Uykuda, Belirsiz aktör sayıları) eklendi.
- **`SearchFilterBar.tsx` & `useGraphElements.ts`:** Arama filtresi düğüm adı, unvan ve şirketin yanında etkileşim özetleri, üslup türü ve özel ajan notlarını da tarayacak şekilde zenginleştirildi.

---

## 🧪 Doğrulama ve Test Sonuçları

- **Arch Audit:** `arch_audit.py` ile `client/src` (57 dosya) ve `server/src` (49 dosya) tarandı, **0 ihlal (PASS)**.
- **Vite Build:** `tsc -b && vite build` sıfır hata ve uyarı ile derlendi.
- **Vitest Unit & Integration:** 152/152 test başarıyla geçti (TypeScript tip denetimi `tsc --noEmit` dahil).
- **YAGNI & Modülerlik:** Şemayı zorlamadan `ozellikler` JSON sözleşmesiyle 100% geriye dönük uyumlu tutuldu; import/export mekanizması bozulmadı.

---
*İlgili Notlar:* [[00_Index]] | [[00 - Ana Harita]] | [[Gunluk]] | [[2026-11-10 - Clusters MiniMap and NetWork MCP Vision]]