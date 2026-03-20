import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="pt-20">
      {/* Header */}
      <section className="border-b border-white/10 py-28 text-center">
        <p className="mb-5 text-xs tracking-[0.35em] uppercase text-[#c9a96e]">Find Us</p>
        <h1 className="font-serif text-5xl font-normal text-[#f5f0e8] md:text-7xl">Contact</h1>
      </section>

      {/* Details grid */}
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-3">
          <div>
            <h2 className="mb-5 text-xs tracking-[0.25em] uppercase text-[#c9a96e]">Address</h2>
            <address className="not-italic text-sm leading-loose text-[#f5f0e8]/60">
              12 Harrow Lane
              <br />
              Third Floor
              <br />
              New York, NY 10013
            </address>
          </div>

          <div>
            <h2 className="mb-5 text-xs tracking-[0.25em] uppercase text-[#c9a96e]">Contact</h2>
            <p className="text-sm leading-loose text-[#f5f0e8]/60">
              +1 (212) 555 0182
              <br />
              hello@thegrandtable.com
            </p>
          </div>

          <div>
            <h2 className="mb-5 text-xs tracking-[0.25em] uppercase text-[#c9a96e]">Hours</h2>
            <dl className="text-sm text-[#f5f0e8]/60">
              <div className="mb-2 flex justify-between gap-4">
                <dt>Mon – Thu</dt>
                <dd>5:30 – 10:30 pm</dd>
              </div>
              <div className="mb-2 flex justify-between gap-4">
                <dt>Fri – Sat</dt>
                <dd>5:00 – 11:30 pm</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Sunday</dt>
                <dd>Closed</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Booking CTA */}
        <div className="mt-28 border-t border-white/10 pt-24 text-center">
          <p className="font-serif text-2xl font-normal text-[#f5f0e8] md:text-3xl">
            Ready to join us for an evening?
          </p>
          <p className="mt-5 text-sm text-[#f5f0e8]/50">
            Reservations are recommended. Walk-ins welcome based on availability.
          </p>
          <Link
            href="/booking"
            className="mt-10 inline-block border border-[#c9a96e] px-10 py-4 text-xs tracking-[0.2em] uppercase text-[#c9a96e] transition-colors duration-200 hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
          >
            Reserve a Table
          </Link>
        </div>
      </div>
    </main>
  )
}
