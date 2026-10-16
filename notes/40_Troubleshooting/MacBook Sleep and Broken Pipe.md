---
title: "MacBook Sleep and Broken Pipe"
created: "2026-10-16 14:05"
updated: "2026-10-16 14:05"
type: troubleshooting
tags:
  - troubleshooting/network
  - macos/sleep
aliases:
  - "MacBook Uyku Modu ve Broken Pipe Hatası"
summary: "MacBook kapağı kapatıldığında veya sistem uykusuna geçtiğinde açık TCP akışının kopması ve write: broken pipe hatasının kök nedeni."
---

# 🛠️ MacBook Sleep and Broken Pipe

- **Tarih:** 2026-10-16
- **İlgili Oturum:** [[2026-10-16 - Advanced Features and Obsidian Brain Integration]]
- **Durum:** Çözüldü / Anlaşıldı

## 1. Belirti (Symptom)
Kullanıcı öğle molasına çıkarken ekranı kilitlediğinde veya kapağı kapattığında terminalde şu hata belirdi:
```text
⚠ agent executor error: generating and executing: request failed: 
Post "https://daily-cloudcode-pa.googleapis.com/v1internal:streamGenerateContent?alt=sse": 
write tcp 192.1.1.131:59834->172.217.118.4:443: write: broken pipe
```

## 2. Kök Neden (Root Cause)
1. **macOS Güç Yönetimi ve Ağ Kapatma:** macOS, dizüstü bilgisayarın kapağı kapatıldığında veya güç tasarrufu süresi dolup cihaz "Sistem Uykusu" (System Sleep) durumuna geçtiğinde Wi-Fi modülüne giden enerjiyi keser.
2. **Kopan TCP Soketi:** İstemci (CLI / Agent), Google sunucusu ile açık bir SSE (Server-Sent Events) HTTP akışı sürdürürken ağ bağlantısı aniden kesildiği için soket karşı tarafça veya işletim sistemince zorla kapatılmıştır.
3. **Broken Pipe (SIGPIPE):** İşletim sistemi, kapanmış bir sokete veri yazmaya çalışan işleme standart bir POSIX `write: broken pipe` hatası fırlatmıştır.

## 3. Çözüm ve Gelecek İçin Önlemler (Remedy & Prevention)
- **Ekranı Kilitlemek Güvenlidir:** Yalnızca ekranı kilitlemek (`Control + Command + Q`) sistemi hemen uyutmaz; ancak MacBook'un kapağı fiziksel olarak kapatılmamalıdır.
- **Güç Kaynağı ve Caffeinate:** Uzun soluklu arka plan işlerinde Mac şarja bağlı tutulmalı ve sistem uykusunu engellemek için `caffeinate` kullanılmalıdır:
  ```bash
  caffeinate -d -i -m -s &
  ```
- **Kapak Açıldığında:** Ağ tekrar bağlandığında oturum kaldığı yerden sorunsuz devam edebilir; bağlantı hatası kalıcı bir hasar bırakmaz.
