import React, { useState } from 'react';
import { 
  Bot, 
  ExternalLink, 
  LogIn, 
  LogOut, 
  Activity, 
  Server, 
  Code2, 
  ShieldCheck,
  Zap,
  Sparkles,
  Menu,
  Palette,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Shield,
  Crown
} from 'lucide-react';
import { DiscordUser, DiscordGuild, BotLiveStats } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  user: DiscordUser | null;
  guilds: DiscordGuild[];
  selectedGuild: DiscordGuild | null;
  onSelectGuild: (guild: DiscordGuild | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  botStats: BotLiveStats | null;
  inviteUrl: string;
  onLoginClick: () => void;
  onDemoClick: () => void;
  onLogoutClick: () => void;
  onOpenOAuthGuide: () => void;
  onOpenThemeModal: () => void;
  onToggleSidebar: () => void;
  onGoToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  guilds,
  selectedGuild,
  onSelectGuild,
  activeTab,
  setActiveTab,
  botStats,
  inviteUrl,
  onLoginClick,
  onDemoClick,
  onLogoutClick,
  onOpenOAuthGuide,
  onOpenThemeModal,
  onToggleSidebar,
  onGoToLanding,
}) => {
  const { mode, toggleMode, currentTheme, classes } = useTheme();
  const [guildDropdownOpen, setGuildDropdownOpen] = useState(false);

  const formatTabName = (tab: string) => {
    switch (tab) {
      case 'servers': return 'Servers Hub';
      case 'stats': return 'Real-Time Telemetry';
      case 'sync-api': return 'REST Sync API';
      case 'overview': return 'Overview';
      case 'general': return 'General & Identity';
      case 'welcome': return 'Welcome & Goodbye';
      case 'music': return 'Music (Lavalink)';
      case 'tickets': return 'Support Tickets';
      case 'counters': return 'Voice Counters';
      case 'verification': return 'Verification Gateway';
      case 'logging': return 'Audit Logging';
      case 'automod': return 'Auto-Moderation';
      case 'leveling': return 'Leveling & XP';
      case 'modules': return 'Feature Modules';
      case 'sync': return 'Bot Sync Config';
      default: return tab;
    }
  };

  return (
    <header className={`sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors ${
      mode === 'dark' 
        ? 'bg-[#090412]/95 border-slate-800/80 text-white' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Hamburger & Breadcrumbs */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-xl transition-colors lg:hidden ${
              mode === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs & Navigation to Landing */}
          <div className="flex items-center space-x-2 text-xs">
            {onGoToLanding && (
              <button
                onClick={onGoToLanding}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border font-bold text-xs transition-colors ${
                  mode === 'dark'
                    ? 'bg-[#140b24] border-purple-900/40 text-purple-300 hover:text-white hover:border-purple-500/50'
                    : 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100'
                }`}
                title="Return to GuildNexus Landing Page"
              >
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline">Bot Home</span>
              </button>
            )}

            <button
              onClick={() => {
                onSelectGuild(null);
                setActiveTab('servers');
              }}
              className="font-bold tracking-tight text-slate-400 hover:text-purple-400 transition-colors hidden sm:inline"
            >
              Dashboard
            </button>

            {selectedGuild ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
                
                {/* Guild Switcher Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setGuildDropdownOpen(!guildDropdownOpen)}
                    className={`flex items-center space-x-2 px-2.5 py-1 rounded-xl border text-xs font-bold transition-colors ${
                      mode === 'dark'
                        ? 'bg-[#150c26] border-purple-900/40 text-white hover:border-purple-500/50'
                        : 'bg-purple-50 border-purple-200 text-purple-950 hover:border-purple-400'
                    }`}
                  >
                    {selectedGuild.icon ? (
                      <img
                        src={selectedGuild.icon}
                        alt={selectedGuild.name}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-md bg-purple-600 flex items-center justify-center text-white text-[10px]">
                        {selectedGuild.name.slice(0, 1)}
                      </div>
                    )}
                    <span className="max-w-[140px] truncate">{selectedGuild.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {guildDropdownOpen && (
                    <div className={`absolute top-full left-0 mt-2 w-64 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in ${
                      mode === 'dark' ? 'bg-[#0f081c] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/50 mb-1">
                        Switch Server
                      </div>
                      <div className="max-h-56 overflow-y-auto space-y-1">
                        {guilds.filter(g => g.canManage).map((g) => (
                          <button
                            key={g.id}
                            onClick={() => {
                              onSelectGuild(g);
                              setGuildDropdownOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                              g.id === selectedGuild.id
                                ? 'bg-purple-600 text-white font-bold'
                                : mode === 'dark'
                                  ? 'hover:bg-slate-800 text-slate-300'
                                  : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {g.icon ? (
                              <img src={g.icon} alt={g.name} className="w-6 h-6 rounded-md object-cover" />
                            ) : (
                              <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-white font-bold text-[10px]">
                                {g.name.slice(0, 1)}
                              </div>
                            )}
                            <span className="truncate flex-1 font-medium">{g.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-700/50 mt-1">
                        <button
                          onClick={() => {
                            onSelectGuild(null);
                            setActiveTab('servers');
                            setGuildDropdownOpen(false);
                          }}
                          className="w-full text-center py-1 text-xs text-purple-400 hover:text-purple-300 font-bold"
                        >
                          View All Servers Hub
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-bold text-purple-400">
                  {formatTabName(activeTab)}
                </span>
              </>
            ) : (
              <span className="font-bold text-purple-400">
                {formatTabName(activeTab)}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Status, Theme Trigger, Invite, User */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Real-time Ping Badge */}
          <div className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono ${
            mode === 'dark' ? 'bg-[#120a22] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold">Ping:</span>
            <strong className="text-emerald-400">{botStats?.pingMs || 24}ms</strong>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={onOpenThemeModal}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              mode === 'dark'
                ? 'bg-[#150c26] border-purple-900/50 hover:border-purple-500/60 text-slate-200'
                : 'bg-white border-slate-200 hover:border-purple-300 text-slate-800 shadow-sm'
            }`}
            title="Configure Dashboard Colors & Highlights"
          >
            <div 
              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm shrink-0"
              style={{ backgroundColor: currentTheme.primaryColor }}
            />
            <span className="hidden sm:inline">Theme</span>
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950 hidden md:inline">
              SILVER
            </span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleMode}
            className={`p-2 rounded-xl border transition-colors ${
              mode === 'dark'
                ? 'bg-[#120a22] border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={`Toggle to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Bot Invite Button */}
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/30 border border-purple-400/30 transition-all"
            title="Invite Discord Bot"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Invite</span>
          </a>

          {/* OAuth Guide Modal Trigger */}
          <button
            onClick={onOpenOAuthGuide}
            className={`hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              mode === 'dark' 
                ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60' 
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="OAuth Configuration Guide"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OAuth</span>
          </button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center space-x-2 pl-2">
              <div className="flex items-center space-x-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-purple-500/40 object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden xl:block text-left">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-200">{user.username}</span>
                    {user.isDemo && (
                      <span className="text-[8px] font-black px-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        DEMO
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onLogoutClick}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={onDemoClick}
                className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo</span>
              </button>

              <button
                onClick={onLoginClick}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
