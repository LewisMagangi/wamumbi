import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70svh] max-w-screen-xl flex-col justify-center px-5 pb-24 pt-32 md:px-10">
        <p className="text-sm tabular-nums text-muted-foreground">404</p>
        <h1 className="mt-3 max-w-2xl text-display-md">We couldn&apos;t find that page.</h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">It may have moved, or the link may be mistyped. These are good places to start.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 rounded-full px-7 text-base"><Link href="/">Go to the home page</Link></Button>
          <Button asChild size="lg" variant="ghost" className="group h-12 rounded-full px-7 text-base">
            <Link href="/events">See upcoming events <ArrowRight className="transition-transform group-hover:translate-x-0.5" /></Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
