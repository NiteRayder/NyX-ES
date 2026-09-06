const SESSION_KEY = 'guildnexus_nyxeclipse_session';

export function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function loginWithDiscord() {
  // NyxEclipse builds the Discord authorization URL server-side so the
  // client ID, redirect URI, and OAuth state are never hardcoded here.
  window.location.assign('/api/auth/discord');
}

export async function handleOAuthCallback() {
  const response = await fetch('/api/auth/session', {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) return null;

  const data = await response.json();
  if (!data.authenticated || !data.user) return null;

  const session = {
    authenticated: true,
    user: data.user,
    sessionToken: 'cookie-session',
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function refreshDashboardSession() {
  return handleOAuthCallback();
}

export async function fetchDiscordUser() {
  return getStoredSession()?.user || null;
}

export async function fetchManageableGuilds() {
  const response = await fetch('/api/dashboard/guilds', {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error('Unable to retrieve Discord servers.');
  return (await response.json()).guilds || [];
}

export async function logoutFromDiscord() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {});
  clearSession();
}

export function getBotInviteUrl(guildId) {
  const query = guildId ? `?guild_id=${encodeURIComponent(guildId)}` : '';
  return `/api/bot/invite${query}`;
}

export const NYXECLIPSE_API = '';
