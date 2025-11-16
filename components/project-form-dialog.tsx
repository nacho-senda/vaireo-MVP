"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Project } from "@/lib/projects-data"
import { startupsData } from "@/lib/startups-data"

interface ProjectFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (project: Partial<Project>) => void
  project?: Project | null
}

export function ProjectFormDialog({ isOpen, onClose, onSave, project }: ProjectFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    description: "",
    status: "planning",
    startDate: "",
    endDate: "",
    budget: undefined,
    participants: [],
    goals: [],
    progress: 0,
  })

  const [newGoal, setNewGoal] = useState("")
  const [selectedStartup, setSelectedStartup] = useState("")

  useEffect(() => {
    if (project) {
      setFormData(project)
    } else {
      setFormData({
        name: "",
        description: "",
        status: "planning",
        startDate: "",
        endDate: "",
        budget: undefined,
        participants: [],
        goals: [],
        progress: 0,
      })
    }
  }, [project, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData({
        ...formData,
        goals: [...(formData.goals || []), newGoal.trim()],
      })
      setNewGoal("")
    }
  }

  const removeGoal = (index: number) => {
    setFormData({
      ...formData,
      goals: formData.goals?.filter((_, i) => i !== index) || [],
    })
  }

  const addParticipant = () => {
    if (selectedStartup && !formData.participants?.includes(selectedStartup)) {
      setFormData({
        ...formData,
        participants: [...(formData.participants || []), selectedStartup],
      })
      setSelectedStartup("")
    }
  }

  const removeParticipant = (participant: string) => {
    setFormData({
      ...formData,
      participants: formData.participants?.filter((p) => p !== participant) || [],
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Proyecto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ej: Programa de Aceleración 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                placeholder="Describe el proyecto y sus objetivos principales..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Project["status"]) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planificación</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="on-hold">En Pausa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">Progreso (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Presupuesto (€)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                value={formData.budget || ""}
                onChange={(e) => setFormData({ ...formData, budget: Number.parseInt(e.target.value) || undefined })}
                placeholder="Ej: 500000"
              />
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-3">
            <Label>Objetivos</Label>
            <div className="flex gap-2">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Añadir objetivo..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
              />
              <Button type="button" onClick={addGoal} variant="outline">
                Añadir
              </Button>
            </div>
            {formData.goals && formData.goals.length > 0 && (
              <div className="space-y-2">
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <span className="flex-1 text-sm">{goal}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoal(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="space-y-3">
            <Label>Participantes</Label>
            <div className="flex gap-2">
              <Select value={selectedStartup} onValueChange={setSelectedStartup}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar startup..." />
                </SelectTrigger>
                <SelectContent>
                  {startupsData
                    .filter((s) => !formData.participants?.includes(s.name))
                    .map((startup) => (
                      <SelectItem key={startup.name} value={startup.name}>
                        {startup.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addParticipant} variant="outline">
                Añadir
              </Button>
            </div>
            {formData.participants && formData.participants.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.participants.map((participant) => (
                  <Badge key={participant} variant="secondary" className="text-sm">
                    {participant}
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant)}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{project ? "Guardar Cambios" : "Crear Proyecto"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
