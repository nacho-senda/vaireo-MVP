import { streamText } from "ai"
import {
  getStartupsContext,
  searchStartups,
  getStartupStats,
} from "@/lib/startups-context"
import { searchWeb } from "@/lib/web-search"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Mensajes inválidos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Filtrar mensajes con contenido válido
    const validMessages = messages
      .filter((m: any) => m.content !== null && m.content !== undefined)
      .map((m: any) => ({
        role: m.role as "user" | "assistant" | "system",
        content: String(m.content || ""),
      }))

    if (validMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No hay mensajes válidos" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Obtener el último mensaje del usuario para búsqueda
    const lastUserMessage = validMessages[validMessages.length - 1]?.content || ""

    // Buscar en base de datos y web en paralelo
    const [dbResults, webResults, stats, startupsContext] = await Promise.all([
      searchStartups(lastUserMessage),
      searchWeb(lastUserMessage),
      getStartupStats(),
      getStartupsContext(),
    ])

    // Formatear resultados de base de datos
    const dbSection = dbResults.length > 0
      ? `\n\n## RESULTADOS DE BASE DE DATOS (${dbResults.length} startups encontradas):\n${dbResults.slice(0, 5).map((s, i) => 
          `${i + 1}. **${s.nombre}** (${s.region}, ${s.year || "N/A"})\n   - Vertical: ${s.vertical}\n   - Tecnología: ${s.tecnologia}\n   - ${s.descripcion}\n   - Web: ${s.website || "N/A"}`
        ).join("\n\n")}`
      : "\n\n## BASE DE DATOS: No se encontraron resultados directos."

    // Formatear resultados web
    const webSection = webResults.length > 0
      ? `\n\n## RESULTADOS WEB (información complementaria):\n${webResults.slice(0, 3).map((r, i) => 
          `${i + 1}. **${r.title}**\n   ${r.snippet}\n   Fuente: ${r.url}`
        ).join("\n\n")}`
      : ""

    // System prompt con datos pre-cargados
    const systemPrompt = `Eres **Vaireo**, el asistente experto en el ecosistema de startups agroalimentarias de España.

## TU CONOCIMIENTO
Tienes acceso a una base de datos de ${stats.total} startups españolas del sector FoodTech, AgTech y sostenibilidad.

## DATOS ENCONTRADOS PARA ESTA CONSULTA
${dbSection}
${webSection}

## ESTADÍSTICAS DEL ECOSISTEMA
- Total startups: ${stats.total}
- Principales verticales: ${stats.verticals.slice(0, 5).map(v => v.name).join(", ")}
- Principales regiones: ${stats.regions.slice(0, 5).map(r => r.name).join(", ")}

## CONTEXTO ADICIONAL
${startupsContext.substring(0, 2000)}

## INSTRUCCIONES
1. **Siempre responde en español**
2. **Usa los datos encontrados** - cita las startups específicas de los resultados
3. **Si hay resultados web**, menciona que encontraste información complementaria
4. **Sé conciso pero informativo** - proporciona valor real
5. **Sugiere startups relacionadas** si es relevante`

    // Usar AI SDK v5 con streamText (sin tools para simplicidad)
    const result = streamText({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...validMessages,
      ],
      temperature: 0.7,
      maxTokens: 1500,
    })

    // Retornar respuesta en streaming de texto
    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[v0] Error en API chat:", error)
    return new Response(
      JSON.stringify({
        error: "Error al procesar la solicitud",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
