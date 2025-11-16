import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, MapPin, Calendar, TrendingUp, Target, FolderPlus, Building2, Lightbulb } from 'lucide-react'
import Link from "next/link"
import type { Startup } from "@/lib/startups-data"
import { formatFunding } from "@/lib/startups-data"

interface StartupCardProps {
  startup: Startup
  compatibilityScore?: number
  onAddToProject?: (startup: Startup) => void
}

export function StartupCard({ startup, compatibilityScore, onAddToProject }: StartupCardProps) {
  const startupId = startup.ID || startup.Nombre.toLowerCase().replace(/\s+/g, "-")

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl line-clamp-1">{startup.Nombre}</CardTitle>
          <div className="flex flex-col gap-1 items-end">
            <Badge variant="secondary" className="ml-2 shrink-0">
              {startup["Nivel de madurez"] || "N/A"}
            </Badge>
            {compatibilityScore !== undefined && compatibilityScore > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <Target className="h-3 w-3 text-primary" />
                <span className="text-primary font-medium">{compatibilityScore}%</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{startup.Descripción}</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 mb-4">
          {startup["Región (CCAA)"] && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 shrink-0" />
              {startup["Región (CCAA)"]}
            </div>
          )}

          {startup.Año && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 shrink-0" />
              Fundada en {startup.Año}
            </div>
          )}

          {startup["Inversión total (€)"] && (
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-2 shrink-0" />
              {formatFunding(startup["Inversión total (€)"])}
            </div>
          )}

          {startup.Vertical && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 mr-2 shrink-0" />
              {startup.Vertical}
            </div>
          )}

          {startup["ODS principal"] && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Lightbulb className="h-4 w-4 mr-2 shrink-0" />
              {startup["ODS principal"]}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {startup.Tecnología && (
            <Badge variant="outline" className="text-xs">
              {startup.Tecnología}
            </Badge>
          )}
          {startup.Subvertical && (
            <Badge variant="outline" className="text-xs">
              {startup.Subvertical}
            </Badge>
          )}
          {startup["Tipo de impacto"] && (
            <Badge variant="default" className="text-xs">
              {startup["Tipo de impacto"]}
            </Badge>
          )}
        </div>

        {compatibilityScore !== undefined && compatibilityScore > 0 && (
          <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-primary">Compatibilidad</span>
              <span className="text-xs font-bold text-primary">{compatibilityScore}%</span>
            </div>
            <div className="w-full bg-primary/20 rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${compatibilityScore}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto flex gap-2">
          {startup.Web && (
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
              <a href={startup.Web} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Sitio Web
              </a>
            </Button>
          )}
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/startups/${startupId}`}>Ver Perfil</Link>
          </Button>
        </div>
        
        {onAddToProject && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={(e) => {
              e.preventDefault()
              onAddToProject(startup)
            }}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Añadir a Proyecto
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
