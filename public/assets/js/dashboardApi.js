async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;
  try { data = await response.json(); } catch {}

  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('guildnexus_nyxeclipse_session');
    throw new Error(data?.error || `GuildNexus API request failed (${response.status}).`);
  }
  return data;
}

export const dashboardApi = {
  me: async () => {
    const data = await request('/api/dashboard/me');
    return { user: data.user };
  },

  guilds: async () => request('/api/dashboard/guilds'),

  guild: async (guildId) => {
    const data = await request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}`);
    return data;
  },

  resources: async (guildId) => request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/resources`),

  member: async (guildId, userId) => request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}`),

  auditLog: async (guildId, filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/audit-log${query ? `?${query}` : ''}`);
  },

  cases: async (guildId, filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/cases${query ? `?${query}` : ''}`);
  },

  updateLogging: async (guildId, patch) => request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/logging`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  }),

  updateConfig: async (guildId, patch) => {
    const data = await request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/config`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    return data.config || data;
  },
};

export function getSelectedGuildId() {
  return localStorage.getItem('guildnexus_selected_guild');
}

export function setSelectedGuildId(guildId) {
  if (guildId) localStorage.setItem('guildnexus_selected_guild', guildId);
  else localStorage.removeItem('guildnexus_selected_guild');
}
