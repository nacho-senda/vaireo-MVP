"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Folder, Calendar, Users, TrendingUp, CheckCircle2 } from 'lucide-react'
import { projectsData, getStatusLabel, getStatusColor, type Project } from "@/lib/projects-data"
import type { Startup } from "@/lib/startups-data"

interface SelectProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  startup: Startup | null
  onSelectProject: (projectId: string, startupName: string) => void
}

export function SelectProjectDialog({ isOpen, onClose, startup, onSelectProject }: SelectProjectDialogProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  if (!startup) return null

  // Filter projects where startup is not already a participant
  const availableProjects = projectsData.filter((project) => !project.participants.includes(startup.name))

  const handleAddToProject = () => {
    if (selectedProjectId) {
      onSelectProject(selectedProjectId, startup.name)
      setSelectedProjectId(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedProjectId(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Añadir "{startup.name}" a un Proyecto</DialogTitle>
          <DialogDescription>Selecciona el proyecto al que quieres añadir esta startup</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {availableProjects.length > 0 ? (
            <div className="space-y-3">
              {availableProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent/50 ${
                    selectedProjectId === project.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Folder className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-1 flex items-center gap-2">
                          {project.name}
                          {selectedProjectId === project.id && (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)} variant="outline">
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="truncate">{new Date(project.startDate).toLocaleDateString("es-ES")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{project.participants.length} startups</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{project.progress}% completado</span>
                    </div>
                  </div>

                  {project.budget && (
                    <div className="mt-2 text-xs font-medium text-primary">
                      Presupuesto: €{project.budget.toLocaleString("es-ES")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No hay proyectos disponibles</p>
              <p className="text-sm mt-1">
                Esta startup ya está en todos los proyectos o no hay proyectos creados.
              </p>
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
      </DialogContent>
    </Dialog>
  )
}
