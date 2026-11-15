import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function NewsletterHubSection() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmittedEmail(trimmed);
    setEmail('');
  };

  return (
    <section className="py-16 lg:py-24 bg-[#0D0D0D] text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-3">
            <h2
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              Latest Updates
            </h2>
            <p className="text-base text-white/75 leading-relaxed max-w-[54ch]">
              Stay ahead with our latest coding tips, design insights, and
              digital product updates. BlueBlends is your go-to resource for
              professional growth.
            </p>
          </div>

          <div className="lg:col-span-6">
            {submittedEmail ? (
              <div
                role="status"
                className="flex items-start gap-3 p-5 rounded-xl bg-white/[0.07] border border-white/15"
              >
                <CheckCircle2
                  className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-white">
                    Welcome to the BlueBlends Hub
                  </p>
                  <p className="text-sm text-white/75 mt-1">
                    Subscribed with <span className="text-white">{submittedEmail}</span>. New course releases and design guides will arrive in your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedEmail(null)}
                    className="mt-3 text-xs font-medium text-[#93C5FD] hover:text-white underline underline-offset-4"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="hub-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="hub-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email address"
                    className="flex-1 min-h-[46px] px-4 py-3 rounded-lg bg-white text-[#0D0D0D] placeholder:text-[#626262] text-sm border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 min-h-[46px] bg-[#005EFF] hover:bg-[#1D70FF] text-white text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Join Our Hub
                  </button>
                </div>
                {error && (
                  <p role="alert" className="text-xs text-[#FCA5A5]">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
