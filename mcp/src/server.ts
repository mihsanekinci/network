import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getContactContextSchema,
  handleGetContactContext,
} from "./tools/getContactContext.js";
import {
  logInteractionSchema,
  handleLogInteraction,
} from "./tools/logInteraction.js";
import {
  listStaleContactsSchema,
  handleListStaleContacts,
} from "./tools/listStaleContacts.js";
import {
  searchNetworkSchema,
  handleSearchNetwork,
} from "./tools/searchNetwork.js";
import {
  findIntroductionPathSchema,
  handleFindIntroductionPath,
} from "./tools/findIntroductionPath.js";

/**
 * Creates and registers tools on the NetWork MCP Server instance.
 */
export function createNetWorkMcpServer(): McpServer {
  const server = new McpServer({
    name: "network-mcp",
    version: "1.0.0",
  });

  server.tool(
    "get_contact_context",
    "Retrieve complete profile context, communication tone, freshness status, recent interactions, and direct graph connections for a person or institution.",
    getContactContextSchema,
    handleGetContactContext
  );

  server.tool(
    "log_interaction",
    "Log a new interaction (meeting, coffee, email, message, call, event) with a contact, instantly updating relationship freshness.",
    logInteractionSchema,
    handleLogInteraction
  );

  server.tool(
    "list_stale_contacts",
    "Find contacts that are dormant ('uykuda') or need attention soon ('ilgi_bekliyor') according to their defined communication frequency.",
    listStaleContactsSchema,
    handleListStaleContacts
  );

  server.tool(
    "search_network",
    "Search across people, companies, tags, clusters, or notes across the NetWork personal graph.",
    searchNetworkSchema,
    handleSearchNetwork
  );

  server.tool(
    "find_introduction_path",
    "Find how to reach a target person or company through mutual connections and graph paths (e.g. 2nd/3rd degree introductions).",
    findIntroductionPathSchema,
    handleFindIntroductionPath
  );

  return server;
}
