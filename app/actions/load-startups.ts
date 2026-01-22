"use server"

import { createClient } from "@supabase/supabase-js"

interface SupabaseStartup {
  id: string
  nombre: string
  descripcion: string
  region: string
  year: number
  vertical: string
  subvertical: string
  tecnologia: string
  website: string | null
  pais: string
  status: string
  fuente: string | null
  nivel_madurez: string | null
  inversion_total: string | null
  tipo_impacto: string | null
  diversidad_equipo: string | null
  created_at: string
  updated_at: string
}

// Transform Supabase format to legacy format for compatibility
function transformToLegacyFormat(startup: SupabaseStartup) {
  return {
    ID: startup.id,
    Nombre: startup.nombre,
    Descripción: startup.descripcion,
    "Región (CCAA)": startup.region,
    Año: String(startup.year),
    Vertical: startup.vertical,
    Subvertical: startup.subvertical,
    Tecnología: startup.tecnologia,
    Web: startup.website || "",
    Fuente: startup.fuente || "Base de Datos",
    "Nivel de madurez": startup.nivel_madurez || "Startup",
    "Inversión total (€)": startup.inversion_total || "0",
    "Tipo de impacto": startup.tipo_impacto || startup.vertical,
    "Diversidad del equipo": startup.diversidad_equipo || "",
    "ODS principal": "",
  }
}

export async function cargarStartups() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("[v0] Supabase not configured, returning empty data")
      return {
        success: false,
        error: "Base de datos no configurada",
        data: []
      }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from("startups")
      .select("*")
      .eq("status", "active")
      .order("nombre", { ascending: true })

    if (error) {
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: []
      }
    }

    // Transform data to legacy format for compatibility with existing components
    const transformedData = (data as SupabaseStartup[]).map(transformToLegacyFormat)

    return {
      success: true,
      data: transformedData
    }
  } catch (error) {
    console.error("[v0] Error loading startups from Supabase:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: []
    }
  }
}
