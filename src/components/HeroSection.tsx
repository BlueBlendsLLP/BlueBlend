import { ArrowRight } from 'lucide-react';
import { HERO_MEDIA } from '../data/blueblendsData';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onShopProducts: () => void;
}

export function HeroSection({ onShopProducts }: HeroSectionProps) {
  return (
    <section className="border-b border-black/[0.08] bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Core Proposition */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <p className="text-xs font-medium tracking-wide text-[#005EFF]">
                Blueblends Digital Education
              </p>
              <h1
                className="font-display font-bold tracking-tight text-[#0D0D0D] leading-[1.08]"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
                  textWrap: 'balance',
                }}
              >
                Empower Your Design Logic
              </h1>
              <p className="text-base sm:text-lg text-[#626262] leading-relaxed max-w-[52ch]">
                Unlock your creative potential with high-quality digital products
                designed to elevate your design workflow and master the art of
                coding.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onShopProducts}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 min-h-[44px] bg-[#0D0D0D] hover:bg-[#005EFF] text-white text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#005EFF]"
                >
                  <span>Shop Products</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-black/[0.08] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#626262]">
              <span>Legal name: BlueBlends Digital Services LLP</span>
              <span aria-hidden="true">·</span>
              <span>Instant Digital Access</span>
            </div>
          </div>

          {/* Right Column: 16:9 Architectural Studio Visual */}
          <div className="lg:col-span-7 flex">
            <div className="w-full rounded-xl overflow-hidden bg-[#F3F3F3] border border-black/[0.08] aspect-[16/9] lg:aspect-auto lg:min-h-[420px]">
              <ResilientImage
                src={HERO_MEDIA.image}
                alt={HERO_MEDIA.alt}
                fallbackLabel="Blueblends Design & Coding Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
