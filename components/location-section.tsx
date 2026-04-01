'use client'

import { GOOGLE_MAPS_LINK, BUSINESS_ADDRESS, PHONE_NUMBER_DISPLAY, PHONE_NUMBER_2 } from '@/lib/config'
import { MapPin, Navigation, Phone, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LocationSection() {
  const mapsEmbedQuery = encodeURIComponent(BUSINESS_ADDRESS)
  const mapsEmbedSrc = `https://www.google.com/maps?q=${mapsEmbedQuery}&output=embed`

  return (
    <section id="ubicacion" className="py-16 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 liquid-panel text-secondary-foreground px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Nuestra Ubicación</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Cómo Llegar?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ven por tu coffee break, tu matcha favorito y una experiencia calmada para quedarte un rato.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Info */}
          <div className="space-y-6">
            <div className="liquid-panel p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Dirección</h3>
                  <p className="text-muted-foreground">{BUSINESS_ADDRESS}</p>
                </div>
              </div>
            </div>
            
            <div className="liquid-panel p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Teléfonos</h3>
                  <p className="text-muted-foreground">{PHONE_NUMBER_DISPLAY}</p>
                  <p className="text-muted-foreground">{PHONE_NUMBER_2}</p>
                </div>
              </div>
            </div>
            
            <div className="liquid-panel p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Horario</h3>
                  <p className="text-muted-foreground">Lunes a Domingo</p>
                  <p className="text-muted-foreground">8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
            
            <a 
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 gap-3">
                <Navigation className="w-5 h-5" />
                Abrir en Google Maps
              </Button>
            </a>
          </div>
          
          {/* Mapa del local */}
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-linear-to-br from-secondary/20 to-primary/20 border border-border shadow-xl">
            <iframe
              title="Ubicación Weekend Pitalito"
              src={mapsEmbedSrc}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/60 to-transparent pointer-events-none">
              <p className="text-white font-semibold">Weekend Pitalito</p>
              <p className="text-white/85 text-sm">{BUSINESS_ADDRESS}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
