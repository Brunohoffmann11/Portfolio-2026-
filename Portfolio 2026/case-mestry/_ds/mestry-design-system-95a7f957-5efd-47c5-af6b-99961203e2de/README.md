# Mestry Design System

A working design system reconstructed from a single high-resolution screenshot of the Mestry web application. Mestry is a Brazilian-Portuguese SaaS platform for digital marketers — built around campaign management, funnel building, cost tracking, and revenue analytics.

> ⚠️ **Source caveat:** This system was reverse-engineered from one screenshot (`uploads/Mestry - V1.zip` → `assets/BRL.png`, which is actually a 7680×5536 capture of the "Minha conta › Moeda e Fuso horário" settings page). No codebase, Figma file, or font files were provided. Tokens are observed-and-rounded, not lifted from source. **See the "Caveats & open questions" section at the bottom.**

---

## Product context

**Brand:** Mestry
**Locale:** pt-BR (Brazilian Portuguese)
**Product:** A workspace-based SaaS for performance marketers. Visible surface areas in the source screenshot:

| Sidebar nav item | What it likely is |
|---|---|
| Home | Top-level dashboard |
| Espaços | Workspaces (multi-tenant — "Nome do espaço 1/2/3" visible) |
| Dashboard | KPI overview |
| Reports | Reporting (English label, the rest are Portuguese — suggests product is mid-localization or "Reports" is the canonical term) |
| Custos | Costs / spend tracking |
| Regras de campanhas | Campaign rules / automation |
| Campanhas | Campaigns |
| Funnel builder | Funnel builder |
| Domínios | Domain management |
| Usuários | User management |
| Integrações | Integrations |
| Suporte | Support |

The header carries a persistent **META DE FATURAMENTO** (revenue goal) progress bar — `R$ 380K / R$ 500K` — which is unusual and a strong brand signal: revenue is the primary success metric, surfaced everywhere.

Plan structure includes a **Plano Pro** with a trial countdown ("Seu teste expira em 5 dias" → "Fazer Upgrade"). Currency is configurable (BRL / USD / EUR) — Brazilian Real is the default.

## Sources

- `uploads/Mestry - V1.zip` → contained a single 16 MB file `Moeda/BRL.png`, copied to `assets/BRL.png`. This is the source-of-truth screenshot.
- `uploads/Captura de Tela 2026-05-17 às 23.49.33.png` — present but **unreadable from this environment** due to non-ASCII characters in the filename. Please rename it (no accents/spaces) and re-attach if it contains additional reference.
- No codebase, Figma, or font files provided.

## Index

| Path | What it is |
|---|---|
| `README.md` | this file — context, foundations, content rules, iconography |
| `SKILL.md` | Agent Skill manifest so this folder can be used standalone |
| `colors_and_type.css` | All design tokens (CSS variables) — colors, type, spacing, radii, shadows |
| `fonts/` | Webfont files (currently only the Google Fonts fallback — see Type section) |
| `assets/` | Logos (full + mark, transparent + on-bg), reference crops from the source screenshot |
| `preview/` | Static HTML cards rendered into the Design System tab |
| `ui_kits/web-app/` | React-style recreation of the Mestry web app (index.html + JSX components) |

## Caveats & open questions

These need user input to harden the system:

1. **Font is a substitution.** Source font was never provided. The closest Google Fonts match for the geometric-but-humanist sans observed in the screenshot is **Plus Jakarta Sans**. Please upload the actual webfonts (woff2 preferred) and I'll swap them in.
2. **Logo wordmark is rasterized.** I extracted the `mestry` wordmark + M mark from the screenshot as PNGs. An SVG version would be much better — please drop one in `assets/` and I'll re-link everything.
3. **Light theme not observable.** The screenshot shows a theme-toggle in the top bar (dark/light pill), but only the dark theme is visible. Light theme tokens in `colors_and_type.css` are a best-guess inversion — please confirm or send a light-mode capture.
4. **Iconography is substituted.** Mestry icons in the screenshot are line-style with ~1.5px stroke. The closest free, CDN-available match is **Lucide**. If Mestry ships a custom icon set, please attach it.
5. **Only one screen seen.** I've reconstructed the global chrome (sidebar, top bar, trial card) and one inner page (account settings → currency). Other surfaces (Dashboard, Campaigns, Funnel builder) in the UI kit are inferred from the chrome — they're plausible but not verified. Screenshots of those pages would let me tighten them.
6. **Second uploaded screenshot blocked by filename.** Please rename `Captura de Tela 2026-05-17 às 23.49.33.png` to remove accents/spaces.

---

## CONTENT FUNDAMENTALS

### Language
- **Portuguese (pt-BR), with one English exception:** "Reports". This is either a roadmap-localization gap or a deliberate proper-noun choice. When writing new copy, use Portuguese; if reusing existing terms keep "Reports" verbatim.
- **Use of accents and special chars is correct and matters.** Always `ç`, `ã`, `õ`, `á`, `é`, `í`, `ó`, `ú`, `â`. Never strip them.

### Voice & tone
- **Direct, calm, instructional.** Page descriptions read like a manual page, not marketing copy. Examples observed:
  - "Visualize e gerencie as informações da sua conta" *(View and manage your account information)*
  - "Configure suas preferências regionais" *(Configure your regional preferences)*
  - "Configure seus dados básicos" *(Configure your basic data)*
- **Instructional imperative is the default sentence shape.** Verb-first: *Configure*, *Visualize*, *Gerencie*, *Selecione*.
- **Second person, formal-neutral ("você" implied).** No "tu". Possessive is **seu/sua/suas/seus**, never "teu". Tone is professional but not stiff — feels like a senior product person walking you through a setup.
- **No exclamation points. No hedging. No marketing fluff.** Even the trial card is matter-of-fact: "Seu teste expira em 5 dias."

### Casing
- **Sentence case everywhere** for page titles, section titles, labels, button labels.
  - ✅ "Configurações regionais", "Selecione a moeda", "Salvar alterações", "Editar dados", "Fazer Upgrade"
  - ❌ NOT "Configurações Regionais" or "SALVAR ALTERAÇÕES"
- **One TRIAL-only exception:** the inline badge `TRIAL` is uppercase — and it's the only uppercase string on the screen. Reserve all-caps strictly for status badges (TRIAL, PRO, BETA, NOVO).
- **Compact uppercase for the persistent revenue-goal label only:** `META DE FATURAMENTO` is uppercase with letter-spacing. Treat this casing as reserved for *system-level financial framing*, not generic section headers.

### Numbers & currency
- **Brazilian conventions:** dot for thousands, comma for decimals. `R$ 1.250,00`, `R$ 45.780,50`, `R$ 890,75`, `R$ 15.600,00`.
- **Always a space between `R$` and the number.** `R$ 380K`, not `R$380K`.
- **Compact abbreviation `K` for thousands** in dense chrome (like the revenue goal). Full precision in tables and detail views.

### Microcopy patterns

| Pattern | Example | Use when |
|---|---|---|
| Imperative verb + noun | "Editar dados", "Salvar alterações", "Fazer Upgrade" | All primary actions |
| Section title (sentence case) + one-line description | "Configurações regionais" / "Configure suas preferências regionais" | Every settings page heading |
| System notice with info-circle | "ⓘ As alterações afetarão todos os usuários do workspace" | Footnote before destructive/scoped actions |
| Trial countdown | "Seu teste expira em **5 dias**." | Numeric value is bolded against muted body |

### Emoji
**None used.** No emoji appear anywhere in the source. Don't introduce them.

### Vibe (one sentence)
> A serious, monochrome-blue dashboard that talks to you like a senior operator: short verbs, no fluff, revenue on screen at all times.

---

## VISUAL FOUNDATIONS

### Color philosophy
The brand is **single-hue indigo on a deep midnight-navy canvas**, with a single secondary accent (**mint/teal**) reserved for status badges. There are no gradients in fills, no warm colors, no decorative palette. Everything that draws the eye is either *primary indigo* (#2934FF) or *white at varying opacities*.

- **Backgrounds layer dark-on-dark:** app surface is near-black with a blue undertone (`#0A0D20`), elevated panels step up to a deep indigo navy (`#0F1448`), and the highest layer (preview/info panels) shifts neutral-gray-blue (`#1E2032`). The shift up the stack is *tint*, not just brightness — the colder, more saturated layers sit lower; the more neutral layer sits higher.
- **Brand blue is electric** (`#2934FF`). It's used sparingly: primary CTAs, the active-tab underline, selected state borders, the logo, the avatar fill, the meta-faturamento progress bar.
- **Mint/teal (`#2DD4BF`) is the only chromatic counterpoint** and it appears exactly once — on the `TRIAL` badge.

See `colors_and_type.css` for the full token set.

### Typography
- **Family:** Geometric-humanist sans-serif. The wordmark "mestry" is a custom or modified geometric sans (rounded terminals, very even stroke weight). Body and UI text is a tighter humanist sans, likely a paid family. **My substitution: Plus Jakarta Sans (Google Fonts).** Confirm or replace.
- **Two weights in active use:** 400 Regular for body/descriptions, 700 Bold for titles and button labels. 500/600 appear in some sidebar items.
- **Line height is generous on titles** (~1.15 — tight) and **looser on body** (~1.45).
- **Type scale (observed):**

| Token | Size | Weight | Where |
|---|---|---|---|
| `--text-display` | 32px | 700 | Page title ("Minha conta", "Configurações regionais") |
| `--text-h2` | 22px | 700 | Section heading ("Selecione a moeda", "Prévia de valores") |
| `--text-body-lg` | 16px | 500 | Card titles ("BRL", "Real Brasileiro") |
| `--text-body` | 15px | 400 | Default body / descriptions |
| `--text-sm` | 13px | 400 | Muted helper text, table values |
| `--text-xs` | 11px | 600 | Uppercase eyebrow ("META DE FATURAMENTO", "TRIAL") |

### Spacing
- **Base unit: 4px.** Common steps: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48.
- **Density is medium.** Cards have generous internal padding (~20–24px), but row spacing between settings items is tight (~12px).
- **Sidebar nav rows are ~44px tall** with 12px horizontal padding — hit-target compliant.

### Backgrounds
- **No imagery, no illustrations, no patterns, no grain, no gradients.** This is a flat, hi-tech, dark UI.
- The closest thing to "decoration" is the subtle saturation shift between layers (described above) and the faint inner glow on selected cards (a 1px indigo border + a tiny outer indigo shadow).

### Borders
- **1px solid borders, low-contrast** (~`#1E2347`) for card edges in resting state.
- **Selected state replaces the border with `2px solid #2934FF`** — bold, no glow halo behind, just the line.
- **Tab underline:** 2px solid `#2934FF` under the active tab only; inactive tab gets no underline.

### Corner radii
- **Small chips/icons:** 8px
- **Buttons:** 8px (rounded but not pill — except the trial-card "Fazer Upgrade" which IS pill, ~999px)
- **Cards / panels:** 12–16px (consistent within a panel)
- **Avatar, status dots:** 999px (full pill)
- **Theme toggle:** 999px (full pill)

### Shadows / elevation
- **Almost none.** Cards rely on background-tint deltas, not drop shadows.
- The one shadow worth replicating is the **primary-button micro-glow**: `0 0 0 1px rgba(41, 52, 255, 0.5), 0 4px 12px rgba(41, 52, 255, 0.25)` — subtle, only on the primary CTA at rest.
- **No inner shadows.** No protection gradients on top of imagery (there is no imagery).

### Hover & press states
Hover and press states aren't fully visible from a single screenshot — inferred from convention:
- **Buttons (primary):** hover lifts to a slightly brighter `#3B4CFF`, no scale change, no shadow growth.
- **Buttons (outline):** hover fills the interior at ~6% white tint, border unchanged.
- **Sidebar items:** hover gets a 4% white-tint background; active state gets a 6% tint + brand-blue left-bar accent (NOT a colored fill — confirmed in screenshot for "Home").
- **Cards (currency picker):** hover gets a 2% white-tint background; selected replaces border with brand blue. No scale, no shadow.
- **Press:** uniformly a 4–6% darken on filled elements. No "shrink" animation.

### Animation
- No animations visible in the static capture, but the design vocabulary suggests:
  - **Linear, fast, restrained.** ~150–200ms ease-out for hovers, ~250ms ease-in-out for state changes.
  - **No bounces, no springs, no playful motion.**
  - **Theme toggle and the trial-progress bar** are the obvious candidates for short transitions.

### Transparency & blur
- **No backdrop-blur visible.** Surfaces are solid.
- **White-on-tint translucency for hover states** (4–6% white over panel bg) is the only place rgba is used.

### Layout rules
- **Two-pane app shell with a fixed left sidebar (220px wide)** and a fixed top bar (~64px tall, sits above the sidebar — sidebar starts below the top bar at the same vertical anchor).
- **Inner pages adopt a secondary sub-nav (vertical list of section icons + labels)** on the left of the content area, with the content itself filling the remaining width.
- **Content max-width:** not strictly capped — wide screens use the available width and rely on a right-side info panel ("Prévia de valores") to absorb excess space.
- **Top bar is fixed; sidebar is scrollable.** The trial card is pinned to the bottom of the sidebar.

### Imagery
None observed in product chrome. Avatars use solid color circles with an initial. If imagery is needed downstream, treat it as a square/rounded-square crop with the same `--radius-card` (12–16px), no shadow.

---

## ICONOGRAPHY

Mestry's icons are **monoline (single-stroke), 1.5px–2px stroke weight, rounded line-caps, rounded corners**, with the occasional 2-color filled glyph for status (the lightning bolt in "Fazer Upgrade" is a filled glyph; the rest is line).

Icons appear in three places: the sidebar nav (24×24), the secondary sub-nav (20×20 inside a 40×40 dark-circle chip), and inline next to labels (16×16 — e.g. `$` and `🕐` in the "Moeda" / "Fuso horário" tabs).

### My choice
- **CDN substitute: [Lucide](https://lucide.dev)** — matches stroke weight, rounded caps, corner-rounding, and the general "muted geometric" feel. Loaded via the official Lucide CDN.
- **Mapping (observed icon → Lucide name):**

| Observed | Lucide |
|---|---|
| House | `home` |
| 2×2 grid of squares | `layout-grid` |
| Bar chart | `bar-chart-3` |
| Document/lines | `file-text` |
| Percent in circle | `percent` |
| Two-line stack with checkmarks | `list-checks` |
| Megaphone | `megaphone` |
| Flask | `flask-conical` |
| Globe | `globe` |
| People | `users` |
| Plug | `plug` |
| Headset | `headphones` |
| Person/profile | `user` |
| Padlock | `lock` |
| Gear | `settings` |
| Bell | `bell` |
| Dollar sign | `dollar-sign` |
| Clock | `clock` |
| Pencil/edit | `pencil` |
| Lightning bolt (filled) | `zap` (use `fill="currentColor"`) |
| Target/crosshair | `target` |
| Chevron left | `chevron-left` |
| Chevrons left (collapse) | `chevrons-left` |
| Check inside filled circle | custom — Lucide `check` inside a filled circle |
| Sun / Moon (theme toggle) | `sun`, `moon` |
| Plus | `plus` |
| Ellipsis horizontal | `more-horizontal` |
| Chevron down | `chevron-down` |
| X | `x` |
| Info circle | `info` |

### Emoji & unicode glyphs
- **Emoji: never used.** Don't introduce them.
- **Unicode glyphs:** none used as iconography. `$` and `€` and `R$` appear *as currency symbols inside chips*, but they're set in the regular UI font, not as icons.

### Logos
- `assets/logo_full.png` — wordmark + mark, on dark navy bg (extracted as captured).
- `assets/logo_full_transparent.png` — wordmark + mark, transparent bg (alpha-keyed from the navy).
- `assets/logo_mark.png` — just the M mark, on dark bg.
- `assets/logo_mark_transparent.png` — just the M mark, transparent bg.

The mark is **three blue parallel zigzag bars** that read as a stylized "M" / signal-pulse hybrid. It's the *only* place the brand uses a vivid hue at scale — keep it electric blue (`#2934FF`), don't tint it.
