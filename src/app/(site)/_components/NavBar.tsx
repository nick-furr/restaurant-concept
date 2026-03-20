'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a0a] border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-sm tracking-[0.25em] uppercase text-[#f5f0e8]"
        >
          The Grand Table
        </Link>

        <div className="flex items-center gap-10">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-[0.15em] uppercase text-[#f5f0e8]/60 transition-colors duration-200 hover:text-[#f5f0e8]"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="border border-[#c9a96e] px-5 py-2 text-xs tracking-[0.15em] uppercase text-[#c9a96e] transition-colors duration-200 hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
          >
            Reserve
          </Link>
        </div>
      </div>
    </nav>
  )
}
