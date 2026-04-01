'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Product, 
  Offer, 
  Order, 
  PRODUCT_CATEGORIES, 
  MENU_SUBCATEGORIES,
  ProductCategory,
  formatPrice,
  BUSINESS_NAME
} from '@/lib/config'
import { 
  isAdminAuthenticated,
  logoutAdmin,
} from '@/lib/supabase-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  DealCategory,
  DealItemConfig,
  DealsConfig,
  MoodItem,
  defaultDealsConfig,
  getDealsConfig,
  getMoodItems,
  saveDealsConfig,
  saveMoodItems,
} from '@/lib/content-store'
import { 
  Package, 
  Tag, 
  ShoppingBag, 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [ordersPage, setOrdersPage] = useState(1)
  const [ordersPageSize] = useState(2)
  const [ordersQuery, setOrdersQuery] = useState('')
  const [ordersStatus, setOrdersStatus] = useState<'all' | Order['status']>('all')
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Estado para formularios
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [selectedDealsCategory, setSelectedDealsCategory] = useState<DealCategory>('promociones-semanales')
  const [dealsConfig, setDealsConfig] = useState<DealsConfig>(defaultDealsConfig)
  const [moodItems, setMoodItems] = useState<MoodItem[]>([])
  const [editingDealId, setEditingDealId] = useState<string | null>(null)
  const [editingMoodId, setEditingMoodId] = useState<string | null>(null)
  
  // Formulario de producto
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'bebidas-frias' as ProductCategory,
    imageUrl: '',
    available: true,
    discount: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Formulario de oferta
  const [offerForm, setOfferForm] = useState({
    name: '',
    description: '',
    discountPercent: '',
    isGlobal: true,
    active: true,
    validUntil: ''
  })
  const [dealForm, setDealForm] = useState<Omit<DealItemConfig, 'id'>>({
    name: '',
    description: '',
    emotionalCopy: '',
    normalPrice: '',
    specialPrice: '',
    specialPriceValue: 0,
    image: '',
    badge: '',
  })
  const [moodForm, setMoodForm] = useState<{ imageUrl: string; label: string }>({
    imageUrl: '',
    label: '',
  })
  const [productSubcategory, setProductSubcategory] = useState<string>('Ninguna')

  async function loadData() {
    setIsLoading(true)
    try {
      const [productsRes, offersRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/offers'),
      ])

      const productsData = await productsRes.json().catch(() => ({}))
      const offersData = await offersRes.json().catch(() => ({}))

      if (!productsRes.ok) throw new Error(productsData.error || 'No se pudieron cargar productos')
      if (!offersRes.ok) throw new Error(offersData.error || 'No se pudieron cargar ofertas')

      setProducts(productsData.products || [])
      setOffers(offersData.offers || [])
      setDealsConfig(getDealsConfig())
      setMoodItems(getMoodItems())
    } catch (e) {
      console.error(e)
      toast.error(e instanceof Error ? e.message : 'No se pudieron cargar los datos del admin')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadOrders(next?: { page?: number; q?: string; status?: 'all' | Order['status'] }) {
    const page = next?.page ?? ordersPage
    const q = next?.q ?? ordersQuery
    const status = next?.status ?? ordersStatus

    setIsOrdersLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('pageSize', String(ordersPageSize))
      if (q.trim()) params.set('q', q.trim())
      if (status !== 'all') params.set('status', status)
      else params.set('status', 'all')

      const res = await fetch(`/api/admin/orders?${params.toString()}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudieron cargar los pedidos')

      setOrders(data.orders || [])
      setOrdersTotal(Number(data.total) || 0)
    } catch (e) {
      console.error(e)
      toast.error(e instanceof Error ? e.message : 'No se pudieron cargar los pedidos')
    } finally {
      setIsOrdersLoading(false)
    }
  }
  
  useEffect(() => {
    // Verificar autenticación
    if (!isAdminAuthenticated()) {
      router.push('/admin')
      return
    }
    
    loadData()
  }, [router])

  useEffect(() => {
    if (activeTab !== 'orders') return
    loadOrders({ page: ordersPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, ordersPage])
  
  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin')
  }
  
  // ============ PRODUCTOS ============
  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'bebidas-frias',
      imageUrl: '',
      available: true,
      discount: ''
    })
    setImageFile(null)
    setImagePreview(null)
    setProductSubcategory('Ninguna')
    setEditingProduct(null)
    setShowProductForm(false)
  }
  
  const handleEditProduct = (product: Product) => {
    const [mainCategory, subcategory] = String(product.category).split('::')
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: (PRODUCT_CATEGORIES.some((c) => c.id === mainCategory) ? mainCategory : 'bebidas-frias') as ProductCategory,
      imageUrl: product.imageUrl,
      available: product.available,
      discount: product.discount?.toString() || ''
    })
    setProductSubcategory(subcategory || 'Ninguna')
    setImageFile(null)
    setImagePreview(product.imageUrl || null)
    setEditingProduct(product)
    setShowProductForm(true)
  }
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe pesar menos de 5MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price) {
      toast.error('Nombre y precio son obligatorios')
      return
    }
    
    let imageUrl = productForm.imageUrl

    // Si el usuario seleccionó un archivo, lo subimos vía API (servidor con service role, evita RLS de Storage)
    if (imageFile) {
      try {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/admin/upload-product-image', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json().catch(() => ({}))
        if (!uploadRes.ok || !uploadData.url) {
          toast.error(uploadData.error || 'No se pudo subir la imagen')
          return
        }
        imageUrl = uploadData.url
      } catch (err) {
        console.error(err)
        toast.error('Error inesperado al subir la imagen')
        return
      }
    }

    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category:
        productSubcategory !== 'Ninguna' && productSubcategory
          ? `${productForm.category}::${productSubcategory}`
          : productForm.category,
      imageUrl,
      available: productForm.available,
      discount: productForm.discount ? parseFloat(productForm.discount) : undefined
    }
    
    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            imageUrl: productData.imageUrl,
            available: productData.available,
            discount: productData.discount
          })
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) toast.success('Producto actualizado')
        else toast.error(data.error || 'No se pudo actualizar el producto')
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            imageUrl: productData.imageUrl,
            available: productData.available,
            discount: productData.discount
          })
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.id) toast.success('Producto agregado')
        else toast.error(data.error || 'No se pudo agregar el producto')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error al guardar el producto')
      return
    }
    
    await loadData()
    resetProductForm()
  }
  
  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      await loadData()
      if (res.ok) toast.success('Producto eliminado')
      else toast.error(data.error || 'No se pudo eliminar el producto')
    }
  }
  
  // ============ OFERTAS ============
  const resetOfferForm = () => {
    setOfferForm({
      name: '',
      description: '',
      discountPercent: '',
      isGlobal: true,
      active: true,
      validUntil: ''
    })
    setEditingOffer(null)
    setShowOfferForm(false)
  }
  
  const handleEditOffer = (offer: Offer) => {
    setOfferForm({
      name: offer.name,
      description: offer.description,
      discountPercent: offer.discountPercent.toString(),
      isGlobal: offer.isGlobal,
      active: offer.active,
      validUntil: offer.validUntil || ''
    })
    setEditingOffer(offer)
    setShowOfferForm(true)
  }
  
  const handleSaveOffer = async () => {
    if (!offerForm.name || !offerForm.discountPercent) {
      toast.error('Nombre y porcentaje son obligatorios')
      return
    }
    
    const offerData = {
      name: offerForm.name,
      description: offerForm.description,
      discountPercent: parseFloat(offerForm.discountPercent),
      isGlobal: offerForm.isGlobal,
      active: offerForm.active,
      validUntil: offerForm.validUntil || undefined
    }
    
    try {
      if (editingOffer) {
        const res = await fetch(`/api/admin/offers/${editingOffer.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: offerData.name,
            description: offerData.description,
            discountPercent: offerData.discountPercent,
            active: offerData.active,
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'No se pudo actualizar la oferta')
        toast.success('Oferta actualizada')
      } else {
        const res = await fetch('/api/admin/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: offerData.name,
            description: offerData.description,
            discountPercent: offerData.discountPercent,
            active: offerData.active,
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'No se pudo crear la oferta')
        toast.success('Oferta creada')
      }
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'No se pudo guardar la oferta')
      return
    }
    
    await loadData()
    resetOfferForm()
  }
  
  const handleDeleteOffer = async (offerId: string) => {
    if (confirm('¿Estás seguro de eliminar esta oferta?')) {
      const res = await fetch(`/api/admin/offers/${offerId}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      await loadData()
      if (res.ok) toast.success('Oferta eliminada')
      else toast.error(data.error || 'No se pudo eliminar la oferta')
    }
  }

  const resetDealForm = () => {
    setDealForm({
      name: '',
      description: '',
      emotionalCopy: '',
      normalPrice: '',
      specialPrice: '',
      specialPriceValue: 0,
      image: '',
      badge: '',
    })
    setEditingDealId(null)
  }

  const handleSaveDeal = () => {
    if (!dealForm.name || !dealForm.specialPrice || !dealForm.image) {
      toast.error('Nombre, precio especial e imagen son obligatorios')
      return
    }
    const next = { ...dealsConfig }
    const current = next[selectedDealsCategory] || []
    if (editingDealId) {
      next[selectedDealsCategory] = current.map((d) =>
        d.id === editingDealId ? { ...d, ...dealForm } : d,
      )
    } else {
      next[selectedDealsCategory] = [
        ...current,
        { id: `deal-${Date.now()}`, ...dealForm },
      ]
    }
    setDealsConfig(next)
    saveDealsConfig(next)
    resetDealForm()
    toast.success('Oferta/Combo guardado')
  }

  const handleDeleteDeal = (id: string) => {
    const next = { ...dealsConfig }
    next[selectedDealsCategory] = (next[selectedDealsCategory] || []).filter((d) => d.id !== id)
    setDealsConfig(next)
    saveDealsConfig(next)
    toast.success('Oferta/Combo eliminado')
  }

  const handleSaveMood = () => {
    if (!moodForm.imageUrl) {
      toast.error('La imagen es obligatoria')
      return
    }
    let next: MoodItem[]
    if (editingMoodId) {
      next = moodItems.map((m) =>
        m.id === editingMoodId
          ? { ...m, imageUrl: moodForm.imageUrl, label: moodForm.label }
          : m,
      )
    } else {
      next = [
        ...moodItems,
        { id: `mood-${Date.now()}`, imageUrl: moodForm.imageUrl, label: moodForm.label },
      ]
    }
    setMoodItems(next)
    saveMoodItems(next)
    setMoodForm({ imageUrl: '', label: '' })
    setEditingMoodId(null)
    toast.success('Visual mood actualizado')
  }

  const handleDeleteMood = (id: string) => {
    const next = moodItems.filter((m) => m.id !== id)
    setMoodItems(next)
    saveMoodItems(next)
    toast.success('Elemento mood eliminado')
  }
  
  // ============ PEDIDOS ============
  const handleUpdateOrderStatus = async (orderId: string, status: 'ready' | 'cancelled') => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudo actualizar el estado')
      toast.success('Estado del pedido actualizado')
      await loadOrders()
    } catch (e) {
      console.error(e)
      toast.error(e instanceof Error ? e.message : 'No se pudo actualizar el estado del pedido')
    }
  }
  
  const getStatusBadge = (status: Order['status']) => {
    const styles: Record<Order['status'], string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    const labels: Record<Order['status'], string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Listo para entregar',
      cancelled: 'Cancelado',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl"> <img src="/weekend/images/logo-weekend.png" alt="Logo Weekend Pitalito" className="w-10 h-10" /></span>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">
                Panel de Admin
              </h1>
              <p className="text-xs text-muted-foreground">{BUSINESS_NAME}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Ver tienda →
            </a>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>
      
      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="text-muted-foreground mb-6">Cargando datos…</div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              Productos ({products.length})
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2">
              <Tag className="w-4 h-4" />
              Ofertas ({offers.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Pedidos ({ordersTotal})
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Contenido
            </TabsTrigger>
          </TabsList>
          
          {/* TAB: PRODUCTOS */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Gestionar Productos</h2>
              <Button 
                onClick={() => setShowProductForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Producto
              </Button>
            </div>
            
            {/* Formulario de producto */}
            {showProductForm && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetProductForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      placeholder="Ej: Lechona Familiar"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Categoría *</Label>
                    <Select 
                      value={productForm.category} 
                      onValueChange={(v) => {
                        setProductForm({...productForm, category: v as ProductCategory})
                        setProductSubcategory('Ninguna')
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Subcategoría</Label>
                    <Select value={productSubcategory} onValueChange={setProductSubcategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ninguna">Ninguna</SelectItem>
                        {(MENU_SUBCATEGORIES[productForm.category] || []).map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Precio (COP) *
                    </Label>
                    <Input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      placeholder="Ej: 150000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Descuento (%)
                    </Label>
                    <Input
                      type="number"
                      value={productForm.discount}
                      onChange={(e) => setProductForm({...productForm, discount: e.target.value})}
                      placeholder="Ej: 10"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Descripción</Label>
                    <Input
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Descripción corta del producto"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Imagen del producto
                    </Label>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Se subirá a Supabase Storage (bucket `product-images`). Máx. 5MB.
                      </p>
                      {(imagePreview || productForm.imageUrl) && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Vista previa:</p>
                          <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            <img
                              src={imagePreview || productForm.imageUrl}
                              alt="Vista previa"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={productForm.available}
                      onCheckedChange={(v) => setProductForm({...productForm, available: v})}
                    />
                    <Label>Disponible</Label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={resetProductForm}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProduct} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Save className="w-4 h-4" />
                    Guardar
                  </Button>
                </div>
              </div>
            )}
            
            {/* Lista de productos */}
            {products.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No hay productos aún</p>
                <p className="text-sm text-muted-foreground/70">Agrega tu primer producto para comenzar</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🐷</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <span className="px-2 py-0.5 bg-secondary/20 text-secondary-foreground text-xs rounded">
                          {String(product.category).replace('::', ' / ')}
                        </span>
                        {!product.available && (
                          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                            No disponible
                          </span>
                        )}
                        {product.discount && product.discount > 0 && (
                          <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                      <p className="text-primary font-semibold">{formatPrice(product.price)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* TAB: OFERTAS */}
          <TabsContent value="offers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Gestionar Ofertas</h2>
              <Button 
                onClick={() => setShowOfferForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Oferta
              </Button>
            </div>
            
            {/* Formulario de oferta */}
            {showOfferForm && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    {editingOffer ? 'Editar Oferta' : 'Nueva Oferta'}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetOfferForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre de la oferta *</Label>
                    <Input
                      value={offerForm.name}
                      onChange={(e) => setOfferForm({...offerForm, name: e.target.value})}
                      placeholder="Ej: Descuento de fin de semana"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Porcentaje de descuento *
                    </Label>
                    <Input
                      type="number"
                      value={offerForm.discountPercent}
                      onChange={(e) => setOfferForm({...offerForm, discountPercent: e.target.value})}
                      placeholder="Ej: 15"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Descripción</Label>
                    <Input
                      value={offerForm.description}
                      onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                      placeholder="Descripción de la oferta"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Válido hasta (opcional)
                    </Label>
                    <Input
                      type="date"
                      value={offerForm.validUntil}
                      onChange={(e) => setOfferForm({...offerForm, validUntil: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4 justify-center">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={offerForm.isGlobal}
                        onCheckedChange={(v) => setOfferForm({...offerForm, isGlobal: v})}
                      />
                      <Label>Aplicar a todos los productos</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={offerForm.active}
                        onCheckedChange={(v) => setOfferForm({...offerForm, active: v})}
                      />
                      <Label>Oferta activa</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={resetOfferForm}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveOffer} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Save className="w-4 h-4" />
                    Guardar
                  </Button>
                </div>
              </div>
            )}
            
            {/* Lista de ofertas */}
            {offers.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                <Tag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No hay ofertas aún</p>
                <p className="text-sm text-muted-foreground/70">Crea tu primera oferta para atraer más clientes</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Percent className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{offer.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded ${offer.active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                          {offer.active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-primary font-semibold">{offer.discountPercent}% OFF</span>
                        <span className="text-muted-foreground">
                          {offer.isGlobal ? 'Todo el catálogo' : 'Productos seleccionados'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditOffer(offer)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* TAB: PEDIDOS */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Pedidos</h2>
                <p className="text-sm text-muted-foreground">
                  Busca por nombre o teléfono. Usa filtros y paginación para manejar alto volumen.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="w-full sm:w-72">
                  <Label htmlFor="ordersSearch" className="text-xs text-muted-foreground">Buscar</Label>
                  <Input
                    id="ordersSearch"
                    value={ordersQuery}
                    onChange={(e) => setOrdersQuery(e.target.value)}
                    placeholder="Nombre o teléfono…"
                  />
                </div>

                <div className="w-full sm:w-56">
                  <Label className="text-xs text-muted-foreground">Estado</Label>
                  <Select
                    value={ordersStatus}
                    onValueChange={(v) => {
                      const next = v as 'all' | Order['status']
                      setOrdersStatus(next)
                      setOrdersPage(1)
                      loadOrders({ page: 1, status: next })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="ready">Listo</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="mt-2 sm:mt-6"
                  onClick={() => {
                    setOrdersPage(1)
                    loadOrders({ page: 1, q: ordersQuery, status: ordersStatus })
                  }}
                  disabled={isOrdersLoading}
                >
                  Aplicar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Mostrando {orders.length} de {ordersTotal}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                  disabled={isOrdersLoading || ordersPage <= 1}
                >
                  Anterior
                </Button>
                <span>Página {ordersPage}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOrdersPage(p => p + 1)}
                  disabled={isOrdersLoading || ordersPage * ordersPageSize >= ordersTotal}
                >
                  Siguiente
                </Button>
              </div>
            </div>

            {isOrdersLoading ? (
              <div className="text-muted-foreground">Cargando pedidos…</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No hay pedidos aún</p>
                <p className="text-sm text-muted-foreground/70">Los pedidos aparecerán aquí cuando los clientes compren</p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-border text-xs font-medium text-muted-foreground">
                  <div className="col-span-3">Pedido</div>
                  <div className="col-span-3">Cliente</div>
                  <div className="col-span-2">Tipo</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-2 text-right">Acciones</div>
                </div>

                <div className="divide-y divide-border">
                  {orders.map((order) => (
                    <div key={order.id} className="px-4 py-4">
                      <div className="grid grid-cols-12 gap-3 items-start">
                        <div className="col-span-12 md:col-span-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">#{order.id.slice(-6)}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleString('es-CO')}
                          </p>
                        </div>

                        <div className="col-span-12 md:col-span-3">
                          <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                          {order.customerAddress && (
                            <p className="text-xs text-muted-foreground truncate">{order.customerAddress}</p>
                          )}
                        </div>

                        <div className="col-span-6 md:col-span-2">
                          <span className="text-sm text-foreground">
                            {order.orderType === 'delivery' ? '🚚 Domicilio' : '📍 Recoger'}
                          </span>
                        </div>

                        <div className="col-span-6 md:col-span-2">
                          <span className="text-sm font-semibold text-primary">{formatPrice(order.total)}</span>
                          {order.discount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Descuento: {formatPrice(order.discount)}
                            </p>
                          )}
                        </div>

                        <div className="col-span-12 md:col-span-2 flex md:justify-end gap-2">
                          <Button
                            size="sm"
                            variant={order.status === 'ready' ? 'default' : 'outline'}
                            onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                            className="gap-1"
                            disabled={order.status === 'cancelled'}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Listo
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                            className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            disabled={order.status === 'cancelled'}
                          >
                            <XCircle className="w-3 h-3" />
                            Cancelar
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 bg-muted/30 rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs">
                              <span className="text-foreground">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="text-muted-foreground">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-8">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Ofertas & Combos (Landing)</h2>
              <div className="flex flex-wrap gap-2">
                {(['promociones-semanales', 'combos-tematicos', 'ofertas-especiales'] as DealCategory[]).map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedDealsCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedDealsCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Input placeholder="Nombre" value={dealForm.name} onChange={(e) => setDealForm({ ...dealForm, name: e.target.value })} />
                <Input placeholder="Badge" value={dealForm.badge} onChange={(e) => setDealForm({ ...dealForm, badge: e.target.value })} />
                <Input placeholder="Precio normal (ej: $24.000)" value={dealForm.normalPrice} onChange={(e) => setDealForm({ ...dealForm, normalPrice: e.target.value })} />
                <Input placeholder="Precio especial (ej: $20.400)" value={dealForm.specialPrice} onChange={(e) => setDealForm({ ...dealForm, specialPrice: e.target.value })} />
                <Input type="number" placeholder="Valor numérico especial" value={dealForm.specialPriceValue} onChange={(e) => setDealForm({ ...dealForm, specialPriceValue: Number(e.target.value) || 0 })} />
                <Input placeholder="URL imagen" value={dealForm.image} onChange={(e) => setDealForm({ ...dealForm, image: e.target.value })} />
                <Input className="md:col-span-2" placeholder="Descripción" value={dealForm.description} onChange={(e) => setDealForm({ ...dealForm, description: e.target.value })} />
                <Input className="md:col-span-2" placeholder="Copy emocional" value={dealForm.emotionalCopy} onChange={(e) => setDealForm({ ...dealForm, emotionalCopy: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveDeal}>{editingDealId ? 'Actualizar' : 'Agregar'}</Button>
                <Button variant="outline" onClick={resetDealForm}>Limpiar</Button>
              </div>

              <div className="grid gap-2">
                {(dealsConfig[selectedDealsCategory] || []).map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between border border-border rounded-lg p-3">
                    <div>
                      <p className="font-semibold">{deal.name}</p>
                      <p className="text-xs text-muted-foreground">{deal.specialPrice} • {deal.badge}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingDealId(deal.id)
                          setDealForm({
                            name: deal.name,
                            description: deal.description,
                            emotionalCopy: deal.emotionalCopy,
                            normalPrice: deal.normalPrice || '',
                            specialPrice: deal.specialPrice,
                            specialPriceValue: deal.specialPriceValue,
                            image: deal.image,
                            badge: deal.badge,
                          })
                        }}
                      >
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteDeal(deal.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Weekend Visual Mood (Landing)</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <Input placeholder="URL imagen" value={moodForm.imageUrl} onChange={(e) => setMoodForm({ ...moodForm, imageUrl: e.target.value })} />
                <Input placeholder="Etiqueta (opcional)" value={moodForm.label} onChange={(e) => setMoodForm({ ...moodForm, label: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveMood}>{editingMoodId ? 'Actualizar' : 'Agregar'}</Button>
                <Button variant="outline" onClick={() => { setMoodForm({ imageUrl: '', label: '' }); setEditingMoodId(null) }}>
                  Limpiar
                </Button>
              </div>
              <div className="grid gap-2">
                {moodItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border border-border rounded-lg p-3">
                    <p className="text-sm truncate">{item.imageUrl}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingMoodId(item.id); setMoodForm({ imageUrl: item.imageUrl, label: item.label || '' }) }}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteMood(item.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
