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
    browser: payload?.browser ?? null,
    browser_version: payload?.browserVersion ?? null,
    os: payload?.os ?? null,
    os_version: payload?.osVersion ?? null,
    device_type: payload?.deviceType ?? null,
    device_vendor: payload?.deviceVendor ?? null,
    device_model: payload?.deviceModel ?? null,
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
