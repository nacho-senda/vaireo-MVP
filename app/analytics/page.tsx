"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AnalyticsOverview } from "@/components/analytics-overview"
import { FundingCharts } from "@/components/funding-charts"
import { AnalyticsTables } from "@/components/analytics-tables"
import { AnalyticsInsights } from "@/components/analytics-insights"
import { ChatBubble } from "@/components/chat-bubble"

interface AnalyticsData {
  totalStartups: number
  totalFunding: number
  averageFunding: number
  fundingByStage: { stage: string; amount: number; count: number }[]
  fundingByYear: { year: number; amount: number; count: number }[]
  locationDistribution: { location: string; count: number; percentage: number }[]
  technologyDistribution: { technology: string; count: number; percentage: number }[]
  fundingTrends: { year: number; cumulativeFunding: number; cumulativeStartups: number }[]
  topFundedStartups: { name: string; funding: number; stage: string; location: string }[]
  recentStartups: { name: string; year: number; funding: number; location: string }[]
}

interface Startup {
  [key: string]: any
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)
        const { cargarStartups } = await import("@/app/actions/load-startups")
        const result = await cargarStartups()
        
        if (result.success && result.data) {
          const calculatedData = calculateAnalyticsFromData(result.data)
          setAnalyticsData(calculatedData)
        } else {
          setError("No se pudieron cargar los datos")
        }
      } catch (err) {
        console.error("[v0] Error loading analytics:", err)
        setError("Error al cargar los datos de análisis")
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  function calculateAnalyticsFromData(startups: Startup[]): AnalyticsData {
    const totalStartups = startups.length
    
    // Handle empty data case
    if (totalStartups === 0) {
      return {
        totalStartups: 0,
        totalFunding: 0,
        averageFunding: 0,
        fundingByStage: [],
        fundingByYear: [],
        locationDistribution: [],
        technologyDistribution: [],
        fundingTrends: [],
        topFundedStartups: [],
        recentStartups: [],
      }
    }

    // Parse funding amounts from new Google Sheets format
    const getFunding = (startup: Startup): number => {
      const funding = startup["Inversión total (€)"] || startup.totalFunding || "0"
      const fundingStr = String(funding).replace(/[^\d.]/g, "")
      const value = parseFloat(fundingStr) || 0
      
      // If the value is small (< 1000), it's likely in millions already
      // Convert to actual euros for calculations
      return value < 1000 ? value * 1000000 : value
    }

    const totalFunding = startups.reduce((sum, startup) => sum + getFunding(startup), 0)
    const averageFunding = totalFunding / totalStartups

    // Location distribution
    const locationMap = new Map<string, number>()
    startups.forEach((startup) => {
      const location = startup["Región (CCAA)"] || startup.location || "Desconocido"
      locationMap.set(location, (locationMap.get(location) || 0) + 1)
    })
    const locationDistribution = Array.from(locationMap.entries())
      .map(([location, count]) => ({
        location,
        count,
        percentage: (count / totalStartups) * 100,
      }))
      .sort((a, b) => b.count - a.count)

    // Technology distribution
    const techMap = new Map<string, number>()
    startups.forEach((startup) => {
      const tech = startup["Tecnología"] || startup.technologyFocus
      const techs = Array.isArray(tech) ? tech : (tech ? String(tech).split(",").map(t => t.trim()) : [])
      techs.forEach((t) => {
        if (t) techMap.set(t, (techMap.get(t) || 0) + 1)
      })
    })
    const technologyDistribution = Array.from(techMap.entries())
      .map(([technology, count]) => ({
        technology,
        count,
        percentage: (count / totalStartups) * 100,
      }))
      .sort((a, b) => b.count - a.count)

    // Funding by stage
    const stageMap = new Map<string, { amount: number; count: number }>()
    startups.forEach((startup) => {
      const stage = startup["Nivel de madurez"] || startup.fundingStage || "Desconocido"
      const current = stageMap.get(stage) || { amount: 0, count: 0 }
      stageMap.set(stage, {
        amount: current.amount + getFunding(startup),
        count: current.count + 1,
      })
    })
    const fundingByStage = Array.from(stageMap.entries()).map(([stage, data]) => ({
      stage,
      amount: data.amount,
      count: data.count,
    }))

    // Funding by year
    const yearMap = new Map<number, { amount: number; count: number }>()
    startups.forEach((startup) => {
      const year = parseInt(String(startup["Año"] || startup.foundingYear || new Date().getFullYear()))
      const current = yearMap.get(year) || { amount: 0, count: 0 }
      yearMap.set(year, {
        amount: current.amount + getFunding(startup),
        count: current.count + 1,
      })
    })
    const fundingByYear = Array.from(yearMap.entries())
      .map(([year, data]) => ({
        year,
        amount: data.amount,
        count: data.count,
      }))
      .sort((a, b) => a.year - b.year)

    // Top funded startups
    const topFundedStartups = [...startups]
      .sort((a, b) => getFunding(b) - getFunding(a))
      .slice(0, 10)
      .map((startup) => ({
        name: startup.Nombre || startup.name || "Sin nombre",
        funding: getFunding(startup),
        stage: startup["Nivel de madurez"] || startup.fundingStage || "Desconocido",
        location: startup["Región (CCAA)"] || startup.location || "Desconocido",
      }))

    // Recent startups
    const currentYear = new Date().getFullYear()
    const recentStartups = startups
      .filter((startup) => {
        const year = parseInt(String(startup["Año"] || startup.foundingYear || 0))
        return year >= currentYear - 5
      })
      .sort((a, b) => {
        const yearA = parseInt(String(a["Año"] || a.foundingYear || 0))
        const yearB = parseInt(String(b["Año"] || b.foundingYear || 0))
        return yearB - yearA
      })
      .slice(0, 10)
      .map((startup) => ({
        name: startup.Nombre || startup.name || "Sin nombre",
        year: parseInt(String(startup["Año"] || startup.foundingYear || currentYear)),
        funding: getFunding(startup),
        location: startup["Región (CCAA)"] || startup.location || "Desconocido",
      }))

    // Funding trends
    const fundingTrends: { year: number; cumulativeFunding: number; cumulativeStartups: number }[] = []
    let cumulativeFunding = 0
    let cumulativeStartups = 0

    fundingByYear.forEach((yearData) => {
      cumulativeStartups += yearData.count
      cumulativeFunding += yearData.amount
      fundingTrends.push({
        year: yearData.year,
        cumulativeFunding,
        cumulativeStartups,
      })
    })

    return {
      totalStartups,
      totalFunding,
      averageFunding,
      fundingByStage,
      fundingByYear,
      locationDistribution,
      technologyDistribution,
      fundingTrends,
      topFundedStartups,
      recentStartups,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-muted-foreground">Cargando datos de análisis...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-destructive">{error || "Error al cargar los datos"}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance">Análisis del Ecosistema</h1>
            <p className="text-sm md:text-base text-muted-foreground text-balance max-w-2xl mx-auto">
              Métricas clave, tendencias y análisis del sector agroalimentario español.
            </p>
          </div>

          <AnalyticsOverview data={analyticsData} />
          <FundingCharts data={analyticsData} />
          <AnalyticsInsights data={analyticsData} />
          <AnalyticsTables data={analyticsData} />
        </div>
      </main>

      <Footer />
      <ChatBubble />
    </div>
  )
}
