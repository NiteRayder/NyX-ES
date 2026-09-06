import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ServerListView } from './components/ServerListView';
import { ServerConfigView } from './components/ServerConfigView';
import { RealTimeStatsView } from './components/RealTimeStatsView';
import { BotSyncApiView } from './components/BotSyncApiView';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { LandingPage } from './components/LandingPage';
import { DiscordUser, DiscordGuild, BotLiveStats } from './types';
import { RefreshCw, ExternalLink } from 'lucide-react';

const BOT_CLIENT_ID = '1528261975438524517';
const BOT_INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${BOT_CLIENT_ID}&scope=bot%20applications.commands&permissions=8`;

function AppContent() {
  const { mode, classes } = useTheme();
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#dashboard' || window.location.hash.startsWith('#session=')
        ? 'dashboard'
        : 'landing';
    }
    return 'landing';
  });
  const [activeTab, setActiveTab] = useState<string>('servers');
  const [serverSubTab, setServerSubTab] = useState<string>('overview');
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<DiscordGuild | null>(null);
  const [botStats, setBotStats] = useState<BotLiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
        return data;
      }
    } catch (err) {
      console.error('Error fetching dashboard session:', err);
    }

    setUser(null);
    return null;
  }, []);

  const fetchGuilds = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/guilds', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setGuilds(data.guilds || []);
        return data.guilds || [];
      }
    } catch (err) {
      console.error('Error fetching dashboard guilds:', err);
    }

    setGuilds([]);
    return [];
  }, []);

  const fetchBotStats = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/stats', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setBotStats(data.stats || data.bot || null);
      }
    } catch (err) {
      console.error('Error fetching bot telemetry:', err);
    }
  }, []);

  const initializeDashboard = useCallback(async () => {
    setLoading(true);
    const session = await fetchSession();
    if (session?.authenticated) {
      await Promise.all([fetchGuilds(), fetchBotStats()]);
    }
    setLoading(false);
  }, [fetchSession, fetchGuilds, fetchBotStats]);

  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  useEffect(() => {
    if (!user) return undefined;
    const interval = window.setInterval(fetchBotStats, 15000);
    return () => window.clearInterval(interval);
  }, [user, fetchBotStats]);

  useEffect(() => {
    const handleOAuthReturn = () => {
      const hash = window.location.hash;
      if (!hash.startsWith('#session=') && hash !== '#dashboard') return;

      setViewMode('dashboard');
      initializeDashboard();

      // The OAuth callback uses the hash only as a routing signal. The actual
      // session is stored in the secure HttpOnly gn_session cookie, so never
      // persist the session identifier in localStorage or expose it to UI code.
      if (hash.startsWith('#session=')) {
        window.history.replaceState(null, document.title, `${window.location.pathname}#dashboard`);
      }
    };

    window.addEventListener('hashchange', handleOAuthReturn);
    handleOAuthReturn();
    return () => window.removeEventListener('hashchange', handleOAuthReturn);
  }, [initializeDashboard]);

  const handleLoginClick = () => {
    // NyxEclipse owns the OAuth client secret and state validation. Keep the
    // authorization-code exchange entirely server-side and navigate through
    // the same-origin Worker so the secure session cookie survives the flow.
    window.location.assign('/api/auth/discord');
  };

  const handleLogoutClick = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    setUser(null);
    setGuilds([]);
    setSelectedGuild(null);
    setBotStats(null);
    setViewMode('landing');
    window.location.hash = '';
  };

  const handleDemoClick = () => {
    console.warn('Demo mode is no longer available in the production GuildNexus dashboard.');
    handleLoginClick();
  };

  const inviteUrl = BOT_INVITE_URL;

  const handleSelectTab = (tab: string) => {
    if (['overview', 'general', 'welcome', 'automod', 'leveling', 'modules', 'sync'].includes(tab)) {
      setServerSubTab(tab);
      setActiveTab('servers');
    } else {
      setActiveTab(tab);
      if (tab !== 'servers') {
        setSelectedGuild(null);
      }
    }
  };

  if (viewMode === 'landing') {
    return (
      <div className={`min-h-screen ${classes.bgApp} ${classes.textPrimary} font-sans selection:bg-purple-600 selection:text-white transition-colors duration-200`}>
        <LandingPage
          user={user}
          botStats={botStats}
          inviteUrl={inviteUrl}
          onOpenDashboard={() => {
            setViewMode('dashboard');
            window.location.hash = '#dashboard';
          }}
          onLoginClick={handleLoginClick}
          onDemoClick={handleDemoClick}
          onOpenOAuthGuide={handleLoginClick}
          onOpenThemeModal={() => setThemeModalOpen(true)}
        />

        <ThemeSelectorModal
          isOpen={themeModalOpen}
          onClose={() => setThemeModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${classes.bgApp} ${classes.textPrimary} font-sans selection:bg-purple-600 selection:text-white transition-colors duration-200`}>
      <Sidebar
        user={user}
        activeTab={selectedGuild ? serverSubTab : activeTab}
        onSelectTab={handleSelectTab}
        selectedGuild={selectedGuild}
        onSelectGuild={(guild) => {
          setSelectedGuild(guild);
          if (guild) {
            setActiveTab('servers');
            setServerSubTab('overview');
          }
        }}
        guilds={guilds}
        botStats={botStats}
        inviteUrl={inviteUrl}
        isOpenMobile={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onOpenThemeModal={() => setThemeModalOpen(true)}
        onLoginClick={handleLoginClick}
        onDemoClick={handleDemoClick}
        onLogoutClick={handleLogoutClick}
        onGoToLanding={() => {
          setViewMode('landing');
          window.location.hash = '';
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          user={user}
          guilds={guilds}
          selectedGuild={selectedGuild}
          onSelectGuild={(guild) => {
            setSelectedGuild(guild);
            if (guild) {
              setActiveTab('servers');
              setServerSubTab('overview');
            }
          }}
          activeTab={selectedGuild ? serverSubTab : activeTab}
          setActiveTab={handleSelectTab}
          botStats={botStats}
          inviteUrl={inviteUrl}
          onLoginClick={handleLoginClick}
          onDemoClick={handleDemoClick}
          onLogoutClick={handleLogoutClick}
          onOpenOAuthGuide={handleLoginClick}
          onOpenThemeModal={() => setThemeModalOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onGoToLanding={() => {
            setViewMode('landing');
            window.location.hash = '';
          }}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <p className={`text-sm font-semibold ${mode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                Synchronizing GuildNexus...
              </p>
            </div>
          ) : selectedGuild ? (
            <ServerConfigView
              guild={selectedGuild}
              subTab={serverSubTab}
              onSubTabChange={setServerSubTab}
              onBack={() => setSelectedGuild(null)}
            />
          ) : activeTab === 'servers' ? (
            <ServerListView
              guilds={guilds}
              onSelectGuild={(guild) => {
                setSelectedGuild(guild);
                setServerSubTab('overview');
              }}
              inviteUrl={inviteUrl}
              user={user}
            />
          ) : activeTab === 'stats' ? (
            <RealTimeStatsView stats={botStats} />
          ) : activeTab === 'sync' ? (
            <BotSyncApiView botStats={botStats} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-8">
              <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
              <p className="mt-2 text-sm opacity-70">This section is being wired into the live GuildNexus API.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
