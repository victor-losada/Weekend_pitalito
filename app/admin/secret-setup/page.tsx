'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAdminUser, loginAdmin } from '@/lib/supabase-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Lock, User, ShieldAlert } from 'lucide-react'

export default function SecretAdminSetupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      toast.error('Usuario y contraseña son obligatorios')
      return
    }

    if (password !== confirm) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)

    const ok = await createAdminUser(username.trim(), password)
    if (!ok) {
      toast.error('No se pudo crear el administrador')
      setIsLoading(false)
      return
    }

    toast.success('Administrador creado correctamente')

    // Intentar iniciar sesión automáticamente y mandar al dashboard
    const logged = await loginAdmin(username.trim(), password)
    if (logged) {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-destructive/40 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Setup secreto de administrador
              </h1>
              <p className="text-xs text-muted-foreground">
                Usa esta página solo una vez para crear tu usuario admin y luego bórrala o cámbiale la ruta.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Usuario administrador
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
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
                placeholder="••••••••"
                className="bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirmar contraseña
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                className="bg-background"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Creando administrador...' : 'Crear administrador'}
            </Button>
          </form>

          <p className="text-[11px] text-muted-foreground mt-6">
            Sugerencia: después de crear tu usuario, elimina esta ruta (`app/admin/secret-setup/page.tsx`) o
            renómbrala a algo que solo tú conozcas.
          </p>
        </div>
      </div>
    </div>
  )
}

