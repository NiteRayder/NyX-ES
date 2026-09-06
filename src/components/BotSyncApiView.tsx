import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Server, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  Play,
  RefreshCw,
  Cpu,
  Sparkles
} from 'lucide-react';
import { BotLiveStats } from '../types';
import { useTheme } from '../context/ThemeContext';

interface BotSyncApiViewProps {
  botStats: BotLiveStats | null;
}

export const BotSyncApiView: React.FC<BotSyncApiViewProps> = ({ botStats }) => {
  const { mode, classes } = useTheme();
  const [copied, setCopied] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const runTestSync = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/bot/sync/1001');
      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setTesting(false);
    }
  };

  const sampleBotCode = `// GuildNexus Discord Bot Integration
// Node.js + Discord.js v14
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Cache map to store guild configs locally
const guildConfigCache = new Map();

// 1. Fetch guild configuration from GuildNexus dashboard
async function getGuildConfig(guildId) {
  if (guildConfigCache.has(guildId)) {
    return guildConfigCache.get(guildId);
  }

  try {
    const res = await fetch(\`https://your-guildnexus-app.run.app/api/bot/sync/\${guildId}\`);
    if (res.ok) {
      const data = await res.json();
      guildConfigCache.set(guildId, data.config);
      return data.config;
    }
  } catch (err) {
    console.error('Failed to sync config with GuildNexus:', err);
  }

  // Fallback defaults
  return {
    general: { prefix: '!' },
    welcome: { enabled: false },
    music: { defaultVolume: 80, announceSongs: true, autoLeaveOnEmpty: true },
    tickets: { enabled: true, maxOpenPerUser: 1 },
    counters: { enabled: true },
    verification: { enabled: false },
    logging: { enabled: true, logModActions: true },
    moderation: { enabled: true, antiSpam: true, antiInvite: true }
  };
}

// 2. Dynamic Command Prefix & Execution
client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;

  const config = await getGuildConfig(message.guild.id);
  const prefix = config.general?.prefix || '!';

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    return message.reply(\`Pong! Latency: \${client.ws.ping}ms\`);
  }
});

// 3. Telemetry reporting to Dashboard
setInterval(async () => {
  try {
    await fetch('https://your-guildnexus-app.run.app/api/bot/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pingMs: client.ws.ping,
        guildCount: client.guilds.cache.size,
        totalMembers: client.users.cache.size
      })
    });
  } catch (e) {
    // Non-blocking telemetry
  }
}, 30000);

client.login(process.env.DISCORD_BOT_TOKEN);`;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className={`p-6 rounded-2xl border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className={`text-lg font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                GuildNexus Bot Sync Architecture
              </h2>
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950">
                SILVER REST API
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              The external Discord Bot consumes configurations from this dashboard via REST API endpoints.
            </p>
          </div>
        </div>
      </div>

      {/* Sync Endpoints Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border space-y-2 ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
              GET
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Real-time</span>
          </div>
          <code className="text-xs font-mono font-bold text-purple-400 block truncate">
            /api/bot/sync/:guildId
          </code>
          <p className="text-[11px] text-slate-400">
            Returns current configuration for a single Discord server.
          </p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px] font-bold">
              GET
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Startup Bulk</span>
          </div>
          <code className="text-xs font-mono font-bold text-purple-400 block truncate">
            /api/bot/sync
          </code>
          <p className="text-[11px] text-slate-400">
            Bulk loads all active server configurations into bot memory on startup.
          </p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-2 ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 font-mono text-[10px] font-bold">
              POST
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Heartbeat</span>
          </div>
          <code className="text-xs font-mono font-bold text-purple-400 block truncate">
            /api/bot/telemetry
          </code>
          <p className="text-[11px] text-slate-400">
            Allows the bot to report live shards, ping, and memory metrics back to dashboard.
          </p>
        </div>
      </div>

      {/* Interactive Sync Endpoint Tester */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Play className="w-4 h-4 text-emerald-400" />
            <h3 className={`text-sm font-bold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Interactive Sync Endpoint Test
            </h3>
          </div>

          <button
            onClick={runTestSync}
            disabled={testing}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white shadow-sm transition-all"
          >
            {testing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Querying...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Test GET /api/bot/sync/1001</span>
              </>
            )}
          </button>
        </div>

        {testResponse && (
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#07030e]">
            <div className="px-4 py-2 bg-[#120822] border-b border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
              <span>HTTP 200 OK — JSON Response from GuildNexus Server</span>
              <button
                onClick={() => copyToClipboard(testResponse, 'test-res')}
                className="hover:text-white text-slate-400 transition-colors"
              >
                {copied === 'test-res' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-64">
              {testResponse}
            </pre>
          </div>
        )}
      </div>

      {/* Full Discord.js Bot Integration Code */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-sm font-bold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Complete Discord.js Bot Integration Snippet
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Copy-paste this directly into your bot project to connect it to this dashboard.
            </p>
          </div>

          <button
            onClick={() => copyToClipboard(sampleBotCode, 'bot-code')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
              mode === 'dark'
                ? 'bg-[#150c26] hover:bg-slate-800 text-purple-300 border-purple-900/40'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
            }`}
          >
            {copied === 'bot-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied === 'bot-code' ? 'Copied Snippet!' : 'Copy Bot Code'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#07030e]">
          <div className="px-4 py-2 bg-[#120822] border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>bot.js</span>
            <span className="text-purple-400 font-bold">Node.js + Discord.js v14</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
            {sampleBotCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
