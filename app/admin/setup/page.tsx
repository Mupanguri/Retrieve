"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSetup = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Setup failed")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/admin/login")
      }, 2000)
    } catch (err: any) {
      console.error("[v0] Setup error:", err)
      setError(err.message || "Failed to create admin user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
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
            max-width: 480px;
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

        .title-section {
            text-align: center;
            margin-bottom: 30px;
        }

        .icon-wrapper {
            width: 64px;
            height: 64px;
            background-color: #f0f7ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }

        .page-title {
            font-size: 24px;
            font-weight: 600;
            color: #0066b2;
            margin-bottom: 8px;
        }

        .page-subtitle {
            font-size: 16px;
            color: #666;
        }

        .credentials-panel {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 24px;
            margin-bottom: 24px;
        }

        .panel-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 16px;
        }

        .credentials-grid {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 12px 20px;
            font-size: 14px;
        }

        .credential-label {
            color: #666;
            font-weight: 500;
        }

        .credential-value {
            color: #333;
            font-family: monospace;
            background-color: white;
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }

        .warning-panel {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 24px;
        }

        .warning-text {
            color: #856404;
            font-size: 14px;
            margin: 0;
        }

        .error-panel {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 20px;
        }

        .error-text {
            color: #721c24;
            font-size: 14px;
            margin: 0;
        }

        .success-panel {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 6px;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
        }

        .success-icon {
            width: 48px;
            height: 48px;
            color: #28a745;
            margin: 0 auto 12px;
        }

        .success-title {
            color: #155724;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .success-subtitle {
            color: #155724;
            font-size: 14px;
            opacity: 0.8;
        }

        .btn-primary {
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
            margin-bottom: 20px;
        }

        .btn-primary:hover {
            background-color: #45a049;
        }

        .btn-primary:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }

        .footer {
            text-align: center;
            font-size: 13px;
            color: #666;
        }
      `}</style>

      <div className="body">
        <div className="container">
          <div className="card">
            <div className="header">
              Victim Guest Network
            </div>
            <div className="content">
              <div className="title-section">
                <div className="icon-wrapper">
                  <svg width="32" height="32" fill="#0066b2" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h1 className="page-title">Admin Setup</h1>
                <p className="page-subtitle">Initialize Victim Guest Network Administration</p>
              </div>

              {!success ? (
                <div>
                  <div className="credentials-panel">
                    <h3 className="panel-title">Admin Credentials</h3>
                    <div className="credentials-grid">
                      <span className="credential-label">Username:</span>
                      <span className="credential-value">johanimufambi</span>
                      <span className="credential-label">Email:</span>
                      <span className="credential-value">johanimufambi@hicc.local</span>
                      <span className="credential-label">Password:</span>
                      <span className="credential-value">V@hek1manyama</span>
                    </div>
                  </div>

                  <div className="warning-panel">
                    <p className="warning-text">
                      Click the button below to create the admin user account. This only needs to be done once.
                    </p>
                  </div>

                  {error && (
                    <div className="error-panel">
                      <p className="error-text">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSetup}
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? "Creating Admin User..." : "Create Admin User"}
                  </button>
                </div>
              ) : (
                <div className="success-panel">
                  <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="success-title">Admin user created successfully!</h3>
                  <p className="success-subtitle">Redirecting to login page...</p>
                </div>
              )}
            </div>
          </div>

          <p className="footer">
            Victim Guest Network Administration System
          </p>
        </div>
      </div>
    </>
  )
}
