import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { 
  checkGuildPermissions, 
  buildBotInviteUrl, 
  getDiscordAvatarUrl, 
  getDiscordIconUrl,
  getEffectiveClientId,
  fetchBotUser,
  fetchBotGuildIds,
  fetchDiscordChannels,
  fetchDiscordRoles
} from './server/discordHelper';
import { getOrCreateGuildConfig, saveGuildConfig, getAllGuildConfigs, getBotStats, updateBotStats } from './server/storage';
import { DiscordUser, DiscordGuild, DiscordChannel, DiscordRole } from './src/types';

// In-memory token/session store
interface UserSession {
  user: DiscordUser;
  accessToken?: string;
  isDemo?: boolean;
}
const sessions = new Map<string, UserSession>();

// Bot user caching
let cachedBotUser: { id: string; username: string; avatar: string | null } | null = null;
let lastBotUserFetch = 0;

async function getLiveBotUser() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return null;
  if (cachedBotUser && Date.now() - lastBotUserFetch < 60000) {
    return cachedBotUser;
  }
  const bot = await fetchBotUser(token);
  if (bot) {
    cachedBotUser = bot;
    lastBotUserFetch = Date.now();
    updateBotStats({ botName: `${bot.username}` });
  }
  return cachedBotUser;
}

function getRedirectUri(req: express.Request): string {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    const base = process.env.APP_URL.replace(/\/$/, '');
    return `${base}/auth/callback`;
  }
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  return `${protocol}://${host}/auth/callback`;
}

// Sample demo guilds for preview testing when no Discord credentials are set
const DEMO_GUILDS: DiscordGuild[] = [
  {
    id: '1001',
    name: 'Nexus Command Central',
    icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    owner: true,
    permissions: '8', // Administrator
    features: ['COMMUNITY', 'VANITY_URL', 'INVITE_SPLASH'],
    approximateMemberCount: 14280,
    isAdmin: true,
    canManage: true,
    botPresent: true,
  },
  {
    id: '1002',
    name: 'Aether Gaming Esports',
    icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=128&auto=format&fit=crop&q=80',
    owner: false,
    permissions: '32', // Manage Guild
    features: ['COMMUNITY', 'ROLE_SUBSCRIPTIONS'],
    approximateMemberCount: 5620,
    isAdmin: false,
    canManage: true,
    botPresent: true,
  },
  {
    id: '1003',
    name: 'Cybernetic Developers Club',
    icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=128&auto=format&fit=crop&q=80',
    owner: true,
    permissions: '8', // Administrator
    features: ['COMMUNITY'],
    approximateMemberCount: 1890,
    isAdmin: true,
    canManage: true,
    botPresent: true,
  },
  {
    id: '1004',
    name: 'The Orbital Lounge',
    icon: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=128&auto=format&fit=crop&q=80',
    owner: false,
    permissions: '32', // Manage Guild
    features: [],
    approximateMemberCount: 420,
    isAdmin: false,
    canManage: true,
    botPresent: false, // Not yet invited -> shows Invite button!
  },
  {
    id: '1005',
    name: 'Public Community Hangout',
    icon: null,
    owner: false,
    permissions: '104324673', // Normal user without Manage Server
    features: [],
    approximateMemberCount: 32900,
    isAdmin: false,
    canManage: false,
    botPresent: true,
  },
];

const DEMO_USER: DiscordUser = {
  id: '88392019482019284',
  username: 'NexusCommander',
  discriminator: '0',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
  banner: null,
  isDemo: true,
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || process.env.SERVER_PORT || 3000);

  app.use(express.json());
  app.use(cookieParser());

  // GuildNexus WebDashboard is served by this same Express application.
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));
  app.get(['/dashboard', '/dashboard/', '/dashboard/index.html'], (req, res) => {
    res.sendFile(path.join(publicPath, 'dashboard', 'index.html'));
  });

  // Helper middleware to get session
  const getSession = (req: express.Request): UserSession | null => {
    const sessionId = req.cookies?.nexus_session;
    if (!sessionId) return null;
    return sessions.get(sessionId) || null;
  };

  // ----------------------------------------------------
  // API Routes
  // ----------------------------------------------------

  // 1. Auth Status Endpoint
  app.get('/api/auth/status', async (req, res) => {
    const effectiveClientId = getEffectiveClientId();
    const isConfigured = Boolean(effectiveClientId && process.env.DISCORD_CLIENT_SECRET);
    const callbackUrl = getRedirectUri(req);
    const inviteUrl = buildBotInviteUrl(effectiveClientId || undefined);

    const session = getSession(req);
    const botUser = await getLiveBotUser();

    res.json({
      authenticated: Boolean(session),
      user: session ? session.user : null,
      isConfigured,
      clientId: effectiveClientId,
      callbackUrl,
      inviteUrl,
      credentialsStatus: {
        hasClientId: Boolean(effectiveClientId),
        hasClientSecret: Boolean(process.env.DISCORD_CLIENT_SECRET),
        hasBotToken: Boolean(process.env.DISCORD_BOT_TOKEN),
        botUser,
      },
    });
  });

  // 2. OAuth URL endpoint (for popups)
  app.get('/api/auth/url', (req, res) => {
    const clientId = getEffectiveClientId();
    const redirectUri = getRedirectUri(req);

    if (!clientId) {
      return res.json({
        url: null,
        isConfigured: false,
        message: 'Discord Client ID not configured. Set DISCORD_CLIENT_ID or DISCORD_BOT_TOKEN in settings.',
        callbackUrl: redirectUri,
      });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify guilds',
      prompt: 'consent',
    });

    const url = `https://discord.com/oauth2/authorize?${params.toString()}`;
    res.json({
      url,
      isConfigured: true,
      callbackUrl: redirectUri,
    });
  });

  // 3. OAuth Callback handler (Popup target)
  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const code = req.query.code as string | undefined;
    const clientId = getEffectiveClientId();
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = getRedirectUri(req);

    if (!code || !clientId || !clientSecret) {
      return res.send(`
        <html>
          <body style="background:#090d16;color:#e2e8f0;font-family:sans-serif;padding:30px;text-align:center;">
            <h2 style="color:#ef4444;">OAuth Authentication Failed</h2>
            <p>${!code ? 'Missing authorization code.' : 'Discord client credentials not configured.'}</p>
            <script>
              setTimeout(() => { if (window.opener) window.close(); }, 3500);
            </script>
          </body>
        </html>
      `);
    }

    try {
      // Exchange code for token with Discord OAuth2 endpoint
      const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Discord token exchange error:', errorText);
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Fetch user profile from Discord
      const userRes = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();

      const user: DiscordUser = {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator || '0',
        avatar: getDiscordAvatarUrl(userData.id, userData.avatar, userData.discriminator),
        banner: userData.banner ? `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}.png` : null,
        accentColor: userData.accent_color,
        email: userData.email,
        isDemo: false,
      };

      // Create session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessions.set(sessionId, {
        user,
        accessToken,
        isDemo: false,
      });

      // Set cookie according to AI Studio iframe constraints: SameSite=None, Secure=true
      res.cookie('nexus_session', sessionId, {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Notify parent iframe and close popup
      return res.send(`
        <html>
          <body style="background:#090d16;color:#e2e8f0;font-family:sans-serif;padding:30px;text-align:center;">
            <h2 style="color:#22c55e;">Authentication Successful!</h2>
            <p>Closing window and syncing with GuildNexus...</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Discord callback error:', err);
      return res.send(`
        <html>
          <body style="background:#090d16;color:#e2e8f0;font-family:sans-serif;padding:30px;text-align:center;">
            <h2 style="color:#ef4444;">Login Error</h2>
            <p>${err.message || 'Unable to complete Discord login'}</p>
            <script>
              setTimeout(() => { if (window.opener) window.close(); }, 3500);
            </script>
          </body>
        </html>
      `);
    }
  });

  // 4. Demo Login endpoint (instant test login)
  app.post('/api/auth/demo', (req, res) => {
    const sessionId = `demo_session_${Date.now()}`;
    sessions.set(sessionId, {
      user: DEMO_USER,
      isDemo: true,
    });

    res.cookie('nexus_session', sessionId, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: DEMO_USER,
    });
  });

  // 5. Logout endpoint
  app.post('/api/auth/logout', (req, res) => {
    const sessionId = req.cookies?.nexus_session;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.clearCookie('nexus_session', {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    });
    res.json({ success: true });
  });

  // 6. User's Guilds endpoint (evaluates permissions with discord.js PermissionsBitField)
  app.get('/api/guilds', async (req, res) => {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }

    const effectiveClientId = getEffectiveClientId();

    // Fetch bot guild IDs if bot token is present
    let botGuildIds: Set<string> | null = null;
    if (process.env.DISCORD_BOT_TOKEN) {
      botGuildIds = await fetchBotGuildIds(process.env.DISCORD_BOT_TOKEN);
    }

    // If demo session, return DEMO_GUILDS
    if (session.isDemo || !session.accessToken) {
      const guildsWithInvite = DEMO_GUILDS.map((g) => ({
        ...g,
        botPresent: botGuildIds ? (botGuildIds.has(g.id) || g.botPresent) : g.botPresent,
        inviteUrl: buildBotInviteUrl(effectiveClientId || undefined, g.id),
      }));
      return res.json({ guilds: guildsWithInvite });
    }

    try {
      // Fetch user's actual guilds from Discord API
      const discordGuildsRes = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      if (!discordGuildsRes.ok) {
        throw new Error('Failed to fetch guilds from Discord API');
      }

      const rawGuilds = await discordGuildsRes.json();

      // Process guilds and calculate permissions using discord.js helper
      const processedGuilds: DiscordGuild[] = rawGuilds.map((g: any) => {
        const perms = checkGuildPermissions(g.permissions);
        const iconUrl = getDiscordIconUrl(g.id, g.icon);

        return {
          id: g.id,
          name: g.name,
          icon: iconUrl,
          owner: Boolean(g.owner),
          permissions: g.permissions,
          features: g.features || [],
          isAdmin: perms.isAdmin,
          canManage: perms.canManage,
          botPresent: botGuildIds ? botGuildIds.has(g.id) : true,
          inviteUrl: buildBotInviteUrl(effectiveClientId || undefined, g.id),
        };
      });

      // Sort: Configurable (canManage) first, then alphabetical
      processedGuilds.sort((a, b) => {
        if (a.canManage && !b.canManage) return -1;
        if (!a.canManage && b.canManage) return 1;
        return a.name.localeCompare(b.name);
      });

      res.json({ guilds: processedGuilds });
    } catch (err: any) {
      console.error('Error fetching Discord guilds:', err);
      // Fallback to demo guilds if Discord token expires
      res.json({ guilds: DEMO_GUILDS });
    }
  });

  // 7. Get Guild Configuration
  app.get('/api/guilds/:guildId/config', (req, res) => {
    const { guildId } = req.params;
    const guildName = (req.query.guildName as string) || 'Server';
    const config = getOrCreateGuildConfig(guildId, guildName);
    res.json(config);
  });

  // 7b. Get Guild Discord Data (Channels, Roles, Bot status)
  app.get('/api/guilds/:guildId/discord-data', async (req, res) => {
    const { guildId } = req.params;
    const token = process.env.DISCORD_BOT_TOKEN;

    let channels: DiscordChannel[] = [];
    let roles: DiscordRole[] = [];
    let isLive = false;

    if (token) {
      try {
        const [fetchedChannels, fetchedRoles] = await Promise.all([
          fetchDiscordChannels(token, guildId),
          fetchDiscordRoles(token, guildId),
        ]);

        if (fetchedChannels.length > 0 || fetchedRoles.length > 0) {
          channels = fetchedChannels;
          roles = fetchedRoles;
          isLive = true;
        }
      } catch (err) {
        console.warn('Error querying live Discord data:', err);
      }
    }

    // Fallback defaults if bot isn't in server or no bot token
    if (channels.length === 0) {
      channels = [
        { id: 'welcome-and-rules', name: 'welcome-and-rules', type: 0 },
        { id: 'general-chat', name: 'general-chat', type: 0 },
        { id: 'announcements', name: 'announcements', type: 5 },
        { id: 'bot-commands', name: 'bot-commands', type: 0 },
        { id: 'level-ups', name: 'level-ups', type: 0 },
        { id: 'mod-logs', name: 'mod-logs', type: 0 },
        { id: 'goodbyes', name: 'goodbyes', type: 0 },
        { id: 'tickets', name: 'support-tickets', type: 0 },
      ];
    }

    if (roles.length === 0) {
      roles = [
        { id: 'role-everyone', name: '@everyone', color: 0, hexColor: '#99AAB5', position: 0 },
        { id: 'role-member', name: 'Member', color: 3447003, hexColor: '#3498DB', position: 1 },
        { id: 'role-vip', name: 'VIP Supporter', color: 15844367, hexColor: '#F1C40F', position: 2 },
        { id: 'role-veteran', name: 'Level 5 Veteran', color: 10181046, hexColor: '#9B59B6', position: 3 },
        { id: 'role-champion', name: 'Level 10 Champion', color: 15158332, hexColor: '#E74C3C', position: 4 },
        { id: 'role-moderator', name: 'Moderator', color: 3066993, hexColor: '#2ECC71', position: 5 },
        { id: 'role-muted', name: 'Muted', color: 7506394, hexColor: '#7289DA', position: 6 },
      ];
    }

    res.json({
      channels,
      roles,
      isLive,
    });
  });

  // 8. Update Guild Configuration (Frontend saving changes)
  app.put('/api/guilds/:guildId/config', (req, res) => {
    const { guildId } = req.params;
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = req.body;
    const updated = saveGuildConfig(guildId, payload);
    res.json({
      success: true,
      config: updated,
      message: 'Server configuration updated and synced with GuildNexus bot engine.',
    });
  });

  // ----------------------------------------------------
  // Dedicated Bot Sync Endpoints (Where the bot gets its configurations)
  // ----------------------------------------------------

  // A. Bot fetches configuration for a specific guild
  app.get('/api/bot/sync/:guildId', (req, res) => {
    const { guildId } = req.params;
    const authHeader = req.headers.authorization;
    const syncSecret = process.env.BOT_SYNC_SECRET;

    if (syncSecret && authHeader !== `Bearer ${syncSecret}`) {
      // Optional security check for bot
      return res.status(401).json({ error: 'Unauthorized bot sync request' });
    }

    const config = getOrCreateGuildConfig(guildId);
    res.json({
      status: 'ok',
      syncedAt: new Date().toISOString(),
      config,
    });
  });

  // B. Bot fetches all configurations in bulk on startup
  app.get('/api/bot/sync', (req, res) => {
    const authHeader = req.headers.authorization;
    const syncSecret = process.env.BOT_SYNC_SECRET;

    if (syncSecret && authHeader !== `Bearer ${syncSecret}`) {
      return res.status(401).json({ error: 'Unauthorized bot sync request' });
    }

    const allConfigs = getAllGuildConfigs();
    res.json({
      status: 'ok',
      totalGuilds: Object.keys(allConfigs).length,
      syncedAt: new Date().toISOString(),
      configs: allConfigs,
    });
  });

  // C. Bot Heartbeat / Telemetry (Where the bot reports live stats)
  app.post('/api/bot/telemetry', (req, res) => {
    const incomingStats = req.body;
    const updated = updateBotStats(incomingStats);
    res.json({ success: true, stats: updated });
  });

  // 9. Real-time Statistics Endpoint (Server-Sent Events)
  app.get('/api/stats/realtime', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send immediate stats
    res.write(`data: ${JSON.stringify(getBotStats())}\n\n`);

    // Stream updates every 2 seconds
    const interval = setInterval(() => {
      res.write(`data: ${JSON.stringify(getBotStats())}\n\n`);
    }, 2000);

    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  });

  // 10. Bot Invite URL Generator
  app.get('/api/bot/invite', (req, res) => {
    const guildId = req.query.guild_id as string | undefined;
    const clientId = getEffectiveClientId();
    const inviteUrl = buildBotInviteUrl(clientId || undefined, guildId);
    res.json({ inviteUrl, clientId: clientId || null });
  });

  // ----------------------------------------------------
  // Vite Integration
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GuildNexus dashboard running on port ${PORT}`);
  });
}

startServer();
