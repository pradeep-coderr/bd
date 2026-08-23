"use client";

export interface ClientMeta {
  userAgent: string;
  platform: string;
  deviceType: string;
  deviceVendor: string;
  deviceModel: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  language: string;
  languages: string[];
  timezone: string;
  touchPoints: number;
  hardwareConcurrency: number;
  deviceMemory?: number;
  networkType?: string;
  networkDownlink?: number;
  networkRtt?: number;
  networkSaveData?: boolean;
  cookieEnabled: boolean;
  doNotTrack?: string;
  referrer: string;
  online: boolean;
  webdriver: boolean;
  orientation: string;
  uaBrands?: string;
  uaMobile?: boolean;
  uaPlatform?: string;
  uaModel?: string;
  uaFullVersion?: string;
  uaPlatformVersion?: string;
  uaArch?: string;
  uaBitness?: string;
}

function detectDeviceType(ua: string): string {
  if (/smart[- ]?tv|hbbtv|appletv|googletv|roku|chromecast|netcast|viera/i.test(ua)) return "tv";
  if (/tablet|ipad|playbook|silk|kindle/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) return "tablet";
  if (/mobile|iphone|ipod|android|windows phone|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

function detectBrowser(ua: string): { name: string; version: string } {
  const m =
    ua.match(/(edga|edgios|edg)\/([\d.]+)/i) ||
    ua.match(/(opr|opera mini|opera)\/([\d.]+)/i) ||
    ua.match(/(samsungbrowser)\/([\d.]+)/i) ||
    ua.match(/(crios)\/([\d.]+)/i) ||
    ua.match(/(chrome)\/([\d.]+)/i) ||
    ua.match(/(fxios|firefox)\/([\d.]+)/i) ||
    ua.match(/version\/([\d.]+).*(mobile|safari)/i) ||
    ua.match(/(instagram)\/([\d.]+)/i) ||
    ua.match(/(ucbrowser)\/([\d.]+)/i);
  if (!m) return { name: "unknown", version: "" };
  const name = m[1].toLowerCase();
  const map: Record<string, string> = {
    edga: "Edge", edgios: "Edge iOS", edg: "Edge",
    opr: "Opera", "opera mini": "Opera Mini", opera: "Opera",
    samsungbrowser: "Samsung Internet",
    crios: "Chrome iOS", chrome: "Chrome",
    fxios: "Firefox iOS", firefox: "Firefox",
    mobile: "Safari", safari: "Safari",
    instagram: "Instagram", ucbrowser: "UC Browser",
  };
  return { name: map[name] || name, version: m[2] || "" };
}

function detectOS(ua: string): { name: string; version: string } {
  const win = ua.match(/windows nt ([\d.]+)/i);
  if (win) {
    const v = win[1];
    const label =
      v === "10.0" ? (ua.includes("Win64; x64") ? "Windows 10/11" : "Windows 10") :
      v === "6.3" ? "Windows 8.1" :
      v === "6.2" ? "Windows 8" :
      v === "6.1" ? "Windows 7" : `Windows NT ${v}`;
    return { name: "Windows", version: label };
  }
  const mac = ua.match(/mac os x ([\d_]+)/i);
  if (mac) return { name: "macOS", version: mac[1].replace(/_/g, ".") };
  const ios = ua.match(/(?:iphone|ipad|ipod).*?os ([\d_]+)/i);
  if (ios) return { name: "iOS", version: ios[1].replace(/_/g, ".") };
  const android = ua.match(/android ([\d.]+)/i);
  if (android) return { name: "Android", version: android[1] };
  if (/cros/i.test(ua)) return { name: "ChromeOS", version: "" };
  if (/linux/i.test(ua)) return { name: "Linux", version: "" };
  return { name: "unknown", version: "" };
}

function detectDeviceVendor(ua: string): string {
  const vendors = ["Samsung", "Huawei", "Xiaomi", "Redmi", "OnePlus", "Oppo", "Vivo", "Realme", "Motorola", "Nokia", "LG", "Sony", "Google", "Honor", "Infinix", "Tecno", "Asus", "Lenovo", "ZTE", "Nothing"];
  const lower = ua.toLowerCase();
  for (const v of vendors) if (lower.includes(v.toLowerCase())) return v;
  if (/iphone|ipad|ipod/i.test(ua)) return "Apple";
  if (/windows phone/i.test(ua)) return "Microsoft";
  return "";
}

function detectDeviceModel(ua: string): string {
  const ios = ua.match(/\((iphone|ipad|ipod)[^;]*/i);
  if (ios) return ios[0].replace(/^\(/, "").trim();
  const android = ua.match(/;\s*([a-z0-9][a-z0-9 _\-.]*)\s+build\//i);
  if (android) return android[1].trim();
  const pixel = ua.match(/;\s*(pixel[^;)]*)/i);
  if (pixel) return pixel[1].trim();
  return "";
}

export async function collectClientMeta(): Promise<ClientMeta> {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const nav = typeof navigator !== "undefined" ? navigator : null;
  const conn = nav && "connection" in nav ? (nav as unknown as { connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection : undefined;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const browser = detectBrowser(ua);
  const os = detectOS(ua);
  const uad = nav && "userAgentData" in nav
    ? (nav as unknown as {
        userAgentData?: {
          brands?: { brand: string; version: string }[];
          mobile?: boolean;
          platform?: string;
          model?: string;
          uaFullVersion?: string;
          getHighEntropyValues?: (hints: string[]) => Promise<{
            model?: string;
            platformVersion?: string;
            architecture?: string;
            bitness?: string;
            uaFullVersion?: string;
            fullVersionList?: { brand: string; version: string }[];
          }>;
        };
      }).userAgentData
    : undefined;
  const orientation =
    typeof screen !== "undefined" && "orientation" in screen
      ? (screen as unknown as { orientation?: { type?: string } }).orientation?.type || ""
      : "";

  let highEntropy: {
    model?: string;
    platformVersion?: string;
    architecture?: string;
    bitness?: string;
    uaFullVersion?: string;
  } | null = null;
  if (uad?.getHighEntropyValues) {
    try {
      highEntropy = await uad.getHighEntropyValues(["model", "platformVersion", "architecture", "bitness", "uaFullVersion"]);
    } catch {
      highEntropy = null;
    }
  }

  const dntRaw = nav && "doNotTrack" in nav ? (nav as unknown as { doNotTrack?: string | null }).doNotTrack : undefined;

  return {
    userAgent: ua,
    platform: nav?.platform || "",
    deviceType: detectDeviceType(ua),
    deviceVendor: detectDeviceVendor(ua),
    deviceModel: detectDeviceModel(ua),
    browser: browser.name,
    browserVersion: browser.version,
    os: os.name,
    osVersion: os.version,
    screenWidth: typeof screen !== "undefined" ? screen.width : 0,
    screenHeight: typeof screen !== "undefined" ? screen.height : 0,
    viewportWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    colorDepth: typeof screen !== "undefined" ? screen.colorDepth || 0 : 0,
    language: nav?.language || "",
    languages: nav?.languages ? Array.from(nav.languages) : [],
    timezone,
    touchPoints: nav?.maxTouchPoints ?? 0,
    hardwareConcurrency: nav?.hardwareConcurrency ?? 0,
    deviceMemory: nav && "deviceMemory" in nav ? (nav as unknown as { deviceMemory?: number }).deviceMemory : undefined,
    networkType: conn?.effectiveType,
    networkDownlink: conn?.downlink,
    networkRtt: conn?.rtt,
    networkSaveData: conn?.saveData,
    cookieEnabled: nav?.cookieEnabled ?? false,
    doNotTrack: dntRaw ? String(dntRaw) : undefined,
    referrer: typeof document !== "undefined" ? document.referrer : "",
    online: nav?.onLine ?? false,
    webdriver: nav && "webdriver" in nav ? Boolean((nav as unknown as { webdriver?: boolean }).webdriver) : false,
    orientation,
    uaBrands: uad?.brands ? JSON.stringify(uad.brands) : undefined,
    uaMobile: uad?.mobile,
    uaPlatform: uad?.platform,
    uaModel: uad?.model || highEntropy?.model || undefined,
    uaFullVersion: uad?.uaFullVersion || highEntropy?.uaFullVersion || undefined,
    uaPlatformVersion: highEntropy?.platformVersion || undefined,
    uaArch: highEntropy?.architecture || undefined,
    uaBitness: highEntropy?.bitness || undefined,
  };
}
