const API_URL = import.meta.env.VITE_API_URL || "";

function apiOrigin() {
  if (!API_URL) return "";
  try {
    return new URL(API_URL).origin;
  } catch {
    return "";
  }
}

export function resolveUserImageSrc(raw) {
  const s = typeof raw === "string" ? raw.trim() : "";
  if (!s) return "";
  if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:") || s.startsWith("blob:"))
    return s;
  if (s.startsWith("/")) {
    const origin = apiOrigin();
    return origin ? `${origin}${s}` : s;
  }
  return s;
}

export function userProfileImageRaw(user) {
  if (!user || typeof user !== "object") return "";
  const raw = user.image;
  return typeof raw === "string" ? raw.trim() : "";
}

export function userProfileImageUrl(user) {
  return resolveUserImageSrc(userProfileImageRaw(user));
}

export function normalizeUser(user) {
  if (!user || typeof user !== "object") return user;
  const raw = userProfileImageRaw(user);
  return { ...user, image: raw || null };
}
