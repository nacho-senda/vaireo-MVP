"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Legend,
} from "recharts"
import { formatFunding } from "@/lib/utils/formatting"

interface AnalyticsData {
  fundingByStage: { stage: string; amount: number; count: number }[]
  fundingTrends: { year: number; cumulativeFunding: number; cumulativeStartups: number }[]
  locationDistribution: { location: string; count: number; percentage: number }[]
  technologyDistribution: { technology: string; count: number; percentage: number }[]
}

interface FundingChartsProps {
  data: AnalyticsData
}

// Colores vibrantes para gráficos
const FUNDING_COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F97316", "#22C55E"]
const LOCATION_COLORS = ["#14B8A6", "#22C55E", "#3B82F6", "#F97316", "#8B5CF6", "#EC4899", "#EAB308"]
const TECH_COLORS = ["#F97316", "#8B5CF6", "#3B82F6", "#22C55E", "#14B8A6", "#EC4899"]
const TREND_COLOR = "#22C55E"
const GRID_COLOR = "#e5e7eb"
const AXIS_COLOR = "#6b7280"

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{label || payload[0]?.payload?.location || payload[0]?.payload?.technology}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color || entry.payload?.fill }}>
            {entry.name}: <span className="font-medium">{formatter ? formatter(entry.value) : entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Leyenda para gráficos de barras
const BarLegend = ({ items }: { items: { name: string; color: string }[] }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
        <span className="text-xs text-zinc-600 dark:text-zinc-400">{item.name}</span>
      </div>
    ))}
  </div>
)

// Leyenda para gráficos circulares
const PieLegend = ({ payload }: any) => {
  if (!payload) return null
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[11px] text-zinc-600 dark:text-zinc-400">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function FundingCharts({ data }: FundingChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Financiación por Etapa */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Financiación por Etapa</CardTitle>
          <CardDescription>Capital invertido según fase de desarrollo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.fundingByStage} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fill: AXIS_COLOR, fontSize: 12 }}
                  tickLine={{ stroke: AXIS_COLOR }}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis
                  tickFormatter={(v) => formatFunding(v)}
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  tickLine={{ stroke: AXIS_COLOR }}
                  axisLine={{ stroke: GRID_COLOR }}
                  width={70}
                />
                <Tooltip content={<CustomTooltip formatter={(v: number) => formatFunding(v)} />} />
                <Bar dataKey="amount" name="Financiación" radius={[6, 6, 0, 0]}>
                  {data.fundingByStage.map((_, i) => (
                    <Cell key={i} fill={FUNDING_COLORS[i % FUNDING_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <BarLegend items={data.fundingByStage.map((e, i) => ({ name: e.stage, color: FUNDING_COLORS[i % FUNDING_COLORS.length] }))} />
        </CardContent>
      </Card>

      {/* Tendencia de Financiación */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Tendencia de Financiación</CardTitle>
          <CardDescription>Evolución del capital total invertido por año</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.fundingTrends} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: AXIS_COLOR, fontSize: 12 }}
                  tickLine={{ stroke: AXIS_COLOR }}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis
                  tickFormatter={(v) => formatFunding(v)}
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  tickLine={{ stroke: AXIS_COLOR }}
                  axisLine={{ stroke: GRID_COLOR }}
                  width={70}
                />
                <Tooltip content={<CustomTooltip formatter={(v: number) => formatFunding(v)} />} />
                <Legend 
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={() => <span className="text-xs text-zinc-600 dark:text-zinc-400">Financiación Acumulada</span>}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeFunding"
                  name="Financiación"
                  stroke={TREND_COLOR}
                  strokeWidth={3}
                  dot={{ fill: TREND_COLOR, r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, fill: TREND_COLOR, stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Distribución Geográfica */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Distribución Geográfica</CardTitle>
          <CardDescription>Startups por comunidad autónoma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.locationDistribution.slice(0, 7)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="count"
                  nameKey="location"
                  strokeWidth={3}
                  stroke="#fff"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.locationDistribution.slice(0, 7).map((_, i) => (
                    <Cell key={i} fill={LOCATION_COLORS[i % LOCATION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<PieLegend />} verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tecnologías Populares */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Tecnologías Populares</CardTitle>
          <CardDescription>Principales tecnologías del ecosistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data.technologyDistribution.slice(0, 6)} 
                layout="vertical" 
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
                <XAxis 
                  type="number" 
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  tickLine={{ stroke: AXIS_COLOR }}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis 
                  type="category" 
                  dataKey="technology" 
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Startups" radius={[0, 6, 6, 0]} barSize={20}>
                  {data.technologyDistribution.slice(0, 6).map((_, i) => (
                    <Cell key={i} fill={TECH_COLORS[i % TECH_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
