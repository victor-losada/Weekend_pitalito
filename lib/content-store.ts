'use client'

export type DealCategory =
  | 'promociones-semanales'
  | 'combos-tematicos'
  | 'ofertas-especiales'

export interface DealItemConfig {
  id: string
  name: string
  description: string
  emotionalCopy: string
  normalPrice?: string
  specialPrice: string
  specialPriceValue: number
  image: string
  badge: string
}

export interface MoodItem {
  id: string
  imageUrl: string
  label?: string
}

export type DealsConfig = Record<DealCategory, DealItemConfig[]>

const DEALS_KEY = 'weekend_deals_config_v1'
const MOOD_KEY = 'weekend_mood_config_v1'

export const defaultDealsConfig: DealsConfig = {
  'promociones-semanales': [
    {
      id: 'matcha-monday',
      name: 'Matcha Monday',
      description: 'Todos los lunes, 20% OFF en cualquier Matcha (frío o caliente).',
      emotionalCopy: 'Empieza la semana con un sorbo verde que abraza.',
      normalPrice: '$18.000',
      specialPrice: '$14.400',
      specialPriceValue: 14400,
      image: '/weekend/images/menu-05.png',
      badge: 'Lunes',
    },
    {
      id: 'tarde-dulce',
      name: 'Tarde Dulce',
      description: 'Miércoles: bebida caliente + cookie o porción de torta.',
      emotionalCopy: 'Una pausa suave para recargar el alma.',
      normalPrice: '$23.000',
      specialPrice: '$18.000',
      specialPriceValue: 18000,
      image: '/weekend/images/menu-04.png',
      badge: 'Miércoles',
    },
  ],
  'combos-tematicos': [
    {
      id: 'combo-pareja',
      name: 'Combo Pareja',
      description: '2 bebidas a elección + 1 torta o 2 cheesecakes por porción.',
      emotionalCopy: 'Ideal para una cita linda y muchas fotos.',
      normalPrice: '$43.000',
      specialPrice: '$35.000',
      specialPriceValue: 35000,
      image: '/weekend/images/menu-02.png',
      badge: 'Top',
    },
    {
      id: 'combo-solo',
      name: 'Combo Solo Time',
      description: '1 bebida grande + 1 postre (cookie o canapé).',
      emotionalCopy: 'Tu momento calmado, sin prisa.',
      normalPrice: '$20.000',
      specialPrice: '$16.000',
      specialPriceValue: 16000,
      image: '/weekend/images/menu-01.png',
      badge: 'Chill',
    },
    {
      id: 'combo-work',
      name: 'Combo Work & Chill',
      description: 'Bebida grande + bagel salado + aromática.',
      emotionalCopy: 'Productividad y placer en equilibrio.',
      normalPrice: '$28.000',
      specialPrice: '$22.000',
      specialPriceValue: 22000,
      image: '/weekend/images/menu-07.png',
      badge: 'Office',
    },
    {
      id: 'combo-amigos',
      name: 'Combo Amigos',
      description: '4 bebidas + bandeja de 6 mini cookies o canapés.',
      emotionalCopy: 'Plan de parche perfecto para compartir.',
      normalPrice: '$58.000',
      specialPrice: '$48.000',
      specialPriceValue: 48000,
      image: '/weekend/images/menu-03.png',
      badge: 'Grupal',
    },
  ],
  'ofertas-especiales': [
    {
      id: 'regala-weekend',
      name: 'Regala Weekend',
      description: 'Boxes: bebida + postre + nota personalizada.',
      emotionalCopy: 'Un detalle aesthetic que sí emociona.',
      normalPrice: '$32.000',
      specialPrice: '$27.000',
      specialPriceValue: 27000,
      image: '/weekend/images/menu-05.png',
      badge: 'Gift',
    },
    {
      id: 'after-work',
      name: 'After Work Chill',
      description: '15% OFF en coctelería después de las 5:00 pm.',
      emotionalCopy: 'Cierra el día con sabor y calma premium.',
      normalPrice: '$24.000',
      specialPrice: '$20.400',
      specialPriceValue: 20400,
      image: '/weekend/images/menu-02.png',
      badge: '5PM+',
    },
  ],
}

export const defaultMoodItems: MoodItem[] = [
  { id: 'm1', imageUrl: '/weekend/images/menu-01.png', label: 'WEEKEND' },
  { id: 'm2', imageUrl: '/weekend/images/menu-02.png', label: 'MATCHA' },
  { id: 'm3', imageUrl: '/weekend/images/menu-03.png', label: 'COZY' },
  { id: 'm4', imageUrl: '/weekend/images/menu-04.png', label: 'CHILL' },
  { id: 'm5', imageUrl: '/weekend/images/menu-05.png', label: 'AESTHETIC' },
  { id: 'm6', imageUrl: '/weekend/images/menu-06.png', label: 'SWEET' },
  { id: 'm7', imageUrl: '/weekend/images/menu-07.png', label: 'WEEKEND' },
]

export function getDealsConfig(): DealsConfig {
  if (typeof window === 'undefined') return defaultDealsConfig
  try {
    const raw = localStorage.getItem(DEALS_KEY)
    if (!raw) return defaultDealsConfig
    const parsed = JSON.parse(raw) as Partial<DealsConfig>
    return {
      'promociones-semanales': parsed['promociones-semanales'] || defaultDealsConfig['promociones-semanales'],
      'combos-tematicos': parsed['combos-tematicos'] || defaultDealsConfig['combos-tematicos'],
      'ofertas-especiales': parsed['ofertas-especiales'] || defaultDealsConfig['ofertas-especiales'],
    }
  } catch {
    return defaultDealsConfig
  }
}

export function saveDealsConfig(config: DealsConfig) {
  if (typeof window === 'undefined') return
  localStorage.setItem(DEALS_KEY, JSON.stringify(config))
}

export function getMoodItems(): MoodItem[] {
  if (typeof window === 'undefined') return defaultMoodItems
  try {
    const raw = localStorage.getItem(MOOD_KEY)
    if (!raw) return defaultMoodItems
    const parsed = JSON.parse(raw) as MoodItem[]
    return parsed.length ? parsed : defaultMoodItems
  } catch {
    return defaultMoodItems
  }
}

export function saveMoodItems(items: MoodItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(MOOD_KEY, JSON.stringify(items))
}
