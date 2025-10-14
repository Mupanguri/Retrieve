import ipaddr from 'ipaddr.js';

export function getRealIP(request: Request): string {
  // Check X-Forwarded-For header (most reliable for proxies)
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs separated by commas
    // The first one is typically the real client IP
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    for (const ip of ips) {
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }

  // Fallback to X-Real-IP header
  const xRealIP = request.headers.get('x-real-ip');
  if (xRealIP && isValidIP(xRealIP)) {
    return xRealIP;
  }

  // Fallback to CF-Connecting-IP (Cloudflare)
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP && isValidIP(cfConnectingIP)) {
    return cfConnectingIP;
  }

  // Fallback to forwarded header
  const forwarded = request.headers.get('forwarded');
  if (forwarded) {
    // Parse forwarded header: Forwarded: for=192.168.1.1
    const match = forwarded.match(/for=([^;,\s]+)/);
    if (match && isValidIP(match[1])) {
      return match[1];
    }
  }

  // Last resort: return localhost for development
  return '127.0.0.1';
}

function isValidIP(ip: string): boolean {
  try {
    ipaddr.parse(ip);
    return true;
  } catch {
    return false;
  }
}

export function formatIP(ip: string): string {
  try {
    const parsed = ipaddr.parse(ip);
    return parsed.toString();
  } catch {
    return ip;
  }
}
