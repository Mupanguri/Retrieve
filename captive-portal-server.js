const dgram = require('dgram');
const http = require('http');

// Configuration
const CONFIG = {
    PORTAL_IP: '192.168.1.100',
    PORTAL_PORT: 3000,
    DNS_PORT: 5353,  // Using alternative DNS port (standard 53 often blocked)
    HTTP_PORT: 8081,  // Using alternative HTTP port (standard 80 requires admin)
    STATUS_PORT: 8080
};

const PORTAL_URL = `http://${CONFIG.PORTAL_IP}:${CONFIG.PORTAL_PORT}`;

console.log('\n🚀 Starting HICC Captive Portal System...\n');
console.log('⚠️  NOTE: Using alternative ports to avoid conflicts:');
console.log(`   DNS Port: ${CONFIG.DNS_PORT} (instead of 53)`);
console.log(`   HTTP Port: ${CONFIG.HTTP_PORT} (instead of 80)\n`);

// ============================================
// DNS SERVER - Redirects all DNS queries to portal IP
// ============================================
const dnsServer = dgram.createSocket('udp4');

function createDNSResponse(query, targetIP) {
    try {
        const response = Buffer.from(query);
        
        // Set flags: standard query response, no error
        response[2] = 0x81;
        response[3] = 0x80;
        
        // Parse question section
        let offset = 12;
        while (offset < query.length && query[offset] !== 0) {
            offset += query[offset] + 1;
        }
        offset += 5;
        
        // Create answer section
        const answer = Buffer.concat([
            Buffer.from([0xc0, 0x0c]),
            Buffer.from([0x00, 0x01]),
            Buffer.from([0x00, 0x01]),
            Buffer.from([0x00, 0x00, 0x00, 0x3c]),
            Buffer.from([0x00, 0x04]),
            Buffer.from(targetIP.split('.').map(Number))
        ]);
        
        // Set answer count
        response[6] = 0x00;
        response[7] = 0x01;
        
        return Buffer.concat([response.slice(0, offset), answer]);
    } catch (error) {
        console.error('❌ Error creating DNS response:', error.message);
        return null;
    }
}

dnsServer.on('message', (msg, rinfo) => {
    const clientIP = rinfo.address;
    
    // Parse domain name
    let domain = '';
    try {
        let offset = 12;
        const labels = [];
        while (offset < msg.length && msg[offset] !== 0) {
            const length = msg[offset];
            if (length === 0) break;
            labels.push(msg.slice(offset + 1, offset + 1 + length).toString());
            offset += length + 1;
        }
        domain = labels.join('.');
    } catch (e) {
        domain = 'unknown';
    }
    
    console.log(`📡 DNS Query: ${domain} from ${clientIP}`);
    
    const response = createDNSResponse(msg, CONFIG.PORTAL_IP);
    
    if (response) {
        dnsServer.send(response, rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.error('❌ Failed to send DNS response:', err.message);
            } else {
                console.log(`   ↪️  Redirected to ${CONFIG.PORTAL_IP}`);
            }
        });
    }
});

dnsServer.on('error', (err) => {
    console.error('❌ DNS Server Error:', err.message);
    console.error('⚠️  Try stopping Windows DNS service: net stop dnscache');
    process.exit(1);
});

dnsServer.bind(CONFIG.DNS_PORT, '0.0.0.0', () => {
    console.log(`✅ DNS Server running on port ${CONFIG.DNS_PORT}`);
    console.log(`   Redirecting all DNS queries to ${CONFIG.PORTAL_IP}\n`);
});

// ============================================
// HTTP REDIRECT SERVER
// ============================================
const httpServer = http.createServer((req, res) => {
    const clientIP = req.socket.remoteAddress?.replace('::ffff:', '') || 'unknown';
    const requestedHost = req.headers.host || 'unknown';
    const requestedUrl = `${requestedHost}${req.url}`;
    
    console.log(`🌐 HTTP Request: ${requestedUrl} from ${clientIP}`);
    
    // Don't redirect if already on portal
    if (requestedHost.includes(`${CONFIG.PORTAL_IP}:${CONFIG.PORTAL_PORT}`) || 
        requestedHost.includes(`${CONFIG.PORTAL_IP}`)) {
        console.log('   ℹ️  Already on portal');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`
            <html>
            <head><title>HICC Captive Portal</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1>✅ Captive Portal System Active</h1>
                <p>Portal is running at: <a href="${PORTAL_URL}">${PORTAL_URL}</a></p>
                <p>Status API: <a href="http://localhost:${CONFIG.STATUS_PORT}/status">View Status</a></p>
            </body>
            </html>
        `);
        return;
    }
    
    // Handle captive portal detection
    const detectionPaths = [
        '/generate_204', '/gen_204', '/hotspot-detect.html',
        '/connecttest.txt', '/success.txt', '/ncsi.txt'
    ];
    
    if (detectionPaths.some(path => req.url.startsWith(path))) {
        console.log('   🔍 Captive portal detection request');
    }
    
    console.log(`   ↪️  Redirecting to portal: ${PORTAL_URL}`);
    
    res.writeHead(302, {
        'Location': PORTAL_URL,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    res.end();
});

httpServer.on('error', (err) => {
    console.error('❌ HTTP Server Error:', err.message);
    if (err.code === 'EACCES') {
        console.error('⚠️  Port 80 requires Administrator privileges!');
        console.error(`   Using alternative port ${CONFIG.HTTP_PORT} instead.`);
    } else if (err.code === 'EADDRINUSE') {
        console.error(`⚠️  Port ${CONFIG.HTTP_PORT} is already in use!`);
        console.error('   Try a different port or stop the conflicting service.');
    }
    process.exit(1);
});

httpServer.listen(CONFIG.HTTP_PORT, '0.0.0.0', () => {
    console.log(`✅ HTTP Redirect Server running on port ${CONFIG.HTTP_PORT}`);
    console.log(`   Redirecting all HTTP traffic to portal\n`);
});

// ============================================
// STATUS API SERVER
// ============================================
const statusServer = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/status') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'running',
            portal: {
                url: PORTAL_URL,
                ip: CONFIG.PORTAL_IP,
                port: CONFIG.PORTAL_PORT
            },
            servers: {
                dns: {
                    port: CONFIG.DNS_PORT,
                    status: 'Running',
                    note: 'Configure router DNS to point to ' + CONFIG.PORTAL_IP
                },
                http: {
                    port: CONFIG.HTTP_PORT,
                    status: 'Running'
                },
                status: {
                    port: CONFIG.STATUS_PORT,
                    status: 'Running'
                }
            },
            configuration: {
                routerDNS: `Set Primary DNS to ${CONFIG.PORTAL_IP}`,
                testURL: `http://${CONFIG.PORTAL_IP}:${CONFIG.HTTP_PORT}`
            },
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString()
        }, null, 2));
    } else if (req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({ healthy: true }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

statusServer.listen(CONFIG.STATUS_PORT, () => {
    console.log(`✅ Status API running on port ${CONFIG.STATUS_PORT}`);
    console.log(`   Check status: http://localhost:${CONFIG.STATUS_PORT}/status\n`);
});

// ============================================
// STARTUP COMPLETE
// ============================================
console.log('═══════════════════════════════════════════════════════');
console.log('🎯 HICC Captive Portal System is READY!');
console.log('═══════════════════════════════════════════════════════');
console.log(`📍 Portal URL: ${PORTAL_URL}`);
console.log(`🔒 Devices will be redirected to the portal`);
console.log(`📊 Status: http://localhost:${CONFIG.STATUS_PORT}/status`);
console.log('═══════════════════════════════════════════════════════\n');

console.log('📋 NEXT STEPS:');
console.log(`1. Make sure portal app is running on port ${CONFIG.PORTAL_PORT}`);
console.log(`2. Configure router DHCP Primary DNS: ${CONFIG.PORTAL_IP}`);
console.log(`3. Configure router Secondary DNS: 8.8.8.8`);
console.log(`4. Test from phone: connect to WiFi and visit any website`);
console.log('\n⚠️  IMPORTANT: Since we\'re using non-standard ports,');
console.log('   you may need to visit the portal manually first:');
console.log(`   http://${CONFIG.PORTAL_IP}:${CONFIG.PORTAL_PORT}\n`);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down captive portal system...');
    dnsServer.close();
    httpServer.close();
    statusServer.close();
    console.log('✅ Shutdown complete. Goodbye!\n');
    process.exit(0);
});