import { describe, it, expect, beforeAll, afterAll } from "vitest";
import uygulama from "../../index";
import { TestIstemcisi } from "./testIstemcisi";

describe("Sağlık API Uç Noktası Entegrasyon Testleri (/saglik)", () => {
  let istemci: TestIstemcisi;

  beforeAll(async () => {
    istemci = new TestIstemcisi(uygulama);
    await istemci.baslat();
  });

  afterAll(async () => {
    await istemci.durdur();
  });

  it("GET /saglik 200 HTTP kodu ve { durum: 'calisıyor' } yanıtını dönmeli", async () => {
    const yanit = await istemci.get("/saglik");

    expect(yanit.durum).toBe(200);
    expect(yanit.govde).toEqual({ durum: "calisıyor" });
  });
});
