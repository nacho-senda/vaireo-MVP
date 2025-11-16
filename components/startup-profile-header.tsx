import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, MapPin, Calendar, Users, Building, Mail, Linkedin, Twitter } from 'lucide-react'
import type { Startup } from "@/lib/startups-data"
import { formatFunding } from "@/lib/startups-data"

interface StartupProfileHeaderProps {
  startup: Startup
}

export function StartupProfileHeader({ startup }: StartupProfileHeaderProps) {
  const name = startup.Nombre || startup.name || 'Sin nombre'
  const description = startup.Descripción || startup.description || 'Sin descripción'
  const foundingYear = startup.Año || startup.foundingYear || 'N/A'
  const headquarters = startup['Región (CCAA)'] || startup.headquarters || 'N/A'
  const employees = startup['Empleados actuales'] || startup.employees || 'N/A'
  const totalFunding = startup['Inversión total (€)'] ? formatFunding(startup['Inversión total (€)']) : (startup.totalFunding || 'N/A')
  const fundingStage = startup['Nivel de madurez'] || startup.fundingStage || 'N/A'
  const websiteUrl = startup['Web de la startup'] || startup.websiteUrl || '#'
  const email = startup['Email de contacto'] || startup.contactInfo?.email || null
  const linkedin = startup.LinkedIn || startup.contactInfo?.linkedin || null
  const twitter = startup.Twitter || startup.contactInfo?.twitter || null
  const technologies = startup.Tecnología ? String(startup.Tecnología).split(',').map(t => t.trim()) : (startup.industries || [])

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">{name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Fundada</span>
            </div>
            <p className="text-lg font-semibold">{foundingYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Ubicación</span>
            </div>
            <p className="text-lg font-semibold">{headquarters}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Empleados</span>
            </div>
            <p className="text-lg font-semibold">{employees}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Financiación</span>
            </div>
            <p className="text-lg font-semibold">{totalFunding}</p>
            <Badge variant="secondary" className="mt-1">
              {fundingStage}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {websiteUrl && websiteUrl !== '#' && (
          <Button asChild>
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Sitio Web
            </a>
          </Button>
        )}

        {email && (
          <Button variant="outline" asChild>
            <a href={`mailto:${email}`}>
              <Mail className="h-4 w-4 mr-2" />
              Contactar
            </a>
          </Button>
        )}

        {linkedin && (
          <Button variant="outline" asChild>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </a>
          </Button>
        )}

        {twitter && (
          <Button variant="outline" asChild>
            <a href={twitter} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </a>
          </Button>
        )}
      </div>

      {/* Technologies */}
      {technologies.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Tecnologías y Sectores</h3>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
