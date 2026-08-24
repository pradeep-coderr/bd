export interface GeoInfo {
  ip: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionCode?: string;
  city?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  utcOffset?: string;
  isp?: string;
  org?: string;
  asn?: string;
  connectionType?: string;
  currency?: string;
  languages?: string;
  raw?: Record<string, unknown>;
}

function isPublicIp(ip: string): boolean {
  if (!ip) return false;
  if (ip.includes(":")) {
    if (ip === "::1") return false;
    return !ip.toLowerCase().startsWith("fe80");
  }
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return false;
  if (parts[0] === 10) return false;
  if (parts[0] === 127) return false;
  if (parts[0] === 169 && parts[1] === 254) return false;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
  if (parts[0] === 192 && parts[1] === 168) return false;
  return true;
}

async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "bd-site/1.0", Accept: "application/json" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function lookupGeo(ip: string): Promise<GeoInfo | null> {
  if (!ip || !isPublicIp(ip)) return { ip };

  const ipapi = await fetchJson(`https://ipapi.co/${ip}/json/`);
  if (ipapi && !ipapi.error) {
    return {
      ip,
      country: typeof ipapi.country_name === "string" ? ipapi.country_name : undefined,
      countryCode: typeof ipapi.country_code === "string" ? ipapi.country_code : undefined,
      region: typeof ipapi.region === "string" ? ipapi.region : undefined,
      regionCode: typeof ipapi.region_code === "string" ? ipapi.region_code : undefined,
      city: typeof ipapi.city === "string" ? ipapi.city : undefined,
      postal: typeof ipapi.postal === "string" ? ipapi.postal : undefined,
      latitude: typeof ipapi.latitude === "number" ? ipapi.latitude : undefined,
      longitude: typeof ipapi.longitude === "number" ? ipapi.longitude : undefined,
      timezone: typeof ipapi.timezone === "string" ? ipapi.timezone : undefined,
      utcOffset: typeof ipapi.utc_offset === "string" ? ipapi.utc_offset : undefined,
      org: typeof ipapi.org === "string" ? ipapi.org : undefined,
      asn: typeof ipapi.asn === "string" ? ipapi.asn : undefined,
      currency: typeof ipapi.currency === "string" ? ipapi.currency : undefined,
      languages: typeof ipapi.languages === "string" ? ipapi.languages : undefined,
      raw: ipapi,
    };
  }

  const whois = await fetchJson(`https://ipwho.is/${ip}`);
  if (whois && whois.success === true) {
    const connection = (whois.connection ?? {}) as Record<string, unknown>;
    const tz = (whois.timezone ?? {}) as Record<string, unknown>;
    return {
      ip,
      country: typeof whois.country === "string" ? whois.country : undefined,
      countryCode: typeof whois.country_code === "string" ? whois.country_code : undefined,
      region: typeof whois.region === "string" ? whois.region : undefined,
      regionCode: typeof whois.region_code === "string" ? whois.region_code : undefined,
      city: typeof whois.city === "string" ? whois.city : undefined,
      postal: typeof whois.postal === "string" ? whois.postal : undefined,
      latitude: typeof whois.latitude === "number" ? whois.latitude : undefined,
      longitude: typeof whois.longitude === "number" ? whois.longitude : undefined,
      timezone: typeof tz.id === "string" ? tz.id : undefined,
      isp: typeof connection.isp === "string" ? connection.isp : undefined,
      org: typeof connection.org === "string" ? connection.org : undefined,
      asn: typeof connection.asn === "number" ? String(connection.asn) : undefined,
      connectionType: typeof whois.type === "string" ? whois.type : undefined,
      raw: whois,
    };
  }

  return { ip };
}
