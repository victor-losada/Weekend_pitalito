'use client'

export function PreparationSection() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="liquid-panel rounded-3xl border border-white/40 p-6 md:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex px-4 py-2 rounded-full bg-primary/15 text-primary font-semibold text-sm">
              Behind The Cup
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-bold mt-4">
              Así preparan la magia de Weekend
            </h3>
            <p className="text-muted-foreground mt-4">
              Este video muestra el proceso real de preparación: textura cremosa, detalle artesanal y ese toque chill
              que hace que cada bebida se sienta especial.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/40 shadow-2xl">
            <video
              className="w-80 ml-33 h-80 object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
            >
              <source src="/weekend/videos/hero-05.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
