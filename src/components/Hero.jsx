import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zks9uYILDPSX-UX6/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 flex flex-col items-start gap-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs tracking-wide">
          ✨ Futuristic Ticketing
        </span>
        <h1 className="text-4xl md:text-6xl font-black leading-tight">
          Book the perfect seat with a holographic vibe
        </h1>
        <p className="max-w-xl text-white/70 text-base md:text-lg">
          Pick your row, tap a seat, and lock it in. Real-time availability and a clean, modern layout that makes choosing easy.
        </p>
      </div>
    </section>
  )
}
