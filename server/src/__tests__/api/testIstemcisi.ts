import http from "node:http";
import { AddressInfo } from "node:net";
import { Express } from "express";

export interface TestYaniti<T = any> {
  durum: number;
  govde: T;
  basliklar: Headers;
}

/**
 * Node.js yerleşik HTTP sunucusu ve fetch API'si tabanlı Express test istemcisi.
 * Rastgele boş port (port 0) kullanarak port çakışmalarını önler.
 */
export class TestIstemcisi {
  private sunucu: http.Server | null = null;
  private port: number = 0;

  constructor(private readonly uygulama: Express) {}

  async baslat(): Promise<void> {
    if (this.sunucu) return;
    return new Promise((resolve) => {
      this.sunucu = http.createServer(this.uygulama);
      this.sunucu.listen(0, "127.0.0.1", () => {
        const adres = this.sunucu!.address() as AddressInfo;
        this.port = adres.port;
        resolve();
      });
    });
  }

  async durdur(): Promise<void> {
    if (!this.sunucu) return;
    return new Promise((resolve, reject) => {
      this.sunucu!.close((hata) => {
        if (hata) reject(hata);
        else {
          this.sunucu = null;
          this.port = 0;
          resolve();
        }
      });
    });
  }

  private urlOlustur(yol: string): string {
    const duzgunYol = yol.startsWith("/") ? yol : `/${yol}`;
    return `http://127.0.0.1:${this.port}${duzgunYol}`;
  }

  async istek<T = any>(
    yontem: string,
    yol: string,
    secenekler: {
      govde?: any;
      basliklar?: Record<string, string>;
    } = {}
  ): Promise<TestYaniti<T>> {
    if (!this.sunucu) {
      await this.baslat();
    }

    const istekBasliklari: Record<string, string> = {
      ...(secenekler.govde !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(secenekler.basliklar ?? {}),
    };

    const istekGovdesi =
      secenekler.govde !== undefined
        ? typeof secenekler.govde === "string"
          ? secenekler.govde
          : JSON.stringify(secenekler.govde)
        : undefined;

    const yanit = await fetch(this.urlOlustur(yol), {
      method: yontem,
      headers: istekBasliklari,
      body: istekGovdesi,
    });

    let govde: any;
    const contentType = yanit.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      govde = await yanit.json();
    } else {
      const metin = await yanit.text();
      try {
        govde = JSON.parse(metin);
      } catch {
        govde = metin;
      }
    }

    return {
      durum: yanit.status,
      govde,
      basliklar: yanit.headers,
    };
  }

  get<T = any>(yol: string, basliklar?: Record<string, string>) {
    return this.istek<T>("GET", yol, { basliklar });
  }

  post<T = any>(yol: string, govde?: any, basliklar?: Record<string, string>) {
    return this.istek<T>("POST", yol, { govde, basliklar });
  }

  put<T = any>(yol: string, govde?: any, basliklar?: Record<string, string>) {
    return this.istek<T>("PUT", yol, { govde, basliklar });
  }

  patch<T = any>(yol: string, govde?: any, basliklar?: Record<string, string>) {
    return this.istek<T>("PATCH", yol, { govde, basliklar });
  }

  delete<T = any>(yol: string, basliklar?: Record<string, string>) {
    return this.istek<T>("DELETE", yol, { basliklar });
  }
}
