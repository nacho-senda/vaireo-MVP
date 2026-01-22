import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Helper functions for startups
export async function getStartups() {
  const { data, error } = await supabase.from("startups").select("*").eq("status", "active")

  if (error) throw error
  return data
}

export async function getStartupById(id: string) {
  const { data, error } = await supabase.from("startups").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function searchStartups(query: string) {
  const { data, error } = await supabase
    .from("startups")
    .select("*")
    .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%,vertical.ilike.%${query}%`)
    .eq("status", "active")
    .limit(50)

  if (error) throw error
  return data
}

export async function filterStartups(filters: {
  vertical?: string
  region?: string
  year?: number
}) {
  let query = supabase.from("startups").select("*").eq("status", "active")

  if (filters.vertical) {
    query = query.eq("vertical", filters.vertical)
  }

  if (filters.region) {
    query = query.eq("region", filters.region)
  }

  if (filters.year) {
    query = query.gte("year", filters.year)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

// Helper functions for projects
export async function getUserProjects() {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("created_by", session.session.user.id)

  if (error) throw error
  return data
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function getProjectStartups(projectId: string) {
  const { data, error } = await supabase
    .from("project_startups")
    .select("*, startups(*)")
    .eq("project_id", projectId)

  if (error) throw error
  return data
}

export async function addStartupToProject(projectId: string, startupId: string, notes?: string) {
  const { data, error } = await supabase.from("project_startups").insert({
    project_id: projectId,
    startup_id: startupId,
    notes: notes || null,
  })

  if (error) throw error
  return data
}

export async function removeStartupFromProject(projectId: string, startupId: string) {
  const { error } = await supabase
    .from("project_startups")
    .delete()
    .eq("project_id", projectId)
    .eq("startup_id", startupId)

  if (error) throw error
}

// Helper functions for sessions
export async function createSession(
  projectId: string,
  sessionData: Record<string, unknown>
) {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user) throw new Error("Not authenticated")

  const { data, error } = await supabase.from("sessions").insert({
    user_id: session.session.user.id,
    project_id: projectId,
    session_data: sessionData,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  })

  if (error) throw error
  return data
}

export async function updateSession(
  sessionId: string,
  sessionData: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("sessions")
    .update({ session_data: sessionData, updated_at: new Date().toISOString() })
    .eq("id", sessionId)

  if (error) throw error
  return data
}

export async function getUserSessions() {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", session.session.user.id)
    .gt("expires_at", new Date().toISOString())

  if (error) throw error
  return data
}
