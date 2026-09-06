import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldAlert, Key, Sparkles } from 'lucide-react';

interface OAuthGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  callbackUrl: string;
  isConfigured: boolean;
  clientId: string | null;
  credentialsStatus?: {
    hasClientId: boolean;
    hasClientSecret: boolean;
    hasBotToken: boolean;
    botUser?: {
      id: string;
      username: string;
      avatar: string | null;
    } | null;
  };
  onDemoClick: () => void;
}

export const OAuthGuideModal: React.FC<OAuthGuideModalProps> = ({
  isOpen,
  onClose,
  callbackUrl,
  isConfigured,
  clientId,
  credentialsStatus,
  onDemoClick,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Discord Credentials & OAuth2 Guide</h3>
              <p className="text-xs text-slate-400">Environment status and Discord Developer Portal integration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Active Credentials Checklist */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Environment Secret Status
              </h4>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950">
                ACTIVE CHECK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                credentialsStatus?.hasClientId || clientId
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                {credentialsStatus?.hasClientId || clientId ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div className="truncate">
                  <div className="font-bold text-[11px]">Client ID</div>
                  <div className="text-[9px] opacity-75">{credentialsStatus?.hasClientId || clientId ? 'Loaded' : 'Missing'}</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                credentialsStatus?.hasClientSecret
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                {credentialsStatus?.hasClientSecret ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div className="truncate">
                  <div className="font-bold text-[11px]">Client Secret</div>
                  <div className="text-[9px] opacity-75">{credentialsStatus?.hasClientSecret ? 'Loaded' : 'Missing'}</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                credentialsStatus?.hasBotToken
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                {credentialsStatus?.hasBotToken ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div className="truncate">
                  <div className="font-bold text-[11px]">Bot Token</div>
                  <div className="text-[9px] opacity-75">{credentialsStatus?.hasBotToken ? 'Active' : 'Optional'}</div>
                </div>
              </div>
            </div>

            {credentialsStatus?.botUser && (
              <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/30 flex items-center space-x-3 mt-2">
                {credentialsStatus.botUser.avatar ? (
                  <img
                    src={credentialsStatus.botUser.avatar}
                    alt={credentialsStatus.botUser.username}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-purple-400 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                    B
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white text-xs">{credentialsStatus.botUser.username}</span>
                    <span className="px-1 py-0.2 rounded bg-purple-600 text-[9px] font-bold text-white">BOT</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-medium">Discord Bot API Connected & Synced</p>
                </div>
              </div>
            )}
          </div>

          {/* Status Alert */}
          <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
            isConfigured
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}>
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">
                {isConfigured
                  ? 'Discord OAuth Credentials Configured'
                  : 'Discord Credentials Not Yet Added'}
              </p>
              <p className="text-[11px] opacity-80 leading-relaxed">
                {isConfigured
                  ? `Connected to Client ID: ${clientId}`
                  : 'Add DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET to enable live Discord OAuth, or use Demo Preview mode to test instantly.'}
              </p>
            </div>
          </div>

          {/* Setup Steps */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Setup Instructions:
            </h4>

            <ol className="space-y-3 text-slate-300 pl-4 list-decimal marker:text-indigo-400 marker:font-bold leading-relaxed">
              <li>
                <span>Go to the </span>
                <a
                  href="https://discord.com/developers/applications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline font-medium inline-flex items-center space-x-0.5"
                >
                  <span>Discord Developer Portal</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
                <span> and create or select your application.</span>
              </li>

              <li>
                <span>Navigate to </span>
                <strong className="text-white">OAuth2 &gt; General</strong>
                <span> in the left sidebar.</span>
              </li>

              <li>
                <div className="space-y-1.5 mt-1">
                  <span>Add this exact </span>
                  <strong className="text-white">Redirect URI</strong>
                  <span> to your Discord application:</span>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <code className="text-indigo-300 font-mono text-[11px] truncate flex-1">
                      {callbackUrl}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(callbackUrl);
                        setCopiedUrl(true);
                        setTimeout(() => setCopiedUrl(false), 2000);
                      }}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Copy redirect URI"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </li>

              <li>
                <span>Copy your </span>
                <strong className="text-white">Client ID</strong>
                <span> and </span>
                <strong className="text-white">Client Secret</strong>
                <span>, and configure them as environment variables:</span>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 mt-1 space-y-1">
                  <div>DISCORD_CLIENT_ID=&quot;your_client_id&quot;</div>
                  <div>DISCORD_CLIENT_SECRET=&quot;your_client_secret&quot;</div>
                </div>
              </li>
            </ol>
          </div>

          {/* Quick Demo Option */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Want to test immediately?</span>
            <button
              onClick={() => {
                onDemoClick();
                onClose();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Use Demo Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
