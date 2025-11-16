import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Building2, MapPin, Zap } from 'lucide-react'
import { formatFunding } from "@/lib/startups-data"
import type { AnalyticsData } from "@/lib/analytics-data"

interface AnalyticsOverviewProps {
  data: AnalyticsData
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const stats = [
    {
      title: "Total Startups",
      value: data.totalStartups.toString(),
      description: "Empresas registradas en la plataforma",
      icon: Building2,
      trend: "+15% vs año anterior",
    },
    {
      title: "Financiación Total",
      value: formatFunding(data.totalFunding),
      description: "Capital total invertido en el ecosistema",
      icon: TrendingUp,
      trend: "+28% vs año anterior",
    },
    {
      title: "Financiación Promedio",
      value: formatFunding(data.averageFunding),
      description: "Promedio de financiación por startup",
      icon: Zap,
      trend: "+12% vs año anterior",
    },
    {
      title: "Ciudades Activas",
      value: data.locationDistribution.length.toString(),
      description: "Hubs de innovación agroalimentaria",
      icon: MapPin,
      trend: "Estable",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            <div className="text-xs text-primary mt-2">{stat.trend}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
