'use client'

import { BUSINESS_NAME, BUSINESS_SLOGAN, generateWhatsAppLink, WHATSAPP_HERO_MESSAGE } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { ChevronDown, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

export function HeroSection() {
  const scrollToCatalog = () => {
    const element = document.getElementById('catalogo')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 -z-20">
        <video
          className="w-full h-full object-cover opacity-55 saturate-125 contrast-110"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/weekend/videos/hero-01.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-background/38 via-background/48 to-background/78" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(24)].map((_, i) => {
          const left = ((i * 17 + 7) % 100)
          const top = ((i * 23 + 11) % 100)
          const delay = (i * 0.25) % 5
          const duration = 4 + (i % 4) * 0.8
          return (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 bg-primary/60 rounded-full animate-particle shadow-[0_0_18px_rgba(146,198,152,0.65)]"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
              }}
            />
          )
        })}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-6 w-28 h-28 rounded-full bg-primary/45 blur-2xl steam-particle" />
        <div className="absolute top-36 right-16 w-24 h-24 rounded-full bg-secondary/85 blur-xl steam-particle" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-x-0 mx-auto top-[22%] w-[520px] h-[520px] rounded-full border border-white/45 swirl-loop opacity-55" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1 pour-in">
            <div className="inline-flex items-center gap-2 liquid-panel text-primary px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold tracking-wide">Pitalito, Huila</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 leading-tight drop-shadow-sm">
              {BUSINESS_NAME}
            </h1>

            <p className="text-xl md:text-2xl text-primary font-bold mb-4">
              {BUSINESS_SLOGAN}
            </p>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Un oasis relajado de café, matcha y coctelería suave. Sabores cremosos, atmósfera cozy y una experiencia que invita a bajar el ritmo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={scrollToCatalog}
                size="lg"
                className="bg-primary hover:bg-primary/85 text-primary-foreground text-lg px-8 py-6 gap-2 shadow-lg shadow-primary/30"
              >
                <ShoppingBag className="w-5 h-5" />
                Ver Catálogo
              </Button>
              <a 
                href={generateWhatsAppLink(WHATSAPP_HERO_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 gap-2 border-primary/70 text-primary hover:bg-primary hover:text-primary-foreground liquid-panel"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-border/60">
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">+40</p>
                <p className="text-sm text-muted-foreground">Bebidas especiales</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">5</p>
                <p className="text-sm text-muted-foreground">Categorías de menú</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-bold text-primary">∞</p>
                <p className="text-sm text-muted-foreground">Plan chill activado</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/35 to-secondary/35 rounded-full blur-3xl scale-125 animate-pulse" style={{ animationDuration: '4.5s' }} />

              <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full overflow-hidden border-4 border-primary/40 shadow-2xl transform hover:scale-105 transition-transform duration-500 card-3d">
                <Image
                  src="/weekend/images/menu-01.png"
                  alt="Bebida Weekend Pitalito"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-accent/45 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent opacity-60" />
              </div>

              <div className="absolute -top-8 -left-12 w-24 h-24 rounded-2xl overflow-hidden border border-white/40 shadow-xl animate-float">
                <Image src="/weekend/images/menu-06.png" alt="Detalle menú weekend" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-2xl overflow-hidden border border-white/40 shadow-xl animate-float" style={{ animationDelay: '1.2s' }}>
                <Image src="/weekend/images/menu-05.png" alt="Detalle menú weekend 2" fill className="object-cover" />
              </div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold">Creamy • Cozy • Aesthetic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <button 
          onClick={scrollToCatalog}
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-sm mb-2">Ver más</span>
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  )
}
