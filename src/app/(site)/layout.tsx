import NavBar from './_components/NavBar'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <NavBar />
      {children}
    </div>
  )
}
