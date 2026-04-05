import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
      <p className="mb-5 text-xs tracking-[0.35em] uppercase text-[#c9a96e]">The Grand Table</p>
      <h1 className="font-serif text-[7rem] leading-none font-normal text-[#f5f0e8] md:text-[10rem]">
        404
      </h1>
      <div className="my-8 h-px w-16 bg-[#c9a96e]/40" />
      <h2 className="mb-4 font-serif text-2xl font-normal text-[#f5f0e8] md:text-3xl">
        Page Not Found
      </h2>
      <p className="mb-10 max-w-sm text-sm leading-relaxed text-[#f5f0e8]/45">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="border border-[#c9a96e]/40 px-8 py-3 text-xs tracking-[0.2em] uppercase text-[#c9a96e] transition-colors hover:bg-[#c9a96e]/10"
      >
        Return Home
      </Link>
    </div>
  )
}
