import React, { useState } from 'react';
import { 
  Bot, 
  Zap, 
  Shield, 
  Coins, 
  Award, 
  MessageSquare, 
  Radio, 
  ArrowRight, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  Terminal, 
  Sparkles, 
  Flame, 
  Server, 
  Sliders, 
  Lock, 
  Search, 
  HelpCircle, 
  Copy, 
  CheckCircle2, 
  Sun, 
  Moon, 
  ShieldCheck, 
  RefreshCw,
  Users,
  Layers,
  ChevronDown,
  Music
} from 'lucide-react';
import { BotLiveStats, DiscordUser } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  user: DiscordUser | null;
  botStats: BotLiveStats | null;
  inviteUrl: string;
  onOpenDashboard: () => void;
  onLoginClick: () => void;
  onDemoClick: () => void;
  onOpenOAuthGuide: () => void;
  onOpenThemeModal: () => void;
}

interface CommandItem {
  name: string;
  category: 'core' | 'music' | 'moderation' | 'leveling' | 'tickets' | 'counters' | 'economy';
  usage: string;
  permission: string;
  description: string;
  embedPreview: {
    color: string;
    title: string;
    description: string;
    fields: Array<{ name: string; value: string; inline?: boolean }>;
    footer: string;
  };
}

const COMMANDS_DATA: CommandItem[] = [
  {
    name: '/help',
    category: 'core',
    usage: '/help [category]',
    permission: 'Everyone',
    description: 'Displays NyxEclipse\'s 18 modular feature suites, command descriptions, and syntax guides.',
    embedPreview: {
      color: '#336699',
      title: '🌙 NyxEclipse Command Suite • [v2.1.0]',
      description: 'Select a module below or run `/help <command>` for in-depth parameter guidance.',
      fields: [
        { name: '🎵 Music (Lavalink v4)', value: '`/play`, `/queue`, `/music`, `/nowplaying`', inline: true },
        { name: '🛡️ Moderation & Cases', value: '`/warn`, `/cases`, `/timeout`, `/purge`, `/lock`', inline: true },
        { name: '⭐ Leveling & XP', value: '`/rank`, `/level`, `/leaderboard`, `/levelset`', inline: true },
        { name: '🎫 Ticket Desk', value: '`/ticket`, `/claim`, `/close`, `/priority`', inline: true },
        { name: '🔊 Server Counters', value: '`/serverstats create`, `/serverstats list`', inline: true },
        { name: '🪙 Economy & Shop', value: '`/balance`, `/work`, `/daily`, `/shop`, `/gamble`', inline: true },
        { name: '🎂 Community & Events', value: '`/birthday set`, `/gcreate`, `/reactroles`', inline: true },
        { name: '🌐 Web Dashboard', value: 'Powered by **GuildNexus** with live sync', inline: true },
      ],
      footer: 'NyxEclipse by NiteRayder • Presence: stalking',
    },
  },
  {
    name: '/play',
    category: 'music',
    usage: '/play query:<song_title_or_url>',
    permission: 'Everyone',
    description: 'High-fidelity audio streaming powered by Lavalink v4 & Riffy with Spotify, YouTube, and Deezer support.',
    embedPreview: {
      color: '#8b5cf6',
      title: '🎵 Now Playing • Lavalink v4 Audio Node',
      description: '**Synthesize - Midnight Drive** [3:42]',
      fields: [
        { name: 'Channel', value: '🔊 **Music Lounge #1**', inline: true },
        { name: 'Requested By', value: '<@910293849102> (Member)', inline: true },
        { name: 'Audio Engine', value: '`Riffy v4 (24/7 Mode Active)`', inline: true },
        { name: 'Volume / Filter', value: '`80%` • `Bassboost: Soft`', inline: true },
        { name: 'Up Next in Queue', value: '1. `Solaris - Horizons [4:15]`\n2. `Echoes - Starlight [3:50]`', inline: false },
      ],
      footer: 'NyxEclipse Music Suite • Interactive Button Controls Enabled',
    },
  },
  {
    name: '/warn',
    category: 'moderation',
    usage: '/warn user:<@user> reason:<text>',
    permission: 'Moderator',
    description: 'Issues a formal warning to a server member, increments their infraction case count, and logs to mod audit channel.',
    embedPreview: {
      color: '#ed4245',
      title: '⚠️ Moderation Case #1042 • Warning Issued',
      description: 'A formal warning has been issued and archived in the server infraction database.',
      fields: [
        { name: 'Target User', value: '<@41829103912> (`User#1234`)', inline: true },
        { name: 'Moderator', value: '<@89218392103> (Staff)', inline: true },
        { name: 'Reason', value: '`Inappropriate language in #general-chat`', inline: false },
        { name: 'Total Cases', value: '`2 Warnings, 0 Timeouts`', inline: true },
        { name: 'DM Notification', value: '🟢 **Dispatched to User**', inline: true },
      ],
      footer: 'NyxEclipse Moderation Matrix • Synced with GuildNexus Dashboard',
    },
  },
  {
    name: '/cases',
    category: 'moderation',
    usage: '/cases [user:<@user>] [page:<number>]',
    permission: 'Moderator',
    description: 'Queries the complete moderation history and case registry for an individual member or the whole server.',
    embedPreview: {
      color: '#336699',
      title: '📋 Moderation Case Registry • Target: @Alex',
      description: 'Summary of past infractions recorded by NyxEclipse moderation heuristics.',
      fields: [
        { name: 'Case #1038 [Timeout]', value: '`10m Timeout for Spam Flood` by <@89218392103>', inline: false },
        { name: 'Case #1042 [Warn]', value: '`Inappropriate language in #general-chat` by <@89218392103>', inline: false },
        { name: 'Active Status', value: '`Clean (No current timeout or mute)`', inline: true },
        { name: 'User Notes', value: '`1 note added by Staff`', inline: true },
      ],
      footer: 'NyxEclipse Moderation • Page 1/1',
    },
  },
  {
    name: '/rank',
    category: 'leveling',
    usage: '/rank [user:<@user>]',
    permission: 'Everyone',
    description: 'Generates an interactive player card with current level, XP progress bar, server rank, and unlocked reward roles.',
    embedPreview: {
      color: '#3498db',
      title: '⭐ Player Level & XP Card',
      description: 'Profile status for **Commander Alex** in this community.',
      fields: [
        { name: 'Server Rank', value: '👑 **#3** of 1,280 Members', inline: true },
        { name: 'Current Level', value: '🎖️ **Level 16**', inline: true },
        { name: 'XP Progress', value: '`4,820 / 6,000 XP` (80.3%)', inline: true },
        { name: 'Progress Bar', value: '`[████████░░]` 1,180 XP to Level 17', inline: false },
        { name: 'Unlocked Role Perks', value: '`@Level 5 Veteran` • `@Level 10 Champion`', inline: false },
      ],
      footer: 'NyxEclipse Leveling Engine • 1.0x Server XP Active',
    },
  },
  {
    name: '/ticket',
    category: 'tickets',
    usage: '/ticket setup [category:<id>]',
    permission: 'Administrator',
    description: 'Deploys an interactive button panel for private support tickets, transcripts, and staff claiming.',
    embedPreview: {
      color: '#5865f2',
      title: '🎫 Server Support Desk • Open a Ticket',
      description: 'Need assistance from our staff? Click the button below to spawn a private, encrypted ticket channel.',
      fields: [
        { name: 'Available Topics', value: '• General Inquiries\n• Staff Application Support\n• Moderation Appeals', inline: true },
        { name: 'Staff Support Team', value: '<@&829102938> (@Moderator)', inline: true },
        { name: 'Transcripts', value: 'Auto-generated on close & DM\'d to user', inline: false },
      ],
      footer: 'NyxEclipse Ticket Desk • Click [Create Ticket] below to start',
    },
  },
  {
    name: '/serverstats create',
    category: 'counters',
    usage: '/serverstats create type:<members|bots|humans>',
    permission: 'Administrator',
    description: 'Instantly provisions dynamic voice channel counters that update with live Discord guild statistics.',
    embedPreview: {
      color: '#57f287',
      title: '🔊 Server Counter Channel Created',
      description: 'Voice counter channel provisioned and locked from user connections.',
      fields: [
        { name: 'Counter Type', value: '`Total Members`', inline: true },
        { name: 'Channel Name', value: '`🔊 Total Members: 1,280`', inline: true },
        { name: 'Update Frequency', value: '`Every 10 minutes (Discord Rate Limit Safe)`', inline: false },
        { name: 'Format Template', value: '`{name}-{count}`', inline: true },
      ],
      footer: 'NyxEclipse ServerStats • Configure in GuildNexus Dashboard',
    },
  },
  {
    name: '/verification setup',
    category: 'core',
    usage: '/verification setup role:<@role> [channel:<#channel>]',
    permission: 'Administrator',
    description: 'Establishes an automated member verification gateway with button verification to prevent raid bots.',
    embedPreview: {
      color: '#336699',
      title: '🛡️ Member Verification Gateway',
      description: 'Welcome! To access the server channels, please click the button below to verify yourself.',
      fields: [
        { name: 'Granted Role', value: '<@&9120391823> (@Member)', inline: true },
        { name: 'Verification Mode', value: '`One-Click Button Gateway`', inline: true },
        { name: 'Anti-Raid Protection', value: '🟢 **ACTIVE**', inline: false },
      ],
      footer: 'NyxEclipse Verification Suite • Secured with GuildNexus',
    },
  },
  {
    name: '/balance',
    category: 'economy',
    usage: '/balance [user:<@user>]',
    permission: 'Everyone',
    description: 'Inspects your wallet and bank balance in the server currency, net worth, and daily reward streak.',
    embedPreview: {
      color: '#fee75c',
      title: '🪙 Economy Bank Statement • @Alex',
      description: 'Financial status for current community server season.',
      fields: [
        { name: 'Wallet', value: '`4,250 Stardust`', inline: true },
        { name: 'Bank Reserve', value: '`28,900 Stardust` (Max: 50k)', inline: true },
        { name: 'Total Net Worth', value: '`33,150 Stardust`', inline: true },
        { name: 'Daily Streak', value: '🔥 `7 Days` (+25% bonus available)', inline: true },
        { name: 'Recent Jobs', value: '`/work` (+320 Stardust 2h ago)', inline: false },
      ],
      footer: 'NyxEclipse Economy • Use /shop to browse purchasable perks',
    },
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  user,
  botStats,
  inviteUrl,
  onOpenDashboard,
  onLoginClick,
  onDemoClick,
  onOpenOAuthGuide,
  onOpenThemeModal,
}) => {
  const { mode, toggleMode, currentTheme, classes } = useTheme();
  const [activeCommand, setActiveCommand] = useState<CommandItem>(COMMANDS_DATA[0]);
  const [commandCategory, setCommandCategory] = useState<string>('all');
  const [commandSearch, setCommandSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Filtered commands list
  const filteredCommands = COMMANDS_DATA.filter((cmd) => {
    const matchesCategory = commandCategory === 'all' || cmd.category === commandCategory;
    const matchesSearch = cmd.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
      cmd.description.toLowerCase().includes(commandSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const FAQS = [
    {
      q: 'How do I connect NyxEclipse and GuildNexus to my Discord server?',
      a: 'Click the "Invite Bot" button at the top of the page. Select your server from the Discord authorization dropdown, grant the recommended administrative or management permissions, and NyxEclipse will immediately join your server and initialize default configuration files.',
    },
    {
      q: 'How does the GuildNexus Web Dashboard synchronize with NyxEclipse?',
      a: 'The GuildNexus web dashboard communicates directly with NyxEclipse and the Discord REST API v10. Any setting you toggle in the dashboard (such as Welcome channels, Music default volume, Dynamic voice counters, or Verification roles) takes effect across your Discord server in sub-second time.',
    },
    {
      q: 'What music engine does NyxEclipse use?',
      a: 'NyxEclipse uses high-performance Lavalink v4 audio nodes powered by Riffy, supporting crystal-clear 24/7 playback, interactive song buttons (pause, resume, skip, loop), queue management, and volume controls.',
    },
    {
      q: 'How do the Dynamic Voice Channel Counters work?',
      a: 'The ServerStats module creates locked voice channels that dynamically display your server\'s live member counts, bot counts, or human counts (e.g. "🔊 Total Members: 1,280"). NyxEclipse updates these on a rate-limit safe 10-minute cadence.',
    },
    {
      q: 'Do I need to pay for essential features like Tickets or Verification?',
      a: 'No! All core modules—including Lavalink Music, Moderation Case logs, Support Tickets, Welcome Gateways, Auto-Verification, and the Web Dashboard—are completely free with no paywalls or locked commands.',
    },
    {
      q: 'Can I test the Web Dashboard without logging into Discord?',
      a: 'Yes! Click the "Try Live Demo" button. It instantly provisions a simulated Discord session with pre-configured servers so you can test all subtabs, channels, role selectors, and live telemetry.',
    },
  ];

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'bg-[#06030c] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-purple-600 selection:text-white transition-colors duration-200`}>
      {/* 1. TOP HEADER / NAVBAR */}
      <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors ${
        mode === 'dark' 
          ? 'bg-[#07030e]/90 border-slate-800/80 text-white' 
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-600/30 border border-slate-300/40">
              N
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight">
                  Nyx<span className="text-purple-400">Eclipse</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950 shadow-sm">
                  v2.1.0
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>GuildNexus Dashboard • Online</span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#commands" className="hover:text-purple-400 transition-colors">Slash Commands</a>
            <a href="#stats" className="hover:text-purple-400 transition-colors">Live Stats</a>
            <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
            <a
              href="https://discord.gg/QnWNz2dKCE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors font-semibold"
            >
              Support Server
            </a>
            <button
              onClick={onOpenOAuthGuide}
              className="hover:text-purple-400 transition-colors font-semibold"
            >
              Credentials
            </button>
          </nav>

          {/* Right Actions: Theme Toggle, Invite, Dashboard Trigger */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Theme Trigger */}
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

            {/* Invite Button */}
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Invite Bot</span>
            </a>

            {/* Open Dashboard Primary CTA */}
            {user ? (
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 border border-purple-400/40 transition-all hover:scale-[1.02]"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span>Go to Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={onOpenDashboard}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 border border-purple-400/40 transition-all hover:scale-[1.02]"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open Dashboard</span>
                </button>
                <button
                  onClick={onDemoClick}
                  className="hidden xl:inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Try Instant Demo Dashboard"
                >
                  <span>Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-purple-600/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-purple-300 text-xs font-bold backdrop-blur-md animate-in fade-in duration-500 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NYXECLIPSE v2.1.0</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">Lavalink Music, Moderation Cases & Voice Counters</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              The Definitive Discord Bot &{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-slate-200 bg-clip-text text-transparent">
                GuildNexus Dashboard
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
              Stream 24/7 Lavalink v4 music, track moderation infractions with case IDs, spawn dynamic voice stats counters, and resolve tickets—configured seamlessly from our real-time web dashboard.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl font-extrabold text-sm text-white bg-purple-600 hover:bg-purple-500 shadow-xl shadow-purple-900/50 border border-purple-400/40 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Invite NyxEclipse to Discord</span>
            </a>

            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 shadow-lg transition-all hover:scale-105"
            >
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Launch Web Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={onDemoClick}
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl font-semibold text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try Live Demo</span>
            </button>
          </div>

          {/* Real-time Telemetry Ribbon */}
          <div className="pt-8 pb-4">
            <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-[#0e071c]/80 border border-purple-900/30 backdrop-blur-md shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-purple-900/30">
              <div className="px-3 py-2 text-center">
                <div className="text-2xl font-black text-white">
                  {botStats?.guildCount || 142}+
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discord Servers</div>
              </div>
              <div className="px-3 py-2 text-center">
                <div className="text-2xl font-black text-purple-300">
                  {botStats?.totalMembers ? `${(botStats.totalMembers / 1000).toFixed(1)}k+` : '68.5k+'}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Members Protected</div>
              </div>
              <div className="px-3 py-2 text-center">
                <div className="text-2xl font-black text-emerald-400 flex items-center justify-center space-x-1">
                  <span>{botStats?.pingMs || 18}ms</span>
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gateway Latency</div>
              </div>
              <div className="px-3 py-2 text-center">
                <div className="text-2xl font-black text-indigo-300">
                  {botStats?.uptime || '99.98%'}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bot Uptime</div>
              </div>
            </div>
          </div>

          {/* Interactive Discord Embed Simulator */}
          <div className="max-w-4xl mx-auto text-left pt-6">
            <div className="rounded-2xl bg-[#110924] border border-purple-800/40 shadow-2xl overflow-hidden">
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[#0a0516] border-b border-purple-900/40 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">NyxEclipse Slash Command Simulator</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/30">
                  INTERACTIVE PREVIEW
                </span>
              </div>

              {/* Slash Command Switcher Pills */}
              <div className="p-3 bg-[#0c061a] border-b border-purple-900/30 flex flex-wrap gap-1.5 overflow-x-auto">
                {COMMANDS_DATA.map((cmd) => (
                  <button
                    key={cmd.name}
                    onClick={() => setActiveCommand(cmd)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeCommand.name === cmd.name
                        ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {cmd.name}
                  </button>
                ))}
              </div>

              {/* Simulated Discord Message */}
              <div className="p-5 sm:p-6 space-y-3 font-sans bg-[#130b29]/90">
                {/* User Slash Execution Header */}
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">@Alex</span>
                  <span>used</span>
                  <code className="text-purple-300 font-mono font-bold bg-purple-950/60 px-1.5 py-0.5 rounded">
                    {activeCommand.name}
                  </code>
                </div>

                {/* Bot Response Row */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
                    N
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">NyxEclipse</span>
                      <span className="px-1.5 py-0.2 rounded bg-purple-600 text-[10px] font-black text-white">
                        BOT
                      </span>
                      <span className="text-[10px] text-slate-500">Today at 10:42 PM</span>
                    </div>

                    {/* Discord Embed Box */}
                    <div 
                      className="rounded-lg p-4 bg-[#1e1338] border-l-4 space-y-3 max-w-2xl"
                      style={{ borderLeftColor: activeCommand.embedPreview.color }}
                    >
                      <h4 className="text-sm font-bold text-white">
                        {activeCommand.embedPreview.title}
                      </h4>
                      <p className="text-xs text-slate-300">
                        {activeCommand.embedPreview.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {activeCommand.embedPreview.fields.map((field, idx) => (
                          <div key={idx} className={field.inline ? 'space-y-0.5' : 'sm:col-span-2 space-y-0.5'}>
                            <div className="text-[11px] font-bold text-slate-400">{field.name}</div>
                            <div className="text-xs text-slate-200" dangerouslySetInnerHTML={{ __html: field.value }} />
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-purple-900/40 text-[10px] text-slate-400 font-mono">
                        {activeCommand.embedPreview.footer}
                      </div>
                    </div>

                    {/* Interactive Action Row Buttons */}
                    <div className="flex items-center space-x-2 pt-1">
                      <button 
                        onClick={onOpenDashboard}
                        className="px-3 py-1.5 rounded-md bg-[#2d1b54] hover:bg-purple-700 text-xs font-semibold text-purple-200 hover:text-white transition-colors flex items-center space-x-1"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Configure in Dashboard</span>
                      </button>
                      <button 
                        onClick={handleCopyInvite}
                        className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors flex items-center space-x-1"
                      >
                        {copiedInvite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedInvite ? 'Copied Link' : 'Copy Invite'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SHOWCASE */}
      <section id="features" className="py-20 border-t border-purple-900/20 bg-[#090414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Engineered For Modern Discord Communities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              One Bot. Zero Paywalls. Complete Control.
            </h3>
            <p className="text-sm text-slate-400">
              NyxEclipse unifies 18 advanced modules into a single lightweight bot, with deep server configuration managed right from GuildNexus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Music & Audio */}
            <div className="p-6 rounded-2xl bg-[#110826] border border-purple-900/30 hover:border-purple-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                <Music className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Lavalink v4 Music Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lossless audio streaming powered by Lavalink v4 and Riffy. Features 24/7 playback, Spotify/Deezer playlist support, and rich button controls.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>24/7 mode & custom default volume</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive button controls & filters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dedicated DJ roles and channel locking</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Moderation & Cases */}
            <div className="p-6 rounded-2xl bg-[#110826] border border-purple-900/30 hover:border-purple-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Moderation & Case Registry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log warnings, timeouts, kicks, and bans with sequential case IDs. Filter spam, block unauthorized invites, and maintain transparent audit trails.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Case ID logging for all infractions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anti-phishing and Discord invite blocking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DM notifications to warned members</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Dynamic Voice Counters */}
            <div className="p-6 rounded-2xl bg-[#110826] border border-purple-900/30 hover:border-purple-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Dynamic Voice Counters</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Display live server stats right in your channel sidebar. Auto-updating voice channels show total members, human users, bot counts, or roles.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Members, Bots, and Humans counter types</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rate-limit safe 10-minute cadence</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customizable name formatting templates</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Leveling & Rewards */}
            <div className="p-6 rounded-2xl bg-[#110826] border border-purple-900/30 hover:border-purple-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Leveling & Role Milestones</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reward active chatters with dynamic XP. Automatically award vanity roles at Level 5, 10, or custom thresholds, with level cards and leaderboards.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Visual rank cards with progress bars</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Configurable role rewards on level up</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customizable announcement channels</span>
                </li>
              </ul>
            </div>

            {/* Feature 5: Support Tickets */}
            <div className="p-6 rounded-2xl bg-[#110826] border border-purple-900/30 hover:border-purple-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Interactive Ticket Desk</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide private member support. Button panels spawn encrypted channels with staff claiming, auto-closing, and direct-messaged transcripts.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>One-click button ticket generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Support staff role assignment & alerts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HTML transcripts DM\'d upon closure</span>
                </li>
              </ul>
            </div>

            {/* Feature 6: Welcome Gateway & Verification */}
            <div className="p-6 rounded-2xl bg-[#110826] border border-purple-900/30 hover:border-purple-500/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Welcome & Auto-Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Make memorable first impressions with rich embed greetings, automated starter roles, and one-click button verification to keep raid bots out.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dynamic welcome variables ({'{user}'}, {'{server}'})</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>One-click button verification gateway</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Starter auto-roles applied on join</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SLASH COMMANDS DIRECTORY */}
      <section id="commands" className="py-20 bg-[#06030c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Interactive Command Directory
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              NyxEclipse Slash Commands
            </h3>
            <p className="text-sm text-slate-400">
              Type <code className="text-purple-300 font-mono">/</code> in any Discord channel or configure permissions directly in your server.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Commands' },
                { id: 'core', label: 'Core & Utility' },
                { id: 'music', label: 'Music (Lavalink)' },
                { id: 'moderation', label: 'Moderation' },
                { id: 'leveling', label: 'Leveling' },
                { id: 'tickets', label: 'Tickets' },
                { id: 'counters', label: 'Counters' },
                { id: 'economy', label: 'Economy' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCommandCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    commandCategory === cat.id
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Search commands..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Command Cards List */}
          <div className="max-w-4xl mx-auto space-y-3">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd) => (
                <div
                  key={cmd.name}
                  onClick={() => setActiveCommand(cmd)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    activeCommand.name === cmd.name
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/40'
                      : 'bg-[#0f071f]/60 border-purple-950/40 hover:border-purple-800/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-sm font-bold text-white">{cmd.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-purple-300 border border-purple-900/40">
                        {cmd.usage}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {cmd.permission}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{cmd.description}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveCommand(cmd);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="shrink-0 px-3 py-1 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-semibold transition-colors flex items-center space-x-1"
                  >
                    <span>Simulate</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No commands found matching your query.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. COMPARISON MATRIX */}
      <section className="py-20 border-t border-purple-900/20 bg-[#080414]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              The NyxEclipse Advantage
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Communities Choose NyxEclipse
            </h3>
            <p className="text-sm text-slate-400">
              Replace messy chat-only bots with a unified solution powered by the real-time GuildNexus dashboard.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0f0722] border border-purple-900/40 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-purple-900/50 bg-[#090416]">
                  <th className="p-4 font-bold text-slate-300">Feature Capability</th>
                  <th className="p-4 font-bold text-purple-400">NyxEclipse & GuildNexus</th>
                  <th className="p-4 font-bold text-slate-500">Traditional Bots</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/40">
                <tr>
                  <td className="p-4 font-semibold text-white">Full-Featured Web Dashboard</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Included (Real-time Sync)</span>
                  </td>
                  <td className="p-4 text-slate-500">Often Paywalled or Clunky</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Lavalink v4 24/7 Music Engine</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>High Fidelity & 24/7 Mode</span>
                  </td>
                  <td className="p-4 text-rose-400/70">Requires Premium Sub</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Dynamic Voice Server Counters</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Members, Bots, Humans</span>
                  </td>
                  <td className="p-4 text-slate-500">Requires Separate Bot</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Live Discord Channel & Role Selectors</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Direct REST v10 Fetched</span>
                  </td>
                  <td className="p-4 text-slate-500">Manual Snowflake IDs</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Interactive Ticket Desk with Transcripts</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Included with Claim & Close</span>
                  </td>
                  <td className="p-4 text-slate-500">Requires Separate Bot</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-white">Customizable Obsidian / Silver Themes</td>
                  <td className="p-4 text-emerald-400 font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Dual Light/Dark & 5 Accents</span>
                  </td>
                  <td className="p-4 text-slate-500">Fixed Default Dark</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-[#06030c]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Common Questions
            </h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-purple-950/60 bg-[#0e071c]/60 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-4.5 text-left flex items-center justify-between font-bold text-sm text-white hover:text-purple-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaqIndex === index ? 'rotate-180 text-purple-400' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-4.5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-purple-900/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section className="py-20 border-t border-purple-900/30 bg-gradient-to-b from-[#090414] to-[#040108] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-[11px] font-bold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Ready to modernize your Discord server?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Elevate Your Server with NyxEclipse
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-400">
            Join hundreds of gaming clans, music hubs, and community servers powered by NyxEclipse and GuildNexus. Setup takes under two minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-extrabold text-sm text-white bg-purple-600 hover:bg-purple-500 shadow-xl shadow-purple-900/40 border border-purple-400/40 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Add NyxEclipse to Server</span>
            </a>

            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all hover:scale-105"
            >
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Launch Web Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-10 border-t border-slate-800/80 bg-[#050209] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black text-sm">
              N
            </div>
            <span className="font-bold text-white text-sm">NyxEclipse</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">GuildNexus Dashboard</span>
            <span className="px-1.5 py-0.2 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">
              v2.1.0
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-slate-400">
            <button onClick={onOpenDashboard} className="hover:text-purple-400 transition-colors font-medium">
              Web Dashboard
            </button>
            <a
              href="https://discord.gg/QnWNz2dKCE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Support Server
            </a>
            <button onClick={onOpenOAuthGuide} className="hover:text-purple-400 transition-colors font-medium">
              Credentials & OAuth2
            </button>
            <button onClick={onOpenThemeModal} className="hover:text-purple-400 transition-colors font-medium">
              Theme Selector
            </button>
            <a
              href="https://github.com/NiteRayder/NyxEclipse"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors font-medium inline-flex items-center space-x-1"
            >
              <span>Bot GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/NiteRayder/GuildNexus-WebDashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors font-medium inline-flex items-center space-x-1"
            >
              <span>Dashboard GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
