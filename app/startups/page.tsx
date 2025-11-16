"use client"

import { useState, useMemo, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StartupCard } from "@/components/startup-card"
import AdvancedFilterOverlay from "@/components/advanced-filter-overlay"
import FilterSummaryBar from "@/components/filter-summary-bar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Startup } from "@/lib/startups-data"
import { type FilterState, calculateCompatibility, performSemanticSearch } from "@/lib/advanced-filters"
import { addStartupToProject } from "@/lib/projects-data"
import { ArrowUpDown, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { ChatBubble } from "@/components/chat-bubble"
import { SelectProjectDialog } from "@/components/select-project-dialog"
import { useToast } from "@/hooks/use-toast"

type SortOption = "name" | "funding" | "year" | "location" | "compatibility"

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [filters, setFilters] = useState<FilterState>({
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

  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false)
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchStartups() {
      try {
        setIsLoading(true)
        const { cargarStartups } = await import("@/app/actions/load-startups")
        const result = await cargarStartups()
        
        if (result.success && result.data) {
          setStartups(result.data)
          setLoadError(null)
        } else {
          setLoadError(result.error || "Failed to load startups")
          toast({
            title: "Error cargando datos",
            description: result.error || "No se pudieron cargar las startups",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching startups:", error)
        setLoadError(error instanceof Error ? error.message : "Unknown error")
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar las startups",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStartups()
  }, [toast])

  const filteredAndSortedStartups = useMemo(() => {
    let filtered = [...startups]

    if (filters.semanticQuery) {
      filtered = performSemanticSearch(filters.semanticQuery, filtered)
    }

    filtered = filtered.filter((startup) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (
          !startup.Nombre.toLowerCase().includes(searchLower) &&
          !startup.Descripción.toLowerCase().includes(searchLower) &&
          !(startup.Tecnología && startup.Tecnología.toLowerCase().includes(searchLower))
        ) {
          return false
        }
      }

      if (filters.locations.length > 0) {
        if (!filters.locations.includes(startup["Región (CCAA)"])) {
          return false
        }
      }

      if (filters.fundingStages.length > 0) {
        if (!filters.fundingStages.includes(startup["Nivel de madurez"])) {
          return false
        }
      }

      if (filters.technologies.length > 0) {
        const hasMatchingTech = filters.technologies.some((tech) => 
          startup.Tecnología && startup.Tecnología.includes(tech)
        )
        if (!hasMatchingTech) return false
      }

      if (filters.impacts.length > 0) {
        if (!startup["Tipo de impacto"] || !filters.impacts.some((impact) => 
          startup["Tipo de impacto"]?.includes(impact)
        )) {
          return false
        }
      }

      if (filters.founderGenders.length > 0) {
        if (!startup["Diversidad del equipo"] || !filters.founderGenders.includes(startup["Diversidad del equipo"])) {
          return false
        }
      }

      const fundingAmount = getFundingAmount(startup["Inversión total (€)"] || "")
      if (fundingAmount < filters.fundingRange[0] || fundingAmount > filters.fundingRange[1]) {
        return false
      }

      const year = parseInt(startup.Año) || 0
      if (year < filters.yearRange[0] || year > filters.yearRange[1]) {
        return false
      }

      if (filters.compatibility > 0) {
        const compatibility = calculateCompatibility(startup, filters)
        if (compatibility < filters.compatibility) {
          return false
        }
      }

      return true
    })

    const startupsWithCompatibility = filtered.map((startup) => ({
      ...startup,
      compatibilityScore: calculateCompatibility(startup, filters),
    }))

    startupsWithCompatibility.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.Nombre.localeCompare(b.Nombre)
          break
        case "funding":
          comparison = getFundingAmount(a["Inversión total (€)"] || "") - getFundingAmount(b["Inversión total (€)"] || "")
          break
        case "year":
          comparison = (parseInt(a.Año) || 0) - (parseInt(b.Año) || 0)
          break
        case "location":
          comparison = (a["Región (CCAA)"] || "").localeCompare(b["Región (CCAA)"] || "")
          break
        case "compatibility":
          comparison = a.compatibilityScore - b.compatibilityScore
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return startupsWithCompatibility
  }, [startups, filters, sortBy, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handleAddToProject = (startup: Startup) => {
    setSelectedStartup(startup)
    setIsProjectDialogOpen(true)
  }

  const handleSelectProject = (projectId: string, startupName: string) => {
    const success = addStartupToProject(projectId, startupName)
    if (success) {
      toast({
        title: "Startup añadida",
        description: `${startupName} ha sido añadida al proyecto correctamente.`,
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudo añadir la startup al proyecto.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-muted-foreground">Cargando startups de las diferentes bases de datos...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="text-6xl">⚠️</div>
              <h3 className="text-lg font-medium">Error al cargar los datos</h3>
              <p className="text-muted-foreground">{loadError}</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Directorio de Startups
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground md:text-lg max-w-3xl mx-auto"
            >
              Explora el ecosistema de startups agroalimentarias españolas con filtros inteligentes, búsqueda semántica
              y análisis de compatibilidad.
            </motion.p>
          </div>

          <FilterSummaryBar
            filters={filters}
            onFiltersChange={setFilters}
            onOpenOverlay={() => setIsFilterOverlayOpen(true)}
            resultCount={filteredAndSortedStartups.length}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedStartups.length} startup{filteredAndSortedStartups.length !== 1 ? "s" : ""} encontrada
                {filteredAndSortedStartups.length !== 1 ? "s" : ""}
              </p>
              {filters.semanticQuery && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Sparkles className="h-3 w-3" />
                  Búsqueda semántica activa
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="funding">Financiación</SelectItem>
                  <SelectItem value="year">Año de fundación</SelectItem>
                  <SelectItem value="location">Ubicación</SelectItem>
                  <SelectItem value="compatibility">Compatibilidad</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={toggleSortOrder}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {filteredAndSortedStartups.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredAndSortedStartups.map((startup, index) => (
                  <motion.div
                    key={startup.Nombre}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <StartupCard
                      startup={startup}
                      compatibilityScore={sortBy === "compatibility" ? startup.compatibilityScore : undefined}
                      onAddToProject={handleAddToProject}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-lg font-medium">No se encontraron startups</h3>
                <p className="text-muted-foreground mb-4">
                  No hay startups que coincidan con los filtros seleccionados. Prueba ajustando los criterios de
                  búsqueda.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
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
                >
                  Limpiar todos los filtros
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      <AdvancedFilterOverlay
        isOpen={isFilterOverlayOpen}
        onClose={() => setIsFilterOverlayOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        filteredStartups={filteredAndSortedStartups}
      />

      <SelectProjectDialog
        isOpen={isProjectDialogOpen}
        onClose={() => setIsProjectDialogOpen(false)}
        startup={selectedStartup}
        onSelectProject={handleSelectProject}
      />

      <ChatBubble />
    </div>
  )
}

function getFundingAmount(fundingString: string): number {
  const fundingAmount = parseFloat(fundingString.replace(/\D/g, ''))
  return isNaN(fundingAmount) ? 0 : fundingAmount
}
