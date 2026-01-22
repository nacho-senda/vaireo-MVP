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
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const vertical = searchParams.get("vertical")
    const region = searchParams.get("region")

    let queryBuilder = supabase.from("startups").select("*").eq("status", "active")

    if (query) {
      queryBuilder = queryBuilder.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
    }

    if (vertical) {
      queryBuilder = queryBuilder.eq("vertical", vertical)
    }

    if (region) {
      queryBuilder = queryBuilder.eq("region", region)
    }

    const { data, error } = await queryBuilder.limit(100)

    if (error) {
      console.error("[v0] Error fetching startups:", error)
      return NextResponse.json({ error: "Failed to fetch startups" }, { status: 500 })
    }

    return NextResponse.json({ startups: data })
  } catch (error) {
    console.error("[v0] Unexpected error in startups API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
