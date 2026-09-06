import React, { useState } from 'react';
import { 
  Sliders, 
  MessageSquare, 
  ShieldAlert, 
  TrendingUp, 
  Puzzle, 
  Code, 
  ExternalLink, 
  Crown, 
  Users, 
  Bot, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Shield, 
  Sparkles, 
  Radio, 
  Terminal, 
  Volume2, 
  Coins, 
  Ticket 
} from 'lucide-react';
import { DiscordGuild, GuildConfig } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ServerOverviewTabProps {
  guild: DiscordGuild;
  config: GuildConfig;
  setConfig: (config: GuildConfig) => void;
  onNavigateTab: (tab: 'general' | 'welcome' | 'automod' | 'leveling' | 'modules' | 'sync') => void;
  inviteUrl: string;
}

export const ServerOverviewTab: React.FC<ServerOverviewTabProps> = ({
  guild,
  config,
  setConfig,
  onNavigateTab,
  inviteUrl,
}) => {
  const { mode, currentTheme, classes } = useTheme();
  const [selectedCommand, setSelectedCommand] = useState<'help' | 'rank' | 'play' | 'warn' | 'ticket'>('help');

  const activeModulesCount = Object.values(config.modules).filter(Boolean).length;

  const toggleModule = (key: keyof typeof config.modules) => {
    setConfig({
      ...config,
      modules: {
        ...config.modules,
        [key]: !config.modules[key]
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 4 Metric Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Command Prefix */}
        <div className={`p-5 rounded-2xl border transition-all ${
          mode === 'dark' 
            ? 'bg-[#0e0719] border-slate-800/80 hover:border-slate-700 shadow-sm' 
            : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300">Server Prefix</span>
            <Sliders className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-purple-400">
              {config.general.prefix}
            </span>
            <span className="text-xs text-slate-400 font-medium">Text command trigger</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Slash / commands: Active</span>
            <button 
              onClick={() => onNavigateTab('general')}
              className="text-purple-400 hover:text-purple-300 font-bold"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Metric 2: Active Modules */}
        <div className={`p-5 rounded-2xl border transition-all ${
          mode === 'dark' 
            ? 'bg-[#0e0719] border-slate-800/80 hover:border-slate-700 shadow-sm' 
            : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300">Active Features</span>
            <Puzzle className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-white dark:text-white">
              {activeModulesCount}
              <span className="text-sm font-normal text-slate-400">/6</span>
            </span>
            <span className="text-xs text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
              {activeModulesCount >= 5 ? 'OPTIMAL' : 'CUSTOM'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Music, Economy, Tickets</span>
            <button 
              onClick={() => onNavigateTab('modules')}
              className="text-purple-400 hover:text-purple-300 font-bold"
            >
              Manage
            </button>
          </div>
        </div>

        {/* Metric 3: AutoMod Shield */}
        <div className={`p-5 rounded-2xl border transition-all ${
          mode === 'dark' 
            ? 'bg-[#0e0719] border-slate-800/80 hover:border-slate-700 shadow-sm' 
            : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300">AutoMod Protection</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black tracking-tight ${config.moderation.enabled ? 'text-emerald-400' : 'text-slate-400'}`}>
              {config.moderation.enabled ? 'ARMED' : 'STANDBY'}
            </span>
            <span className="text-xs text-slate-400 font-medium">Spam Shield</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Action: {config.moderation.actionOnViolation.toUpperCase()}</span>
            <button 
              onClick={() => onNavigateTab('automod')}
              className="text-purple-400 hover:text-purple-300 font-bold"
            >
              Rules
            </button>
          </div>
        </div>

        {/* Metric 4: Leveling Engine */}
        <div className={`p-5 rounded-2xl border transition-all ${
          mode === 'dark' 
            ? 'bg-[#0e0719] border-slate-800/80 hover:border-slate-700 shadow-sm' 
            : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300">XP Multiplier</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-white dark:text-white">
              {config.leveling.enabled ? `${config.leveling.xpMultiplier}x` : '0x'}
            </span>
            <span className="text-xs text-indigo-400 font-bold uppercase text-[10px] tracking-wider">
              {config.leveling.enabled ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Role awards enabled</span>
            <button 
              onClick={() => onNavigateTab('leveling')}
              className="text-purple-400 hover:text-purple-300 font-bold"
            >
              Config
            </button>
          </div>
        </div>
      </div>

      {/* Quick Feature Toggles & Bot Simulated Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fast Module Toggles */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          mode === 'dark' 
            ? 'bg-[#0e0719] border-slate-800/80 shadow-md' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold tracking-tight">Quick Feature Controls</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live Toggle
            </span>
          </div>

          <div className="space-y-3">
            {/* Toggle 1: Welcome */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              mode === 'dark' ? 'bg-[#140b24] border-slate-800/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2.5">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="text-xs font-bold">Welcome Messages</div>
                  <div className="text-[10px] text-slate-400">Greet new joiners with embeds</div>
                </div>
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
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Toggle 2: AutoMod */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              mode === 'dark' ? 'bg-[#140b24] border-slate-800/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <div>
                  <div className="text-xs font-bold">Auto-Moderation Shield</div>
                  <div className="text-[10px] text-slate-400">Block invite spam & profanity</div>
                </div>
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
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Toggle 3: Leveling */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              mode === 'dark' ? 'bg-[#140b24] border-slate-800/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold">XP Leveling System</div>
                  <div className="text-[10px] text-slate-400">Chat activity ranks & rewards</div>
                </div>
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
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Toggle 4: Music */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              mode === 'dark' ? 'bg-[#140b24] border-slate-800/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2.5">
                <Volume2 className="w-4 h-4 text-violet-400" />
                <div>
                  <div className="text-xs font-bold">Music & Audio Player</div>
                  <div className="text-[10px] text-slate-400">High-fidelity voice streaming</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.modules.music}
                  onChange={() => toggleModule('music')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Toggle 5: Tickets */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              mode === 'dark' ? 'bg-[#140b24] border-slate-800/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2.5">
                <Ticket className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-bold">Support Ticket Panels</div>
                  <div className="text-[10px] text-slate-400">Private channel support workflows</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.modules.tickets}
                  onChange={() => toggleModule('tickets')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Discord Bot Live Command Simulator */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-4 ${
          mode === 'dark' 
            ? 'bg-[#0e0719] border-slate-800/80 shadow-md' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold tracking-tight">Discord Bot Chat Command Preview</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
              LIVE SYNCED
            </span>
          </div>

          {/* Command Switcher Pills */}
          <div className={`flex items-center space-x-1.5 p-1 rounded-xl border overflow-x-auto ${
            mode === 'dark' ? 'bg-[#05020a] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {[
              { id: 'help', label: `${config.general.prefix}help` },
              { id: 'rank', label: `${config.general.prefix}rank` },
              { id: 'play', label: `${config.general.prefix}play` },
              { id: 'warn', label: `${config.general.prefix}warn` },
              { id: 'ticket', label: `${config.general.prefix}ticket` },
            ].map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => setSelectedCommand(cmd.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedCommand === cmd.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : mode === 'dark'
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cmd.label}
              </button>
            ))}
          </div>

          {/* Simulated Discord Message Bubble */}
          <div className="rounded-2xl p-4 bg-[#313338] border border-[#3f4147] text-white shadow-inner space-y-3 font-sans">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                G
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">GuildNexus</span>
                  <span className="bg-[#5865f2] text-white text-[9px] px-1 rounded font-bold uppercase">
                    BOT
                  </span>
                  <span className="text-[10px] text-slate-400">Today at 9:42 PM</span>
                </div>

                {/* Simulated Embed */}
                <div className="p-3.5 rounded-lg bg-[#2b2d31] border-l-4 border-purple-500 space-y-2 text-xs">
                  {selectedCommand === 'help' && (
                    <>
                      <div className="font-bold text-white text-sm flex items-center justify-between">
                        <span>GuildNexus Command Index — {guild.name}</span>
                        <span className="text-[10px] font-mono text-purple-400">Prefix: {config.general.prefix}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Welcome to the official <strong>{guild.name}</strong> bot control plane. Below are the enabled command groups:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded bg-[#1e1f22] border border-[#35373c]">
                          <span className="font-bold text-sky-400">🛡️ Moderation</span>
                          <p className="text-slate-400 text-[10px] mt-0.5">{config.general.prefix}warn, {config.general.prefix}kick, {config.general.prefix}mute, {config.general.prefix}purge</p>
                        </div>
                        <div className="p-2 rounded bg-[#1e1f22] border border-[#35373c]">
                          <span className="font-bold text-emerald-400">📈 Leveling</span>
                          <p className="text-slate-400 text-[10px] mt-0.5">{config.general.prefix}rank, {config.general.prefix}leaderboard, {config.general.prefix}xp</p>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedCommand === 'rank' && (
                    <>
                      <div className="font-bold text-white text-sm flex items-center justify-between">
                        <span>Level & Experience Card</span>
                        <span className="text-amber-400 font-bold">Rank #4</span>
                      </div>
                      <div className="flex items-center space-x-3 pt-1">
                        <div className="w-10 h-10 rounded-full bg-purple-700/80 flex items-center justify-center font-bold">
                          U
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span>Level 14</span>
                            <span className="text-purple-300 font-mono">4,820 / 5,000 XP</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" style={{ width: '96%' }} />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedCommand === 'play' && (
                    <>
                      <div className="font-bold text-white text-sm flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span>Now Playing in Voice Channel #music</span>
                      </div>
                      <p className="text-slate-200 text-xs">
                        <strong>Synthwave Odyssey - Lofi Beats 24/7</strong> (3:45 / 4:20)
                      </p>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '70%' }} />
                      </div>
                    </>
                  )}

                  {selectedCommand === 'warn' && (
                    <>
                      <div className="font-bold text-rose-400 text-sm flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4" />
                        <span>AutoMod Incident Enforced</span>
                      </div>
                      <p className="text-slate-300 text-xs">
                        <strong>User:</strong> @SpamAccount123 • <strong>Reason:</strong> Unauthorized Discord Invite Link detected.
                      </p>
                      <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        Action Taken: MUTE (15m) • Logged to #{config.moderation.modLogChannelId || 'mod-logs'}
                      </span>
                    </>
                  )}

                  {selectedCommand === 'ticket' && (
                    <>
                      <div className="font-bold text-purple-300 text-sm flex items-center space-x-2">
                        <Ticket className="w-4 h-4" />
                        <span>Support Ticket Opened — #ticket-0412</span>
                      </div>
                      <p className="text-slate-300 text-xs">
                        A staff member from <strong>{guild.name}</strong> will be with you shortly. Click below to close the ticket when resolved.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Shortcuts Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold tracking-tight flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <span>Server Configuration Sections</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              tab: 'general' as const,
              title: 'General & Identity',
              desc: 'Configure prefix, bot nickname, custom embed colors, and server timezone',
              icon: Sliders,
              color: 'text-purple-400'
            },
            {
              tab: 'welcome' as const,
              title: 'Welcome & Goodbye',
              desc: 'Custom join cards, auto-assigned roles on join, DM welcomes, and departure messages',
              icon: MessageSquare,
              color: 'text-sky-400'
            },
            {
              tab: 'automod' as const,
              title: 'Auto-Moderation',
              desc: 'Spam filters, invite blockers, profanity censors, and mass-mention rate limits',
              icon: ShieldAlert,
              color: 'text-rose-400'
            },
            {
              tab: 'leveling' as const,
              title: 'Leveling & XP',
              desc: 'XP multiplier curve, level-up announcements, and automated role rewards at milestones',
              icon: TrendingUp,
              color: 'text-emerald-400'
            },
            {
              tab: 'modules' as const,
              title: 'Feature Modules',
              desc: 'Toggle 24/7 music player, virtual server economy, reaction roles, and tickets',
              icon: Puzzle,
              color: 'text-violet-400'
            },
            {
              tab: 'sync' as const,
              title: 'Bot Sync Config',
              desc: 'View live REST sync endpoints, JSON configurations, and Discord.js v14 code generator',
              icon: Code,
              color: 'text-indigo-400'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                  mode === 'dark'
                    ? 'bg-[#0e0719] border-slate-800/80 hover:border-purple-500/50 hover:bg-[#140c24] shadow-sm'
                    : 'bg-white border-slate-200 hover:border-purple-400 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-sm font-bold text-white dark:text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-bold text-purple-400">
                  <span>Configure Module</span>
                  <span className="text-[10px] text-slate-500 font-normal">Instant sync</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
