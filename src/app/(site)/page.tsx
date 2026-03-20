import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: appetizers } = await supabase
    .from('menu_items')
    .select('id, name, description, price')
    .eq('available', true)
    .eq('category', 'appetizer')
    .order('display_order')
    .limit(3)

  return (
    <main>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative flex h-screen flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a0a0a]" />
        <div className="relative z-10 flex flex-col items-center">
          <p className="mb-8 text-xs tracking-[0.45em] uppercase text-[#c9a96e]">
            Fine Dining · Est. 2018
          </p>
          <h1 className="font-serif text-6xl font-normal leading-none tracking-wide text-[#f5f0e8] md:text-8xl lg:text-9xl">
            The Grand Table
          </h1>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-[#f5f0e8]/50 md:max-w-md md:text-base">
            An intimate dining experience where the art of food meets the poetry of atmosphere.
          </p>
          <Link
            href="/booking"
            className="mt-12 inline-block border border-[#c9a96e] px-10 py-4 text-xs tracking-[0.2em] uppercase text-[#c9a96e] transition-colors duration-300 hover:bg-[#c9a96e] hover:text-[#0a0a0a]"
          >
            Reserve a Table
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Intro                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="mb-5 text-xs tracking-[0.35em] uppercase text-[#c9a96e]">Our Philosophy</p>
        <h2 className="font-serif text-3xl font-normal leading-relaxed text-[#f5f0e8] md:text-4xl">
          Every meal is a ceremony.
          <br />
          Every guest, an honoured companion.
        </h2>
        <p className="mt-10 text-sm leading-relaxed text-[#f5f0e8]/50 md:text-base">
          We believe that truly great dining transcends the plate. At The Grand Table, our kitchen works
          with the finest seasonal ingredients, our sommelier curates each pairing with care, and our
          team ensures every visit becomes a memory worth returning to.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Menu preview                                                        */}
      {/* ------------------------------------------------------------------ */}
      {appetizers && appetizers.length > 0 && (
        <section className="border-t border-white/10 py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <p className="mb-4 text-xs tracking-[0.35em] uppercase text-[#c9a96e]">From the Kitchen</p>
              <h2 className="font-serif text-3xl font-normal text-[#f5f0e8] md:text-4xl">
                A Taste of What Awaits
              </h2>
            </div>

            <div className="grid md:grid-cols-3">
              {appetizers.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col bg-[#0a0a0a] p-10 border-b border-white/10 last:border-b-0 md:border-b-0 md:border-r md:border-r-white/10 md:last:border-r-0"
                >
                  <p className="font-serif text-xl font-normal text-[#f5f0e8]">{item.name}</p>
                  {item.description && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#f5f0e8]/50">
                      {item.description}
                    </p>
                  )}
                  <p className="mt-6 text-sm text-[#c9a96e]">${Number(item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <Link
                href="/menu"
                className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] underline underline-offset-4 transition-colors duration-200 hover:text-[#f5f0e8]"
              >
                View the Full Menu
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-white/10 py-36 text-center">
        <div className="mx-auto max-w-xl px-6">
          <p className="mb-5 text-xs tracking-[0.35em] uppercase text-[#c9a96e]">Join Us</p>
          <h2 className="font-serif text-4xl font-normal leading-tight text-[#f5f0e8] md:text-5xl">
            Your table is waiting.
          </h2>
          <p className="mt-7 text-sm leading-relaxed text-[#f5f0e8]/50 md:text-base">
            Reserve your evening at The Grand Table and let us take care of the rest.
          </p>
          <Link
            href="/booking"
            className="mt-12 inline-block bg-[#c9a96e] px-14 py-4 text-xs tracking-[0.2em] uppercase text-[#0a0a0a] transition-opacity duration-200 hover:opacity-80"
          >
            Make a Reservation
          </Link>
        </div>
      </section>
    </main>
  )
}
