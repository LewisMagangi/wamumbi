/** Public base URL. Set NEXT_PUBLIC_SITE_URL when the custom domain is live. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://wamumbi-red.vercel.app").replace(/\/$/, "")

export const SITE_NAME = "Wamumbi Foundation"
export const SITE_DESCRIPTION =
  "Wamumbi Foundation supports orphaned and vulnerable children and their guardians in Kenya through community outreach, education and care."
