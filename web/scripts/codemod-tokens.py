#!/usr/bin/env python3
"""Replace hardcoded Tailwind palette classes with design-system tokens.

Usage: python3 codemod-tokens.py <src-dir> [--dry]
Only touches .tsx/.ts files. Prefixes (hover:, md:, focus:, dark: ...) are preserved.
"""
import re, sys, pathlib

MAP = {
    # neutrals
    r"bg-white": "bg-card",
    r"bg-(gray|zinc|slate)-50": "bg-muted/50",
    r"bg-(gray|zinc|slate)-(100|200)": "bg-muted",
    r"bg-(gray|zinc|slate)-300": "bg-muted-foreground/25",
    r"bg-(gray|zinc|slate)-(600|700|800|900)": "bg-secondary",
    r"text-(gray|zinc|slate)-(800|900)": "text-foreground",
    r"text-(gray|zinc|slate)-700": "text-foreground/80",
    r"text-(gray|zinc|slate)-(500|600)": "text-muted-foreground",
    r"text-(gray|zinc|slate)-(300|400)": "text-muted-foreground/70",
    r"border-(gray|zinc|slate)-(100|200)": "border-border",
    r"border-(gray|zinc|slate)-(300|400)": "border-input",
    r"border-(gray|zinc|slate)-(600|700|800)": "border-border",
    r"divide-(gray|zinc|slate)-\d+": "divide-border",
    # brand (rose / pink / red used as brand)
    r"text-(rose|pink)-\d+": "text-brand",
    r"bg-(rose|pink)-(50|100)": "bg-brand/10",
    r"bg-(rose|pink)-(200|300)": "bg-brand/20",
    r"bg-(rose|pink)-(400|500|600|700|800)": "bg-primary",
    r"border-(rose|pink)-\d+": "border-brand",
    # the light green CTA becomes the primary (white in dark mode)
    r"bg-(green|emerald)-(500|600|700)": "bg-primary",
    r"bg-(green|emerald)-(50|100|200)": "bg-success/15",
    r"text-(green|emerald)-\d+": "text-success",
    r"border-(green|emerald)-\d+": "border-success/40",
    # status colours
    r"bg-red-(50|100|200)": "bg-destructive/15",
    r"bg-red-(400|500|600|700)": "bg-destructive",
    r"text-red-\d+": "text-destructive",
    r"border-red-\d+": "border-destructive/40",
    r"bg-(yellow|amber|orange)-(50|100|200)": "bg-warning/15",
    r"bg-(yellow|amber|orange)-(300|400|500|600)": "bg-warning",
    r"text-(yellow|amber|orange)-\d+": "text-warning",
    r"border-(yellow|amber|orange)-\d+": "border-warning/40",
    r"bg-(blue|indigo|sky)-(50|100|200)": "bg-info/15",
    r"bg-(blue|indigo|sky)-(400|500|600|700)": "bg-info",
    r"text-(blue|indigo|sky)-\d+": "text-info",
    r"border-(blue|indigo|sky)-\d+": "border-info/40",
    r"bg-(purple|violet)-(50|100|200)": "bg-chart-4/15",
    r"bg-(purple|violet)-(400|500|600|700)": "bg-chart-4",
    r"text-(purple|violet)-\d+": "text-chart-4",
    r"text-teal-\d+": "text-success",
    # focus rings: always the system ring
    r"ring-(rose|green|purple|orange|blue|pink|red|indigo)-\d+": "ring-ring",
}

# hover/active backgrounds on filled buttons should dim the token, not swap hue
HOVER_FILL = re.compile(r"\b((?:hover|active):)bg-(rose|pink|green|emerald|blue|purple|red)-(500|600|700|800)\b")
HOVER_NEUTRAL = re.compile(r"\b((?:hover|active):)bg-(gray|zinc|slate)-(50|100|200|300|600|700)\b")
HOVER_TEXT_NEUTRAL = re.compile(r"\b(hover:)text-(gray|zinc|slate)-\d+\b")

PREFIX = r"(?<![\w-])((?:[a-z0-9]+:)*)"

def convert(text: str) -> str:
    text = HOVER_FILL.sub(lambda m: f"{m.group(1)}bg-primary/90" if m.group(2) not in ("red",) else f"{m.group(1)}bg-destructive/90", text)
    text = HOVER_NEUTRAL.sub(lambda m: f"{m.group(1)}bg-accent", text)
    text = HOVER_TEXT_NEUTRAL.sub(lambda m: f"{m.group(1)}text-foreground", text)
    for pat, rep in MAP.items():
        text = re.sub(PREFIX + pat + r"(?![\w-])", lambda m: m.group(1) + rep, text)
    # inside any class string that fills with bg-primary, white text must become primary-foreground
    def fix_fg(m):
        s = m.group(0)
        if re.search(r"(?<![\w:-])bg-primary(?![\w/-])", s):
            s = re.sub(r"(?<![\w:-])text-white(?![\w-])", "text-primary-foreground", s)
        if re.search(r"(?<![\w:-])bg-destructive(?![\w/-])", s):
            s = re.sub(r"(?<![\w:-])text-white(?![\w-])", "text-destructive-foreground", s)
        return s
    text = re.sub(r'"[^"\n]*"|`[^`]*`|\'[^\'\n]*\'', fix_fg, text)
    # gradients built from brand hues collapse to flat brand
    text = re.sub(PREFIX + r"(from|via|to)-(rose|pink|purple|red|orange|blue|green|gray)-\d+", lambda m: m.group(1) + m.group(2) + "-brand", text)
    return text

def main():
    root = pathlib.Path(sys.argv[1]); dry = "--dry" in sys.argv
    changed = 0
    for p in list(root.rglob("*.tsx")) + list(root.rglob("*.ts")):
        if "generated" in p.parts:
            continue
        raw = p.read_bytes().decode("utf-8")
        new = convert(raw)
        if new != raw:
            changed += 1
            if not dry:
                p.write_bytes(new.encode("utf-8"))
            print("updated", p)
    print(f"{changed} files")

if __name__ == "__main__":
    main()
