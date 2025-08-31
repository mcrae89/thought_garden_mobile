import { decode as b64decode } from "base-64";

export function getJwtExpMs(token?: string): number {
  if (!token) return 0;
  const part = token.split(".")[1];
  if (!part) return 0;
  try {
    const json = JSON.parse(b64decode(part.replace(/-/g, "+").replace(/_/g, "/")));
    return (json?.exp ? json.exp * 1000 : 0);
  } catch { return 0; }
}

export function isJwtExpiringSoon(token?: string, skewMs = 60_000): boolean {
  const expMs = getJwtExpMs(token);
  return !expMs || Date.now() + skewMs >= expMs;
}
