# Design intervention: the home's media and identity (2026-11-12)

Ticket: krizaka-internal#2926. Run with the `krizaka-design-intervention` skill: market brief, then UX, then UI, then a
critique pass, on real renders of www.krizaka.com taken on 2026-11-12. These renders are Playwright with the local
Chromium, at 1440 and 390 px, in dark and light, with `reducedMotion: "reduce"`.

This spec replaces the « lead with Verikora » fold of 2026-11-12 04:25Z. The founder decided at ~13:00Z: **krizaka.com puts
Krizaka UI Builder first, and Verikora second**. Verikora is « in trials, on invitation ».

Captures: `https://krizaka-assets.b-cdn.net/pr-assets/krizaka-com/2926-home-media/<file>`. They are never committed (AGENTS.md §5.1).

## 1. Brief (five lines)

- **Primary visitor**: a tech lead or front-end developer on a Québec or francophone React team. Their pages must be
  bilingual, and editors must be able to change them without opening a hole.
- **Secondary visitor**: a Québec property manager who screens rental files every week (Verikora).
- **Positioning**: Krizaka UI Builder is the visual editor for React that is safe by construction. The server refuses
  scripts, `on*` handlers, `javascript:` addresses, `__proto__` keys and undeclared props, and every field has its French
  and its English. It is MIT, a fork of Puck 0.24, and costs nothing.
- **Beliefs and their public proofs**:
  1. It refuses unsafe pages. Proof: `validateDocument` in the public repository, and the injection demo on
     ui.krizaka.com/builder once it is live (krizaka-internal#3237).
  2. It is bilingual by construction. Proof: localized fields, and `listFallbacks(doc, locale)`, which lists what is
     still missing in French (checked in the 0.3.0 tarball; it is not `missingTranslations`).
  3. The same craft runs in real products. Proof: Folioviv's shop editor uses it (README), and Verikora's recorded runs
     on dev.verikora.com.
- **The one action**: « Essayer l'éditeur » / « Try the editor » once the demo answers 200. Until then, the
  `npm i @krizaka/ui-builder` command with a copy button. GitHub is the secondary action.

## 2. Messages

| When | FR                                                                                                                                                                                                                                                                  | EN                                                                                                                                                                                                                                                                |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5 s  | **Un éditeur de pages qui refuse le code dangereux.**                                                                                                                                                                                                               | **A page editor that refuses unsafe code.**                                                                                                                                                                                                                       |
| 30 s | Krizaka UI Builder est libre (MIT). Le serveur refuse les scripts et les adresses `javascript:`. Chaque champ a son français et son anglais. Le même soin tourne dans nos produits : Verikora, en essai sur invitation, cite la page et la ligne de chaque constat. | Krizaka UI Builder is open source (MIT). The server refuses scripts and `javascript:` addresses. Every field has its French and its English. The same care runs in our products: Verikora, in trials by invitation, cites the page and the line of every finding. |

The words to stop using:

- The compliance h1 as the home's promise. Compliance now lives in Verikora's section.
- A lead that is all Verikora.
- The figures strip as the opening proof.
- « Apache-2.0 sur chaque bibliothèque ». It is wrong for UI Builder, which is MIT.
- « Parlez-nous de vos dossiers » at the top.
- Any « create an account »: sign-up is closed, and access is by invitation from the admin.
- Any AI wording or superlative.

## 3. Before: what a stranger sees in five seconds

| Render                                                     | In five seconds                                                                                                                                                                                                                |
| :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `before-home-fr-1440-dark-fold.png`                        | A compliance promise and a lead about Verikora. One action: « Parlez-nous de vos dossiers ». A figures strip. On the right, a carousel of the brand film (a duck at a desk), which says nothing about the promise.             |
| `before-home-fr-1440-dark.png` (full page)                 | Four media blocks in a row: three product carousels and the Kridoc plate. Each carousel has 3 to 8 slides, a ticker, controls and « Watch the film » actions. The page is 5 816 px tall, and what we sell first never appears. |
| `before-home-fr-390-light-fold.png`, `-390-dark-fold.png`  | The h1 and the lead fill the phone's first screen, and the carousel starts below the fold.                                                                                                                                     |
| `before-verikora-dev-1440-light.png` (dev.verikora.com)    | A clear page for property managers. But its hero finding is the security-deposit example, which the content rules refuse. This was raised on krizaka-internal#2562.                                                            |
| `before-ui-builder-1440-dark.png` (ui.krizaka.com/builder) | A 404 page: the demo is not live yet (krizaka-internal#3237).                                                                                                                                                                  |

## 4. The freeze: proven cause

The test ran on www.krizaka.com/en on 2026-11-12, with a Playwright script driving the local Chromium at 1440 px with motion
allowed.

- **Hover.** With the pointer over a carousel, the clip pauses: `currentTime` stays at 2.27 s for 3 s. The control
  still reads « Pause the carousel », so nothing on screen tells the visitor that it stopped.
- **After a mouse click on « next ».** The button keeps the focus, so `focused` stays true. `go` resets `engaged`, so
  `held = (hovered || focused) && !engaged` (`lib/showcase-player.ts`, `playerView`) stays true. The new clip sits on its
  first frame (`t = 0`, paused) for as long as the focus stays inside: 8 s were observed, and the hold has no limit.
- **Not the cause.** There were 0 long tasks over 60 s. The clips are 120 to 160 KB, served with
  `Cache-Control: max-age=2592000`. One `<video>` is mounted at load. The cause filed on krizaka-internal#2946 (four videos
  mounted at once) is already fixed.
- **Why the guards missed it.** `tests/showcase-player.test.mjs` tests the hold as intended behaviour, and
  `check-showcase-player.mjs` never clicks « next » with a mouse. @krizaka/ui's `MediaCarousel` has the same rule
  (`advancing = … && !hovered && !keyboardIn`).
- **Fix and guard.** krizaka-internal#3238 fixes the site, with a failing unit test first and a mouse-click smoke test.
  krizaka-internal#2657, reshaped, fixes the library. The only stop is a visible Pause/Play control (WCAG 2.2.2), and
  previous/next never hold anything.

## 5. After: the home, section by section

The template stays `landing`. One action per block, and at most two clicks to any detail.

| §   | Section                                         | Shows                                                                                                                                                                                                                                                                                                                                                                         | Action                                                                                                                                                         | Removes vs today                                                                                           |
| :-- | :---------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| 1   | **Hero: Krizaka UI Builder**                    | The h1, the lead and a proof line (« MIT · used in Folioviv's shop editor · <version> on npm », the version read at build). Fig. 1 is the **editor figure**: four steps drawn from real strings (compose a page; switch FR/EN; paste `<script>` into a field; « Refusé : script »). It runs for 8 s, plays once on entering view and rests on the refusal.                    | Before the demo is live: the command `npm i @krizaka/ui-builder` (copy), then GitHub. Once `/builder` answers 200: « Essayer l'éditeur » / « Try the editor ». | The hero carousel, the figures strip, the Verikora lead, « Parlez-nous de vos dossiers », the Apache line. |
| 2   | **The same craft, in a real product: Verikora** | « Chaque constat cite sa page » / « Every finding cites its page ». The label « En essai, sur invitation ». One finding a Québec property manager meets, from a **recorded run** with its run id: for example, a pay stub whose employer does not match the application, or a bank statement altered in the PDF. Never the deposit rule. Without a run id, there is no quote. | « Demander l'accès » / « Ask for access » → the contact form (`topic=business`, `product=verikora`, `source=home`), and a text link to Verikora's site.        | Verikora's carousel and the « Watch » actions.                                                             |
| 3   | **What else runs**                              | Sovkora (the engine of Verikora and Folioviv), Folioviv and Kridoc, as one-line rows: name, one sentence, status in words, « See the site », « Source ». Kridoc keeps its still.                                                                                                                                                                                              | One link per row.                                                                                                                                              | Sovkora's and Folioviv's carousels, and the engine tag's fold.                                             |
| 4   | Krizaka Entreprise                              | One line to `/services`, with no price.                                                                                                                                                                                                                                                                                                                                       | « Découvrir Krizaka Entreprise »                                                                                                                               | Nothing.                                                                                                   |
| 5   | Where we are going, then the principles         | A static numbered list (now / next / later), with every station open. The principles are unchanged, except the Apache line, which names each package's licence instead.                                                                                                                                                                                                       | « Lire notre histoire »                                                                                                                                        | `DirectionLoop`, the page's second self-moving block.                                                      |

The page ends there.

### What replaces the carousels

- **No carousel on the home.** Every defect the founder named is a carousel defect: the freezes, nobody seeing slide 2,
  too many promo films, and carousels everywhere. Each section now has one thing to show.
- **One medium per section.**
  - §1 is the editor figure. It is HTML drawn from real strings, so the FR/EN switch shows the real text.
  - §2 is a still: the finding as text.
  - §3 has no motion.
- **The full films only on demand.** The brand film and the Sovkora Files are reached by a text link to their watch page
  `/films/<id>` (« Voir le film · 1 min 25 »), from /story and the footer. The trailer's page stays withheld until its
  licence card is fixed.

### Video lengths

- **In-page media**: a loop of 6 to 10 s, 15 s at most anywhere. It is muted, its poster is the reduced-motion still,
  and it pauses after 30 s idle.
- **The editor figure**: 8 s, played once, with a « Replay » control.
- **A full film**: never in the page, only on its watch page with sound on demand.

### Motion: why it explains

- **What moves.** The editor figure starts when it enters the viewport, rather than being scrubbed by the scroll. A
  scrubbed figure fails on touch and with the keyboard, and reaching the figure is the scroll-driven moment. Its four
  steps are an ordered list that is always in the DOM, and each step is a button that jumps there (`aria-pressed`). A
  visible Pause/Play comes first in its tab order.
- **Reveals.** `reveal(i)` applies to §3 to §5 only, never to §1 or §2 (LCP).
- **Under reduced motion or Save-Data.** The figure rests on step 4 with the list, and no loop mounts.
- **Under the pointer.** Nothing moves under the pointer, and nothing pauses on hover or focus.

## 6. Identity: three directions for the founder

All three use the real tokens and @krizaka/fonts: Young Serif for headings, Atkinson Hyperlegible Next for text, Courier
Prime for code only, and Krizaka Cahier for one handwritten note. None uses the product register.

| Direction                                    | Intent                                                                                                                                                                                                                                                                        | Renders                                                                                                                 | Risk                                                                                                                   |
| :------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **A. Cahier strict**                         | The page is the notebook. The hero is ruled with Seyès lines, with the red margin and `§ 1`. The figure is a sheet on the notebook, and a margin note in the Cahier hand says the refusal (« il a dit non au script »).                                                       | `after-home-A-1440-light-fold.png`, `-1440-dark-fold.png`, `-390-light-fold.png`                                        | It reads as a school notebook for a security tool, and the ruling competes with the figure.                            |
| **B. Atelier (specimen sheet), recommended** | A printer's proof, where the refusal is the specimen. Large Young Serif type, with the one word « refuse » underlined in the margin's red. No ruling on the page: Seyès appears only inside the figure. The figure is a proof plate with « Fig. 1 » and a solid paper shadow. | `after-home-B-1440-dark.png` and `-light.png` (full page); `-390-dark.png` and `-light.png`; and their `-fold` versions | Large type takes the phone's first screen, so the h1 is capped at display-lg below 700 px.                             |
| **C. Ink on dark**                           | The product at work, lit. The hero is dark, with blue ink hairlines and no ruling. The figure is a lit screen and carries the only colour.                                                                                                                                    | `after-home-C-1440-dark-fold.png`, `-1440-light-fold.png`, `-390-dark-fold.png`                                         | It leaves the Cahier register, and a dark band under a light page needs a scoped surface that AGENTS.md does not name. |

**We recommend B.** The first job is to show a developer an editor refusing an injection within five seconds. B gives
the figure the most room on the quietest ground, and stays in the Cahier family (paper, Young Serif, square plate). A
competes with the figure, and C breaks the company register.

The founder chooses on krizaka-internal#2926, and krizaka-internal#3241 builds the chosen direction.

The after renders are mock-ups, injected into the live page with its real tokens and fonts. The Verikora quote in them is
an example, not a real run, and each render says so on its first line.

## 7. Adopted and rejected

| Decision                                                                         | Why                                                                                                                  |
| :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| Adopted: an HTML step figure in place of a promo film                            | It shows the job, a script refused, in real words in both languages. A film shows that something runs.               |
| Adopted: play once on view, not scroll-scrubbed                                  | A scrubbed figure fails on touch, with the keyboard and under reduced motion.                                        |
| Adopted: zero carousels                                                          | Every measured defect comes from carousels. If the founder wants one back, it goes in §3 with manual controls only.  |
| Adopted: a Verikora quote only from a recorded run                               | « Claims only what runs »: there is no invented finding, and never the deposit rule.                                 |
| Rejected: the trailer as the hero (krizaka-internal#2837)                        | It is a promo film; the promise is now UI Builder; and its licence card is wrong.                                    |
| Rejected: 20 to 45 s journey films on the home (krizaka-internal#2655)           | Nobody watches them to the end on a home page. They belong on each product's site (Verikora: krizaka-internal#2248). |
| Rejected: a pause on hover or focus                                              | It is the cause of the freeze. WCAG 2.2.2 asks for a visible pause, not a hover pause.                               |
| Rejected: tracked-caps eyebrows, `→` on every link, a gradient, a glow or a lift | These are templated defaults that the Cahier register refuses.                                                       |

## 8. Library changes (krizaka-ui), first in the build order

| Component                     | Change                                                                                                                         | Why it is generic                                                    | Breaking?                                       | Issue                 |
| :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :---------------------------------------------- | :-------------------- |
| `MediaCarousel`               | No hold on hover or focus; prev/next never pauses; `holds?: "pause-only" \| "pointer-focus"`, with `pause-only` as the default | Every host inherits the freeze today                                 | Behaviour change (minor, with a changeset note) | krizaka-internal#2657 |
| `StepFigure` (new)            | A 3 to 5 step figure that plays once and rests on its last step, with a step list, Pause/Play and reduced motion               | Any « how it works »: ui.krizaka.com/builder and the products' sites | No                                              | krizaka-internal#3239 |
| `CodeBlock variant="command"` | One row, a `$` prompt that is not copied, a copy result announced                                                              | Every install line of the family                                     | No                                              | krizaka-internal#3240 |
| `FindingQuote` (new)          | A finding, its quoted passage and its page/line citation                                                                       | Any product that checks documents                                    | No                                              | krizaka-internal#3240 |
| `SpecimenTag size="row"`      | A one-line product or module row with no surface                                                                               | Products' module lists                                               | No                                              | krizaka-internal#3240 |

## 9. Site changes (krizaka-com) and build order

1. krizaka-internal#3238: fix the hold rule now. The carousels stay live until step 5.
2. krizaka-internal#2657 (library hold rule), #3239 (`StepFigure`) and #3240 (command, finding, row): released on npm.
3. krizaka-internal#3241: the hero leads with UI Builder in the chosen direction. Its action switches when #3237 is live.
4. krizaka-internal#3242: Verikora's §2. It needs a recorded run from the Verikora lane.
5. krizaka-internal#3243: no carousel left. It retires `ShowcaseCarousel`, `showcase-player` and `DirectionLoop`.
6. krizaka-internal#3244: the cookieless measures. It needs the founder's go as an extension of ADR-005.

### Triage of the carousel issues (2026-11-12)

| Issue | Verdict                                                                                            |
| :---- | :------------------------------------------------------------------------------------------------- |
| #2561 | Closed: the hero is UI Builder, and the home has no carousel.                                      |
| #2651 | Closed: its media rules shipped and keep guarding the watch pages and /story; the carousels leave. |
| #2655 | Closed: journey films belong on the products' own sites (#2248 for Verikora).                      |
| #2657 | Reshaped: what remains is the library's hold-rule fix.                                             |
| #2658 | Already closed; stays closed (there is no carousel to migrate).                                    |
| #2837 | Closed: superseded twice (compliance h1 on 2026-11-07, then UI Builder first on 2026-11-12).       |
| #2876 | Closed: `showcase-add.mjs` shipped; the Sovkora Files keep their watch pages.                      |
| #2946 | Folded into #3243: its cause (four videos at load) is outdated, as measured.                       |

## 10. Accessibility (the new blocks)

- **Structure.** One h1, then an h2 per section. Each section has an accessible name.
- **Copy button.** It has a unique label per language, and its result is announced (`aria-live="polite"`).
- **The figure.**
  - It is a `figure` with a caption and a text version of all four steps, in the DOM on the first screen.
  - The refusal is said with words and an icon, never by colour alone.
  - Text contrast is at least 4.5:1, and UI contrast at least 3:1, in both themes.
- **The command.** At 360 px, it scrolls inside its own focusable box and never overflows the page.
- **Focus.** The focus ring is 2 px `--kz-ring`, and the figure never clips it.
- **Pause.** Pause/Play is visible for anything that moves for more than 5 s, and its label and `aria-pressed` always agree.
- **Audit.** axe reports 0 serious or critical violations in FR and EN, at 360 and 1440 px, in both themes, and the
  `a11y-baseline.json` count only goes down.

## 11. Measures (cookieless, server-side, ADR-005)

| Measure                                      | Today                                                               | Needs                                                |
| :------------------------------------------- | :------------------------------------------------------------------ | :--------------------------------------------------- |
| Visits                                       | Exists: the cookieless count                                        | —                                                    |
| Primary click rate                           | —                                                                   | `/go/<id>` 302 counts (#3244)                        |
| Command copied                               | —                                                                   | Beacon `copy:npm` (#3244)                            |
| Scroll depth                                 | —                                                                   | Beacons `reach:§2` and `reach:§3` (#3244)            |
| Figure completion (the « video » completion) | —                                                                   | Beacons `figure:start` and `figure:complete` (#3244) |
| Access requests for Verikora                 | Exists: contact messages carry `product=verikora` and `source=home` | —                                                    |
| Accessibility, LCP and CLS                   | Exist: `check-a11y.mjs` and Lighthouse in CI                        | —                                                    |

No measure uses an identifier, a cookie, a stored IP or a third-party tool. Time-to-first-click cannot be measured
without a session, so it is replaced by the click ratio and by a five-person test (« repeat the promise in one sentence »,
in FR and EN).

Targets are set after two weeks of baseline.

## 12. Settings that are data

- **Kept in `lib/` and read at build**:
  - the demo switch (an HTTP 200 on `/builder`);
  - the UI Builder version (npm);
  - the Verikora finding (a recorded run, with its id and date);
  - the measure ids and their allow-list.
- **Fixed rules, not settings**: the figure's 8 s and the 6 to 15 s loop bound, written in the components with
  `// @fixed:` and their reason.

## 13. Decisions for the founder

- **The identity.** Choose A, B (recommended) or C.
- **The measures.** Approve #3244's counts as an extension of ADR-005.
- **One carousel or none.** Confirm zero carousels on the home. The fallback is one manual carousel in §3.
