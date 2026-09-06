import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Save, 
  RefreshCw, 
  Sliders, 
  MessageSquare, 
  ShieldAlert, 
  TrendingUp, 
  Puzzle, 
  Code, 
  Copy, 
  Sparkles, 
  Bot, 
  Hash, 
  AlertTriangle, 
  Send, 
  Zap, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  Radio
} from 'lucide-react';
import { DiscordGuild, GuildConfig, DiscordChannel, DiscordRole } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ServerOverviewTab } from './ServerOverviewTab';

interface ServerConfigViewProps {
  guild: DiscordGuild;
  onBack: () => void;
  inviteUrl: string;
  activeSubTab?: string;
  onTabChange?: (tab: string) => void;
}

const ChannelSelector: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  channels: DiscordChannel[];
  isLive?: boolean;
}> = ({ label, value, onChange, channels, isLive }) => {
  const currentMatch = channels.find(c => c.name === value || c.id === value);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{label}</label>
        {isLive ? (
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Discord API Synced</span>
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 font-medium">Channel Preset</span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={currentMatch ? currentMatch.name : (value ? 'custom' : '')}
            onChange={(e) => {
              if (e.target.value !== 'custom') {
                onChange(e.target.value);
              }
            }}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
          >
            <option value="" disabled>Select server channel...</option>
            {channels.map((c) => (
              <option key={c.id} value={c.name}>
                #{c.name} {c.type === 5 ? '(Announcements)' : ''}
              </option>
            ))}
            <option value="custom">✏️ Enter custom name or ID...</option>
          </select>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="channel name or ID"
          className="w-36 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
          title="Direct channel name or Snowflake ID"
        />
      </div>
    </div>
  );
};

const RoleSelector: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  roles: DiscordRole[];
  isLive?: boolean;
}> = ({ label, value, onChange, roles, isLive }) => {
  const currentMatch = roles.find(r => r.name === value || r.id === value);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">{label}</label>
        {isLive ? (
          <span className="text-[10px] text-purple-400 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span>Discord API Synced</span>
          </span>
        ) : (
          <span className="text-[10px] text-slate-500 font-medium">Role Preset</span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Shield className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={currentMatch ? currentMatch.name : (value ? 'custom' : '')}
            onChange={(e) => {
              if (e.target.value !== 'custom') {
                onChange(e.target.value);
              }
            }}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
          >
            <option value="" disabled>Select server role...</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                @{r.name}
              </option>
            ))}
            <option value="custom">✏️ Enter custom name or ID...</option>
          </select>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="role name or ID"
          className="w-36 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
          title="Direct role name or Snowflake ID"
        />
      </div>
    </div>
  );
};

export const ServerConfigView: React.FC<ServerConfigViewProps> = ({
  guild,
  onBack,
  inviteUrl,
  activeSubTab: externalSubTab,
  onTabChange,
}) => {
  const { mode, classes } = useTheme();
  const [internalSubTab, setInternalSubTab] = useState<'overview' | 'general' | 'welcome' | 'automod' | 'leveling' | 'modules' | 'sync'>('overview');
  const [config, setConfig] = useState<GuildConfig | null>(null);
  const [discordData, setDiscordData] = useState<{ channels: DiscordChannel[]; roles: DiscordRole[]; isLive: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const activeSubTab = (externalSubTab as any) || internalSubTab;

  const handleTabChange = (tab: any) => {
    setInternalSubTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Fetch guild config and live Discord channels/roles
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [configRes, discordRes] = await Promise.all([
          fetch(`/api/guilds/${guild.id}/config?guildName=${encodeURIComponent(guild.name)}`),
          fetch(`/api/guilds/${guild.id}/discord-data`),
        ]);

        if (configRes.ok) {
          const data = await configRes.json();
          setConfig(data);
        }

        if (discordRes.ok) {
          const dData = await discordRes.json();
          setDiscordData(dData);
        }
      } catch (err) {
        console.error('Error fetching guild data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [guild.id, guild.name]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/guilds/${guild.id}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        const result = await res.json();
        setConfig(result.config);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving config:', err);
    } finally {
      setSaving(false);
    }
  };

  const insertVariable = (variable: string) => {
    if (!config) return;
    setConfig({
      ...config,
      welcome: {
        ...config.welcome,
        message: `${config.welcome.message} ${variable}`,
      },
    });
  };

  if (loading || !config) {
    return (
      <div className="p-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-300">Loading server configuration...</p>
        <p className="text-xs text-slate-500">Querying GuildNexus database and permissions</p>
      </div>
    );
  }

  // Previews formatted welcome message
  const previewWelcomeText = config.welcome.message
    .replace(/{user}/g, '@NexusTraveler')
    .replace(/{server}/g, guild.name)
    .replace(/{members}/g, (guild.approximateMemberCount || 1420).toLocaleString())
    .replace(/{date}/g, new Date().toLocaleDateString());

  const botSyncCodeSnippet = `// Discord Bot Integration (discord.js v14)
// The bot retrieves live configuration from GuildNexus dashboard
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

async function getGuildConfig(guildId) {
  const res = await fetch(\`\${process.env.DASHBOARD_URL}/api/bot/sync/\${guildId}\`, {
    headers: {
      'Authorization': \`Bearer \${process.env.BOT_SYNC_SECRET}\`
    }
  });
  const data = await res.json();
  return data.config;
}

client.on('messageCreate', async (message) => {
  if (!message.guild) return;
  const config = await getGuildConfig(message.guild.id);
  
  // Dynamic custom prefix synced from dashboard
  if (message.content.startsWith(config.general.prefix)) {
    // Process command...
  }
});`;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Header */}
      <div className={`p-5 rounded-2xl border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className={`p-2.5 rounded-xl transition-colors border ${
              mode === 'dark' 
                ? 'bg-[#150c26] hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
            }`}
            title="Back to Servers Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3.5">
            {guild.icon ? (
              <img
                src={guild.icon}
                alt={guild.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-slate-700/80 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-purple-600/30">
                {guild.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className={`text-lg font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {guild.name}
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                  mode === 'dark' ? 'bg-[#150c26] text-purple-300 border-purple-900/50' : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  v{config.version}
                </span>
                <span className="hidden sm:inline text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950">
                  SILVER SYNC
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="flex items-center space-x-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span>Synced with Bot</span>
                </span>
                <span>•</span>
                <span>Prefix: <code className="text-purple-400 font-mono font-bold">{config.general.prefix}</code></span>
                {discordData?.isLive ? (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-purple-400 font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                      <span>{discordData.channels.length} Live Channels</span>
                      <span>•</span>
                      <span>{discordData.roles.length} Live Roles</span>
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Save and Invite Actions */}
        <div className="flex items-center space-x-2.5">
          {!guild.botPresent && (
            <a
              href={guild.inviteUrl || inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-sm transition-all"
            >
              <span>Invite Bot</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all border ${
              saveSuccess
                ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400/30 shadow-emerald-500/20'
                : 'bg-purple-600 hover:bg-purple-500 border-purple-400/30 shadow-purple-900/30'
            }`}
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Synced with Bot!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save & Sync to Bot</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className={`flex items-center space-x-1 p-1 rounded-xl border overflow-x-auto ${
        mode === 'dark' ? 'bg-[#0a0512] border-slate-800/80' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => handleTabChange('overview')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : mode === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => handleTabChange('general')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'general'
              ? 'bg-purple-600 text-white shadow-sm'
              : mode === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>General</span>
        </button>

        <button
          onClick={() => handleTabChange('welcome')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'welcome'
              ? 'bg-purple-600 text-white shadow-sm'
              : mode === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Welcome & Leave</span>
        </button>

        <button
          onClick={() => handleTabChange('automod')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'automod'
              ? 'bg-purple-600 text-white shadow-sm'
              : mode === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Auto-Moderation</span>
        </button>

        <button
          onClick={() => handleTabChange('leveling')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'leveling'
              ? 'bg-purple-600 text-white shadow-sm'
              : mode === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Leveling & XP</span>
        </button>

        <button
          onClick={() => handleTabChange('modules')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'modules'
              ? 'bg-purple-600 text-white shadow-sm'
              : mode === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Puzzle className="w-3.5 h-3.5" />
          <span>Feature Modules</span>
        </button>

        <button
          onClick={() => handleTabChange('sync')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            activeSubTab === 'sync'
              ? 'bg-purple-600 text-white shadow-sm'
              : mode === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Bot Sync API</span>
        </button>
      </div>

      {/* Tab 0: Server Overview Dashboard */}
      {activeSubTab === 'overview' && (
        <ServerOverviewTab
          guild={guild}
          config={config}
          setConfig={setConfig}
          onNavigateTab={handleTabChange}
          inviteUrl={guild.inviteUrl || inviteUrl}
        />
      )}

      {/* Tab 1: General Settings */}
      {activeSubTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-5">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Command Execution & Identity</span>
              </h3>

              {/* Prefix Setting */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Command Prefix</label>
                <p className="text-[11px] text-slate-400">
                  The symbol required before legacy text commands in this Discord server.
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    maxLength={4}
                    value={config.general.prefix}
                    onChange={(e) => setConfig({
                      ...config,
                      general: { ...config.general, prefix: e.target.value }
                    })}
                    className="w-24 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono font-bold text-indigo-400 text-center focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center space-x-1.5">
                    {['!', '?', '/', '.', '$', '>'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setConfig({
                          ...config,
                          general: { ...config.general, prefix: p }
                        })}
                        className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-colors ${
                          config.general.prefix === p
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bot Server Nickname */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Server Nickname for Bot</label>
                <input
                  type="text"
                  value={config.general.botNickname}
                  onChange={(e) => setConfig({
                    ...config,
                    general: { ...config.general, botNickname: e.target.value }
                  })}
                  placeholder="e.g. Nexus Guardian"
                  className="w-full max-w-md px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Primary Language */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Server Language</label>
                <select
                  value={config.general.language}
                  onChange={(e) => setConfig({
                    ...config,
                    general: { ...config.general, language: e.target.value }
                  })}
                  className="w-full max-w-md px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="es-ES">Español (Spanish)</option>
                  <option value="de-DE">Deutsch (German)</option>
                  <option value="fr-FR">Français (French)</option>
                  <option value="ja-JP">日本語 (Japanese)</option>
                </select>
              </div>

              {/* Embed Accent Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Bot Embed Accent Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={config.general.embedColor}
                    onChange={(e) => setConfig({
                      ...config,
                      general: { ...config.general, embedColor: e.target.value }
                    })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={config.general.embedColor}
                    onChange={(e) => setConfig({
                      ...config,
                      general: { ...config.general, embedColor: e.target.value }
                    })}
                    className="w-28 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center space-x-1.5">
                    {['#5865F2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setConfig({
                          ...config,
                          general: { ...config.general, embedColor: hex }
                        })}
                        className="w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preview Card */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Discord Command Preview</h4>
              <div className="p-4 rounded-xl bg-[#313338] text-slate-200 space-y-3 font-sans text-xs">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className="text-[#949BA4]">Today at 9:42 PM</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    B
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{config.general.botNickname || 'NexusBot'}</span>
                      <span className="px-1 py-0.2 rounded bg-[#5865F2] text-white text-[9px] font-bold">BOT</span>
                    </div>
                    <div 
                      className="p-3 rounded-lg bg-[#2B2D31] border-l-4 text-xs space-y-1"
                      style={{ borderLeftColor: config.general.embedColor }}
                    >
                      <p className="font-bold text-white">GuildNexus Information</p>
                      <p className="text-slate-300 text-[11px]">
                        Server prefix is set to <code className="font-mono bg-[#1E1F22] px-1 py-0.5 rounded text-amber-400">{config.general.prefix}</code>
                      </p>
                      <p className="text-slate-400 text-[10px]">Type {config.general.prefix}help for available commands</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Welcome & Leave */}
      {activeSubTab === 'welcome' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Join Welcome Messages</h3>
                <p className="text-xs text-slate-400">Greet new members automatically when they join</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.welcome.enabled}
                  onChange={(e) => setConfig({
                    ...config,
                    welcome: { ...config.welcome, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 border border-slate-700"></div>
              </label>
            </div>

            {config.welcome.enabled && (
              <div className="space-y-4 pt-2 border-t border-slate-700">
                <ChannelSelector
                  label="Welcome Channel"
                  value={config.welcome.channelId}
                  onChange={(val) => setConfig({
                    ...config,
                    welcome: { ...config.welcome, channelId: val }
                  })}
                  channels={discordData?.channels || []}
                  isLive={discordData?.isLive}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Message Template</label>
                    <span className="text-[10px] text-slate-400 font-medium">Insert variables below</span>
                  </div>
                  <textarea
                    rows={4}
                    value={config.welcome.message}
                    onChange={(e) => setConfig({
                      ...config,
                      welcome: { ...config.welcome, message: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['{user}', '{server}', '{members}', '{date}'].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertVariable(v)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-indigo-400 border border-slate-700 font-mono text-[11px] font-bold transition-colors"
                      >
                        +{v}
                      </button>
                    ))}
                  </div>
                </div>

                <RoleSelector
                  label="Auto-Assign Role on Join"
                  value={config.welcome.autoRoleId}
                  onChange={(val) => setConfig({
                    ...config,
                    welcome: { ...config.welcome, autoRoleId: val }
                  })}
                  roles={discordData?.roles || []}
                  isLive={discordData?.isLive}
                />
              </div>
            )}
          </div>

          {/* Interactive Live Discord Message Simulator */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulated Discord Chat Output</span>
              </h4>

              <div className="p-4 rounded-xl bg-[#313338] text-slate-200 space-y-3 font-sans text-xs border border-slate-700/60 shadow-inner">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 border-2 border-slate-800">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{config.general.botNickname || 'GuildNexus Bot'}</span>
                      <span className="px-1 py-0.2 rounded bg-[#5865F2] text-white text-[9px] font-bold">BOT</span>
                      <span className="text-[10px] text-[#949BA4]">Today at 9:45 PM</span>
                    </div>

                    <div 
                      className="p-3.5 rounded-lg bg-[#2B2D31] border-l-4 text-xs space-y-2 mt-1 shadow-sm"
                      style={{ borderLeftColor: config.general.embedColor }}
                    >
                      <div className="font-bold text-white text-sm">Welcome to {guild.name}!</div>
                      <p className="text-slate-300 whitespace-pre-line leading-relaxed text-xs">
                        {previewWelcomeText}
                      </p>
                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Auto-assigned role: @{config.welcome.autoRoleId || 'Member'}</span>
                        <span className="font-mono">Nexus Engine</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Auto-Moderation */}
      {activeSubTab === 'automod' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Automated Server Protection</h3>
                  <p className="text-xs text-slate-400">Shield your community from raids, spam, and malicious invites</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.moderation.enabled}
                    onChange={(e) => setConfig({
                      ...config,
                      moderation: { ...config.moderation, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 border border-slate-700"></div>
                </label>
              </div>

              {config.moderation.enabled && (
                <div className="space-y-4 pt-4 border-t border-slate-700">
                  {/* Filters Grid */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 cursor-pointer transition-colors">
                      <div>
                        <span className="text-xs font-bold text-slate-200">Discord Invite Blocker</span>
                        <p className="text-[11px] text-slate-400">Auto-delete unauthorized discord.gg links to outside servers</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.moderation.filterDiscordInvites}
                        onChange={(e) => setConfig({
                          ...config,
                          moderation: { ...config.moderation, filterDiscordInvites: e.target.checked }
                        })}
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 cursor-pointer transition-colors">
                      <div>
                        <span className="text-xs font-bold text-slate-200">Anti-Spam & Rapid Repeats</span>
                        <p className="text-[11px] text-slate-400">Filter duplicate messages and rapid copypastas</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.moderation.antiSpam}
                        onChange={(e) => setConfig({
                          ...config,
                          moderation: { ...config.moderation, antiSpam: e.target.checked }
                        })}
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 cursor-pointer transition-colors">
                      <div>
                        <span className="text-xs font-bold text-slate-200">Profanity & Toxic Filter</span>
                        <p className="text-[11px] text-slate-400">Filter offensive slurs and blacklisted terms</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.moderation.filterProfanity}
                        onChange={(e) => setConfig({
                          ...config,
                          moderation: { ...config.moderation, filterProfanity: e.target.checked }
                        })}
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                    </label>
                  </div>

                  {/* Mentions Slider */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Mass Mention Threshold</span>
                      <span className="font-mono text-indigo-400 font-bold">{config.moderation.maxMentions} mentions</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={15}
                      value={config.moderation.maxMentions}
                      onChange={(e) => setConfig({
                        ...config,
                        moderation: { ...config.moderation, maxMentions: Number(e.target.value) }
                      })}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Violation Action */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Action on Violation</label>
                    <select
                      value={config.moderation.actionOnViolation}
                      onChange={(e) => setConfig({
                        ...config,
                        moderation: { ...config.moderation, actionOnViolation: e.target.value as any }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="warn">Warn User via DM</option>
                      <option value="mute">Mute User (Apply Muted Role)</option>
                      <option value="kick">Kick User from Server</option>
                      <option value="ban">Ban User Permanently</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Automod Audit Logging</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All moderation infractions are securely dispatched to the designated audit channel for server administrators.
              </p>
              <div className="space-y-2">
                <ChannelSelector
                  label="Log Channel"
                  value={config.moderation.modLogChannelId}
                  onChange={(val) => setConfig({
                    ...config,
                    moderation: { ...config.moderation, modLogChannelId: val }
                  })}
                  channels={discordData?.channels || []}
                  isLive={discordData?.isLive}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Leveling & XP */}
      {activeSubTab === 'leveling' && (
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">XP & Community Leveling System</h3>
              <p className="text-xs text-slate-400">Encourage community engagement by rewarding active chatters with XP and roles</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.leveling.enabled}
                onChange={(e) => setConfig({
                  ...config,
                  leveling: { ...config.leveling, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 border border-slate-700"></div>
            </label>
          </div>

          {config.leveling.enabled && (
            <div className="space-y-4 pt-4 border-t border-slate-700">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">XP Multiplier</span>
                  <span className="font-mono text-indigo-400 font-bold">{config.leveling.xpMultiplier}x Rate</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  value={config.leveling.xpMultiplier}
                  onChange={(e) => setConfig({
                    ...config,
                    leveling: { ...config.leveling, xpMultiplier: Number(e.target.value) }
                  })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Level-Up Announcement Message</label>
                <input
                  type="text"
                  value={config.leveling.levelUpMessage}
                  onChange={(e) => setConfig({
                    ...config,
                    leveling: { ...config.leveling, levelUpMessage: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <RoleSelector
                  label="Level 5 Reward Role"
                  value={config.leveling.awardRoleAtLevel5}
                  onChange={(val) => setConfig({
                    ...config,
                    leveling: { ...config.leveling, awardRoleAtLevel5: val }
                  })}
                  roles={discordData?.roles || []}
                  isLive={discordData?.isLive}
                />

                <RoleSelector
                  label="Level 10 Reward Role"
                  value={config.leveling.awardRoleAtLevel10}
                  onChange={(val) => setConfig({
                    ...config,
                    leveling: { ...config.leveling, awardRoleAtLevel10: val }
                  })}
                  roles={discordData?.roles || []}
                  isLive={discordData?.isLive}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Feature Modules */}
      {activeSubTab === 'modules' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { id: 'music', name: 'High-Fi Music Engine', desc: 'YouTube, Spotify & SoundCloud 24/7 voice channel playback with audio equalization.', icon: '🎵' },
            { id: 'economy', name: 'Server Economy & Coins', desc: 'Custom currency, daily rewards, server shop items, and gamble mini-games.', icon: '💰' },
            { id: 'tickets', name: 'Support Ticket System', desc: 'One-click reaction ticket generation with transcript saving.', icon: '🎫' },
            { id: 'giveaways', name: 'Community Giveaways', desc: 'Scheduled prize draws, reaction entries, and verified winner picking.', icon: '🎁' },
            { id: 'starboard', name: 'Server Starboard', desc: 'Pin community favorite messages to a public hall of fame channel.', icon: '⭐' },
            { id: 'reactionRoles', name: 'Self-Assignable Reaction Roles', desc: 'Let members pick their notification and vanity roles with emoji clicks.', icon: '🎭' },
          ].map((mod) => {
            const isEnabled = config.modules[mod.id as keyof typeof config.modules];
            return (
              <div
                key={mod.id}
                className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{mod.icon}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => setConfig({
                          ...config,
                          modules: {
                            ...config.modules,
                            [mod.id]: e.target.checked,
                          },
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 border border-slate-700"></div>
                    </label>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{mod.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Module State</span>
                  <span className={isEnabled ? 'text-emerald-400 font-bold flex items-center gap-1.5' : 'text-slate-500 font-medium'}>
                    {isEnabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                    {isEnabled ? 'ACTIVE IN BOT' : 'DISABLED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 6: Bot Sync API Documentation */}
      {activeSubTab === 'sync' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">How The External Discord Bot Syncs With This Dashboard</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  GuildNexus operates as a centralized configuration server. Your external Discord bot fetches live settings directly via REST endpoints.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2000);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-900 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedJson ? 'Copied Config!' : 'Copy Config JSON'}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(botSyncCodeSnippet);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 hover:bg-indigo-900/40 transition-colors shadow-sm"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Bot Code'}</span>
                </button>
              </div>
            </div>

            {/* Sync Endpoint URLs */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Single Guild Sync Endpoint:</span>
                <code className="font-mono text-emerald-400 font-bold">GET /api/bot/sync/{guild.id}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Bulk Guilds Sync on Startup:</span>
                <code className="font-mono text-indigo-400 font-bold">GET /api/bot/sync</code>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-[#0d1117]">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-700 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>discord-bot-sync.js</span>
                <span>Node.js + Discord.js v14</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {botSyncCodeSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
