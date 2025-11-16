"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Target, TrendingUp, Edit, Trash2, UserPlus } from "lucide-react"
import { type Project, getStatusColor, getStatusLabel } from "@/lib/projects-data"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
  onAddStartups?: (project: Project) => void // Added prop for adding startups
}

export function ProjectCard({ project, onEdit, onDelete, onAddStartups }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatBudget = (budget?: number) => {
    if (!budget) return "Sin presupuesto"
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-xl line-clamp-2">{project.name}</CardTitle>
              <Badge className={`${getStatusColor(project.status)} border`}>{getStatusLabel(project.status)}</Badge>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(project)} className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(project.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Inicio</div>
                <div className="font-medium">{formatDate(project.startDate)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Participantes</div>
                <div className="font-medium">{project.participants.length}</div>
              </div>
            </div>

            {project.budget && (
              <div className="flex items-center gap-2 text-sm col-span-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Presupuesto</div>
                  <div className="font-medium">{formatBudget(project.budget)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Goals */}
          {project.goals.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Target className="h-4 w-4" />
                Objetivos
              </div>
              <ul className="space-y-1">
                {project.goals.slice(0, 2).map((goal, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="line-clamp-1">{goal}</span>
                  </li>
                ))}
                {project.goals.length > 2 && (
                  <li className="text-sm text-muted-foreground">+{project.goals.length - 2} más</li>
                )}
              </ul>
            </div>
          )}

          {/* Participants */}
          {project.participants.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.participants.slice(0, 3).map((participant, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {participant}
                </Badge>
              ))}
              {project.participants.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.participants.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {onAddStartups && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={(e) => {
                  e.preventDefault()
                  onAddStartups(project)
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Añadir Startups
              </Button>
            )}
            <Link href={`/projects/${project.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
