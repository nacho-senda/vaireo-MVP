import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatFunding } from "@/lib/startups-data"
import type { AnalyticsData } from "@/lib/analytics-data"

interface AnalyticsTablesProps {
  data: AnalyticsData
}

export function AnalyticsTables({ data }: AnalyticsTablesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Funded Startups */}
      <Card>
        <CardHeader>
          <CardTitle>Startups con Mayor Financiación</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Financiación</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Ubicación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topFundedStartups.slice(0, 8).map((startup, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{startup.name}</TableCell>
                  <TableCell>{formatFunding(startup.funding)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{startup.stage}</Badge>
                  </TableCell>
                  <TableCell>{startup.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Startups */}
      <Card>
        <CardHeader>
          <CardTitle>Startups Más Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Financiación</TableHead>
                <TableHead>Ubicación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentStartups.slice(0, 8).map((startup, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{startup.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{startup.year}</Badge>
                  </TableCell>
                  <TableCell>{formatFunding(startup.funding)}</TableCell>
                  <TableCell>{startup.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
