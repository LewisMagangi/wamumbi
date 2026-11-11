import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
import { cn } from "@/lib/utils"

/** Standard public page frame: navbar, generous header, content, footer. */
export function PageShell({
  title,
  intro,
  children,
  aside,
  width = "default",
}: {
  title: string
  intro?: ReactNode
  children: ReactNode
  aside?: ReactNode
  width?: "default" | "narrow"
}) {
  return (
    <>
      <Navbar />
      <main className="pb-24 pt-32">
        <div className={cn("mx-auto px-5 md:px-10", width === "narrow" ? "max-w-3xl" : "max-w-screen-xl")}>
          <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h1 className="text-display-md">{title}</h1>
              {intro && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>}
            </div>
            {aside}
          </header>
          <div className="mt-14 md:mt-20">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  )
}
