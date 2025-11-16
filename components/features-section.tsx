import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Search, BarChart3, Network, Shield, Lightbulb } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Database,
      title: "Información Centralizada",
      description: "Base de datos completa de startups, tecnologías y actores del sector agroalimentario español.",
    },
    {
      icon: Search,
      title: "Búsqueda Inteligente",
      description:
        "Encuentra startups y tecnologías específicas con filtros avanzados por ubicación, financiación y enfoque.",
    },
    {
      icon: BarChart3,
      title: "Análisis del Sector",
      description: "Dashboards interactivos con métricas clave, tendencias de financiación y mapas de innovación.",
    },
    {
      icon: Network,
      title: "Red de Colaboración",
      description: "Conecta con inversores, empresas establecidas, investigadores y otros actores clave.",
    },
    {
      icon: Shield,
      title: "Datos Verificados",
      description: "Información curada y actualizada regularmente para garantizar precisión y relevancia.",
    },
    {
      icon: Lightbulb,
      title: "Insights Estratégicos",
      description: "Recomendaciones personalizadas basadas en análisis de datos y tendencias del mercado.",
    },
  ]

  return (
    <section className="py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Funcionalidades clave</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            Herramientas diseñadas para optimizar la toma de decisiones y fomentar la innovación
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
