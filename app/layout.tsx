import type { Metadata } from 'next'
import { Nunito, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-display'
})

const bodyFont = Nunito({
  subsets: ["latin"],
  variable: '--font-sans'
})

/* ===========================================
   INSTRUCCIONES PARA EL DUEÑO:
   
   Para cambiar el nombre del negocio, busca "A'MASCAR LECHONERIA"
   en todos los archivos y reemplázalo.
   
   Para cambiar los números de WhatsApp:
   - Ve a lib/config.ts
   - Modifica WHATSAPP_NUMBER
   
   Para cambiar el link de Google Maps:
   - Ve a lib/config.ts
   - Modifica GOOGLE_MAPS_LINK
   
   Para cambiar la contraseña del admin:
   - Ve a lib/config.ts
   - Modifica ADMIN_PASSWORD
   =========================================== */

export const metadata: Metadata = {
  title: "Weekend Pitalito | Coffee, Matcha & Chill",
  description: "Weekend Pitalito: coffee, matcha y experiencias chill en Pitalito, Huila. Bebidas frías y calientes, repostería, sal y coctelería.",
  keywords: "weekend pitalito, cafe pitalito, matcha pitalito, coffee and chill, cocteleria pitalito",
  openGraph: {
    title: "Weekend Pitalito",
    description: "Coffee, Matcha & Chill en Pitalito.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: '/weekend/images/logo-weekend.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/weekend/images/logo-weekend.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/weekend/images/logo-weekend.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${displayFont.variable} ${bodyFont.variable} font-sans antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
