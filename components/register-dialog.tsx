"use client"

import React from "react"

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
import { Loader2, CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"

interface RegisterDialogProps {
  trigger?: React.ReactNode
  variant?: "default" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function RegisterDialog({ trigger, variant = "default", size = "sm" }: RegisterDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
    setStatus("idle")
    setErrorMessage("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setTimeout(resetForm, 200)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !email.trim() || !email.includes("@") || password.length < 6) {
      setStatus("error")
      setErrorMessage("Completa todos los campos. La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setLoading(true)
    setStatus("idle")
    setErrorMessage("")

    try {
      const supabase = createClient()
      
      // Create user with Supabase Auth (profile is created automatically via trigger)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      })

      if (authError) {
        throw authError
      }

      // Sign in immediately after signup (no email confirmation needed)
      if (authData.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        })
        
        if (signInError) {
          throw signInError
        }
      }

      setStatus("success")
      setTimeout(() => {
        setOpen(false)
        window.location.href = "/mis-proyectos"
      }, 1000)
    } catch (error: any) {
      setStatus("error")
      if (error.message?.includes("already registered")) {
        setErrorMessage("Este correo ya está registrado")
      } else {
        setErrorMessage(error.message || "Error al registrar")
      }
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && email.includes("@") && password.length >= 6

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={variant} size={size}>
            Registrarse
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Unirse a Vaireo</DialogTitle>
          <DialogDescription>
            Accede al ecosistema de startups agroalimentarias de Espana
          </DialogDescription>
        </DialogHeader>
        
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <div className="text-center">
              <p className="text-lg font-medium">Cuenta creada</p>
              <p className="text-sm text-muted-foreground">Redirigiendo a tus proyectos...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="register-name" className="text-sm font-medium">
                Nombre completo
              </Label>
              <Input
                id="register-name"
                placeholder="Ej: Maria Garcia"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-sm font-medium">
                Correo electronico
              </Label>
              <Input
                id="register-email"
                type="email"
                placeholder="maria@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password" className="text-sm font-medium">
                Contrasena
              </Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Minimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="h-10"
              />
            </div>

            {status === "error" && errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 h-10"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!isFormValid || loading}
                className="flex-1 h-10"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
