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
      <main className="flex min-h-full items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 text-4xl">&#10003;</div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
            You&apos;re booked!
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            We&apos;ll send a confirmation to your email address shortly.
          </p>
          <p className="rounded-md bg-gray-100 px-4 py-3 text-left text-xs text-gray-500">
            Reservation ID:{' '}
            <span className="font-mono text-gray-700">{reservationId}</span>
          </p>
          <button
            onClick={() => {
              setForm(INITIAL)
              setReservationId(null)
            }}
            className="mt-6 text-sm text-gray-500 underline underline-offset-4 hover:text-gray-900"
          >
            Make another reservation
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-gray-900">
          Reserve a table
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          Fill in your details and we&apos;ll hold a table for you.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="guestName" className="text-sm font-medium text-gray-700">
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
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="guestEmail" className="text-sm font-medium text-gray-700">
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
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label htmlFor="guestPhone" className="text-sm font-medium text-gray-700">
              Phone{' '}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="guestPhone"
              name="guestPhone"
              type="tel"
              autoComplete="tel"
              value={form.guestPhone}
              onChange={handleChange}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="reservationDate" className="text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                id="reservationDate"
                name="reservationDate"
                type="date"
                required
                value={form.reservationDate}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="reservationTime" className="text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                id="reservationTime"
                name="reservationTime"
                type="time"
                required
                value={form.reservationTime}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Party size */}
          <div className="flex flex-col gap-1">
            <label htmlFor="partySize" className="text-sm font-medium text-gray-700">
              Party size
            </label>
            <select
              id="partySize"
              name="partySize"
              required
              value={form.partySize}
              onChange={handleChange}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Special requests */}
          <div className="flex flex-col gap-1">
            <label htmlFor="specialRequests" className="text-sm font-medium text-gray-700">
              Special requests{' '}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows={3}
              value={form.specialRequests}
              onChange={handleChange}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Reserving…' : 'Reserve table'}
          </button>
        </form>
      </div>
    </main>
  )
}
