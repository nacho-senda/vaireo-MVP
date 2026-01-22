"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Database, Download, Upload, RefreshCw, FileSpreadsheet, AlertCircle, CheckCircle2, FileDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// CSV template columns
const TEMPLATE_COLUMNS = [
  "Nombre",
  "Descripción",
  "Región (CCAA)",
  "Año",
  "Vertical",
  "Subvertical",
  "Tecnología",
  "Web",
  "Nivel de madurez",
  "Inversión total (€)",
  "Tipo de impacto",
  "Diversidad del equipo",
]

export default function ImportStartupsPage() {
  const [loading, setLoading] = useState(false)
  const [currentCount, setCurrentCount] = useState<number | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const fetchCurrentCount = async () => {
    try {
      addLog("Obteniendo conteo actual...")
      const response = await fetch("/api/admin/bulk-insert-startups")
      const data = await response.json()

      if (data.success) {
        setCurrentCount(data.count)
        addLog(`Total de startups en DB: ${data.count}`)
      }
    } catch (error) {
      console.error("Error fetching count:", error)
    }
  }

  const importFromCSV = async () => {
    setLoading(true)
    addLog("Iniciando importación desde CSV del sistema...")

    try {
      const response = await fetch("/api/admin/bulk-insert-startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "csv" }),
      })

      const data = await response.json()

      if (data.success) {
        addLog(`Importación exitosa: ${data.inserted} startups insertadas`)
        addLog(`Total en DB: ${data.totalInDB}`)
        setCurrentCount(data.totalInDB)

        toast({
          title: "Importación exitosa",
          description: `${data.inserted} startups importadas desde CSV`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
      toast({
        title: "Error en importación",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    // Create CSV content with headers and example row
    const headers = TEMPLATE_COLUMNS.join(",")
    const exampleRow = [
      "Ejemplo Startup S.L.",
      "Descripción de la startup innovadora en el sector agroalimentario",
      "Comunidad Valenciana",
      "2022",
      "Agrifood",
      "Agricultura de Precisión",
      "IA, IoT",
      "https://ejemplo.com",
      "Seed",
      "500000",
      "Sostenibilidad, Reducción de residuos",
      "Mixto",
    ].join(",")

    const csvContent = `${headers}\n${exampleRow}`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "plantilla_startups_vaireo.csv"
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Plantilla descargada",
      description: "Abre el archivo CSV con Excel o Google Sheets para editarlo",
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      parseFile(file)
    }
  }

  const parseFile = async (file: File) => {
    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      toast({
        title: "Archivo vacío",
        description: "El archivo no contiene datos",
        variant: "destructive",
      })
      return
    }

    // Parse CSV
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
    const data: any[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })
      if (row["Nombre"] || row["nombre"]) {
        data.push(row)
      }
    }

    setParsedData(data)
    addLog(`Archivo parseado: ${data.length} startups encontradas`)
  }

  const uploadParsedData = async () => {
    if (parsedData.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay datos para importar",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    addLog(`Subiendo ${parsedData.length} startups...`)

    try {
      const response = await fetch("/api/admin/bulk-insert-startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "upload", data: parsedData }),
      })

      const data = await response.json()

      if (data.success) {
        addLog(`Importación exitosa: ${data.inserted} startups insertadas`)
        addLog(`Total en DB: ${data.totalInDB}`)
        setCurrentCount(data.totalInDB)
        setUploadDialogOpen(false)
        setSelectedFile(null)
        setParsedData([])

        toast({
          title: "Importación exitosa",
          description: `${data.inserted} startups importadas`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
      toast({
        title: "Error en importación",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Importador de Startups</h1>
            <p className="text-muted-foreground">
              Herramienta para gestionar la base de datos de startups del ecosistema agroalimentario español
            </p>
          </div>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estado Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Startups en base de datos</p>
                  <p className="text-3xl font-bold">{currentCount !== null ? currentCount : "—"}</p>
                </div>
                <Button onClick={fetchCurrentCount} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>

              {currentCount !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso hacia 100 startups</span>
                    <span className="font-medium">{Math.min(currentCount, 100)}/100</span>
                  </div>
                  <Progress value={Math.min((currentCount / 100) * 100, 100)} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Import Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  CSV del Sistema
                </CardTitle>
                <CardDescription>Importar desde el CSV oficial de startups españolas almacenado en el servidor</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={importFromCSV} disabled={loading} className="w-full">
                  {loading ? "Importando..." : "Importar CSV del Sistema"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Subir CSV/Excel
                </CardTitle>
                <CardDescription>Importar startups desde tu propio archivo CSV o Excel</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Subir Archivo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Importar Startups desde Archivo</DialogTitle>
                      <DialogDescription>
                        Sube un archivo CSV con los datos de las startups que deseas importar
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {/* Instructions */}
                      <div className="bg-muted rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-sm">Instrucciones:</h4>
                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                          <li>Descarga la plantilla CSV haciendo clic en el botón de abajo</li>
                          <li>Abre el archivo con Excel, Google Sheets u otra aplicación de hojas de cálculo</li>
                          <li>Rellena los datos de las startups siguiendo el formato de la fila de ejemplo</li>
                          <li>Guarda el archivo como CSV (separado por comas)</li>
                          <li>Sube el archivo CSV aquí</li>
                        </ol>
                      </div>

                      {/* Template Download */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Plantilla CSV</p>
                          <p className="text-xs text-muted-foreground">Descarga la plantilla con las columnas requeridas</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={downloadTemplate}>
                          <FileDown className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>

                      {/* Required Columns */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Columnas requeridas:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {TEMPLATE_COLUMNS.map((col) => (
                            <span key={col} className="text-xs bg-secondary px-2 py-1 rounded">
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* File Upload */}
                      <div className="space-y-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,.txt"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          className="w-full h-24 border-dashed bg-transparent"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <span className="text-sm">
                              {selectedFile ? selectedFile.name : "Haz clic para seleccionar archivo CSV"}
                            </span>
                          </div>
                        </Button>

                        {parsedData.length > 0 && (
                          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700">
                              {parsedData.length} startups listas para importar
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <Button
                        onClick={uploadParsedData}
                        disabled={loading || parsedData.length === 0}
                        className="w-full"
                      >
                        {loading ? "Importando..." : `Importar ${parsedData.length} Startups`}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registro de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground">Esperando acción...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-foreground">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Nota:</strong> Los datos importados se fusionan con los existentes usando el nombre de la startup
              como identificador único. Si ya existe una startup con el mismo nombre, se actualizarán sus datos.
            </AlertDescription>
          </Alert>
        </div>
      </main>

      <Footer />
    </div>
  )
}
