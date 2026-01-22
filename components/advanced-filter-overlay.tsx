"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Filter, MapPin, BarChart3, Lightbulb, Zap, ChevronDown, Target, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts"
import {
  type FilterState,
  type FilterSuggestion,
  generateFilterSuggestions,
  generateFilterVisualizations,
  getAllTechnologies,
  getAllLocations,
  getAllFundingStages,
  getAllImpacts,
  getAllGenders,
} from "@/lib/advanced-filters"

interface AdvancedFilterOverlayProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  filteredStartups: any[]
  startupsData: any[]
}

const TECHNOLOGY_CATEGORIES = {
  "Agricultura Inteligente": ["Agtech", "Precision Ag", "Farm Management", "Smart Irrigation", "Geospatial", "Remote Sensing", "Drone Imaging", "Satellite Data"],
  "Biotecnología": ["Biotech", "Cultured Meat", "Cellular Agriculture", "Plant Health", "Encapsulation"],
  "Tecnología Alimentaria": ["Foodtech", "Plant-based", "Food Safety", "Nutrition", "Fat Substitutes", "Protein Alternatives", "Mycelium", "Smart Labels"],
  "Sostenibilidad": ["Sustainability", "Circular Economy", "Food Upcycling", "Vertical Farming", "Hydroponics", "Indoor Farming", "Urban Agtech"],
  "Tecnología Digital": ["AI", "Data Analytics", "IoT", "SaaS", "Blockchain", "Traceability", "Hyperspectral Imaging", "Digitization", "Smart Villages"],
}

const PRIORITY_REGIONS = ["Comunidad Valenciana", "Andalucía", "Cataluña"]

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"]

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function AdvancedFilterOverlay({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  filteredStartups,
  startupsData,
}: AdvancedFilterOverlayProps) {
  const [suggestions, setSuggestions] = useState<FilterSuggestion[]>([])
  const [visualizations, setVisualizations] = useState<any[]>([])
  const [localFundingRange, setLocalFundingRange] = useState(filters.fundingRange)
  const [localYearRange, setLocalYearRange] = useState(filters.yearRange)

  const debouncedFundingRange = useDebounce(localFundingRange, 300)
  const debouncedYearRange = useDebounce(localYearRange, 300)

  const technologies = getAllTechnologies(startupsData)
  const fundingStages = getAllFundingStages(startupsData)
  const impacts = getAllImpacts(startupsData)
  const genders = getAllGenders(startupsData)

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
    setSuggestions(generateFilterSuggestions(filters, startupsData))
    setVisualizations(generateFilterVisualizations(filteredStartups, startupsData))
  }, [filters, filteredStartups])

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => onFiltersChange({ ...filters, [key]: value }),
    [filters, onFiltersChange],
  )

  const applySuggestion = useCallback(
    (suggestion: FilterSuggestion) => onFiltersChange({ ...filters, ...suggestion.filters }),
    [filters, onFiltersChange],
  )

  const clearAllFilters = useCallback(() => {
    const cleared = {
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
    setLocalFundingRange(cleared.fundingRange)
    setLocalYearRange(cleared.yearRange)
    onFiltersChange(cleared)
  }, [onFiltersChange])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-6 lg:inset-8 bg-background border rounded-xl shadow-2xl z-50 overflow-hidden max-w-7xl mx-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-lg">Filtros Avanzados</span>
                  <Badge variant="secondary" className="ml-2">{filteredStartups.length} startups</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  
                  {/* Column 1 */}
                  <div className="space-y-5">
                    {/* Busqueda Card */}
                    <Card>
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          Búsqueda
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 space-y-3">
                        <Input
                          placeholder="Buscar por nombre..."
                          value={filters.search}
                          onChange={(e) => handleFilterChange("search", e.target.value)}
                        />
                        <Input
                          placeholder="Búsqueda semántica (ej: startups de proteínas)"
                          value={filters.semanticQuery}
                          onChange={(e) => handleFilterChange("semanticQuery", e.target.value)}
                        />
                      </CardContent>
                    </Card>

                    {/* Tecnologia Card */}
                    <Card>
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          Tecnología
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 space-y-2">
                        {Object.entries(TECHNOLOGY_CATEGORIES).map(([category, techs]) => (
                          <Popover key={category}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                                <span className="text-xs">{category}</span>
                                <div className="flex items-center gap-2">
                                  {filters.technologies.filter((t) => techs.includes(t)).length > 0 && (
                                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                      {filters.technologies.filter((t) => techs.includes(t)).length}
                                    </Badge>
                                  )}
                                  <ChevronDown className="h-3 w-3" />
                                </div>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-3" align="start">
                              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
                                {techs.filter((tech) => technologies.includes(tech)).map((tech) => (
                                  <label key={tech} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted p-1 rounded">
                                    <Checkbox
                                      checked={filters.technologies.includes(tech)}
                                      onCheckedChange={(checked) => {
                                        if (checked) handleFilterChange("technologies", [...filters.technologies, tech])
                                        else handleFilterChange("technologies", filters.technologies.filter((t) => t !== tech))
                                      }}
                                      className="h-3.5 w-3.5"
                                    />
                                    {tech}
                                  </label>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        ))}
                        {filters.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2 border-t">
                            {filters.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-[10px] gap-1">
                                {tech}
                                <button onClick={() => handleFilterChange("technologies", filters.technologies.filter((t) => t !== tech))} className="hover:text-destructive ml-0.5">x</button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Impacto y Diversidad Card */}
                    <Card>
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          Impacto y Diversidad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 space-y-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Área de Impacto</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                                <span className="text-xs">{filters.impacts.length > 0 ? `${filters.impacts.length} seleccionados` : "Seleccionar"}</span>
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-3" align="start">
                              <div className="space-y-2 max-h-48 overflow-auto">
                                {impacts.map((impact) => (
                                  <label key={impact} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted p-1 rounded">
                                    <Checkbox
                                      checked={filters.impacts.includes(impact)}
                                      onCheckedChange={(checked) => {
                                        if (checked) handleFilterChange("impacts", [...filters.impacts, impact])
                                        else handleFilterChange("impacts", filters.impacts.filter((i) => i !== impact))
                                      }}
                                      className="h-3.5 w-3.5"
                                    />
                                    {impact}
                                  </label>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Diversidad del Equipo</label>
                          <div className="space-y-1">
                            {genders.map((gender) => (
                              <label key={gender} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted p-1.5 rounded">
                                <Checkbox
                                  checked={filters.founderGenders.includes(gender)}
                                  onCheckedChange={(checked) => {
                                    if (checked) handleFilterChange("founderGenders", [...filters.founderGenders, gender])
                                    else handleFilterChange("founderGenders", filters.founderGenders.filter((g) => g !== gender))
                                  }}
                                  className="h-3.5 w-3.5"
                                />
                                {gender}
                              </label>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-5">
                    {/* Financiacion Card */}
                    <Card>
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          Financiación
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 space-y-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Etapa de Madurez</label>
                          <Select
                            value={filters.fundingStages[0] || ""}
                            onValueChange={(value) => handleFilterChange("fundingStages", value ? [value] : [])}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Todas las etapas" />
                            </SelectTrigger>
                            <SelectContent>
                              {fundingStages.map((stage) => (
                                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-2 block">
                            Inversión Total: {(localFundingRange[0] / 1000000).toFixed(1)}M - {(localFundingRange[1] / 1000000).toFixed(1)}M
                          </label>
                          <Slider
                            value={localFundingRange}
                            onValueChange={setLocalFundingRange}
                            max={50000000}
                            min={0}
                            step={100000}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-2 block">
                            Año de Fundación: {localYearRange[0]} - {localYearRange[1]}
                          </label>
                          <Slider
                            value={localYearRange}
                            onValueChange={setLocalYearRange}
                            max={2024}
                            min={2008}
                            step={1}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Ubicacion Card */}
                    <Card>
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Ubicación
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 space-y-3">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Regiones Principales</label>
                        <div className="space-y-1">
                          {PRIORITY_REGIONS.map((region) => {
                            const regionData = visualizations.find((v) => v.type === "map")?.data?.find((l: any) => l.name === region)
                            return (
                              <button
                                key={region}
                                onClick={() => {
                                  const newLocations = filters.locations.includes(region)
                                    ? filters.locations.filter((l) => l !== region)
                                    : [...filters.locations, region]
                                  handleFilterChange("locations", newLocations)
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md border transition-all ${
                                  filters.locations.includes(region)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "hover:bg-muted border-border"
                                }`}
                              >
                                <span>{region}</span>
                                <span className="text-xs opacity-70">{regionData?.value || 0} startups</span>
                              </button>
                            )
                          })}
                        </div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block pt-1">Otras Regiones</label>
                        <div className="flex flex-wrap gap-1.5">
                          {visualizations
                            .find((v) => v.type === "map")
                            ?.data?.filter((l: any) => !PRIORITY_REGIONS.includes(l.name))
                            ?.slice(0, 10)
                            ?.map((loc: any) => (
                              <button
                                key={loc.name}
                                onClick={() => {
                                  const newLocations = filters.locations.includes(loc.name)
                                    ? filters.locations.filter((l) => l !== loc.name)
                                    : [...filters.locations, loc.name]
                                  handleFilterChange("locations", newLocations)
                                }}
                                className={`text-xs px-2 py-1 rounded-full border transition-all ${
                                  filters.locations.includes(loc.name)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "hover:bg-muted border-border"
                                }`}
                              >
                                {loc.name} ({loc.value})
                              </button>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-5">
                    {/* Analisis Card */}
                    <Card>
                      <CardHeader className="py-2 px-4">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          Análisis de Resultados
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 space-y-4">
                        {visualizations.slice(0, 2).map((viz, index) => {
                          const chartData = viz.data.slice(0, 5)
                          return (
                            <div key={index}>
                              <label className="text-xs font-medium text-muted-foreground mb-2 block">{viz.title}</label>
                              <div className="h-40">
                                {viz.type === "bar" && (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
                                      <RechartsTooltip 
                                        contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                                        formatter={(value: number) => [`${value} startups`, '']}
                                      />
                                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {chartData.map((_: any, i: number) => (
                                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                )}
                                {viz.type === "pie" && (
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <RechartsTooltip 
                                        contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                                        formatter={(value: number, name: string) => [`${value} startups`, name]}
                                      />
                                      <Pie 
                                        data={chartData} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={25}
                                        outerRadius={50} 
                                        dataKey="value"
                                        paddingAngle={2}
                                      >
                                        {chartData.map((_: any, i: number) => (
                                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                      </Pie>
                                      <Legend 
                                        layout="horizontal" 
                                        verticalAlign="bottom" 
                                        align="center"
                                        iconSize={10}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-[11px] text-muted-foreground">{value}</span>}
                                      />
                                    </PieChart>
                                  </ResponsiveContainer>
                                )}
                              </div>
                              {/* Legend for bar chart */}
                              {viz.type === "bar" && (
                                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 justify-center">
                                  {chartData.map((entry: any, i: number) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                      <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                      <span className="text-[11px] text-muted-foreground truncate max-w-[80px]">{entry.name}</span>
                                      <span className="text-[11px] font-medium">({entry.value})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </CardContent>
                    </Card>

                    {/* Sugerencias Card */}
                    {suggestions.length > 0 && (
                      <Card>
                        <CardHeader className="py-2 px-4">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            Sugerencias IA
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 space-y-2">
                          {suggestions.slice(0, 3).map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => applySuggestion(suggestion)}
                              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md border hover:bg-muted transition-all"
                            >
                              <span className="truncate text-left">{suggestion.title}</span>
                              <Badge variant="secondary" className="ml-2 shrink-0">
                                {Math.round(suggestion.confidence * 100)}%
                              </Badge>
                            </button>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Resumen Card */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary">{filteredStartups.length}</div>
                          <div className="text-sm text-muted-foreground mt-1">startups encontradas</div>
                        </div>
                        {(filters.locations.length > 0 || filters.technologies.length > 0 || filters.fundingStages.length > 0 || filters.impacts.length > 0) && (
                          <div className="flex flex-wrap gap-1 mt-4 justify-center">
                            {filters.locations.map((loc) => (
                              <Badge key={loc} variant="outline" className="text-[10px]">{loc}</Badge>
                            ))}
                            {filters.technologies.slice(0, 2).map((tech) => (
                              <Badge key={tech} variant="outline" className="text-[10px]">{tech}</Badge>
                            ))}
                            {filters.technologies.length > 2 && (
                              <Badge variant="outline" className="text-[10px]">+{filters.technologies.length - 2} techs</Badge>
                            )}
                            {filters.fundingStages.map((stage) => (
                              <Badge key={stage} variant="outline" className="text-[10px]">{stage}</Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/30">
                <Button variant="outline" onClick={clearAllFilters}>
                  Limpiar filtros
                </Button>
                <Button onClick={onClose}>
                  Ver {filteredStartups.length} resultados
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
