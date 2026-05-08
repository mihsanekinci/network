# shared — Ortak Tip Tanımları

## Sorumluluk
Client ve server arasındaki veri sözleşmesini tanımlar.
Tek kaynak-doğruluğu (single source of truth) ilkesini uygular:
bir DTO tipi değiştiğinde her iki taraf da derleme zamanında uyarı alır.

## İçerik
| Dosya | İçerik |
|---|---|
| `types/index.ts` | Tüm DTO ve enum tanımları |

## Tipler
| Tip | Açıklama |
|---|---|
| `HaritaDTO` | Harita okuma yanıtı |
| `HaritaOlusturDTO` | Yeni harita oluşturma isteği |
| `DugumDTO` | Düğüm okuma yanıtı |
| `DugumOlusturDTO` | Yeni düğüm oluşturma isteği |
| `DugumGuncelleDTO` | Düğüm güncelleme isteği |
| `KenarDTO` | Kenar okuma yanıtı |
| `KenarOlusturDTO` | Yeni kenar oluşturma isteği |
| `DugumTuru` | `"kisi"` \| `"kurum"` \| `"kavram"` \| `"diger"` |
| `KenarYonu` | `"tek_yonlu"` \| `"cift_yonlu"` \| `"yonsuz"` |
| `ApiYaniti<T>` | Standart API yanıt zarfı |

## Kurallar
- Bu klasöre hiçbir iş mantığı veya runtime bağımlılığı eklenmez
- Sadece TypeScript `type` ve `interface` tanımları içerir
