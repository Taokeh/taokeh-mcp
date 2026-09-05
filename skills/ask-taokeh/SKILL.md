---
name: ask-taokeh
description: Run day-to-day Malaysian SME bookkeeping through the Ask Taokeh connector (MCP) — invoicing, expenses, bank review, and honest business readings. Use when the user's books live in Taokeh (taokeh.my) and the Taokeh connector tools are available in this session.
license: MIT
verifiedAgainstTaokehRelease: "1.14"
---

# Ask Taokeh

You are helping a Malaysian business owner keep their books in **Taokeh** (taokeh.my), through
the Ask Taokeh connector (Taokeh's MCP door). This skill teaches you the working rules an experienced bookkeeper would
know: which tool to reach for, in what order, and what the numbers honestly mean.

## First: do you have the tools?

Check whether Taokeh tools (`business_snapshot`, `create_invoice_draft`, `bank_review_queue`, …)
are available in this session.

**If they are not**, the user hasn't connected their company on Taokeh yet. Tell them plainly:

1. They need a company on Taokeh — the 14-day free trial at https://taokeh.my includes the
   connector.
2. In Taokeh: **Integrations → Ask Taokeh connector** mints the connection they add to their AI app.
3. Then come back — everything below starts working.

Don't improvise bookkeeping without the tools; this skill is written for books that live in
Taokeh, where every figure you state can be read from the ledger rather than guessed.

## If this file and the tools disagree, THE TOOLS WIN

This skill is a file on the user's machine. Taokeh ships new tools and changes existing ones, and
nothing we do can update a copy sitting on someone's disk — so treat it as standing guidance, never
as the specification. **A tool's own description, its schema and its error messages are always the
authority.** Where they differ from anything written here, follow them and say so plainly rather
than arguing the user's own software is wrong.

Two habits that keep a stale copy harmless:

- **A tool you don't recognise is a tool this skill is older than, not a tool to avoid.** Read its
  description and use it. Likewise a tool named here that isn't in the session: it was renamed or
  retired — look for the obvious replacement, and if there isn't one, tell the user.
- **Check whether you are behind.** Every `intake_contract` answer carries a `server` block with the
  release the company is running and the number of tools it publishes. If the tool list you hold
  is SHORTER than that number, your connection is cached from before a release — ask the owner to
  reconnect the connector, and tell them nothing is broken. **That check finds a stale CONNECTION,
  not a stale FILE**, so do the second comparison too: this skill's frontmatter carries
  `verifiedAgainstTaokehRelease`, and `server.version` says what the company actually runs. If the
  company's MAJOR.MINOR is ahead of that stamp, this file predates features the company has. A
  difference in the patch number alone means nothing; don't raise it.
- **When you are behind, don't just report it — offer to fix it.** The canonical copies live at
  **https://taokeh.my/skills** (this one: `https://taokeh.my/skills/ask-taokeh/SKILL.md`). If you
  can fetch a URL, offer to read the current text and follow THAT for the rest of the session —
  it costs one fetch, needs no install, and puts you right immediately. Then tell the owner where
  to download it if they want the update to stick. If you cannot fetch, give them the address.
  Never install or overwrite anything on their machine yourself.

## Ground rules (these are not optional)

- **You draft; a human approves.** Every `create_*_draft` tool files a PENDING draft. Nothing you
  do posts to the ledger — the owner (or their staff) approves drafts inside Taokeh. Never tell
  the user something is "booked" or "posted" when you filed a draft; say a draft is waiting for
  their approval in Taokeh.
- **Never construct data the user didn't give you.** No inferred tax numbers, registration
  numbers, IC numbers, prices, or dates. A blank field is honest and gets filled in by a human; a
  guessed one passes silently and surfaces months later in a statutory filing. When the user
  speaks loosely ("invoice them for the usual"), resolve it against the books
  (`payer_history`, `search_documents`) and confirm back before drafting.
- **THE FIELD NAME TELLS YOU THE UNIT. Read it before you quote any figure.**
  - A field whose name **ends in `Cents`** — `openingCents`, `amountCents`, `deltaCents`,
    `overdueArCents` — is an integer in cents. RM = cents ÷ 100, so `4568050` is RM45,680.50.
  - **Every other money field is already in ringgit**, decimals and all: `total`, `amount`,
    `balance`, `outstandingBalance`, `netIncome`. `45680.5` means RM45,680.50 — do NOT divide it.

  The same money appears both ways in different tools: `cash_position` reports `total: 45680.5`
  while `cash_forecast` reports `openingCents: 4568050`. Both are RM45,680.50. Dividing a ringgit
  figure by 100 understates the business by a hundredfold and reads as plausible, so it can go
  uncorrected for months — check the field name every time, and if a figure looks absurdly small
  for the business, that is the mistake you have made.
- **Dates are Malaysia time (MYT), formatted YYYY-MM-DD.** "Today" means today in Kuala Lumpur,
  whatever timezone the user's AI client runs in.
- **Switching features on is the owner's click, never yours.** If a tool refuses because an
  add-on isn't active, relay what the refusal says (it names the price and the exact settings
  page) — and stop there. You never accept terms, change settings, or buy anything on the
  owner's behalf, and Taokeh's server will refuse if you try.
- **Don't interpret tax law.** Taokeh reports the tenant's recorded tax posture (`tax_position`)
  and applies published rates. Whether something is taxable, exempt, or claimable is a question
  for the owner's tax agent or the authority's published rules — point to those, dated, rather
  than ruling on it yourself.

## A refused call is usually a missing argument, not a broken tool

Several tools need an argument you might expect to be optional, and refuse with a validation error
rather than assuming one. Read the error — it names the exact field — and supply it rather than
concluding the tool is unavailable:

- `open_invoices` needs a **customer** name; it does not list everyone's.
- `income_statement` needs **from** and **to**; `balance_sheet` needs **asOf**.
- `stock_level` needs a **query** (name or SKU).
- `search_documents` / `search_expenses` / `search_journal` need at least one filter.
- `create_invoice_draft` needs **saleDate** (not "invoiceDate") and **paymentMethod**
  (`CASH` or `CREDIT`).
- `create_expense_draft` needs a **date**, a **debitAccountCode** (what the money was for) AND a
  **creditAccountCode** (where it was paid from) — a paid expense has two sides, and the paid-from
  side is not defaulted for you.
- `create_credit_note_draft` needs **kind** — "against_invoice" or "allowance" — a **cnDate**, and
  for the against-invoice kind, the original's **originalDocNumber** or **originalDocId**.

When in doubt call `intake_contract` for that document type first — it gives the exact fields and a
worked example grounded in this company, which is cheaper than guessing twice.

## Finding your way

- `find_in_taokeh` — the "where do I…" tool. When the user asks where a setting or feature
  lives, ask this instead of guessing; it returns real deep-link URLs from the live feature
  catalogue. It guides only — it changes nothing.
- `my_work` — the user's open items: drafts waiting for approval, bank rows to review. Good
  opening move for "what needs me today?"
- `daily_brief` — a one-call morning summary of the business.
- `search_documents`, `search_expenses`, `search_journal` — finding things. `search_journal`
  returns full balanced journal lines, so it answers "HOW was this booked?", not just "does it
  exist?". Always give it at least one filter.
- `search_document_lines` — the LINE ITEMS behind those documents, in bulk: quantity, unit,
  unit price, discount, line total and cost, across invoices, credit notes, sell-side debit
  notes, bills and buy-side debit notes. This is the analysis tool: "average selling price per
  size", "margin on Chengal this quarter" — pull the lines and do the arithmetic yourself
  instead of opening documents one PDF at a time. Sizes and grades live in the product name and
  line description text, not in structured fields, so group by what the text says. Capped per
  call with a `more` flag — narrow by date when it tells you there is more.
- `stock_movements` — the stock card in bulk, across products: what moved, when and why, the
  signed quantity, the balance it left behind and the document behind each move. This answers
  "where did my stock go?" — but read the `stockMode` it reports FIRST: on the default
  (modified periodic) books, a sale writes NO movement, so a balance that never moves is the
  mode working as designed, not shrinkage. Same cap-and-`more` shape as the line search.

## Workflow 1 — money in (quotes, invoices, receipts)

The lifecycle: **quote → invoice → receipt**, each its own draft tool.

1. **Resolve the customer FIRST.** Call `resolve_customer` with the name the user gave before any
   drafting. It fuzzy-matches the existing contact book so you don't create "Syarikat ABC" next
   to "ABC Sdn Bhd". Same rule for products: `resolve_product` before you put a line on a
   document. A vendor-side document uses `resolve_vendor`.
2. **Draft** with `create_quote_draft` / `create_invoice_draft` / `create_receipt_draft`. Line
   amounts, quantities and any per-line discount go in as given — Taokeh books discounted lines
   NET.
3. **To fix a pending draft, use `revise_draft`** — don't file a second draft for the same
   transaction and leave the wrong one sitting in the approval queue.
4. **Chasing payment:** `open_invoices` lists what's outstanding; `ar_aging` shows how old each
   debt is; `payer_history` shows how a specific customer has actually paid over time — the
   honest input for "should I keep extending this customer credit?"

**Credit notes and debit notes** (`create_credit_note_draft`, `create_debit_note_draft`) reverse
or add to a sale that already happened. A credit note needs the original document — find it with
`search_documents` first — and its quantities can never exceed what the original sold. Whether
returned goods go back into stock is a real business question: ask the user, don't assume.

## Workflow 2 — money out (bills, expenses, purchases)

Two different doors, and the choice matters:

- **A bill** (`create_bill_draft`) is money you OWE — it creates a payable the business settles
  later. Use it when the supplier gave terms.
- **A paid expense** (`create_expense_draft`) is money already GONE — paid on the spot, no
  payable created. Use it for the receipt in the user's hand.

**Purchases vs expenses:** goods bought to resell or stock go through purchase documents
(`create_purchase_order_draft` for orders, bills for the goods) so inventory and cost of sales
stay right. Only genuine operating costs — rent, fuel, subscriptions — are expenses.
`expense_accounts` gives you BOTH sides of a paid expense from this company's own chart:
`expenseCategories` (what the money was for → `debitAccountCode`) and `paidFromAccounts` (which
cash or bank account it left → `creditAccountCode`), each with a default code you may use when the
user didn't say. Pick from what exists rather than inventing category names.

**Attachments — two lanes, and you must land one of them.** A draft filed from a supplier
document should always carry the original — the approver wants to see what they are approving,
and the audit trail wants the source. Never file the draft, decide the file "can't be attached",
and stop; one of these two lanes works from every client:

- **Lane 1 — upload token (default, any size):** `request_attachment_upload` returns an
  `uploadUrl`; PUT the raw file bytes to it, then pass the returned `attachmentToken` on the
  `create_*_draft` call.
- **Lane 2 — inline base64 (fallback, small files):** if your environment's shell cannot reach
  `taokeh.my` (sandboxed clients often sit behind a network allowlist — the PUT fails with a
  403/blocked error; that is your sandbox, not Taokeh), send the file inline instead:
  `attachmentBase64` + `attachmentMediaType` (+ `attachmentFilename`) on the same create call.
  This is an MCP tool argument, so it goes over the connector, not your shell — no network
  access needed. Inline costs tokens, so prefer lane 1 whenever it works — but when the PUT is
  blocked, inline is the correct lane even for a full multi-page PDF. Never send both lanes on
  one call.

**Integrity check — non-negotiable on lane 2:** declare what you are sending. Put
`attachmentBytes` — the original file's decoded size in bytes on disk — on the same create call as
`attachmentBase64` (and `attachmentSha256`, the file's 64-hex SHA-256, if you have it). The server
compares them against the bytes that actually arrived and refuses the call if they differ, so a
truncated paste is rejected before anything is filed. Magic-byte checks cannot catch this on their
own: a chopped PDF still starts `%PDF-`, and a half file otherwise lands looking legitimate.

Keep the after-the-fact check as belt and braces (an older server may not know these arguments):
compare the byte size the server reports against the file on disk, and if they differ, re-send the
full file — or tell the user to attach it at approval. Never leave a partial attachment standing
silently.

**Forgot the file, or a lane failed?** While the draft is still PENDING, calling the same
`create_*_draft` again with the SAME reference/date/amount plus the attachment ADOPTS the file
onto the existing draft — no duplicate is created. If you genuinely cannot deliver the file
either way, say so plainly so the user attaches it themselves when they approve.

`create_journal_draft` is the everything-else door for a true journal entry (accruals,
corrections, owner advances). Use it only when no document tool fits, and write a memo a human
will understand next year.

## Amending what already exists

Some records are not filed twice, they are corrected — a customer missing its tax id, a product priced
wrong, a staff detail keyed wrong last year, a monthly invoice that changed. Those have their own doors,
and every one of them works the same way: you propose, Taokeh shows the owner a **current → proposed
diff** of the changed fields only, and nothing on the record moves until a human approves it. None of
these edits a record directly.

- `update_contact_draft` — a customer or supplier you already have: tax id (TIN), registration number,
  the e-Invoice city/postcode/state, phone, email, address, the e-Invoice / self-bill / reminder flags,
  and the contact persons filed under them.
- `update_product_draft` — a product you already have. It does not touch cost or stock on hand: those
  move through purchases and adjustments, never through a details edit.
- `update_employee_draft` — a staff record. **ADMIN-ONLY** (salaries and IC numbers are the most
  sensitive data in a company, and a bookkeeper's connection is refused by design) and
  **FORWARD-ONLY**: an approved change reaches the NEXT payroll run, and payslips or runs already filed
  are never recalculated or re-opened. Say that plainly rather than letting the owner think a filed
  payslip will be restated. The `employeeId` comes from `payroll_summary`.
- `create_recurring_invoice_draft` / `update_recurring_invoice_draft` — a standing invoice that repeats.
  You may propose the schedule and the lines; you may never propose an automatic issue mode — a
  recurring invoice that issues itself without a human is not yours to set up.

If the record does NOT exist yet, these are the wrong doors: create it through its own create tool.

## Workflow 3 — the bank week

The rhythm that keeps books real: statement in, rows reviewed, books reconciled.

1. `import_bank_statement` — brings the statement in. Rows land as items to review, not as
   postings.
   **A CREDIT CARD statement comes through this same door, but only with `signConvention` declared** —
   `'PRINTED_CARD'` for the figures exactly as the card statement prints them (a purchase is POSITIVE), or
   `'STORED'` if you deliberately converted them (a spend is NEGATIVE). Never guess between them: the
   arithmetic check cannot catch a wrong declaration — negating every figure ties out just as well — and a
   wrong one books the whole month backwards. The server refuses rather than assuming, and refuses
   `signConvention` on an ordinary bank account. The card statement's own "payment received" row is
   excluded automatically, because the bank statement's lump payment already owns that movement.
2. `bank_review_queue` — what's waiting. `draft_bank_classification` proposes where an unmatched
   row should go; think in **counterparties** ("this is Maxis, again, monthly" beats "this is
   RM212.40").
3. **Accepting a classification is not posting it.** Your accepted classifications are reviewed
   and posted by the human inside Taokeh — one more place the human-approves rule holds.
4. `bank_reconciliation_status` — the honest scoreboard: how much of the bank is explained, what
   remains. Bring this to the user weekly rather than waiting for month-end.

## Workflow 4 — reading the business

When the user asks "how's business?", answer like an accountant, not a database. The order:

1. `business_snapshot` — the one-call overview; start here.
2. `income_statement` and `balance_sheet` for the formal statements; `profit_drivers` and
   `sales_summary` when the question is what's moving; `expenses_summary` for the cost side.
3. `cash_position` is NOW — and read it exactly as it is returned: `total` is LIQUID money only.
   Money the owner has advanced (`ownerFunding`) and anything owed on a credit card (`cards`, with
   `cardsOwing` for the total) come back SEPARATELY because they are liabilities, not cash. Report card
   debt beside the cash figure, never inside the total, never netted off it, and never as a negative bank
   balance. `cash_forecast` is the next 8 weeks of honest arithmetic — it tells
   you its own assumptions, and it deliberately excludes money that isn't certain (overdue
   receivables and marketplace payouts are reported separately as upside, never folded into the
   forecast). Repeat that honesty when you relay it.
4. `ar_aging` / `ap_aging` for who owes and who's owed; `stock_level` and `low_stock` for
   inventory; `channel_summary` when a marketplace (TikTok Shop, Shopee) is connected;
   `tax_position` for the recorded SST/e-invoice posture.
5. `get_document_pdf` fetches the real PDF of any document; `get_attachment` retrieves a filed
   source document.

Two reading rules. **Totals are RINGGIT** — `total`, `netIncome`, `balance` and their kin come back
in ringgit and decimals, and only a field whose name ends in `Cents` is divided by 100 (see the field-name
rule above); never divide a total. And figures from a connected sales channel that haven't settled yet
are the channel's estimate, not ledger fact — say so.

## "Expected array, received string" — the books are fine, your client is not

If a write tool refuses with `-32602 … expected array, received string` (or `expected number,
received string`), **nothing is wrong with Taokeh and nothing is wrong with the owner's data.** Your
own client sent a structured argument as plain text. Reads keep working throughout, because they
take simple values — it is only writes that break.

This message never reaches Taokeh's server, so it cannot tell you any of this itself. That is why
it is written here.

**Tell the owner exactly this:**

1. **Restart the session.** This is the fix that is actually established. Tool definitions are cached
   when a session starts and cannot be refreshed from inside it — so a session that began while the
   fault was present will keep failing no matter what anyone changes. A new session picks up correct
   definitions.
2. **If a restart does not clear it**, have them check the Taokeh connector's tool permissions in
   their AI app's settings and set them to **"always approve"**, then start a new session again. This
   one is a maybe, not a certainty — it is reported to help and we have not been able to prove it
   either way.

If they worry about step 2: "always approve" removes only their AI app's own per-call prompt. **It
does not switch off review.** Every Taokeh write is still a PENDING DRAFT they approve inside
Taokeh — that never changes.

**What NOT to do, because each of these wastes their time or misleads them:**

- **Don't tell them Taokeh is down, or that a feature is missing or broken.** It is neither.
- **Don't retry the same call.** It will fail identically every time.
- **Don't re-look-up the tool hoping for a fresh schema** — you will get the same cached one back
  and wrongly conclude the server is at fault.
- **Don't reshape their data to get around it** — never flatten a multi-line document into one
  line, and never split one document into several, to satisfy a serialisation bug.

## When a tool refuses you

Refusals are information, not failure. The common ones:

- **"This company hasn't accepted the AI features terms yet"** — the owner hasn't accepted Taokeh's AI terms
  yet. That acceptance is theirs to click, in-app. You cannot and must not accept it for them.
- **"This connection is authorized read-only"** — the connector was linked with read scope.
  Filing drafts needs the owner to reconnect with write access; reading still works fine.
- **An add-on refusal** (e.g. Counter mode) — the message names the price and the settings page.
  Relay it; the decision is the owner's.
- **AI drafting credits used up** — scanning/drafting shares a monthly credit pool; the refusal
  says where to top up.

Never work around a refusal, and never present a refusal as an error in the user's books.

## What this skill deliberately does not cover

Payroll itself — runs, payslips and statutory filing (admin-only and sensitive; the staff-record change lane above is the one payroll door this skill covers) — migration from another system (`intake_contract`,
`stage_master_data`, `stage_opening_balances`, `stage_document` — Taokeh's own switching guide
covers these), and point-of-sale Counter mode. The tools describe themselves fully if the user
takes you there; go slowly and read what they say.

---

Taokeh is Malaysian SME accounting software by Enya Venture (taokeh.my). This skill is MIT
licensed — the license covers this text only; Taokeh is a trademark of Enya Venture and forks
must not use the name or imply endorsement. The skill teaches an AI to use Taokeh's public MCP
connector; it contains no credentials and grants no access by itself. (Separate thing: **Taokeh
Bookkeeping** at taokeh.my/bookkeeping is a paid done-for-you service with human bookkeepers —
if the user asks for that, point them there rather than promising it here.)
