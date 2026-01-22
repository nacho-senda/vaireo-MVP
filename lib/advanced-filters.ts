// Advanced filtering system with AI-powered suggestions and semantic search

// Helper functions to extract unique values from startups data
export const getAllTechnologies = (startups: any[]): string[] => {
  const values = new Set<string>()
  startups.forEach((startup) => {
    const value = startup.Tecnología || startup.tecnologia
    if (value && typeof value === "string") {
      value.split(",").forEach((v: string) => {
        const trimmed = v.trim()
        if (trimmed) values.add(trimmed)
      })
    }
  })
  return Array.from(values).sort()
}

export const getAllLocations = (startups: any[]): string[] => {
  const values = new Set<string>()
  startups.forEach((startup) => {
    const value = startup["Región (CCAA)"] || startup.region
    if (value && typeof value === "string" && value.trim()) {
      values.add(value.trim())
    }
  })
  return Array.from(values).sort()
}

export const getAllFundingStages = (startups: any[]): string[] => {
  const values = new Set<string>()
  startups.forEach((startup) => {
    const value = startup["Nivel de madurez"] || startup.nivel_madurez
    if (value && typeof value === "string" && value.trim()) {
      values.add(value.trim())
    }
  })
  return Array.from(values).sort()
}

export const getAllImpacts = (startups: any[]): string[] => {
  const values = new Set<string>()
  startups.forEach((startup) => {
    const value = startup["Tipo de impacto"] || startup.tipo_impacto
    if (value && typeof value === "string") {
      value.split(",").forEach((v: string) => {
        const trimmed = v.trim()
        if (trimmed) values.add(trimmed)
      })
    }
  })
  return Array.from(values).sort()
}

export const getAllGenders = (startups: any[]): string[] => {
  const values = new Set<string>()
  startups.forEach((startup) => {
    const value = startup["Diversidad del equipo"] || startup.diversidad_equipo
    if (value && typeof value === "string" && value.trim()) {
      values.add(value.trim())
    }
  })
  return Array.from(values).sort()
}

export const getAllVerticals = (startups: any[]): string[] => {
  const values = new Set<string>()
  startups.forEach((startup) => {
    const value = startup.Vertical || startup.vertical
    if (value && typeof value === "string" && value.trim()) {
      values.add(value.trim())
    }
  })
  return Array.from(values).sort()
}

export interface FilterState {
  search: string
  locations: string[]
  technologies: string[]
  fundingStages: string[]
  fundingRange: [number, number]
  yearRange: [number, number]
  compatibility: number
  proximity: string | null
  semanticQuery: string
  impacts: string[]
  founderGenders: string[]
}

export interface FilterSuggestion {
  type: "combination" | "semantic" | "proximity"
  title: string
  description: string
  filters: Partial<FilterState>
  confidence: number
}

export interface FilterVisualization {
  type: "bar" | "pie" | "map" | "timeline"
  data: any[]
  title: string
}

// Semantic search mappings
const semanticMappings: Record<string, string[]> = {
  sostenibilidad: ["Plant-based", "Sustainability", "Circular Economy", "Food Upcycling"],
  "inteligencia artificial": ["AI", "Data Analytics", "Remote Sensing", "Hyperspectral Imaging"],
  biotecnología: ["Biotech", "Cultured Meat", "Cellular Agriculture", "Plant Health"],
  "agricultura inteligente": ["Agtech", "Precision Ag", "Smart Irrigation", "Farm Management"],
  "innovación alimentaria": ["Foodtech", "Food Safety", "Nutrition", "Encapsulation"],
  "tecnología verde": ["Sustainability", "Vertical Farming", "Hydroponics", "Smart Villages"],
}

// Location coordinates for map visualization
export const locationCoordinates: Record<string, [number, number]> = {
  Barcelona: [41.3851, 2.1734],
  Madrid: [40.4168, -3.7038],
  Valencia: [39.4699, -0.3763],
  Seville: [37.3886, -5.9823],
  "San Sebastián": [43.3183, -1.9812],
  Pamplona: [42.8169, -1.6432],
  Elche: [38.2622, -0.7011],
  Zaragoza: [41.6488, -0.8891],
  Galicia: [42.5751, -8.1339],
  Murcia: [37.9922, -1.1307],
  Almería: [36.8381, -2.4597],
}

// Priority regions for highlighting
export const priorityRegions = ["Valencia", "Barcelona", "Seville"]

// Generate intelligent filter suggestions
export const generateFilterSuggestions = (
  currentFilters: FilterState,
  allStartups: any[],
  userHistory: FilterState[] = [],
): FilterSuggestion[] => {
  const suggestions: FilterSuggestion[] = []

  // Combination suggestions based on popular patterns
  if (currentFilters.technologies.includes("AI")) {
    suggestions.push({
      type: "combination",
      title: "IA + Agricultura de Precisión",
      description: "Startups que combinan IA con tecnologías de agricultura inteligente",
      filters: {
        technologies: ["AI", "Precision Ag", "Data Analytics"],
        fundingStages: ["Series A", "Series B"],
      },
      confidence: 0.9,
    })
  }

  if (currentFilters.locations.includes("Barcelona")) {
    suggestions.push({
      type: "combination",
      title: "Ecosistema Barcelona Foodtech",
      description: "Cluster de innovación alimentaria en Barcelona",
      filters: {
        locations: ["Barcelona"],
        technologies: ["Foodtech", "Plant-based", "Biotech"],
      },
      confidence: 0.85,
    })
  }

  // Gender diversity suggestion
  if (currentFilters.founderGenders.includes("Female")) {
    suggestions.push({
      type: "combination",
      title: "Liderazgo Femenino en Agritech",
      description: "Startups fundadas por mujeres en el sector agroalimentario",
      filters: {
        founderGenders: ["Female"],
        fundingStages: ["Seed", "Series A"],
      },
      confidence: 0.88,
    })
  }

  // Semantic suggestions
  if (currentFilters.semanticQuery.includes("sostenible")) {
    suggestions.push({
      type: "semantic",
      title: "Innovación Sostenible Completa",
      description: "Todas las startups enfocadas en sostenibilidad y economía circular",
      filters: {
        semanticQuery: "sostenibilidad",
        fundingRange: [1000000, 50000000],
      },
      confidence: 0.8,
    })
  }

  // Proximity suggestions
  if (currentFilters.proximity) {
    const proximityStartup = allStartups.find((s) => s.name === currentFilters.proximity)
    if (proximityStartup) {
      suggestions.push({
        type: "proximity",
        title: `Similares a ${proximityStartup.name}`,
        description: "Startups con tecnologías y modelos de negocio similares",
        filters: {
          technologies: proximityStartup.technologyFocus,
          fundingStages: [proximityStartup.fundingStage],
        },
        confidence: 0.75,
      })
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
}

// Calculate compatibility score
export const calculateCompatibility = (startup: any, filters: FilterState): number => {
  let score = 0
  let maxScore = 0

  // Location match
  if (filters.locations.length > 0) {
    maxScore += 20
    const startupLocation = startup["Región (CCAA)"] || startup.location
    if (filters.locations.includes(startupLocation)) score += 20
  }

  // Technology match
  if (filters.technologies.length > 0) {
    maxScore += 30
    const techs = typeof startup.Tecnología === 'string' 
      ? startup.Tecnología.split(',').map((t: string) => t.trim())
      : (startup.technologyFocus || [])
    const matchingTechs = techs.filter((tech: string) => filters.technologies.includes(tech)).length
    score += (matchingTechs / filters.technologies.length) * 30
  }

  // Funding stage match
  if (filters.fundingStages.length > 0) {
    maxScore += 25
    const stage = startup["Nivel de madurez"] || startup.fundingStage
    if (filters.fundingStages.includes(stage)) score += 25
  }

  // Funding amount range
  maxScore += 25
  const fundingField = startup["Inversión total (€)"] || startup.totalFunding || ""
  const fundingAmount = getFundingAmount(fundingField)
  if (fundingAmount >= filters.fundingRange[0] && fundingAmount <= filters.fundingRange[1]) {
    score += 25
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
}

// Semantic search function
export const performSemanticSearch = (query: string, startups: any[]): any[] => {
  if (!query || !startups || startups.length === 0) return startups || []
  
  const lowerQuery = query.toLowerCase()
  const relevantTechs = new Set<string>()

  // Find matching semantic mappings
  Object.entries(semanticMappings).forEach(([concept, technologies]) => {
    if (lowerQuery.includes(concept)) {
      technologies.forEach((tech) => relevantTechs.add(tech))
    }
  })

  // If no semantic matches, use direct text search
  if (relevantTechs.size === 0) {
    return startups.filter((startup) => {
      const name = startup.Nombre || startup.name || ""
      const description = startup.Descripción || startup.descripcion || startup.description || ""
      const techs = typeof startup.Tecnología === 'string' 
        ? startup.Tecnología.split(',').map((t: string) => t.trim())
        : (startup.technologyFocus || [])
      
      return (
        name.toLowerCase().includes(lowerQuery) ||
        description.toLowerCase().includes(lowerQuery) ||
        techs.some((tech: string) => tech && tech.toLowerCase().includes(lowerQuery))
      )
    })
  }

  // Filter by semantic technologies
  return startups.filter((startup) => {
    const techs = typeof startup.Tecnología === 'string' 
      ? startup.Tecnología.split(',').map((t: string) => t.trim())
      : (startup.technologyFocus || [])
    return techs.some((tech: string) => tech && relevantTechs.has(tech))
  })
}

// Generate visualizations for filters
export const generateFilterVisualizations = (filteredStartups: any[], allStartups: any[]): FilterVisualization[] => {
  const visualizations: FilterVisualization[] = []

  // Technology distribution
  const techCounts: Record<string, number> = {}
  filteredStartups.forEach((startup) => {
    // Handle new Google Sheets format (Tecnología as string) and old format (technologyFocus as array)
    const techs = typeof startup.Tecnología === 'string' 
      ? startup.Tecnología.split(',').map((t: string) => t.trim())
      : (startup.technologyFocus || [])
    
    techs.forEach((tech: string) => {
      if (tech) {
        techCounts[tech] = (techCounts[tech] || 0) + 1
      }
    })
  })

  visualizations.push({
    type: "bar",
    title: "Distribución por Tecnología",
    data: Object.entries(techCounts)
      .map(([tech, count]) => ({ name: tech, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),
  })

  // Funding stage distribution
  const stageCounts: Record<string, number> = {}
  filteredStartups.forEach((startup) => {
    const stage = startup["Nivel de madurez"] || startup.fundingStage || "Unknown"
    stageCounts[stage] = (stageCounts[stage] || 0) + 1
  })

  visualizations.push({
    type: "pie",
    title: "Distribución por Etapa",
    data: Object.entries(stageCounts).map(([stage, count]) => ({ name: stage, value: count })),
  })

  // Geographic distribution
  const locationCounts: Record<string, number> = {}
  filteredStartups.forEach((startup) => {
    const location = startup["Región (CCAA)"] || startup.location || "Unknown"
    locationCounts[location] = (locationCounts[location] || 0) + 1
  })

  visualizations.push({
    type: "map",
    title: "Distribución Geográfica",
    data: Object.entries(locationCounts).map(([location, count]) => ({
      name: location,
      value: count,
      coordinates: locationCoordinates[location] || [0, 0],
      isPriority: priorityRegions.includes(location),
    })),
  })

  // Timeline of founding years
  const yearCounts: Record<number, number> = {}
  filteredStartups.forEach((startup) => {
    const year = startup["Año de fundación"] || startup.foundingYear
    if (year) {
      yearCounts[year] = (yearCounts[year] || 0) + 1
    }
  })

  visualizations.push({
    type: "timeline",
    title: "Línea Temporal de Fundación",
    data: Object.entries(yearCounts)
      .map(([year, count]) => ({ year: Number.parseInt(year), count }))
      .sort((a, b) => a.year - b.year),
  })

  return visualizations
}

// Helper function to get funding amount
const getFundingAmount = (funding: string): number => {
  if (!funding || typeof funding !== 'string') return 0
  
  const match = funding.match(/€?([\d.,]+)([KMk]?)/)
  if (!match) return 0

  const amount = Number.parseFloat(match[1].replace(',', '.'))
  const multiplier = match[2]?.toUpperCase() === "M" ? 1000000 : match[2]?.toUpperCase() === "K" ? 1000 : 1
  return amount * multiplier
}
