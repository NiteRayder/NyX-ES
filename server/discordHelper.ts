import { PermissionsBitField } from 'discord.js';

/**
 * Checks if a permissions bitfield string grants administrative or guild management permissions.
 */
export function checkGuildPermissions(permissionsStr: string | number | bigint) {
  try {
    const bitfield = new PermissionsBitField(BigInt(permissionsStr || 0));
    const isAdmin = bitfield.has(PermissionsBitField.Flags.Administrator);
    const canManageGuild = bitfield.has(PermissionsBitField.Flags.ManageGuild);
    const canManageRoles = bitfield.has(PermissionsBitField.Flags.ManageRoles);
    const canManageChannels = bitfield.has(PermissionsBitField.Flags.ManageChannels);
    const canKickMembers = bitfield.has(PermissionsBitField.Flags.KickMembers);
    const canBanMembers = bitfield.has(PermissionsBitField.Flags.BanMembers);

    return {
      isAdmin,
      canManage: isAdmin || canManageGuild,
      canManageRoles,
      canManageChannels,
      canKickMembers,
      canBanMembers,
      rawBitfield: bitfield.bitfield.toString(),
    };
  } catch (err) {
    console.error('Error evaluating permissions with discord.js:', err);
    return {
      isAdmin: false,
      canManage: false,
      canManageRoles: false,
      canManageChannels: false,
      canKickMembers: false,
      canBanMembers: false,
      rawBitfield: '0',
    };
  }
}

/**
 * Builds the official Discord Bot Invite URL with administrator/bot permissions
 */
export function buildBotInviteUrl(clientId?: string, guildId?: string): string {
  const cId = clientId || process.env.DISCORD_CLIENT_ID || '123456789012345678';
  
  // Standard bot permissions: Administrator (8) or general management
  const permissions = PermissionsBitField.Flags.Administrator.toString();
  const scopes = encodeURIComponent('bot applications.commands');
  
  let url = `https://discord.com/oauth2/authorize?client_id=${cId}&scope=${scopes}&permissions=${permissions}`;
  if (guildId) {
    url += `&guild_id=${guildId}&disable_guild_select=true`;
  }
  return url;
}

/**
 * Generates Discord CDN asset URL for user avatar or guild icon
 */
export function getDiscordIconUrl(guildId: string, iconHash: string | null): string | null {
  if (!iconHash) return null;
  const extension = iconHash.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${extension}?size=128`;
}

export function getDiscordAvatarUrl(userId: string, avatarHash: string | null, discriminator: string = '0'): string {
  if (!avatarHash) {
    const index = discriminator === '0' 
      ? Number((BigInt(userId) >> 22n) % 6n) 
      : Number(discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }
  const extension = avatarHash.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=128`;
}

/**
 * Extracts effective Discord client ID from env or bot token
 */
export function getEffectiveClientId(): string | null {
  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_ID.trim()) {
    return process.env.DISCORD_CLIENT_ID.trim();
  }
  if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN.includes('.')) {
    try {
      const part = process.env.DISCORD_BOT_TOKEN.split('.')[0];
      const decoded = Buffer.from(part, 'base64').toString('ascii');
      if (/^\d{17,20}$/.test(decoded)) {
        return decoded;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

/**
 * Fetches bot user details using Bot token
 */
export async function fetchBotUser(botToken: string): Promise<{ id: string; username: string; avatar: string | null } | null> {
  try {
    const res = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bot ${botToken.trim()}` },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.id,
        username: data.username,
        avatar: getDiscordAvatarUrl(data.id, data.avatar, data.discriminator),
      };
    }
  } catch (err) {
    console.warn('Could not fetch bot user:', err);
  }
  return null;
}

/**
 * Fetches list of guild IDs the bot is currently in
 */
export async function fetchBotGuildIds(botToken: string): Promise<Set<string>> {
  try {
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds?limit=200', {
      headers: { Authorization: `Bot ${botToken.trim()}` },
    });
    if (res.ok) {
      const guilds = await res.json();
      if (Array.isArray(guilds)) {
        return new Set(guilds.map((g: any) => g.id));
      }
    }
  } catch (err) {
    console.warn('Could not fetch bot guilds:', err);
  }
  return new Set();
}

/**
 * Fetches Discord channels for a guild using Bot token
 */
export async function fetchDiscordChannels(botToken: string, guildId: string): Promise<Array<{ id: string; name: string; type: number }>> {
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${botToken.trim()}` },
    });
    if (res.ok) {
      const channels = await res.json();
      if (Array.isArray(channels)) {
        return channels
          .filter((c: any) => c.type === 0 || c.type === 2 || c.type === 5)
          .map((c: any) => ({
            id: c.id,
            name: c.name,
            type: c.type,
          }));
      }
    }
  } catch (err) {
    console.warn(`Could not fetch channels for guild ${guildId}:`, err);
  }
  return [];
}

/**
 * Fetches Discord roles for a guild using Bot token
 */
export async function fetchDiscordRoles(botToken: string, guildId: string): Promise<Array<{ id: string; name: string; color: number; hexColor: string; position: number }>> {
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${botToken.trim()}` },
    });
    if (res.ok) {
      const roles = await res.json();
      if (Array.isArray(roles)) {
        return roles.map((r: any) => {
          const hex = r.color ? `#${r.color.toString(16).padStart(6, '0')}` : '#99AAB5';
          return {
            id: r.id,
            name: r.name,
            color: r.color,
            hexColor: hex,
            position: r.position,
          };
        });
      }
    }
  } catch (err) {
    console.warn(`Could not fetch roles for guild ${guildId}:`, err);
  }
  return [];
}
