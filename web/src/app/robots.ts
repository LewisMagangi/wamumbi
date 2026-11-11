import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  // Preview deployments stay out of search results; only production is indexed.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } }
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/donations", "/volunteers", "/projects", "/teams", "/reports", "/profile", "/sign-in", "/sign-up", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
