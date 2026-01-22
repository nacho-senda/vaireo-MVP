import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
        })
      },
    },
  })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("created_by", user.id)

    if (error) {
      console.error("[v0] Error fetching projects:", error)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }

    return NextResponse.json({ projects: data })
  } catch (error) {
    console.error("[v0] Unexpected error in projects API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
        })
      },
    },
  })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { name, description } = (await request.json()) as {
      name: string
      description: string
    }

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("projects").insert({
      name,
      description: description || null,
      created_by: user.id,
    })

    if (error) {
      console.error("[v0] Error creating project:", error)
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

    return NextResponse.json({ project: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
