import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { data, error } = await supabase
      .from("startups")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("[v0] Error fetching startup:", error)
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    return NextResponse.json({ startup: data })
  } catch (error) {
    console.error("[v0] Unexpected error in startup detail API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
