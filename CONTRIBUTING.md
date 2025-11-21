# Guía de Contribución

Gracias por tu interés en contribuir a Vaireo. Esta guía te ayudará a empezar.

## 🚀 Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

- Descripción clara del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots si es aplicable
- Información del entorno (navegador, OS, etc.)

### Sugerir Features

Las sugerencias de nuevas características son bienvenidas:

1. Verifica que no exista ya una sugerencia similar
2. Describe claramente el problema que resuelve
3. Explica la solución propuesta
4. Considera alternativas

### Pull Requests

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   \`\`\`bash
   git checkout -b feature/mi-nueva-feature
   \`\`\`
3. **Realiza tus cambios** siguiendo las guías de estilo
4. **Commit** con mensajes descriptivos:
   \`\`\`bash
   git commit -m "feat: agregar filtro por ODS"
   \`\`\`
5. **Push** a tu fork:
   \`\`\`bash
   git push origin feature/mi-nueva-feature
   \`\`\`
6. **Abre un Pull Request** con descripción detallada

## 📝 Guías de Estilo

### Código

- Usa TypeScript para todo el código
- Sigue las convenciones de ESLint
- Nombra componentes en PascalCase
- Nombra funciones y variables en camelCase
- Usa kebab-case para nombres de archivos

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin afectar código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

Ejemplos:
\`\`\`
feat: agregar integración con HubSpot
fix: corregir filtro de búsqueda en startups
docs: actualizar guía de instalación
\`\`\`

### Componentes React

\`\`\`typescript
// ✅ Buena práctica
export function StartupCard({ startup }: { startup: Startup }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{startup.nombre}</CardTitle>
      </CardHeader>
    </Card>
  )
}

// ❌ Evitar
export default function startupCard(props: any) {
  return <div>{props.startup.nombre}</div>
}
\`\`\`

## 🧪 Testing

Antes de enviar un PR:

1. Verifica que el proyecto compile sin errores:
   \`\`\`bash
   npm run build
   \`\`\`

2. Ejecuta el linter:
   \`\`\`bash
   npm run lint
   \`\`\`

3. Prueba tu código localmente en diferentes navegadores

## 📚 Estructura del Proyecto

Mantén la organización:

\`\`\`
app/           - Páginas y rutas de Next.js
components/    - Componentes reutilizables
lib/          - Lógica de negocio y utilidades
docs/         - Documentación
public/       - Assets estáticos
\`\`\`

## 🔍 Code Review

Todos los PRs serán revisados. Esperamos:

- Código limpio y legible
- Componentes pequeños y enfocados
- Comentarios solo donde sea necesario
- Sin código comentado
- Sin console.logs de debug

## 💬 Comunicación

- Usa issues para discusiones técnicas
- Sé respetuoso y constructivo
- Da contexto en tus comentarios
- Pide ayuda si la necesitas

## 📖 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [shadcn/ui](https://ui.shadcn.com/)

¡Gracias por contribuir! 🙌
