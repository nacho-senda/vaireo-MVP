'use server'

/**
 * Server Action para cargar startups desde HubSpot
 * 
 * DRAFT: Esta es una implementación de ejemplo que muestra cómo
 * se integraría HubSpot en el flujo de carga de startups.
 */

import { 
  fetchStartupsFromHubSpot, 
  syncStartupsFromHubSpot, 
  isHubSpotConfigured 
} from '@/lib/hubspot-connector'
import type { Startup } from '@/lib/startups-data'

/**
 * Server Action que carga startups desde HubSpot CRM
 * 
 * Esta función puede ser llamada desde el cliente para obtener
 * datos actualizados de startups desde HubSpot.
 */
export async function cargarStartupsDesdeHubSpot(): Promise<{
  success: boolean
  data?: Startup[]
  error?: string
  source: string
}> {
  try {
    // Verificar si HubSpot está configurado
    if (!isHubSpotConfigured()) {
      return {
        success: false,
        error: 'HubSpot no está configurado. Configure las variables de entorno HUBSPOT_API_KEY y HUBSPOT_PORTAL_ID',
        source: 'hubspot',
      }
    }

    console.log('[v0] Cargando startups desde HubSpot CRM...')

    // Obtener startups desde HubSpot
    const startups = await fetchStartupsFromHubSpot(100)

    console.log(`[v0] Cargadas ${startups.length} startups desde HubSpot`)

    return {
      success: true,
      data: startups,
      source: 'hubspot',
    }

  } catch (error) {
    console.error('[v0] Error cargando startups desde HubSpot:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al cargar desde HubSpot',
      source: 'hubspot',
    }
  }
}

/**
 * Server Action que sincroniza startups desde múltiples fuentes
 * 
 * Combina datos del CSV local con datos de HubSpot para tener
 * un conjunto completo de startups.
 */
export async function sincronizarStartupsMultifuente(): Promise<{
  success: boolean
  data?: Startup[]
  error?: string
  sources: {
    csv: number
    hubspot: number
    total: number
  }
}> {
  try {
    console.log('[v0] Iniciando sincronización multifuente...')

    const allStartups: Startup[] = []
    const sources = {
      csv: 0,
      hubspot: 0,
      total: 0,
    }

    // 1. Cargar desde CSV local
    try {
      const { cargarStartups } = await import('./load-startups')
      const csvResult = await cargarStartups()
      
      if (csvResult.success && csvResult.data) {
        allStartups.push(...csvResult.data)
        sources.csv = csvResult.data.length
        console.log(`[v0] Cargadas ${sources.csv} startups desde CSV`)
      }
    } catch (error) {
      console.error('[v0] Error cargando CSV:', error)
    }

    // 2. Cargar desde HubSpot (si está configurado)
    if (isHubSpotConfigured()) {
      try {
        const hubspotStartups = await fetchStartupsFromHubSpot(100)
        
        // Evitar duplicados - filtrar startups que ya existen por nombre
        const existingNames = new Set(allStartups.map(s => s.Nombre.toLowerCase()))
        const newHubspotStartups = hubspotStartups.filter(
          s => !existingNames.has(s.Nombre.toLowerCase())
        )
        
        allStartups.push(...newHubspotStartups)
        sources.hubspot = newHubspotStartups.length
        console.log(`[v0] Añadidas ${sources.hubspot} startups nuevas desde HubSpot`)
      } catch (error) {
        console.error('[v0] Error cargando desde HubSpot:', error)
      }
    } else {
      console.log('[v0] HubSpot no configurado, saltando...')
    }

    sources.total = allStartups.length

    console.log(`[v0] Sincronización completa: ${sources.total} startups (CSV: ${sources.csv}, HubSpot: ${sources.hubspot})`)

    return {
      success: true,
      data: allStartups,
      sources,
    }

  } catch (error) {
    console.error('[v0] Error en sincronización multifuente:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      sources: {
        csv: 0,
        hubspot: 0,
        total: 0,
      },
    }
  }
}
