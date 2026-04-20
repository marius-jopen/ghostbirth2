import "server-only";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

async function requireSingleton<T>(name: string, read: () => Promise<T | null>): Promise<T> {
  const value = await read();
  if (!value) throw new Error(`Missing Keystatic singleton "${name}". Visit /keystatic to create it.`);
  return value;
}

export const getSite = () =>
  requireSingleton("site", () => reader.singletons.site.read());
export const getHome = () =>
  requireSingleton("home", () => reader.singletons.home.read());
export const getPitch = () =>
  requireSingleton("pitch", () => reader.singletons.pitch.read());
export const getConnect = () =>
  requireSingleton("connect", () => reader.singletons.connect.read());

export type SiteContent = Awaited<ReturnType<typeof getSite>>;
export type HomeContent = Awaited<ReturnType<typeof getHome>>;
export type PitchContent = Awaited<ReturnType<typeof getPitch>>;
export type ConnectContent = Awaited<ReturnType<typeof getConnect>>;
