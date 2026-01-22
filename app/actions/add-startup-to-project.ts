"use server"

import { createClient } from "@supabase/supabase-js"

export async function addStartupToProject(projectId: string, startupName: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return { error: "Supabase configuration missing" }
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Find startup by name to get its ID
    const { data: startup, error: startupError } = await supabase
      .from("startups")
      .select("id")
      .eq("nombre", startupName)
      .single()

    if (startupError || !startup) {
      return { error: "Startup not found" }
    }

    // Check if already in project
    const { data: existing } = await supabase
      .from("project_startups")
      .select("id")
      .eq("project_id", projectId)
      .eq("startup_id", startup.id)

    if (existing && existing.length > 0) {
      return { error: "Startup already in project" }
    }

    // Add startup to project
    const { error } = await supabase.from("project_startups").insert({
      project_id: projectId,
      startup_id: startup.id,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Error adding startup to project:", err)
    return { error: "Failed to add startup to project" }
  }
}
