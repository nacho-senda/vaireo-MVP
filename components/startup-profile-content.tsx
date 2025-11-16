import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Users, Target, AlertTriangle, CheckCircle, Calendar, Mail, Phone } from 'lucide-react'
import type { Startup } from "@/lib/startups-data"

interface StartupProfileContentProps {
  startup: Startup
}

export function StartupProfileContent({ startup }: StartupProfileContentProps) {
  const businessModel = startup['Modelo de negocio'] || startup.businessModel || 'No disponible'
  const impactAreas = startup['Impacto'] ? String(startup['Impacto']).split(',').map(i => i.trim()) : []
  const sdgs = startup['ODS principal'] ? String(startup['ODS principal']).split(',').map(s => s.trim()) : []
  const founders = startup['Fundadores'] ? String(startup['Fundadores']).split(',').map(f => f.trim()) : (Array.isArray(startup.foundedBy) ? startup.foundedBy : [])
  const email = startup['Email de contacto'] || startup.contactInfo?.email || null
  const phone = startup['Teléfono de contacto'] || startup.contactInfo?.phone || null
  
  // Safe access to optional arrays and objects
  const keyMetrics = startup.keyMetrics || {}
  const milestones = Array.isArray(startup.milestones) ? startup.milestones : []
  const competitiveAdvantage = Array.isArray(startup.competitiveAdvantage) ? startup.competitiveAdvantage : []
  const challenges = Array.isArray(startup.challenges) ? startup.challenges : []
  const futureGoals = Array.isArray(startup.futureGoals) ? startup.futureGoals : []
  const team = Array.isArray(startup.team) ? startup.team : []
  const investors = Array.isArray(startup.investors) ? startup.investors : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Business Model */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Modelo de Negocio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{businessModel}</p>
          </CardContent>
        </Card>

        {/* Impact Areas */}
        {impactAreas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Áreas de Impacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {impactAreas.map((impact, index) => (
                  <Badge key={index} variant="secondary">
                    {impact}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* SDGs */}
        {sdgs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Objetivos de Desarrollo Sostenible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sdgs.map((sdg, index) => (
                  <Badge key={index} variant="outline">
                    {sdg}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        {Object.keys(keyMetrics).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Métricas Clave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyMetrics.revenue && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ingresos</p>
                    <p className="text-lg font-semibold">{keyMetrics.revenue}</p>
                  </div>
                )}
                {keyMetrics.customers && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                    <p className="text-lg font-semibold">{keyMetrics.customers}</p>
                  </div>
                )}
                {keyMetrics.partnerships && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Partnerships</p>
                    <p className="text-lg font-semibold">{keyMetrics.partnerships}</p>
                  </div>
                )}
                {keyMetrics.patents && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patentes</p>
                    <p className="text-lg font-semibold">{keyMetrics.patents}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Milestones */}
        {milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Hitos Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Badge variant="outline">{milestone.date}</Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Competitive Advantage */}
        {competitiveAdvantage.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Ventajas Competitivas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {competitiveAdvantage.map((advantage, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{advantage}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Challenges */}
        {challenges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Desafíos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Future Goals */}
        {futureGoals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos Futuros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {futureGoals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{goal}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Team */}
        {team.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipo Fundador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investors */}
        {investors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Inversores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {investors.map((investor, index) => (
                  <Badge key={index} variant="secondary" className="mr-1 mb-1">
                    {investor}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Founders */}
        {founders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fundadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {founders.map((founder, index) => (
                  <p key={index} className="text-sm">
                    {founder}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${email}`} className="text-sm hover:underline">
                  {email}
                </a>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${phone}`} className="text-sm hover:underline">
                  {phone}
                </a>
              </div>
            )}
            {(email || phone) && <Separator />}
            <div className="text-xs text-muted-foreground">
              Para oportunidades de colaboración o inversión, contacta directamente con la empresa.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
