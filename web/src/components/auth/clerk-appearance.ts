"use client"

import { useTheme } from "next-themes"

/**
 * Clerk's widgets render outside our Tailwind tokens, so we hand them the same
 * colors as globals.css (converted from the HSL tokens) for each theme.
 */
const palette = {
  dark: {
    colorBackground: "#191715", // --card
    colorInputBackground: "#110f0e", // --background
    colorText: "#f5f3ef", // --foreground
    colorTextSecondary: "#afaaa1", // --muted-foreground
    colorInputText: "#f5f3ef",
    colorPrimary: "#f9f8f5", // white CTA (--primary)
    colorTextOnPrimaryBackground: "#131210",
    colorNeutral: "#f5f3ef",
    colorDanger: "#e45858",
    colorSuccess: "#4fae7b",
  },
  light: {
    colorBackground: "#ffffff",
    colorInputBackground: "#fbfaf8",
    colorText: "#1a1714",
    colorTextSecondary: "#67615b",
    colorInputText: "#1a1714",
    colorPrimary: "#1a1714",
    colorTextOnPrimaryBackground: "#fbfaf8",
    colorNeutral: "#1a1714",
    colorDanger: "#c72323",
    colorSuccess: "#2f7d53",
  },
} as const

export function useClerkAppearance() {
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === "light" ? "light" : "dark"
  return {
    variables: {
      ...palette[mode],
      borderRadius: "0.625rem",
      fontFamily: "var(--font-sans)",
      fontSize: "0.9375rem",
    },
    elements: {
      rootBox: "w-full",
      cardBox: "w-full shadow-none border border-border rounded-xl",
      card: "shadow-none",
      headerTitle: "font-display text-2xl font-normal tracking-tight",
      formButtonPrimary: "rounded-full normal-case text-sm font-medium shadow-none",
      socialButtonsBlockButton: "border-border",
      footer: "bg-none bg-card",
    },
    layout: { socialButtonsPlacement: "top" as const, logoPlacement: "none" as const },
  }
}
