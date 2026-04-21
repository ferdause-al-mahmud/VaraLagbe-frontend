let authSession = {
  token: null,
  user: null,
};

export function setAuthSession(session) {
  authSession = {
    token: session?.token ?? null,
    user: session?.user ?? null,
  };
}

export function getAuthSession() {
  return authSession;
}

export function clearAuthSession() {
  authSession = {
    token: null,
    user: null,
  };
}
