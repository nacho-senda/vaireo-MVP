import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  const stats = [
    {
      value: "20+",
      label: "Startups Registradas",
      description: "Empresas innovadoras del sector agroalimentario",
    },
    {
      value: "€95M+",
      label: "Financiación Total",
      description: "Capital invertido en el ecosistema",
    },
    {
      value: "8",
      label: "Ciudades Principales",
      description: "Hubs de innovación agroalimentaria",
    },
    {
      value: "15+",
      label: "Tecnologías Clave",
      description: "Áreas de enfoque tecnológico",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">El ecosistema en números</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
            Datos actualizados sobre el estado del sector agroalimentario español
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
