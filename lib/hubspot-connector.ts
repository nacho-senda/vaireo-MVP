/**
 * HubSpot Connector para la carga de startups
 * 
 * Este módulo proporciona funcionalidades para conectar con la API de HubSpot
 * y sincronizar datos de startups desde HubSpot CRM a la plataforma Vaireo.
 * 
 * NOTA: Este es un DRAFT preparado para implementación futura.
 * Requiere configuración de variables de entorno y credenciales de HubSpot.
 */

import type { Startup } from './startups-data'

// Configuración de HubSpot API
const HUBSPOT_API_BASE = 'https://api.hubapi.com'
const HUBSPOT_CRM_API = `${HUBSPOT_API_BASE}/crm/v3/objects`

/**
 * Interfaz para las propiedades de una empresa en HubSpot
 * Mapea los campos de HubSpot a nuestra estructura de Startup
 */
interface HubSpotCompany {
  id: string
  properties: {
    name: string
    description?: string
    city?: string
    state?: string
    founded_year?: string
    industry?: string
    technology_focus?: string
    funding_stage?: string
    total_funding?: string
    website?: string
    phone?: string
    domain?: string
    // Campos personalizados de HubSpot para startups
    vertical?: string
    subvertical?: string
    sdg_main?: string // ODS principal
    impact_type?: string
    impact_indicator?: string
    impact_scale?: string
    target_population?: string
    team_diversity?: string
    maturity_level?: string
    contact_person?: string
    information_source?: string
  }
}

/**
 * Configuración de autenticación de HubSpot
 * En producción, estas variables deben estar en las variables de entorno
 */
interface HubSpotConfig {
  apiKey?: string // Private App Access Token
  portalId?: string // ID del portal de HubSpot
}

/**
 * Obtiene la configuración de HubSpot desde variables de entorno
 * DRAFT: Estas variables deben ser configuradas en Vercel/Environment
 */
function getHubSpotConfig(): HubSpotConfig {
  return {
    apiKey: process.env.HUBSPOT_API_KEY,
    portalId: process.env.HUBSPOT_PORTAL_ID,
  }
}

/**
 * Verifica si HubSpot está configurado correctamente
 */
export function isHubSpotConfigured(): boolean {
  const config = getHubSpotConfig()
  return !!(config.apiKey && config.portalId)
}

/**
 * Obtiene los headers necesarios para hacer llamadas a la API de HubSpot
 */
function getHubSpotHeaders(): HeadersInit {
  const config = getHubSpotConfig()
  
  if (!config.apiKey) {
    throw new Error('HubSpot API Key no configurada')
  }

  return {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
  }
}

/**
 * Convierte una empresa de HubSpot a nuestro formato de Startup
 */
function mapHubSpotCompanyToStartup(company: HubSpotCompany): Startup {
  const props = company.properties
  
  return {
    ID: company.id,
    Nombre: props.name || 'Sin nombre',
    Descripción: props.description || '',
    'Región (CCAA)': props.state || props.city || '',
    Año: props.founded_year || '',
    Vertical: props.vertical || props.industry || '',
    Subvertical: props.subvertical || '',
    Tecnología: props.technology_focus || '',
    'ODS principal': props.sdg_main || '',
    'Tipo de impacto': props.impact_type || '',
    'Indicador de impacto': props.impact_indicator || '',
    'Escala de impacto': props.impact_scale || '',
    'Población beneficiada / target': props.target_population || '',
    'Diversidad del equipo': props.team_diversity || '',
    'Nivel de madurez': props.maturity_level || props.funding_stage || '',
    'Inversión total (€)': props.total_funding || '',
    Contacto: props.contact_person || props.phone || '',
    Web: props.website || props.domain || '',
    'Fuente de información': props.information_source || 'HubSpot CRM',
  }
}

/**
 * DRAFT: Obtiene todas las startups desde HubSpot CRM
 * 
 * @param limit - Número máximo de empresas a obtener (por defecto 100)
 * @returns Array de startups obtenidas desde HubSpot
 * 
 * Ejemplo de uso:
 * ```typescript
 * const startups = await fetchStartupsFromHubSpot()
 * console.log(`Obtenidas ${startups.length} startups desde HubSpot`)
 * ```
 */
export async function fetchStartupsFromHubSpot(limit: number = 100): Promise<Startup[]> {
  try {
    // Verificar configuración
    if (!isHubSpotConfigured()) {
      throw new Error('HubSpot no está configurado. Configure HUBSPOT_API_KEY y HUBSPOT_PORTAL_ID')
    }

    // Lista de propiedades a obtener
    const properties = [
      'name',
      'description',
      'city',
      'state',
      'founded_year',
      'industry',
      'technology_focus',
      'funding_stage',
      'total_funding',
      'website',
      'phone',
      'domain',
      // Propiedades personalizadas
      'vertical',
      'subvertical',
      'sdg_main',
      'impact_type',
      'impact_indicator',
      'impact_scale',
      'target_population',
      'team_diversity',
      'maturity_level',
      'contact_person',
      'information_source',
    ]

    // Construir URL con parámetros
    const params = new URLSearchParams({
      limit: limit.toString(),
      properties: properties.join(','),
      // Filtro opcional: solo empresas marcadas como startups
      // filterGroups: JSON.stringify([...]) // Se puede agregar filtrado personalizado
    })

    const url = `${HUBSPOT_CRM_API}/companies?${params.toString()}`

    // Realizar llamada a la API
    const response = await fetch(url, {
      method: 'GET',
      headers: getHubSpotHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Error de HubSpot API: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Mapear empresas de HubSpot a nuestro formato
    const startups: Startup[] = data.results.map((company: HubSpotCompany) => 
      mapHubSpotCompanyToStartup(company)
    )

    return startups

  } catch (error) {
    console.error('[HubSpot Connector] Error fetching startups:', error)
    throw error
  }
}

/**
 * DRAFT: Obtiene una startup específica por ID desde HubSpot
 * 
 * @param companyId - ID de la empresa en HubSpot
 * @returns La startup solicitada o null si no se encuentra
 */
export async function fetchStartupByIdFromHubSpot(companyId: string): Promise<Startup | null> {
  try {
    if (!isHubSpotConfigured()) {
      throw new Error('HubSpot no está configurado')
    }

    const properties = [
      'name', 'description', 'city', 'state', 'founded_year',
      'industry', 'technology_focus', 'funding_stage', 'total_funding',
      'website', 'phone', 'domain', 'vertical', 'subvertical',
      'sdg_main', 'impact_type', 'impact_indicator', 'impact_scale',
      'target_population', 'team_diversity', 'maturity_level',
      'contact_person', 'information_source',
    ]

    const params = new URLSearchParams({
      properties: properties.join(','),
    })

    const url = `${HUBSPOT_CRM_API}/companies/${companyId}?${params.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: getHubSpotHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Error de HubSpot API: ${response.status}`)
    }

    const company: HubSpotCompany = await response.json()
    return mapHubSpotCompanyToStartup(company)

  } catch (error) {
    console.error('[HubSpot Connector] Error fetching startup by ID:', error)
    throw error
  }
}

/**
 * DRAFT: Sincroniza startups desde HubSpot con la base de datos local
 * 
 * Esta función obtiene las startups desde HubSpot y las combina con
 * las startups existentes en el sistema.
 * 
 * @returns Resultado de la sincronización con estadísticas
 */
export async function syncStartupsFromHubSpot(): Promise<{
  success: boolean
  startups: Startup[]
  stats: {
    total: number
    new: number
    updated: number
    errors: number
  }
}> {
  try {
    console.log('[HubSpot Connector] Iniciando sincronización de startups...')

    const hubspotStartups = await fetchStartupsFromHubSpot()
    
    const stats = {
      total: hubspotStartups.length,
      new: 0,
      updated: 0,
      errors: 0,
    }

    console.log(`[HubSpot Connector] Sincronizadas ${stats.total} startups desde HubSpot`)

    return {
      success: true,
      startups: hubspotStartups,
      stats,
    }

  } catch (error) {
    console.error('[HubSpot Connector] Error en sincronización:', error)
    return {
      success: false,
      startups: [],
      stats: {
        total: 0,
        new: 0,
        updated: 0,
        errors: 1,
      },
    }
  }
}

/**
 * DRAFT: Busca startups en HubSpot por criterios específicos
 * 
 * @param filters - Filtros de búsqueda
 * @returns Startups que coinciden con los filtros
 */
export async function searchStartupsInHubSpot(filters: {
  vertical?: string
  technology?: string
  location?: string
  fundingStage?: string
}): Promise<Startup[]> {
  try {
    if (!isHubSpotConfigured()) {
      throw new Error('HubSpot no está configurado')
    }

    // Construir filtros de búsqueda de HubSpot
    const filterGroups = []
    
    if (filters.vertical) {
      filterGroups.push({
        filters: [{
          propertyName: 'vertical',
          operator: 'CONTAINS_TOKEN',
          value: filters.vertical,
        }],
      })
    }

    // NOTA: La búsqueda avanzada requiere configuración adicional
    // Este es un ejemplo simplificado
    const allStartups = await fetchStartupsFromHubSpot()
    
    // Filtrar localmente (en producción se haría en la API)
    return allStartups.filter(startup => {
      if (filters.vertical && !startup.Vertical.includes(filters.vertical)) {
        return false
      }
      if (filters.technology && !startup.Tecnología.includes(filters.technology)) {
        return false
      }
      if (filters.location && !startup['Región (CCAA)'].includes(filters.location)) {
        return false
      }
      if (filters.fundingStage && startup['Nivel de madurez'] !== filters.fundingStage) {
        return false
      }
      return true
    })

  } catch (error) {
    console.error('[HubSpot Connector] Error en búsqueda:', error)
    throw error
  }
}

/**
 * DRAFT: Crear o actualizar una startup en HubSpot
 * 
 * @param startup - Datos de la startup a crear/actualizar
 * @returns ID de la startup en HubSpot
 */
export async function upsertStartupToHubSpot(startup: Partial<Startup>): Promise<string> {
  try {
    if (!isHubSpotConfigured()) {
      throw new Error('HubSpot no está configurado')
    }

    // Mapear nuestros campos a propiedades de HubSpot
    const properties = {
      name: startup.Nombre,
      description: startup.Descripción,
      state: startup['Región (CCAA)'],
      founded_year: startup.Año,
      vertical: startup.Vertical,
      subvertical: startup.Subvertical,
      technology_focus: startup.Tecnología,
      sdg_main: startup['ODS principal'],
      impact_type: startup['Tipo de impacto'],
      impact_indicator: startup['Indicador de impacto'],
      impact_scale: startup['Escala de impacto'],
      target_population: startup['Población beneficiada / target'],
      team_diversity: startup['Diversidad del equipo'],
      maturity_level: startup['Nivel de madurez'],
      total_funding: startup['Inversión total (€)'],
      contact_person: startup.Contacto,
      website: startup.Web,
      information_source: startup['Fuente de información'],
    }

    const url = `${HUBSPOT_CRM_API}/companies`

    const response = await fetch(url, {
      method: 'POST',
      headers: getHubSpotHeaders(),
      body: JSON.stringify({ properties }),
    })

    if (!response.ok) {
      throw new Error(`Error creando startup en HubSpot: ${response.status}`)
    }

    const result = await response.json()
    return result.id

  } catch (error) {
    console.error('[HubSpot Connector] Error creando/actualizando startup:', error)
    throw error
  }
}
