// Utilidad para búsqueda web usando DuckDuckGo (100% gratuito, sin API key)

export interface WebSearchResult {
  title: string
  url: string
  snippet: string
}

export async function searchWeb(query: string): Promise<WebSearchResult[]> {
  try {
    // Usamos DuckDuckGo Instant Answer API (gratuita, sin límites)
    const searchQuery = encodeURIComponent(`${query} startup agrifood spain`)
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${searchQuery}&format=json&no_html=1&skip_disambig=1`,
      { 
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Vaireo/1.0'
        }
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    const results: WebSearchResult[] = []

    // Resultado principal (Abstract)
    if (data.Abstract && data.AbstractURL) {
      results.push({
        title: data.Heading || "Resultado principal",
        url: data.AbstractURL,
        snippet: data.Abstract
      })
    }

    // Resultados relacionados
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 5)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(" - ")[0] || "Resultado",
            url: topic.FirstURL,
            snippet: topic.Text
          })
        }
        // Subtopics anidados
        if (topic.Topics && Array.isArray(topic.Topics)) {
          for (const subtopic of topic.Topics.slice(0, 2)) {
            if (subtopic.Text && subtopic.FirstURL) {
              results.push({
                title: subtopic.Text.split(" - ")[0] || "Resultado",
                url: subtopic.FirstURL,
                snippet: subtopic.Text
              })
            }
          }
        }
      }
    }

    return results.slice(0, 8)
  } catch (error) {
    return []
  }
}
