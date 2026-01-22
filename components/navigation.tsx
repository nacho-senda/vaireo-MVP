"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, Leaf, Settings, User, LogOut, FolderOpen } from 'lucide-react'
import { cn } from "@/lib/utils"
import { RegisterDialog } from "@/components/register-dialog"
import { createClient } from "@/lib/supabase/client"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const isDev = process.env.NODE_ENV === 'development'

  useEffect(() => {
    const supabase = createClient()
    
    // Obtener usuario actual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/startups", label: "Startups" },
    { href: "/analytics", label: "Análisis" },
    { href: "/projects", label: "Proyectos" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Vaireo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems
            .filter((item) => !item.auth || user)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isDev && (
            <Link href="/admin/import-startups">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
          {isLoading ? (
            <div className="w-20 h-8 bg-muted animate-pulse rounded" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                <DropdownMenuItem asChild>
                  <Link href="/projects" className="flex items-center gap-2 cursor-pointer">
                    <FolderOpen className="h-4 w-4" />
                    Mis Proyectos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button 
                    type="button"
                    onClick={handleSignOut} 
                    className="flex items-center gap-2 w-full text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <RegisterDialog />
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-6 mt-8">
              {navItems
                .filter((item) => !item.auth || user)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              {isDev && (
                <Link
                  href="/admin/import-startups"
                  className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <div className="flex flex-col space-y-3 pt-6 border-t">
                {user ? (
                  <>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <RegisterDialog />
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
