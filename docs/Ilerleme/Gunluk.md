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

### Faz 16: Navbar & Header Rafinasyonu (Kompakt SaaS Boyutları) (14 Ekim 2026)
- **Geliştirme:** Kullanıcı geri bildirimi doğrultusunda üst çubuktaki (Header / Navbar) öğelerin aşırı büyük, orantısız olması ve ekran daraldığında arama çubuğunun sayaç rozetlerini ezmesi ve "+ Düğüm Ekle" butonunun arkasında kalması çözüldü.
  - `SearchFilterBar.tsx`: Arama input'u hantal `w-64` yerine `w-44 focus:w-56 h-8.5 pl-8 pr-7 text-xs rounded-lg` Linear/Notion tarzı dinamik genişleyen mikro çubuğa dönüştürüldü. Tür hap filtreleri (`Hepsi`, `Kişi`, `Kurum`, `Kavram`, `Diğer`) ve sayaç çipi kompakt boyutlara (`text-[11px]`) çekildi.
  - `App.tsx` Header: `h-14 px-5` ile kompaktlaştırıldı, harita başlığı `truncate max-w-48` ile taşma korumasına alındı, sayaç rozetleri `px-2 py-0.5 text-[11px]` boyutuna küçültüldü. `+ Düğüm Ekle` butonu `h-8.5 px-3.5 text-xs` ile hizalandı ve `shrink-0` ile ezilme riski tamamen ortadan kaldırıldı.

### Faz 17: Kenar / Bağlantı İlişki Türleri ve Etiketleme (Yol Haritası Adım 3) (14 Ekim 2026)
- **Geliştirme:** İki düğüm birbirine bağlandığında veya mevcut bir bağlantı çizgisine tıklandığında ilişki türü belirleme, etiketleme ve çizgi üzerinde şık rozet gösterme özelliği uçtan uca hayata geçirildi.
  - **Backend Katmanı:**
    - `kenarRepository.ts`: `idIleGetir` ve `guncelle` metotları Prisma seviyesinde yazıldı.
    - `kenarServisi.ts`: `KenarServisi.guncelle(id, veri)` metodu eklendi; varlık denetimi ve yön doğrulaması (`tek_yonlu`, `cift_yonlu`, `yonsuz`) yapıldı.
    - `kenarController.ts` & `kenarRoutes.ts`: `PATCH` ve `PUT /api/haritalar/:haritaId/kenarlar/:id` rotaları bağlandı.
    - `kenarServisi.test.ts`: 3 yeni birim testi yazılarak backend test havuzu 29/29'a çıkarıldı (%100 başarı).
  - **Frontend Katmanı:**
    - `kenarServisi.ts`: `kenarGuncelle` API istemci çağrısı eklendi.
    - `haritaStore.ts`: `secilenKenarId`, `secilenKenariAyarla` ve `kenarGuncelle` eylemleri eklendi.
    - `EdgeModal.tsx`: Seçilen bağlantının Kaynak ➔ Hedef düğüm rozetlerini gösteren görsel kart, 10 popüler hızlı ilişki şablonu (*İş Arkadaşı, Referans, Mentör, Eski Çalışan, Proje Ortağı, Stajyer, Danışman, Yatırımcı, Müşteri, Bağlantılı*), serbest metin inputu, 3 yönlü yön seçimi (➔ Tek Yönlü, ↔ Çift Yönlü, — Yönsüz) ve güvenli silme butonundan oluşan modern SaaS modalı geliştirildi.
    - `GraphCanvas.tsx`: React Flow bağlantı çizgileri üzerine beyaz arka planlı, yuvarlatılmış şık rozet etiketleri (`labelBgRadius: 8`, `labelBgBorderRadius: 8`) ve yön durumuna göre ok işaretleri (`MarkerType.ArrowClosed`) yerleştirildi. Bağlantıya tıklandığında veya yeni bağlantı çizildiğinde modal otomatik açılacak şekilde bağlandı.
- **Doğrulama:** Backend 29/29 Vitest birim testi geçti; Client `tsc -b`, `vite build` ve `eslint .` sıfır hata ve sıfır uyarı ile doğrulandı.

### Faz 18: İleri Seviye SaaS Özellikleri & Ağ Analitiği (16 Ekim 2026)
- **Geliştirme:** Kullanıcı geri bildirimi ve yol haritası doğrultusunda 5 kritik özellik uçtan uca hayata geçirildi:
  1. **Dışa / İçe Aktarma (Export & Import):** `html-to-image` ile retina kalitesinde tek tıkla PNG graf indirme; `HaritaPaketiDTO` standardında JSON tam yedekleme ve `POST /api/haritalar/ice-aktar` ucu üzerinden transaction ile içe aktarma.
  2. **Otomatik Hizalama (Dagre Auto-Layout):** `@dagrejs/dagre` motoru ile hiyerarşik (Top-to-Bottom) tek tıkla (`⌘D`) otomatik düzenleme; `PATCH /api/haritalar/:haritaId/dugumler/toplu-konum` ile veritabanına toplu kayıt.
  3. **Ağ Analitiği & İlişki Rotası (Network Insights & BFS Pathfinder):** `hesaplaAgMetrikleri` ile ağ yoğunluğu, tür dağılımı ve ilk 5 kilit aktör tespiti. İki düğüm arasındaki en kısa yolu (BFS) bulup tuvalde altın/amber neon efektiyle parlatma (`ring-amber-400`, `stroke-amber-500`).
  4. **Profil Fotoğrafları & Avatarlar:** `fotograf` / `avatarUrl` desteği, kişi düğümleri için baş harflerden degrade renkli avatar çemberi, formlara URL giriş alanı.
  5. **Klavye Kısayolları (Power-User):** `useKeyboardShortcuts` ile `⌘K` (Kısayollar Kılavuzu), `⌘N` (Yeni Düğüm), `⌘F` (Arama), `⌘D` (Otomatik Düzenle), `Delete` (Seçiliyi Sil) ve `Escape`.
- **Doğrulama:** Backend 33/33 Vitest testleri (%100 başarı); Client `tsc -b`, `vite build` ve `eslint .` sıfır hata ve sıfır uyarı ile doğrulandı.
- **Obsidian Brain:** `notes/` altında tam bir İkinci Beyin yapısı (`notes/00_Index.md`, ADR'lar, konseptler, sorun çözümü ve oturum günlüğü) kuruldu.

### Faz 19: Özel Şablonlar, Çok Yönlü & Dağıtık Bağlantılar, Açılır Sidebar ve Kompakt Navbar (16 Ekim 2026)
- **Geliştirme:** Kullanıcı talepleri doğrultusunda tuval ve arayüz ergonomisi üst seviyeye taşındı:
  1. **Özel Hızlı İlişki Şablonları (`EdgeModal.tsx`):**
     - `localStorage` üzerinde kalıcı kullanıcı tanımlı ilişki şablonu altyapısı kuruldu (`network_ozel_iliski_sablonlari`).
     - Modal içerisinde dinamik "+ Yeni Şablon Ekle" formu ve serbest metin girildiğinde tek tıkla şablon listesine kaydetme yeteneği (`+ "${etiket}" şablonlara ekle`) sağlandı.
     - Özel şablonları silme (`✕`), toggle seçim davranışı ve input açıkken ESC ile iptal etme güvenliği eklendi.
  2. **4 Yönden Bağlantı & Çoklu Ok Dağıtımı (`CustomNode.tsx` & `GraphCanvas.tsx`):**
     - Düğümlerin tüm kenarlarından (Üst, Sağ, Alt, Sol) hem kaynak hem hedef bağlantı alabilmesi için her kenara 5'er slotlu (%15, %32, %50, %68, %85) toplam 20 bağlantı noktası yerleştirildi.
     - React Flow `ConnectionMode.Loose` ile serbest yön bağımsız bağlantı kurulması sağlandı.
     - `GraphCanvas.tsx`'te bağıl konum vektörüne göre optimum yön seçimi (`yonBelirle`), kendine bağlanan düğümler için sağ-üst köşe kavisli yönlendirme ve bir yüzeye bağlanan tüm uçları (kaynak + hedef) ortak fiziksel alanda karşı konuma göre sıralayarak sıfır çakışma ve sıfır çizgi kesişmesi sağlayan dinamik slot dağıtım algoritması (`slotBelirle`) kurgulandı.
  3. **Açılır-Kapanır Sol Panel (`SidebarPanel.tsx` & `App.tsx`):**
     - Sidebar collapsible hale getirildi, durumu `localStorage`'da saklandı. Animasyon sırasında metin kaymasını önleyen sabit iç kapsayıcı kurgulandı.
     - Navbar'da ve sidebar başlığında açma/kapama butonları ile `⌘B` (Ctrl+B) klavye kısayolu entegre edildi. Metin giriş alanlarındayken kısayolların yanlışlıkla tetiklenmesi engellendi.
  4. **Kompakt Navbar, Dikey Bilgi Hiyerarşisi & Seçenekler Menüsü (`SearchFilterBar.tsx` & `App.tsx`):**
     - Harita başlığı ve sayaçları dikey micro-stack düzenine kavuşturularak başlık altına alındı.
     - Arama ve filtreleme çubuğu, tür bazlı kompakt açılır menü (dropdown popover), tek tıkla filtre sıfırlama (✕), ESC ile menü kapatma ve dinamik kategori sayaçları ile sadeleştirildi.
     - Analiz, Otomatik Düzenle (`⌘D`), Dışa/İçe Aktar ve Klavye Kısayolları (`⌘K`) aksiyonları modern bir "Seçenekler ▾" (⚙️) menüsü altında toplanarak menülerin üst üste binmesi kökten engellendi.
- **Doğrulama:** Backend 33/33 Vitest birim testi (%100 başarı); Client `npm run build` (`tsc -b && vite build`) ve `npm run lint` (`eslint .`) 0 hata, 0 uyarı ile doğrulandı.


### Faz 20: Backend Hardening (Zod, AppError, Prisma Indexes & ACID Transactions, 143 E2E Tests)
- **Tarih:** 16 Ekim 2026
- **Geliştirici:** Lead Architect & Specialized Subagents (BackendSchemaValidator, BackendErrorHandler, DatabaseArchitect, BackendQAEngineer)
- **Yapılanlar:**
  1. **Zod ile Çalışma Zamanı Şema Doğrulaması (`server/src/schemas/` & `validate.ts`):**
     - Tüm `POST`, `PUT`, `PATCH` uç noktaları için Zod şemaları (`haritaSchema.ts`, `dugumSchema.ts`, `kenarSchema.ts`) oluşturuldu.
     - `dogrulaGovde` ve `dogrulaParametre` Express middleware'leri ile geçersiz veri girişlerinde standart 400 Bad Request yanıtı dönmesi sağlandı.
  2. **Merkezi Hata Hiyerarşisi (`server/src/errors/` & `errorHandler.ts`):**
     - `AppError` tabanlı nesne yönelimli hata sınıfları (`NotFoundError`, `ValidationError`, `ConflictError`, `DatabaseError`) inşa edildi.
     - `asyncHandler` wrapper'ı ile controller'lardaki tekrar eden try/catch blokları temizlendi.
     - Global `errorHandler` Express middleware'i ile kontrollü hata yanıtları ve 500 fallback güvenliği sağlandı.
  3. **Veritabanı İndeksleme & ACID Transaction Güvenliği (`schema.prisma` & Repositories):**
     - SQLite performansını güvenceye almak için `Dugum` ve `Kenar` tablolarına bileşik indeksler eklendi (`haritaId`, `haritaId + etiket`, `kaynakId + hedefId`).
     - `iceAktar` ve `topluKonumGuncelle` operasyonları `prisma.$transaction` içine alınarak atomik hale getirildi; ID mapping garantisi sağlandı.
  4. **Uçtan Uca API Entegrasyon Testleri (`server/src/__tests__/api/`):**
     - Dinamik port tahsis eden sıfır bağımlılıklı `testIstemcisi.ts` test altyapısı kuruldu.
     - Sağlık, Harita (13 test), Düğüm (11 test) ve Kenar (10 test) API test süitleri ile toplam 143 testin tamamı %100 başarıyla geçti.

---

## 🎯 Tamamlanan Yol Haritası (Roadmap)

- [x] **1. Backend Controllers & Rotalar (Faz 6)**
- [x] **2. Backend Servis Birim Testleri - Vitest (Faz 11, Faz 17, Faz 18)**
- [x] **3. Frontend State & Servis Entegrasyonu - Zustand (Faz 7, Faz 18)**
- [x] **4. React Flow Canvas Motoru (Faz 8, Faz 18)**
- [x] **5. Düğüm Detay & Düzenleme Paneli - Drawer (Faz 12, Faz 18)**
- [x] **6. Canlı Arama, Filtreleme & Sayaçlar (Faz 13, Faz 16)**
- [x] **7. Figma/Miro Standardında Kapsamlı UI/UX Modernizasyonu (Faz 14, Faz 15, Faz 16)**
- [x] **8. Kenar (Bağlantı) İlişki Türleri, Etiketleme & EdgeModal (Faz 17)**
- [x] **9. PNG/JSON Dışa & İçe Aktarma (Faz 18)**
- [x] **10. Dagre Otomatik Graf Düzenleme (Faz 18)**
- [x] **11. Ağ Analitiği & BFS En Kısa Yol Bulucu (Faz 18)**
- [x] **12. Avatarlar ve Klavye Kısayolları (Faz 18)**
- [x] **13. Obsidian Brain Protokolü Entegrasyonu (Faz 18)**
- [x] **14. Backend Hardening: Zod, AppError, ACID Transactions & 143 E2E Tests (Faz 20)**
- [x] **15. Frontend UI/UX Craftsmanship: Design Tokens, Lucide Icons & Floating Glass Islands (Faz 21)**

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

### ADR-004: Backend Dayanıklılık, Şema Doğrulama ve ACID İşlem Mimarisi
- **Durum:** Kabul edildi.
- **Gerekçe:** Runtime veri bütünlüğü Zod şemaları ile garantiye alındı, hata yönetimi OOP tabanlı AppError hiyerarşisi ile standartlaştırıldı, SQLite indeksleri ile sorgu performansı artırıldı ve içe aktarma gibi çok adımlı işlemler prisma.$transaction ile atomik hale getirildi.
- **İlgili:** [[Backend Resilience and Validation Strategy]] | [[2026-10-16 - Backend Hardening and Modular Architecture]]

### ADR-005: Frontend UI/UX Craftsmanship ve Tasarım Tokenları Dönüşümü
- **Durum:** Kabul edildi.
- **Gerekçe:** NetWork platformunun 'AI slop' arayüzünden arındırılarak Linear, Raycast ve Figma kalitesinde taktil bir grafik çalışma alanına dönüştürülmesi amacıyla merkezi `designTokens.ts`, yeknesak `lucide-react` ikonografi motoru, yüzen cam adacıklar (floating glass islands) ve taktil kart mimarisi benimsendi.
- **İlgili:** [[Frontend UI UX Overhaul and Design Tokens]] | [[2026-10-18 - Frontend UI UX Overhaul and Tactile Craft]]

---
*İlgili Notlar:* [[00 - Ana Harita]] | [[Katmanli Mimari]] | [[Prisma ve SQLite]] | [[Rotalar ve Controllers]] | [[Zustand ve Servisler]] | [[React Flow Canvas]] | [[Backend Resilience and Validation Strategy]] | [[Frontend UI UX Overhaul and Design Tokens]]
