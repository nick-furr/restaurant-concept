import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
        The Grand Table
      </h1>
      <Link
        href="/admin"
        className="text-sm text-gray-500 underline underline-offset-4 hover:text-gray-900"
      >
        Admin
      </Link>
    </main>
  )
}
