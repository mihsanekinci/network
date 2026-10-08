# 🔌 API: Rotalar ve Controllers

> Bu doküman, **NetWork** backend API uç noktalarını (endpoints), Express rotalama yapısını, controller katmanı tasarımını ve HTTP sözleşmelerini tanımlar.
> 
> Üst Not: [[00 - Ana Harita]] | Mimari Temel: [[Katmanli Mimari]]

---

## 🎯 Katmanın Rolü ve Sorumluluğu

`[[Katmanli Mimari]]` gereğince Express Rotaları ve Controller katmanı yalnızca dış dünya ile sunucu arasındaki **iletişim kapısıdır**:

1. **Rotalar (`server/src/routes/`):** URL yollarını (`/haritalar`, `/dugumler`, `/kenarlar`) ve HTTP fiillerini (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) controller metodlarına bağlar.
2. **Controller'lar (`server/src/controllers/`):**
   - HTTP isteğinden parametreleri (`req.params`), sorguları (`req.query`) ve gövdeyi (`req.body`) çeker.
   - İlgili metodu `haritaServisi`, `dugumServisi` veya `kenarServisi` üzerinden çağırır.
   - Sonucu `ApiYaniti<T>` standart formatında uygun HTTP durum kodu (Status Code: 200, 201, 400, 404, 500) ile döner.
   - **Asla iş mantığı içermez ve veritabanı sorgusu yapmaz.**

---

## 📁 Dosya Yapısı

```
server/src/
├── controllers/
│   ├── haritaController.ts   # Harita istek/yanıt yönetimi
│   ├── dugumController.ts    # Düğüm istek/yanıt yönetimi
│   └── kenarController.ts    # Kenar istek/yanıt yönetimi
├── routes/
│   ├── haritaRoutes.ts       # Harita rotaları & alt rotalar
│   ├── dugumRoutes.ts        # Düğüm rotaları (mergeParams: true)
│   └── kenarRoutes.ts        # Kenar rotaları (mergeParams: true)
└── index.ts                  # Express sunucusu & rotaların kaydı
```

---

## 🚦 REST API Uç Noktaları

Tüm rotalar hem `/` hem de `/api/` önekleriyle erişilebilir durumdadır (`/haritalar` ve `/api/haritalar`).

### 1. Sistem ve Sağlık Kontrolü
| Metot | Uç Nokta | Açıklama | Durum |
| :--- | :--- | :--- | :--- |
| `GET` | `/saglik` | Sunucu canlılık kontrolü (`{ durum: "calisıyor" }`) | ✅ Aktif |

### 2. Harita Uç Noktaları (`/haritalar` & `/api/haritalar`)
| Metot | Uç Nokta | Gövde / Parametre | Yanıt Kodu | Açıklama | Durum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/haritalar` | - | 200 OK | Tüm haritaların listesi | ✅ Aktif |
| `GET` | `/haritalar/:id` | `id: string` | 200 OK / 404 | Harita detayı | ✅ Aktif |
| `POST` | `/haritalar` | `{ baslik: string, aciklama?: string }` | 201 Created | Yeni harita oluşturur | ✅ Aktif |
| `PUT` | `/haritalar/:id` | `{ baslik?: string, aciklama?: string }` | 200 OK / 404 | Haritayı günceller | ✅ Aktif |
| `DELETE`| `/haritalar/:id` | `id: string` | 200 OK / 404 | Haritayı ve bağlı grafı siler | ✅ Aktif |

### 3. Düğüm Uç Noktaları (`/haritalar/:haritaId/dugumler` & `/dugumler`)
| Metot | Uç Nokta | Gövde / Parametre | Yanıt Kodu | Açıklama | Durum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/haritalar/:haritaId/dugumler` | `haritaId: string` | 200 OK | Haritadaki düğümleri listeler | ✅ Aktif |
| `POST` | `/haritalar/:haritaId/dugumler` | `{ etiket, tur, pozisyonX, pozisyonY, ozellikler? }` | 201 Created | Haritaya yeni düğüm ekler | ✅ Aktif |
| `PATCH`| `/haritalar/:haritaId/dugumler/:id` | `{ etiket?, tur?, pozisyonX?, pozisyonY?, ozellikler? }` | 200 OK / 404 | Düğümü günceller | ✅ Aktif |
| `PUT`  | `/dugumler/:id` | `{ etiket?, tur?, pozisyonX?, pozisyonY?, ozellikler? }` | 200 OK / 404 | Düğümü günceller | ✅ Aktif |
| `DELETE`| `/haritalar/:haritaId/dugumler/:id` | `id: string` | 200 OK / 404 | Düğümü ve bağlı kenarları siler | ✅ Aktif |
| `DELETE`| `/dugumler/:id` | `id: string` | 200 OK / 404 | Düğümü ve bağlı kenarları siler | ✅ Aktif |

### 4. Kenar Uç Noktaları (`/haritalar/:haritaId/kenarlar` & `/kenarlar`)
| Metot | Uç Nokta | Gövde / Parametre | Yanıt Kodu | Açıklama | Durum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/haritalar/:haritaId/kenarlar` | `haritaId: string` | 200 OK | Haritadaki kenarları listeler | ✅ Aktif |
| `POST` | `/haritalar/:haritaId/kenarlar` | `{ kaynakId, hedefId, etiket?, yon? }` | 201 Created | Düğümler arası kenar oluşturur | ✅ Aktif |
| `DELETE`| `/haritalar/:haritaId/kenarlar/:id` | `id: string` | 200 OK / 400 | Kenar bağlantısını siler | ✅ Aktif |
| `DELETE`| `/kenarlar/:id` | `id: string` | 200 OK / 400 | Kenar bağlantısını siler | ✅ Aktif |

---

## 🛡️ Hata Yönetimi ve `ApiYaniti<T>` Sözleşmesi

Tüm uç noktalar `shared/types` altında tanımlanan `ApiYaniti<T>` arayüzüne sadık kalarak yanıt verir:

```typescript
export interface ApiYaniti<T> {
  basarili: boolean;
  veri?: T;
  hata?: string;
}
```

### Başarılı Yanıt Örneği (200 / 201)
```json
{
  "basarili": true,
  "veri": {
    "id": "clx...",
    "baslik": "Staj Network Haritası",
    "olusturulmaTarihi": "2026-10-08T13:00:00.000Z",
    "guncellenmeTarihi": "2026-10-08T13:00:00.000Z"
  }
}
```

### Hata Yanıtı Örneği (400 / 404 / 500)
```json
{
  "basarili": false,
  "hata": "Kaynak ve hedef düğümler aynı haritada olmalıdır"
}
```

- **400 Bad Request:** Geçersiz/eksik parametre veya iş kuralı ihlali (Örn: Boş etiket veya çakışan bağlantı).
- **404 Not Found:** Harita veya düğüm bulunamadığında.
- **500 Internal Server Error:** Beklenmeyen sunucu içi hatalar.

---

## 📌 Durum ve Sonraki Adım

- **Durum:** Controller ve Rota katmanları eksiksiz uygulanmış, Express sunucusuna (`server/src/index.ts`) bağlanmış ve `tsc --noEmit` tip kontrolünden sıfır hatayla geçmiştir.
- **Sıradaki Adım:** Servis katmanı için unit testlerin hazırlanması veya Frontend React Flow / Zustand store bağlantısının kurulması.

---
*İlgili Notlar:* [[00 - Ana Harita]] | [[Katmanli Mimari]] | [[Prisma ve SQLite]] | [[Gunluk]]
