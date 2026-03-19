import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-full">
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-gray-50">
        <div className="flex h-full flex-col gap-1 px-3 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Admin
          </p>
          <nav className="flex flex-col gap-1">
            <Link
              href="/admin"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/reservations"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            >
              Reservations
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}
