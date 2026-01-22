import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatFunding } from "@/lib/utils/formatting"

interface AnalyticsData {
  topFundedStartups: { name: string; funding: number; stage: string; location: string }[]
  recentStartups: { name: string; year: number; funding: number; location: string }[]
}

interface AnalyticsTablesProps {
  data: AnalyticsData
}

export function AnalyticsTables({ data }: AnalyticsTablesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top Funded Startups */}
      <Card className="flex flex-col">
        <CardHeader className="pb-2 space-y-1">
          <CardTitle className="text-base">Startups con Mayor Financiación</CardTitle>
          <CardDescription className="text-xs">Empresas con más capital levantado</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <div className="overflow-auto max-h-[320px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Empresa</TableHead>
                  <TableHead className="text-xs">Financiación</TableHead>
                  <TableHead className="text-xs">Etapa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topFundedStartups.slice(0, 6).map((startup, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-sm py-2">{startup.name}</TableCell>
                    <TableCell className="text-sm py-2">{formatFunding(startup.funding)}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{startup.stage}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Startups */}
      <Card className="flex flex-col">
        <CardHeader className="pb-2 space-y-1">
          <CardTitle className="text-base">Startups Más Recientes</CardTitle>
          <CardDescription className="text-xs">Fundadas en los últimos 5 años</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <div className="overflow-auto max-h-[320px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Empresa</TableHead>
                  <TableHead className="text-xs">Año</TableHead>
                  <TableHead className="text-xs">Financiación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentStartups.slice(0, 6).map((startup, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-sm py-2">{startup.name}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{startup.year}</Badge>
                    </TableCell>
                    <TableCell className="text-sm py-2">{formatFunding(startup.funding)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
