# Gilded Hand headquarters — local implementation

## Open the website

From the repository root, run `node scripts/serve-hq.mjs`, then open **http://127.0.0.1:8080/hq.html**. On this workstation Node was not on PATH; a portable Node 22 executable was downloaded into the ignored working directory, so the equivalent PowerShell command is:

```powershell
& '.hq-work/node.exe' scripts/serve-hq.mjs
```

The main `index.html` sidebar and homepage both have **Gilded Hand HQ**. The homepage button is beside the lore/calendar actions. The existing Wayfarers’ Accord `guild-board.html` also links to it. HQ has return links to both. The two organisations remain separate. HQ uses the site's existing `static/css/variables.css` and `base.css`, ordinary HTML entry points, and browser scripts; it introduces no framework or package installation.

The supplied preview server binds to loopback only and refuses `DM_Private`, `.hq-work`, and maintainer documentation. Do not serve or publish the entire repository with a generic directory server: it contains private campaign notes. No deployment, remote push, campaign account write or publication was performed. Existing hosting configuration has not been redesigned by this feature.

## Source restoration and note preservation

This workspace initially contained the campaign notes and assets but none of the advertised main website HTML, CSS or JavaScript. There was no `.git` checkout and no Git executable. Source was retrieved from `DoyleAaron/D-and-D-Web-Page`, main commit **9150eb5a4ab6d584db6444ded0e33cd4852e0a18**, using the GitHub tree and raw-file endpoints, into `.hq-work/upstream/`. Only **60 missing code/configuration files** were copied into the working tree; existing files were skipped. No Markdown notes, Lore, DM_Private files, images, audio, or existing README were overwritten. On the user's subsequent commit request, portable Git was installed under ignored `.hq-work/` and this folder's Git metadata was attached to that original source commit on `codex/gilded-hand-hq`, without replacing working files. Only website implementation, tests and the new maintenance guide are included in the commit; existing campaign-note changes remain unstaged.

There were no applicable `AGENTS.md` files in the workspace, its checked parent directories or the upstream tree. The actual app entry points were verified in the source: `index.html`, `guild-board.html`, `map.html`, and `dm.html`.

During implementation, other work changed some local campaign notes. These changes were retained, and the relevant updated ledger, handout, progression and quarters notes were re-read. HQ now uses the user's latest manually confirmed **24 gp / posted rank 21**, superseding the earlier displayed 20 gp, 9 cp without inferring a receipt breakdown or rank change. The source restoration manifest and initial note hashes are in `.hq-work/` for local auditing; that directory is not player content.

## Manual campaign configuration

**`data/hq-data.js` is the single editable source for the website's current state and terms.** Nothing imports private notes at runtime, derives rankings from totals, persists calculations, awards XP or changes access. Update these fields deliberately after play:

| Field | Edit here |
| --- | --- |
| Registered teams, posted ranks, deposited money | `standings` — explicit rank, team, `depositedCp` string |
| Public accounting caveat | `sourceNotice` and `boardNote` |
| Current counting-house crew payout | `currentCrewPercent` — currently 25; independent of rank calculations |
| Rank bands and general access | `ranks` |
| Mission difficulty and required rank | `missions` |
| Ward names, location and scouting prices | `scouting.districts` — `baseCp` strings |
| Scouting detail and rank/respect requirements | `scouting.depths` |
| Room tiers, furnishings, storage and required ranks | `quarters` |
| Trader buy percentages | `trader.rates` |
| Map image and percentage markers | `map` |

Ranks are informational. Every service and calculator remains usable regardless of the displayed rank. The player page deliberately does not expose staff motives, NPC levels, private party dossiers, future rival hand-ins, mission loot, traps, private access routes or unplayed events.

### Recorded standings and unresolved history

Initial sources: `DM_Private/Campaign 2/Guild/Handouts/Leaderboard.md`, `03 Teams and Standing.md`, and the receipt entries in `08 DM Tracker.md`. The user's subsequent manual updates confirm **Hollow Pence at 120 gp and rank 17** and **Fantastic 4 at 24 gp, rank 21**. Candle Dogs are 18, Sixth Key 19 and Marsh Rats 20. These are explicit data edits, not automatic re-ranking. **Do not sort the board by calculator results.** The underlying campaign notes have been left untouched.

The tracker explicitly preserves a historical conflict: older preparation described only 10 sp / 1 gp deposited; retained later entries add 17 gp, 9 cp and then 2 gp, totalling 20 gp, 9 cp. Sources, depositors and timing of those entries are unresolved. The user's latest confirmed 24 gp total supersedes that aggregate for the public board; HQ retains a player-safe historical caveat. It does not invent a receipt breakdown, resolve the chronology or award XP. Member-name discrepancies in the notes are not needed by the public board, which displays only team names.

## Counting-house arithmetic

`static/js/hq-core.js` contains pure calculation functions shared by UI and tests. `convertCopper` reuses the original campaign calculator's **BigInt sum, division by 16, and remainder**. Its agreement with the original function is tested over deposits and all valid carries; the private calculator and its mission examples remain untouched.

- Each coin field requires a non-negative whole number, with arbitrary denomination counts (e.g. 70 sp is valid).
- Counting accepts platinum, gold, electrum, silver and copper. **1 pp = 10 gp = 20 ep = 100 sp = 1,000 cp**. Results are expressed in gp/sp/cp; 1 pp produces 62 XP per character with 8 cp carry.
- Empty required coin/quantity fields, negatives, decimals, exponent notation and excessive values show errors. Inputs are not truncated into a different valid number.
- Blank optional previous carry means zero; explicit carry must be 0–15 cp.
- Full deposit plus carry produces XP **per character**, without division by party size or deduction of guild cash.
- New crew payout is `floor(new deposit × current percentage / 100)`, independent of previous carry and XP. Starting crew share is 25%, not a 25% guild deduction.
- Monetary totals, conversion totals and maximum potential returns are limited to **999,999,999,999,999 cp**. BigInt prevents floating-point rounding. Sale quantities are **1–1,000,000 named units** per line. Invalid results are cleared, not silently reused.

## Games and current rule overrides

The complete rules were read from `Guild/Gambling/*.md`. The UI's rules are opened by native `details/summary`, supporting pointer, touch and keyboard Space. Stakes are not checked against player balances or house till records. One resolved round is locked until **New round**, preventing repeated submissions from resolving it twice. Random rolls use `crypto.getRandomValues` with rejection sampling.

| Game | Valid stake | Win | Total returned | Net profit on win |
| --- | --- | --- | --- | --- |
| Seven at the Gate | 1–5 coins of the selected denomination | Low 1–49 or High 52–100 on d100; 50–51 always loses | 2 × stake | 1 × stake |
| High Bones | Exactly 2 or 4 coins of the selected denomination | 3d6 sum of 12–18 | **3 × stake** | **2 × stake** |
| The Empty Cup | Any positive whole number of selected coins within limit | Choose one of four cups; exactly one uniform winning cup | **4 × stake** | **3 × stake** |

Every table has a denomination selector: platinum, gold, electrum, silver and copper. This extends the old copper-only stake counts to the selected coin type: e.g. Seven accepts 1 gp or 5 pp; High Bones accepts 2 gp or 4 sp. All values convert to integer copper before payout. All losses return zero; no ties or pushes. Per the user's latest payout change, High Bones earns **2× stake in profit**, returning **3× total**: a 2 gp win returns 6 gp, net +4 gp. Its 2-or-4-coin stake choices and 37.5% win chance remain in place. The Empty Cup accepts 1 gp (=100 cp), which wins **4 gp total / 3 gp net**. It has a 25% win chance and zero expected house edge under the requested new payout. It no longer uses the older 3.5× total return, 2.5× profit, 12.5% house edge, or 2/4 cp restriction. All HQ help/outcome text uses the new rules. **Older private preparation files are deliberately left intact to preserve uncommitted notes; these documented overrides apply to the implemented games.**

## Scouting defaults and confirmed geography

The local generated layout had a different area list and no named magical district. The user supplied the current ward order and wall locations during this task and confirmed **Magistracy Quarter** as the magical district. These instructions supersede the older generated layout without editing it.

| Ward, lowest to highest | Wall location | Basic fee |
| --- | --- | ---: |
| Lower Ward | Inside | 10 gp |
| Outer Boroughs | Outside | 15 gp |
| Old Cross Roads | Inside | 20 gp |
| West Gate | Outside | 30 gp |
| Long Stable | Outside | 40 gp |
| Craftsman Ward | Inside | 50 gp |
| Seal House | Inside | 65 gp |
| Merchant Heights | Inside | 80 gp |
| Platinum Shelter | Inside | 100 gp |
| Magistracy Quarter — magical district | Inside | 150 gp |

**Price = district base × detail multiplier.** Basic is ×1, extended ×2, detailed ×4. **All scouting depths are available at every rank**, per the user's updated requirement; no rank or respect restriction applies. Thus the most detailed magical scouting costs 600 gp. The 10 gp minimum comes from `Guild/Areas/Scout_Desk.md`. The full district table and multipliers are new expensive-service defaults, superseding the older flat 20 gp detailed report price. No intelligence is generated or charge deducted.

## Quarters defaults

The starting accommodation remains **four separate 10 × 10 ft rooms**, one for each character, with the established basic furniture and locking chests. There is no room assignment UI and no inventory record.

No four-tier residence upgrade schedule or storage amounts were established in the provided quarters notes. The new tiers use existing HQ access thresholds: 21 (start), 15, 8 and 4. The starting chest uses a 12 cubic foot / 300 lb capacity; upgraded personal capacity is 24/600, 36/900 and 48/1,200 per character. Shared additional storage is respectively none, 12/300, 60/1,500 and 120/3,000 (cubic feet/lb). The first tier's four-chest aggregate is explicitly not extra shared capacity. Weight or volume limits apply, whichever is reached first. Upgrade room sizes/furnishings and capacities are documented design defaults, fully editable in `quarters`.

Mission tiers retain access thresholds 21, 15, 8, 4 and senior invitation at 2. The short difficulty names/descriptions are UI summaries, not CR or level gates and not new missions.

## Trader catalogue and prices

**`data/hq-catalogue.js`** holds the mundane catalogue, grouped by category. Each row is `[name, retailCopper]`; the generated stable ID comes from its name. Quantity means one named unit or named bundle (20 arrows, 10 pitons, a pair of gloves, etc.). Search includes names and categories; blank search shows all matching category entries.

Campaign retail overrides from `Guild/Trader/Stock.md` are preserved: e.g. oil flask 1 gp, hooded lantern 8 gp, bullseye lantern 12 gp, small bell 1 sp, waterskin 2 sp, empty sack 1 cp. Missing ordinary weapons, heavy armour, tools and gear use the 2014 SRD 5.1 equipment baseline. After comparison with the official [2014 Equipment tables](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment) and SRD 5.1, the catalogue has **242 entries**, up from 169. The audit added 73 items across adventuring gear, instruments/gaming sets, spellcasting supplies, equipment packs, tack/harness and trade goods. These include a climber's kit, miner's pick, block and tackle, spyglass, poisoner's kit, the remaining listed musical instruments, ordinary foci/holy symbols, all seven complete equipment packs, saddles and cloth/spice/metal trade units. Existing weapons and armour prices were checked and retained.

Campaign prices deliberately take precedence when the official equipment table differs. Examples: oil is 1 gp here rather than the standard 1 sp; hooded/bullseye lanterns are 8/12 gp rather than 5/10 gp; the small bell is 1 sp rather than 1 gp; five paper sheets cost 1 sp rather than five standard 2 sp sheets; an empty vial is 5 sp rather than 1 gp; sealing wax is 1 sp rather than 5 sp. No duplicate standard-price row replaces those offers. Fixed mission values and ordinary salvage defaults remain separate from the official retail references.

The catalogue covers ordinary melee/ranged weapons, ammunition, all armour classes, shield, tools, clothing, containers, gear and ordinary salvage. Unenchanted spellcasting foci and a blank spellbook are ordinary equipment; no value is assigned to recorded spells. A complete pack is valued once as a bundle, or its actual contents are estimated separately, never both. Healing potions and rare/magical items remain manual, as do animals, vehicles and paid services. It is a sell-value reference, not a stock-count or purchase system.

Current offers are new low defaults: **15% weapons/armour/shields, 10% most other equipment, 5% ordinary salvage**. This intentionally replaces the old general half-retail offer for this calculator. Each offer rounds down **per unit** before multiplying quantity; very cheap objects can receive a displayed zero-copper offer. No minimum coin is silently added. Modify `trader.rates`; an individual item may instead define `offerCp` for a fixed offer. Mission-specific sale values remain manual and must not be discounted again. Salvage retail reference values are new mundane defaults, not hidden mission prices.

The random mixed-junk lot has been removed at the user's request. Ordinary catalogue salvage retains its fixed editable buy offers. Rare and magical items are manual.

Equipment source/attribution: this work includes material from the [System Reference Document 5.1](https://www.dndbeyond.com/attachments/39j2li89/SRD5.1-CCBY4.0License.pdf) by Wizards of the Coast LLC, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode). Campaign price overrides, salvage, service rules and buy offers are adaptations.

## Add the future HQ image and place markers

1. Put a **player-safe** image at `static/images/gilded-hand-hq.png` (or another local image path). Do not copy a private annotated mission map.
2. With the preview server running, open **http://127.0.0.1:8080/tools/hq-map-editor.html**. There is no link or editing control on the player page. The editor enables itself only on localhost/loopback.
3. Set its image path relative to the website root and its accessible description. You can preview a chosen local file before copying it, but selecting it does not upload/copy it.
4. Select a service, then click/tap to add or move its marker. For keyboard placement, enter X/Y percentages and choose **Add / move marker**. Select a marker by its numbered button to edit it, or remove it. One marker per service is supported.
5. Use **Copy configuration** or **Export JSON**. Replace the `map` object in `data/hq-data.js` with that object; the exported JSON is configuration, not a separately fetched file. Reload HQ.

The image uses its natural aspect ratio and `width: 100%; height: auto`, without cropping. Marker centres use percentage coordinates of that same image rectangle. The seven text cards remain available even if the image is absent or a marker is removed. Missing custom images fall back to the schematic. The placeholder positions are provisional, not a claim about HQ geography. All map markers have accessible service names and keyboard links.

## Verification

```powershell
node --test tests/hq.test.cjs
node tests/hq-browser-check.mjs
node tests/existing-checks.cjs
```

Use `.hq-work/node.exe` instead of `node` here if needed. The browser runner uses installed Chrome through its DevTools protocol, creates an isolated temporary profile, starts an ephemeral loopback preview server and shuts both down. Set `CHROME_PATH` for a different Chrome/Edge executable. No third-party test packages are required.

Focused tests cover all coin conversions and validation/limits, XP carry and original-calculator agreement, every d100/3d6/cup outcome, payouts in every denomination, random rejection sampling, unrestricted scouting and price progression, audited catalogue prices and campaign exceptions, itemised totals, manually updated standings and player asset exclusions. The comparison against the original private XP calculator runs when that local file exists and is skipped on checkouts without private notes; the remaining XP tests have no private-file dependency. Browser tests exercise keyboard/text navigation, the homepage HQ button, native disclosures, touch, all games and coin selectors, duplicate-round prevention, search/quantity errors, newly added equipment search and buy totals, junk removal, scouting, unchanged records, marker editing, and responsive widths 320/375/768/1440. Screenshots and JSON results are local under `.hq-work/`.

The existing Dayner and road-network suites are also run against the restored source. They contain pre-existing failures (the Dayner tests refer to a missing player-select element; the road tests expect nested `TRAVEL_SPEEDS.road/ship` that the current implementation does not provide). They are reported separately rather than changing unrelated application logic or weakening their assertions.

Latest results: **14 focused test groups passed; 39 HQ browser checks passed**, with no HQ/editor runtime exceptions. Mobile counting-house/trader and desktop screenshots are captured for visual inspection. The existing Dayner suite reached 57 passes, two missing-player-select assertion failures and one consequent null-options exception; the same three failures were reproduced against the untouched upstream index. The road suite reached one pass, two speed-shape failures and a consequent exception; its source files are byte-identical to the staged upstream versions. No package-manager build/lint scripts exist in this static repository. New JavaScript syntax checks pass.

Remaining asset limitation: the real HQ image and its final marker positions are still to be supplied. Accounting chronology remains explicitly unresolved. Scouting, room upgrades and low buy prices include the documented defaults above.
