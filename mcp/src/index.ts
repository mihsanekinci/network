#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createNetWorkMcpServer } from "./server.js";
import { prisma } from "./db/client.js";

async function main(): Promise<void> {
  const server = createNetWorkMcpServer();
  const transport = new StdioServerTransport();

  const shutdown = async (signal: string) => {
    // Write diagnostics strictly to stderr to keep stdout clean for JSON-RPC
    console.error(`[network-mcp] Received ${signal}, shutting down gracefully...`);
    try {
      await server.close();
      await prisma.$disconnect();
    } catch (err) {
      console.error("[network-mcp] Error during shutdown:", err);
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  await server.connect(transport);
  console.error("[network-mcp] NetWork MCP Server running on stdio");
}

main().catch(async (error) => {
  console.error("[network-mcp] Fatal error starting server:", error);
  try {
    await prisma.$disconnect();
  } catch {
    // Ignore secondary disconnect errors
  }
  process.exit(1);
});
