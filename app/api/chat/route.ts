import { consumeStream, convertToModelMessages, streamText, tool, type UIMessage } from "ai"
import { z } from "zod"
import { getStartups, type Startup } from "@/lib/startups-data"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-4o-mini",
    prompt,
    abortSignal: req.signal,
    system: `Eres un asistente experto del ecosistema agroalimentario español, especializado en la plataforma Vaireo. 

Tu conocimiento incluye:
- Startups agroalimentarias españolas y sus tecnologías
- Análisis de tendencias del sector agroalimentario
- Información sobre financiación y rondas de inversión
- Tecnologías innovadoras en agricultura y alimentación
- Conexiones entre inversores, mentores y emprendedores

Características de tu personalidad:
- Profesional pero cercano
- Respuestas claras y concisas
- Enfocado en datos y análisis cuando sea relevante
- Proactivo en sugerir recursos de la plataforma Vaireo

Cuando te pregunten sobre startups específicas, usa la herramienta searchStartups para buscar información actualizada.

Siempre responde en español y mantén un tono profesional pero amigable.`,
    tools: {
      searchStartups: tool({
        description:
          "Busca startups en la base de datos. Puedes buscar por nombre, vertical, tecnología, región o cualquier término relacionado. También puedes obtener todas las startups si no especificas ningún término.",
        inputSchema: z.object({
          searchTerm: z.string().optional().describe("Término de búsqueda (nombre, vertical, tecnología, etc.)"),
          vertical: z.string().optional().describe("Filtrar por vertical específico"),
          region: z.string().optional().describe("Filtrar por región específica"),
        }),
        execute: async ({ searchTerm, vertical, region }) => {
          const allStartups = getStartups()

          let filtered = allStartups

          if (searchTerm) {
            const term = searchTerm.toLowerCase()
            filtered = filtered.filter(
              (s) =>
                s.Nombre.toLowerCase().includes(term) ||
                s.Descripción.toLowerCase().includes(term) ||
                s.Vertical.toLowerCase().includes(term) ||
                s.Subvertical.toLowerCase().includes(term) ||
                s.Tecnología.toLowerCase().includes(term)
            )
          }

          if (vertical) {
            filtered = filtered.filter((s) => s.Vertical.toLowerCase().includes(vertical.toLowerCase()))
          }

          if (region) {
            filtered = filtered.filter((s) => s["Región (CCAA)"].toLowerCase().includes(region.toLowerCase()))
          }

          // Limitar resultados a 10 para no sobrecargar el contexto
          const results = filtered.slice(0, 10)

          return {
            total: filtered.length,
            showing: results.length,
            startups: results.map((s) => ({
              id: s.ID,
              nombre: s.Nombre,
              descripcion: s.Descripción,
              region: s["Región (CCAA)"],
              año: s.Año,
              vertical: s.Vertical,
              subvertical: s.Subvertical,
              tecnologia: s.Tecnología,
              ods_principal: s["ODS principal"],
              tipo_de_impacto: s["Tipo de impacto"],
              nivel_de_madurez: s["Nivel de madurez"],
              inversion_total: s["Inversión total (€)"],
              website: s.Web,
              contacto: s.Contacto,
            })),
          }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("[v0] Chat aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
