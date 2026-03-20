import { createClient } from '@/lib/supabase/server'

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string | number
  category: string
}

const CATEGORY_ORDER = ['appetizer', 'main', 'dessert', 'drink'] as const

const CATEGORY_LABELS: Record<string, string> = {
  appetizer: 'Appetizers',
  main: 'Mains',
  dessert: 'Desserts',
  drink: 'Drinks',
}

export default async function MenuPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('menu_items')
    .select('id, name, description, price, category')
    .eq('available', true)
    .order('category')
    .order('display_order')

  const grouped = CATEGORY_ORDER.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = (items ?? []).filter((item) => item.category === cat)
    return acc
  }, {})

  const hasItems = items && items.length > 0

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="border-b border-white/10 py-28 text-center">
        <p className="mb-5 text-xs tracking-[0.35em] uppercase text-[#c9a96e]">Our Offerings</p>
        <h1 className="font-serif text-5xl font-normal text-[#f5f0e8] md:text-7xl">The Menu</h1>
      </section>

      {/* Menu sections */}
      <div className="mx-auto max-w-5xl px-6 py-24">
        {hasItems ? (
          CATEGORY_ORDER.map((cat) => {
            const catItems = grouped[cat]
            if (!catItems || catItems.length === 0) return null

            return (
              <section key={cat} className="mb-24 last:mb-0">
                {/* Category heading */}
                <div className="mb-10 flex items-center gap-8">
                  <h2 className="font-serif text-2xl font-normal text-[#f5f0e8]">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Items grid */}
                <div className="grid md:grid-cols-2">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#0a0a0a] p-8 border-b border-white/10 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0 md:even:border-l"
                    >
                      <div className="mb-3 flex items-baseline justify-between gap-4">
                        <h3 className="font-serif text-lg font-normal text-[#f5f0e8]">{item.name}</h3>
                        <span className="shrink-0 text-sm text-[#c9a96e]">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm leading-relaxed text-[#f5f0e8]/50">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          })
        ) : (
          <p className="py-24 text-center text-sm text-[#f5f0e8]/30 tracking-widest uppercase">
            Menu coming soon
          </p>
        )}
      </div>
    </main>
  )
}
