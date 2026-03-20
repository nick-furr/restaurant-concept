'use client'

import { useState } from 'react'

type FormState = {
  guestName: string
  guestEmail: string
  guestPhone: string
  reservationDate: string
  reservationTime: string
  partySize: string
  specialRequests: string
}

const INITIAL: FormState = {
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  reservationDate: '',
  reservationTime: '',
  partySize: '2',
  specialRequests: '',
}

const inputClass =
  'w-full bg-[#111] border border-white/10 px-4 py-3 text-sm text-[#f5f0e8] placeholder-white/20 focus:border-[#c9a96e] focus:outline-none transition-colors duration-200'

const labelClass = 'block text-xs tracking-[0.15em] uppercase text-[#f5f0e8]/50 mb-2'

export default function BookingPage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reservationId, setReservationId] = useState<string | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const body: Record<string, unknown> = {
      guestName: form.guestName,
      guestEmail: form.guestEmail,
      restaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID,
      reservationDate: form.reservationDate,
      reservationTime: form.reservationTime,
      partySize: Number(form.partySize),
    }

    if (form.guestPhone.trim()) {
      body.guestPhone = form.guestPhone.trim()
    }
    if (form.specialRequests.trim()) {
      body.specialRequests = form.specialRequests.trim()
    }

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setReservationId(data.id)
    } catch {
      setError('Could not reach the server. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (reservationId) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-24 pt-32">
        <div className="w-full max-w-sm text-center">
          <p className="mb-6 text-4xl text-[#c9a96e]">✓</p>
          <h1 className="mb-4 font-serif text-3xl font-normal text-[#f5f0e8]">
            You&apos;re booked.
          </h1>
          <p className="mb-10 text-sm leading-relaxed text-[#f5f0e8]/50">
            A confirmation has been sent to your email address.
          </p>
          <div className="border border-white/10 px-6 py-4 text-left">
            <p className="mb-1 text-xs tracking-[0.15em] uppercase text-[#f5f0e8]/40">
              Booking reference
            </p>
            <p className="font-mono text-sm text-[#c9a96e]">
              {reservationId.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => {
              setForm(INITIAL)
              setReservationId(null)
            }}
            className="mt-8 text-xs tracking-[0.15em] uppercase text-[#f5f0e8]/40 underline underline-offset-4 transition-colors hover:text-[#f5f0e8]"
          >
            Make another reservation
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-start justify-center px-6 pb-24 pt-36">
      <div className="w-full max-w-lg">
        <p className="mb-5 text-xs tracking-[0.35em] uppercase text-[#c9a96e]">Reservations</p>
        <h1 className="mb-10 font-serif text-4xl font-normal text-[#f5f0e8] md:text-5xl">
          Reserve a Table
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name */}
          <div>
            <label htmlFor="guestName" className={labelClass}>
              Full name
            </label>
            <input
              id="guestName"
              name="guestName"
              type="text"
              autoComplete="name"
              required
              value={form.guestName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="guestEmail" className={labelClass}>
              Email
            </label>
            <input
              id="guestEmail"
              name="guestEmail"
              type="email"
              autoComplete="email"
              required
              value={form.guestEmail}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="guestPhone" className={labelClass}>
              Phone{' '}
              <span className="normal-case tracking-normal text-[#f5f0e8]/30">(optional)</span>
            </label>
            <input
              id="guestPhone"
              name="guestPhone"
              type="tel"
              autoComplete="tel"
              value={form.guestPhone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="reservationDate" className={labelClass}>
                Date
              </label>
              <input
                id="reservationDate"
                name="reservationDate"
                type="date"
                required
                value={form.reservationDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="reservationTime" className={labelClass}>
                Time
              </label>
              <input
                id="reservationTime"
                name="reservationTime"
                type="time"
                required
                value={form.reservationTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Party size */}
          <div>
            <label htmlFor="partySize" className={labelClass}>
              Party size
            </label>
            <select
              id="partySize"
              name="partySize"
              required
              value={form.partySize}
              onChange={handleChange}
              className={inputClass}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n} className="bg-[#111]">
                  {n} {n === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Special requests */}
          <div>
            <label htmlFor="specialRequests" className={labelClass}>
              Special requests{' '}
              <span className="normal-case tracking-normal text-[#f5f0e8]/30">(optional)</span>
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows={3}
              value={form.specialRequests}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 border border-[#c9a96e] px-6 py-4 text-xs tracking-[0.2em] uppercase text-[#c9a96e] transition-colors duration-200 hover:bg-[#c9a96e] hover:text-[#0a0a0a] disabled:opacity-40"
          >
            {loading ? 'Reserving…' : 'Reserve Table'}
          </button>
        </form>
      </div>
    </main>
  )
}
