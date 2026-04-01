'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getMoodItems, MoodItem } from '@/lib/content-store'

export function MediaShowcaseSection() {
  const [moodItems, setMoodItems] = useState<MoodItem[]>(() => getMoodItems())

  useEffect(() => {
    const sync = () => setMoodItems(getMoodItems())
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  return (
    <section className="px-4 py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex liquid-panel px-4 py-2 rounded-full text-sm font-semibold text-primary">
            Weekend Visual Mood
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-4">
            Un mood visual limpio, ordenado y antojable
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {moodItems.map((item, index) => (
            <article
              key={item.id}
              className={`card-3d group rounded-2xl overflow-hidden border border-white/40 shadow-lg ${
                index === 0 ? 'col-span-2 row-span-2 h-72 md:h-80' : 'h-40 md:h-52'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={item.imageUrl}
                  alt="Producto Weekend Pitalito"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute left-3 bottom-2 text-white/90 text-xs font-semibold tracking-wide">
                  {item.label || 'WEEKEND'}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
