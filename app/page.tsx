import { Navigation } from "@/components/navigation"
import { ChatInterface } from "@/components/chat-interface"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Chat */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">
              Ecosistema Agroalimentario
              <span className="text-primary block">Español</span>
            </h1>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
              Pregunta lo que necesites sobre startups, tecnologías innovadoras y actores clave del sector
              agroalimentario español.
            </p>
          </div>

          {/* Chat Interface */}
          <ChatInterface />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">20+</div>
              <div className="text-muted-foreground">Startups Registradas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">€50M+</div>
              <div className="text-muted-foreground">Financiación Total</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">15+</div>
              <div className="text-muted-foreground">Ciudades Representadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transformando el Sector Agroalimentario</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conectamos startups, inversores y actores clave para impulsar la innovación sostenible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Directorio de Startups</h3>
              <p className="text-muted-foreground">Explora startups innovadoras del sector agroalimentario español</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Análisis de Datos</h3>
              <p className="text-muted-foreground">Insights y métricas clave del ecosistema agroalimentario</p>
            </div>

            <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Red de Colaboración</h3>
              <p className="text-muted-foreground">Conecta con inversores, mentores y socios estratégicos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-primary mb-2">Vaireo</h3>
            <p className="text-muted-foreground">Transformando el ecosistema agroalimentario español</p>
          </div>
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">© 2025 Vaireo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
