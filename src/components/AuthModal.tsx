import { FormEvent, useState } from 'react';
import { LogOut, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  userEmail: string | null;
  onClose: () => void;
  onLogin: (email: string) => void;
  onLogout: () => void;
}

export function AuthModal({
  isOpen,
  userEmail,
  onClose,
  onLogin,
  onLogout,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    onLogin(trimmed);
    setPassword('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-black/[0.08] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="auth-modal-title"
            className="font-display text-xl font-bold text-[#0D0D0D]"
          >
            {userEmail
              ? 'Member Account'
              : mode === 'login'
              ? 'Log In to Blueblends'
              : 'Create Blueblends Account'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#626262] hover:text-[#0D0D0D] hover:bg-[#F3F3F3]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {userEmail ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#F3F3F3] border border-black/[0.06]">
              <p className="text-xs text-[#626262]">Signed in as</p>
              <p className="text-sm font-medium text-[#0D0D0D] mt-0.5">
                {userEmail}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 min-h-[44px] border border-black/[0.14] text-sm font-medium text-[#0D0D0D] hover:bg-[#F3F3F3] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="auth-email"
                className="block text-xs font-medium text-[#0D0D0D]"
              >
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-black/[0.16] text-sm text-[#0D0D0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="auth-password"
                className="block text-xs font-medium text-[#0D0D0D]"
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 rounded-lg border border-black/[0.16] text-sm text-[#0D0D0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs text-[#DF3131]">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-5 min-h-[44px] bg-[#005EFF] hover:bg-[#0F2CCF] text-white text-sm font-medium rounded-lg transition-colors"
            >
              {mode === 'login' ? 'Log In' : 'Create Account'}
            </button>

            <p className="text-center text-xs text-[#626262] pt-2">
              {mode === 'login' ? 'New to Blueblends? ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                }}
                className="text-[#005EFF] font-medium hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
