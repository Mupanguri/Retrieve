"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Setting = {
  id: string
  setting_name: string
  enabled: boolean
  updated_at: string
}

export function SettingsPanel({ settings }: { settings: Setting[] }) {
  return (
    <div className="min-h-screen bg-sophos-darker text-white font-sans">
      <div className="border-b border-sophos-accent/10 bg-sophos-dark/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-sm uppercase tracking-wider">Sophos System Settings</h1>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider text-sophos-accent hover:text-white hover:bg-sophos-accent/10">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Card className="captive-portal-card">
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider">Portal Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between py-3 border-b border-sophos-accent/10">
                <div className="space-y-1">
                  <Label className="text-sm uppercase tracking-wider">{setting.setting_name}</Label>
                  <p className="text-xs text-sophos-muted">Last updated: {new Date(setting.updated_at).toLocaleString()}</p>
                </div>
                <Switch checked={setting.enabled} disabled />
              </div>
            ))}

            {settings.length === 0 && <p className="text-sm text-sophos-muted text-center py-8">No settings configured</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
