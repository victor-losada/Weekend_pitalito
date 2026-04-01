'use client'

import { Product, formatPrice } from '@/lib/config'
import { addToCart } from '@/lib/supabase-store'
import { ShoppingCart, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  onCartUpdate?: () => void
}

export function ProductCard({ product, onCartUpdate }: ProductCardProps) {
  const fallbackImages = [
    '/weekend/images/menu-01.png',
    '/weekend/images/menu-02.png',
    '/weekend/images/menu-03.png',
    '/weekend/images/menu-04.png',
    '/weekend/images/menu-05.png',
    '/weekend/images/menu-06.png',
    '/weekend/images/menu-07.png',
  ]
  const fallbackIndex = Math.abs(
    product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % fallbackImages.length
  const imageSrc = product.imageUrl || fallbackImages[fallbackIndex]

  const handleAddToCart = () => {
    addToCart(product)
    toast.success(`${product.name} agregado al carrito`, {
      description: 'Revisa tu carrito para continuar',
      icon: '🛒'
    })
    onCartUpdate?.()
  }
  
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price
  
  return (
    <div className="card-3d group liquid-panel rounded-2xl overflow-hidden border border-white/30 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badge de descuento */}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <Percent className="w-3 h-3" />
            -{product.discount}%
          </div>
        )}
        
        {/* Overlay con botón */}
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            onClick={handleAddToCart}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl shadow-primary/35"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Agregar
          </Button>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            {product.discount && product.discount > 0 ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(discountedPrice)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            size="sm"
            variant="outline"
            className="md:hidden border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
