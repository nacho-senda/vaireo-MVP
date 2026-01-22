"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Folder, Calendar, CheckCircle2, Plus, LogIn, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Startup } from "@/lib/utils/formatting"

interface Project {
  id: string
  name: string
  description: string | null
  created_at: string
  created_by: string
}

interface SelectProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  startup: Startup | null
  onSelectProject: (projectId: string, startupName: string) => void
}

export function SelectProjectDialog({ isOpen, onClose, startup, onSelectProject }: SelectProjectDialogProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authTab, setAuthTab] = useState<"login" | "register">("login")
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")

  // Auth form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  // New project states
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [creatingProject, setCreatingProject] = useState(false)

  useEffect(() => {
    if (isOpen) {
      checkUserAndLoadProjects()
    }
  }, [isOpen])

  async function checkUserAndLoadProjects() {
    try {
      setLoading(true)
      const supabase = createClient()

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)

      if (currentUser) {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("created_by", currentUser.id)
          .order("created_at", { ascending: false })

        setProjects((data as Project[]) || [])
      }
    } catch (error) {
      console.error("Error loading projects:", error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError("")

    try {
      const supabase = createClient()

      if (authTab === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (error) throw error

        if (data.user) {
          await supabase.auth.signInWithPassword({ email, password })
        }
      }

      await checkUserAndLoadProjects()
      setEmail("")
      setPassword("")
      setName("")
    } catch (error: any) {
      setAuthError(error.message || "Error de autenticación")
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleCreateProject() {
    if (!newProjectName.trim() || !user) return

    setCreatingProject(true)
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: newProjectName.trim(),
          description: newProjectDescription.trim() || null,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Add user as project member
      await supabase.from("project_members").insert({
        project_id: data.id,
        user_id: user.id,
        role: "owner",
      })

      setProjects([data, ...projects])
      setSelectedProjectId(data.id)
      setShowNewProject(false)
      setNewProjectName("")
      setNewProjectDescription("")
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setCreatingProject(false)
    }
  }

  if (!startup) return null

  const startupName = startup.Nombre || startup.name || "Startup"

  const handleAddToProject = () => {
    if (selectedProjectId) {
      onSelectProject(selectedProjectId, startupName)
      setSelectedProjectId(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedProjectId(null)
    setShowNewProject(false)
    onClose()
  }

  // Show auth form if no user
  if (!user && !loading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inicia sesión para continuar</DialogTitle>
            <DialogDescription>
              Necesitas una cuenta para añadir startups a tus proyectos
            </DialogDescription>
          </DialogHeader>

          <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="register">
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleAuth} className="mt-4 space-y-4">
              <TabsContent value="register" className="mt-0">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required={authTab === "register"}
                  />
                </div>
              </TabsContent>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              {authError && <p className="text-sm text-destructive">{authError}</p>}

              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? "Cargando..." : authTab === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </Button>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Añadir "{startupName}" a un Proyecto</DialogTitle>
          <DialogDescription>Selecciona el proyecto al que quieres añadir esta startup</DialogDescription>
        </DialogHeader>

        {showNewProject ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Nombre del proyecto</Label>
              <Input
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Ej: Inversiones Q1 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Descripción (opcional)</Label>
              <Input
                id="projectDescription"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Breve descripción del proyecto"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNewProject(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProject} disabled={!newProjectName.trim() || creatingProject}>
                {creatingProject ? "Creando..." : "Crear Proyecto"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-2">
              <Button variant="outline" size="sm" onClick={() => setShowNewProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </div>

            <ScrollArea className="h-[350px] pr-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Cargando proyectos...</p>
                </div>
              ) : projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent/50 ${
                        selectedProjectId === project.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Folder className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base mb-1 flex items-center gap-2">
                            {project.name}
                            {selectedProjectId === project.id && (
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </h4>
                          {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                          )}
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Creado {new Date(project.created_at).toLocaleDateString("es-ES")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No tienes proyectos</p>
                  <p className="text-sm mt-1">Crea tu primer proyecto para empezar a organizar startups</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setShowNewProject(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Proyecto
                  </Button>
                </div>
              )}
            </ScrollArea>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleAddToProject} disabled={!selectedProjectId}>
                Añadir a Proyecto
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
