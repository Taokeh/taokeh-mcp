# taokeh-mcp

Public code and skills for the Taokeh MCP connector. Taokeh (<https://taokeh.my>) is accounting,
e-Invoice and payroll software for Malaysian small businesses; the connector lets the AI you
already use — Claude, ChatGPT or any MCP-capable client — read a company's books and file drafts
that a person approves inside Taokeh. Nothing posts by itself.

## What is here

| Path | What it is |
|---|---|
| `clients/mcp-reference/` | `taokeh-mcp-client` on npm — a small CLI and library that connects with a personal token, lists the tools, and calls one. Reference code for developers scripting against their own books. |
| `skills/ask-taokeh/` | A skill for day-to-day bookkeeping through the connector: money-in and money-out workflows, the weekly bank review, how to read the numbers honestly. |
| `skills/ask-taokeh-migration/` | A skill for moving a company's books into Taokeh from another system, in the right order, with the cutover rules that keep totals honest. |

The connector itself is hosted at `https://taokeh.my/mcp`. Endpoint, auth and the full tool
catalogue: <https://taokeh.my/mcp-server>.

## Connecting a chat client

You do not need anything in this repo for that. Claude, ChatGPT and other MCP clients connect to
the endpoint directly; the steps are on the docs page above.

## Contributing

Issues are welcome. This repo is mirrored from Taokeh's main codebase, so please open an issue
before a pull request — changes land in the source first and are published here.

## Licence

MIT for the code and skill text in this repo (see `LICENSE`). Taokeh is a trademark of Enya
Venture; no trademark rights are granted, and forks must not use the Taokeh name or imply
endorsement.
