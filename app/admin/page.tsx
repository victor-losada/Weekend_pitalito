'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BUSINESS_NAME } from '@/lib/config'
import { isAdminAuthenticated, loginAdmin } from '@/lib/supabase-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Lock, User, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  
  useEffect(() => {
    // Verificar si ya está autenticado
    if (isAdminAuthenticated()) {
      router.push('/admin/dashboard')
    } else {
      setCheckingAuth(false)
    }
  }, [router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const ok = await loginAdmin(username, password)
    if (ok) {
      toast.success('¡Bienvenido, administrador!')
      router.push('/admin/dashboard')
    } else {
      toast.error('Credenciales incorrectas')
      setIsLoading(false)
    }
  }
  
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <span className="text-3xl">🍸</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground mt-2">
              {BUSINESS_NAME}
            </p>
          </div>
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="bg-background"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="bg-background"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Ingresando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Ingresar
                </>
              )}
            </Button>
          </form>
          
          {/* Link para volver */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Volver a la tienda
            </Link>
          </div>
        </div>
        
        {/* Nota */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Acceso exclusivo para administradores
        </p>
      </div>
    </div>
  )
}
