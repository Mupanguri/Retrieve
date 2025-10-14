import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"
import { getRealIP } from "@/lib/ip-detection"
import { generateDeviceName } from "@/lib/device-detection"

export async function GET() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from("connected_users")
    .select("*")
    .order("connected_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ users })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  // Enhanced IP detection
  const realIP = getRealIP(request) || body.ip_address || "unknown"
  const userAgent = request.headers.get("user-agent") || body.user_agent || "unknown"
  const deviceName = generateDeviceName(userAgent) || body.device_name

  const { data, error } = await supabase
    .from("connected_users")
    .insert({
      ip_address: realIP,
      mac_address: body.mac_address || "unknown",
      user_agent: userAgent,
      device_name: deviceName,
      email: body.email,
      phone: body.phone,
      name: body.name,
      terms_read_complete: body.accepted_terms || false,
      trapped: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log the new connection
  await supabase.from("activity_log").insert({
    action_type: "user_connected",
    setting_name: "portal",
    enabled: true,
    details: {
      ip_address: realIP,
      device_name: deviceName,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
    },
  })

  return NextResponse.json({ session: data })
}
