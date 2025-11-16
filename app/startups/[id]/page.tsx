import { notFound } from 'next/navigation'
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StartupProfileHeader } from "@/components/startup-profile-header"
import { StartupProfileContent } from "@/components/startup-profile-content"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { ChatBubble } from "@/components/chat-bubble"
import type { Startup } from "@/lib/startups-data"

interface StartupProfilePageProps {
  params: {
    id: string
  }
}

async function getStartupData(slug: string): Promise<Startup | null> {
  'use server'
  
  try {
    const { cargarStartups } = await import('@/app/actions/load-startups')
    const result = await cargarStartups()
    
    console.log('[v0] Result:', result)
    
    if (!result.success || !result.data || !Array.isArray(result.data)) {
      console.error('[v0] Invalid data format:', result)
      return null
    }
    
    const startup = result.data.find((s: Startup) => {
      const idOrName = s.ID ? String(s.ID) : (s.Nombre || '')
      const startupSlug = idOrName.toLowerCase().replace(/\s+/g, "-")
      return startupSlug === slug
    })
    
    return startup || null
  } catch (error) {
    console.error('[v0] Error loading startup:', error)
    return null
  }
}

export async function generateMetadata({ params }: StartupProfilePageProps) {
  const startup = await getStartupData(params.id)

  if (!startup) {
    return {
      title: "Startup no encontrada - Vaireo",
    }
  }

  return {
    title: `${startup.Nombre} - Perfil de Startup | Vaireo`,
    description: startup.Descripción,
  }
}

export default async function StartupProfilePage({ params }: StartupProfilePageProps) {
  const startup = await getStartupData(params.id)

  if (!startup) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/startups">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Directorio
              </Link>
            </Button>
          </div>

          <StartupProfileHeader startup={startup} />

          <StartupProfileContent startup={startup} />
        </div>
      </main>

      <Footer />

      <ChatBubble />
    </div>
  )
}
