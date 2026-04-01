'use client'

import Link from 'next/link'
import { BUSINESS_NAME } from '@/lib/config'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black/90 p-1.5 shadow-lg">
              <Image
                src="/weekend/images/logo-weekend.png"
                alt="Logo Weekend Pitalito"
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="font-display text-lg md:text-xl font-bold tracking-wide text-foreground">
              {BUSINESS_NAME}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('catalogo')}
              className="text-muted-foreground hover:text-primary transition-colors font-semibold"
            >
              Catálogo
            </button>
            <button 
              onClick={() => scrollToSection('ofertas-combos')}
              className="text-muted-foreground hover:text-primary transition-colors font-semibold"
            >
              Ofertas & Combos
            </button>
          
            <button 
              onClick={() => scrollToSection('ubicacion')}
              className="text-muted-foreground hover:text-primary transition-colors font-semibold"
            >
              Ubicación
            </button>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="text-muted-foreground hover:text-primary transition-colors font-semibold"
            >
              Contacto
            </button>
            <Link 
              href="/admin"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('catalogo')}
              className="block w-full text-left text-foreground hover:text-primary transition-colors"
            >
              Catálogo
            </button>
            <button 
              onClick={() => scrollToSection('ofertas-combos')}
              className="block w-full text-left text-foreground hover:text-primary transition-colors"
            >
              Ofertas & Combos
            </button>
            <button 
              onClick={() => scrollToSection('ofertas')}
              className="block w-full text-left text-foreground hover:text-primary transition-colors"
            >
              Ofertas
            </button>
            <button 
              onClick={() => scrollToSection('ubicacion')}
              className="block w-full text-left text-foreground hover:text-primary transition-colors"
            >
              Ubicación
            </button>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="block w-full text-left text-foreground hover:text-primary transition-colors"
            >
              Contacto
            </button>
            <Link 
              href="/admin"
              className="block text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Administrador
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
