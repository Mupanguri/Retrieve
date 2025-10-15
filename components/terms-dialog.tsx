"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/client"

interface TermsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReadComplete: () => void
}

export function TermsDialog({ open, onOpenChange, onReadComplete }: TermsDialogProps) {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false)
  const [readingTime, setReadingTime] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      setHasScrolledToEnd(false)
      setReadingTime(0)

      // Log that terms dialog was opened (tracked externally)
      // This component will be enhanced with activity logging
    } else {
      // Start reading timer when opened
      const interval = setInterval(() => {
        setReadingTime(prev => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [open])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const scrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50

    if (scrolledToBottom && !hasScrolledToEnd) {
      setHasScrolledToEnd(true)
      onReadComplete()

      // Log reading completion
      console.log(`[Terms] User completed reading in ${readingTime} seconds`)
    }
  }

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          background-color: #0066b2;
          color: white;
          padding: 20px;
          border-bottom: 1px solid #ddd;
        }

        .modal-title {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .modal-description {
          margin: 8px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .modal-body {
          padding: 0;
          max-height: 400px;
          overflow-y: auto;
        }

        .terms-content {
          padding: 20px;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
        }

        .terms-section {
          margin-bottom: 20px;
        }

        .terms-section h3 {
          color: #0066b2;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .terms-section p {
          margin-bottom: 10px;
        }

        .terms-list {
          list-style-type: disc;
          margin-left: 20px;
        }

        .terms-list li {
          margin-bottom: 4px;
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: white;
        }

        .read-indicator {
          position: sticky;
          bottom: 0;
          background: #4caf50;
          color: white;
          padding: 10px;
          text-align: center;
          font-weight: 500;
        }

        .timestamp {
          background-color: #f8f9fa;
          padding: 15px;
          border-top: 1px solid #e8e8e8;
          font-size: 12px;
          color: #666;
        }
      `}</style>

      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => onOpenChange(false)}
            >
              ×
            </button>

            <div className="modal-header">
              <h2 className="modal-title">Terms and Conditions</h2>
              <p className="modal-description">
                Please read and scroll through the complete terms and conditions before connecting to the network.
              </p>
            </div>

            <div className="modal-body" onScroll={handleScroll} ref={scrollRef}>
              <div className="terms-content">
                <section className="terms-section">
                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    By accessing this wireless network, you agree to be bound by these terms and conditions. If you do not
                    agree to these terms, you must disconnect immediately and refrain from using the network.
                  </p>
                </section>

                <section className="terms-section">
                  <h3>2. Network Usage Policy</h3>
                  <p>
                    This network is provided for legitimate guest accommodation purposes only. Users must comply with all applicable
                    laws and regulations. The following activities are strictly prohibited:
                  </p>
                  <ul className="terms-list">
                    <li>Unauthorized access to systems or data</li>
                    <li>Distribution of malware or malicious software</li>
                    <li>Harassment, threats, or illegal content distribution</li>
                    <li>Bandwidth-intensive activities that degrade network performance</li>
                    <li>Circumventing network security measures</li>
                    <li>Copyright infringement or illegal downloading</li>
                  </ul>
                </section>

                <section className="terms-section">
                  <h3>3. Monitoring and Logging</h3>
                  <p>
                    All network activity is monitored and logged for security and compliance purposes. By connecting to this
                    network, you consent to the collection and analysis of:
                  </p>
                  <ul className="terms-list">
                    <li>Device information (MAC address, IP address, device type)</li>
                    <li>Connection timestamps and duration</li>
                    <li>Network traffic metadata</li>
                    <li>User authentication credentials</li>
                    <li>Terms and conditions reading completion</li>
                  </ul>
                </section>

                <section className="terms-section">
                  <h3>4. Data Privacy & Guest Information</h3>
                  <p>
                    Guest information (name, email, phone) is collected for network security and service quality purposes.
                    Information is retained for compliance purposes and may be shared with authorized hotel management
                    or law enforcement authorities when required for investigation of network abuse.
                  </p>
                </section>

                <section className="terms-section">
                  <h3>5. Device Security Requirements</h3>
                  <p>Guests are responsible for maintaining the security of their devices and network usage. You must:</p>
                  <ul className="terms-list">
                    <li>Ensure your device has current security updates</li>
                    <li>Use legitimate software and services only</li>
                    <li>Report any security incidents immediately to front desk</li>
                    <li>Not allow unauthorized third parties to use your network access</li>
                    <li>Use appropriate content filtering for younger users</li>
                  </ul>
                </section>

                <section className="terms-section">
                  <h3>6. Business Liability & Service Disclaimer</h3>
                  <p>
                    The hotel network is provided "as is" without warranties of any kind. The hotel management is not liable for any damages,
                    losses, or security breaches that may occur through your use of the network. Guests assume all risks
                    associated with network connectivity and agree to indemnify the hotel against claims arising from their usage.
                  </p>
                </section>

                <section className="terms-section">
                  <h3>7. Network Availability & Business Operations</h3>
                  <p>
                    Network availability is not guaranteed and may be suspended for business, security, or maintenance reasons.
                    The hotel reserves the right to modify, suspend, or terminate network access at any time without notice.
                    Scheduled maintenance may result in temporary service interruptions during business hours.
                  </p>
                </section>

                <section className="terms-section">
                  <h3>8. Guest Code of Conduct & Enforcement</h3>
                  <p>
                    Guest usage must respect hotel policies and local laws. Violations may result in immediate network access
                    termination, incident reporting to hotel management, and potential legal action. The hotel cooperates
                    fully with law enforcement authorities in investigating network abuse. Serious violations may result
                    in guest eviction or denial of future stays.
                  </p>
                </section>

                <section className="terms-section">
                  <h3>9. Terms Updates & Guest Accountability</h3>
                  <p>
                    These terms may be updated at any time. Continued network use after changes constitutes acceptance
                    of modified terms. Guests are responsible for reviewing terms periodically through the hotel app
                    or front desk inquiries.
                  </p>
                </section>

                <section className="terms-section">
                  <h3>10. Contact Information & Guest Support</h3>
                  <p>
                    For questions regarding these terms or network technical support, please contact:
                    <br />
                    Hotel Front Desk: ext. 200
                    <br />
                    Technical Support: ext. 1337
                    <br />
                    Manager on Duty: Displayed on room phone
                    <br />
                    General Inquiries: admin@hicc-guestwifi.local
                  </p>
                </section>
              </div>

              {hasScrolledToEnd && (
                <div className="read-indicator">
                  ✓ You have read the complete terms and conditions | Reading Time: {readingTime}s
                </div>
              )}

              <div className="timestamp">
                Last Updated: {new Date().toLocaleDateString()}
                <br />
                Version 2.1 - Victim Guest Network Terms
                <br />© {new Date().getFullYear()} Victim Network. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
