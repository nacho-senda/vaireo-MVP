import { supabase } from "@/lib/supabase/queries"

export interface Startup {
  id: string
  nombre: string
  descripcion: string
  region: string
  year: number
  vertical: string
  subvertical: string
  tecnologia: string
  website: string | null
  pais: string
  status: string
  fuente?: string | null
  nivel_madurez?: string | null
  inversion_total?: string | null
}

let startupsCache: Startup[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

async function fetchStartupsFromSupabase(): Promise<Startup[]> {
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .eq("status", "active")

  if (error) {
    console.error("[v0] Error fetching startups from Supabase:", error)
    return []
  }

  return data as Startup[]
}

export async function getStartupsData(): Promise<Startup[]> {
  const now = Date.now()
  
  // Invalidar cache si ha expirado
  if (startupsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return startupsCache
  }

  try {
    startupsCache = await fetchStartupsFromSupabase()
    cacheTimestamp = now
    return startupsCache
  } catch (error) {
    console.error("[v0] Error cargando datos de startups:", error)
    return startupsCache || []
  }
}

// Busqueda inteligente con puntuacion de relevancia
export async function searchStartups(query: string): Promise<Startup[]> {
  const startups = await getStartupsData()
  if (!query || query.trim().length < 2) return startups.slice(0, 10)
  
  const lowerQuery = query.toLowerCase()
  const queryTerms = lowerQuery.split(/\s+/).filter(t => t.length > 2)
  
  // Keywords del sector para mejorar busqueda
  const sectorKeywords: Record<string, string[]> = {
    "proteina": ["plant-based", "vegetal", "alternativa", "heura", "carne"],
    "carne": ["cultivada", "celular", "biotech", "proteina"],
    "agricultura": ["precision", "agtech", "sensores", "drones", "iot"],
    "sostenibilidad": ["circular", "desperdicio", "residuos", "envases"],
    "biotecnologia": ["fermentacion", "ingredientes", "funcional"],
    "ia": ["inteligencia artificial", "machine learning", "datos", "prediccion"],
    "iot": ["sensores", "conectividad", "smart", "precision"],
  }
  
  // Expandir terminos de busqueda
  const expandedTerms = new Set(queryTerms)
  for (const term of queryTerms) {
    const related = sectorKeywords[term]
    if (related) {
      related.forEach(r => expandedTerms.add(r))
    }
  }
  
  // Calcular puntuacion de relevancia
  const scored = startups.map(startup => {
    let score = 0
    const searchableText = `${startup.nombre} ${startup.descripcion} ${startup.vertical} ${startup.subvertical} ${startup.tecnologia} ${startup.region}`.toLowerCase()
    
    for (const term of expandedTerms) {
      if (startup.nombre?.toLowerCase().includes(term)) score += 10
      if (startup.vertical?.toLowerCase().includes(term)) score += 5
      if (startup.tecnologia?.toLowerCase().includes(term)) score += 4
      if (startup.subvertical?.toLowerCase().includes(term)) score += 3
      if (startup.descripcion?.toLowerCase().includes(term)) score += 2
      if (startup.region?.toLowerCase().includes(term)) score += 1
    }
    
    return { startup, score }
  })
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.startup)
}

// Obtener startups por vertical
export async function getStartupsByVertical(vertical: string): Promise<Startup[]> {
  const startups = await getStartupsData()
  return startups.filter(s => 
    s.vertical?.toLowerCase().includes(vertical.toLowerCase()) ||
    s.subvertical?.toLowerCase().includes(vertical.toLowerCase())
  )
}

// Obtener startups por region
export async function getStartupsByRegion(region: string): Promise<Startup[]> {
  const startups = await getStartupsData()
  return startups.filter(s => 
    s.region?.toLowerCase().includes(region.toLowerCase())
  )
}

// Estadisticas del ecosistema
export async function getStartupStats(): Promise<{
  total: number
  verticals: string[]
  regions: string[]
  technologies: string[]
  yearRange: { min: number; max: number }
}> {
  const startups = await getStartupsData()
  
  const verticals = [...new Set(startups.map(s => s.vertical).filter(Boolean))]
  const regions = [...new Set(startups.map(s => s.region).filter(Boolean))]
  const technologies = [...new Set(startups.flatMap(s => s.tecnologia?.split(",").map(t => t.trim()) || []).filter(Boolean))]
  const years = startups.map(s => s.year).filter(y => y > 0)
  
  return {
    total: startups.length,
    verticals: verticals.sort(),
    regions: regions.sort(),
    technologies: technologies.sort(),
    yearRange: {
      min: Math.min(...years, 2010),
      max: Math.max(...years, new Date().getFullYear())
    }
  }
}

export async function getStartupsContext(): Promise<string> {
  const startups = await getStartupsData()
  
  // Agrupar por vertical
  const byVertical: Record<string, Startup[]> = {}
  startups.forEach(s => {
    const v = s.vertical || "Otros"
    if (!byVertical[v]) byVertical[v] = []
    byVertical[v].push(s)
  })
  
  // Agrupar por region
  const byRegion: Record<string, number> = {}
  startups.forEach(s => {
    const r = s.region || "Desconocida"
    byRegion[r] = (byRegion[r] || 0) + 1
  })
  
  // Obtener tecnologias unicas
  const technologies = [...new Set(startups.flatMap(s => 
    s.tecnologia?.split(",").map(t => t.trim()) || []
  ).filter(Boolean))]

  // Construir listado completo de startups para el contexto
  const startupsList = startups.map(s => 
    `- ${s.nombre} (${s.region}, ${s.year}): ${s.vertical} - ${s.descripcion?.substring(0, 80)}...`
  ).join("\n")

  return `
## BASE DE DATOS COMPLETA DE STARTUPS AGROALIMENTARIAS ESPANOLAS

**Total: ${startups.length} startups activas**

### STARTUPS POR VERTICAL:
${Object.entries(byVertical)
  .sort((a, b) => b[1].length - a[1].length)
  .map(([vertical, list]) => `**${vertical}** (${list.length}): ${list.map(s => s.nombre).join(", ")}`)
  .join("\n")}

### DISTRIBUCION GEOGRAFICA:
${Object.entries(byRegion)
  .sort((a, b) => b[1] - a[1])
  .map(([region, count]) => `- ${region}: ${count} startups`)
  .join("\n")}

### TECNOLOGIAS DEL ECOSISTEMA:
${technologies.slice(0, 20).join(", ")}

### LISTADO COMPLETO DE STARTUPS:
${startupsList}
`
}
