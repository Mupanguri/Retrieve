"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { generateDeviceName, getDeviceCategory } from "@/lib/device-detection"

type Session = {
  id: string
  ip_address: string
  mac_address: string
  user_agent: string
  connected_at: string
  accepted_terms: boolean
  trapped: boolean
}

export function SessionManager({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrap = async () => {
    setIsLoading(true)
    try {
      await fetch(`/api/sessions/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trapped: true }),
      })
      setIsOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("[v2] Error trapping session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRelease = async () => {
    setIsLoading(true)
    try {
      await fetch(`/api/sessions/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trapped: false }),
      })
      setIsOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("[v2] Error releasing session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await fetch(`/api/sessions/${session.id}`, {
        method: "DELETE",
      })
      setIsOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("[v2] Error deleting session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs uppercase tracking-wider text-sophos-accent hover:text-white hover:bg-sophos-accent/10">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-sophos-darker border-sophos-accent/20 text-white captive-portal-card">
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-wider">Session Management</DialogTitle>
          <DialogDescription className="text-sophos-muted">Manage session {session.id.slice(0, 8)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-sophos-muted">Status:</span>
              {session.trapped ? (
                <Badge className="captive-portal-status-disconnected text-[10px] text-red-400">
                  CAPTURED
                </Badge>
              ) : (
                <Badge className="captive-portal-status-connected text-[10px] text-sophos-success">
                  ACTIVE
                </Badge>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-sophos-muted">IP Address:</span>
              <span className="font-mono text-white">{session.ip_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sophos-muted">MAC Address:</span>
              <span className="font-mono text-white">{session.mac_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sophos-muted">Device:</span>
              <span className="text-white">{generateDeviceName(session.user_agent) || getDeviceCategory(session.user_agent) || "Unknown"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sophos-muted">Connected:</span>
              <span className="text-white">{new Date(session.connected_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sophos-muted">Terms Read:</span>
              {session.accepted_terms ? (
                <span className="text-sophos-success">Yes</span>
              ) : (
                <span className="text-sophos-danger">No</span>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            {!session.trapped ? (
              <Button
                onClick={handleTrap}
                disabled={isLoading}
                className="flex-1 bg-sophos-danger/20 text-sophos-danger hover:bg-sophos-danger/30 border border-sophos-danger/30"
              >
                {isLoading ? "Processing..." : "Capture Session"}
              </Button>
            ) : (
              <Button
                onClick={handleRelease}
                disabled={isLoading}
                className="flex-1 bg-sophos-success/20 text-sophos-success hover:bg-sophos-success/30 border border-sophos-success/30"
              >
                {isLoading ? "Processing..." : "Release Session"}
              </Button>
            )}
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-sophos-accent/20 text-white hover:bg-sophos-accent/10 bg-transparent"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
