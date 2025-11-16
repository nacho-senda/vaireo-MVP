import { startupsData, getFundingAmount } from "./startups-data"

// Analytics interfaces
export interface AnalyticsData {
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

// Calculate analytics from startup data
export const calculateAnalytics = (): AnalyticsData => {
  const totalStartups = startupsData.length
  const totalFunding = startupsData.reduce((sum, startup) => sum + getFundingAmount(startup.totalFunding), 0)
  const averageFunding = totalFunding / totalStartups

  // Funding by stage
  const stageMap = new Map<string, { amount: number; count: number }>()
  startupsData.forEach((startup) => {
    const current = stageMap.get(startup.fundingStage) || { amount: 0, count: 0 }
    stageMap.set(startup.fundingStage, {
      amount: current.amount + getFundingAmount(startup.totalFunding),
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
  startupsData.forEach((startup) => {
    const current = yearMap.get(startup.foundingYear) || { amount: 0, count: 0 }
    yearMap.set(startup.foundingYear, {
      amount: current.amount + getFundingAmount(startup.totalFunding),
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

  // Location distribution
  const locationMap = new Map<string, number>()
  startupsData.forEach((startup) => {
    locationMap.set(startup.location, (locationMap.get(startup.location) || 0) + 1)
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
  startupsData.forEach((startup) => {
    startup.technologyFocus.forEach((tech) => {
      techMap.set(tech, (techMap.get(tech) || 0) + 1)
    })
  })
  const technologyDistribution = Array.from(techMap.entries())
    .map(([technology, count]) => ({
      technology,
      count,
      percentage: (count / startupsData.reduce((sum, s) => sum + s.technologyFocus.length, 0)) * 100,
    }))
    .sort((a, b) => b.count - a.count)

  // Funding trends (cumulative)
  const sortedByYear = [...startupsData].sort((a, b) => a.foundingYear - b.foundingYear)
  const fundingTrends: { year: number; cumulativeFunding: number; cumulativeStartups: number }[] = []
  let cumulativeFunding = 0
  let cumulativeStartups = 0

  const years = Array.from(new Set(sortedByYear.map((s) => s.foundingYear))).sort()
  years.forEach((year) => {
    const yearStartups = sortedByYear.filter((s) => s.foundingYear === year)
    cumulativeStartups += yearStartups.length
    cumulativeFunding += yearStartups.reduce((sum, s) => sum + getFundingAmount(s.totalFunding), 0)

    fundingTrends.push({
      year,
      cumulativeFunding,
      cumulativeStartups,
    })
  })

  // Top funded startups
  const topFundedStartups = [...startupsData]
    .sort((a, b) => getFundingAmount(b.totalFunding) - getFundingAmount(a.totalFunding))
    .slice(0, 10)
    .map((startup) => ({
      name: startup.name,
      funding: getFundingAmount(startup.totalFunding),
      stage: startup.fundingStage,
      location: startup.location,
    }))

  // Recent startups (founded in last 5 years)
  const currentYear = new Date().getFullYear()
  const recentStartups = startupsData
    .filter((startup) => startup.foundingYear >= currentYear - 5)
    .sort((a, b) => b.foundingYear - a.foundingYear)
    .slice(0, 10)
    .map((startup) => ({
      name: startup.name,
      year: startup.foundingYear,
      funding: getFundingAmount(startup.totalFunding),
      location: startup.location,
    }))

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

// Format currency
export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(1)}K`
  }
  return `€${amount.toFixed(0)}`
}

// Format percentage
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`
}
