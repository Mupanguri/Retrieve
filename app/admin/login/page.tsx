"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()

      // Sign in with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Update last login timestamp
      await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("email", email)

      // Log the admin login
      await supabase.from("activity_log").insert({
        action_type: "admin_login",
        setting_name: "authentication",
        enabled: true,
        details: {
          email,
          timestamp: new Date().toISOString(),
          session_id: data.session?.access_token,
        },
      })

      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Login error:", err)
      setError(err.message || "Invalid credentials")
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
            max-width: 400px;
        }

        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-bottom: 20px;
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
            padding: 32px;
        }

        .title-section {
            text-align: center;
            margin-bottom: 32px;
        }

        .icon-wrapper {
            width: 64px;
            height: 64px;
            background-color: #f0f7ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
        }

        .page-title {
            font-size: 24px;
            font-weight: 600;
            color: #0066b2;
            margin-bottom: 8px;
        }

        .page-subtitle {
            font-size: 14px;
            color: #666;
        }

        .form-group {
            margin-bottom: 24px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #333;
        }

        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 15px;
            transition: border-color 0.3s;
        }

        input[type="email"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #0066b2;
        }

        .error-panel {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 12px 16px;
            margin-bottom: 20px;
        }

        .error-text {
            color: #721c24;
            font-size: 14px;
            margin: 0;
        }

        .btn-login {
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
            margin-bottom: 24px;
        }

        .btn-login:hover {
            background-color: #45a049;
        }

        .btn-login:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }

        .info-panel {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 20px;
        }

        .info-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .security-icon {
            color: #0c76a8;
            flex-shrink: 0;
        }

        .info-text {
            color: #0c5460;
            font-size: 14px;
            margin: 0;
        }

        .footer {
            text-align: center;
            font-size: 13px;
            color: #666;
        }

        .setup-link {
            color: #0066b2;
            text-decoration: none;
        }

        .setup-link:hover {
            text-decoration: underline;
        }
      `}</style>

      <div className="body">
        <div className="container">
          <div className="card">
            <div className="header">
              HICC Guest Network
            </div>
            <div className="content">
              <div className="title-section">
                <div className="icon-wrapper">
                  <svg width="32" height="32" fill="#0066b2" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h1 className="page-title">Admin Portal</h1>
                <p className="page-subtitle">HICC User Portal Administration</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@hicc.local"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="error-panel">
                    <p className="error-text">{error}</p>
                  </div>
                )}

                <button type="submit" className="btn-login" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="info-panel">
                <div className="info-content">
                  <svg className="security-icon" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="info-text">Secure Authentication with end-to-end encryption</p>
                </div>
              </div>
            </div>
          </div>

          <p className="footer">
            Don't have admin credentials? <a href="/admin/setup" className="setup-link">Setup Admin User</a>
          </p>
        </div>
      </div>
    </>
  )
}
