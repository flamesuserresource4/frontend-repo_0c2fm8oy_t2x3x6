import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function EventPicker({ onSelect }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/events`)
      const data = await res.json()
      setEvents(data)
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="text-white/80">Loading events...</div>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((ev) => (
        <button
          key={ev._id}
          onClick={() => onSelect(ev)}
          className="rounded-xl border border-white/10 bg-white/5 p-4 text-left text-white/90 hover:bg-white/10 transition"
        >
          <div className="text-sm text-white/60">{new Date(ev.date).toLocaleString()}</div>
          <div className="text-lg font-semibold">{ev.title}</div>
          <div className="text-sm text-white/60">{ev.venue}</div>
          <div className="text-sm mt-2">${ev.price?.toFixed(2)} per seat</div>
        </button>
      ))}
      {events.length === 0 && (
        <div className="col-span-full text-white/70">No events yet. Use the quick-create below to add a demo event.</div>
      )}
    </div>
  )
}
