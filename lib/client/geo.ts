"use client";

export interface PreciseGeo {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function getPreciseLocation(): Promise<PreciseGeo | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      resolve(null);
      return;
    }
    const done = (value: PreciseGeo | null) => {
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => done(null), 10000);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        done({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        }),
      () => done(null),
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 300000 }
    );
  });
}
