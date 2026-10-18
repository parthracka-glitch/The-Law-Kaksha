"use client";

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server-generated-device";

  let deviceId = localStorage.getItem("lawkaksha_device_id");
  if (!deviceId) {
    const randomPart = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 10);
    deviceId = `DEV-${randomPart}-${Date.now().toString(36)}`;
    localStorage.setItem("lawkaksha_device_id", deviceId);
  }
  return deviceId;
}

export function getDeviceFriendlyName(): string {
  if (typeof window === "undefined") return "Web Browser";

  const userAgent = navigator.userAgent;
  let os = "Desktop Device";
  if (/Windows/i.test(userAgent)) os = "Windows PC";
  else if (/Macintosh|Mac OS/i.test(userAgent)) os = "macOS Device";
  else if (/iPhone/i.test(userAgent)) os = "Apple iPhone";
  else if (/iPad/i.test(userAgent)) os = "Apple iPad";
  else if (/Android/i.test(userAgent)) os = "Android Phone";
  else if (/Linux/i.test(userAgent)) os = "Linux PC";

  let browser = "Browser";
  if (/Edg/i.test(userAgent)) browser = "Microsoft Edge";
  else if (/Chrome/i.test(userAgent)) browser = "Google Chrome";
  else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = "Apple Safari";
  else if (/Firefox/i.test(userAgent)) browser = "Mozilla Firefox";

  return `${browser} on ${os}`;
}
