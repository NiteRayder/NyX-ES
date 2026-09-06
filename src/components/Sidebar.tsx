import React from 'react';
import { 
  Server, 
  Activity, 
  Code2, 
  Sliders, 
  MessageSquare, 
  ShieldAlert, 
  TrendingUp, 
  Puzzle, 
  Layers, 
  Ticket, 
  FileText, 
  LogOut, 
  Palette, 
  Sun, 
  Moon, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  Crown, 
  Shield, 
  Bot, 
  Sparkles,
  Zap,
  Radio,
  CheckCircle2,
  X
} from 'lucide-react';
import { DiscordGuild, DiscordUser, BotLiveStats } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  user: DiscordUser | null;
  guilds: DiscordGuild[];
  selectedGuild: DiscordGuild | null;
  onSelectGuild: (guild: DiscordGuild | null) => void;
  activeTab: string; // 'servers' | 'stats' | 'sync-api' | server subtabs ('overview' | 'general' | 'welcome' | 'automod' | 'leveling' | 'modules' | 'tickets' | 'logs' | 'sync')
  onSelectTab: (tab: string) => void;
  botStats: BotLiveStats | null;
  inviteUrl?: string;
  onOpenThemeModal?: () => void;
  onLogout?: () => void;
  onLogoutClick?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onLoginClick?: () => void;
  onDemoClick?: () => void;
  onGoToLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  guilds,
  selectedGuild,
  onSelectGuild,
  activeTab,
  onSelectTab,
  botStats,
  inviteUrl = '#',
  onOpenThemeModal = () => {},
  onLogout,
  onLogoutClick,
  isOpenMobile,
  onCloseMobile,
  isOpen,
  onClose,
  onLoginClick,
  onDemoClick,
  onGoToLanding,
}) => {
  const { mode, accent, toggleMode, currentTheme, classes } = useTheme();

  const isActuallyOpen = isOpenMobile ?? isOpen ?? false;
  const handleClose = onCloseMobile || onClose || (() => {});
  const handleLogout = onLogout || onLogoutClick || (() => {});

  const manageableGuilds = guilds.filter(g => g.canManage);

  const isServerContext = Boolean(selectedGuild);

  return (
    <>
      {/* Mobile Backdrop */}
      {isActuallyOpen && (
        <div 
          onClick={handleClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isActuallyOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          mode === 'dark' 
            ? 'bg-[#090412] border-slate-800/80 text-slate-200' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Brand Header */}
        <div className={`h-16 px-5 border-b flex items-center justify-between shrink-0 ${
          mode === 'dark' ? 'border-slate-800/80 bg-[#0c0617]' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-600/40 border border-slate-300/40">
              G
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-white dark:text-white">
                  Guild<span className="text-purple-400">Nexus</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950">
                  SILVER
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Discord.js v14 Online</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Context / Quick Selector Strip */}
        <div className={`p-3 border-b shrink-0 ${
          mode === 'dark' ? 'border-slate-800/60 bg-[#0f081c]' : 'border-slate-100 bg-slate-50/50'
        }`}>
          {selectedGuild ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Active Server</span>
                <button
                  onClick={() => {
                    onSelectGuild(null);
                    onSelectTab('servers');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-0.5"
                >
                  <span>Switch</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center space-x-3 ${
                mode === 'dark' 
                  ? 'bg-[#150c26] border-purple-900/40 shadow-sm' 
                  : 'bg-purple-50/80 border-purple-200 text-purple-950'
              }`}>
                {selectedGuild.icon ? (
                  <img
                    src={selectedGuild.icon}
                    alt={selectedGuild.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-lg object-cover border border-slate-700 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                    {selectedGuild.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <h4 className="text-xs font-bold truncate text-white dark:text-white" title={selectedGuild.name}>
                      {selectedGuild.name}
                    </h4>
                    {selectedGuild.owner && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{selectedGuild.botPresent ? 'Synced' : 'Invite Needed'}</span>
                    <span>•</span>
                    <span>{selectedGuild.approximateMemberCount ? `${selectedGuild.approximateMemberCount.toLocaleString()} mem.` : 'Active'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onSelectTab('servers')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                activeTab === 'servers'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30 border-purple-400/40'
                  : mode === 'dark'
                    ? 'bg-[#140b24] border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center border border-white/20">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold">Select a Discord Server</div>
                  <div className="text-[10px] opacity-75">{guilds.length} servers available</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Section 1: Server Management (When a server is selected) */}
          {selectedGuild && (
            <div className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Server Configuration
              </div>

              <button
                onClick={() => onSelectTab('overview')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? classes.activeTabClass
                    : mode === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Overview Dashboard</span>
              </button>

              <button
                onClick={() => onSelectTab('general')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'general'
                    ? classes.activeTabClass
                    : mode === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
                <span>General & Identity</span>
              </button>

              <button
                onClick={() => onSelectTab('welcome')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'welcome'
                    ? classes.activeTabClass
                    : mode === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Welcome & Goodbye</span>
              </button>

              <button
                onClick={() => onSelectTab('automod')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'automod'
                    ? classes.activeTabClass
                    : mode === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Auto-Moderation</span>
              </button>

              <button
                onClick={() => onSelectTab('leveling')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'leveling'
                    ? classes.activeTabClass
                    : mode === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Leveling & XP</span>
              </button>

              <button
                onClick={() => onSelectTab('modules')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'modules'
                    ? classes.activeTabClass
                    : mode === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Puzzle className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Feature Modules</span>
              </button>

              <button
                onClick={() => onSelectTab('sync')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'sync'
                    ? classes.activeTabClass
                    : mode === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Code2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Bot Sync Config</span>
              </button>
            </div>
          )}

          {/* Section 2: Hub & Global Views */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Dashboard Hub
            </div>

            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-purple-900/40 mb-2 ${
                  mode === 'dark'
                    ? 'bg-purple-950/20 text-purple-300 hover:bg-purple-900/30 hover:text-white'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                }`}
              >
                <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                <span>← Bot Landing Page</span>
              </button>
            )}

            <button
              onClick={() => {
                onSelectGuild(null);
                onSelectTab('servers');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'servers'
                  ? classes.activeTabClass
                  : mode === 'dark'
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Server className="w-4 h-4 text-purple-400 shrink-0" />
                <span>All Discord Servers</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'servers'
                  ? 'bg-black/30 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {guilds.length}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('stats')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'stats'
                  ? classes.activeTabClass
                  : mode === 'dark'
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time Telemetry</span>
              </div>
              {botStats && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {botStats.pingMs}ms
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('sync-api')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sync-api'
                  ? classes.activeTabClass
                  : mode === 'dark'
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Developer REST Sync API</span>
            </button>
          </div>

          {/* Bot Connection Card */}
          <div className={`p-4 rounded-2xl border ${
            mode === 'dark' 
              ? 'bg-[#11091e] border-slate-800 text-slate-300' 
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Gateway Stream</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                CONNECTED
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Total Servers:</span>
                <strong className="text-white font-mono">{botStats?.guildCount || 142}</strong>
              </div>
              <div className="flex justify-between">
                <span>Cached Members:</span>
                <strong className="text-white font-mono">{botStats?.totalMembers?.toLocaleString() || '84,320'}</strong>
              </div>
            </div>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Invite Bot to Server</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Footer / User Profile & Theme Quick Toggle */}
        <div className={`p-3.5 border-t shrink-0 space-y-2 ${
          mode === 'dark' ? 'border-slate-800/80 bg-[#0c0617]' : 'border-slate-100 bg-slate-50'
        }`}>
          {/* Quick Theme Switcher Bar */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={onOpenThemeModal}
              className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mode === 'dark' 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Change theme colors and highlights"
            >
              <div 
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: currentTheme.primaryColor }}
              />
              <span>Theme: {currentTheme.name.split(' ')[0]}</span>
            </button>

            <button
              onClick={toggleMode}
              className={`p-1.5 rounded-lg transition-colors ${
                mode === 'dark' 
                  ? 'text-amber-400 hover:bg-slate-800' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
              title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* User Strip */}
          {user ? (
            <div className={`p-2 rounded-xl border flex items-center justify-between ${
              mode === 'dark' ? 'bg-[#150c26] border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center space-x-2.5 min-w-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold truncate text-white dark:text-white">
                      {user.username}
                    </span>
                    {user.isDemo && (
                      <span className="text-[8px] font-black px-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
                        DEMO
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-purple-400 truncate">
                    {user.discriminator !== '0' ? `#${user.discriminator}` : 'Server Admin'}
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-[11px] text-slate-400">Guest Preview Mode</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
