import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function updateStatus(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  const supabase = await createClient()
  await supabase.from('reservations').update({ status }).eq('id', id)
  revalidatePath('/admin/reservations')
}

export default async function ReservationsPage() {
  const supabase = await createClient()
  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, guest_name, guest_email, reservation_date, reservation_time, party_size, status, special_requests')
    .order('reservation_date', { ascending: false })

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Reservations</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Guest</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Time</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Party</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Special Requests</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {reservations?.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="px-4 py-3 text-gray-900">{r.guest_name}</td>
                <td className="px-4 py-3 text-gray-600">{r.guest_email}</td>
                <td className="px-4 py-3 text-gray-600">{r.reservation_date}</td>
                <td className="px-4 py-3 text-gray-600">{r.reservation_time}</td>
                <td className="px-4 py-3 text-gray-600">{r.party_size}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    r.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    r.status === 'no_show'   ? 'bg-gray-100 text-gray-600' :
                                               'bg-yellow-100 text-yellow-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{r.special_requests ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <form action={updateStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="confirmed" />
                      <button
                        type="submit"
                        className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-40"
                        disabled={r.status === 'confirmed'}
                      >
                        Confirm
                      </button>
                    </form>
                    <form action={updateStatus}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <button
                        type="submit"
                        className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-40"
                        disabled={r.status === 'cancelled'}
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!reservations || reservations.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No reservations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
