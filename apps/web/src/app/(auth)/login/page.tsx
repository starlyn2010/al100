"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Trash2, Truck, Shield } from "lucide-react"

const DEMO_USERS = [
  { code: "ADMIN", name: "Admin AL100", role: "admin" as const },
  { code: "CHOFER01", name: "Carlos Martínez", role: "driver" as const },
  { code: "CHOFER02", name: "María Peña", role: "driver" as const },
  { code: "CIUDADANO", name: "Juan Pérez", role: "citizen" as const },
]

const ADMIN_KEY = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"

async function verifyKey(pass: string): Promise<boolean> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pass))
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")
  return hex === ADMIN_KEY
}

export default function LoginPage() {
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = DEMO_USERS.find((u) => u.code === code.toUpperCase())
    if (!user) {
      setError("Código inválido. Prueba: ADMIN, CHOFER01, o CIUDADANO")
      return
    }

    if (user.role === "admin") {
      if (!password) {
        setError("Ingresa la contraseña de administrador")
        return
      }
      const ok = await verifyKey(password)
      if (!ok) {
        setError("Contraseña incorrecta")
        return
      }
    }

    localStorage.setItem("al100_user", JSON.stringify(user))

    if (user.role === "admin") router.push("/dashboard")
    else if (user.role === "driver") router.push("/conducir")
    else router.push("/ruta")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-accent/20">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <Trash2 className="w-8 h-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-3xl font-heading font-bold tracking-tight">
            AL100
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Plataforma Inteligente de Recolección de Residuos
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Acceso</Label>
              <Input
                id="code"
                placeholder="Ej: ADMIN, CHOFER01, CIUDADANO"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-11 text-center text-lg font-mono tracking-widest uppercase"
                autoFocus
              />
            </div>

            {code.toUpperCase() === "ADMIN" && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 text-center text-lg font-mono tracking-widest"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-medium">
              Ingresar
            </Button>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground mb-3">Usuarios de demostración:</p>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.code}
                    type="button"
                    onClick={() => setCode(u.code)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors"
                  >
                    {u.role === "admin" ? <Shield className="w-4 h-4 text-accent" /> :
                     u.role === "driver" ? <Truck className="w-4 h-4 text-accent" /> :
                     <Trash2 className="w-4 h-4 text-accent" />}
                    <span className="text-[10px] text-muted-foreground font-mono">{u.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
