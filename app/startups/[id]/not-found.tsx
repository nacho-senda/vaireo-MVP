import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container px-4 md:px-6 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Startup no encontrada</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            La startup que buscas no existe o ha sido movida. Explora nuestro directorio completo para encontrar otras
            empresas innovadoras.
          </p>
          <Button asChild>
            <Link href="/startups">Volver al Directorio</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
