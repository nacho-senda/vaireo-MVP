import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"

// Server-side Supabase client
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const maxDuration = 60 // 60 seconds timeout (max for Hobby plan)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { source, data: uploadedData } = body

    console.log("[v0] Starting bulk insert from source:", source)

    const supabase = getSupabaseAdmin()

    let startups: any[] = []

    if (source === "csv") {
      // Read and parse CSV
      const csvPath = path.join(process.cwd(), "user_read_only_context/project_sources/Spanish_AgriFood_Startups_-_Expanded.csv")
      const fileContent = fs.readFileSync(csvPath, "utf-8")
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })

      console.log("[v0] Parsed CSV records:", records.length)

      startups = records.map((row: any) => ({
        nombre: row["Nombre"] || row["nombre"] || "Sin nombre",
        descripcion: row["Descripción"] || row["descripcion"] || "",
        region: row["Región (CCAA)"] || row["region"] || "España",
        year: parseInt(row["Año"] || row["year"] || "2020"),
        vertical: row["Vertical"] || row["vertical"] || "Agrifood",
        subvertical: row["Subvertical"] || row["subvertical"] || "",
        tecnologia: row["Tecnología"] || row["tecnologia"] || "",
        website: row["Web"] || row["website"] || null,
        nivel_madurez: row["Nivel de madurez"] || row["nivel_madurez"] || "Seed",
        inversion_total: row["Inversión total (€)"] || row["inversion_total"] || "0",
        tipo_impacto: row["Tipo de impacto"] || row["tipo_impacto"] || "",
        diversidad_equipo: row["Diversidad del equipo"] || row["diversidad_equipo"] || "",
        pais: "España",
        status: "active",
      }))
    } else if (source === "upload") {
      // Handle uploaded CSV data from request
      if (uploadedData && Array.isArray(uploadedData)) {
        startups = uploadedData.map((row: any) => ({
          nombre: row["Nombre"] || row["nombre"] || "Sin nombre",
          descripcion: row["Descripción"] || row["descripcion"] || "",
          region: row["Región (CCAA)"] || row["region"] || "España",
          year: parseInt(row["Año"] || row["year"] || "2020"),
          vertical: row["Vertical"] || row["vertical"] || "Agrifood",
          subvertical: row["Subvertical"] || row["subvertical"] || "",
          tecnologia: row["Tecnología"] || row["tecnologia"] || "",
          website: row["Web"] || row["website"] || null,
          nivel_madurez: row["Nivel de madurez"] || row["nivel_madurez"] || "Seed",
          inversion_total: row["Inversión total (€)"] || row["inversion_total"] || "0",
          tipo_impacto: row["Tipo de impacto"] || row["tipo_impacto"] || "",
          diversidad_equipo: row["Diversidad del equipo"] || row["diversidad_equipo"] || "",
          pais: "España",
          status: "active",
        }))
      }
    }

    console.log("[v0] Total startups to insert:", startups.length)

    // Insert in batches of 100
    const batchSize = 100
    let totalInserted = 0
    let errors = 0

    for (let i = 0; i < startups.length; i += batchSize) {
      const batch = startups.slice(i, i + batchSize)

      const { data, error } = await supabase.from("startups").upsert(batch, {
        onConflict: "nombre",
        ignoreDuplicates: false,
      })

      if (error) {
        console.error("[v0] Error inserting batch:", error)
        errors += batch.length
      } else {
        totalInserted += batch.length
        console.log("[v0] Inserted batch:", batch.length, "Total:", totalInserted)
      }
    }

    // Get total count
    const { count } = await supabase
      .from("startups")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    console.log("[v0] Total startups in DB:", count)

    return NextResponse.json({
      success: true,
      inserted: totalInserted,
      errors,
      totalInDB: count,
      message: `Successfully inserted ${totalInserted} startups. Total in database: ${count}`,
    })
  } catch (error) {
    console.error("[v0] Bulk insert error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// Get current startup count
export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const { count, error } = await supabase
      .from("startups")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    if (error) throw error

    return NextResponse.json({
      success: true,
      count,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
