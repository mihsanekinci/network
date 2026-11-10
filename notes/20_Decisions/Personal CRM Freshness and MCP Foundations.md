---
title: "Personal CRM Freshness and MCP Foundations"
created: "2026-11-10"
type: decision
tags:
  - adr
  - personal-crm
  - freshness
  - touchpoints
  - mcp-vision
---

# 🏛️ Mimari Karar Kaydı: Kişisel CRM Veri Sözleşmesi, İlişki Tazeliği ve NetWork MCP Temelleri (ADR 0008)

## 📌 Bağlam ve Problem Tanımı
Yapay zeka asistanları (Claude, Cursor, Gemini) kurumsal veya kişisel e-posta/mesaj yazarken kullanıcının sosyal ağındaki kişilerin unvanını, iletişim sıklığını ve konuşulması gereken üslubu bilmediğinden mekanik ve dengesiz metinler üretir.

NetWork platformunun bir Model Context Protocol (MCP) sunucusu (`network-mcp`) ile dış dünyadaki ajanlara bağlanabilmesi için; varlıkların kuru birer isim ve unvan olmaktan çıkıp **ilişki tazeliği (dormancy tracking)**, **tercih edilen iletişim üslubu (communication tone guidelines)** ve **kronolojik temas geçmişi (interaction timeline & touchpoints)** alanlarına sahip olması gerekmiştir.

## ⚖️ Alternatifler ve Değerlendirme

### Alternatif A: Ayrı İlişkisel Tablo (`Etkilesim`) ve Veritabanı Migrasyonu
- **Gerekçe:** Veritabanında `Etkilesim` adında yeni bir tablo açıp `dugumId` ile yabancı anahtar (FK) kurmak.
- **Dezavantajlar:** Yıkıcı SQLite migrasyonu gerektirir. Mevcut JSON tam paket dışa/içe aktarma (`exportUtils.ts`, `HaritaPaketiDTO`) sözleşmesini bozar. Karmaşıklığı katbekat artırır (YAGNI ihlali).

### Alternatif B: Genişletilebilir `ozellikler` (JSON) Sözleşmesi (Kabul Edilen)
- **Gerekçe:** Düğüm tablosundaki mevcut `ozellikler` JSON alanı içinde `sonTemasTarihi`, `hedefTemasAraligiGun`, `iletisimUslubu`, `uslupNotu` ve `etkilesimler: EtkilesimKaydi[]` alanlarını yapılandırmak.
- **Avantajlar:**
  1. **Sıfır Migrasyon & Tam Geriye Dönük Uyumluluk:** Veritabanı şeması ve mevcut kayıtlar bozulmaz.
  2. **Taşınabilirlik (Portability):** JSON dışa aktarıldığında tüm etkileşimler ve üslup rehberi haritayla birlikte taşınır.
  3. **YAGNI ve Performans:** Kişisel CRM kullanımında bir kişiyle yılda 5-20 temas tutulur. JSON alanı son derece hafif kalır.
  4. **Modüler Frontend:** Drawer bileşenleri SRP sınırlarında ayrı dosyalara bölünerek `arch_audit` 0 ihlal kuralı korunur.

## 🎯 Alınan Karar
Alternatif B benimsendi. `shared/types`, `relationshipFreshness.ts`, modüler `Drawer` bileşenleri ve tuval üzerindeki canlı tazelik noktası (`CustomNode.tsx`) hayata geçirildi.

---
*İlgili Notlar:* [[00_Index]] | [[2026-11-10 - Personal CRM Freshness and Interaction Timeline]] | [[Gunluk]]