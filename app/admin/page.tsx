import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Verify user is an admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", user.email).single()

  if (!adminUser || !adminUser.is_active) {
    redirect("/admin/login")
  }

  // Fetch all connected users
  const { data: users, error: usersError } = await supabase
    .from("connected_users")
    .select("*")
    .order("connected_at", { ascending: false })

  // Fetch activity log
  const { data: activities, error: activitiesError } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  // Fetch admin settings
  const { data: settings, error: settingsError } = await supabase.from("admin_settings").select("*")

  if (usersError || activitiesError || settingsError) {
    console.error("[v0] Error fetching data:", { usersError, activitiesError, settingsError })
  }

  return (
    <AdminDashboard
      users={users || []}
      activities={activities || []}
      settings={settings || []}
      adminEmail={user.email || ""}
    />
  )
}
