# Integración con HubSpot CRM

Este documento describe cómo configurar y utilizar la integración con HubSpot para gestionar las startups en la plataforma Vaireo.

## Estado: DRAFT

Esta integración está preparada como borrador y requiere configuración adicional para ser utilizada en producción.

## Requisitos Previos

1. **Cuenta de HubSpot**: Necesitas una cuenta de HubSpot con acceso al CRM
2. **Private App Access Token**: Token de autenticación de HubSpot
3. **Portal ID**: ID de tu portal de HubSpot

## Configuración

### 1. Crear Private App en HubSpot

1. Ve a **Settings** > **Integrations** > **Private Apps**
2. Crea una nueva Private App
3. Dale los siguientes permisos (scopes):
   - `crm.objects.companies.read` - Leer empresas
   - `crm.objects.companies.write` - Crear/actualizar empresas
   - `crm.schemas.companies.read` - Leer propiedades personalizadas

### 2. Configurar Propiedades Personalizadas en HubSpot

Crea las siguientes propiedades personalizadas en el objeto **Company**:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `vertical` | Single-line text | Vertical de la startup |
| `subvertical` | Single-line text | Subvertical específico |
| `sdg_main` | Single-line text | ODS principal |
| `impact_type` | Single-line text | Tipo de impacto |
| `impact_indicator` | Single-line text | Indicador de impacto |
| `impact_scale` | Single-line text | Escala de impacto |
| `target_population` | Multi-line text | Población beneficiada |
| `team_diversity` | Single-line text | Diversidad del equipo |
| `maturity_level` | Dropdown | Nivel de madurez |
| `contact_person` | Single-line text | Persona de contacto |
| `information_source` | Single-line text | Fuente de información |
| `technology_focus` | Multi-line text | Tecnologías utilizadas |

### 3. Variables de Entorno

Añade las siguientes variables de entorno en tu proyecto de Vercel:

\`\`\`bash
HUBSPOT_API_KEY=tu_private_app_access_token
HUBSPOT_PORTAL_ID=tu_portal_id
\`\`\`

Para obtener tu Portal ID:
1. Ve a **Settings** > **Account Setup** > **Account Defaults**
2. Copia el **HubSpot Account ID** (Portal ID)

## Uso

### Cargar Startups desde HubSpot

\`\`\`typescript
import { cargarStartupsDesdeHubSpot } from '@/app/actions/load-startups-hubspot'

const result = await cargarStartupsDesdeHubSpot()

if (result.success) {
  console.log(`Cargadas ${result.data.length} startups desde HubSpot`)
} else {
  console.error('Error:', result.error)
}
\`\`\`

### Sincronización Multifuente (CSV + HubSpot)

\`\`\`typescript
import { sincronizarStartupsMultifuente } from '@/app/actions/load-startups-hubspot'

const result = await sincronizarStartupsMultifuente()

if (result.success) {
  console.log(`Total: ${result.sources.total} startups`)
  console.log(`- CSV: ${result.sources.csv}`)
  console.log(`- HubSpot: ${result.sources.hubspot}`)
}
\`\`\`

### Buscar Startups en HubSpot

\`\`\`typescript
import { searchStartupsInHubSpot } from '@/lib/hubspot-connector'

const startups = await searchStartupsInHubSpot({
  vertical: 'FoodTech',
  location: 'Madrid',
  fundingStage: 'Serie A'
})
\`\`\`

### Crear/Actualizar Startup en HubSpot

\`\`\`typescript
import { upsertStartupToHubSpot } from '@/lib/hubspot-connector'

const startupId = await upsertStartupToHubSpot({
  Nombre: 'Nueva Startup',
  Descripción: 'Descripción de la startup',
  'Región (CCAA)': 'Madrid',
  Vertical: 'FoodTech',
  Tecnología: 'IA, IoT',
  // ... más campos
})
\`\`\`

## Integración con la Página de Startups

Para utilizar HubSpot en la página de startups, modifica el archivo `app/actions/load-startups.ts`:

\`\`\`typescript
import { sincronizarStartupsMultifuente } from './load-startups-hubspot'

export async function cargarStartups() {
  // Usar sincronización multifuente en lugar de solo CSV
  return await sincronizarStartupsMultifuente()
}
\`\`\`

## Arquitectura

\`\`\`
┌─────────────────┐
│   CSV Local     │
│  (75 startups)  │
└────────┬────────┘
         │
         │  Sincronización
         ▼
┌─────────────────────┐
│  Vaireo Platform    │
│   (Startups Data)   │
└─────────┬───────────┘
          │
          │  API Calls
          ▼
┌─────────────────────┐
│   HubSpot CRM       │
│  (Companies)        │
└─────────────────────┘
\`\`\`

## Flujo de Datos

1. **Carga Inicial**: CSV local se carga primero (75 startups conocidas)
2. **Sincronización HubSpot**: Si está configurado, se obtienen startups adicionales desde HubSpot
3. **Deduplicación**: Se eliminan duplicados basándose en el nombre de la startup
4. **Presentación**: Todas las startups se muestran en la interfaz

## Limitaciones Actuales (DRAFT)

- ⚠️ No hay sincronización bidireccional automática
- ⚠️ La búsqueda avanzada está simplificada
- ⚠️ No hay manejo de rate limits de la API
- ⚠️ No hay caché de datos de HubSpot
- ⚠️ No hay webhooks para actualizaciones en tiempo real

## Próximos Pasos

Para una implementación completa:

1. **Implementar caché**: Usar Redis/Upstash para cachear datos de HubSpot
2. **Webhooks**: Configurar webhooks de HubSpot para sincronización en tiempo real
3. **Sincronización bidireccional**: Permitir crear/editar startups en Vaireo y sincronizar a HubSpot
4. **Rate limiting**: Implementar manejo de límites de la API
5. **Batch processing**: Procesar startups en lotes para mejor rendimiento
6. **Error handling mejorado**: Retry logic y manejo robusto de errores

## Soporte

Para más información sobre la API de HubSpot:
- [Documentación oficial de HubSpot API](https://developers.hubspot.com/docs/api/overview)
- [CRM Objects API](https://developers.hubspot.com/docs/api/crm/understanding-the-crm)
