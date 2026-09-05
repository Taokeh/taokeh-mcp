#!/usr/bin/env node
/**
 * taokeh-mcp — the CLI half.
 *
 *   taokeh-mcp list
 *   taokeh-mcp call <tool> [--args '<json>']
 *
 * The token comes from the TAOKEH_MCP_TOKEN environment variable and is never a command-line
 * flag, so it stays out of shell history and process listings.
 *
 * Argument parsing is done by hand on purpose: a reference client should not drag a parser
 * dependency along with it.
 */

import {
  connectTaokeh,
  describeConnectionError,
  firstLine,
  DEFAULT_MCP_URL,
  DOCS_URL,
  TOKEN_PAGE_URL,
} from './index';

const USAGE = `taokeh-mcp — talk to a Taokeh workspace over MCP.

Usage:
  taokeh-mcp list                          List the tools this workspace exposes.
  taokeh-mcp call <tool> [--args '<json>'] Call one tool and print its result.

Options:
  --url <endpoint>   Endpoint to use (default ${DEFAULT_MCP_URL}).
  --args '<json>'    A JSON object of tool arguments. Default: {}.
  -h, --help         This text.

Environment:
  TAOKEH_MCP_TOKEN   A token minted at ${TOKEN_PAGE_URL}.

Tool catalogue and auth docs: ${DOCS_URL}`;

interface Parsed {
  command: string | undefined;
  positional: string[];
  url: string | undefined;
  args: string | undefined;
  help: boolean;
}

/** Hand-rolled argv parse. Unknown flags are an error rather than a silent no-op. */
function parseArgv(argv: string[]): Parsed {
  const out: Parsed = { command: undefined, positional: [], url: undefined, args: undefined, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') {
      out.help = true;
    } else if (a === '--url' || a === '--args') {
      const value = argv[++i];
      if (value === undefined) throw new Error(`${a} needs a value.`);
      if (a === '--url') out.url = value;
      else out.args = value;
    } else if (a.startsWith('--')) {
      throw new Error(`Unknown option ${a}. Run taokeh-mcp --help.`);
    } else if (out.command === undefined) {
      out.command = a;
    } else {
      out.positional.push(a);
    }
  }
  return out;
}

function parseToolArgs(raw: string | undefined): Record<string, unknown> {
  if (raw === undefined) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('--args must be valid JSON, e.g. --args \'{"customer":"Lim Hardware"}\'');
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('--args must be a JSON object, e.g. --args \'{"customer":"Lim Hardware"}\'');
  }
  return parsed as Record<string, unknown>;
}

/** Pull the printable text out of a tool result's content blocks. */
function resultText(content: unknown): string {
  if (!Array.isArray(content)) return '';
  return content
    .map((block) => {
      const b = block as { type?: unknown; text?: unknown };
      if (b?.type === 'text' && typeof b.text === 'string') return b.text;
      return JSON.stringify(block);
    })
    .join('\n');
}

async function run(argv: string[]): Promise<number> {
  const parsed = parseArgv(argv);

  if (parsed.help || parsed.command === undefined || parsed.command === 'help') {
    process.stdout.write(`${USAGE}\n`);
    return parsed.command === undefined && !parsed.help ? 1 : 0;
  }
  if (parsed.command !== 'list' && parsed.command !== 'call') {
    throw new Error(`Unknown command "${parsed.command}". Run taokeh-mcp --help.`);
  }

  const token = process.env.TAOKEH_MCP_TOKEN ?? '';
  if (!token.trim()) {
    throw new Error(`No token. Set TAOKEH_MCP_TOKEN — mint one at ${TOKEN_PAGE_URL}`);
  }

  let toolName: string | undefined;
  let toolArgs: Record<string, unknown> = {};
  if (parsed.command === 'call') {
    toolName = parsed.positional[0];
    if (!toolName) throw new Error('Which tool? Usage: taokeh-mcp call <tool> [--args \'<json>\']');
    toolArgs = parseToolArgs(parsed.args);
  }

  const conn = await connectTaokeh({ token, url: parsed.url });
  try {
    if (parsed.command === 'list') {
      const { tools } = await conn.client.listTools();
      for (const tool of tools) {
        const blurb = firstLine(tool.description);
        process.stdout.write(blurb ? `${tool.name}\n  ${blurb}\n` : `${tool.name}\n`);
      }
      return 0;
    }

    const result = await conn.client.callTool({ name: toolName!, arguments: toolArgs });
    const text = resultText((result as { content?: unknown }).content);
    if (text) process.stdout.write(`${text}\n`);
    if ((result as { isError?: unknown }).isError) {
      process.stderr.write(`${toolName} returned an error (see above).\n`);
      return 1;
    }
    return 0;
  } finally {
    await conn.close().catch(() => undefined);
  }
}

run(process.argv.slice(2))
  .then((code) => {
    process.exitCode = code;
  })
  .catch((err) => {
    process.stderr.write(`${describeConnectionError(err)}\n`);
    process.exitCode = 1;
  });
