import React, { useState } from 'react';
import { 
  Crown, 
  Shield, 
  Settings, 
  PlusCircle, 
  Search, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  ExternalLink,
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';
import { DiscordGuild, DiscordUser } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ServerListViewProps {
  user: DiscordUser | null;
  guilds: DiscordGuild[];
  onSelectGuild: (guild: DiscordGuild) => void;
  onLoginClick: () => void;
  onDemoClick: () => void;
  inviteUrl: string;
}

export const ServerListView: React.FC<ServerListViewProps> = ({
  user,
  guilds,
  onSelectGuild,
  onLoginClick,
  onDemoClick,
  inviteUrl,
}) => {
  const { mode, currentTheme, classes } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'manageable' | 'active' | 'needs-invite'>('all');

  const filteredGuilds = guilds.filter((guild) => {
    const matchesSearch = guild.name.toLowerCase().includes(searchQuery.toLowerCase()) || guild.id.includes(searchQuery);
    if (!matchesSearch) return false;

    if (filter === 'manageable') return guild.canManage;
    if (filter === 'active') return guild.botPresent;
    if (filter === 'needs-invite') return guild.canManage && !guild.botPresent;
    return true;
  });

  const manageableCount = guilds.filter((g) => g.canManage).length;
  const activeCount = guilds.filter((g) => g.botPresent).length;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight flex items-center space-x-2 ${
            mode === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <span>Discord Server Network</span>
            {user && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                mode === 'dark' ? 'bg-[#150c26] text-purple-300 border-purple-900/50' : 'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                {guilds.length} Servers
              </span>
            )}
            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950">
              SILVER TRIM
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select a server you manage to adjust prefixes, auto-moderation rules, welcome embeds, and sync directly with the bot.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search servers by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                mode === 'dark'
                  ? 'bg-[#120a22] border-slate-800 text-slate-200 placeholder-slate-500 focus:border-purple-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-400'
              }`}
            />
          </div>

          <div className={`flex items-center space-x-1 p-1 rounded-xl border text-xs ${
            mode === 'dark' ? 'bg-[#0e0719] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider ${
                filter === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : mode === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({guilds.length})
            </button>
            <button
              onClick={() => setFilter('manageable')}
              className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider ${
                filter === 'manageable'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : mode === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manageable ({manageableCount})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider ${
                filter === 'active'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : mode === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bot Live ({activeCount})
            </button>
          </div>
        </div>
      </div>

      {/* Unauthenticated / Login Prompt Banner */}
      {!user && (
        <div className={`p-6 rounded-2xl border shadow-md flex flex-col md:flex-row items-center justify-between gap-6 ${
          mode === 'dark'
            ? 'bg-gradient-to-r from-[#120822] via-[#1a0c33] to-[#120822] border-purple-900/50'
            : 'bg-gradient-to-r from-purple-50 via-white to-purple-50 border-purple-200'
        }`}>
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <h3 className={`text-base font-bold tracking-tight ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Connect Your Discord Account
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Sign in via Discord OAuth2 to fetch your actual servers and verified administrator permissions, or test immediately with our pre-populated interactive Demo guilds.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onDemoClick}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
                mode === 'dark'
                  ? 'bg-[#1a0e30] hover:bg-[#231442] text-amber-300 border-amber-500/30'
                  : 'bg-white hover:bg-slate-50 text-amber-700 border-amber-300 shadow-sm'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore Demo Servers</span>
            </button>
            <button
              onClick={onLoginClick}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-purple-600 text-white text-xs font-black rounded-xl hover:bg-purple-500 shadow-lg shadow-purple-900/30 border border-purple-400/30 uppercase tracking-wider transition-all"
            >
              <span>Login with Discord</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Guilds Grid */}
      {filteredGuilds.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border border-dashed ${
          mode === 'dark' ? 'bg-[#0e0719] border-slate-800' : 'bg-slate-50 border-slate-300'
        }`}>
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-300">No matching Discord servers found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? 'Try adjusting your search keywords' : 'Log in to view your Discord servers'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuilds.map((guild) => (
            <div
              key={guild.id}
              className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                guild.canManage
                  ? mode === 'dark'
                    ? 'bg-[#0e0719] hover:bg-[#140c24] border-slate-800/80 hover:border-purple-500/50 shadow-sm hover:shadow-xl hover:shadow-purple-950/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300 shadow-sm hover:shadow-md'
                  : mode === 'dark'
                    ? 'bg-[#080410]/70 border-slate-800/60 opacity-60'
                    : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              {/* Guild Header Info */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {guild.icon ? (
                      <img
                        src={guild.icon}
                        alt={guild.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700/60 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-purple-600/30 shrink-0">
                        {guild.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h4 className={`text-sm font-bold truncate ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`} title={guild.name}>
                          {guild.name}
                        </h4>
                        {guild.owner && (
                          <span title="Server Owner">
                            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>
                          {guild.approximateMemberCount
                            ? `${guild.approximateMemberCount.toLocaleString()} members`
                            : 'Active Server'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bot Status Indicator */}
                  {guild.botPresent ? (
                    <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span>BOT LIVE</span>
                    </span>
                  ) : (
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      mode === 'dark' ? 'bg-[#150c26] text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      <span>Not Joined</span>
                    </span>
                  )}
                </div>

                {/* Permissions Badges with Silver Highlights */}
                <div className="flex flex-wrap items-center gap-1.5 mb-5">
                  {guild.isAdmin ? (
                    <span className="inline-flex items-center space-x-1 text-[9px] font-black px-2 py-0.5 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950 uppercase tracking-wider shadow-sm">
                      <Shield className="w-2.5 h-2.5 text-slate-900" />
                      <span>ADMINISTRATOR</span>
                    </span>
                  ) : guild.canManage ? (
                    <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      mode === 'dark' ? 'bg-purple-950/40 text-purple-300 border-purple-800/40' : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      <Shield className="w-2.5 h-2.5 text-purple-400" />
                      <span>MANAGE SERVER</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-800 uppercase tracking-wider">
                      <Lock className="w-2.5 h-2.5 text-slate-500" />
                      <span>MEMBER ONLY</span>
                    </span>
                  )}

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    mode === 'dark' ? 'bg-[#150c26] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    ID: {guild.id}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className={`pt-4 border-t flex items-center justify-between gap-2 ${
                mode === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
              }`}>
                {guild.canManage ? (
                  guild.botPresent ? (
                    <button
                      onClick={() => onSelectGuild(guild)}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30 border border-purple-400/30 transition-all focus:outline-none"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Configure Dashboard</span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center space-x-2">
                      <a
                        href={guild.inviteUrl || inviteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-sm transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Invite Bot</span>
                      </a>
                      <button
                        onClick={() => onSelectGuild(guild)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
                          mode === 'dark' 
                            ? 'text-slate-300 bg-[#150c26] hover:bg-slate-800 border-slate-800' 
                            : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
                        }`}
                        title="Configure settings in advance"
                      >
                        Pre-config
                      </button>
                    </div>
                  )
                ) : (
                  <div className={`w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-medium border cursor-not-allowed uppercase tracking-wider ${
                    mode === 'dark' ? 'bg-[#080410] text-slate-500 border-slate-800/80' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Requires Manage Server</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
