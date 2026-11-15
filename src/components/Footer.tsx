interface FooterProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateShop: () => void;
  onOpenAuth: () => void;
}

export function Footer({
  onNavigateHome,
  onNavigateShop,
  onOpenAuth,
}: FooterProps) {
  return (
    <footer className="bg-white border-t border-black/[0.08] py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="font-display text-lg font-bold tracking-tight text-[#0D0D0D]">
            Blueblends
          </span>
          <p className="text-xs text-[#626262]">
            Legal name: BlueBlends Digital Services LLP · © 2026 Blueblends. All rights reserved.
          </p>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center gap-6 text-sm text-[#626262]"
        >
          <button
            type="button"
            onClick={() => onNavigateHome()}
            className="hover:text-[#0D0D0D] transition-colors"
          >
            Home
          </button>
          <button
            type="button"
            onClick={onNavigateShop}
            className="hover:text-[#0D0D0D] transition-colors"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('about')}
            className="hover:text-[#0D0D0D] transition-colors"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('journal')}
            className="hover:text-[#0D0D0D] transition-colors"
          >
            Journal
          </button>
          <button
            type="button"
            onClick={onOpenAuth}
            className="hover:text-[#0D0D0D] transition-colors"
          >
            Log In
          </button>
        </nav>
      </div>
    </footer>
  );
}
