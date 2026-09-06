import { GuildConfig, BotLiveStats } from '../src/types';

// In-memory persistent storage for server configurations and bot stats
const guildConfigs = new Map<string, GuildConfig>();

// Real-time statistics state
let botStats: BotLiveStats = {
  botName: 'NyxEclipse',
  status: 'online',
  presenceActivity: 'stalking',
  uptimeSeconds: 384920,
  pingMs: 24,
  guildCount: 142,
  totalMembers: 84320,
  shards: 4,
  ramUsageMb: 412,
  cpuPercent: 1.8,
  commandsExecutedToday: 18450,
  commandsPerMinute: 42,
  activeVoiceConnections: 18,
  lastSyncTime: new Date().toISOString(),
  version: '2.1.0',
  lavalinkNodesCount: 2,
};

// Periodic fluctuation to simulate active real-time stats when external bot is connecting
setInterval(() => {
  botStats.uptimeSeconds += 2;
  // Subtle realistic jitter
  botStats.pingMs = Math.max(12, Math.min(65, Math.round(botStats.pingMs + (Math.random() * 6 - 3))));
  botStats.commandsPerMinute = Math.max(15, Math.min(180, Math.round(botStats.commandsPerMinute + (Math.random() * 10 - 5))));
  botStats.commandsExecutedToday += Math.floor(Math.random() * 3);
  botStats.ramUsageMb = Math.round(390 + Math.sin(Date.now() / 60000) * 35 + Math.random() * 10);
  botStats.cpuPercent = +(1.2 + Math.random() * 2.4).toFixed(1);
  botStats.activeVoiceConnections = Math.max(8, Math.min(45, Math.round(botStats.activeVoiceConnections + (Math.random() * 2 - 1))));
}, 2000);

export function getOrCreateGuildConfig(guildId: string, guildName: string = 'Discord Server'): GuildConfig {
  if (guildConfigs.has(guildId)) {
    return guildConfigs.get(guildId)!;
  }

  const newConfig: GuildConfig = {
    guildId,
    guildName,
    updatedAt: new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    version: 1,
    syncStatus: 'synced',
    general: {
      prefix: '!',
      botNickname: 'NyxEclipse',
      language: 'en-US',
      embedColor: '#336699',
      timezone: 'UTC',
      modRole: 'role-moderator',
      adminRole: 'role-admin',
      premiumRoleId: 'role-vip',
      birthdayChannelId: 'announcements',
    },
    welcome: {
      enabled: true,
      channelId: 'welcome-and-rules',
      message: 'Welcome {user} to {server}! We now have {memberCount} members!',
      sendDm: true,
      dmMessage: 'Welcome to the server! Make sure to read the guidelines and claim your roles.',
      autoRoleId: 'role-member',
      goodbyeEnabled: true,
      goodbyeChannelId: 'goodbyes',
      goodbyeMessage: '{user} has left the server. We now have {memberCount} members.',
    },
    moderation: {
      enabled: true,
      autoMod: true,
      filterProfanity: true,
      filterDiscordInvites: true,
      antiSpam: true,
      maxMentions: 5,
      actionOnViolation: 'mute',
      muteRoleId: 'role-muted',
      modLogChannelId: 'mod-logs',
    },
    leveling: {
      enabled: true,
      xpMultiplier: 1.0,
      announcementChannelId: 'level-ups',
      levelUpMessage: '🎉 GG {user}, you have reached **Level {level}**!',
      awardRoleAtLevel5: 'role-veteran',
      awardRoleAtLevel10: 'role-champion',
    },
    music: {
      enabled: true,
      nodeProvider: 'Lavalink v4 / Riffy',
      mode247: true,
      defaultVolume: 80,
      announcementChannelId: 'bot-commands',
    },
    tickets: {
      enabled: true,
      categoryId: 'Support Tickets',
      logChannelId: 'mod-logs',
      dmOnClose: true,
    },
    counters: {
      enabled: true,
      channelNameFormat: '{name}-{count}',
      membersCountChannel: '🔊 Total Members: 1,280',
      botsCountChannel: '🔊 Bots: 12',
      humansCountChannel: '🔊 Humans: 1,268',
    },
    verification: {
      enabled: true,
      channelId: 'welcome-and-rules',
      verifiedRoleId: 'role-member',
    },
    logging: {
      enabled: true,
      auditChannel: 'mod-logs',
      applicationsChannel: 'general-chat',
      reportsChannel: 'mod-logs',
      enabledEvents: {
        'messageDelete': true,
        'messageUpdate': true,
        'memberJoin': true,
        'memberLeave': true,
        'roleCreate': true,
        'channelCreate': true,
      },
    },
    modules: {
      music: true,
      economy: true,
      tickets: true,
      giveaways: true,
      birthday: true,
      counter: true,
      verification: true,
      reactionRoles: true,
      joinToCreate: true,
      voice: true,
      search: true,
      tools: true,
      utility: true,
      community: true,
      fun: true,
    },
  };

  guildConfigs.set(guildId, newConfig);
  return newConfig;
}

export function saveGuildConfig(guildId: string, partial: Partial<GuildConfig>): GuildConfig {
  const existing = getOrCreateGuildConfig(guildId, partial.guildName);
  const updated: GuildConfig = {
    ...existing,
    ...partial,
    updatedAt: new Date().toISOString(),
    version: existing.version + 1,
    syncStatus: 'synced',
    lastSyncedAt: new Date().toISOString(),
  };

  guildConfigs.set(guildId, updated);
  return updated;
}

export function getAllGuildConfigs(): Record<string, GuildConfig> {
  const result: Record<string, GuildConfig> = {};
  for (const [id, config] of guildConfigs.entries()) {
    result[id] = config;
  }
  return result;
}

export function getBotStats(): BotLiveStats {
  return { ...botStats };
}

export function updateBotStats(incoming: Partial<BotLiveStats>): BotLiveStats {
  botStats = {
    ...botStats,
    ...incoming,
    lastSyncTime: new Date().toISOString(),
  };
  return { ...botStats };
}

// Prepopulate initial demo configs
getOrCreateGuildConfig('1001', 'Nexus Command Central');
getOrCreateGuildConfig('1002', 'Aether Gaming Esports');
getOrCreateGuildConfig('1003', 'Cybernetic Developers Club');
