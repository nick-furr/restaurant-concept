import NavBar from './_components/NavBar'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <NavBar />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-white/10 py-8 text-center">
        <p className="text-xs text-[#f5f0e8]/20">
          Built by{' '}
          <a
            href="https://nickfurr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-[#c9a96e]/60"
          >
            Nick Furr
          </a>
        </p>
      </footer>
    </div>
  )
}
