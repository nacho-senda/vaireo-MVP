// Tipos compartidos para Startups
export interface Startup {
  ID?: string
  Nombre: string
  Descripción: string
  "Región (CCAA)": string
  Año: string
  Vertical: string
  Subvertical: string
  Tecnología: string
  Web?: string
  Fuente?: string
  "Nivel de madurez"?: string
  "Inversión total (€)"?: string
  "Tipo de impacto"?: string
  "Diversidad del equipo"?: string
  compatibilityScore?: number
  [key: string]: any
}

// Función para formatear financiación
export function formatFunding(amount: string | number | undefined): string {
  if (!amount) return "N/A"
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^\d.]/g, "")) : amount
  if (isNaN(num)) return "N/A"
  if (num >= 1000000) return `€${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `€${(num / 1000).toFixed(1)}K`
  return `€${num.toFixed(0)}`
}

// Función para parsear números de financiación
export function getFundingAmount(fundingString: string | number | undefined): number {
  if (!fundingString) return 0
  const fundingStr = String(fundingString).replace(/\D/g, "")
  const fundingAmount = parseFloat(fundingStr)
  return isNaN(fundingAmount) ? 0 : fundingAmount
}
