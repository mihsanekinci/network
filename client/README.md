# client — Frontend Katmanı

## Sorumluluk
Kullanıcı arayüzünü sunar. Veri okuma/yazma işlemlerini `services/` katmanı
aracılığıyla HTTP üzerinden backend'e iletir; doğrudan veritabanı veya iş kuralı
bilgisi içermez.

## Katman Akışı
```
React bileşeni (components/ veya pages/)
  → servisler (services/)
    → HTTP → server rotaları
```

## Klasör Yapısı
| Klasör | Sorumluluk |
|---|---|
| `components/common/` | Yeniden kullanılabilir UI bileşenleri (buton, modal…) |
| `components/graph/` | React Flow canvas ve düğüm/kenar bileşenleri |
| `components/panels/` | Sağ/sol yan panel bileşenleri |
| `hooks/` | Özel React hook'ları |
| `pages/` | Rota düzeyindeki sayfa bileşenleri |
| `services/` | Backend API çağrıları (fetch) |
| `store/` | Zustand global state tanımları |
| `types/` | Client-tarafı tip yeniden dışa aktarımları |

## Geliştirme
```bash
npm install
npm run dev   # http://localhost:5173
```

## Teknolojiler
- React 18 + TypeScript (strict)
- Vite (geliştirme sunucusu & bundler)
- React Flow (graf canvas)
- Zustand (global state)
- Tailwind CSS v4 (stillendirme)
