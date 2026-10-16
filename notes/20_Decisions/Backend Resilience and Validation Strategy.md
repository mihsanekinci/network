# ADR 0004: Backend Sağlamlaştırma, Doğrulama ve Hata Yönetimi Stratejisi

**Tarih:** 2026-10-16  
**Durum:** Kabul Edildi  
**Kapsam:** Backend Mimarisi / API Güvenliği / Veritabanı Bütünlüğü  

---

## 1. Bağlam ve Problem (Context)
NetWork platformunun ön yüzü (React Flow tuvali) hızla gelişirken, arka uç (Express + Prisma) katmanında şu eksiklikler tespit edilmiştir:
- TypeScript tipleri yalnızca derleme anında mevcuttur; istemciden gelen HTTP istek gövdeleri çalışma zamanında doğrulanmamaktadır.
- Controller katmanında her fonksiyonda yinelenen `try/catch` blokları bulunmakta ve hatalar tutarsız HTTP durum kodlarıyla döndürülmektedir.
- Büyük graflarda (yüzlerce düğüm/kenar) ilişkisel tablolarda indeksleme eksikliği nedeniyle sorgular table scan yapmaktadır.
- Çok adımlı içe aktarma işlemlerinde bir kenar veya düğüm başarısız olduğunda yarım kalma (veri bütünlüğü bozulması) riski mevcuttur.

---

## 2. Alınan Kararlar (Decisions)

1. **Zod ile Katı Çalışma Zamanı Doğrulaması:**
   - Tüm POST/PUT/PATCH rotalarının önüne `validate` middleware'i konulmuş, geçersiz şemalar controller'a ulaşmadan 400 Bad Request ile kesilmiştir.
2. **Merkezi Hata Yönetimi ve `asyncHandler` Deseni:**
   - OOP temelli `AppError` hiyerarşisi (`NotFoundError`, `ValidationError`, `ConflictError`, `DatabaseError`) kurulmuştur.
   - Controller metotları `asyncHandler` ile sarmalanarak tüm hatalar global Express `errorHandler`'a yönlendirilmiştir.
3. **Prisma Bileşik İndeksleme:**
   - Düğüm ve kenar tablolarında `haritaId`, `etiket` ve `kaynakId, hedefId` alanlarına SQLite indeksleri (`@@index`) tanımlanmıştır.
4. **ACID Transaction Garantisi:**
   - Harita içe aktarma ve toplu konum güncellemeleri `prisma.$transaction` içine alınarak herhangi bir adımda hata oluştuğunda otomatik rollback sağlanmıştır.

---

## 3. Reddedilen Alternatifler (Alternatives Considered)
- **Alternatif 1: Joi veya Yup:** Zod'un TypeScript ile sıfır konfigürasyonlu çift yönlü tip türetme (`z.infer`) yeteneği nedeniyle Zod tercih edildi.
- **Alternatif 2: Controller İçi Manuel Validasyon:** Kod tekrarına yol açtığı ve SOLID Single Responsibility ilkesini ihlal ettiği için reddedildi; doğrulama middleware katmanına soyutlandı.

---

## 4. Sonuçlar ve Kazanımlar (Consequences & Trade-offs)
- **Güvenilirlik:** Hatalı veya kötü niyetli payload'lar servislere sızamaz.
- **Test Edilebilirlik:** Test kapsamı 33'ten **143 birim ve entegrasyon testine** yükseltildi.
- **Performans:** İndeksler sayesinde graf büyüdükçe sorgu hızı logaritmik seviyede korundu.

---
*İlgili Notlar:* [[00_Index]] | [[2026-10-16 - Backend Hardening and Modular Architecture]] | [[Katmanli Mimari]]
