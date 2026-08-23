import { headers } from "next/headers";
import { getSupabaseAdmin } from "../supabase-server";
import { lookupGeo } from "../geo";
import type { VisitPayload } from "../schemas";

export function getClientIp(h: Headers): string {
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = h.get("x-real-ip");
  if (real) return real.trim();
  const vercel = h.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return "";
}

function parseHintBrand(secChUa: string | undefined): string | null {
  if (!secChUa) return null;
  const parts = secChUa.split(",");
  for (const part of parts) {
    const m = part.match(/^\s*"([^"]+)"/);
    if (!m) continue;
    const brand = m[1];
    if (/^not/i.test(brand)) continue;
    const map: Record<string, string> = {
      "Google Chrome": "Chrome",
      "Microsoft Edge": "Edge",
      Chromium: "Chromium",
      Brave: "Brave",
      Opera: "Opera",
      Firefox: "Firefox",
      Safari: "Safari",
    };
    return map[brand] ?? brand;
  }
  return null;
}

function parseHintModel(secChUaModel: string | undefined): string | null {
  if (!secChUaModel) return null;
  const m = secChUaModel.match(/^\s*"?([^"]+)"?\s*$/);
  if (!m || !m[1]) return null;
  const model = m[1].trim();
  return model && model !== "0" ? model : null;
}

function inferVendor(model: string | null | undefined): string | null {
  if (!model) return null;
  if (/pixel|nexus/i.test(model)) return "Google";
  if (/iphone|ipad|ipod|macbook|imac|apple/i.test(model)) return "Apple";
  if (/galaxy|sm-[a-z0-9]/i.test(model)) return "Samsung";
  if (/redmi|poco|xiaomi| mi |mi [0-9]/i.test(model)) return "Xiaomi";
  if (/oneplus/i.test(model)) return "OnePlus";
  if (/huawei|honor/i.test(model)) return "Huawei";
  if (/oppo/i.test(model)) return "Oppo";
  if (/realme/i.test(model)) return "Realme";
  if (/vivo/i.test(model)) return "Vivo";
  if (/moto|motorola/i.test(model)) return "Motorola";
  if (/nokia/i.test(model)) return "Nokia";
  return null;
}

export async function createVisit(payload?: Partial<VisitPayload>, userId?: string | null): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const h = await headers();
  const ip = getClientIp(h);
  const geo = await lookupGeo(ip);
  const ua = payload?.userAgent || h.get("user-agent") || "";

  const hintKeys = [
    "sec-ch-ua",
    "sec-ch-ua-mobile",
    "sec-ch-ua-platform",
    "sec-ch-ua-platform-version",
    "sec-ch-ua-model",
    "sec-ch-ua-full-version",
    "sec-ch-ua-full-version-list",
    "sec-ch-ua-arch",
    "sec-ch-ua-bitness",
  ];
  const clientHints: Record<string, string> = {};
  for (const key of hintKeys) {
    const value = h.get(key);
    if (value) clientHints[key] = value;
  }

  const hintBrand = parseHintBrand(clientHints["sec-ch-ua"]);
  const hintModel = parseHintModel(clientHints["sec-ch-ua-model"]);
  const deviceModel = hintModel ?? payload?.uaModel ?? payload?.deviceModel ?? null;
  const deviceVendor = payload?.deviceVendor || inferVendor(deviceModel) || null;
  const browserName = hintBrand ?? payload?.browser ?? null;

  const row = {
    user_id: userId ?? null,
    ip: ip || null,
    country: geo?.country ?? null,
    country_code: geo?.countryCode ?? null,
    region: geo?.region ?? null,
    region_code: geo?.regionCode ?? null,
    city: geo?.city ?? null,
    postal: geo?.postal ?? null,
    latitude: geo?.latitude ?? null,
    longitude: geo?.longitude ?? null,
    timezone: geo?.timezone ?? payload?.timezone ?? null,
    utc_offset: geo?.utcOffset ?? null,
    isp: geo?.isp ?? null,
    org: geo?.org ?? null,
    asn: geo?.asn ?? null,
    connection_type: geo?.connectionType ?? null,
    currency: geo?.currency ?? null,
    languages: geo?.languages ?? null,
    user_agent: ua || null,
    browser: browserName,
    browser_version: payload?.browserVersion ?? null,
    os: payload?.os ?? null,
    os_version: payload?.osVersion ?? null,
    device_type: payload?.deviceType ?? null,
    device_vendor: deviceVendor,
    device_model: deviceModel,
    platform: payload?.platform ?? null,
    screen_width: payload?.screenWidth ?? null,
    screen_height: payload?.screenHeight ?? null,
    viewport_width: payload?.viewportWidth ?? null,
    viewport_height: payload?.viewportHeight ?? null,
    device_pixel_ratio: payload?.devicePixelRatio ?? null,
    color_depth: payload?.colorDepth ?? null,
    language: payload?.language ?? h.get("accept-language") ?? null,
    languages_arr: payload?.languages ?? null,
    touch_points: payload?.touchPoints ?? null,
    hardware_concurrency: payload?.hardwareConcurrency ?? null,
    device_memory: payload?.deviceMemory ?? null,
    network_type: payload?.networkType ?? null,
    network_downlink: payload?.networkDownlink ?? null,
    network_rtt: payload?.networkRtt ?? null,
    network_save_data: payload?.networkSaveData ?? null,
    cookie_enabled: payload?.cookieEnabled ?? null,
    do_not_track: payload?.doNotTrack ?? h.get("dnt") ?? null,
    referrer: payload?.referrer || h.get("referer") || null,
    online: payload?.online ?? null,
    webdriver: payload?.webdriver ?? null,
    orientation: payload?.orientation ?? null,
    ua_brands: payload?.uaBrands ?? null,
    ua_mobile: payload?.uaMobile ?? null,
    ua_platform: payload?.uaPlatform ?? null,
    ua_model: payload?.uaModel ?? null,
    ua_full_version: payload?.uaFullVersion ?? null,
    ua_platform_version: payload?.uaPlatformVersion ?? null,
    ua_arch: payload?.uaArch ?? null,
    ua_bitness: payload?.uaBitness ?? null,
    client_hints: Object.keys(clientHints).length > 0 ? clientHints : null,
    raw_client: payload && Object.keys(payload).length > 0 ? (payload as unknown as Record<string, unknown>) : null,
    geo_raw: geo?.raw ?? null,
  };

  const { data, error } = await supabase.from("visits").insert(row).select("id").single();
  if (error) {
    console.error("visit insert failed:", error.message);
    return null;
  }
  return data?.id ?? null;
}
