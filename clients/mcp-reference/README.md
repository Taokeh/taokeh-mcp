# taokeh-mcp-client

A small reference client for the Taokeh MCP connector. It connects with a personal token, lists
the tools your company exposes, and calls one. That is the whole scope — copy it into your own
integration, or use the CLI to check a token from the terminal.

Taokeh (<https://taokeh.my>) is accounting software for Malaysian small businesses. The connector
reads the books and files drafts. Every tool that writes files a **pending draft** —
somebody with access approves it inside Taokeh before anything is posted. Nothing posts by itself.

## Install

```bash
npm install -g taokeh-mcp-client
```

Node 18 or newer. The installed command is `taokeh-mcp-client`.

## What's new in 0.1.2

- **The endpoint has an https floor.** `connectTaokeh` (and the CLI) refuse a plain-`http`
  endpoint unless the host is `localhost` or `127.0.0.1`, and the CLI prints one stderr line when
  the token is going anywhere other than `taokeh.my`. A copied-from-somewhere `--url` can no
  longer quietly send your token to a stranger.
- **The command is now `taokeh-mcp-client`**, matching the install name. It was `taokeh-mcp` in
  0.1.0/0.1.1 — update any script that used the old name.

## Mint a token

Sign in to Taokeh and open <https://taokeh.my/integrations/mcp>. Admin and bookkeeper seats can
mint one. The token is shown once — copy it then.

```bash
export TAOKEH_MCP_TOKEN="tkm_..."
```

## Use the CLI

```bash
taokeh-mcp-client list
taokeh-mcp-client call business_snapshot
taokeh-mcp-client call open_invoices --args '{"customer":"Lim Hardware"}'
```

The command is `taokeh-mcp-client` — the same string you installed.

`--url <endpoint>` points at a different instance (default `https://taokeh.my/mcp`) — a
self-hosted or staging server. It must be `https`, unless it is `localhost` or `127.0.0.1`; the
client refuses anything else rather than send your token in the clear. If the host is not
`taokeh.my`, it says so on stderr before connecting.

The token is read from `TAOKEH_MCP_TOKEN` only — there is no `--token` flag, so it stays out of
your shell history. Nothing here ever prints it.

## Use it as a library

```ts
import { connectTaokeh } from 'taokeh-mcp-client';

const { client, close } = await connectTaokeh({ token: process.env.TAOKEH_MCP_TOKEN! });
try {
  const { tools } = await client.listTools();
  const result = await client.callTool({ name: 'business_snapshot', arguments: {} });
  console.log(tools.length, result.content);
} finally {
  await close();
}
```

`client` is the standard `Client` from `@modelcontextprotocol/sdk`, so anything that SDK can do,
you can do. `describeConnectionError(err)` turns a thrown transport error into one line worth
printing.

## If you just want a chat client connected

You do not need this package for that. Claude, ChatGPT and other MCP-capable clients connect to
the endpoint themselves; the setup steps are on the docs page below.

## Tool catalogue, arguments and auth

<https://taokeh.my/mcp-server>

## Licence

MIT. See `LICENSE`.
