"use client"

export default function ConnectedPage() {
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
            text-align: center;
        }

        .connected-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: #4caf50;
            margin-bottom: 24px;
        }

        .connected-title {
            font-size: 24px;
            font-weight: 500;
            color: #0066b2;
            margin-bottom: 16px;
        }

        .connected-message {
            color: #666;
            margin-bottom: 32px;
            line-height: 1.5;
        }

        .start-browsing-link {
            display: inline-block;
            background-color: #4caf50;
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 500;
            transition: background-color 0.3s;
        }

        .start-browsing-link:hover {
            background-color: #45a049;
        }

        .footer-message {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 16px;
            margin-top: 24px;
        }

        .footer-message p {
            margin: 0;
            font-size: 13px;
            color: #666;
            line-height: 1.5;
        }
      `}</style>

      <div className="body">
        <div className="container">
          <div className="card">
            <div className="header">
              HICC Guest Network
            </div>
            <div className="content">
              <div className="connected-icon">
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                </svg>
              </div>

              <h1 className="connected-title">You're connected to HICC Guest Wifi</h1>

              <p className="connected-message">
                Thank you for providing your details. You may now start browsing the internet.
              </p>

              <a
                href="http://192.168.1.250/google/"
                className="start-browsing-link"
              >
                Start Browsing
              </a>

              <div className="footer-message">
                <p>
                  Your connection is secure and regularly monitored for quality assurance.
                  All network activity is logged in accordance with our security policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
