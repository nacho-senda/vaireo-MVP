import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, MapPin, Zap, AlertCircle } from 'lucide-react'
import type { AnalyticsData } from "@/lib/analytics-data"

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
      type: "success" as const,
    },
    {
      title: "Tecnología Dominante",
      description: `${topTechnology.technology} es el enfoque más popular con ${topTechnology.count} startups`,
      icon: Zap,
      type: "info" as const,
    },
    {
      title: "Etapa de Financiación Común",
      description: `${dominantStage.stage} es la etapa más común con ${dominantStage.count} startups`,
      icon: TrendingUp,
      type: "warning" as const,
    },
    {
      title: "Oportunidad de Crecimiento",
      description: "El sector muestra potencial para más inversión en etapas tempranas",
      icon: AlertCircle,
      type: "info" as const,
    },
  ]

  const getVariantForType = (type: string) => {
    switch (type) {
      case "success":
        return "default"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights del Ecosistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border">
              <div className="flex-shrink-0">
                <insight.icon className="h-5 w-5 text-primary mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">{insight.title}</h4>
                  <Badge variant={getVariantForType(insight.type)} className="text-xs">
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
