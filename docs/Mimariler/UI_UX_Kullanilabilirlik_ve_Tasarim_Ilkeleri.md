# 🎨 UI/UX Kullanılabilirlik, Bilişsel İlkeler ve Zanaat Standartları

> Bu doküman; **NetWork** projesinde geliştirilen her bileşenin, modalın, tuval etkileşiminin ve panelin uymak zorunda olduğu evrensel insan-bilgisayar etkileşimi (HCI) ve kullanılabilirlik standartlarını tanımlar.
> 
> Üst Harita: [[00 - Ana Harita]] | İlgili: [[Frontend UI UX Overhaul and Design Tokens]]

---

## 🏛️ Temel Kuramsal Çerçeveler

### 1. Don Norman'ın 7 Tasarım İlkesi (*The Design of Everyday Things*)
1. **Keşfedilebilirlik (Discoverability):** Kullanıcı sistemle karşılaştığında hangi eylemlerin mümkün olduğunu arayüzden kolayca çıkarabilmelidir (örn: `Cmd+K` arama paleti, görünür kısayol rehberi).
2. **Geri Bildirim (Feedback):** Her eylem anında (100ms içinde) açık ve net bir görsel tepki üretmelidir (spinner, iyimser UI güncellemesi, animasyon).
3. **Kavramsal Model (Conceptual Model):** Sistemin çalışma mantığı kullanıcının kafasındaki gerçek dünya zihinsel modeliyle örtüşmelidir.
4. **Sunabilirlik (Affordance):** Bir nesnenin aktörle olan fiziksel/dijital etkileşim kapasitesidir.
5. **İşaretleyiciler (Signifiers):** Affordance'ın nerede olduğunu gösteren algılanabilir ipuçlarıdır (gölgeler, sürükleme tutamaçları, hover efektleri).
6. **Doğal Eşleme (Natural Mapping):** Kontroller ile sonuçları arasındaki yön ve mekan ilişkisidir (sağ/yukarı=artış, sol/aşağı=azalış).
7. **Kısıtlamalar (Constraints):** Kullanıcının hata yapmasını baştan engelleyen kısıtlardır (input maskeleri, disabled durumlar).

---

### 2. Jakob Nielsen'in 10 Sezgisel İlkesi (NN/g Heuristics)
1. **Sistem Durumunun Görünürlüğü:** Sistem ne yaptığını kullanıcıya her zaman bildirmelidir.
2. **Sistem ile Gerçek Dünya Uyumu:** Kullanıcının doğal diline ve terimlerine sadık kalınmalıdır.
3. **Kullanıcı Kontrolü ve Özgürlüğü (Acil Çıkış):** Yanlış bir eylemde `Esc`, "İptal" veya "Geri Al" (Undo) imkanı sunulmalıdır.
4. **Tutarlılık ve Standartlar:** Aynı işlem her yerde aynı sözcük, renk ve düzende yer almalıdır.
5. **Hata Önleme (Error Prevention):** Yıkıcı işlemler öncesinde çift aşamalı onay barı sunularak kazara veri kayıpları engellenmelidir.
6. **Tanımak Yerine Hatırlamak (Recognition):** Kullanıcı bir önceki ekrandan bilgi ezberlemek zorunda bırakılmamalıdır.
7. **Kullanım Esnekliği ve Hızlandırıcılar:** Hem acemiler için görünür butonlar, hem uzmanlar için klavye kısayolları sağlanmalıdır.
8. **Estetik ve Minimal Tasarım:** Görevle ilgisi olmayan görsel süslemeler ve çiftleyen butonlar (örn: çift "Vazgeç") arındırılmalıdır.
9. **Hataları Tanıma ve Çözme:** Hata mesajları yapıcı, sade dille ve çözüm adımlarıyla sunulmalıdır.
10. **Yardım ve Dokümantasyon:** İhtiyaç anında bağlamsal ipuçları (tooltip'ler) ve kılavuzlar erişilebilir olmalıdır.

---

### 3. George Miller Yasası (7 ± 2 ve Bilişsel Öbekleme)
- İnsan kısa süreli belleği sınırlıdır.
- **Menü Miti:** Ekranda duran öğeler taranır, ezberlenmez; menüleri suni olarak 7 ile kısıtlamak yanlıştır.
- **Asıl Prensip (Chunking):** Form alanlarının, telefon numaralarının, kimliklerin ve veri kartlarının anlamlı bloklar halinde gruplanmasıdır.

---

### 4. Peter Morville'in UX Peteği (7 Boyut)
- **Useful (Yararlı):** Gerçek bir probleme çözüm sunar.
- **Usable (Kullanılabilir):** Çözüm zahmetsiz ve hatasızdır.
- **Desirable (Arzulanabilir):** Taktil zanaat, estetik ve duygusal çekicilik taşır.
- **Findable (Bulunabilir):** Arama ve navigasyonla saniyeler içinde ulaşılır.
- **Accessible (Erişilebilir):** WCAG kontrast standartlarına ve klavye erişimine uygundur.
- **Credible (Güvenilir):** Şeffaftır, karanlık desenler (dark patterns) barındırmaz.
- **Valuable (Değerli):** Hem kullanıcıya hem ürüne kalıcı katma değer üretir.

---

## 🛡️ NetWork Projesindeki Somut Uygulamalar

1. **Tuval Üzerinde Düğüm Silme (`CustomNode.tsx`):**
   - Çöp kutusuna basıldığında doğrudan silme **yapılmaz**.
   - Kartın köşesinde anında `[Sil?] [✓] [✕]` onay hapı açılır. Kazara tıklamalarda veri kaybı sıfırlanır.
2. **Çekmece Alt Barı (`DrawerFooter.tsx`):**
   - Çift "Vazgeç" hatası giderilmiştir.
   - Normal modda: `[Düğümü Sil]` ve `[Kapat] [Değişiklikleri Kaydet]`.
   - Onay modunda: Tüm bar kırmızı uyarı alanına dönüşür: *"Düğüm ve tüm bağlantıları silinecek."* `[İptal]` ve `[Evet, Sil]`.
3. **Kenar Çubuğu Harita Silme (`SidebarPanel.tsx`):**
   - Harita kartında inline iki aşamalı `[Sil] [✕]` koruması bulunur.

---
*İlgili Dokümanlar:* [[00 - Ana Harita]] | [[Gunluk]] | [[Frontend UI UX Overhaul and Design Tokens]]
