import { Heart, Facebook, Instagram, Twitter, Linkedin, Music2 } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 px-12 pb-4">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-bold">Wamumbi Charity</span>
            </div>
            <p className="text-gray-400 mb-6">
              Bringing hope and support to orphaned children and their guardians
              through community-based initiatives.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-rose-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-rose-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-rose-500 transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-rose-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-rose-500 transition-colors"
                aria-label="TikTok"
              >
                <Music2 className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/campaigns"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Campaigns
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Projects
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Get Involved</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/donate"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  href="/volunteers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Fundraise
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@wamumbi.org</li>
              <li>Phone: +254 XXX XXX XXX</li>
              <li>Address: Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Wamumbi Charity Foundation. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
