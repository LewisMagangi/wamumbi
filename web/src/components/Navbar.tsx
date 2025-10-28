"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="fixed w-full z-10 top-0 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Wamumbi
            </Link>
          </div>

          {/* Desktop Donate Button */}
          {mounted && (
            <div className="hidden md:flex items-center justify-center flex-grow">
              <SignedIn>
                <Button
                  variant="ghost"
                  asChild
                  className="bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1"
                >
                  <Link href="/donate">
                    Donate <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </SignedIn>
              <SignedOut>
                <Button variant="ghost" asChild>
                  <Link href="/donate">Donate</Link>
                </Button>
              </SignedOut>
            </div>
          )}

          {/* Desktop Auth Buttons */}
          {mounted && (
            <div className="hidden md:flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: { avatarBox: "h-8 w-8" },
                  }}
                />
              </SignedIn>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {mounted && (
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: { avatarBox: "h-8 w-8" },
                  }}
                />
              </SignedIn>
            )}
            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mounted && isMobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
          <SignedIn>
            <Button
              variant="ghost"
              asChild
              className="justify-start bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1"
            >
              <Link href="/donate">
                Donate <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button variant="ghost" asChild className="justify-start">
              <Link href="/donate">Donate</Link>
            </Button>
          </SignedOut>

          <SignedOut>
            <SignInButton mode="modal">
              <Button className="w-full justify-start">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="w-full justify-start flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Button variant="ghost" asChild className="justify-start">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      )}
    </nav>
  )
}
