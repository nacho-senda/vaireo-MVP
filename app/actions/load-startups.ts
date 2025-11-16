"use server"

export async function cargarStartups() {
  try {
    const url = "https://script.google.com/macros/s/AKfycby69VP7XlhhtDboWeWE9MC9alFTVD9DW6EBZP1C_lW8CWHgveocq04ROR3RoV5TvbHr/exec"
    
    console.log("[v0] Loading startups from:", url)
    
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "manual"
    })

    console.log("[v0] Response status:", response.status)

    if (response.status === 302 || response.status === 301) {
      const text = await response.text()
      console.log("[v0] Got redirect HTML, extracting URL...")
      
      // Extract the URL from the HTML redirect
      const match = text.match(/HREF="([^"]+)"/)
      if (match && match[1]) {
        const redirectUrl = match[1].replace(/&amp;/g, '&')
        console.log("[v0] Following redirect to:", redirectUrl)
        
        const redirectResponse = await fetch(redirectUrl, {
          method: "GET",
          cache: "no-store"
        })
        
        const result = await redirectResponse.json()
        
        if (!result.ok || !result.data || !Array.isArray(result.data)) {
          return {
            success: false,
            error: "Invalid data format received",
            data: []
          }
        }

        console.log("[v0] Received data with", result.data?.length || 0, "startups")

        return {
          success: true,
          data: result.data
        }
      }
    }

    const result = await response.json()

    if (!result.ok || !result.data || !Array.isArray(result.data)) {
      return {
        success: false,
        error: "Invalid data format received",
        data: []
      }
    }

    console.log("[v0] Received data with", result.data?.length || 0, "startups")

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error("[v0] Error loading startups:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: []
    }
  }
}
