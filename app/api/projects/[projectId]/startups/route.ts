import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

// Admin client that bypasses RLS
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin not configured")
  }
  
  return createClient(supabaseUrl, serviceRoleKey)
}

// Auth client to get current user
function getSupabaseAuth(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase not configured")
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
      },
    },
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from("project_startups")
      .select("*, startups(*)")
      .eq("project_id", params.projectId)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch project startups" }, { status: 500 })
    }

    return NextResponse.json({ projectStartups: data })
  } catch (error) {
    console.error("[v0] Error in project startups API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const supabaseAuth = getSupabaseAuth(request)
    const supabaseAdmin = getSupabaseAdmin()
    
    const { data: { user } } = await supabaseAuth.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("id, created_by")
      .eq("id", params.projectId)
      .single()
    
    if (!project || project.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { startupId, startupName, notes } = body as {
      startupId?: string
      startupName?: string
      notes?: string
    }

    let finalStartupId = startupId

    if (!finalStartupId && startupName) {
      const { data: startup } = await supabaseAdmin
        .from("startups")
        .select("id")
        .eq("nombre", startupName)
        .single()
      
      if (startup) {
        finalStartupId = startup.id
      }
    }

    if (!finalStartupId) {
      return NextResponse.json({ error: "Startup ID or name is required" }, { status: 400 })
    }

    const { data: existingList } = await supabaseAdmin
      .from("project_startups")
      .select("id")
      .eq("project_id", params.projectId)
      .eq("startup_id", finalStartupId)

    if (existingList && existingList.length > 0) {
      return NextResponse.json({ error: "Startup already in project" }, { status: 409 })
    }

    const { data, error: insertError } = await supabaseAdmin.from("project_startups").insert({
      project_id: params.projectId,
      startup_id: finalStartupId,
      notes: notes || null,
    }).select()

    if (insertError) {
      return NextResponse.json({ error: "Failed to add startup to project" }, { status: 500 })
    }

    return NextResponse.json({ projectStartup: data?.[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
