import { z } from "zod";

export const answersPayloadSchema = z.object({
  visitId: z.string().uuid().nullish(),
  answers: z
    .array(
      z.object({
        question: z.string().min(1).max(500),
        answer: z.string().min(1).max(5000),
      })
    )
    .min(1)
    .max(50),
});

export const feelingPayloadSchema = z.object({
  visitId: z.string().uuid().nullish(),
  text: z.string().trim().min(1, "Write something first ❤️").max(2000),
});

export const visitPayloadSchema = z.object({
  userAgent: z.string().max(2000).optional(),
  platform: z.string().max(100).optional(),
  deviceType: z.string().max(50).optional(),
  deviceVendor: z.string().max(50).optional(),
  deviceModel: z.string().max(200).optional(),
  browser: z.string().max(50).optional(),
  browserVersion: z.string().max(50).optional(),
  os: z.string().max(50).optional(),
  osVersion: z.string().max(100).optional(),
  screenWidth: z.number().int().nonnegative().max(10000).optional(),
  screenHeight: z.number().int().nonnegative().max(10000).optional(),
  viewportWidth: z.number().int().nonnegative().max(10000).optional(),
  viewportHeight: z.number().int().nonnegative().max(10000).optional(),
  devicePixelRatio: z.number().nonnegative().max(100).optional(),
  colorDepth: z.number().int().nonnegative().max(64).optional(),
  language: z.string().max(50).optional(),
  languages: z.array(z.string().max(50)).max(50).optional(),
  timezone: z.string().max(100).optional(),
  touchPoints: z.number().int().nonnegative().max(100).optional(),
  hardwareConcurrency: z.number().int().nonnegative().max(512).optional(),
  deviceMemory: z.number().nonnegative().max(256).optional(),
  networkType: z.string().max(50).optional(),
  networkDownlink: z.number().nonnegative().max(10000).optional(),
  networkRtt: z.number().int().nonnegative().max(60000).optional(),
  networkSaveData: z.boolean().optional(),
  cookieEnabled: z.boolean().optional(),
  doNotTrack: z.string().max(20).optional(),
  referrer: z.string().max(2000).optional(),
  online: z.boolean().optional(),
  webdriver: z.boolean().optional(),
  orientation: z.string().max(50).optional(),
  uaBrands: z.string().max(2000).optional(),
  uaMobile: z.boolean().optional(),
  uaPlatform: z.string().max(100).optional(),
  uaModel: z.string().max(200).optional(),
  uaFullVersion: z.string().max(100).optional(),
  uaPlatformVersion: z.string().max(100).optional(),
  uaArch: z.string().max(50).optional(),
  uaBitness: z.string().max(20).optional(),
});

export type VisitPayload = z.infer<typeof visitPayloadSchema>;
export type AnswersPayload = z.infer<typeof answersPayloadSchema>;
export type FeelingPayload = z.infer<typeof feelingPayloadSchema>;
