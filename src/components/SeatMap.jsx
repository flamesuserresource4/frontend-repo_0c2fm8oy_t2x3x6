import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Seat({ seat, selected, onToggle }) {
  const statusStyles = {
    available: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    booked: 'bg-rose-500/20 text-rose-300 border-rose-400/40 line-through opacity-60',
    reserved: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  }

  return (
    <button
      disabled={seat.status !== 'available'}
      onClick={() => onToggle(seat)}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-md border text-sm font-semibold transition-all duration-200 ${statusStyles[seat.status]} ${selected ? 'ring-2 ring-sky-400' : ''}`}
      title={`Row ${seat.row} • Seat ${seat.number}`}
    >
      <span>{seat.row}{seat.number}</span>
    </button>
  )
}

export default function SeatMap({ event, onBooked }) {
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const fetchSeats = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/events/${event._id || event.id}/seats`)
      const data = await res.json()
      setSeats(data)
    } catch (e) {
      setError('Failed to load seats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (event) fetchSeats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])

  const grid = useMemo(() => {
    const byRow = {}
    for (const s of seats) {
      if (!byRow[s.row]) byRow[s.row] = []
      byRow[s.row].push(s)
    }
    for (const r in byRow) {
      byRow[r].sort((a, b) => a.number - b.number)
    }
    return byRow
  }, [seats])

  const toggleSeat = (seat) => {
    setSelected((prev) => {
      const copy = { ...prev }
      if (copy[seat._id]) delete copy[seat._id]
      else copy[seat._id] = seat
      return copy
    })
  }

  const total = useMemo(() => Object.keys(selected).length * (event.price || 0), [selected, event])

  const book = async () => {
    try {
      setError('')
      const seatIds = Object.keys(selected)
      if (!seatIds.length) {
        setError('Select at least one seat')
        return
      }
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event._id || event.id,
          seats: seatIds,
          name,
          email,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        throw new Error(j?.detail || 'Failed to book')
      }
      const j = await res.json()
      setSelected({})
      await fetchSeats()
      onBooked?.(j)
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <div className="text-white/80">Loading seat map...</div>
  if (error) return <div className="text-rose-300">{error}</div>

  return (
    <div className="w-full grid md:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-4">
        {Object.keys(grid).sort().map((row) => (
          <div key={row} className="flex items-center gap-3">
            <div className="w-10 text-white/60 font-medium">{row}</div>
            <div className="flex flex-wrap gap-2">
              {grid[row].map((s) => (
                <Seat key={s._id} seat={s} selected={!!selected[s._id]} onToggle={toggleSeat} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/90 backdrop-blur">
        <h3 className="text-xl font-semibold mb-4">Your Booking</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Event</span>
            <span className="font-medium">{event.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Selected Seats</span>
            <span className="font-medium">{Object.keys(selected).length}</span>
          </div>
          <div className="flex justify-between">
            <span>Price per seat</span>
            <span className="font-medium">${event.price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-white/10">
            <span>Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-md bg-white/10 px-3 py-2 text-sm outline-none placeholder-white/50" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-md bg-white/10 px-3 py-2 text-sm outline-none placeholder-white/50" />
          <button onClick={book} className="w-full rounded-md bg-sky-500 hover:bg-sky-600 py-2 text-sm font-semibold">Book Seats</button>
          {error && <p className="text-rose-300 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  )
}
