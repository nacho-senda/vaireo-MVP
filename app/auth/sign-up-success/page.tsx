import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Verifica tu correo</CardTitle>
            <CardDescription>Se ha enviado un enlace de confirmación a tu correo electrónico</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Por favor, verifica tu correo electrónico y haz clic en el enlace para confirmar tu cuenta.
            </p>
            <Link href="/" className="text-primary hover:underline">
              Volver a la página principal
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
