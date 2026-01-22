import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, MapPin, Zap, AlertCircle } from 'lucide-react'

interface AnalyticsData {
  locationDistribution: { location: string; count: number; percentage: number }[]
  technologyDistribution: { technology: string; count: number; percentage: number }[]
  fundingByStage: { stage: string; count: number; amount: number }[]
}

interface AnalyticsInsightsProps {
  data: AnalyticsData
}

export function AnalyticsInsights({ data }: AnalyticsInsightsProps) {
  // Generate insights based on data
  const topLocation = data.locationDistribution[0] || { location: "N/A", count: 0, percentage: 0 }
  const topTechnology = data.technologyDistribution[0] || { technology: "N/A", count: 0 }
  const dominantStage = data.fundingByStage.length > 0 
    ? data.fundingByStage.reduce((prev, current) => (prev.count > current.count ? prev : current))
    : { stage: "N/A", count: 0, amount: 0 }

  const insights = [
    {
      title: "Hub Principal de Innovación",
      description: `${topLocation.location} lidera con ${topLocation.count} startups (${topLocation.percentage.toFixed(1)}% del total)`,
      icon: MapPin,
      type: "Ubicación" as const,
    },
    {
      title: "Tecnología Dominante",
      description: `${topTechnology.technology} es el enfoque más popular con ${topTechnology.count} startups`,
      icon: Zap,
      type: "Tecnología" as const,
    },
    {
      title: "Etapa de Financiación Común",
      description: `${dominantStage.stage} es la etapa más común con ${dominantStage.count} startups`,
      icon: TrendingUp,
      type: "Financiación" as const,
    },
    {
      title: "Oportunidad de Crecimiento",
      description: "El sector muestra potencial para más inversión en etapas tempranas",
      icon: AlertCircle,
      type: "Oportunidad" as const,
    },
  ]

  const getVariantForType = (type: string) => {
    switch (type) {
      case "Ubicación":
        return "default"
      case "Tecnología":
        return "secondary"
      case "Financiación":
        return "outline"
      case "Oportunidad":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-base">Insights del Ecosistema</CardTitle>
        <CardDescription className="text-xs">Análisis automático de tendencias clave</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex flex-col p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <insight.icon className="h-4 w-4 text-primary shrink-0" />
                <Badge variant={getVariantForType(insight.type)} className="text-[10px] px-1.5 py-0">
                  {insight.type}
                </Badge>
              </div>
              <h4 className="text-xs font-semibold mb-1 line-clamp-1">{insight.title}</h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2">{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
