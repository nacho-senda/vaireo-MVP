import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Building2, MapPin, Zap } from 'lucide-react'
import { formatFunding } from "@/lib/utils/formatting"

interface AnalyticsData {
  totalStartups: number
  totalFunding: number
  averageFunding: number
  locationDistribution: { location: string; count: number; percentage: number }[]
}

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{stat.description}</p>
            <div className="text-[10px] text-primary mt-1 font-medium">{stat.trend}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
