import { NextRequest, NextResponse } from "next/server"
import { getRealIP } from "@/lib/ip-detection"

export async function GET(request: NextRequest) {
  const ip = getRealIP(request)

  return NextResponse.json({
    ip,
    timestamp: new Date().toISOString()
  })
}
