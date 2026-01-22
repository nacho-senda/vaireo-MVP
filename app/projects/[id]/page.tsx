"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  TrendingUp,
  ExternalLink,
  Trash2,
  Loader2,
  Plus,
  Briefcase,
} from "lucide-react"
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

interface ProjectStartup {
  id: string
  project_id: string
  startup_id: string
  notes: string | null
  added_at: string
  startups: {
    id: string
    nombre: string
    descripcion: string | null
    region: string | null
    year: number | null
    vertical: string | null
    nivel_madurez: string | null
    inversion_total: string | null
    website: string | null
    tecnologia: string | null
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [projectStartups, setProjectStartups] = useState<ProjectStartup[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    loadProjectData()
  }, [id])

  const loadProjectData = async () => {
    setLoading(true)

    // Get current user
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    setUser(currentUser)

    if (!currentUser) {
      router.push("/projects")
      return
    }

    // Load project
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()

    if (projectError || !projectData) {
      router.push("/projects")
      return
    }

    // Verify user owns the project
    if (projectData.created_by !== currentUser.id) {
      router.push("/projects")
      return
    }

    setProject(projectData)

    // Load project startups with startup details
    const { data: startupsData } = await supabase
      .from("project_startups")
      .select("*, startups(*)")
      .eq("project_id", id)
      .order("added_at", { ascending: false })

    if (startupsData) {
      setProjectStartups(startupsData as ProjectStartup[])
    }

    setLoading(false)
  }

  const handleRemoveStartup = async (projectStartupId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta startup del proyecto?")) return

    const { error } = await supabase.from("project_startups").delete().eq("id", projectStartupId)

    if (!error) {
      setProjectStartups(projectStartups.filter((ps) => ps.id !== projectStartupId))
    }
  }

  const formatCurrency = (value: string | null) => {
    if (!value) return "No disponible"
    const num = Number.parseFloat(value.replace(/[^0-9.-]+/g, ""))
    if (Number.isNaN(num)) return value
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M€`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K€`
    return `${num}€`
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

  if (!project) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Back button and header */}
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/projects")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a proyectos
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">{project.name}</h1>
                {project.description && <p className="text-muted-foreground max-w-2xl">{project.description}</p>}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Creado {new Date(project.created_at).toLocaleDateString("es-ES")}
                  </span>
                  <Badge variant="secondary">{projectStartups.length} startups</Badge>
                </div>
              </div>

              <Button asChild>
                <Link href="/startups">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Startups
                </Link>
              </Button>
            </motion.div>
          </div>

          <Separator />

          {/* Startups Grid */}
          {projectStartups.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Startups en este proyecto</h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projectStartups.map((ps, index) => (
                  <motion.div
                    key={ps.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1 min-w-0">
                            <CardTitle className="text-lg line-clamp-1">{ps.startups.nombre}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {ps.startups.descripcion || "Sin descripción"}
                            </CardDescription>
                          </div>
                          {ps.startups.nivel_madurez && (
                            <Badge variant="outline" className="ml-2 shrink-0">
                              {ps.startups.nivel_madurez}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {ps.startups.region && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span className="truncate">{ps.startups.region}</span>
                            </div>
                          )}
                          {ps.startups.year && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 shrink-0" />
                              <span>{ps.startups.year}</span>
                            </div>
                          )}
                          {ps.startups.vertical && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Briefcase className="h-4 w-4 shrink-0" />
                              <span className="truncate">{ps.startups.vertical}</span>
                            </div>
                          )}
                          {ps.startups.inversion_total && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <TrendingUp className="h-4 w-4 shrink-0" />
                              <span>{formatCurrency(ps.startups.inversion_total)}</span>
                            </div>
                          )}
                        </div>

                        {ps.startups.tecnologia && (
                          <div className="flex flex-wrap gap-1">
                            {ps.startups.tecnologia
                              .split(",")
                              .slice(0, 3)
                              .map((tech, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tech.trim()}
                                </Badge>
                              ))}
                          </div>
                        )}

                        <Separator />

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Añadida {new Date(ps.added_at).toLocaleDateString("es-ES")}
                          </span>
                          <div className="flex gap-1">
                            {ps.startups.website && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={ps.startups.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStartup(ps.id)}
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
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div className="space-y-4">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <h3 className="text-lg font-medium">No hay startups en este proyecto</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Explora el directorio de startups y añade las que te interesen a este proyecto
                </p>
                <Button asChild>
                  <Link href="/startups">
                    <Plus className="h-4 w-4 mr-2" />
                    Explorar Startups
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
