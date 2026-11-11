---
name: Wamumbi Foundation
description: Warm, quiet, story-led design for a Kenyan community charity. Dark-first, real photography, one restrained accent, editorial serif headings over a humanist sans.
version: 1
---

# Wamumbi DESIGN.md

The single source of truth for UI work in this repo. Agents and design skills (Impeccable, shadcn, frontend-design, awesome-design-md references) read this first; when guidance conflicts, **this file wins**.

Tokens are implemented in `web/src/app/globals.css` (HSL variables, `:root` light and `.dark`) and mapped in `web/tailwind.config.ts`. Never use raw palette classes such as `bg-green-600` or `text-gray-700`.

## 1. Character

- **Warm, not saccharine.** Real people from real outreach days carry the emotion; the UI stays calm around them.
- **Less is more.** One idea per section. Remove before adding.
- **Honest.** No invented numbers, trends, testimonials or AI-generated people. Sample data is labelled as such.
- **Dark-first.** Warm near-black, never pure #000. Light theme is a full equal, one toggle away.

## 2. Colour

| Token | Dark | Light | Use |
|---|---|---|---|
| `background` | 30 8% 6% | 40 30% 98% | Page |
| `card` | 30 7% 9% | white | Raised surfaces, panels |
| `muted` / `accent` | 30 6% 13–15% | 36 16–18% 92–94% | Quiet fills, hover |
| `foreground` | 40 22% 95% | 28 12% 9% | Text |
| `muted-foreground` | 36 8% 66% | 28 6% 38% | Secondary text (AA on all surfaces) |
| `primary` | **white** | ink | The one main action per view |
| `brand` | 4 78% 62% | 4 72% 47% | "Touching hearts" red: progress, selection, a single dot of emphasis. Never a button fill. |
| `success` `warning` `info` `destructive` | | | Status text and 10–15% tints only |
| `border` / `input` / `ring` | | | Hairlines, fields, focus |

Rules: one accent per screen; status colours are text or faint tints, never big blocks; no gradients except photo scrims.

## 3. Type

- **Display:** Newsreader (variable, optical sizes): `font-display`. Headings, quotes, big figures. Sizes `text-display-sm|md|lg` (fluid clamp).
- **Body/UI:** Hanken Grotesk (variable): `font-sans`. 16px base, 1.6 line-height for prose.
- **Numbers:** `tabular-nums` everywhere figures align (stats, tables, dates).
- No uppercase tracked kicker labels above headings. Let the heading speak.
- Fonts are self-hosted in `web/src/app/fonts`.

## 4. Space, shape, depth

- 4px base. Marketing sections `py-24 md:py-32`; app pages `py-8 md:py-10`.
- Width: marketing `max-w-screen-xl`; app content `max-w-6xl`; forms and prose `max-w-3xl`.
- Radius: `rounded-lg` (10px) for cards and panels, `rounded-md` for inputs, `rounded-full` for primary CTAs and pills.
- Depth comes from the surface ladder (background → card → muted) and 1px hairlines, not shadows. Shadows only on overlays (dialogs, menus).

## 5. Motion

- Durations `fast 120 / base 200 / slow 320ms`, one `ease-out` curve (`cubic-bezier(.22,1,.36,1)`).
- `<Reveal>` for entrances (once, 16px rise), `<CountUp>` for the landing impact figures (the one signature moment).
- Nothing animates on keyboard actions or in dense data views. Everything respects `prefers-reduced-motion`.

## 6. Photography

- Real event photos only (`web/public/media`, pipeline `web/scripts/process-media.mjs`). EXIF/GPS stripped.
- Prefer wide activity and group shots; avoid close-ups of identifiable children; never name children.
- Text over images sits on background-token scrims so it stays readable in both themes.
- Every published photo needs alt text and confirmed consent (moderation queue).

## 7. Marketing pages

Story order on the home page: hero → proof → what we do → our story so far → gallery → campaigns → voices → get involved → contact. Use `PageShell` (`web/src/components/page-shell.tsx`) for inner pages and the shared form fields (`web/src/components/forms/fields.tsx`): visible labels, "(optional)" markers, inline errors, honeypot.

## 8. Dashboard (app shell)

Borrowed patterns, translated into our tokens. References: `docs/design/references/linear.DESIGN.md` (calm density, surface ladder, hairlines, single accent) and `docs/design/references/mercury.DESIGN.md` (trustworthy finance shell, stat blocks, quiet tables). Do not copy their colours or fonts.

- **Shell** (`web/src/components/dashboard/shell.tsx`): persistent 256px sidebar on desktop, drawer on mobile, 56px top bar with "View website" and theme toggle. No public navbar or footer inside the app.
- **Navigation**: grouped (Workspace, Content, Admin), filtered by role permissions. Active item = `bg-accent` + foreground text; others muted. Icons 16px, no coloured chips.
- **Page header**: display-serif title (3xl–4xl), one-line description, actions on the right (one `primary`, the rest `outline`, `size=sm`, pills).
- **Attention strip**: only when something is waiting (approvals, photos, applications). Pill with a small `brand` dot and a count. Hidden when empty.
- **Stat blocks**: one bordered card split by hairlines; label in `muted-foreground` 14px above a display-serif tabular figure. **No trend deltas unless computed from data.**
- **Panels**: `rounded-lg border bg-card`, header row (`text-sm font-medium` + "View all →"), content edge to edge.
- **Tables**: header row in `muted-foreground` normal weight (no caps), 12px vertical cell padding, row hover `bg-accent/40`, numbers right-aligned and tabular, status as coloured text, not badges.
- **Charts**: single hue (`foreground/80`), hover reveals `brand` and the value, month labels below, an `aria-label` summarising the data. No chart library unless needed.
- **States**: skeleton bars while loading, a one-line empty state that says what will appear, errors in `destructive` text.
- **Role views**: donors see their giving; finance sees money; coordinators see people and events; Super Admin sees everything plus approvals. Never render data the role can't see (the API also enforces this).

## 9. Accessibility

WCAG 2.1 AA: contrast on every token pair, visible focus ring (`ring`), 44px touch targets on mobile, labelled controls, `aria-current` on navigation, keyboard-operable dialogs and lightbox, `aria-live` for form results.

## 10. Before shipping

`npx impeccable detect web/src` → zero findings; check both themes and 390px width; no raw palette classes (`scripts/codemod-tokens.py --dry` reports 0 files).
