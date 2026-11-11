# 🌐 NetWork MCP Server (`@network/mcp`)

Model Context Protocol (MCP) server for **NetWork** — Personal CRM & Network Knowledge Graph.

Bu MCP sunucusu, yerel yapay zeka asistanlarının (Claude Desktop, Cursor, Antigravity, Gemini CLI) doğrudan SQLite veritabanınıza (`server/prisma/dev.db`) bağlanmasını sağlar. 

> **Önemli Avantaj:** MCP sunucusu doğrudan yerel veritabanı dosyasını okuyup yazdığı için, tarayıcı veya frontend dev sunucusu açık olmasa dahi 7/24 çalışır.

---

## 🚀 Hızlı Başlangıç

### 1. Derleme (Build)
```bash
cd mcp
npm install
npm run build
```

Derleme sonucunda çalıştırılabilir `mcp/dist/index.js` dosyası oluşur.

---

## 🛠️ Entegrasyon ve Ayarlar (Clients)

### 1. Claude Desktop Entegrasyonu
`~/Library/Application Support/Claude/claude_desktop_config.json` dosyanızı açın ve `mcpServers` altına ekleyin:

```json
{
  "mcpServers": {
    "network": {
      "command": "node",
      "args": [
        "/Users/mihsan/Desktop/her_sey_burada/projeler/network/mcp/dist/index.js"
      ]
    }
  }
}
```

### 2. Cursor Entegrasyonu
Projenizin kök dizinindeki `.cursor/mcp.json` dosyasına (veya Cursor Ayarlar -> Features -> MCP sekmesine) ekleyin:

```json
{
  "mcpServers": {
    "network": {
      "command": "node",
      "args": ["/Users/mihsan/Desktop/her_sey_burada/projeler/network/mcp/dist/index.js"]
    }
  }
}
```

### 3. Antigravity & Gemini Entegrasyonu
Antigravity ayarlarınızda (`~/.gemini/antigravity/` veya proje MCP yapılandırmasında):

```json
{
  "mcpServers": {
    "network": {
      "command": "node",
      "args": ["/Users/mihsan/Desktop/her_sey_burada/projeler/network/mcp/dist/index.js"]
    }
  }
}
```

---

## 🧰 Sağlanan Araçlar (Tools)

Yapay zeka modellerinin (LLM) en yüksek başarıyla araç seçip argüman üretebilmesi için araç ve parametre isimleri evrensel standart olan **İngilizce** tasarlanmıştır:

| Araç Adı | Açıklama | Örnek Doğal Dil İstemi |
| :--- | :--- | :--- |
| `get_contact_context` | Kişi/kurumun profili, şirketi, unvanı, iletişim üslubu, ilişki tazeliği ve doğrudan ağ bağlantılarını getirir. | *"Hilal Abla ile toplantım var, geçmiş etkileşimlerimizi ve profilini özetle."* |
| `log_interaction` | Kişiyle yapılan yeni bir teması (toplantı, kahve, e-posta, arama) kaydeder ve tazelik sayacını anında sıfırlar. | *"Bugün Hilal Abla ile staj süreci hakkında kahve içtik, bunu CRM'e işle."* |
| `list_stale_contacts` | Belirlenen iletişim periyoduna göre uykuda olan (`uykuda`) veya yakında ilgilenilmesi gereken kişileri listeler. | *"Ağımda iletişimi soğumuş veya uykuda olan kimler var?"* |
| `search_network` | İsim, şirket, unvan, küme, not veya etiket bazında tüm ağ haritalarında arama yapar. | *"Ağımda mayaICT ile ilişkili kişileri ve kurumları bul."* |
| `find_introduction_path` | İki kişi arasındaki ortak bağlantıları ve tanıştırılma rotalarını (1., 2. ve 3. derece) BFS graf algoritmasıyla çözer. | *"Kemal Bey'e ulaşmak istiyorum, ağımda beni onunla kim tanıştırabilir?"* |

---

## 🔒 Güvenlik ve Mimari Prensipler
- **Modüler Mimari:** `@modelcontextprotocol/sdk` ve Zod şemaları ile tip güvenliği sağlanmıştır.
- **Tek Sorumluluk:** Her araç tek bir dosyada, test edilebilir ve izole mantıkla çalışır (`arch_audit.py` PASS).
- **Temiz stdio İletişimi:** Tüm hata ve log mesajları `stderr` kanalına basılır; `stdout` yalnızca MCP JSON-RPC veri akışına ayrılmıştır.
