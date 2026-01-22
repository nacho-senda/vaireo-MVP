import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import { createClient } from "@supabase/supabase-js"

interface StartupRow {
  ID: string
  Nombre: string
  Descripción: string
  "Región (CCAA)": string
  Año: string
  Vertical: string
  Subvertical: string
  Tecnología: string
  Web: string
}

let migrationInProgress = false
let migrationCompleted = false

export async function migrateStartupsIfNeeded() {
  // Prevent duplicate migrations
  if (migrationInProgress || migrationCompleted) {
    return
  }

  migrationInProgress = true

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("[v0] Supabase credentials not configured, skipping migration")
      migrationCompleted = true
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if startups already exist
    const { count } = await supabase.from("startups").select("*", { count: "exact", head: true })

    if (count && count > 0) {
      console.log(`[v0] Startups already migrated (${count} startups found). Skipping migration.`)
      migrationCompleted = true
      return
    }

    console.log("[v0] Starting automatic startup migration from CSV to Supabase...")

    // Read CSV file
    const csvPath = path.join(process.cwd(), "data", "startups.csv")
    if (!fs.existsSync(csvPath)) {
      console.warn("[v0] Startups CSV file not found at", csvPath)
      migrationCompleted = true
      return
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8")
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as StartupRow[]

    console.log(`[v0] Found ${records.length} startups in CSV`)

    // Prepare data for insertion
    const startupsToInsert = records.map((record) => ({
      nombre: record.Nombre.trim(),
      descripcion: record.Descripción.trim(),
      region: record["Región (CCAA)"].split("(")[0].trim(),
      year: Number.parseInt(record.Año) || new Date().getFullYear(),
      vertical: record.Vertical.trim(),
      subvertical: record.Subvertical.trim(),
      tecnologia: record.Tecnología.trim(),
      website: record.Web?.trim() || null,
      pais: "España",
      status: "active",
    }))

    // Insert in batches
    const batchSize = 50
    let inserted = 0

    for (let i = 0; i < startupsToInsert.length; i += batchSize) {
      const batch = startupsToInsert.slice(i, i + batchSize)

      const { error } = await supabase.from("startups").insert(batch, {
        count: "estimated",
      })

      if (error) {
        console.error(`[v0] Error inserting batch ${i / batchSize + 1}:`, error)
        continue
      }

      inserted += batch.length
      console.log(`[v0] Inserted ${inserted}/${startupsToInsert.length} startups`)
    }

    console.log(`[v0] Migration completed: ${inserted} startups inserted to Supabase`)
    migrationCompleted = true
  } catch (error) {
    console.error("[v0] Migration error:", error)
    migrationInProgress = false
  }
}
