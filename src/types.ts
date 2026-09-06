export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  banner?: string | null;
  accentColor?: number | null;
  email?: string;
  isDemo?: boolean;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string; // Permissions bitfield as string
  features: string[];
  approximateMemberCount?: number;
  // Computed fields
  isAdmin: boolean;
  canManage: boolean;
  botPresent: boolean;
  inviteUrl?: string;
}

export interface GuildConfig {
  guildId: string;
  guildName: string;
  updatedAt: string;
  lastSyncedAt: string;
  version: number;
  syncStatus: 'synced' | 'pending' | 'syncing';
  
  general: {
    prefix: string;
    botNickname: string;
    language: string;
    embedColor: string;
    timezone: string;
    modRole: string;
    adminRole: string;
    premiumRoleId: string;
    birthdayChannelId: string;
  };
  
  welcome: {
    enabled: boolean;
    channelId: string;
    message: string;
    sendDm: boolean;
    dmMessage: string;
    autoRoleId: string;
    goodbyeEnabled: boolean;
    goodbyeChannelId: string;
    goodbyeMessage: string;
  };
  
  moderation: {
    enabled: boolean;
    autoMod: boolean;
    filterProfanity: boolean;
    filterDiscordInvites: boolean;
    antiSpam: boolean;
    maxMentions: number;
    actionOnViolation: 'warn' | 'mute' | 'kick' | 'ban';
    muteRoleId: string;
    modLogChannelId: string;
  };

  leveling: {
    enabled: boolean;
    xpMultiplier: number;
    announcementChannelId: string;
    levelUpMessage: string;
    awardRoleAtLevel5: string;
    awardRoleAtLevel10: string;
  };

  music: {
    enabled: boolean;
    nodeProvider: string;
    mode247: boolean;
    defaultVolume: number;
    announcementChannelId: string;
  };

  tickets: {
    enabled: boolean;
    categoryId: string;
    logChannelId: string;
    dmOnClose: boolean;
  };

  counters: {
    enabled: boolean;
    channelNameFormat: string;
    membersCountChannel: string;
    botsCountChannel: string;
    humansCountChannel: string;
  };

  verification: {
    enabled: boolean;
    channelId: string;
    verifiedRoleId: string;
  };

  logging: {
    enabled: boolean;
    auditChannel: string;
    applicationsChannel: string;
    reportsChannel: string;
    enabledEvents: Record<string, boolean>;
  };

  modules: {
    music: boolean;
    economy: boolean;
    tickets: boolean;
    giveaways: boolean;
    birthday: boolean;
    counter: boolean;
    verification: boolean;
    reactionRoles: boolean;
    joinToCreate: boolean;
    voice: boolean;
    search: boolean;
    tools: boolean;
    utility: boolean;
    community: boolean;
    fun: boolean;
  };
}

export interface BotLiveStats {
  botName: string;
  status: 'online' | 'idle' | 'dnd' | 'maintenance';
  presenceActivity: string;
  uptimeSeconds: number;
  pingMs: number;
  guildCount: number;
  totalMembers: number;
  shards: number;
  ramUsageMb: number;
  cpuPercent: number;
  commandsExecutedToday: number;
  commandsPerMinute: number;
  activeVoiceConnections: number;
  lastSyncTime: string;
  version: string;
  lavalinkNodesCount?: number;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hexColor: string;
  position: number;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user: DiscordUser | null;
  isConfigured: boolean;
  clientId: string | null;
  callbackUrl: string;
  inviteUrl: string;
  credentialsStatus?: {
    hasClientId: boolean;
    hasClientSecret: boolean;
    hasBotToken: boolean;
    botUser?: {
      id: string;
      username: string;
      avatar: string | null;
    } | null;
  };
}
