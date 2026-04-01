'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { CatalogSection } from '@/components/catalog-section'
import { MediaShowcaseSection } from '@/components/media-showcase-section'
import { OffersCombosSection } from '@/components/offers-combos-section'
import { PreparationSection } from '@/components/preparation-section'
import { LocationSection } from '@/components/location-section'
import { Footer } from '@/components/footer'
import { CartSidebar } from '@/components/cart-sidebar'

export default function HomePage() {
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0)
  
  const handleCartUpdate = () => {
    setCartUpdateTrigger(prev => prev + 1)
  }
  
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MediaShowcaseSection />
      <CatalogSection onCartUpdate={handleCartUpdate} />
      <OffersCombosSection onCartUpdate={handleCartUpdate} />
      <PreparationSection />
      <LocationSection />
      <Footer />
      <CartSidebar cartUpdateTrigger={cartUpdateTrigger} />
    </main>
  )
}
