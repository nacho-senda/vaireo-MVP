"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { ProjectFormDialog } from "@/components/project-form-dialog"
import { AddStartupToProjectDialog } from "@/components/add-startup-to-project-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, FolderKanban, TrendingUp, Users, Target } from "lucide-react"
import { motion } from "framer-motion"
import { projectsData, calculateProjectStats, type Project } from "@/lib/projects-data"
import { startupsData } from "@/lib/startups-data"
import { ChatBubble } from "@/components/chat-bubble"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(projectsData)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isAddStartupsOpen, setIsAddStartupsOpen] = useState(false)
  const [selectedProjectForStartups, setSelectedProjectForStartups] = useState<Project | null>(null)

  const stats = calculateProjectStats()

  const filteredProjects = filterStatus === "all" ? projects : projects.filter((p) => p.status === filterStatus)

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (editingProject) {
      // Update existing project
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id ? { ...p, ...projectData, updatedAt: new Date().toISOString() } : p,
        ),
      )
    } else {
      // Create new project
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: projectData.name || "",
        description: projectData.description || "",
        status: projectData.status || "planning",
        startDate: projectData.startDate || "",
        endDate: projectData.endDate,
        budget: projectData.budget,
        participants: projectData.participants || [],
        goals: projectData.goals || [],
        progress: projectData.progress || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setProjects([newProject, ...projects])
    }
    setEditingProject(null)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      setProjects(projects.filter((p) => p.id !== projectId))
    }
  }

  const handleCreateNew = () => {
    setEditingProject(null)
    setIsFormOpen(true)
  }

  const handleOpenAddStartups = (project: Project) => {
    setSelectedProjectForStartups(project)
    setIsAddStartupsOpen(true)
  }

  const handleAddStartupsToProject = (projectId: string, startupNames: string[]) => {
    setProjects(
      projects.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            participants: [...new Set([...p.participants, ...startupNames])],
            updatedAt: new Date().toISOString(),
          }
        }
        return p
      }),
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
                Gestión de Proyectos
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground"
              >
                Administra y monitorea proyectos colaborativos del ecosistema
              </motion.p>
            </div>
            <Button onClick={handleCreateNew} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Proyectos</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FolderKanban className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Proyectos Activos</p>
                    <p className="text-3xl font-bold">{stats.active}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Presupuesto Total</p>
                    <p className="text-3xl font-bold">
                      {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(stats.totalBudget)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Progreso Promedio</p>
                    <p className="text-3xl font-bold">{stats.averageProgress}%</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <Users className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="planning">Planificación</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="on-hold">En Pausa</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">
                {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProjectCard
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    onAddStartups={handleOpenAddStartups}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="space-y-4">
                <div className="text-6xl">📁</div>
                <h3 className="text-lg font-medium">No hay proyectos</h3>
                <p className="text-muted-foreground">
                  {filterStatus === "all"
                    ? "Crea tu primer proyecto para comenzar"
                    : "No hay proyectos con este estado"}
                </p>
                {filterStatus === "all" && (
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Proyecto
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      <ProjectFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingProject(null)
        }}
        onSave={handleSaveProject}
        project={editingProject}
      />

      {selectedProjectForStartups && (
        <AddStartupToProjectDialog
          isOpen={isAddStartupsOpen}
          onClose={() => {
            setIsAddStartupsOpen(false)
            setSelectedProjectForStartups(null)
          }}
          project={selectedProjectForStartups}
          availableStartups={startupsData}
          onAddStartups={handleAddStartupsToProject}
        />
      )}

      <ChatBubble />
    </div>
  )
}
