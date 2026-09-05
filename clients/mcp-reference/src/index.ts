/**
 * taokeh-mcp-client — the library half.
 *
 * One job: hand back a connected MCP `Client` pointed at a Taokeh workspace, authenticated with
 * a personal bearer token. Everything else (tool names, arguments, results) is the connector's
 * own published surface — see https://taokeh.my/mcp-server.
 *
 * Deliberately small: no OAuth, no config files, no retries, no logging. Reference code should be
 * readable end to end in one sitting.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

/** The live connector endpoint. */
export const DEFAULT_MCP_URL = 'https://taokeh.my/mcp';

/** Where a signed-in admin or bookkeeper mints a token. Shown once, so keep it. */
export const TOKEN_PAGE_URL = 'https://taokeh.my/integrations/mcp';

/** Tool catalogue + auth documentation. */
export const DOCS_URL = 'https://taokeh.my/mcp-server';

export interface ConnectOptions {
  /** A personal token minted at TOKEN_PAGE_URL. */
  token: string;
  /** Endpoint override — for a self-hosted or staging instance. Defaults to DEFAULT_MCP_URL. */
  url?: string;
  /** How this client identifies itself to the server. */
  clientName?: string;
  clientVersion?: string;
}

export interface TaokehConnection {
  /** The connected SDK client: `listTools()`, `callTool({ name, arguments })`, … */
  client: Client;
  /** Close the session and its HTTP transport. Safe to call more than once. */
  close(): Promise<void>;
}

/**
 * Connect to a Taokeh workspace and complete the MCP handshake.
 * Throws on a failed handshake — pass the error to `describeConnectionError` for a human line.
 */
export async function connectTaokeh(options: ConnectOptions): Promise<TaokehConnection> {
  const token = (options.token ?? '').trim();
  if (!token) throw new Error(`No token supplied. Mint one at ${TOKEN_PAGE_URL}`);

  const transport = new StreamableHTTPClientTransport(new URL(options.url ?? DEFAULT_MCP_URL), {
    // The token rides every request as a plain bearer header. The SDK's OAuth provider is
    // deliberately not wired up: a personal token needs no browser round-trip.
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  });

  const client = new Client({
    name: options.clientName ?? 'taokeh-mcp-client',
    version: options.clientVersion ?? '0.1.0',
  });

  try {
    await client.connect(transport);
  } catch (err) {
    await transport.close().catch(() => undefined);
    throw err;
  }

  let closed = false;
  return {
    client,
    close: async () => {
      if (closed) return;
      closed = true;
      await client.close();
    },
  };
}

/** HTTP status carried by an SDK transport error, when there is one. */
function statusOf(err: unknown): number | undefined {
  const code = (err as { code?: unknown } | null)?.code;
  return typeof code === 'number' ? code : undefined;
}

/**
 * Turn a thrown error into one line a person can act on. The 401 case is the common one:
 * a token that was never valid, was revoked, or belongs to a user who lost access.
 */
export function describeConnectionError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  const status = statusOf(err);

  if (status === 401 || (status === undefined && /\bunauthorized\b/i.test(message))) {
    return `Taokeh rejected the token (401). Mint a fresh one at ${TOKEN_PAGE_URL} and set TAOKEH_MCP_TOKEN.`;
  }
  if (status === 403) {
    return `Taokeh accepted the token but refused the request (403): ${message}`;
  }
  if (status === 429) {
    return 'Taokeh is rate-limiting this token (429). Wait a moment, then retry.';
  }
  return message;
}

/** The first line of a tool description — what `taokeh-mcp list` prints. */
export function firstLine(text: string | undefined): string {
  return (text ?? '').split('\n')[0].trim();
}
