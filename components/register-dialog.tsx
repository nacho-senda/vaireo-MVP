"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/app/actions/register-user"
import { Loader2 } from 'lucide-react'

interface RegisterDialogProps {
  trigger?: React.ReactNode
  variant?: "default" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function RegisterDialog({ trigger, variant = "default", size = "sm" }: RegisterDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await registerUser(formData)

      if (result.success) {
        toast({
          title: "Registro exitoso",
          description: result.localOnly 
            ? "Registro guardado localmente. Contacta con el administrador para sincronizar con Google Sheets."
            : "Te has registrado correctamente en Vaireo.",
        })
        setOpen(false)
        setFormData({ name: "", company: "", email: "" })
      } else {
        toast({
          title: "Error al registrarse",
          description: result.error || "Por favor, intenta de nuevo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu registro.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.name && formData.company && formData.email && formData.email.includes("@")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={variant} size={size}>
            Registrarse
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registro en Vaireo</DialogTitle>
          <DialogDescription>
            Completa el formulario para registrarte en la plataforma
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              placeholder="Nombre de tu empresa"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isFormValid || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrarse
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
