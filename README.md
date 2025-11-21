# Vaireo

Plataforma para explorar y conectar con el ecosistema de startups agroalimentarias en España.

## Sobre el proyecto

Vaireo nace de la necesidad de tener un punto centralizado donde consultar información sobre las startups, tecnologías y actores del sector AgriFood en España. Esta plataforma facilita el descubrimiento de nuevos proyectos, análisis de tendencias y conexión entre emprendedores e inversores del sector.

## Funcionalidades

- Base de datos con 75+ startups del ecosistema AgriFood español
- Sistema de filtros por vertical, tecnología, región y ODS
- Panel de analíticas con visualización de datos del sector
- Asistente de IA para consultar información sobre startups
- Gestión de proyectos colaborativos
- Integración con Google Sheets y HubSpot

## Stack técnico

Este proyecto está construido con:

- Next.js 14 con App Router
- React 19 y TypeScript
- Tailwind CSS v4 para estilos
- shadcn/ui y Radix UI para componentes
- Recharts para visualización de datos
- Vercel AI SDK para el asistente de IA
- Framer Motion para animaciones

## Empezar

Clona el repositorio e instala las dependencias:

\`\`\`bash
git clone https://github.com/tu-usuario/vaireo.git
cd vaireo
npm install
\`\`\`

Configura las variables de entorno copiando el archivo de ejemplo:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Necesitarás configurar:

- `OPENAI_API_KEY` - Para el asistente de IA
- `GOOGLE_SHEETS_API_KEY` - Para sincronización con Google Sheets
- `GOOGLE_SHEETS_SPREADSHEET_ID` - ID de tu spreadsheet
- Opcionalmente `HUBSPOT_ACCESS_TOKEN` para integración con HubSpot

Ejecuta el servidor de desarrollo:

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura

\`\`\`
app/                    # Rutas y páginas
├── actions/           # Server actions
├── api/              # Endpoints de API
├── analytics/        # Dashboard de analíticas
├── projects/         # Gestión de proyectos
└── startups/         # Directorio de startups

components/            # Componentes React
├── ui/               # Componentes base
└── ...               # Componentes específicos

lib/                  # Utilidades y lógica
├── startups-data.ts  # Gestión de datos
├── analytics-data.ts # Lógica de analytics
└── hubspot-connector.ts # Integración HubSpot

data/                 # Datos estáticos
└── startups.csv      # Base de datos principal

docs/                 # Documentación adicional
\`\`\`

## Datos

Los datos de las startups se encuentran en `data/startups.csv` e incluyen información sobre más de 75 empresas del sector, con detalles sobre su vertical, tecnologías, ubicación, ODS y más.

El asistente de IA tiene acceso a estos datos y puede responder preguntas sobre las startups del ecosistema.

## Despliegue

La forma más sencilla de desplegar es usando Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

También puedes desplegarlo en cualquier plataforma compatible con Next.js como Netlify, Railway o AWS.

## Contribuir

Si quieres contribuir al proyecto:

1. Haz fork del repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Abre un Pull Request

## Licencia

MIT

## Contacto

Para preguntas o sugerencias sobre el proyecto, abre un issue en GitHub.
