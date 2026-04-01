'use client'

import { useState, useEffect } from 'react'
import { Offer } from '@/lib/config'
import { getOffers } from '@/lib/supabase-store'
import { Tag, Sparkles, Percent } from 'lucide-react'

export function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([])
  
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const activeOffers = (await getOffers()).filter(o => o.active)
      if (!mounted) return
      setOffers(activeOffers)
    })()

    return () => {
      mounted = false
    }
  }, [])
  
  if (offers.length === 0) {
    return (
      <section id="ofertas" className="py-16 px-4 bg-linear-to-br from-primary/10 to-secondary/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 liquid-panel text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Ofertas Especiales</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ofertas y Descuentos
          </h2>
          
          <div className="max-w-md mx-auto p-8 liquid-panel rounded-xl border border-dashed border-border">
            <Tag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              ¡Pronto tendremos ofertas especiales para ti!
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              Visítanos frecuentemente para no perderte ninguna promoción.
            </p>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section id="ofertas" className="py-16 px-4 bg-linear-to-br from-primary/10 to-secondary/20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 liquid-panel text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Ofertas Especiales</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ofertas y Descuentos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Promos con vibra chill para seguir disfrutando tu ritual de café y matcha.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <div 
              key={offer.id}
              className="card-3d relative bg-linear-to-br from-primary/95 to-accent text-primary-foreground p-6 rounded-2xl overflow-hidden"
            >
              {/* Decoración */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Percent className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold">{offer.discountPercent}%</span>
                    <p className="text-sm opacity-80">de descuento</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{offer.name}</h3>
                <p className="text-sm opacity-90 mb-4">{offer.description}</p>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-white/20 rounded-full">
                    {offer.isGlobal ? 'Todo el catálogo' : 'Productos seleccionados'}
                  </span>
                </div>
                
                {offer.validUntil && (
                  <p className="text-xs mt-3 opacity-70">
                    Válido hasta: {new Date(offer.validUntil).toLocaleDateString('es-CO')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
