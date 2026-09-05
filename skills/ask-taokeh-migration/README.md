# Ask Taokeh — switching systems skill

An installable skill that lets a general AI assistant (Claude, ChatGPT, or any MCP-capable client)
move a Malaysian SME's books **into** [Taokeh](https://taokeh.my) from whatever they were kept in
before — Bukku, Financio, AutoCount, QNE, a spreadsheet, or a paper book.

## What it does

Switching accounting systems is a one-off job with a right order and a handful of traps that cost
real money when you get them wrong. Taokeh's staging tools describe themselves in detail; what an
AI meeting them cold still lacks is the craft across them. This skill is that craft, written down:

- the checklist to hand you at the start — which reports to pull from your old system, as at which
  date, and which ones not to bother chasing — so you know what the job needs before it begins
- the sequence — chart of accounts, then contacts and products, then the trial balance, then the
  aged lists, then the historical documents, then settings — and why each step lands on the one
  before it
- the cutover line: before it is opening balances, after it is documents, never both
- which tools replace a whole set and which dedupe per document — so "found a mistake" has one
  correct answer each time
- what to leave out and report instead (credit balances on an aged list), and what never to invent
- how to put right a mistake found after it posted — re-import, void-and-replace, or a correcting
  document — instead of quietly booking the same sale twice
- the ground rule: your AI stages, **you** approve and post, in-app

## What you need

1. A company on Taokeh — the 14-day free trial includes the Ask Taokeh connector.
2. The connector linked to your AI app (in Taokeh: **Integrations → Ask Taokeh connector**).
3. The switching lane turned on by you, in Taokeh, at **/switch**.
4. This skill installed in your AI client.

Without a company on Taokeh the skill is just a readable description of how an AI-assisted
accounting migration works — the tools it drives only exist once your books are connected.

## What it will never do

Post anything to your ledger, decide your accounting start date for you, invent a tax number or a
figure to make a total tie, adjust a row to force a balance, or bring back a document you
deliberately left out. Those boundaries are enforced by Taokeh's server, and the skill teaches your
AI to respect them rather than fight them.

## After the switch

Day-to-day bookkeeping is the separate **ask-taokeh** skill — invoicing, expenses, bank review, and
honest business readings. Install both; this one retires once your books are in.

## License

MIT — the license covers the text of this skill only. **Taokeh is a trademark of Enya Venture**;
no trademark rights are granted, and forks or derivatives must not use the Taokeh name or imply
endorsement. Issues and suggestions welcome.
