"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Filter, MapPin, BarChart3, Lightbulb, Zap, ChevronDown, Info, Target, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts"
import {
  type FilterState,
  type FilterSuggestion,
  generateFilterSuggestions,
  generateFilterVisualizations,
} from "@/lib/advanced-filters"
import {
  getAllTechnologies,
  getAllLocations,
  getAllFundingStages,
  getAllImpacts,
  getAllGenders,
  startupsData,
} from "@/lib/startups-data"

interface AdvancedFilterOverlayProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  filteredStartups: any[]
}

const TECHNOLOGY_CATEGORIES = {
  "Agricultura Inteligente": [
    "Agtech",
    "Precision Ag",
    "Farm Management",
    "Smart Irrigation",
    "Geospatial",
    "Remote Sensing",
    "Drone Imaging",
    "Satellite Data",
  ],
  Biotecnología: ["Biotech", "Cultured Meat", "Cellular Agriculture", "Plant Health", "Encapsulation"],
  "Tecnología Alimentaria": [
    "Foodtech",
    "Plant-based",
    "Food Safety",
    "Nutrition",
    "Fat Substitutes",
    "Protein Alternatives",
    "Mycelium",
    "Smart Labels",
  ],
  Sostenibilidad: [
    "Sustainability",
    "Circular Economy",
    "Food Upcycling",
    "Vertical Farming",
    "Hydroponics",
    "Indoor Farming",
    "Urban Agtech",
  ],
  "Tecnología Digital": [
    "AI",
    "Data Analytics",
    "IoT",
    "SaaS",
    "Blockchain",
    "Traceability",
    "Hyperspectral Imaging",
    "Digitization",
    "Smart Villages",
  ],
}

// Regiones prioritarias de España
const PRIORITY_REGIONS = ["Comunidad Valenciana", "Andalucía", "Cataluña"]

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const TECH_COLORS = [
  "#FF6B35", // Bright Orange
  "#FFB84D", // Gold
  "#FF8C42", // Light Orange
  "#E85D04", // Dark Orange
  "#FFA07A", // Coral
]

const FUNDING_COLORS = [
  "#4A90E2", // Sky Blue
  "#5B9BD5", // Light Blue
  "#2E5C8A", // Navy Blue
  "#7BAFD4", // Powder Blue
  "#1E4D7B", // Deep Blue
]

const STAGE_COLORS = [
  "#52B788", // Green
  "#40916C", // Forest Green
  "#74C69D", // Mint Green
  "#2D6A4F", // Dark Green
  "#95D5B2", // Light Green
]

const LOCATION_COLORS = [
  "#9B59B6", // Purple
  "#8E44AD", // Deep Purple
  "#BB8FCE", // Light Purple
  "#6C3483", // Dark Purple
  "#D2B4DE", // Lavender
]

export default function AdvancedFilterOverlay({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  filteredStartups,
}: AdvancedFilterOverlayProps) {
  const [suggestions, setSuggestions] = useState<FilterSuggestion[]>([])
  const [visualizations, setVisualizations] = useState<any[]>([])

  const [localFundingRange, setLocalFundingRange] = useState(filters.fundingRange)
  const [localYearRange, setLocalYearRange] = useState(filters.yearRange)

  const debouncedFundingRange = useDebounce(localFundingRange, 300)
  const debouncedYearRange = useDebounce(localYearRange, 300)

  const technologies = getAllTechnologies()
  const locations = getAllLocations()
  const fundingStages = getAllFundingStages()
  const impacts = getAllImpacts()
  const genders = getAllGenders()

  useEffect(() => {
    if (JSON.stringify(debouncedFundingRange) !== JSON.stringify(filters.fundingRange)) {
      onFiltersChange({ ...filters, fundingRange: debouncedFundingRange })
    }
  }, [debouncedFundingRange])

  useEffect(() => {
    if (JSON.stringify(debouncedYearRange) !== JSON.stringify(filters.yearRange)) {
      onFiltersChange({ ...filters, yearRange: debouncedYearRange })
    }
  }, [debouncedYearRange])

  useEffect(() => {
    const newSuggestions = generateFilterSuggestions(filters, startupsData)
    setSuggestions(newSuggestions)

    const newVisualizations = generateFilterVisualizations(filteredStartups, startupsData)
    setVisualizations(newVisualizations)
  }, [filters, filteredStartups])

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => {
      onFiltersChange({ ...filters, [key]: value })
    },
    [filters, onFiltersChange],
  )

  const applySuggestion = useCallback(
    (suggestion: FilterSuggestion) => {
      onFiltersChange({ ...filters, ...suggestion.filters })
    },
    [filters, onFiltersChange],
  )

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      locations: [],
      technologies: [],
      fundingStages: [],
      fundingRange: [0, 50000000] as [number, number],
      yearRange: [2008, 2024] as [number, number],
      compatibility: 0,
      proximity: null,
      semanticQuery: "",
      impacts: [],
      founderGenders: [],
    }
    setLocalFundingRange(clearedFilters.fundingRange)
    setLocalYearRange(clearedFilters.yearRange)
    onFiltersChange(clearedFilters)
  }, [onFiltersChange])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-8 bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden max-w-7xl mx-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Filter className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Filtros Inteligentes</h2>
                    <p className="text-sm text-muted-foreground">{filteredStartups.length} startups encontradas</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto px-8 py-6">
                <div className="grid grid-cols-3 gap-8 h-full">
                  {/* Column 1 - Tecnología */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Tecnología
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Search */}
                        <div className="space-y-3">
                          <Input
                            placeholder="Buscar startups..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            className="h-10"
                          />
                          <div className="relative">
                            <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Búsqueda semántica..."
                              value={filters.semanticQuery}
                              onChange={(e) => handleFilterChange("semanticQuery", e.target.value)}
                              className="pl-10 h-10"
                            />
                          </div>
                        </div>

                        {/* Technology Categories */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Categorías Tecnológicas</label>
                          {Object.entries(TECHNOLOGY_CATEGORIES).map(([category, techs]) => (
                            <Popover key={category}>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between h-10 bg-transparent">
                                  <span className="truncate">{category}</span>
                                  <div className="flex items-center gap-2">
                                    {filters.technologies.filter((t) => techs.includes(t)).length > 0 && (
                                      <Badge variant="secondary" className="text-xs h-5 px-2">
                                        {filters.technologies.filter((t) => techs.includes(t)).length}
                                      </Badge>
                                    )}
                                    <ChevronDown className="h-4 w-4" />
                                  </div>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-0">
                                <div className="max-h-60 overflow-auto p-4">
                                  <div className="grid grid-cols-2 gap-3">
                                    {techs
                                      .filter((tech) => technologies.includes(tech))
                                      .map((tech) => (
                                        <div key={tech} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={tech}
                                            checked={filters.technologies.includes(tech)}
                                            onCheckedChange={(checked) => {
                                              if (checked) {
                                                handleFilterChange("technologies", [...filters.technologies, tech])
                                              } else {
                                                handleFilterChange(
                                                  "technologies",
                                                  filters.technologies.filter((t) => t !== tech),
                                                )
                                              }
                                            }}
                                          />
                                          <label htmlFor={tech} className="text-sm cursor-pointer">
                                            {tech}
                                          </label>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ))}
                        </div>

                        {/* Selected Technologies */}
                        {filters.technologies.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Tecnologías Seleccionadas</label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-auto">
                              {filters.technologies.map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-sm">
                                  {tech}
                                  <button
                                    onClick={() =>
                                      handleFilterChange(
                                        "technologies",
                                        filters.technologies.filter((t) => t !== tech),
                                      )
                                    }
                                    className="ml-2 hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Impact and Gender Filters */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Impacto y Diversidad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Impact Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Área de Impacto
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-between h-10 bg-transparent">
                                <span className="truncate">
                                  {filters.impacts.length > 0
                                    ? `${filters.impacts.length} seleccionado${filters.impacts.length > 1 ? "s" : ""}`
                                    : "Seleccionar impacto"}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0">
                              <div className="max-h-60 overflow-auto p-4">
                                <div className="space-y-3">
                                  {impacts.map((impact) => (
                                    <div key={impact} className="flex items-start space-x-2">
                                      <Checkbox
                                        id={`impact-${impact}`}
                                        checked={filters.impacts.includes(impact)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            handleFilterChange("impacts", [...filters.impacts, impact])
                                          } else {
                                            handleFilterChange(
                                              "impacts",
                                              filters.impacts.filter((i) => i !== impact),
                                            )
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`impact-${impact}`}
                                        className="text-sm cursor-pointer leading-tight"
                                      >
                                        {impact}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Selected Impacts */}
                        {filters.impacts.length > 0 && (
                          <div className="flex flex-wrap gap-2 max-h-24 overflow-auto">
                            {filters.impacts.map((impact) => (
                              <Badge key={impact} variant="secondary" className="text-xs">
                                {impact}
                                <button
                                  onClick={() =>
                                    handleFilterChange(
                                      "impacts",
                                      filters.impacts.filter((i) => i !== impact),
                                    )
                                  }
                                  className="ml-2 hover:text-destructive"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Gender Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Género del Fundador
                          </label>
                          <div className="space-y-2">
                            {genders.map((gender) => (
                              <div key={gender} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`gender-${gender}`}
                                  checked={filters.founderGenders.includes(gender)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleFilterChange("founderGenders", [...filters.founderGenders, gender])
                                    } else {
                                      handleFilterChange(
                                        "founderGenders",
                                        filters.founderGenders.filter((g) => g !== gender),
                                      )
                                    }
                                  }}
                                />
                                <label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer">
                                  {gender}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Selected Genders */}
                        {filters.founderGenders.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {filters.founderGenders.map((gender) => (
                              <Badge key={gender} variant="secondary" className="text-xs">
                                {gender}
                                <button
                                  onClick={() =>
                                    handleFilterChange(
                                      "founderGenders",
                                      filters.founderGenders.filter((g) => g !== gender),
                                    )
                                  }
                                  className="ml-2 hover:text-destructive"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Column 2 - Financiación y Ubicación */}
                  <div className="space-y-6">
                    {/* Financing Section */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Financiación
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-sm space-y-1">
                                  <p>
                                    <strong>Etapa:</strong> Nivel de madurez de la startup
                                  </p>
                                  <p>
                                    <strong>Monto:</strong> Financiación total recaudada
                                  </p>
                                  <p>
                                    <strong>Año:</strong> Año de fundación
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Etapa de Financiación</label>
                          <Select
                            value={filters.fundingStages[0] || ""}
                            onValueChange={(value) => handleFilterChange("fundingStages", value ? [value] : [])}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Seleccionar etapa" />
                            </SelectTrigger>
                            <SelectContent>
                              {fundingStages.map((stage) => (
                                <SelectItem key={stage} value={stage}>
                                  {stage}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium">
                            Monto de Financiación: €{(localFundingRange[0] / 1000000).toFixed(1)}M - €
                            {(localFundingRange[1] / 1000000).toFixed(1)}M
                          </label>
                          <Slider
                            value={localFundingRange}
                            onValueChange={setLocalFundingRange}
                            max={50000000}
                            min={0}
                            step={100000}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium">
                            Año de Constitución: {localYearRange[0]} - {localYearRange[1]}
                          </label>
                          <Slider
                            value={localYearRange}
                            onValueChange={setLocalYearRange}
                            max={2024}
                            min={2008}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Geographic Section */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Ubicación Geográfica
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">Haz clic en las regiones para filtrar startups</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Regiones Prioritarias</label>
                          {PRIORITY_REGIONS.map((region) => {
                            const regionData = visualizations
                              .find((v) => v.type === "map")
                              ?.data?.find((l: any) => l.name === region)
                            const count = regionData?.value || 0
                            return (
                              <motion.div
                                key={region}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                  filters.locations.includes(region)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/30 hover:border-primary/60"
                                }`}
                                onClick={() => {
                                  const newLocations = filters.locations.includes(region)
                                    ? filters.locations.filter((l) => l !== region)
                                    : [...filters.locations, region]
                                  handleFilterChange("locations", newLocations)
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="font-medium">{region}</div>
                                  <div className="font-bold">{count}</div>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-medium">Otras Ubicaciones</label>
                          <div className="flex flex-wrap gap-2 max-h-32 overflow-auto">
                            {visualizations
                              .find((v) => v.type === "map")
                              ?.data?.filter((l: any) => !PRIORITY_REGIONS.includes(l.name))
                              ?.map((location: any, index: number) => (
                                <Badge
                                  key={index}
                                  variant={filters.locations.includes(location.name) ? "default" : "secondary"}
                                  className="cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => {
                                    const newLocations = filters.locations.includes(location.name)
                                      ? filters.locations.filter((l) => l !== location.name)
                                      : [...filters.locations, location.name]
                                    handleFilterChange("locations", newLocations)
                                  }}
                                >
                                  {location.name} ({location.value})
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Column 3 - Análisis y Sugerencias */}
                  <div className="space-y-6">
                    {/* Analytics */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Análisis
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-sm space-y-1">
                                  <p>
                                    <strong>Gráfico de barras:</strong> Top tecnologías más utilizadas
                                  </p>
                                  <p>
                                    <strong>Gráfico circular:</strong> Distribución por etapas de financiación
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {visualizations.slice(0, 2).map((viz, index) => {
                            // Determine color palette based on visualization content
                            let colorPalette = TECH_COLORS
                            const titleLower = viz.title.toLowerCase()

                            if (
                              titleLower.includes("financ") ||
                              titleLower.includes("stage") ||
                              titleLower.includes("etapa")
                            ) {
                              colorPalette = FUNDING_COLORS
                            } else if (
                              titleLower.includes("location") ||
                              titleLower.includes("ubicación") ||
                              titleLower.includes("geográf")
                            ) {
                              colorPalette = LOCATION_COLORS
                            } else if (titleLower.includes("crecimiento") || titleLower.includes("growth")) {
                              colorPalette = STAGE_COLORS
                            }

                            return (
                              <div key={index} className="space-y-3">
                                <h4 className="text-sm font-medium">{viz.title}</h4>
                                <div className="h-40">
                                  {viz.type === "bar" && (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={viz.data.slice(0, 5)}>
                                        <XAxis
                                          dataKey="name"
                                          fontSize={10}
                                          stroke="hsl(var(--muted-foreground))"
                                          tickLine={false}
                                          angle={-45}
                                          textAnchor="end"
                                          height={60}
                                        />
                                        <RechartsTooltip
                                          contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                          }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                          {viz.data.slice(0, 5).map((entry: any, barIndex: number) => (
                                            <Cell
                                              key={`cell-${barIndex}`}
                                              fill={colorPalette[barIndex % colorPalette.length]}
                                            />
                                          ))}
                                        </Bar>
                                      </BarChart>
                                    </ResponsiveContainer>
                                  )}
                                  {viz.type === "pie" && (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <RechartsTooltip
                                          contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                          }}
                                        />
                                        <Pie
                                          data={viz.data.slice(0, 5)}
                                          cx="50%"
                                          cy="50%"
                                          outerRadius={60}
                                          dataKey="value"
                                          strokeWidth={2}
                                          stroke="hsl(var(--background))"
                                          label={({ name, percent }) =>
                                            `${name.substring(0, 8)} ${(percent * 100).toFixed(0)}%`
                                          }
                                          labelLine={false}
                                        >
                                          {viz.data.slice(0, 5).map((entry: any, pieIndex: number) => (
                                            <Cell
                                              key={`cell-${pieIndex}`}
                                              fill={colorPalette[pieIndex % colorPalette.length]}
                                            />
                                          ))}
                                        </Pie>
                                      </PieChart>
                                    </ResponsiveContainer>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Suggestions and Preview */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Sugerencias IA & Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Preview */}
                        <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                          <div className="text-3xl font-bold text-primary">{filteredStartups.length}</div>
                          <div className="text-sm text-muted-foreground">startups encontradas</div>
                        </div>

                        {/* Suggestions */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Sugerencias Inteligentes</label>
                          {suggestions.slice(0, 3).map((suggestion, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => applySuggestion(suggestion)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.type === "combination"
                                      ? "Combo"
                                      : suggestion.type === "semantic"
                                        ? "Semántico"
                                        : "Proximidad"}
                                  </Badge>
                                  <h4 className="text-sm font-medium">{suggestion.title}</h4>
                                </div>
                                <div className="text-sm font-medium text-primary">
                                  {Math.round(suggestion.confidence * 100)}%
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Active Filters Summary */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Filtros Activos</label>
                          <div className="flex flex-wrap gap-2 max-h-24 overflow-auto">
                            {filters.locations.map((loc) => (
                              <Badge key={loc} variant="secondary" className="text-xs">
                                📍 {loc}
                              </Badge>
                            ))}
                            {filters.technologies.slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                🔧 {tech}
                              </Badge>
                            ))}
                            {filters.technologies.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{filters.technologies.length - 3} más
                              </Badge>
                            )}
                            {filters.fundingStages.map((stage) => (
                              <Badge key={stage} variant="secondary" className="text-xs">
                                💰 {stage}
                              </Badge>
                            ))}
                            {filters.impacts.slice(0, 2).map((impact) => (
                              <Badge key={impact} variant="secondary" className="text-xs">
                                🎯 {impact.substring(0, 20)}...
                              </Badge>
                            ))}
                            {filters.impacts.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{filters.impacts.length - 2} impactos
                              </Badge>
                            )}
                            {filters.founderGenders.map((gender) => (
                              <Badge key={gender} variant="secondary" className="text-xs">
                                👥 {gender}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-8 py-6 border-t border-border bg-muted/30">
                <Button variant="outline" onClick={clearAllFilters}>
                  Limpiar Filtros
                </Button>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">{filteredStartups.length} resultados</div>
                  <Button onClick={onClose}>Aplicar Filtros</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
