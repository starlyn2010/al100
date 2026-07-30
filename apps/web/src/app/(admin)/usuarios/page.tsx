"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Shield, Truck, User } from "lucide-react"

const USERS = [
  { id: "U-001", name: "Admin AL100", role: "admin", code: "ADMIN", sector: "—" },
  { id: "U-002", name: "Carlos Martínez", role: "driver", code: "CHOFER01", sector: "Zona Colonial" },
  { id: "U-003", name: "María Peña", role: "driver", code: "CHOFER02", sector: "Piantini" },
  { id: "U-004", name: "Pedro Ramírez", role: "driver", code: "CHOFER03", sector: "Los Prados" },
  { id: "U-005", name: "Ana López", role: "driver", code: "CHOFER04", sector: "Ens. Ozama" },
  { id: "U-006", name: "Luis Fernández", role: "driver", code: "CHOFER05", sector: "Villa Consuelo" },
  { id: "U-007", name: "Juan Pérez", role: "citizen", code: "CIUDADANO", sector: "Zona Colonial" },
]

export default function UsersPage() {
  const [search, setSearch] = useState("")

  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-heading font-bold">Usuarios</h1>
          <p className="text-muted-foreground">{USERS.length} usuarios registrados</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Crear Usuario
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.map((u) => {
              const RoleIcon = u.role === "admin" ? Shield : u.role === "driver" ? Truck : User
              return (
                <div key={u.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      u.role === "admin" ? "bg-accent/20" :
                      u.role === "driver" ? "bg-blue-500/20" : "bg-muted/30"
                    }`}>
                      <RoleIcon className={`w-4 h-4 ${
                        u.role === "admin" ? "text-accent" :
                        u.role === "driver" ? "text-blue-400" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{u.sector}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {u.role === "driver" ? "Chofer" : u.role}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
