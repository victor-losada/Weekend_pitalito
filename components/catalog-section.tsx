'use client'

import { useState, useEffect } from 'react'
import { Product, PRODUCT_CATEGORIES, ProductCategory, MENU_SUBCATEGORIES } from '@/lib/config'
import { getProducts as getSupabaseProducts } from '@/lib/supabase-store'
import { ProductCard } from './product-card'
import { Package, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface CatalogSectionProps {
  onCartUpdate?: () => void
}

export function CatalogSection({ onCartUpdate }: CatalogSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todas')
  const [searchTerm, setSearchTerm] = useState('')

  const legacyCategoryMap: Record<string, ProductCategory> = {
    lechonas: 'sal',
    bebidas: 'bebidas-frias',
    salsas: 'cocteleria',
    addons: 'reposteria',
  }
  
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const allProducts = (await getSupabaseProducts()).filter(p => p.available)
      if (!mounted) return
      setProducts(allProducts)
    })()

    return () => {
      mounted = false
    }
  }, [])
  
  const getMainCategory = (product: Product): ProductCategory | null => {
    const rawCategory = String(product.category || '')
    const [mainCategory] = rawCategory.split('::')
    if (PRODUCT_CATEGORIES.some((cat) => cat.id === mainCategory)) {
      return mainCategory as ProductCategory
    }
    return legacyCategoryMap[mainCategory] ?? null
  }

  const matchesSubcategory = (product: Product): boolean => {
    if (selectedSubcategory === 'Todas') return true
    const [, encodedSubcategory] = String(product.category || '').split('::')
    if (encodedSubcategory && encodedSubcategory.toLowerCase() === selectedSubcategory.toLowerCase()) {
      return true
    }
    const haystack = `${product.name} ${product.description}`.toLowerCase()
    const normalized = selectedSubcategory.toLowerCase()
    return haystack.includes(normalized.replace('é', 'e')) || haystack.includes(normalized)
  }

  const filteredProducts = products.filter((product) => {
    const productMainCategory = getMainCategory(product)
    const matchesCategory = selectedCategory === 'all' || productMainCategory === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch && matchesSubcategory(product)
  })
  
  return (
    <section id="catalogo" className="py-16 px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 liquid-panel text-primary px-4 py-2 rounded-full mb-6">
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">Weekend Menu Experience</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestro Catálogo
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explora nuestro menú completo: Bebidas Frías, Bebidas Calientes, Repostería, Sal y Coctelería, con sus subcategorías especiales.
          </p>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md mx-auto sm:mx-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/80 border-white/40 backdrop-blur-sm"
            />
          </div>
          
          {/* Categorías */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedSubcategory('Todas')
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-muted/80 text-muted-foreground hover:bg-muted'
              }`}
            >
              Todos
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setSelectedSubcategory('Todas')
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-muted/80 text-muted-foreground hover:bg-muted'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedCategory !== 'all' && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {['Todas', ...MENU_SUBCATEGORIES[selectedCategory]].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all ${
                  selectedSubcategory === sub
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'bg-card/70 text-muted-foreground border border-border/70 hover:bg-card'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
        
        {/* Grid de productos */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onCartUpdate={onCartUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {products.length === 0 ? 'Catálogo en construcción' : 'No se encontraron productos'}
              </h3>
              <p className="text-muted-foreground">
                {products.length === 0 
                  ? 'Pronto agregaremos deliciosos productos para ti. ¡Vuelve pronto!'
                  : 'Intenta con otra búsqueda o categoría diferente.'
                }
              </p>
              {products.length === 0 && (
                <p className="text-sm text-muted-foreground/70 mt-4">
                  ¿Eres el administrador? <a href="/admin" className="text-primary hover:underline">Agrega productos aquí</a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
