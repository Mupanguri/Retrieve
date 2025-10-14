"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"

interface ConnectedUser {
  id: number
  email: string
  name: string
  ip_address: string
  device_name: string
  connected_at: string
}

export default function UserPortal() {
  const [userData, setUserData] = useState<ConnectedUser | null>(null)
  const [timeConnected, setTimeConnected] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSessionAndLoadData = async () => {
      try {
        // Check session from any valid connection (not just portal_session_id)
        // Look for the latest session or any active session
        const supabase = createClient()

        // Get the most recent connected user session
        const { data: recentSessions, error } = await supabase
          .from('connected_users')
          .select('*')
          .eq('trapped', false) // Only active sessions
          .order('connected_at', { ascending: false })
          .limit(1)
          .single()

        if (error || !recentSessions) {
          router.push('/')
          return
        }

        setUserData(recentSessions)

        // Start connection timer
        const connectedTime = new Date(recentSessions.connected_at).getTime()
        const now = Date.now()
        const elapsed = Math.floor((now - connectedTime) / 1000)
        setTimeConnected(elapsed)

        const interval = setInterval(() => {
          setTimeConnected(prev => prev + 1)
        }, 1000)

        setIsLoading(false)

        return () => clearInterval(interval)
      } catch (error) {
        console.error('Failed to load user data:', error)
        router.push('/')
      }
    }

    checkSessionAndLoadData()
  }, [router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleDisconnect = async () => {
    if (userData) {
      const supabase = createClient()

      // Update user status to disconnected
      await supabase
        .from('connected_users')
        .update({ trapped: true })
        .eq('id', userData.id)

      // Log disconnect
      await supabase.from('activity_log').insert({
        user_id: userData.id,
        action_type: 'user_disconnect',
        setting_name: 'portal',
        enabled: false,
        details: {
          timestamp: new Date().toISOString(),
        },
      })

      // Clear session and redirect
      localStorage.removeItem('portal_session_id')
      router.push('/')
    }
  }

  const handleDownloadCertificate = () => {
    // Placeholder for certificate download functionality
    alert('HTTPS certificate download would be implemented here')
  }

  if (isLoading) {
    return (
      <div className="body">
        <div className="container">
          <div className="card">
            <div className="header">SOPHOS</div>
            <div className="content" style={{ textAlign: 'center', padding: '60px 40px' }}>
              <div style={{ marginBottom: '20px' }}>Loading your portal...</div>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #0066b2',
                borderTop: '4px solid #f3f3f3',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
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

        .container {
            width: 100%;
            max-width: 500px;
        }

        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-bottom: 30px;
        }

        .header {
            background-color: #0066b2;
            color: white;
            padding: 24px;
            text-align: center;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 2px;
        }

        .content {
            padding: 40px;
        }

        .network-title {
            color: #0066b2;
            font-size: 20px;
            font-weight: 500;
            text-align: center;
            margin-bottom: 30px;
        }

        .session-info {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 25px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .info-item:last-child {
            margin-bottom: 0;
        }

        .info-label {
            font-weight: 500;
            color: #666;
        }

        .info-value {
            font-weight: 600;
            color: #333;
        }

        .btn-signin,
        .btn-portal {
            width: 100%;
            padding: 14px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-bottom: 15px;
        }

        .btn-signin:hover {
            background-color: #45a049;
        }

        .btn-disconnect {
            width: 100%;
            padding: 14px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-bottom: 15px;
        }

        .btn-disconnect:hover {
            background-color: #d32f2f;
        }

        .certificate-link {
            text-align: center;
            margin-top: 20px;
        }

        .certificate-link a {
            color: #0066b2;
            text-decoration: none;
            font-size: 15px;
        }

        .certificate-link a:hover {
            text-decoration: underline;
        }

        .certificate-description {
            text-align: center;
            font-size: 13px;
            color: #666;
            margin-top: 10px;
            line-height: 1.5;
        }
      `}</style>

      <div className="body">
        <div className="container">
          <div className="card">
            <div className="header">
              SOPHOS
            </div>
            <div className="content">
              <h2 className="network-title">User Portal</h2>

              {userData && (
                <div className="session-info">
                  <div className="info-item">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{userData.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{userData.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">IP Address:</span>
                    <span className="info-value">{userData.ip_address}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Device:</span>
                    <span className="info-value">{userData.device_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Connection Time:</span>
                    <span className="info-value">{formatTime(timeConnected)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Connected:</span>
                    <span className="info-value">{new Date(userData.connected_at).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="certificate-link"
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onClick={handleDownloadCertificate}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f7ff'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Download HTTPS Certificate Authority
              </button>

              <button
                type="button"
                className="btn-disconnect"
                onClick={handleDisconnect}
              >
                Disconnect from Network
              </button>

              <button
                type="button"
                className="btn-portal"
                onClick={() => router.back()}
                style={{
                  backgroundColor: '#0066b2',
                  color: 'white',
                  border: `1px solid #0066b2`,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#0056a2';
                  e.currentTarget.style.borderColor = '#0056a2';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#0066b2';
                  e.currentTarget.style.borderColor = '#0066b2';
                }}
              >
                Back to Main Portal
              </button>
            </div>
          </div>

          <p className="certificate-description">
            Your connection is secure and regularly monitored for quality assurance.
            All network activity is logged in accordance with our security policy.
          </p>
        </div>
      </div>
    </>
  )
}
