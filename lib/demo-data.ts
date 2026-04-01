import { Product, Offer } from './config'

// Productos de demostración para que la tienda no esté vacía
export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    name: 'Lechona Familiar',
    description: 'Lechona tradicional para 8-10 personas, rellena de arroz, arvejas y especias secretas',
    price: 180000,
    category: 'lechonas',
    imageUrl: '/images/lechona-hero.jpg',
    available: true,
    discount: 0
  },
  {
    id: 'demo-2',
    name: 'Lechona Mediana',
    description: 'Perfecta para reuniones de 5-6 personas, el mismo sabor tradicional',
    price: 120000,
    category: 'lechonas',
    imageUrl: '/images/lechona-product.jpg',
    available: true,
    discount: 10
  },
  {
    id: 'demo-3',
    name: 'Porción Individual',
    description: 'Una generosa porción de lechona con arepa y ají',
    price: 25000,
    category: 'lechonas',
    imageUrl: '/images/lechona-hero.jpg',
    available: true,
    discount: 0
  },
  {
    id: 'demo-4',
    name: 'Coca-Cola 1.5L',
    description: 'Bebida gaseosa refrescante para acompañar tu lechona',
    price: 8000,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
    available: true,
    discount: 0
  },
  {
    id: 'demo-5',
    name: 'Limonada Natural 1L',
    description: 'Limonada casera hecha con limones frescos',
    price: 12000,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop',
    available: true,
    discount: 0
  },
  {
    id: 'demo-6',
    name: 'Ají Casero',
    description: 'Salsa de ají tradicional, picante y deliciosa',
    price: 5000,
    category: 'salsas',
    imageUrl: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=400&fit=crop',
    available: true,
    discount: 0
  },
  {
    id: 'demo-7',
    name: 'Guacamole Fresco',
    description: 'Guacamole cremoso hecho con aguacate hass',
    price: 8000,
    category: 'salsas',
    imageUrl: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400&h=400&fit=crop',
    available: true,
    discount: 0
  },
  {
    id: 'demo-8',
    name: 'Arepa Extra',
    description: 'Arepa de maíz asada, perfecta para acompañar',
    price: 3000,
    category: 'addons',
    imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&h=400&fit=crop',
    available: true,
    discount: 0
  }
]

export const DEMO_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    name: '¡Fin de Semana Lechonero!',
    description: 'Descuento especial en todas las lechonas los fines de semana',
    discountPercent: 10,
    isGlobal: false,
    productIds: ['demo-1', 'demo-2', 'demo-3'],
    active: true,
    validUntil: '2026-12-31'
  }
]

// Función para cargar datos de demostración
export function loadDemoData(): { products: Product[], offers: Offer[] } {
  return {
    products: DEMO_PRODUCTS,
    offers: DEMO_OFFERS
  }
}
