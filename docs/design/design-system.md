# Design system

Tokens live in `web/src/app/globals.css` (HSL variables, light and dark) and are mapped to Tailwind in `web/tailwind.config.ts`. **Never use raw palette classes** (`bg-green-600`, `text-gray-700`); use tokens. `scripts/codemod-tokens.py` converts old classes.

## Principles

Less is more. One story per page, revealed in order. Real photos only (no AI images of people). Dark is the default; light is a toggle away. One accent, used sparingly.

## Colour

| Token | Use |
|---|---|
| `background` / `foreground` | Page and body text. Dark: warm near-black, never pure black. |
| `card`, `muted`, `accent` | Surfaces, quiet fills, hover backgrounds |
| `primary` | Main actions. **White in dark mode**, ink in light mode. Replaces the old light-green CTA. |
| `brand` | The red from the "touching hearts" mark. Progress bars, selection, rare emphasis. Not for buttons. |
| `success`, `warning`, `info`, `destructive` | Status only |
| `border`, `input`, `ring` | Lines, fields, focus |

All text pairs meet WCAG AA in both themes.

## Type

- **Display:** Newsreader (variable, optical sizes) for headings and quotes: `font-display`, sizes `text-display-sm|md|lg` (fluid).
- **Body:** Hanken Grotesk (variable): `font-sans`.
- Fonts are self-hosted in `src/app/fonts` (no Google Fonts request).
- No tracked uppercase "kicker" labels above headings: let the heading speak.

## Space, radius, motion

- 4px spacing base; sections use `py-24 md:py-32`; content max width `max-w-screen-xl`.
- Radius: `--radius` 10px (`rounded-lg`), pills (`rounded-full`) for primary CTAs.
- Motion: `duration-fast|base|slow` (120/200/320ms), `ease-out` curve. `<Reveal>` for entrances, `<CountUp>` for the impact numbers. Everything respects `prefers-reduced-motion`.

## Photos over text

Hero and event headers use a full-bleed photo with two gradient scrims (bottom and top) built from `background`, so text stays readable in both themes while the photo stays visible.

## Components

shadcn/ui (new-york) via `npx shadcn@latest add <component>`. Project skills for agents live in `.claude/skills` (Impeccable is the design source of truth; run `npx impeccable detect src` before shipping).
