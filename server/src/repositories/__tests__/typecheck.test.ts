import { describe, it, expect } from "vitest";
import * as ts from "typescript";
import * as path from "path";

describe("TypeScript Tip Denetimi (tsc --noEmit)", () => {
  it("tüm proje kaynak dosyaları sıfır tip hatası ile derlenmeli", () => {
    const rootDir = path.resolve(__dirname, "../../..");
    const configPath = path.resolve(rootDir, "tsconfig.json");

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    if (configFile.error) {
      throw new Error(
        ts.formatDiagnosticsWithColorAndContext([configFile.error], {
          getCanonicalFileName: (f) => f,
          getCurrentDirectory: () => rootDir,
          getNewLine: () => "\n",
        })
      );
    }

    const parsedCommandLine = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      rootDir
    );

    const program = ts.createProgram({
      rootNames: parsedCommandLine.fileNames,
      options: { ...parsedCommandLine.options, noEmit: true },
    });

    const diagnostics = ts.getPreEmitDiagnostics(program);
    const formatHost: ts.FormatDiagnosticsHost = {
      getCanonicalFileName: (f) => f,
      getCurrentDirectory: () => rootDir,
      getNewLine: () => "\n",
    };

    const formattedMessages = ts.formatDiagnosticsWithColorAndContext(
      diagnostics,
      formatHost
    );

    expect(diagnostics.length, formattedMessages).toBe(0);
  });
});
