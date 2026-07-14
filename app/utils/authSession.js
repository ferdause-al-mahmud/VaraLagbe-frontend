const STORAGE_KEY = "varalagbe_auth_session";

let authSession = readStoredSession();

function getStorage() {
  if (typeof globalThis === "undefined") return null;
  return globalThis.localStorage || globalThis.sessionStorage || null;
}

function normalizeUser(user) {
  if (!user) return null;
  const id = user._id || user.id;
  return {
    ...user,
    _id: id,
    id,
  };
}

function readStoredSession() {
  try {
    const storage = getStorage();
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token ?? null,
      user: normalizeUser(parsed?.user),
    };
  } catch (_error) {
    return { token: null, user: null };
  }
}

function persistSession(session) {
  try {
    const storage = getStorage();
    if (!storage) return;

    if (!session?.token || !session?.user) {
      storage.removeItem(STORAGE_KEY);
      return;
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (_error) {
    // Storage is best-effort; native builds can keep the in-memory session.
  }
}

export function setAuthSession(session) {
  authSession = {
    token: session?.token ?? null,
    user: normalizeUser(session?.user),
  };
  persistSession(authSession);
}

export function getAuthSession() {
  if (!authSession.token) {
    authSession = readStoredSession();
  }
  return authSession;
}

export function getAuthUserId() {
  const { user } = getAuthSession();
  return user?._id || user?.id || null;
}

export function getRoleHomePath(role) {
  if (role === "admin") return "/admin-dashboard";
  if (role === "owner") return "/dashboard";
  return "/tabs/home";
}

export function clearAuthSession() {
  authSession = {
    token: null,
    user: null,
  };
  persistSession(authSession);
}

