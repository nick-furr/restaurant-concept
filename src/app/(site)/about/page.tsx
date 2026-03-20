export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="flex min-h-[65vh] flex-col justify-end px-6 pb-20 pt-40">
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-6 text-xs tracking-[0.35em] uppercase text-[#c9a96e]">Our Story</p>
          <h1 className="font-serif text-5xl font-normal leading-tight text-[#f5f0e8] md:text-7xl lg:text-8xl">
            A table set
            <br />
            with intention.
          </h1>
        </div>
      </section>

      {/* Two-column copy */}
      <section className="border-t border-white/10 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 md:grid-cols-2 md:gap-24">
            <div>
              <h2 className="mb-7 font-serif text-xl font-normal text-[#f5f0e8]">The Beginning</h2>
              <p className="mb-6 text-sm leading-relaxed text-[#f5f0e8]/55">
                The Grand Table was founded in 2018 with a singular belief: that a restaurant can be more
                than a place to eat. It can be a place to pause, to connect, to experience something that
                lingers long after the last course is cleared.
              </p>
              <p className="text-sm leading-relaxed text-[#f5f0e8]/55">
                Our founders spent years studying under renowned chefs across Europe before returning home
                with a vision — to create a dining room where technique and warmth exist in equal measure.
                Where a three-hour dinner feels too short.
              </p>
            </div>

            <div>
              <h2 className="mb-7 font-serif text-xl font-normal text-[#f5f0e8]">Our Kitchen</h2>
              <p className="mb-6 text-sm leading-relaxed text-[#f5f0e8]/55">
                We work exclusively with suppliers we trust — small farms, independent fishmongers, and
                artisan producers whose values align with our own. Our menu changes with the seasons, not
                because it is fashionable, but because the finest ingredient is always the one at its peak.
              </p>
              <p className="text-sm leading-relaxed text-[#f5f0e8]/55">
                Every dish that leaves our kitchen is the result of hours of refinement. We don&apos;t
                chase trends. We pursue clarity — the precise moment when a dish becomes exactly what it
                should be, nothing more, nothing less.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing line */}
      <section className="border-t border-white/10 py-28 text-center">
        <div className="mx-auto max-w-xl px-6">
          <p className="font-serif text-2xl font-normal leading-relaxed text-[#f5f0e8]/70 md:text-3xl">
            &ldquo;The details are not the details. They make the design.&rdquo;
          </p>
          <p className="mt-5 text-xs tracking-[0.2em] uppercase text-[#f5f0e8]/30">— Charles Eames</p>
        </div>
      </section>
    </main>
  )
}
