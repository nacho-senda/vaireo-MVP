# Política de Seguridad

## Versiones Soportadas

Actualmente mantenemos las siguientes versiones con actualizaciones de seguridad:

| Versión | Soporte          |
| ------- | ---------------- |
| 1.0.x   | :white_check_mark: |

## Reportar una Vulnerabilidad

La seguridad de Vaireo es una prioridad. Si descubres una vulnerabilidad de seguridad, por favor repórtala de manera responsable.

### Cómo Reportar

**NO** crees un issue público para vulnerabilidades de seguridad.

En su lugar:

1. **Email**: Envía un correo a security@vaireo.com con los detalles
2. **Incluye**:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir el problema
   - Impacto potencial
   - Sugerencias de mitigación (si las tienes)

### Qué Esperar

- **Confirmación**: Responderemos en 48 horas
- **Evaluación**: Evaluaremos y clasificaremos en 5 días hábiles
- **Corrección**: Trabajaremos en un fix prioritario
- **Divulgación**: Coordinaremos la divulgación pública contigo

## Mejores Prácticas de Seguridad

### Variables de Entorno

- NUNCA subas archivos `.env` o `.env.local` al repositorio
- Usa `.env.example` como plantilla sin valores reales
- Rota las API keys periódicamente
- Usa diferentes keys para desarrollo y producción

### API Keys y Tokens

Las siguientes variables contienen información sensible:

- `OPENAI_API_KEY`: API key de OpenAI
- `GOOGLE_SHEETS_API_KEY`: API key de Google
- `HUBSPOT_ACCESS_TOKEN`: Token de acceso HubSpot

**Protección**:
- Limita el alcance de las keys al mínimo necesario
- Usa restricciones de API (dominios, IPs) cuando sea posible
- Monitorea el uso de las APIs
- Revoca keys comprometidas inmediatamente

### Datos de Usuario

- Los datos de registro se almacenan en Google Sheets
- No se almacenan contraseñas en la plataforma
- Cumplimiento con GDPR para usuarios europeos
- Los usuarios pueden solicitar eliminación de datos

### Dependencias

- Mantenemos las dependencias actualizadas
- Revisamos regularmente vulnerabilidades con `npm audit`
- Aplicamos parches de seguridad prioritariamente

### Deployment

- Usa HTTPS en producción (Vercel lo proporciona por defecto)
- Configura headers de seguridad apropiados
- Implementa rate limiting en APIs cuando sea necesario
- Monitorea logs para actividad sospechosa

## Scope de Seguridad

### En Scope

- Inyección de código (XSS, SQL, etc.)
- Autenticación y autorización
- Exposición de datos sensibles
- Vulnerabilidades en dependencias
- Configuraciones inseguras

### Fuera de Scope

- Ataques de fuerza bruta sin bypass de rate limiting
- Vulnerabilidades en servicios de terceros (Google, OpenAI, etc.)
- Social engineering
- Ataques DDoS

## Créditos

Agradecemos a todos los investigadores de seguridad que reportan vulnerabilidades de manera responsable. Con tu permiso, te incluiremos en nuestro hall of fame.

## Contacto

Para consultas de seguridad: security@vaireo.com
Para soporte general: support@vaireo.com
\`\`\`

```text file=".nvmrc"
18.17.0
