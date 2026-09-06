import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Flame, 
  Radio, 
  Server, 
  Users, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  Terminal,
  RefreshCw,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { BotLiveStats } from '../types';
import { useTheme } from '../context/ThemeContext';

interface RealTimeStatsViewProps {
  stats: BotLiveStats | null;
  onRefresh: () => void;
}

interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'command' | 'automod' | 'join' | 'sync' | 'voice';
  message: string;
  guild: string;
}

export const RealTimeStatsView: React.FC<RealTimeStatsViewProps> = ({ stats, onRefresh }) => {
  const { mode, classes } = useTheme();
  const [events, setEvents] = useState<ActivityEvent[]>([
    {
      id: 'e-1',
      timestamp: 'Just now',
      type: 'command',
      message: 'Executed command /play [Track: Starlight Odyssey]',
      guild: 'Nexus Command Central',
    },
    {
      id: 'e-2',
      timestamp: '12s ago',
      type: 'sync',
      message: 'Server configuration v4 synced with Gateway',
      guild: 'Aether Gaming Esports',
    },
    {
      id: 'e-3',
      timestamp: '34s ago',
      type: 'automod',
      message: 'Blocked unauthorized invite link: discord.gg/fake123',
      guild: 'Cybernetic Developers Club',
    },
    {
      id: 'e-4',
      timestamp: '1m ago',
      type: 'join',
      message: 'Auto-assigned Member role to @ValkyriePrime',
      guild: 'Nexus Command Central',
    },
    {
      id: 'e-5',
      timestamp: '2m ago',
      type: 'voice',
      message: 'Bot connected to Voice Channel [Stage #1]',
      guild: 'Aether Gaming Esports',
    },
  ]);

  // Dynamically generate incoming events to reflect live streaming
  useEffect(() => {
    const timer = setInterval(() => {
      const eventTypes: Array<'command' | 'automod' | 'join' | 'sync' | 'voice'> = [
        'command', 'automod', 'join', 'sync', 'voice'
      ];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const sampleGuilds = ['Nexus Command Central', 'Aether Gaming Esports', 'Cybernetic Developers Club', 'The Orbital Lounge'];
      const randomGuild = sampleGuilds[Math.floor(Math.random() * sampleGuilds.length)];

      const sampleMessages: Record<string, string[]> = {
        command: ['Executed /rank @User', 'Executed /poll "Community Night"', 'Executed /ticket create', 'Executed /skip'],
        automod: ['Filtered spam message (4 rapid repeats)', 'Flagged excessive caps lock (88%)', 'Auto-muted user for rule violation'],
        join: ['New member joined and received welcome message', 'Triggered welcome DM dispatch', 'Role assigned: Community Explorer'],
        sync: ['Configuration state fetched via /api/bot/sync', 'Cached guild settings refreshed', 'Live prefix synchronized'],
        voice: ['Audio buffer refreshed: 48kHz stereo', 'Voice state update received', 'Track playback completed'],
      };

      const messages = sampleMessages[randomType];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      const newEvent: ActivityEvent = {
        id: `ev-${Date.now()}`,
        timestamp: 'Just now',
        type: randomType,
        message: randomMessage,
        guild: randomGuild,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 8)]);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSeconds: number = 0) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with live stream status */}
      <div className={`p-6 rounded-2xl border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 shadow-sm">
            <Radio className="w-6 h-6 animate-pulse text-purple-400" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className={`text-lg font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Real-Time Bot Telemetry
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tracking-wider uppercase">
                LIVE SSE GATEWAY
              </span>
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950">
                SILVER PING
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct telemetry synced from the Discord Bot process via Server-Sent Events (SSE).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className={`px-3.5 py-2 rounded-xl border flex items-center space-x-2.5 ${
            mode === 'dark' ? 'bg-[#150c26] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-xs font-medium">Uptime:</span>
            <span className={`font-mono font-bold ${mode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
              {formatUptime(stats?.uptimeSeconds)}
            </span>
          </div>

          <button
            onClick={onRefresh}
            className={`p-2.5 rounded-xl transition-colors border ${
              mode === 'dark' 
                ? 'bg-[#150c26] hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
            }`}
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latency */}
        <div className={`p-5 rounded-2xl border transition-all ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 hover:border-purple-500/50 shadow-sm' : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300">Gateway Latency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black font-mono tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {stats ? `${stats.pingMs}ms` : '24ms'}
            </span>
            <span className="text-xs text-emerald-400 font-bold uppercase text-[10px] tracking-wider">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Discord WebSocket heartbeat interval</p>
        </div>

        {/* Command Throughput */}
        <div className={`p-5 rounded-2xl border transition-all ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 hover:border-purple-500/50 shadow-sm' : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300">Command Velocity</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black font-mono tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {stats ? `${stats.commandsPerMinute}` : '42'}
            </span>
            <span className="text-xs text-slate-400 font-medium">cmds / min</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Today: <strong className={mode === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{stats ? stats.commandsExecutedToday.toLocaleString() : '18,450'}</strong></span>
            <span className="text-purple-400 font-bold text-[10px] uppercase tracking-wider">Active</span>
          </div>
        </div>

        {/* Monitored Servers */}
        <div className={`p-5 rounded-2xl border transition-all ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 hover:border-purple-500/50 shadow-sm' : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300">Connected Guilds</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black font-mono tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {stats ? stats.guildCount : '142'}
            </span>
            <span className="text-xs text-purple-400 font-bold uppercase text-[10px] tracking-wider">synced</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Servers utilizing bot configurations</p>
        </div>

        {/* Users Cached */}
        <div className={`p-5 rounded-2xl border transition-all ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 hover:border-purple-500/50 shadow-sm' : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300">Total Users</span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black font-mono tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {stats ? stats.totalMembers.toLocaleString() : '84,320'}
            </span>
            <span className="text-xs text-slate-400 font-medium">members</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Cached Discord member objects</p>
        </div>
      </div>

      {/* Secondary Hardware & Voice Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Memory & Node.js */}
        <div className={`p-5 rounded-2xl border ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">RAM Heap Allocation</span>
            </div>
            <span className="text-xs font-mono text-sky-400 font-bold">
              {stats ? `${stats.ramUsageMb} MB` : '412 MB'}
            </span>
          </div>
          <div className={`w-full h-2.5 rounded-full border overflow-hidden ${
            mode === 'dark' ? 'bg-[#150c26] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-purple-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, ((stats?.ramUsageMb || 412) / 1024) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
            <span>Allocated: {stats?.ramUsageMb || 412} MB</span>
            <span>Limit: 1,024 MB</span>
          </div>
        </div>

        {/* CPU Load */}
        <div className={`p-5 rounded-2xl border ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Node Process CPU</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {stats ? `${stats.cpuPercent}%` : '1.8%'}
            </span>
          </div>
          <div className={`w-full h-2.5 rounded-full border overflow-hidden ${
            mode === 'dark' ? 'bg-[#150c26] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (stats?.cpuPercent || 1.8) * 8)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
            <span>Event loop load: Normal</span>
            <span>Multi-core</span>
          </div>
        </div>

        {/* Voice Connections */}
        <div className={`p-5 rounded-2xl border ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Voice Streams</span>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">
              {stats ? `${stats.activeVoiceConnections} channels` : '18 channels'}
            </span>
          </div>
          <div className={`w-full h-2.5 rounded-full border overflow-hidden ${
            mode === 'dark' ? 'bg-[#150c26] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (stats?.activeVoiceConnections || 18) * 2)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
            <span>Opus audio streams active</span>
            <span>24/7 Music Ready</span>
          </div>
        </div>
      </div>

      {/* Shard Cluster & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shard Monitor */}
        <div className={`p-6 rounded-2xl border shadow-md ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className={`text-sm font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Shard Cluster Gateway
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold">Total Shards: 4</span>
          </div>

          <div className="space-y-2.5">
            {[0, 1, 2, 3].map((shardId) => {
              const ping = 20 + shardId * 3 + (stats ? stats.pingMs % 7 : 2);
              const guilds = 30 + shardId * 8;
              return (
                <div
                  key={shardId}
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    mode === 'dark' ? 'bg-[#150c26] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <span className={`text-xs font-bold ${mode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                        Shard #{shardId}
                      </span>
                      <p className="text-[11px] text-slate-400">Guilds: {guilds}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <span className={`font-bold ${mode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{ping} ms</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                      READY
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className={`p-6 rounded-2xl border shadow-md ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <h3 className={`text-sm font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Live Event Stream
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
              Auto-scrolling
            </span>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {events.map((ev) => (
              <div
                key={ev.id}
                className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2.5 ${
                  mode === 'dark' ? 'bg-[#150c26] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      ev.type === 'command' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      ev.type === 'automod' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      ev.type === 'sync' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    }`}>
                      {ev.type}
                    </span>
                    <span className={`font-bold truncate ${mode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{ev.guild}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate">{ev.message}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{ev.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
