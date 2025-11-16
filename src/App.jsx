import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import EventPicker from './components/EventPicker'
import QuickCreateEvent from './components/QuickCreateEvent'
import SeatMap from './components/SeatMap'

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [lastAction, setLastAction] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedEvent])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      <Hero />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between text-white/80">
          <h2 className="text-2xl font-bold">Pick an event and choose your seats</h2>
          {lastAction && <div className="text-sm text-emerald-300">{lastAction}</div>}
        </div>

        {!selectedEvent && (
          <div className="space-y-6">
            <EventPicker onSelect={setSelectedEvent} />
            <QuickCreateEvent onCreated={() => { setSelectedEvent(null); setLastAction('Event created. Select it to continue.') }} />
          </div>
        )}

        {selectedEvent && (
          <div className="space-y-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-white/60 text-sm">{new Date(selectedEvent.date).toLocaleString()} • {selectedEvent.venue}</div>
                <h3 className="text-2xl font-semibold">{selectedEvent.title}</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm">Change event</button>
            </div>

            <SeatMap event={selectedEvent} onBooked={() => setLastAction('Booking confirmed!')} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
