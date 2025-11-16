import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center gradient-mesh">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              El ecosistema agroalimentario español
              <span className="text-primary block">centralizado e inteligente</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl text-balance">
              Transformamos la fragmentación de información en un ecosistema centralizado que optimiza la toma de
              decisiones estratégicas y fomenta la colaboración entre actores clave del sector.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base" asChild>
              <Link href="/startups">
                Explorar Startups
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base bg-transparent" asChild>
              <Link href="/analytics">Ver Análisis del Sector</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
            <div className="flex flex-col items-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Decisiones Basadas en Datos</h3>
              <p className="text-sm text-muted-foreground text-center">
                Optimiza estrategias con información centralizada y análisis inteligente
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Colaboración Estratégica</h3>
              <p className="text-sm text-muted-foreground text-center">
                Conecta con actores clave y fomenta sinergias en el sector
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Innovación Sostenible</h3>
              <p className="text-sm text-muted-foreground text-center">
                Impulsa la adopción de tecnologías innovadoras y sostenibles
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
