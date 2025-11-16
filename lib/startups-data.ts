// Startup data types and utilities
export interface Startup {
  ID: string
  Nombre: string
  Descripción: string
  "Región (CCAA)": string
  Año: string
  Vertical: string
  Subvertical: string
  Tecnología: string
  "ODS principal": string
  "Tipo de impacto": string
  "Indicador de impacto": string
  "Escala de impacto": string
  "Población beneficiada / target": string
  "Diversidad del equipo": string
  "Nivel de madurez": string
  "Inversión total (€)": string
  Contacto: string
  Web: string
  "Fuente de información": string
}

// Extended startup interface for detailed profiles
export interface StartupProfile extends Startup {
  logo?: string
  coverImage?: string
  foundedBy: string[]
  employees: string
  headquarters: string
  industries: string[]
  businessModel: string
  keyMetrics: {
    revenue?: string
    customers?: string
    partnerships?: string
    patents?: string
  }
  milestones: {
    date: string
    title: string
    description: string
  }[]
  team: {
    name: string
    role: string
    image?: string
    linkedin?: string
  }[]
  investors: string[]
  competitiveAdvantage: string[]
  challenges: string[]
  futureGoals: string[]
  contactInfo: {
    email?: string
    phone?: string
    linkedin?: string
    twitter?: string
  }
}

export let startupsData: Startup[] = []

export function setStartupsData(data: Startup[]) {
  startupsData = data
}

export function getStartups(): Startup[] {
  return startupsData
}

// Utility functions for filtering and searching
export const getAllTechnologies = (): string[] => {
  const technologies = new Set<string>()
  startupsData.forEach((startup) => {
    if (startup.Tecnología) {
      startup.Tecnología.split(',').forEach(tech => technologies.add(tech.trim()))
    }
  })
  return Array.from(technologies).sort()
}

export const getAllLocations = (): string[] => {
  const locations = new Set<string>()
  startupsData.forEach((startup) => {
    if (startup["Región (CCAA)"]) {
      locations.add(startup["Región (CCAA)"])
    }
  })
  return Array.from(locations).sort()
}

export const getAllFundingStages = (): string[] => {
  const stages = new Set<string>()
  startupsData.forEach((startup) => {
    if (startup["Nivel de madurez"]) {
      stages.add(startup["Nivel de madurez"])
    }
  })
  return Array.from(stages).sort()
}

export const getAllImpacts = (): string[] => {
  const impacts = new Set<string>()
  startupsData.forEach((startup) => {
    if (startup["Tipo de impacto"]) {
      impacts.add(startup["Tipo de impacto"])
    }
  })
  return Array.from(impacts).sort()
}

export const getAllGenders = (): string[] => {
  const genders = new Set<string>()
  startupsData.forEach((startup) => {
    if (startup["Diversidad del equipo"]) {
      genders.add(startup["Diversidad del equipo"])
    }
  })
  return Array.from(genders).sort()
}

export const getAllVerticals = (): string[] => {
  const verticals = new Set<string>()
  startupsData.forEach((startup) => {
    if (startup.Vertical) {
      verticals.add(startup.Vertical)
    }
  })
  return Array.from(verticals).sort()
}

export const getFundingAmount = (funding: string): number => {
  if (!funding) return 0
  
  const cleanFunding = String(funding).replace(/[€\s]/g, '')
  const match = cleanFunding.match(/([\d.,]+)([KMB]?)/)
  if (!match) return 0

  const amount = Number.parseFloat(match[1].replace(',', '.'))
  // Handle K (thousands), M (millions), B (billions)
  const multiplier = match[2] === "B" ? 1000000000 : match[2] === "M" ? 1000000 : match[2] === "K" ? 1000 : 1
  return amount * multiplier
}

export const formatFunding = (funding: string | number): string => {
  const amount = typeof funding === 'string' ? getFundingAmount(funding) : funding
  
  if (amount === 0) return 'N/A'
  
  // Format based on magnitude
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(1)}K`
  } else {
    return `€${amount.toLocaleString('es-ES')}`
  }
}

// Convert basic startup data to detailed profiles
export const getStartupProfile = (name: string): StartupProfile | null => {
  const startup = startupsData.find((s) => s.Nombre === name)
  if (!startup) return null

  // Generate detailed profile data (in a real app, this would come from a database)
  const profiles: Record<string, Partial<StartupProfile>> = {
    "Heura Foods": {
      id: "heura-foods",
      foundedBy: ["Marc Coloma", "Bernat Añaños"],
      employees: "150-200",
      headquarters: "Barcelona, España",
      industries: ["Foodtech", "Plant-based", "Sustainability"],
      businessModel: "B2B2C - Productos plant-based para retail y foodservice",
      keyMetrics: {
        revenue: "€15M+ (2023)",
        customers: "10,000+ puntos de venta",
        partnerships: "Mercadona, Carrefour, El Corte Inglés",
        patents: "5+ patentes en desarrollo",
      },
      milestones: [
        {
          date: "2017",
          title: "Fundación de la empresa",
          description: "Marc Coloma y Bernat Añaños fundan Heura Foods en Barcelona",
        },
        {
          date: "2019",
          title: "Primera ronda de financiación",
          description: "Serie A de €2M liderada por New Crop Capital",
        },
        {
          date: "2021",
          title: "Expansión internacional",
          description: "Lanzamiento en Francia, Italia y Reino Unido",
        },
        {
          date: "2023",
          title: "Serie B",
          description: "€36M para acelerar expansión y desarrollo de productos",
        },
      ],
      team: [
        {
          name: "Marc Coloma",
          role: "CEO & Co-founder",
          linkedin: "https://linkedin.com/in/marccoloma",
        },
        {
          name: "Bernat Añaños",
          role: "CTO & Co-founder",
          linkedin: "https://linkedin.com/in/bernatananos",
        },
      ],
      investors: ["Unovis Partners", "New Crop Capital", "Backed VC"],
      competitiveAdvantage: [
        "Tecnología propietaria de texturización",
        "Fuerte presencia en retail español",
        "Productos con perfil nutricional superior",
        "Marca reconocida por consumidores",
      ],
      challenges: [
        "Competencia creciente en el sector plant-based",
        "Escalabilidad de producción",
        "Educación del consumidor",
      ],
      futureGoals: [
        "Expansión a mercados de LATAM",
        "Desarrollo de nuevas categorías de productos",
        "Inversión en I+D para mejorar sabor y textura",
      ],
      contactInfo: {
        email: "info@heurafoods.com",
        linkedin: "https://linkedin.com/company/heura-foods",
        twitter: "https://twitter.com/heurafoods",
      },
    },
    "BioTech Foods": {
      id: "biotech-foods",
      foundedBy: ["Mercedes Vila", "Iñigo Charola"],
      employees: "25-50",
      headquarters: "San Sebastián, España",
      industries: ["Biotech", "Cultured Meat", "Cellular Agriculture"],
      businessModel: "B2B - Tecnología y productos de carne cultivada",
      keyMetrics: {
        revenue: "Pre-revenue (desarrollo)",
        customers: "Partnerships estratégicos",
        partnerships: "JBS, Grupo Vall Companys",
        patents: "10+ patentes registradas",
      },
      milestones: [
        {
          date: "2017",
          title: "Fundación",
          description: "Primera empresa española de carne cultivada",
        },
        {
          date: "2021",
          title: "Serie A",
          description: "€5.2M para desarrollo de tecnología",
        },
        {
          date: "2023",
          title: "Partnership con JBS",
          description: "Acuerdo estratégico con el mayor procesador de carne del mundo",
        },
      ],
      team: [
        {
          name: "Mercedes Vila",
          role: "CEO & Co-founder",
        },
        {
          name: "Iñigo Charola",
          role: "CTO & Co-founder",
        },
      ],
      investors: ["JBS", "Grupo Vall Companys", "Eatable Adventures"],
      competitiveAdvantage: [
        "Primera empresa española en el sector",
        "Tecnología propietaria de cultivo celular",
        "Partnerships con grandes procesadores",
        "Equipo científico de alto nivel",
      ],
      challenges: ["Regulación europea pendiente", "Costos de producción elevados", "Aceptación del consumidor"],
      futureGoals: [
        "Obtener aprobación regulatoria en Europa",
        "Escalar producción comercial",
        "Reducir costos de producción",
      ],
      contactInfo: {
        email: "info@biotech-foods.com",
        linkedin: "https://linkedin.com/company/biotech-foods",
      },
    },
  }

  const profileData = profiles[startup.Nombre] || {}

  return {
    ...startup,
    id: profileData.id || startup.ID.toLowerCase().replace(/\s+/g, "-"),
    foundedBy: profileData.foundedBy || ["Información no disponible"],
    employees: profileData.employees || "No especificado",
    headquarters: profileData.headquarters || startup["Región (CCAA)"],
    industries: profileData.industries || startup.Tecnología.split(',').map(tech => tech.trim()),
    businessModel: profileData.businessModel || "Información no disponible",
    keyMetrics: profileData.keyMetrics || {},
    milestones: profileData.milestones || [],
    team: profileData.team || [],
    investors: profileData.investors || [],
    competitiveAdvantage: profileData.competitiveAdvantage || [],
    challenges: profileData.challenges || [],
    futureGoals: profileData.futureGoals || [],
    contactInfo: profileData.contactInfo || {},
  }
}

export const getStartupById = (id: string): Startup | null => {
  return startupsData.find((s) => {
    const slug = (s.ID || s.Nombre).toLowerCase().replace(/\s+/g, "-")
    return s.ID === id || slug === id
  }) || null
}
