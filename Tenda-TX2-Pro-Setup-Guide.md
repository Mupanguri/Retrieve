# 📶 Victim Guest Network - Tenda TX2 Pro Router Setup Guide

## 🎯 Overview
This guide specifically covers setting up captive portal functionality on your **Tenda TX2 Pro WiFi 6 Router** to automatically serve your Victim Guest Network portal when users connect to your WiFi.

---

## 🔍 **Tenda TX2 Pro Router Specifications**

### Compatible Features
- ✅ **Captive Portal Support** (built-in firmware)
- ✅ **DHCP Server** with custom options
- ✅ **Firewall Rules** management
- ✅ **WiFi 6 Dual Band** (2.4GHz + 5GHz + 6GHz)
- ✅ **Gigabit Ethernet Ports**

### Limitations
- ❌ **Advanced RADIUS authentication** (uses internal auth)
- ❌ **Custom RADIUS servers** (basic portal login)
- ❌ **Advanced user management** (needs external integration)

### Required Equipment
- **Router:** Tenda TX2 Pro
- **Portal Server:** Your HICC application (separate PC/server)
- **Ethernet cable** for LAN connection

---

## 🛠️ **Initial Router Setup**

### Step 1: Access Router Web Interface

1. **Connect to Router:**
   - Connect PC to router via Ethernet
   - Router default IP: `192.168.0.1`

2. **Login to Admin Panel:**
   ```
   Username: admin
   Password: admin (check router sticker for exact password)
   ```

3. **First-Time Setup:**
   - Update firmware if prompted
   - Set timezone:
   - Change default password: **Use strong password**

---

## 🌐 **Network Configuration**

### Step 2: Configure WAN (Internet) Connection

1. **Navigate:** Network → WAN → WAN Settings
2. **WAN Settings:**
   ```
   WAN Type: DHCP
   DNS: 8.8.8.8, 1.1.1.1 (Google DNS)
   MAC Clone: Disabled
   MTU: 1500
   ```

3. **Save and test connection**

### Step 3: Configure LAN Settings

1. **Navigate:** Network → LAN → LAN Settings
2. **DHCP Server:**
   ```
   IP Address: 192.168.1.1
   Subnet Mask: 255.255.255.0
   DHCP Server: Enabled
   Start IP: 192.168.1.10
   End IP: 192.168.1.200
   Lease Time: 3600 seconds (1 hour)
   ```

3. **DHCP Options:**
   ```
   Option 66 (TFTP Server): http://192.168.1.100/
   Option 160 (Captive Portal): http://192.168.1.100/
   ```

4. **Save configuration**

---

## 📡 **WiFi Network Setup**

### Step 4: Configure Guest WiFi Networks

1. **Navigate:** Wireless → Wireless Settings
2. **2.4GHz WiFi:**
   ```
   WiFi Name (SSID): Victim-Guest-2.4
   Security: WPA3-SAE
   Password: (set strong password)
   Hide SSID: Disabled
   Guest Network: Enabled
   ```

3. **5GHz WiFi:**
   ```
   WiFi Name (SSID): Victim-Guest-5G
   Security: WPA3-SAE
   Password: (set strong password)
   Hide SSID: Disabled
   Guest Network: Enabled
   ```

4. **6GHz WiFi:** (if available)
   ```
   WiFi Name (SSID): Victim-Guest-6G
   Security: WPA3-SAE
   Password: (set strong password)
   Hide SSID: Disabled
   Guest Network: Enabled
   ```

---

## 🔒 **Captive Portal Configuration**

### Step 5: Access Captive Portal Settings

**Important:** Tenda TX2 Pro has captive portal in the **Firewall** or **Advanced** section

1. **Navigate:** Advanced → Firewall → Captive Portal
   *(Or check Advanced → Security → Access Control)*

### Step 6: Enable Captive Portal

1. **Portal Settings:**
   ```
   Captive Portal: ✅ Enabled
   Authentication: Local (Simple)
   Portal URL: http://192.168.1.100/
   Success URL: http://192.168.1.100/connected
   Redirect Mode: HTTP 302
   ```

2. **Portal Page Configuration:**
   ```
   Custom Portal Page: ☑️ Enabled
   Portal Server IP: 192.168.1.100
   Portal Server Port: 3000
   HTTPS Support: Disabled (unless you configure SSL)
   ```

### Step 7: Portal Authentication Rules

**Note:** Tenda routers have limited auth options. For full functionality, use external proxy.

1. **Authentication Types:**
   ```
   Username/Password: Disabled
   Social Auth: Disabled
   External Auth: ✅ Enabled
   Auth Server: http://192.168.1.100/api/auth/verify
   ```

2. **Session Management:**
   ```
   Session Timeout: 3600 seconds (1 hour)
   Idle Timeout: 600 seconds (10 minutes)
   Max Concurrent Users: 50
   ```

---

## 🛡️ **Firewall Configuration**

### Step 8: Setup Traffic Rules

1. **Navigate:** Firewall → Traffic Rules
2. **Default Policies:**
   ```
   Wireless to LAN: Blocked (default)
   Guest to WAN: Blocked (enforce captive portal)
   Guest to Portal: ✅ Allowed
   ```

3. **Specific Rules:**
   ```
   Source: Guest Network (192.168.1.0/24)
   Destination: 192.168.1.100
   Port: 80, 443, 3000
   Action: Accept
   Description: Allow portal access
   ```

4. **Internet Block Rules:**
   ```
   Source: Guest Network (unauthenticated)
   Destination: 0.0.0.0/0 (any)
   Port: any
   Action: Reject
   Description: Block unauthenticated traffic
   ```

---

## 🌐 **Your Portal Server Setup**

### Step 9: Prepare Captive Portal Application

1. **Set Static IP on Server:**
   ```
   IP Address: 192.168.1.100
   Subnet Mask: 255.255.255.0
   Gateway: 192.168.1.1 (Router)
   DNS: 192.168.1.1
   ```

2. **Install and Run Application:**
   ```bash
   cd captive-portal-v2
   npm install
   npm run build
   npm run start
   # Application runs on http://192.168.1.100:3000
   ```

3. **Configure Environment Variables:**
   - Copy your `.env.local` with Supabase settings

### Step 10: Update Portal Configuration

1. **Edit `app/page.tsx`:**
   - Change certificate link: `/components/images/logo.png/`
   - Update certificate download URL if needed

2. **Test Internal Access:**
   - Browser: `http://192.168.1.100:3000`
   - Should show Victim portal with logo

---

## 🔧 **DNS Configuration (Router Level)**

### Step 11: Configure DNS Forwarding

1. **Navigate:** Network → DHCP/DNS Settings
2. **DNS Server:**
   ```
   Primary DNS: 192.168.1.1 (Router itself)
   Secondary DNS: 8.8.8.8 (Google)
   ```

3. **DNS Forwarding Rules:**
   ```
   Domain: * (all domains)
   Forward To: 192.168.1.100
   Description: Redirect to portal until auth
   ```

---

## 🧪 **Testing Your Setup**

### Step 12: Complete Test Process

1. **Connect Test Device:**
   - Connect to `Victim-Guest-2.4` or `HICC-Guest-5G`
   - Device should get IP in 192.168.1.x range

2. **Auto Redirection:**
   - Open any website (google.com, bbc.com, etc.)
   - Should automatically redirect to `http://192.168.1.100/`

3. **Portal Experience:**
   - RTG logo should display at top
   - Fill form: Name, Email, Phone
   - Accept terms & conditions
   - Click "Sign in"

4. **Post-Authentication:**
   - Redirect to success page: "You're connected to Victim Guest Wifi"
   - Clicking "Start Browsing" goes to internet
   - Full internet access restored

5. **Admin Monitoring:**
   - Access router admin: `192.168.1.1`
   - Check connected clients
   - Monitor portal usage statistics

---

## 📊 **Router Management & Monitoring**

### Step 13: Monitor System Status

1. **Navigate:** Status → Network Status
2. **Monitor:** Connected devices, traffic statistics
3. **Check:** Captive portal active devices

### Step 14: System Maintenance

1. **Firmware Updates:**
   - Check for Tenda updates regularly
   - Update when available for security fixes

2. **System Logs:**
   - View connection logs
   - Monitor portal authentication attempts
   - Review blocked traffic

3. **Backup Configuration:**
   - Save settings to backup file
   - Export to secure location

---

## 🚨 **Troubleshooting Guide**

### Common Tenda TX2 Pro Issues

**Issue: No Automatic Redirect After WiFi Connect**
```
Solution:
1. Ensure DHCP Option 160 is set correctly
2. Check captive portal URL matches server IP
3. Verify portal server is running on correct port
4. Clear device WiFi settings and reconnect
```

**Issue: Portal Page Shows But Form Won't Submit**
```
Solution:
1. Check firewall rules allow traffic to portal server
2. Verify portal server IP and port configuration
3. Confirm no other captive portal rules interfering
4. Check portal server application logs
```

**Issue: Users Can't Access Internet After Authentication**
```
Solution:
1. Verify captive portal authentication succeeded
2. Check firewall rules created additional tunnels
3. Confirm DNS settings allow internet resolution
4. Clear browser cache and test with incognito
```

**Issue: Slow Portal Loading**
```
Solution:
1. Check WiFi signal strength on connected devices
2. Verify router CPU isn't overloaded (<80% usage)
3. Enable QoS for portal traffic priority
4. Consider disabling unused WiFi bands temporarily
```

---

## 📈 **Performance Optimization**

### For High User Load (Tenda TX2 Pro)

1. **Quality of Service (QoS):**
   - Navigate: Advanced → QoS Settings
   - Prioritize portal traffic
   - Limit bandwidth per guest device

2. **WiFi Optimization:**
   ```
   Channel Selection: Auto
   Transmit Power: 75%
   Guest Network Isolation: ✅ Enabled
   Airtime Fairness: ✅ Enabled
   ```

3. **Memory Management:**
   - Monitor router usage: Status → System Info
   - Clear logs periodically
   - Reboot monthly for memory cleanup

---

## 🔒 **Security Best Practices**

### Step 15: Security Hardening

1. **Change Default Credentials:**
   - Router admin password: ✅ Changed
   - WiFi password: ✅ Strong WPA3
   - Portal session: ✅ Encrypted

2. **Access Restrictions:**
   ```
   Remote Admin: ❌ Disabled
   WAN Admin Access: ❌ Blocked
   Guest Admin Access: ❌ Restricted
   ```

3. **Network Isolation:**
   - Guest network isolated from router LAN
   - No access to router administrative functions
   - Port forwarding restricted to necessary services

---

## 🎉 **Tenda TX2 Pro Setup Complete!**

Your **Victim Guest Network** is now fully integrated with your Tenda TX2 Pro router! The captive portal will automatically serve your professional sign-in page with RTG branding to all WiFi guests.

### 📋 **Final Configuration Summary:**
- ✅ **WiFi Networks:** HICC-Guest-2.4, 5G, 6G configured
- ✅ **Captive Portal:** Enabled with custom URL
- ✅ **DHCP:** Server with portal redirect options
- ✅ **Firewall:** Traffic rules for security
- ✅ **Portal Server:** Running on static IP 192.168.1.100
- ✅ **DNS:** Forwarding to redirect unauthenticated users
- ✅ **Monitoring:** Built-in router statistics
- ✅ **Security:** WPA3 encryption and access controls

**Ready to serve WiFi guests with professional Victim branding! 🚀**
