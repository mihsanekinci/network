# 📈 İlerleme: Geliştirme Günlüğü & Yol Haritası

> Bu doküman, **NetWork** projesinin tamamlanan geliştirme adımlarını, aktif durumunu, mimari karar kayıtlarını (ADR) ve sıradaki hedeflerini kronolojik olarak takip eder.
> 
> Üst Not: [[00 - Ana Harita]]

---

## 📅 Kronolojik Geliştirme Günlüğü

### Faz 1: Temeller & Kılavuz (8 Mayıs)
- **Commit:** `2b6d478` — *feat: CLAUDE.md proje kılavuzu eklendi*
  - Projenin vizyonu belirlendi: Kişiler ve kavramlar arası ilişkileri görselleştiren genel amaçlı Node-Edge harita uygulaması.
  - SOLID prensipleri ve katman sırası kesin kurallarla tanımlandı (`[[Katmanli Mimari]]`).
  - Türkçe isimlendirme ve temiz kod standartları belirlendi.

### Faz 2: Proje İskeleti (8 Mayıs)
- **Commit:** `1f0eec3` — *feat: proje iskeleti oluşturuldu*
  - Monorepo benzeri yapı kuruldu: `client/`, `server/`, `shared/`.
  - Frontend: Vite + React 18 + TypeScript + Tailwind CSS yapılandırıldı.
  - Backend: Node.js + Express + TypeScript altyapısı hazırlandı.
  - Tip Tanımları: `shared/` ve `client/src/types/` altında paylaşımlı arayüzler tanımlandı.

### Faz 3: Veri Katmanı & Repository'ler (9 Mayıs)
- **Commit:** `6535a3f` — *feat: repository katmanı oluşturuldu*
  - Prisma ORM ve SQLite veritabanı kuruldu (`[[Prisma ve SQLite]]`).
  - `Harita`, `Dugum` ve `Kenar` modelleri oluşturuldu; migrasyon uygulandı.
  - `haritaRepository.ts`, `dugumRepository.ts`, `kenarRepository.ts` dosyaları yazıldı.

### Faz 4: İş Mantığı & Servis Katmanı (9 Mayıs)
- **Commit:** `dfd4a6d` — *feat: service katmanı oluşturuldu*
  - `haritaServisi.ts`, `dugumServisi.ts`, `kenarServisi.ts` yazıldı.
  - İş kuralları doğrulandı: boş etiket kontrolleri, kaynak/hedef düğüm harita eşleşmesi ve Türkçe hata fırlatma mekanizması eklendi.

### Faz 5: İkinci Beyin (Second Brain) Dokümantasyonu (8 Ekim 2026)
- `docs/` klasörü oluşturularak Obsidian uyumlu modüler bilgi grafı kurgulandı:
  - [[00 - Ana Harita]] (Merkezi MOC)
  - [[Katmanli Mimari]] (Mimari kurallar ve SOLID)
  - [[Prisma ve SQLite]] (Veritabanı ve veri modelleri)
  - [[Rotalar ve Controllers]] (API tasarımı ve uç noktalar)
  - [[Gunluk]] (İlerleme günlüğü ve yol haritası)

### Faz 6: Controller ve Rota Katmanları (8 Ekim 2026)
- **Geliştirme:** Harita, Düğüm ve Kenar için controller ve rotalar tamamlandı.
  - `server/src/controllers/` altında `haritaController.ts`, `dugumController.ts`, `kenarController.ts` yazıldı.
  - `server/src/routes/` altında `haritaRoutes.ts`, `dugumRoutes.ts`, `kenarRoutes.ts` Express rotaları oluşturuldu.
  - Rotalar `server/src/index.ts` sunucu giriş noktasına bağlandı (`/haritalar`, `/api/haritalar`, `/dugumler`, `/kenarlar`).
  - Uçtan uca `ApiYaniti<T>` sözleşmesi ve anlamlı Türkçe hata yönetimleri bağlandı.
  - `tsc --noEmit` ile TypeScript derleme doğrulaması yapıldı (0 hata).
  - [[Rotalar ve Controllers]] dokümantasyonu güncellendi.

### Faz 7: Frontend Entegrasyonu — API Servisleri & Zustand Store (8 Ekim 2026)
- **Geliştirme:** Client tarafındaki HTTP servisleri backend API uçlarına bağlandı ve Zustand store senkronizasyonu tamamlandı.
  - `client/src/services/` altındaki `haritaServisi.ts`, `dugumServisi.ts` ve `kenarServisi.ts` backend `/api/haritalar`, `/api/dugumler`, `/api/kenarlar` uçlarına yönlendirildi (`VITE_API_URL` desteği eklendi).
  - `client/src/services/index.ts` ile servis modülleri tek noktadan dışa aktarıldı.
  - `client/src/store/haritaStore.ts` içinde `useHaritaStore` asenkron CRUD ve paralel veri yükleme fonksiyonlarıyla (`haritalariYukle`, `haritaSec`, `dugumEkle`, `kenarEkle` vb.) donatıldı.
  - `tsc --noEmit` ile hem client hem server tarafında tip denetimi yapıldı (0 hata).
  - [[Zustand ve Servisler]] dokümantasyonu oluşturuldu, [[00 - Ana Harita]] güncellendi.

### Faz 8: React Flow Graf Canvas & Arayüz Panelleri (8 Ekim 2026)
- **Geliştirme:** NetWork'ün ana görsel arayüzü, React Flow graf motoru ve yönetim panelleri inşa edildi.
  - `GraphCanvas.tsx`: React Flow canvas motoru kuruldu. Düğümler (`nodes`), ok başlıklı animasyonlu bağlantı kenarları (`edges`), `MiniMap`, `Controls` ve `Background` (ızgara noktaları) entegre edildi.
  - `CustomNode.tsx`: 4 farklı düğüm türü (`kisi`, `kurum`, `kavram`, `diger`) için özelleştirilmiş renkli rozetler, silme aksiyonu ve 4 yönlü bağlantı noktaları (Handles) yazıldı.
  - Sürükle-bırak (`onNodeDragStop`) ile otomatik koordinat kaydetme ve düğüm bağlama (`onConnect`) ile dinamik kenar üretimi sağlandı.
  - `SidebarPanel.tsx`, `MapModal.tsx` ve `NodeModal.tsx` panelleri ile harita ve düğüm ekleme/silme akışları tamamlandı.
  - `App.tsx` modern responsive arayüz ve header sayaçları ile canlı hale getirildi.
  - `tsc --noEmit` ile hem frontend hem backend doğrulaması yapıldı (0 hata).
  - [[React Flow Canvas]] dokümantasyonu oluşturuldu, [[00 - Ana Harita]] güncellendi.

### Faz 9: Beyaz Ekran Düzeltmesi (8 Ekim 2026)
- **Sorun:** `http://localhost:5173` beyaz ekran veriyordu.
- **Neden:** `GraphCanvas.tsx` ve `CustomNode.tsx` içinde `reactflow` tipleri (`Node`, `Edge`, `Connection`, `NodeChange`, `NodeProps`) değer olarak içe aktarılmıştı; `verbatimModuleSyntax` nedeniyle `tsc` hata veriyor, tarayıcıda modül yüklenemiyordu.
- **Çözüm:** Tip içe aktarımları `type` anahtar sözcüğüyle düzeltildi.
- **Ek:** `services/istemci.ts` (`istekGonder`) eklendi; backend kapalıyken yakalanmamış promise reddi yerine Türkçe hata mesajı gösteriliyor.
- `tsc --noEmit` (client, `tsconfig.app.json`) 0 hata, `vite build` başarılı.
- [[React Flow Canvas]] ve [[Zustand ve Servisler]] notları güncellendi.

### Faz 10: Temizlik, Kök Dokümantasyon & Kurulum Şablonu (8-14 Ekim 2026)
- **Geliştirme:** Obsidian kişisel dosyalarının temizlenmesi, çevre değişkenleri şablonu ve kök README'nin oluşturulması.
  - `chore/obsidian-takipten-cikar` PR #2 ile `.obsidian/` kişisel ayarları ve eklenti dosyaları `.gitignore` kapsamına alındı, repo hafifletildi.
  - `README.md`: Projenin mimarisini, katman sırasını, teknolojilerini, API uçlarını ve iki terminalli çalıştırma adımlarını içeren kök kılavuz oluşturuldu.
  - `server/.env.example`: Backend için `DATABASE_URL` ve `PORT` tanımlarını içeren ortam değişkeni şablonu eklendi.
  - [[Calistirma Rehberi]] ve dokümantasyon haritası güncellendi.

### Faz 11: Backend Servis Birim Testleri & Vitest Altyapısı (14 Ekim 2026)
- **Geliştirme:** Backend servis katmanı için Vitest test kütüphanesi kuruldu ve izole birim testleri (unit tests) yazıldı.
  - Servis sınıfları (`HaritaServisi`, `DugumServisi`, `KenarServisi`) ve repo arayüzleri dışa aktarılarak Dependency Injection ile sahte repository (mock repo) desteği sağlandı.
  - `server/src/services/__tests__/` altında 3 test paketi oluşturuldu:
    - `haritaServisi.test.ts` (10 test): DTO dönüşümleri, boş başlık denetimi, varlık doğrulama ve CRUD akışları.
    - `dugumServisi.test.ts` (8 test): DTO ve JSON ozellikler ayrıştırma, mükerrer etiket kontrolü, boş etiket fırlatma, CRUD akışları.
    - `kenarServisi.test.ts` (8 test): Kaynak/hedef düğüm varlık ve harita eşleşmesi denetimi, mükerrer bağlantı engeli, CRUD akışları.
  - Toplam 26 testin tamamı başarıyla geçti (`npm test`).
  - TypeScript tip doğrulaması (`tsc --noEmit`) 0 hata ile korundu.

### Faz 12: Düğüm Detay & Düzenleme Paneli (14 Ekim 2026)
- **Geliştirme:** Düğümlerin üzerine tıklandığında sağdan açılan zengin detay ve düzenleme çekmecesi (`NodeDetailDrawer.tsx`) inşa edildi.
  - `haritaStore.ts` içine `secilenDugumId` ve `secilenDugumuAyarla` eklendi; harita değiştiğinde veya düğüm silindiğinde otomatik sıfırlama kurgulandı.
  - `NodeDetailDrawer.tsx`: Kişi, Kurum, Kavram ve Diğer türlerine özel dinamik alanlar (Unvan, Şirket, E-posta, LinkedIn, Telefon, Sektör, Web Sitesi, Lokasyon, Notlar) oluşturuldu.
  - Bağlantı istatistikleri (gelen/giden bağlantı sayısı ve bağlı düğüm isimleri) panelde görselleştirildi.
  - `CustomNode.tsx`: Kişi kartlarında unvan alt başlığı (`data.ozellikler.unvan`) gösterildi; seçili düğüm indigo vurgu halkasıyla belirginleştirildi.
  - `GraphCanvas.tsx`: Düğüme tıklama (`onNodeClick`) ve boşluğa tıklama (`onPaneClick`) ile paneli açma/kapama bağlandı.

### Faz 13: UI/UX Modernizasyonu & Canlı Arama-Filtreleme (14 Ekim 2026)
- **Geliştirme:** Tüm arayüz buton ve boşluklandırma standartları yenilendi, canlı arama ve tür filtreleme çubuğu (`SearchFilterBar.tsx`) eklendi.
  - `haritaStore.ts`: `aramaMetni` ve `secilenTurFiltresi` ('hepsi' | 'kisi' | 'kurum' | 'kavram' | 'diger') durumları eklendi.
  - `SearchFilterBar.tsx`: Header ortasına ferah arama çubuğu ve tür hap filtreleri (Pills) yerleştirildi; eşleşen düğüm sayacı bağlandı.
  - `SidebarPanel.tsx`: `w-80` genişlik, `p-4` ferah kenar boşlukları, `h-10` "+ Yeni Harita" butonu ve kart görünümünde harita listesi tasarlandı.
  - `App.tsx` Header: `h-16 px-6` ferahlatıldı, butonlar `h-10 px-4 rounded-xl` ve sayaçlar şık çiplere dönüştürüldü.
  - `CustomNode.tsx`: `min-w-52` genişlik, zarif bağlantı noktaları ve filtreye uymayan düğümlerde `opacity-30 grayscale` odaklama efekti sağlandı.
  - `NodeDetailDrawer.tsx`, `NodeModal.tsx`, `MapModal.tsx`: Sıkışık form alanları `h-10 text-sm rounded-xl` boyutlarına büyütüldü, alt eylem butonları kenarlardan ayrıldı.

### Faz 14: Kapsamlı SaaS UI/UX Dönüşümü (3 Paralel Alt Ajan Orkestrasyonu) (14 Ekim 2026)
- **Geliştirme:** Kullanıcı geri bildirimleri doğrultusunda arayüzdeki kenara yapışma, orantısız boşluklar, kaba handles ve yapışık alt butonlar mimari orkestrasyonla 3 uzman alt ajana paylaştırıldı ve baştan sona Figma/Miro SaaS standartlarına yükseltildi.
  - **Ajan 1 (Canvas & Düğüm Tasarım Uzmanı):**
    - `CustomNode.tsx`: Düğümlerin etrafındaki 4 kaba gri handle gizlendi, kart üzerine gelindiğinde (`group-hover`) yumuşak geçişle beliren indigo zarif noktalara (`10px !bg-indigo-500 !border-2 !border-white`) dönüştürüldü.
    - Kart yapısı `min-w-56 px-5 py-4 rounded-2xl` Figma kart kalitesine çıkarıldı; silme butonu sağ üstte sadece hover'da belirecek şekilde konumlandırıldı (`nodrag nopan` korundu).
    - `GraphCanvas.tsx`: MiniMap ve Controls bileşenleri `!rounded-2xl !shadow-md !border !border-slate-200 !overflow-hidden` floating panellere dönüştürüldü. Boş harita ve harita seçilmedi durumları modern cam/degrade kartlarla zenginleştirildi.
    - `index.css`: React Flow kontrol butonları için zarif hover ve ikon renk geçişleri eklendi.
  - **Ajan 2 (Detay Paneli & Form Tasarım Uzmanı):**
    - `NodeDetailDrawer.tsx`: Sağ alt köşeye ve ekranın en dibine yapışan footer problemi `pb-6` güvenli mesafe, `p-5 bg-slate-50/90 backdrop-blur` alt bar ve Sil (sol) / Vazgeç & Kaydet (sağ) hiyerarşisiyle çözüldü.
    - Form alanları mantıksal kart gruplarına ayrıldı: Düğüm türü seçimi şık 2 sütunlu interaktif kartlara dönüştürüldü; dinamik Kişi/Kurum alanları yan yana 2 sütunlu ızgaraya (`grid-cols-2`) yerleştirildi. Bağlantı özeti kartı zarif sayaç rozetleriyle tasarlandı.
    - `MapModal.tsx` & `NodeModal.tsx`: `rounded-2xl shadow-2xl p-6` ile ferahlatıldı, inputlar `h-11 px-4 text-sm rounded-xl` standardına yükseltildi.
  - **Ajan 3 (Navigasyon, Header & Arama Uzmanı):**
    - `SidebarPanel.tsx`: `w-80` bağımsız yüzen kart düzeni, "+ Yeni Harita Oluştur" için kenarlara yapışmayan ferah buton ve aktif harita için sol dikey indigo gösterge çizgisi (`w-[3px] bg-indigo-600`) uygulandı.
    - `SearchFilterBar.tsx`: Dar/mikro arama çubuğu ve hap filtreler (Pills) `text-xs font-semibold px-3.5 py-2` standartlarına büyütüldü; sayaç çipi şık odaklama halkasıyla donatıldı.
    - `App.tsx` Header: `h-16 px-6 bg-white/80 backdrop-blur-md` ile cam efekti, ferah rozet sayaçlar ve kenara yapışmayan `+ Düğüm Ekle` butonu tamamlandı.
  - **Doğrulama:** Backend 26/26 Vitest testleri, Client TypeScript derlemesi (`tsc -b`), Vite build ve ESLint sıfır hata ve sıfır uyarı ile doğrulandı.

### Faz 15: Padding & Margin Düzeltmeleri, Çakışma ve Üst Üste Binmelerin Giderilmesi (14 Ekim 2026)
- **Sorun:** Kullanıcı ekran görüntülerinde:
  1. Arama çubuğunda 🔍 büyüteç ikonu "Düğümlerde ara..." metninin üzerine biniyordu (`px-3.5`'in `pl-9`'u ezmesi).
  2. Sol panelde aktif harita kartındaki sol mavi belirteç çubuğu, metne sadece 6px (`pl-1.5`) verildiği için kart başlığının üzerine biniyordu.
  3. Düğüm detay çekmecesinde ve modallarda `* { margin: 0; padding: 0; }` sıfırlaması Tailwind v4'ün `:where()` dikey aralıklarını (`space-y-*`) ezdiğinden tüm form elemanları, etiketler ve inputlar birbirine yapışmıştı; ayrıca input içindeki metinler kenarlıkla sıfırlanmıştı.
- **Çözüm:**
  - `client/src/index.css`: Tailwind v4 preflight'ını bozan ve `:where()` kurallarını ezen `* { box-sizing: border-box; margin: 0; padding: 0; }` sıfırlaması kaldırıldı.
  - `SearchFilterBar.tsx`: Çelişkili `px-3.5` kaldırıldı, `pl-11` (44px) sol iç boşluk ile 🔍 ikonu (14px) ve arama metni arasında en az 16px net nefes alma alanı sağlandı.
  - `SidebarPanel.tsx`: Harita kartına ferah `p-4` iç boşluk, metin kapsayıcısına `pl-3` verildi; mavi belirteç çizgisi ile metin arasında en az 28px mesafe garanti altına alındı.
  - `NodeDetailDrawer.tsx`: Geçersiz `p-4.5` sınıfları kaldırılıp standart `p-5` kart dolgusu uygulandı. Kırılgan `space-y-*` sınıfları modern flex-gap (`flex flex-col gap-5` ve `gap-4`) düzenine geçirildi. Tüm inputlara `px-4 py-2.5 h-11 text-sm rounded-xl` verilerek metinlerin kenarlığa yapışması tamamen önlendi. Etiketler `gap-1.5` ile ayrıştırıldı.
  - `CustomNode.tsx`: Kart `min-w-56 p-4 rounded-2xl flex flex-col gap-2` yapısına kavuşturuldu; silme butonu sağ üstte `top-3 right-3` ile rozetten ayrıştırıldı.
  - `NodeModal.tsx` & `MapModal.tsx`: `p-6 flex flex-col gap-5` ve `h-11 px-4 py-2.5` input boyutlarıyla ferahlatıldı.
- **Doğrulama:** Backend 26/26 birim testi geçti; Client `tsc -b`, `vite build` ve `eslint .` sıfır hata ve sıfır uyarı ile doğrulandı.

---

## 🎯 Sıradaki Görevler (Roadmap & Backlog)

- [x] **1. Backend Controllers & Rotalar:**
  - `haritaController.ts`, `dugumController.ts`, `kenarController.ts` implementasyonu.
  - Express rotalarının oluşturulması ve `server/src/index.ts` içine bağlanması.
  - *(Bkz: [[Rotalar ve Controllers]])*
- [x] **2. Backend Testleri:**
  - Servis katmanı için Vitest birim testlerinin yazılması (`__tests__`).
  - Harita (10), Düğüm (8) ve Kenar (8) servisleri için toplam 26 birim testi yazıldı ve doğrulandı.
- [x] **3. Frontend State & Servis Entegrasyonu:**
  - `client/src/services/` servislerinin canlı backend API ile senkronize edilmesi.
  - `client/src/store/haritaStore.ts` Zustand store'unun servislerle tam bağlanması.
  - *(Bkz: [[Zustand ve Servisler]])*
- [x] **4. React Flow Canvas:**
  - `GraphCanvas` bileşeninin React Flow ile ayağa kaldırılması.
  - Düğümlerin harita üzerinde sürüklenip bırakılması ve yeni bağlantılar (kenarlar) çizilmesi.
  - *(Bkz: [[React Flow Canvas]])*
- [x] **5. Arayüz Panelleri:**
  - Düğüm detay ve ekleme paneli (`NodeModal.tsx`).
  - Harita yönetim ve kenar paneli (`SidebarPanel.tsx`, `MapModal.tsx`).
  - *(Bkz: [[React Flow Canvas]])*

---

## ⚖️ Mimari Karar Kayıtları (ADR)

### ADR-001: Katı Katmanlı Mimari (Strict Layered Architecture)
- **Durum:** Kabul edildi.
- **Gerekçe:** Proje büyüdükçe kontrolsüz veri erişimlerini engellemek ve birim test yazımını kolaylaştırmak için `UI → Route → Controller → Service → Repository → DB` akışının atlanamaz olması kararlaştırıldı.
- **İlgili:** [[Katmanli Mimari]]

### ADR-002: Dinamik Düğüm Nitelikleri İçin JSON Alanı
- **Durum:** Kabul edildi.
- **Gerekçe:** NetWork yalnızca staj takibi için değil, serbest zihin ve kavram haritaları için de kullanılacağından; her yeni düğüm türü için tablo şemasını değiştirmek yerine `ozellikler String (JSON)` yapısı tercih edildi.
- **İlgili:** [[Prisma ve SQLite]]

### ADR-003: SQLite ile Başlayıp PostgreSQL'e Hazır Olma
- **Durum:** Kabul edildi.
- **Gerekçe:** Geliştirme ortamında ek veritabanı kurulumlarına ihtiyaç duymadan hızlı başlamak için SQLite seçildi; Prisma ORM sayesinde canlı ortamda PostgreSQL'e geçiş tek satırlık sağlayıcı değişikliğiyle mümkün kılınacak.
- **İlgili:** [[Prisma ve SQLite]]

---
*İlgili Notlar:* [[00 - Ana Harita]] | [[Katmanli Mimari]] | [[Prisma ve SQLite]] | [[Rotalar ve Controllers]] | [[Zustand ve Servisler]] | [[React Flow Canvas]]
