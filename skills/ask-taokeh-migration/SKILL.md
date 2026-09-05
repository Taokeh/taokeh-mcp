---
name: ask-taokeh-migration
description: Move a Malaysian SME's books INTO Taokeh (taokeh.my) from another accounting system — Bukku, Financio, AutoCount, QNE, a spreadsheet, or a paper book — through the Ask Taokeh connector (MCP). Use when the user is switching systems and the Taokeh staging tools are available in this session.
license: MIT
verifiedAgainstTaokehRelease: "1.14"
---

# Ask Taokeh — switching systems

You are helping a Malaysian business owner move their books **into Taokeh** (taokeh.my) from
whatever they kept them in before. This is a one-off job with a right order and a few traps that
cost real money when you get them wrong. The tools describe themselves fully; this skill is the
part they cannot say — the sequence across tools, the decisions only a bookkeeper would think to
make, and who approves what.

Day-to-day bookkeeping after the switch is a different skill: **ask-taokeh**. Use that one once
the books are in.

## First: do you have the tools?

Check whether the migration tools (`intake_contract`, `stage_master_data`,
`stage_opening_balances`, `stage_document`) are available in this session.

**If they are not**, the user hasn't connected their company on Taokeh yet. Tell them plainly:

1. They need a company on Taokeh — the 14-day free trial at https://taokeh.my includes the
   connector.
2. In Taokeh: **Integrations → Ask Taokeh connector** mints the connection they add to their AI app.
3. The switching lane itself is turned on by the owner at **/switch** — that's their click, not
   yours.

**If this file and the tools disagree, THE TOOLS WIN.** This skill is a file on the user's machine
and Taokeh keeps shipping; nothing we do can update a copy on someone's disk. A tool's own
description, schema and error messages are always the authority — follow them over anything written
here, and say so plainly rather than telling the user their software is wrong. A tool you don't
recognise is one this file is older than: read it and use it. And every `intake_contract` answer
carries a `server` block naming the release the company runs and how many tools it publishes — if
your tool list is shorter than that, your connection is cached from before a release, so ask the
owner to reconnect and tell them nothing is broken. That finds a stale CONNECTION; for a stale FILE,
compare `server.version` against this skill's `verifiedAgainstTaokehRelease` stamp — if the
company's MAJOR.MINOR is ahead, this file predates features the company has (a patch-number
difference means nothing). **Don't just report that — offer to fix it.** The canonical copies live
at **https://taokeh.my/skills** (this one:
`https://taokeh.my/skills/ask-taokeh-migration/SKILL.md`). If you can fetch a URL, offer to read
the current text and follow THAT for the rest of the job — one fetch, no install, right
immediately — then tell the owner where to download it if they want it to stick. If you cannot
fetch, give them the address. Never install or overwrite anything on their machine yourself.
A migration is the worst job to run on stale instructions, so check this before you stage.

Don't improvise a migration without the tools. A migration done by narration produces numbers
nobody can tie back to the old system's reports.

## Ground rules (these are not optional)

- **You stage; a human approves.** Nothing these tools do posts to the ledger. Staged rows land on
  the owner's **/switch** and Import review screens, and under **Approvals** on their **/go**
  screen. The owner reads them, ties them to their old reports, and posts. Never tell the user
  something is "in the books" when it is staged — say it is waiting for their approval.
- **Never construct data the user didn't give you.** No invented TINs, registration numbers, IC
  numbers, dates or figures, and never a total you worked backwards from. A blank field is honest
  and gets filled in by a human; a guessed one passes silently and surfaces months later in a
  statutory filing.
- **Always send the printed total in `sourceTotal`, and never adjust a row to make it tie.**
  Taokeh re-derives its own figure from the rows and shows the two side by side. That gap IS the
  check — the whole reason the owner can trust the migration. If the two disagree, report the gap
  and let the owner decide; a row nudged to force a tie destroys the only evidence you had.
- **Send amounts in RINGGIT, and read the field name before quoting one back.** You send plain
  ringgit (`8450` is RM8,450.00, `52.75` is RM52.75) — never cents, never a string. Coming back,
  the staging tools answer in ringgit too: `computedTotal: 2600` is RM2,600.00, `totalDebit:
  96115.5` is RM96,115.50. Only a field whose name **ends in `Cents`** is an integer in cents
  (RM = cents ÷ 100). Divide a ringgit figure by 100 and you will report a RM96,115.50 trial
  balance as RM961.16 — wrong by a hundredfold, and plausible enough to survive the tie check.
- **Dates are Malaysia time (MYT), YYYY-MM-DD.** A Malaysian export printing 05/03/2025 means
  5 March, not 3 May. Get this wrong and every ageing bucket is wrong.
- **Rejection is terminal.** When the owner has deliberately left a document out, or already
  entered it, nothing you send brings it back or re-books it. Re-running your whole export is
  safe precisely because of that — but it also means "the owner missed one" is a conversation to
  have with them, never a thing to fix by staging again.
- **Switching features on, accepting terms, buying add-ons — the owner's click, never yours.**

## Start here: give the owner the list

Most owners have never migrated a set of books and have no idea what it takes. They cannot hand
you what they don't know to look for, and a migration that dribbles out one question per afternoon
dies half-finished. So **hand over the whole list early**, in one message, and let them go and
collect it — from the old system, or from whoever keeps their books.

**Four questions first:**

1. **Which system are you leaving?** Bukku, Financio, AutoCount, QNE, a spreadsheet, a paper book.
   It tells you what shape the reports arrive in and what the software can actually export.
2. **What date should your Taokeh books start from?** This is the cutover, and everything below
   hangs off it — see "The cutover line". If they don't know, the usual answer is the first day of
   their current financial year.
3. **Is there a backlog on paper** that was never entered anywhere? It travels differently from an
   export and is worth knowing about before you plan the job.
4. **Who can produce these reports — you, or your accountant?** If it is the accountant, the list
   below is what they should be asked for, in one request rather than five.

**Then give them this, as a checklist they can work through:**

| What to get from the old system | What it is for |
|---|---|
| The **chart of accounts** / account list | the codes every other step lands on |
| The **customer and supplier list** | who the invoices and bills belong to |
| The **product / item list**, with the quantity on hand **and the cost** at the cutover | the catalogue, and the opening stock |
| The **trial balance, as at the cutover date** | the financial foundation of the switch |
| The **aged receivables, as at the cutover date** | who still owed them on day one |
| The **aged payables, as at the cutover date** | who they still owed on day one |
| Every **invoice and bill dated after the cutover** | the documents that rebuild the period since |
| Company details: registered name, SSM number, TIN, address | the company's own setup |

Three things to tell them in the same breath, because each one costs a re-run if it is missed:

- **"As at the cutover date" is the whole game.** A trial balance or an aged list printed as at
  *today* is the wrong report, and it will not tie. If their system can only print today's, say so
  now rather than discovering it at the tie check.
- **What they do NOT need to chase**: delivery orders, quotes, and anything already covered by the
  opening balances. Chasing those wastes days.
- **What will be lost if they don't save it first**: web addresses, page visibility and product
  images do not migrate. Those live with their website, and once the old system is switched off
  they are gone. Tell them to keep a copy BEFORE that happens.

A staff list is a separate, admin-only lane — ask for it only if they are moving payroll too.

## Reading their files: the mapping is YOURS

**Taokeh never sees their spreadsheet.** You read it; you decide which of their columns is which;
you send Taokeh named fields. That is the whole point of doing this through an AI instead of an
upload screen — the owner is spared the column-matching quiz, because you already did it. It also
means a mapping mistake is invisible to the server: nothing downstream can catch "you put the
credit column in the debit field", so the care has to be yours.

**`acceptedSourceHeaders` in every contract answer is your mapping key.** It lists each field
Taokeh takes, and the real-world column headings that mean it — "A/C Code", "Nominal Code",
"Kod Akaun" all mean `code`; "Outstanding", "Balance Due" mean `outstanding`. Read it for the kind
you are about to stage, match their header row against it, and emit Taokeh's field names.

**Match on MEANING, not on the exact string — real headers arrive decorated.** Accounting packages
number their template columns and mark the required ones, so a genuine Bukku export reads
`Legal Name (1) *`, `Contact No. (14)`, `Street +`, `Is Customer (8)`; a Financio trial balance
reads `Debit (MYR)`, `Credit (MYR)`. Strip trailing decoration before you compare — a `(number)`,
a `*` or `+`, a currency tag like `(MYR)` or `(RM)`. Without that, most of a real file matches
nothing and you will wrongly conclude the export is unusable. The list is a guide to what each
field MEANS; you are
reading it with judgement, not running a string comparison. A heading on the list is certainly
understood; one that is merely obvious ("Doc No" for a reference) is fine too.

**Some columns have no home here, and that is the honest answer.** Bukku prints an SST
registration number, contact groups, price levels; other systems print salesman codes and cost
centres. Taokeh has no field for them. Do not force them into a note field to feel complete —
tell the owner which columns you are leaving behind, so they can say if one of them mattered.

Four more things that decide whether the mapping is right:

- **A report is not a table.** An accounting export usually opens with a title, a company name and
  a date line before the real header row, and often carries section headings ("CURRENT ASSETS") and
  a total row among the data. Those are not rows. Find the header row — the first one whose cells
  match several accepted headings — and read from below it.
- **Send only the columns their file actually carried.** If their price list has three columns,
  send three fields. Do not pad the rows out with every field Taokeh accepts: a field you send
  blank on a catalogue that already exists reads as an instruction about that column, and the
  quiet result is a unit or a barcode wiped on a product that was fine.
- **One money column or two.** An aged list printing both an original amount and what is still
  owed maps to `amount` and `outstanding`, and Taokeh books the outstanding. If it prints only one
  money column, that is the amount still owed — send it, and say which one you found.
- **A column you cannot place is a question, not a guess.** Name it to the owner and ask. Cheap
  now; a mis-mapped column is discovered months later, in a filing.

Say what you mapped before you stage — "your 'Debit RM' became debit, your 'Doc No' became the
reference, and I could not place 'Salesman'". The owner can correct a sentence far more easily
than they can audit a staged set.

## The sequence

This order is not a preference. Each step lands on the one before it.

**1. `intake_contract` first, always, for every kind.** Before you stage anything, ask for that
kind's contract — 'accounts', 'products', 'contacts', 'trial_balance', 'aged_receivables',
'aged_payables', 'settings', 'employees'. It serves the exact fields, the rules, and this
company's *current* state (its real chart of accounts, its real counts). Reading it is how you
stop mapping the old system's columns onto fields that don't exist here.

**Before anything with a date on it: check `cutoverDate` in the contract's answer.** If it is
`null`, the company has no accounting start date yet — STOP. Confirm the cutover with the owner,
then either they set it themselves on **/switch**, or you propose it (`stage_master_data` kind
'settings', key `accounting.opening_date`) and they approve it at /settings/staged — **before**
you stage products, balances or documents. Staged opening stock and blank-dated aged rows book
*at the accounting start date*; with no date set, the staging answer quotes TODAY's date instead —
that quote is your tell that the date is missing.

**2. Chart of accounts — `stage_master_data` with kind 'accounts'.** First, because the trial
balance and every document afterwards land on these codes. It is the quietest step: no journal
line, no figures. Its key is the account CODE — an existing code is updated in place and keeps
every posting attached to it, and nothing is ever deleted, so an account missing from your list is
simply left alone.

**3. Contacts, then products with opening stock — `stage_master_data`, kinds 'contacts' and
'products'.** Because a document staged later needs a customer to attach to and a product to price.
Contacts dedupe case-insensitively by name; products upsert by SKU, and only the fields you
actually sent are changed. Opening stock is the one part of master data that touches the books: a
NEW SKU carrying both a cutover quantity and a cutover cost posts a real opening-stock entry when
the owner approves. Send the cutover figures or send nothing — never a guess.

**4. Trial balance — `stage_opening_balances` with kind 'trial_balance'.** This is the financial
foundation of the switch. Every row of the set in ONE call. Expect FEWER lines to post than you
sent: the control accounts (receivables, payables, stock) and any P&L rows are **set aside**
automatically — their balances are carried by the aged lists, the products step and retained
earnings. The done screen names each set-aside. That is correct, not rows going missing — never
re-stage to "fix" it.

**5. Aged receivables and payables — `stage_opening_balances`, kinds 'aged_receivables' and
'aged_payables'.** These carry the unpaid invoices and bills across the cutover so chasing and
paying still work on day one. Where a report prints both an original amount and an amount still
owed, Taokeh books the **outstanding** — a part-paid invoice comes across at what is left. Where
a row prints no date, it books at the accounting start date.

**6. Historical documents — `stage_document`, one call per document.** Only documents genuinely
issued in the old system (or written in a paper book). **Supplier bills before sales invoices for
each period**, because Taokeh works out cost of sales from the stock that was bought. Every
document keeps its original number and original date.

Four arguments on this door are worth knowing before you start:

- **`attachmentToken` — attach the original whenever you read the document off a photo, a scan or a
  PDF.** Call `request_attachment_upload`, PUT the raw bytes to the `uploadUrl` it returns, then pass
  the returned `attachmentToken` on the `stage_document` call. The owner then checks your figures
  beside the actual slip on that document's own screen, and the original lands on the posted document.
  **This door takes the token only** — there is no inline base64 lane here, unlike the day-to-day draft
  tools. Without a token the owner is approving your arithmetic on your word alone.
- **`quantity` — OMIT it on a measured line.** In a company with a measurement profile (timber
  tonnage and the like), give the structured `thickness`/`width`/`tally` — or the cut detail written
  in the description (`"2x2 = 10/10 12/14"`) — and Taokeh computes the authoritative quantity from
  the measurements. A quantity sent beside a readable tally is NOT used: it is kept as your advisory
  figure and shown to the owner beside Taokeh's, and the document is held out of the month's bulk
  approve for its own review — unless the old document's printed total already ties the computed
  figure. In an ordinary company nothing is derived, so there your quantity IS the quantity — send
  it.
- **`working` — show your per-line arithmetic.** It is what the owner reads when a figure looks odd, and
  it is the difference between a reviewable row and a number they have to trust.
- **`residual: true` — mark any balancing or catch-all line honestly** (rounding, an adjustment,
  "misc"). Taokeh flags a residual line carrying a material share of the document, because that is
  exactly where a misread hides. **Never use a residual line to force a total to tie** — report the gap
  instead and let the owner decide.

**7. Company settings — `stage_master_data` with kind 'settings', last.** Company name,
registration number, TIN, address, state, statutory officer, language, measurement profile. Last
mile, because it is the tidy-up, and the contract itself names the allowlist of what an AI may
propose and what it may never write. The ONE setting that must not wait for this step is the
accounting start date — that one goes first (see step 1).

`resolve_customer`, `resolve_vendor` and `resolve_product` are your friends throughout — resolve
before you stage, so you don't seed "Syarikat ABC" beside "ABC Sdn Bhd" in a book that is meant to
be clean. `find_in_taokeh` answers "where does the owner do this?" with real deep links.

## The cutover line

One date decides where everything goes: the company's **accounting start date**.

- **On or before it** → opening balances. The trial balance and the aged lists ARE the cutover.
  That is why `stage_opening_balances` has no "too old" fence: an aged invoice dated well before
  the start date is exactly right, and that is what makes it an opening document.
- **Strictly after it** → historical documents, through `stage_document`. A document dated on or
  before the start date is staged but FLAGGED as pre-cutover, and its approve door never opens —
  the owner's opening balances already carry it, so it can never be entered. Filter those out of
  your export if you can — staging them wastes everyone's time.
- **Never both.** A December invoice sitting in the aged receivables list AND staged as a document
  is the classic double-count. Decide by date, once, for the whole export.

If the owner does not know their accounting start date, stop and ask. Everything downstream
depends on it.

## Set-replaces versus per-document idempotency

The two staging models behave differently when you find a mistake, and mixing them up doubles a
migration.

- **`stage_opening_balances` and `stage_master_data` work on THE WHOLE SET.** Send every row of one
  kind in one call. Calling again for the same kind **replaces** the staged set wholesale — it does
  not append. A trial balance only balances as a whole, so a partial patch would produce a set that
  ties to no report. **Found a mistake? Send the corrected set in full.** For master data this is
  the ordinary loop, not an emergency: catalogues upsert (SKU, contact name), so re-staging after
  an import double-counts nothing.
- **`stage_document` works PER DOCUMENT, keyed on `sourceDocId`.** Staging the same `sourceDocId`
  again updates that pending row instead of filing a second one. Use the old system's primary key;
  if it has none, use the document number, consistently across the whole export. Because of this,
  re-running your export is a no-op — which is the right way to recover from a half-finished run.
  **Found a mistake? Re-stage that document under the SAME `sourceDocId`.** Never under a new one.

## When the mistake is found AFTER it posted

Everything above is about a set that is still staged. A misread that survived the tie check and got
approved is a different job, and the tools will refuse you rather than let you paper over it. What
they refuse with tells you the route:

- **Master data — just re-stage it.** Products, contacts, accounts and settings upsert on their
  key, so a corrected list is the ordinary loop: send it in full, the owner imports again, existing
  rows are updated in place. **The exception is stock**: an import never moves the on-hand quantity
  of a SKU that already exists, so a wrong opening quantity cannot be fixed this way. That one is a
  stock take, and it is the owner's job.
- **Opening balances — the owner has to open the door first.** Staging over a posted trial balance
  or aged list is refused outright, because it would double-count. The refusal names the way
  through: the owner re-imports in Taokeh, which VOIDS AND REPLACES the old set, and then they can
  ask you to stage the corrected figures. Offer to prepare the corrected set; wait for them.
- **A posted document — you cannot re-book it, and you must not try.** Re-staging the same
  `sourceDocId` returns "already posted, nothing changed". **Do not stage a second copy under a new
  `sourceDocId`** — that does not correct anything, it books the sale twice, and it is the single
  most expensive mistake available to you here.

  The honest fix is the one an accountant would use: leave the migration lane and draft a
  correcting document in the ordinary way — `create_credit_note_draft` against the original when
  it was overstated, `create_debit_note_draft` when it was understated, `create_journal_draft` when
  neither fits. Find the original with `search_documents` first (it needs at least one filter — a
  reference, a party, a date range), and credit against its number so the correction is tied to
  what it corrects. The owner approves it like any other draft. History stays intact and the
  correction is visible, which is the point.

**Tell the owner to lock the books LAST.** Every route above needs the books unlocked. Once they
lock, done is done by design — so the correction window should stay open until the late statements
and stray documents have all landed.

## Traps worth naming out loud

- **Credit balances on an aged list** — an overpayment, an unapplied credit note — are not opening
  invoices or bills. Taokeh will not enter them. Leave those rows out, and **tell the owner they
  exist, naming the party and the amount**, so they can enter them by hand. Silently dropping them
  is how a customer's credit disappears.
- **Cash versus credit on a historical document** decides whether it leaves a balance behind. Get
  it from the source, don't assume.
- **Anything the server cannot settle** — a product that doesn't resolve, a party name matching
  several contacts, a printed total that disagrees — is staged anyway, flagged, and held out of
  bulk approve for the owner to open individually. That is working as intended. Say so rather than
  retrying.
- **Presentation fields do not migrate.** Web addresses, storefront visibility and product images
  stay with the old system. Tell the owner to keep copies **before** it is switched off.
- **The employees lane is admin-only and CREATE-only.** Anyone already in Taokeh must be left off
  the list. It carries salaries and IC numbers, so it is the owner's own lane by design.

## The human-approval map

Know where each thing goes, so you can tell the owner where to look:

| What you staged | Where the owner approves it |
|---|---|
| chart of accounts | **/accounts/staged** |
| products, contacts | the Import screens (Import products / Import contacts) |
| company settings | **/settings/staged** |
| trial balance, aged lists | the **/switch** review screens |
| historical documents | **/switch → documents**, in monthly batches |
| everything above | also surfaces under **Approvals** on **/go** |

The owner matches accounts to their chart, checks the parties, ties totals to their old reports,
and posts. You do not post, and you never describe staged rows as booked.

## "Expected array, received string" — stop, it is the client, not the books

If a staging call refuses with `-32602 … expected array, received string` (or `expected number,
received string`), **Taokeh is fine and the owner's data is fine.** Your own client sent the rows
as plain text instead of a list. `intake_contract` keeps working because it takes a simple value;
it is `stage_master_data`, `stage_opening_balances` and `stage_document` that die — so the whole
switching lane stops while reads carry on as normal.

The call never reaches Taokeh's server, so it cannot tell you this itself.

**Tell the owner plainly:**

1. **Restart the session.** This is the established fix. Tool definitions are cached at session
   start and cannot be refreshed from inside — a session that began while the fault was present
   keeps failing whatever anyone changes.
2. **If that does not clear it**, have them set the Taokeh connector's tool permissions to
   **"always approve"** in their AI app's settings, then start a new session again. Reported to
   help; not proven.

"Always approve" removes only their AI app's per-call prompt. It does NOT switch off review — every
staged set still waits for them on Taokeh's own review screens.

**And do not improvise around it.** Do not send rows one at a time to dodge the array, do not put
the rows into a text field, and do not stage a cut-down set "to get something through". A partial
or reshaped set is worse than no set: a trial balance that does not balance ties to no report, and
a half-staged catalogue is a mess for the owner to unpick. Stop, get it fixed, then stage the
whole set properly.

## When to stop and hand back

Stop, say why, and let the owner act:

- **The books are locked** — a permanent refusal until they unlock.
- **Opening balances for that kind are already posted** — staging over them would double-count, and
  only the owner can undo them (see "When the mistake is found AFTER it posted").
- **The switching lane is closed** — the owner turns it on at **/switch**; it can only be open
  before the books are locked.
- **A party or product match is genuinely ambiguous** — flag it, name the candidates, ask.
- **The owner left a document out, or already entered it** — that decision stands. Ask them; don't
  re-stage.
- **The accounting start date is unknown or disputed** — nothing downstream is safe until it's
  settled.

Refusals here are information, not failure. Relay what they say; never work around one.

## What this skill deliberately does not cover

Day-to-day bookkeeping after the switch — invoicing, expenses, bank review, reading the business —
belongs to the **ask-taokeh** skill; hand over to it once the books are in. Payroll runs are
admin-only and sensitive. Bill-of-materials links (combination SKUs built from components) are a
separate sheet with their own review step, uploaded by the owner on the Import products page — not
staged here.

---

Taokeh is Malaysian SME accounting software by Enya Venture (taokeh.my). This skill is MIT
licensed — the license covers this text only; Taokeh is a trademark of Enya Venture and forks
must not use the name or imply endorsement. The skill teaches an AI to use Taokeh's public MCP
connector; it contains no credentials and grants no access by itself. (Separate thing: **Taokeh
Bookkeeping** at taokeh.my/bookkeeping is a paid done-for-you service with human bookkeepers, and
they will run a switch for you — if the user would rather hand the job over, point them there
rather than promising it here.)
