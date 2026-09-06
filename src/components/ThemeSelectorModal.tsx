import React from 'react';
import { X, Check, Sun, Moon, Sparkles, Palette, Shield } from 'lucide-react';
import { useTheme, THEME_PRESETS, ThemeAccent } from '../context/ThemeContext';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { mode, accent, setMode, setAccent, classes } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          mode === 'dark' ? 'bg-[#0d0718] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          mode === 'dark' ? 'border-slate-800 bg-[#120a21]' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-tight">Dashboard Theme Customizer</h3>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950">
                  SILVER TRIM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tailor colors, highlights, and contrast for your GuildNexus experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              mode === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Appearance Mode (Dark vs Light) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <span>Display Mode</span>
              <span className="text-[10px] lowercase text-slate-500 font-normal">(Instant toggle)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('dark')}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  mode === 'dark'
                    ? 'bg-[#180f2b] border-purple-500 ring-2 ring-purple-500/30 text-white font-bold'
                    : mode === 'dark'
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-purple-400 border border-slate-700">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Dark Mode</div>
                    <div className="text-[11px] text-slate-400">Deep pitch black with silver accents</div>
                  </div>
                </div>
                {mode === 'dark' && <Check className="w-4 h-4 text-purple-400" />}
              </button>

              <button
                type="button"
                onClick={() => setMode('light')}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  mode === 'light'
                    ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 text-purple-950 font-bold'
                    : mode === 'dark'
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-500 border border-slate-300 shadow-sm">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Light Mode</div>
                    <div className="text-[11px] text-slate-500">Silver & pearl high contrast</div>
                  </div>
                </div>
                {mode === 'light' && <Check className="w-4 h-4 text-purple-600" />}
              </button>
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Color Palette & Accent Highlights
              </label>
              <span className="text-[11px] font-mono text-purple-400 font-bold">
                {THEME_PRESETS.find(p => p.id === accent)?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isSelected = accent === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAccent(preset.id)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? mode === 'dark'
                          ? 'bg-[#1b1030] border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-950/40'
                          : 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/20 shadow-sm'
                        : mode === 'dark'
                          ? 'bg-[#11091e]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#140b24]'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2.5">
                        <div 
                          className="w-5 h-5 rounded-full border border-white/30 shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: preset.primaryColor }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: preset.secondaryColor }}
                          />
                        </div>
                        <span className="text-xs font-bold truncate">{preset.name}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase ${
                          isSelected 
                            ? 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-black' 
                            : 'bg-slate-800/60 text-slate-400 border border-slate-700'
                        }`}>
                          {preset.badgeText}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${
                      mode === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {preset.description}
                    </p>

                    {/* Preview Swatch Bar */}
                    <div className="mt-3 flex items-center space-x-1">
                      <div className="h-1.5 flex-1 rounded-l-full" style={{ backgroundColor: preset.primaryColor }} />
                      <div className="h-1.5 w-8 rounded-r-full bg-gradient-to-r from-slate-300 to-slate-100" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Silver Highlight Info Banner */}
          <div className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs ${
            mode === 'dark' 
              ? 'bg-black/60 border-slate-800 text-slate-300' 
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <Sparkles className="w-4 h-4 text-slate-300 shrink-0" />
            <p className="leading-relaxed">
              <strong>Silver Highlights:</strong> Cards and interactive modules feature high-clarity metallic silver borders, brushed chrome status badges, and crystal text headers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          mode === 'dark' ? 'border-slate-800 bg-[#120a21]' : 'border-slate-100 bg-slate-50'
        }`}>
          <span className="text-slate-400">Settings automatically saved in browser</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
