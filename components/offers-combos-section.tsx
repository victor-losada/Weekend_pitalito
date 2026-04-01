'use client'

import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { addToCart } from '@/lib/supabase-store'
import { Product } from '@/lib/config'
import { toast } from 'sonner'
import { DealCategory, DealItemConfig, getDealsConfig } from '@/lib/content-store'

interface OffersCombosSectionProps {
  onCartUpdate?: () => void
}

const categoryLabels: Record<DealCategory, string> = {
  'promociones-semanales': 'Promociones Semanales',
  'combos-tematicos': 'Combos Temáticos',
  'ofertas-especiales': 'Ofertas Especiales',
}

export function OffersCombosSection({ onCartUpdate }: OffersCombosSectionProps) {
  const [activeCategory, setActiveCategory] = useState<DealCategory>('promociones-semanales')
  const [selectedDeal, setSelectedDeal] = useState<DealItemConfig | null>(null)
  const [dealsConfig, setDealsConfig] = useState(() => getDealsConfig())

  useEffect(() => {
    const sync = () => setDealsConfig(getDealsConfig())
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  const activeDeals = useMemo(() => dealsConfig[activeCategory] || [], [activeCategory, dealsConfig])

  const handleAddDealToCart = (deal: DealItemConfig) => {
    const cartProduct: Product = {
      id: `deal-${deal.id}`,
      name: deal.name,
      description: deal.description,
      price: deal.specialPriceValue,
      category: 'cocteleria',
      imageUrl: deal.image,
      available: true,
      discount: 0,
    }

    addToCart(cartProduct)
    onCartUpdate?.()
    toast.success(`${deal.name} agregado al carrito`)
  }

  return (
    <section id="ofertas-combos" className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex liquid-panel px-4 py-2 rounded-full text-sm font-semibold text-primary">
            Ofertas & Combos
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
            Promos irresistibles para antojarse ya
          </h2>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {(Object.keys(categoryLabels) as DealCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'liquid-panel text-muted-foreground hover:text-foreground'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activeDeals.map((deal) => (
            <article key={deal.id} className="card-3d liquid-panel rounded-2xl overflow-hidden border border-white/40">
              <div className="relative h-52 overflow-hidden">
                <Image src={deal.image} alt={deal.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-black/55 text-white text-xs px-2 py-1 rounded-full">
                  {deal.badge}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-display text-xl font-bold">{deal.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{deal.description}</p>
                <p className="text-sm text-foreground/85 mt-1">{deal.emotionalCopy}</p>

                <div className="mt-4 flex items-center gap-3">
                  {deal.normalPrice && <span className="text-sm text-muted-foreground line-through">{deal.normalPrice}</span>}
                  <span className="text-2xl font-extrabold text-primary">{deal.specialPrice}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedDeal(deal)}>
                    Ver detalles
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => handleAddDealToCart(deal)}>
                    Agregar
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedDeal && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-xl liquid-panel rounded-2xl border border-white/40 overflow-hidden">
            <div className="relative h-56">
              <Image src={selectedDeal.image} alt={selectedDeal.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <h4 className="font-display text-2xl font-bold">{selectedDeal.name}</h4>
              <p className="text-muted-foreground mt-2">{selectedDeal.description}</p>
              <p className="text-foreground mt-2">{selectedDeal.emotionalCopy}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => setSelectedDeal(null)}>
                  Cerrar
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    handleAddDealToCart(selectedDeal)
                    setSelectedDeal(null)
                  }}
                >
                  Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
