# Guía de Deployment

Esta guía cubre las diferentes opciones para desplegar Vaireo en producción.

## Vercel (Recomendado)

Vercel es la plataforma recomendada por su integración nativa con Next.js.

### Deployment Automático

1. **Conectar Repositorio**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente Next.js

2. **Configurar Variables de Entorno**
   - En el dashboard de Vercel, ve a Settings → Environment Variables
   - Agrega todas las variables del archivo `.env.example`:
     - `OPENAI_API_KEY`
     - `GOOGLE_SHEETS_API_KEY`
     - `GOOGLE_SHEETS_SPREADSHEET_ID`
     - `GOOGLE_SHEETS_USERS_SPREADSHEET_ID`
     - `GOOGLE_SHEETS_WEBHOOK_URL`
     - `HUBSPOT_ACCESS_TOKEN` (opcional)

3. **Deploy**
   - Haz clic en "Deploy"
   - Vercel construirá y desplegará tu aplicación
   - Cada push a `main` desplegará automáticamente

### Deployment Manual

\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
\`\`\`

### Dominios Personalizados

1. Ve a Settings → Domains en Vercel
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones

## Netlify

### Configuración

1. **netlify.toml**
\`\`\`toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
\`\`\`

2. **Variables de Entorno**
   - En Site settings → Environment variables
   - Agrega todas las variables necesarias

3. **Deploy**
   - Conecta tu repositorio
   - Netlify construirá automáticamente

## Railway

\`\`\`bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Iniciar proyecto
railway init

# Deploy
railway up
\`\`\`

## Docker

### Dockerfile

\`\`\`dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
\`\`\`

### Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
\`\`\`

### Comandos

\`\`\`bash
# Build
docker build -t vaireo .

# Run
docker run -p 3000:3000 --env-file .env.local vaireo

# Con Docker Compose
docker-compose up -d
\`\`\`

## Variables de Entorno en Producción

### Seguridad

- Nunca expongas API keys en el código
- Usa servicios de gestión de secrets para producción
- Rota las keys periódicamente
- Usa diferentes keys para staging y producción

### Checklist Pre-Deployment

- [ ] Todas las variables de entorno configuradas
- [ ] API keys válidas y con permisos correctos
- [ ] URLs de webhooks actualizadas
- [ ] Build exitoso localmente
- [ ] Sin console.logs de debug
- [ ] Metadata SEO configurada
- [ ] Analytics configurado
- [ ] Error tracking configurado (opcional)

## Monitoreo

### Vercel Analytics

Ya incluido con `@vercel/analytics`:

\`\`\`typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

### Logging

En producción, los logs están disponibles en:
- Vercel: Dashboard → Logs
- Netlify: Site → Functions → Logs
- Railway: Project → Deployments → Logs

## Troubleshooting

### Build Errors

\`\`\`bash
# Limpiar cache
rm -rf .next node_modules
npm install
npm run build
\`\`\`

### Variables de Entorno No Reconocidas

- Verifica que estén prefijadas con `NEXT_PUBLIC_` si se usan en el cliente
- Redeploy después de cambiar variables de entorno

### Problemas de Memoria

En `package.json`:
\`\`\`json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
\`\`\`

## Soporte

Para problemas de deployment, revisa:
- [Documentación de Next.js](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Issues en GitHub](https://github.com/tu-usuario/vaireo/issues)
\`\`\`
