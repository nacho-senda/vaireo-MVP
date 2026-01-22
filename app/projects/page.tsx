"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FolderKanban, LogIn, UserPlus, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

interface Project {
  id: string
  name: string
  description: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [authTab, setAuthTab] = useState<"login" | "register">("login")
  
  // Auth form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  
  // New project form state
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [projectLoading, setProjectLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    checkUserAndLoadProjects()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProjects(session.user.id)
      } else {
        setProjects([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserAndLoadProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      await loadProjects(user.id)
    }
    setLoading(false)
  }

  const loadProjects = async (userId: string) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("created_by", userId)
      .order("updated_at", { ascending: false })
    
    if (!error && data) {
      setProjects(data)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError("")

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setAuthError(error.message === "Invalid login credentials" ? "Credenciales incorrectas" : error.message)
    } else {
      setShowAuthDialog(false)
      resetAuthForm()
    }
    setAuthLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError("")

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
      },
    })

    if (authError) {
      setAuthError(authError.message)
      setAuthLoading(false)
      return
    }

    // Sign in immediately
    if (authData.user) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      
      if (signInError) {
        setAuthError(signInError.message)
      } else {
        setShowAuthDialog(false)
        resetAuthForm()
      }
    }
    setAuthLoading(false)
  }

  const resetAuthForm = () => {
    setEmail("")
    setPassword("")
    setName("")
    setAuthError("")
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newProjectName.trim()) return
    
    setProjectLoading(true)
    
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || null,
        created_by: user.id,
      })
      .select()
      .single()

    if (!error && data) {
      // Add user as project member
      await supabase.from("project_members").insert({
        project_id: data.id,
        user_id: user.id,
        role: "owner",
      })
      
      setProjects([data, ...projects])
      setShowNewProjectDialog(false)
      setNewProjectName("")
      setNewProjectDescription("")
    }
    setProjectLoading(false)
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) return
    
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)

    if (!error) {
      setProjects(projects.filter(p => p.id !== projectId))
    }
  }

  const handleNewProjectClick = () => {
    if (user) {
      setShowNewProjectDialog(true)
    } else {
      setShowAuthDialog(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl"
              >
                Mis Proyectos
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground"
              >
                {user ? "Gestiona tus proyectos y colaboraciones" : "Inicia sesión para gestionar tus proyectos"}
              </motion.p>
            </div>
            <Button onClick={handleNewProjectClick} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </div>

          {/* Content */}
          {user ? (
            <>
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Proyectos</p>
                        <p className="text-3xl font-bold">{projects.length}</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FolderKanban className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Projects Grid */}
              {projects.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                              <CardDescription className="line-clamp-2">
                                {project.description || "Sin descripción"}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">Activo</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Creado {new Date(project.created_at).toLocaleDateString("es-ES")}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/projects/${project.id}`)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-center py-16"
                >
                  <div className="space-y-4">
                    <FolderKanban className="h-16 w-16 mx-auto text-muted-foreground/50" />
                    <h3 className="text-lg font-medium">No tienes proyectos todavía</h3>
                    <p className="text-muted-foreground">
                      Crea tu primer proyecto para empezar a organizar startups
                    </p>
                    <Button onClick={() => setShowNewProjectDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Proyecto
                    </Button>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            /* Not logged in state */
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-center py-16"
            >
              <div className="space-y-6 max-w-md mx-auto">
                <FolderKanban className="h-20 w-20 mx-auto text-muted-foreground/50" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Gestiona tus proyectos</h3>
                  <p className="text-muted-foreground">
                    Inicia sesión o regístrate para crear proyectos y organizar las startups que te interesan
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => { setAuthTab("login"); setShowAuthDialog(true) }}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                  <Button onClick={() => { setAuthTab("register"); setShowAuthDialog(true) }}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrarse
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Accede a tus proyectos</DialogTitle>
            <DialogDescription>
              Inicia sesión o crea una cuenta para gestionar tus proyectos
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {authError && <p className="text-sm text-destructive">{authError}</p>}
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Iniciar Sesión
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 mt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nombre</Label>
                  <Input
                    id="register-name"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
                {authError && <p className="text-sm text-destructive">{authError}</p>}
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Crear Cuenta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Crea un proyecto para organizar las startups que te interesan
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Nombre del proyecto</Label>
              <Input
                id="project-name"
                placeholder="Mi proyecto de inversión"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Descripción (opcional)</Label>
              <Textarea
                id="project-description"
                placeholder="Describe el objetivo de tu proyecto..."
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={projectLoading || !newProjectName.trim()}>
                {projectLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Crear Proyecto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
