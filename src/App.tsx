import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ServerListView } from './components/ServerListView';
import { ServerConfigView } from './components/ServerConfigView';
import { RealTimeStatsView } from './components/RealTimeStatsView';
import { BotSyncApiView } from './components/BotSyncApiView';
import { OAuthGuideModal } from './components/OAuthGuideModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { LandingPage } from './components/LandingPage';
import { DiscordUser, DiscordGuild, BotLiveStats, AuthStatusResponse } from './types';
import { RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { mode, classes } = useTheme();
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#dashboard') {
      return 'dashboard';
    }
    return 'landing';
  });
  const [activeTab, setActiveTab] = useState<string>('servers');
  const [serverSubTab, setServerSubTab] = useState<string>('overview');
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<DiscordGuild | null>(null);
  const [botStats, setBotStats] = useState<BotLiveStats | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch authentication status and credentials info
  const fetchAuthStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        const data: AuthStatusResponse = await res.json();
        setAuthStatus(data);
        setUser(data.user);
        return data;
      }
    } catch (err) {
      console.error('Error fetching auth status:', err);
    }
    return null;
  }, []);

  // Fetch user's Discord guilds
  const fetchGuilds = useCallback(async () => {
    try {
      const res = await fetch('/api/guilds');
      if (res.ok) {
        const data = await res.json();
        setGuilds(data.guilds || []);
      }
    } catch (err) {
      console.error('Error fetching guilds:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    async function init() {
      setLoading(true);
      const status = await fetchAuthStatus();
      if (status?.authenticated) {
        await fetchGuilds();
      }
      setLoading(false);
    }
    init();
  }, [fetchAuthStatus, fetchGuilds]);

  // Connect to Server-Sent Events (SSE) for live bot stats
  useEffect(() => {
    const eventSource = new EventSource('/api/stats/realtime');

    eventSource.onmessage = (event) => {
      try {
        const liveStats = JSON.parse(event.data);
        setBotStats(liveStats);
      } catch (err) {
        console.error('Error parsing SSE stats:', err);
      }
    };

    eventSource.onerror = () => {
      // Reconnection handled automatically
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Listen for OAuth postMessage from popup window
  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const status = await fetchAuthStatus();
        if (status?.authenticated) {
          await fetchGuilds();
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [fetchAuthStatus, fetchGuilds]);

  // Handle Discord OAuth Login Click
  const handleLoginClick = async () => {
    try {
      const res = await fetch('/api/auth/url');
      const data = await res.json();

      if (!data.url || !data.isConfigured) {
        setOauthModalOpen(true);
        return;
      }

      const authWindow = window.open(
        data.url,
        'discord_oauth',
        'width=600,height=750,menubar=no,toolbar=no,status=no'
      );

      if (!authWindow) {
        alert('Please allow popups for this site to authenticate with Discord.');
      }
    } catch (err) {
      console.error('OAuth flow initiation failed:', err);
      setOauthModalOpen(true);
    }
  };

  // Handle Demo Login Click
  const handleDemoClick = async () => {
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      if (res.ok) {
        await fetchAuthStatus();
        await fetchGuilds();
      }
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  // Handle Logout Click
  const handleLogoutClick = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setGuilds([]);
      setSelectedGuild(null);
      await fetchAuthStatus();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const inviteUrl = authStatus?.inviteUrl || 'https://discord.com/oauth2/authorize?client_id=demo&scope=bot&permissions=8';

  // Handle tab switching from Sidebar or Navbar
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
          onDemoClick={async () => {
            await handleDemoClick();
            setViewMode('dashboard');
            window.location.hash = '#dashboard';
          }}
          onOpenOAuthGuide={() => setOauthModalOpen(true)}
          onOpenThemeModal={() => setThemeModalOpen(true)}
        />

        {/* OAuth Setup Instructions Modal */}
        <OAuthGuideModal
          isOpen={oauthModalOpen}
          onClose={() => setOauthModalOpen(false)}
          callbackUrl={authStatus?.callbackUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          isConfigured={authStatus?.isConfigured || false}
          clientId={authStatus?.clientId || null}
          credentialsStatus={authStatus?.credentialsStatus}
          onDemoClick={handleDemoClick}
        />

        {/* Theme Customizer Modal */}
        <ThemeSelectorModal
          isOpen={themeModalOpen}
          onClose={() => setThemeModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${classes.bgApp} ${classes.textPrimary} font-sans selection:bg-purple-600 selection:text-white transition-colors duration-200`}>
      {/* Sleek Collapsible Sidebar */}
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

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
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
          onOpenOAuthGuide={() => setOauthModalOpen(true)}
          onOpenThemeModal={() => setThemeModalOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onGoToLanding={() => {
            setViewMode('landing');
            window.location.hash = '';
          }}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <p className={`text-sm font-semibold ${mode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                Synchronizing GuildNexus...
              </p>
              <p className="text-xs text-slate-500">Connecting to Discord Gateway and local state</p>
            </div>
          ) : (
            <>
              {/* View 1: Servers & Server Configuration */}
              {activeTab === 'servers' && (
                selectedGuild ? (
                  <ServerConfigView
                    guild={selectedGuild}
                    onBack={() => {
                      setSelectedGuild(null);
                      setActiveTab('servers');
                    }}
                    inviteUrl={inviteUrl}
                    activeSubTab={serverSubTab}
                    onTabChange={(tab) => setServerSubTab(tab)}
                  />
                ) : (
                  <ServerListView
                    user={user}
                    guilds={guilds}
                    onSelectGuild={(guild) => {
                      setSelectedGuild(guild);
                      setServerSubTab('overview');
                    }}
                    onLoginClick={handleLoginClick}
                    onDemoClick={handleDemoClick}
                    inviteUrl={inviteUrl}
                  />
                )
              )}

              {/* View 2: Real-Time Statistics */}
              {activeTab === 'stats' && (
                <RealTimeStatsView
                  stats={botStats}
                  onRefresh={fetchAuthStatus}
                />
              )}

              {/* View 3: Bot Sync API Documentation */}
              {activeTab === 'sync-api' && (
                <BotSyncApiView
                  botStats={botStats}
                />
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className={`border-t py-6 text-center text-xs transition-colors ${
          mode === 'dark'
            ? 'border-slate-800/80 bg-[#07030e]/60 text-slate-400'
            : 'border-slate-200 bg-slate-50 text-slate-500'
        }`}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight">GuildNexus</span>
              <span>•</span>
              <span>Discord Bot Dashboard</span>
              <span className="hidden md:inline px-1.5 py-0.5 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                SILVER TRIM
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setViewMode('landing');
                  window.location.hash = '';
                }}
                className="hover:text-purple-400 text-purple-300 font-semibold transition-colors"
              >
                ← Bot Landing Page
              </button>
              <button
                onClick={() => setThemeModalOpen(true)}
                className="hover:text-purple-400 transition-colors font-medium"
              >
                Color Theme & Highlights
              </button>
              <button
                onClick={() => setOauthModalOpen(true)}
                className="hover:text-purple-400 transition-colors font-medium"
              >
                OAuth Guide
              </button>
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition-colors font-medium inline-flex items-center space-x-1"
              >
                <span>Invite Bot</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* OAuth Setup Instructions Modal */}
      <OAuthGuideModal
        isOpen={oauthModalOpen}
        onClose={() => setOauthModalOpen(false)}
        callbackUrl={authStatus?.callbackUrl || `${window.location.origin}/auth/callback`}
        isConfigured={authStatus?.isConfigured || false}
        clientId={authStatus?.clientId || null}
        credentialsStatus={authStatus?.credentialsStatus}
        onDemoClick={handleDemoClick}
      />

      {/* Theme Customizer Modal */}
      <ThemeSelectorModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
      />
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
