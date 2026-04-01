'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CartItem, formatPrice, BUSINESS_NAME, generateWhatsAppLink } from '@/lib/config'
import { getCart, clearCart, getOffers, getCartTotals } from '@/lib/supabase-store'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Truck, 
  Store, 
  ShoppingBag, 
  User, 
  Phone, 
  MapPin,
  MessageCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type OrderType = 'delivery' | 'pickup'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0 })
  const [orderType, setOrderType] = useState<OrderType | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const currentCart = getCart()
      if (!mounted) return
      setCart(currentCart)

      const offers = await getOffers()
      if (!mounted) return
      setTotals(getCartTotals(currentCart, offers))
    })()

    return () => {
      mounted = false
    }
  }, [])
  
  const isFormValid = () => {
    if (!orderType) return false
    if (!name.trim()) return false
    if (!phone.trim()) return false
    if (orderType === 'delivery' && !address.trim()) return false
    return cart.length > 0
  }
  
  const generateWhatsAppMessage = () => {
    const itemsList = cart.map(item => 
      `- ${item.name} x${item.quantity} (${formatPrice(item.price * item.quantity)})`
    ).join('\n')
    
    const orderTypeText = orderType === 'delivery' 
      ? '🚚 Domicilio' 
      : '📍 Recoger en tienda (reserva)'
    
    let message = `Hola, quiero pedir en ${BUSINESS_NAME}:\n\n`
    message += `${itemsList}\n\n`
    message += `📋 *Tipo de pedido:* ${orderTypeText}\n`
    message += `👤 *Nombre:* ${name}\n`
    message += `📞 *Teléfono:* ${phone}\n`
    
    if (orderType === 'delivery' && address) {
      message += `📍 *Dirección:* ${address}\n`
    }
    
    message += `\n💰 *Subtotal:* ${formatPrice(totals.subtotal)}\n`
    if (totals.discount > 0) {
      message += `🏷️ *Descuento:* -${formatPrice(totals.discount)}\n`
    }
    message += `✨ *TOTAL:* ${formatPrice(totals.total)}\n\n`
    message += `¡Gracias! 🐷`
    
    return message
  }
  
  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }
    
    setIsSubmitting(true)

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        customerName: name,
        customerPhone: phone,
        customerAddress: orderType === 'delivery' ? address : undefined,
        orderType: orderType as OrderType,
        subtotal: totals.subtotal,
        total: totals.total,
        discount: totals.discount,
        status: 'pending',
      }),
    })
    const created = res.ok ? await res.json() : null

    if (!created || !created.id) {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error || 'No pudimos registrar el pedido. Intenta de nuevo.')
      setIsSubmitting(false)
      return
    }
    
    // Generar link de WhatsApp
    const message = generateWhatsAppMessage()
    const whatsappLink = generateWhatsAppLink(message)
    
    // Limpiar carrito
    clearCart()
    
    // Mostrar mensaje de éxito
    toast.success('¡Pedido enviado correctamente!', {
      description: 'Te redirigiremos a WhatsApp...',
      icon: '🎉'
    })
    
    // Abrir WhatsApp
    setTimeout(() => {
      window.open(whatsappLink, '_blank')
      setIsSubmitting(false)
      router.push('/')
    }, 1000)
  }
  
  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16 px-4 bg-background">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground mb-8">
              Agrega productos deliciosos a tu carrito para continuar con tu pedido
            </p>
            <Link href="/#catalogo">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Ver Catálogo
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Finalizar Pedido
            </h1>
            <p className="text-muted-foreground mt-2">
              Completa tus datos para enviar tu pedido por WhatsApp
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario */}
            <div className="space-y-6">
              {/* Tipo de pedido */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-foreground">
                  ¿Cómo deseas recibir tu pedido?
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      orderType === 'delivery'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Truck className={`w-8 h-8 mb-3 ${orderType === 'delivery' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className={`font-semibold ${orderType === 'delivery' ? 'text-primary' : 'text-foreground'}`}>
                      Domicilio
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Te lo llevamos a tu casa
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      orderType === 'pickup'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Store className={`w-8 h-8 mb-3 ${orderType === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className={`font-semibold ${orderType === 'pickup' ? 'text-primary' : 'text-foreground'}`}>
                      Recoger
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reserva y recoge en tienda
                    </p>
                  </button>
                </div>
              </div>
              
              {/* Datos del cliente */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-foreground">
                  Tus datos
                </Label>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nombre completo *
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="bg-card"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Teléfono *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 3001234567"
                      className="bg-card"
                    />
                  </div>
                  
                  {orderType === 'delivery' && (
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Dirección de entrega *
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej: Calle 123 #45-67, Barrio Centro"
                        className="bg-card"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Resumen del pedido */}
            <div className="bg-card rounded-2xl p-6 border border-border h-fit">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Resumen del pedido
              </h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-{formatPrice(totals.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-xl font-bold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totals.total)}</span>
                </div>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white text-lg py-6 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <CheckCircle className="w-5 h-5 animate-pulse" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Pedir por WhatsApp
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Al hacer clic, se abrirá WhatsApp con tu pedido listo para enviar
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
