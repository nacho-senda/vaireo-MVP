"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Edit3, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { FilterState } from "@/lib/advanced-filters"

interface FilterSummaryBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onOpenOverlay: () => void
  resultCount: number
}

export default function FilterSummaryBar({
  filters,
  onFiltersChange,
  onOpenOverlay,
  resultCount,
}: FilterSummaryBarProps) {
  const hasActiveFilters =
    filters.search ||
    filters.semanticQuery ||
    filters.locations.length > 0 ||
    filters.technologies.length > 0 ||
    filters.fundingStages.length > 0 ||
    filters.impacts?.length > 0 ||
    filters.founderGenders?.length > 0 ||
    filters.fundingRange[0] > 0 ||
    filters.fundingRange[1] < 50000000 ||
    filters.yearRange[0] > 2008 ||
    filters.yearRange[1] < 2024

  const removeFilter = (type: keyof FilterState, value?: string) => {
    switch (type) {
      case "search":
      case "semanticQuery":
        onFiltersChange({ ...filters, [type]: "" })
        break
      case "locations":
        onFiltersChange({
          ...filters,
          locations: filters.locations.filter((l) => l !== value),
        })
        break
      case "technologies":
        onFiltersChange({
          ...filters,
          technologies: filters.technologies.filter((t) => t !== value),
        })
        break
      case "fundingStages":
        onFiltersChange({
          ...filters,
          fundingStages: filters.fundingStages.filter((s) => s !== value),
        })
        break
      case "fundingRange":
        onFiltersChange({ ...filters, fundingRange: [0, 50000000] })
        break
      case "yearRange":
        onFiltersChange({ ...filters, yearRange: [2008, 2024] })
        break
      case "impacts":
        onFiltersChange({
          ...filters,
          impacts: filters.impacts?.filter((i) => i !== value) || [],
        })
        break
      case "founderGenders":
        onFiltersChange({
          ...filters,
          founderGenders: filters.founderGenders?.filter((g) => g !== value) || [],
        })
        break
    }
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      locations: [],
      technologies: [],
      fundingStages: [],
      fundingRange: [0, 50000000],
      yearRange: [2008, 2024],
      compatibility: 0,
      proximity: null,
      semanticQuery: "",
      impacts: [],
      founderGenders: [],
    })
  }

  if (!hasActiveFilters) {
    return (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Filtros Inteligentes</p>
                <p className="text-sm text-muted-foreground">
                  Mostrando {resultCount} startups del ecosistema agroalimentario
                </p>
              </div>
            </div>
            <Button onClick={onOpenOverlay} className="gap-2">
              <Filter className="h-4 w-4" />
              Abrir Filtros
            </Button>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <Card className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <Filter className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium text-sm">Filtros Activos</span>
                <Badge variant="secondary" className="text-xs">
                  {resultCount} resultados
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onOpenOverlay} className="gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1.5">
                  <X className="h-3.5 w-3.5" />
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {filters.search && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="outline" className="gap-1.5">
                      Búsqueda: "{filters.search}"
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeFilter("search")}
                      />
                    </Badge>
                  </motion.div>
                )}

                {filters.semanticQuery && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="secondary" className="gap-1.5">
                      Semántico: "{filters.semanticQuery}"
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeFilter("semanticQuery")}
                      />
                    </Badge>
                  </motion.div>
                )}

                {filters.locations.map((location) => (
                  <motion.div
                    key={location}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="default" className="gap-1.5">
                      📍 {location}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive-foreground"
                        onClick={() => removeFilter("locations", location)}
                      />
                    </Badge>
                  </motion.div>
                ))}

                {filters.technologies.map((tech) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="default" className="gap-1.5">
                      🔬 {tech}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive-foreground"
                        onClick={() => removeFilter("technologies", tech)}
                      />
                    </Badge>
                  </motion.div>
                ))}

                {filters.fundingStages.map((stage) => (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="default" className="gap-1.5">
                      💰 {stage}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive-foreground"
                        onClick={() => removeFilter("fundingStages", stage)}
                      />
                    </Badge>
                  </motion.div>
                ))}

                {(filters.fundingRange[0] > 0 || filters.fundingRange[1] < 50000000) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="outline" className="gap-1.5">
                      💵 €{(filters.fundingRange[0] / 1000000).toFixed(1)}M - €
                      {(filters.fundingRange[1] / 1000000).toFixed(1)}M
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeFilter("fundingRange")}
                      />
                    </Badge>
                  </motion.div>
                )}

                {(filters.yearRange[0] > 2008 || filters.yearRange[1] < 2024) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="outline" className="gap-1.5">
                      📅 {filters.yearRange[0]} - {filters.yearRange[1]}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeFilter("yearRange")}
                      />
                    </Badge>
                  </motion.div>
                )}

                {filters.impacts?.map((impact) => (
                  <motion.div
                    key={impact}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="default" className="gap-1.5">
                      🎯 {impact}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive-foreground"
                        onClick={() => removeFilter("impacts", impact)}
                      />
                    </Badge>
                  </motion.div>
                ))}

                {filters.founderGenders?.map((gender) => (
                  <motion.div
                    key={gender}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="default" className="gap-1.5">
                      👥 {gender}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive-foreground"
                        onClick={() => removeFilter("founderGenders", gender)}
                      />
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
