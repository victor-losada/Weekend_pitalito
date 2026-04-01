'use client'

import { useState, useEffect } from 'react'
import { CartItem, formatPrice } from '@/lib/config'
import { getCart, updateCartQuantity, removeFromCart, getOffers, getCartTotals } from '@/lib/supabase-store'
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import Image from 'next/image'

interface CartSidebarProps {
  cartUpdateTrigger?: number
}

export function CartSidebar({ cartUpdateTrigger }: CartSidebarProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0 })
  const [isOpen, setIsOpen] = useState(false)
  
  const loadCart = async () => {
    const currentCart = getCart()
    setCart(currentCart)
    const offers = await getOffers()
    setTotals(getCartTotals(currentCart, offers))
  }
  
  useEffect(() => {
    loadCart()
  }, [cartUpdateTrigger])
  
  useEffect(() => {
    if (isOpen) {
      loadCart()
    }
  }, [isOpen])
  
  const handleQuantityChange = (productId: string, delta: number) => {
    const item = cart.find(i => i.id === productId)
    if (item) {
      updateCartQuantity(productId, item.quantity + delta)
      void loadCart()
    }
  }
  
  const handleRemove = (productId: string) => {
    removeFromCart(productId)
    void loadCart()
  }
  
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  
  return (
    <>
      {/* Botón flotante del carrito */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:max-w-md bg-card flex flex-col p-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-foreground">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Tu Carrito
            </SheetTitle>
          </SheetHeader>
          
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Tu carrito está vacío</p>
              <p className="text-sm">¡Agrega deliciosos productos!</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                      {/* Imagen */}
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🐷
                          </div>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-primary font-semibold">
                          {formatPrice(item.price)}
                        </p>
                        
                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="ml-auto w-7 h-7 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Totales */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                
                {totals.discount > 0 && (
                  <div className="flex justify-between text-secondary-foreground">
                    <span>Descuento</span>
                    <span className="text-green-600">-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totals.total)}</span>
                </div>
                
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
                    Ir al Checkout
                  </Button>
                </Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
