import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function QuickCreateEvent({ onCreated }) {
  const [title, setTitle] = useState('Holographic Night')
  const [venue, setVenue] = useState('NeoDome Arena')
  const [date, setDate] = useState(new Date().toISOString().slice(0,16))
  const [rows, setRows] = useState(5)
  const [cols, setCols] = useState(10)
  const [price, setPrice] = useState(29.99)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: '', venue, date, rows: Number(rows), cols: Number(cols), price: Number(price) })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        throw new Error(j?.detail || 'Failed to create event')
      }
      const j = await res.json()
      onCreated?.(j)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/90">
      <div className="font-semibold mb-2">Quick-create a demo event</div>
      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <input className="rounded-md bg-white/10 px-3 py-2" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
        <input className="rounded-md bg-white/10 px-3 py-2" value={venue} onChange={(e)=>setVenue(e.target.value)} placeholder="Venue" />
        <input className="rounded-md bg-white/10 px-3 py-2" type="datetime-local" value={date} onChange={(e)=>setDate(e.target.value)} />
        <div className="flex gap-2">
          <input className="w-full rounded-md bg-white/10 px-3 py-2" type="number" min="1" value={rows} onChange={(e)=>setRows(e.target.value)} placeholder="Rows" />
          <input className="w-full rounded-md bg-white/10 px-3 py-2" type="number" min="1" value={cols} onChange={(e)=>setCols(e.target.value)} placeholder="Cols" />
        </div>
        <input className="rounded-md bg-white/10 px-3 py-2" type="number" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={submit} disabled={loading} className="rounded-md bg-sky-500 hover:bg-sky-600 px-4 py-2 text-sm font-semibold disabled:opacity-60">{loading ? 'Creating...' : 'Create Event'}</button>
        {error && <span className="text-rose-300 text-sm">{error}</span>}
      </div>
    </div>
  )
}
