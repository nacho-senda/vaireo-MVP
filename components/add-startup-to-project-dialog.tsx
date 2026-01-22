"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Building2, MapPin, TrendingUp } from "lucide-react"

interface Project {
  id: string
  name: string
  participants: string[]
}

interface Startup {
  Nombre: string
  "Región (CCAA)": string
  "Nivel de madurez"?: string
  Tecnología?: string
}

interface AddStartupToProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  project: Project
  availableStartups: Startup[]
  onAddStartups: (projectId: string, startupNames: string[]) => void
}

export function AddStartupToProjectDialog({
  isOpen,
  onClose,
  project,
  availableStartups,
  onAddStartups,
}: AddStartupToProjectDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStartups, setSelectedStartups] = useState<string[]>([])

  // Filter out startups already in the project
  const availableToAdd = availableStartups.filter((startup) => !project.participants.includes(startup.Nombre))

  // Filter by search query
  const filteredStartups = availableToAdd.filter(
    (startup) =>
      startup.Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup["Región (CCAA)"].toLowerCase().includes(searchQuery.toLowerCase()) ||
      (startup.Tecnología && startup.Tecnología.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleToggleStartup = (startupName: string) => {
    setSelectedStartups((prev) =>
      prev.includes(startupName) ? prev.filter((name) => name !== startupName) : [...prev, startupName],
    )
  }

  const handleAddStartups = () => {
    if (selectedStartups.length > 0) {
      onAddStartups(project.id, selectedStartups)
      setSelectedStartups([])
      setSearchQuery("")
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedStartups([])
    setSearchQuery("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Añadir Startups al Proyecto</DialogTitle>
          <DialogDescription>
            Selecciona las startups del directorio que quieres añadir a "{project.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, ubicación o tecnología..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected count */}
          {selectedStartups.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border">
              <span className="text-sm font-medium">
                {selectedStartups.length} startup{selectedStartups.length !== 1 ? "s" : ""} seleccionada
                {selectedStartups.length !== 1 ? "s" : ""}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStartups([])}>
                Limpiar
              </Button>
            </div>
          )}

          {/* Startups list */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {filteredStartups.length > 0 ? (
                filteredStartups.map((startup) => (
                  <div
                    key={startup.Nombre}
                    className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleToggleStartup(startup.Nombre)}
                  >
                    <Checkbox
                      checked={selectedStartups.includes(startup.Nombre)}
                      onCheckedChange={() => handleToggleStartup(startup.Nombre)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {startup.Nombre}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {startup["Región (CCAA)"]}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {startup["Nivel de madurez"] || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {startup.Tecnología && (
                        <div className="flex flex-wrap gap-1">
                          {String(startup.Tecnología)
                            .split(",")
                            .slice(0, 3)
                            .map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech.trim()}
                              </Badge>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No se encontraron startups</p>
                  {searchQuery && <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleAddStartups} disabled={selectedStartups.length === 0}>
              Añadir {selectedStartups.length > 0 && `(${selectedStartups.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
