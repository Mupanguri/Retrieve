import { createClient } from "@/lib/server"
import { SettingsPanel } from "@/components/settings-panel"

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: settings, error } = await supabase.from("admin_settings").select("*")

  if (error) {
    console.error("[v0] Error fetching settings:", error)
  }

  return <SettingsPanel settings={settings || []} />
}
