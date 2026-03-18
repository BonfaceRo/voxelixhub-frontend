"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Zap } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#features",     label: "Features"     },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#industries",   label: "Industries"   },
    { href: "#pricing",      label: "Pricing"      },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6929f5, #8b5cf6)', boxShadow: '0 4px 12px rgba(105,41,245,0.4)' }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 700, color: '#f0f0f5' }}>
              Voxelix<span style={{ color: '#c9a84c' }}>Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/10">
              Login
            </Link>
            <Link href="/auth/register" className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all" style={{ background: 'linear-gradient(135deg, #6929f5, #8b5cf6)', boxShadow: '0 4px 12px rgba(105,41,245,0.35)' }}>
              Start Free — No Credit Card
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/auth/login" className="text-center py-2.5 rounded-xl text-gray-400 border border-white/10 hover:bg-white/10 text-sm font-semibold transition-all">
                  Login
                </Link>
                <Link href="/auth/register" className="text-center py-2.5 rounded-xl text-white text-sm font-semibold transition-all" style={{ background: 'linear-gradient(135deg, #6929f5, #8b5cf6)' }}>
                  Start Free — No Credit Card
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
