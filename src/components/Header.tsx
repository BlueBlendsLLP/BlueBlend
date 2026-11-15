import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

export type ActiveRoute = 'home' | 'shop';

interface HeaderProps {
  activeRoute: ActiveRoute;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateShop: () => void;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  cartCount: number;
  userEmail: string | null;
}

export function Header({
  activeRoute,
  onNavigateHome,
  onNavigateShop,
  onOpenAuth,
  onOpenCart,
  cartCount,
  userEmail,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeNav = (sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigateHome(sectionId);
  };

  const handleShopNav = () => {
    setMobileMenuOpen(false);
    onNavigateShop();
  };

  const handleAuthNav = () => {
    setMobileMenuOpen(false);
    onOpenAuth();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-black/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleHomeNav()}
          className="font-display text-xl font-bold tracking-tight text-[#0D0D0D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] rounded-sm"
        >
          Blueblends
        </button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#626262]"
        >
          <button
            type="button"
            onClick={() => handleHomeNav()}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] ${
              activeRoute === 'home'
                ? 'text-[#0D0D0D] border-[#005EFF]'
                : 'border-transparent hover:text-[#0D0D0D] hover:border-black/20'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={handleShopNav}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] ${
              activeRoute === 'shop'
                ? 'text-[#0D0D0D] border-[#005EFF]'
                : 'border-transparent hover:text-[#0D0D0D] hover:border-black/20'
            }`}
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => handleHomeNav('about')}
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-[#0D0D0D] hover:border-black/20 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleHomeNav('journal')}
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-[#0D0D0D] hover:border-black/20 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
          >
            Journal
          </button>
          <button
            type="button"
            onClick={handleAuthNav}
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-[#0D0D0D] hover:border-black/20 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] max-w-[140px] truncate"
          >
            {userEmail ? userEmail.split('@')[0] : 'Log In'}
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-sm font-medium text-white bg-[#005EFF] hover:bg-[#0F2CCF] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#005EFF]"
            aria-label={`Open shopping cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="tabular-nums">Cart ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-black/[0.08] bg-white px-4 py-3 flex flex-col gap-1"
        >
          <button
            type="button"
            onClick={() => handleHomeNav()}
            className="w-full text-left px-3 py-3 text-sm font-medium text-[#0D0D0D] rounded-lg hover:bg-[#F3F3F3]"
          >
            Home
          </button>
          <button
            type="button"
            onClick={handleShopNav}
            className="w-full text-left px-3 py-3 text-sm font-medium text-[#0D0D0D] rounded-lg hover:bg-[#F3F3F3]"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => handleHomeNav('about')}
            className="w-full text-left px-3 py-3 text-sm font-medium text-[#0D0D0D] rounded-lg hover:bg-[#F3F3F3]"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleHomeNav('journal')}
            className="w-full text-left px-3 py-3 text-sm font-medium text-[#0D0D0D] rounded-lg hover:bg-[#F3F3F3]"
          >
            Journal
          </button>
          <button
            type="button"
            onClick={handleAuthNav}
            className="w-full text-left px-3 py-3 text-sm font-medium text-[#005EFF] rounded-lg hover:bg-[#F3F3F3]"
          >
            {userEmail ? `Account (${userEmail})` : 'Log In'}
          </button>
        </nav>
      )}
    </header>
  );
}
