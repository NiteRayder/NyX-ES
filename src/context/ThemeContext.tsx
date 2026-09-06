import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

export type ThemeAccent = 
  | 'purple'    // Black & Royal Purple with Silver (Default requested)
  | 'violet'    // Electric Violet & Chrome
  | 'emerald'   // Stealth Emerald & Platinum
  | 'crimson'   // Crimson Eclipse & Titanium
  | 'sapphire'  // Midnight Sapphire & Silver
  | 'amber';    // Cyber Gold & Silver

export interface ThemeConfig {
  id: ThemeAccent;
  name: string;
  description: string;
  primaryColor: string; // Hex for preview dot
  secondaryColor: string; // Silver / highlight hex
  badgeText: string;
}

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'purple',
    name: 'Royal Purple & Silver',
    description: 'Pitch onyx black with radiant purple glow and brushed silver highlights',
    primaryColor: '#9333ea',
    secondaryColor: '#e2e8f0',
    badgeText: 'DEFAULT'
  },
  {
    id: 'violet',
    name: 'Electric Violet & Chrome',
    description: 'Deep carbon with high-voltage violet and polished chrome edges',
    primaryColor: '#c026d3',
    secondaryColor: '#f1f5f9',
    badgeText: 'NEON'
  },
  {
    id: 'emerald',
    name: 'Matrix Emerald & Platinum',
    description: 'Dark obsidian with cybernetic green and platinum highlights',
    primaryColor: '#10b981',
    secondaryColor: '#cbd5e1',
    badgeText: 'SECURITY'
  },
  {
    id: 'crimson',
    name: 'Crimson Eclipse & Titanium',
    description: 'Abyssal black with intense ruby red and titanium silver trim',
    primaryColor: '#f43f5e',
    secondaryColor: '#e2e8f0',
    badgeText: 'BOLD'
  },
  {
    id: 'sapphire',
    name: 'Midnight Sapphire & Silver',
    description: 'Cosmic black with deep electric blue and stellar silver reflections',
    primaryColor: '#3b82f6',
    secondaryColor: '#e2e8f0',
    badgeText: 'DEEP'
  },
  {
    id: 'amber',
    name: 'Solar Amber & Chrome',
    description: 'Onyx foundation with warm amber gold and metallic chrome',
    primaryColor: '#f59e0b',
    secondaryColor: '#f8fafc',
    badgeText: 'WARM'
  }
];

interface ThemeContextType {
  mode: ThemeMode;
  accent: ThemeAccent;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
  toggleMode: () => void;
  currentTheme: ThemeConfig;
  classes: {
    bgApp: string;
    bgCard: string;
    bgCardHover: string;
    bgCardAlt: string;
    bgInput: string;
    borderCard: string;
    borderInput: string;
    textTitle: string;
    textBody: string;
    textMuted: string;
    accentBg: string;
    accentBgHover: string;
    accentText: string;
    accentBorder: string;
    silverBadge: string;
    silverText: string;
    activeTabClass: string;
    glowShadow: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('guildnexus_theme_mode');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [accent, setAccentState] = useState<ThemeAccent>(() => {
    const saved = localStorage.getItem('guildnexus_theme_accent');
    const validAccents: ThemeAccent[] = ['purple', 'violet', 'emerald', 'crimson', 'sapphire', 'amber'];
    return validAccents.includes(saved as ThemeAccent) ? (saved as ThemeAccent) : 'purple';
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('guildnexus_theme_mode', newMode);
  };

  const setAccent = (newAccent: ThemeAccent) => {
    setAccentState(newAccent);
    localStorage.setItem('guildnexus_theme_accent', newAccent);
  };

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [mode]);

  const currentTheme = THEME_PRESETS.find(t => t.id === accent) || THEME_PRESETS[0];

  // Dynamic Tailwind styling maps based on Mode and Accent
  const getThemeClasses = () => {
    const isDark = mode === 'dark';

    // Accent mappings
    const accentConfig = {
      purple: {
        accentBg: 'bg-purple-600',
        accentBgHover: 'hover:bg-purple-500',
        accentText: isDark ? 'text-purple-400' : 'text-purple-600',
        accentBorder: isDark ? 'border-purple-500/40' : 'border-purple-400',
        activeTab: isDark ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'bg-purple-600 text-white shadow-md',
        glow: 'shadow-purple-900/30'
      },
      violet: {
        accentBg: 'bg-fuchsia-600',
        accentBgHover: 'hover:bg-fuchsia-500',
        accentText: isDark ? 'text-fuchsia-400' : 'text-fuchsia-600',
        accentBorder: isDark ? 'border-fuchsia-500/40' : 'border-fuchsia-400',
        activeTab: isDark ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/40' : 'bg-fuchsia-600 text-white shadow-md',
        glow: 'shadow-fuchsia-900/30'
      },
      emerald: {
        accentBg: 'bg-emerald-600',
        accentBgHover: 'hover:bg-emerald-500',
        accentText: isDark ? 'text-emerald-400' : 'text-emerald-600',
        accentBorder: isDark ? 'border-emerald-500/40' : 'border-emerald-400',
        activeTab: isDark ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'bg-emerald-600 text-white shadow-md',
        glow: 'shadow-emerald-900/30'
      },
      crimson: {
        accentBg: 'bg-rose-600',
        accentBgHover: 'hover:bg-rose-500',
        accentText: isDark ? 'text-rose-400' : 'text-rose-600',
        accentBorder: isDark ? 'border-rose-500/40' : 'border-rose-400',
        activeTab: isDark ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'bg-rose-600 text-white shadow-md',
        glow: 'shadow-rose-900/30'
      },
      sapphire: {
        accentBg: 'bg-blue-600',
        accentBgHover: 'hover:bg-blue-500',
        accentText: isDark ? 'text-blue-400' : 'text-blue-600',
        accentBorder: isDark ? 'border-blue-500/40' : 'border-blue-400',
        activeTab: isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-blue-600 text-white shadow-md',
        glow: 'shadow-blue-900/30'
      },
      amber: {
        accentBg: 'bg-amber-600',
        accentBgHover: 'hover:bg-amber-500',
        accentText: isDark ? 'text-amber-400' : 'text-amber-600',
        accentBorder: isDark ? 'border-amber-500/40' : 'border-amber-400',
        activeTab: isDark ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'bg-amber-600 text-white shadow-md',
        glow: 'shadow-amber-900/30'
      }
    }[accent];

    if (isDark) {
      return {
        bgApp: 'bg-[#07040b]', // Pitch black with deep purple tint
        bgCard: 'bg-[#0f0a18]', // Deep black-purple elevation
        bgCardHover: 'hover:bg-[#160e24]',
        bgCardAlt: 'bg-[#0a0512]',
        bgInput: 'bg-[#05020a]',
        borderCard: 'border-slate-800/80 hover:border-slate-700',
        borderInput: 'border-slate-800 focus:border-purple-500',
        textTitle: 'text-white',
        textBody: 'text-slate-200',
        textMuted: 'text-slate-400',
        accentBg: accentConfig.accentBg,
        accentBgHover: accentConfig.accentBgHover,
        accentText: accentConfig.accentText,
        accentBorder: accentConfig.accentBorder,
        silverBadge: 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-black shadow-sm',
        silverText: 'text-slate-300 font-medium',
        activeTabClass: accentConfig.activeTab,
        glowShadow: accentConfig.glow,
      };
    } else {
      // Light Mode
      return {
        bgApp: 'bg-slate-100', // Crisp silver-gray canvas
        bgCard: 'bg-white', // Pure white cards
        bgCardHover: 'hover:bg-slate-50',
        bgCardAlt: 'bg-slate-50',
        bgInput: 'bg-white',
        borderCard: 'border-slate-200 hover:border-slate-300',
        borderInput: 'border-slate-300 focus:border-purple-600',
        textTitle: 'text-slate-900',
        textBody: 'text-slate-700',
        textMuted: 'text-slate-500',
        accentBg: accentConfig.accentBg,
        accentBgHover: accentConfig.accentBgHover,
        accentText: accentConfig.accentText,
        accentBorder: accentConfig.accentBorder,
        silverBadge: 'bg-slate-900 text-white font-black shadow-sm',
        silverText: 'text-slate-600 font-medium',
        activeTabClass: accentConfig.activeTab,
        glowShadow: 'shadow-slate-200',
      };
    }
  };

  const classes = getThemeClasses();

  return (
    <ThemeContext.Provider value={{
      mode,
      accent,
      setMode,
      setAccent,
      toggleMode,
      currentTheme,
      classes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
