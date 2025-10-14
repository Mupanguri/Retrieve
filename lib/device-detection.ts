import UAParser from 'ua-parser-js';

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  deviceType: string;
  deviceName?: string;
}

export function parseDeviceInfo(userAgent: string): DeviceInfo {
  const parser = new UAParser(userAgent);

  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  let deviceType = 'desktop';
  let deviceName = '';

  // Determine device type
  if (device.type) {
    deviceType = device.type; // 'mobile', 'tablet', 'console', 'smarttv', 'wearable', 'embedded'
  }

  // Build device name
  const parts = [];

  if (device.model) {
    parts.push(device.model);
  }

  if (device.vendor) {
    parts.push(device.vendor);
  }

  if (os.name) {
    parts.push(os.name);
  }

  deviceName = parts.length > 0 ? parts.join(' ') : `${browser.name || 'Unknown'} Browser`;

  return {
    browser: browser.name || 'Unknown',
    os: `${os.name || 'Unknown'} ${os.version || ''}`.trim(),
    device: device.model || 'Unknown',
    deviceType,
    deviceName,
  };
}

export function generateDeviceName(userAgent: string): string {
  const info = parseDeviceInfo(userAgent);
  return info.deviceName || `${info.browser} on ${info.os}`;
}

// Additional device identification features
export function isMobileDevice(userAgent: string): boolean {
  const info = parseDeviceInfo(userAgent);
  return info.deviceType === 'mobile' || info.deviceType === 'tablet';
}

export function getDeviceCategory(userAgent: string): string {
  const info = parseDeviceInfo(userAgent);

  if (info.deviceType === 'mobile') return 'Mobile Phone';
  if (info.deviceType === 'tablet') return 'Tablet';
  if (info.deviceType === 'console') return 'Gaming Console';
  if (info.deviceType === 'smarttv') return 'Smart TV';
  if (info.deviceType === 'wearable') return 'Wearable Device';
  if (info.deviceType === 'embedded') return 'Embedded Device';

  return 'Desktop Computer';
}
