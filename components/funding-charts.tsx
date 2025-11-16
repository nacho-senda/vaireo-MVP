"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { formatFunding } from "@/lib/startups-data"
import type { AnalyticsData } from "@/lib/analytics-data"

interface FundingChartsProps {
  data: AnalyticsData
}

const FUNDING_COLORS = [
  "hsl(var(--chart-1))", // Azul para financiación
  "hsl(var(--chart-8))", // Índigo para etapas avanzadas
  "hsl(var(--chart-4))", // Púrpura para innovación
  "hsl(var(--chart-3))", // Naranja para crecimiento
  "hsl(var(--chart-2))", // Verde para sostenibilidad
]

const LOCATION_COLORS = [
  "hsl(var(--chart-5))", // Teal base para geografía
  "hsl(var(--chart-2))", // Verde
  "hsl(var(--chart-1))", // Azul
  "hsl(var(--chart-3))", // Naranja
  "hsl(var(--chart-4))", // Púrpura
  "hsl(var(--chart-6))", // Rosa
  "hsl(var(--chart-7))", // Amarillo
]

const TECH_COLORS = [
  "hsl(var(--chart-3))", // Naranja base para tecnología
  "hsl(var(--chart-4))", // Púrpura
  "hsl(var(--chart-1))", // Azul
  "hsl(var(--chart-2))", // Verde
  "hsl(var(--chart-5))", // Teal
  "hsl(var(--chart-6))", // Rosa
  "hsl(var(--chart-7))", // Amarillo
  "hsl(var(--chart-8))", // Índigo
]

const TREND_COLOR = "hsl(var(--chart-2))" // Verde para tendencias de crecimiento

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function FundingCharts({ data }: FundingChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Funding by Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Financiación por Etapa</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.fundingByStage}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <YAxis
                tickFormatter={(value) => formatFunding(value)}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip formatter={(value: number) => formatFunding(value)} />} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {data.fundingByStage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={FUNDING_COLORS[index % FUNDING_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Funding Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Financiación Acumulada</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.fundingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <YAxis
                tickFormatter={(value) => formatFunding(value)}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip formatter={(value: number) => formatFunding(value)} />} />
              <Line
                type="monotone"
                dataKey="cumulativeFunding"
                stroke={TREND_COLOR}
                strokeWidth={3}
                dot={{ fill: TREND_COLOR, r: 4 }}
                activeDot={{ r: 6, fill: TREND_COLOR }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Location Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución Geográfica</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.locationDistribution.slice(0, 7)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ location, percentage }) => `${location} (${percentage.toFixed(1)}%)`}
                outerRadius={90}
                dataKey="count"
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {data.locationDistribution.slice(0, 7).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={LOCATION_COLORS[index % LOCATION_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Technology Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Tecnologías Más Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.technologyDistribution.slice(0, 8)} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="technology"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: "Cantidad", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={50}>
                {data.technologyDistribution.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TECH_COLORS[index % TECH_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
