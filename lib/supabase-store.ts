'use client'

import { createClient } from '@/lib/supabase/client'
import { Product, Offer, Order, CartItem } from './config'
import bcrypt from 'bcryptjs'

// ============ PRODUCTOS (desde Supabase) ============
export async function getProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  
  return data.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    category: p.category,
    imageUrl: p.image_url || '/images/lechona-hero.jpg',
    available: p.available,
    discount: p.discount || 0
  }))
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  
  return data.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    category: p.category,
    imageUrl: p.image_url || '/images/lechona-hero.jpg',
    available: p.available,
    discount: p.discount || 0
  }))
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.imageUrl,
      available: product.available,
      discount: product.discount || 0
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding product:', error)
    return null
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    price: data.price,
    category: data.category,
    imageUrl: data.image_url || '/images/lechona-hero.jpg',
    available: data.available,
    discount: data.discount || 0
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
  const supabase = createClient()
  const updateData: Record<string, unknown> = {}
  
  if (product.name !== undefined) updateData.name = product.name
  if (product.description !== undefined) updateData.description = product.description
  if (product.price !== undefined) updateData.price = product.price
  if (product.category !== undefined) updateData.category = product.category
  if (product.imageUrl !== undefined) updateData.image_url = product.imageUrl
  if (product.available !== undefined) updateData.available = product.available
  if (product.discount !== undefined) updateData.discount = product.discount
  
  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
  
  if (error) {
    console.error('Error updating product:', error)
    return false
  }
  
  return true
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting product:', error)
    return false
  }
  
  return true
}

// ============ OFERTAS (desde Supabase) ============
// Esquema esperado en Supabase (tabla `offers`):
// id (uuid, PK)
// name (text)
// description (text)
// discount_percent (int4)
// discount_amount (numeric, opcional)
// min_purchase (numeric, opcional)
// active (bool)
// start_date (timestamptz)
// end_date (timestamptz, opcional)
// created_at (timestamptz)

export async function getOffers(): Promise<Offer[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('offers')
    .select('id, name, description, discount_percent, active')
    .eq('active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching offers:', error)
    return []
  }
  
  return data.map(o => ({
    id: o.id,
    name: o.name,
    description: o.description || '',
    discountPercent: o.discount_percent,
    // Con el esquema actual no hay columnas por producto, así que lo tratamos como global
    isGlobal: true,
    productIds: undefined,
    active: o.active,
    validUntil: undefined
  }))
}

export async function getAllOffers(): Promise<Offer[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('offers')
    .select('id, name, description, discount_percent, active')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching offers:', error)
    return []
  }
  
  return data.map(o => ({
    id: o.id,
    name: o.name,
    description: o.description || '',
    discountPercent: o.discount_percent,
    isGlobal: true,
    productIds: undefined,
    active: o.active,
    validUntil: undefined
  }))
}

export async function addOffer(offer: Omit<Offer, 'id'>): Promise<Offer | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('offers')
    .insert({
      name: offer.name,
      description: offer.description,
      discount_percent: offer.discountPercent,
      active: offer.active,
      // Puedes añadir start_date/end_date si las necesitas más adelante
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding offer:', error)
    throw new Error(error.message)
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    discountPercent: data.discount_percent,
    isGlobal: true,
    productIds: undefined,
    active: data.active,
    validUntil: undefined
  }
}

export async function updateOffer(id: string, offer: Partial<Offer>): Promise<boolean> {
  const supabase = createClient()
  const updateData: Record<string, unknown> = {}
  
  if (offer.name !== undefined) updateData.name = offer.name
  if (offer.description !== undefined) updateData.description = offer.description
  if (offer.discountPercent !== undefined) updateData.discount_percent = offer.discountPercent
  if (offer.active !== undefined) updateData.active = offer.active
  // Si luego quieres manejar fechas, aquí puedes mapearlas
  
  const { error } = await supabase
    .from('offers')
    .update(updateData)
    .eq('id', id)
  
  if (error) {
    console.error('Error updating offer:', error)
    throw new Error(error.message)
  }
 
  return true
}

export async function deleteOffer(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('offers')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting offer:', error)
    return false
  }
  
  return true
}

// ============ PEDIDOS (desde Supabase) ============
export async function getOrders(): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return data.map(o => ({
    id: o.id,
    items: o.items,
    customerName: o.customer_name,
    customerPhone: o.customer_phone,
    customerAddress: o.customer_address || undefined,
    orderType: o.order_type,
    subtotal: o.subtotal ?? 0,
    total: o.total,
    discount: o.discount_applied ?? 0,
    status: o.status,
    createdAt: o.created_at
  }))
}

export async function addOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .insert({
      items: order.items,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.customerAddress || null,
      order_type: order.orderType,
      subtotal: order.subtotal ?? 0,
      total: order.total,
      discount_applied: order.discount ?? 0,
      status: order.status
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding order:', error)
    return null
  }
  
  return {
    id: data.id,
    items: data.items,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    customerAddress: data.customer_address || undefined,
    orderType: data.order_type,
    subtotal: data.subtotal ?? 0,
    total: data.total,
    discount: data.discount_applied ?? 0,
    status: data.status,
    createdAt: data.created_at
  }
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating order status:', error)
    return false
  }
  
  return true
}

// ============ AUTENTICACION ADMIN ============
export type AdminSession = { id: string; username: string; loginAt: string }

export async function createAdminUser(username: string, password: string): Promise<boolean> {
  const supabase = createClient()
  // Hash real de la contraseña (bcrypt).
  // Nota: antes guardábamos texto plano; ahora guardamos el hash en `password_hash`.
  const passwordHash = await bcrypt.hash(password, 12)
  const { error } = await supabase
    .from('admin_users')
    .insert({
      username,
      password_hash: passwordHash,
    })

  if (error) {
    console.error('Error creating admin user:', error)
    return false
  }

  return true
}

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .single()
  
  if (error || !data) {
    return false
  }
  
  const stored = data.password_hash
  // Compat temporal: si el admin ya existía con texto plano, comparamos directo.
  // Si tiene formato de bcrypt ($2a$/$2b$/$2y$), usamos compare().
  const isBcryptHash = typeof stored === 'string' && stored.startsWith('$2')
  const ok = isBcryptHash
    ? await bcrypt.compare(password, stored)
    : stored === password

  if (!ok) return false

  // Guardar sesion en localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_session', JSON.stringify({
      id: data.id,
      username: data.username,
      loginAt: new Date().toISOString()
    }))
  }
  
  return true
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null
  const session = localStorage.getItem('admin_session')
  return session ? JSON.parse(session) : null
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_session')
  }
}

// Compat: API usada por páginas viejas
export function isAdminAuthenticated(): boolean {
  return !!getAdminSession()
}

// ============ CARRITO (localStorage - cliente) ============
const CART_KEY = 'amascar_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(CART_KEY)
  return data ? JSON.parse(data) : []
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function addToCart(product: Product, quantity: number = 1): CartItem[] {
  const cart = getCart()
  const existingIndex = cart.findIndex(item => item.id === product.id)
  
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity
  } else {
    cart.push({ ...product, quantity })
  }
  
  saveCart(cart)
  return cart
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter(item => item.id !== productId)
  saveCart(cart)
  return cart
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCart()
  const index = cart.findIndex(item => item.id === productId)
  
  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1)
    } else {
      cart[index].quantity = quantity
    }
  }
  
  saveCart(cart)
  return cart
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_KEY)
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    const price = item.price
    const discount = item.discount || 0
    const finalPrice = price * (1 - discount / 100)
    return total + (finalPrice * item.quantity)
  }, 0)
}

// Totales estilo `lib/store.ts` (compat con checkout/admin)
export function getCartTotals(cart: CartItem[], offers: Offer[] = []): { subtotal: number; discount: number; total: number } {
  const activeOffers = offers.filter(o => o.active)
  let subtotal = 0
  let discount = 0

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity
    subtotal += itemTotal

    // Descuento individual del producto
    if (item.discount) {
      discount += (itemTotal * item.discount) / 100
    }

    // Ofertas (global o por producto)
    activeOffers.forEach(offer => {
      if (offer.isGlobal || (offer.productIds && offer.productIds.includes(item.id))) {
        discount += (itemTotal * offer.discountPercent) / 100
      }
    })
  })

  discount = Math.min(discount, subtotal)
  return { subtotal, discount, total: subtotal - discount }
}
