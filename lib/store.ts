'use client'

import { Product, CartItem, Offer, Order } from './config'
import { DEMO_PRODUCTS, DEMO_OFFERS } from './demo-data'

// ============ KEYS DE LOCALSTORAGE ============
const PRODUCTS_KEY = 'amascar_products'
const CART_KEY = 'amascar_cart'
const OFFERS_KEY = 'amascar_offers'
const ORDERS_KEY = 'amascar_orders'
const AUTH_KEY = 'amascar_admin_auth'

// ============ FUNCIONES AUXILIARES PARA GUARDAR ============
export function saveProducts(products: Product[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function saveOffers(offers: Offer[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(OFFERS_KEY, JSON.stringify(offers))
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

// ============ PRODUCTOS ============
export function getProducts(): Product[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(PRODUCTS_KEY)
  
  // Si no hay productos, cargar datos de demostración
  if (!data) {
    saveProducts(DEMO_PRODUCTS)
    saveOffers(DEMO_OFFERS)
    return DEMO_PRODUCTS
  }
  
  return JSON.parse(data)
}

export function addProduct(product: Product): void {
  const products = getProducts()
  products.push(product)
  saveProducts(products)
}

export function updateProduct(updatedProduct: Product): void {
  const products = getProducts()
  const index = products.findIndex(p => p.id === updatedProduct.id)
  if (index !== -1) {
    products[index] = updatedProduct
    saveProducts(products)
  }
}

export function deleteProduct(productId: string): void {
  const products = getProducts().filter(p => p.id !== productId)
  saveProducts(products)
}

// ============ CARRITO ============
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(CART_KEY)
  return data ? JSON.parse(data) : []
}

export function addToCart(product: Product): void {
  const cart = getCart()
  const existingItem = cart.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }
  
  saveCart(cart)
}

export function removeFromCart(productId: string): void {
  const cart = getCart().filter(item => item.id !== productId)
  saveCart(cart)
}

export function updateCartItemQuantity(productId: string, quantity: number): void {
  const cart = getCart()
  const item = cart.find(item => item.id === productId)
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      saveCart(cart)
    }
  }
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_KEY)
}

export function getCartTotal(): { subtotal: number; discount: number; total: number } {
  const cart = getCart()
  const offers = getOffers().filter(o => o.active)
  
  let subtotal = 0
  let discount = 0
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity
    subtotal += itemTotal
    
    // Aplicar descuento individual del producto
    if (item.discount) {
      discount += (itemTotal * item.discount) / 100
    }
    
    // Aplicar ofertas
    offers.forEach(offer => {
      if (offer.isGlobal || (offer.productIds && offer.productIds.includes(item.id))) {
        discount += (itemTotal * offer.discountPercent) / 100
      }
    })
  })
  
  // Evitar descuento mayor al subtotal
  discount = Math.min(discount, subtotal)
  
  return {
    subtotal,
    discount,
    total: subtotal - discount
  }
}

// ============ OFERTAS ============
export function getOffers(): Offer[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(OFFERS_KEY)
  return data ? JSON.parse(data) : []
}

export function addOffer(offer: Offer): void {
  const offers = getOffers()
  offers.push(offer)
  saveOffers(offers)
}

export function updateOffer(updatedOffer: Offer): void {
  const offers = getOffers()
  const index = offers.findIndex(o => o.id === updatedOffer.id)
  if (index !== -1) {
    offers[index] = updatedOffer
    saveOffers(offers)
  }
}

export function deleteOffer(offerId: string): void {
  const offers = getOffers().filter(o => o.id !== offerId)
  saveOffers(offers)
}

// ============ PEDIDOS ============
export function getOrders(): Order[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(ORDERS_KEY)
  return data ? JSON.parse(data) : []
}

export function addOrder(order: Order): void {
  const orders = getOrders()
  orders.unshift(order) // Agregar al inicio
  saveOrders(orders)
}

export function updateOrderStatus(orderId: string, status: Order['status']): void {
  const orders = getOrders()
  const order = orders.find(o => o.id === orderId)
  if (order) {
    order.status = status
    saveOrders(orders)
  }
}

// ============ AUTENTICACIÓN ADMIN ============
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export function setAdminAuthenticated(value: boolean): void {
  if (typeof window === 'undefined') return
  if (value) {
    localStorage.setItem(AUTH_KEY, 'true')
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

// ============ GENERAR IDS ============
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
