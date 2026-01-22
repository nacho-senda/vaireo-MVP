"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X, Filter } from "lucide-react"

export interface FilterState {
  search: string
  location: string
  fundingStage: string
  technologies: string[]
  foundingYearRange: [number, number]
  impact: string
  founderGender: string
}

interface StartupFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

// Placeholder data - these will be derived from actual startups in the future
const getAllTechnologies = () => ["IA", "IoT", "Blockchain", "Biotecnología"]
const getAllLocations = () => ["Madrid", "Barcelona", "Valencia", "Cataluña"]
const getAllFundingStages = () => ["Seed", "Serie A", "Serie B", "Crecimiento"]
const getAllImpacts = () => ["Sostenibilidad", "Tecnología", "Innovación"]
const getAllGenders = () => ["Mixto", "Femenino", "Masculino"]

export function StartupFilters({ filters, onFiltersChange }: StartupFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const technologies = getAllTechnologies()
  const locations = getAllLocations()
  const fundingStages = getAllFundingStages()
  const impacts = getAllImpacts()
  const genders = getAllGenders()

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const addTechnology = (tech: string) => {
    if (!filters.technologies.includes(tech)) {
      updateFilters({ technologies: [...filters.technologies, tech] })
    }
  }

  const removeTechnology = (tech: string) => {
    updateFilters({ technologies: filters.technologies.filter((t) => t !== tech) })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      location: "",
      fundingStage: "",
      technologies: [],
      foundingYearRange: [2008, 2025],
      impact: "",
      founderGender: "",
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.fundingStage ||
    filters.technologies.length > 0 ||
    filters.impact ||
    filters.founderGender

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Contraer" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nombre o descripción..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Location */}
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Select value={filters.location} onValueChange={(value) => updateFilters({ location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ubicaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Funding Stage */}
            <div className="space-y-2">
              <Label>Etapa de Financiación</Label>
              <Select value={filters.fundingStage} onValueChange={(value) => updateFilters({ fundingStage: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las etapas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las etapas</SelectItem>
                  {fundingStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Área de Impacto</Label>
              <Select value={filters.impact} onValueChange={(value) => updateFilters({ impact: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {impacts.map((impact) => (
                    <SelectItem key={impact} value={impact}>
                      {impact}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Género del Fundador</Label>
              <Select value={filters.founderGender} onValueChange={(value) => updateFilters({ founderGender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label>Tecnologías</Label>
              <Select onValueChange={addTechnology}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tecnología" />
                </SelectTrigger>
                <SelectContent>
                  {technologies
                    .filter((tech) => !filters.technologies.includes(tech))
                    .map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {filters.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTechnology(tech)}
                    >
                      {tech}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
