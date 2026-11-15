import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/blueblendsData';

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white border-b border-black/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="max-w-2xl mb-10">
          <h2
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0D0D0D]"
            style={{ textWrap: 'balance' }}
          >
            Trusted by Designers
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#626262]">
            Feedback from engineers, product designers, and creative technologists learning with BlueBlends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <blockquote
              key={item.id}
              className="flex flex-col justify-between bg-[#F3F3F3]/60 border border-black/[0.08] rounded-xl p-6 sm:p-7"
            >
              <div>
                <div
                  className="flex items-center gap-1 text-[#005EFF] mb-4"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 fill-current"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-[15px] text-[#0D0D0D] leading-relaxed">
                  “{item.quote}”
                </p>
              </div>

              <footer className="mt-6 pt-4 border-t border-black/[0.08]">
                <p className="font-display text-sm font-semibold text-[#0D0D0D]">
                  {item.name}
                </p>
                <p className="text-xs text-[#626262] mt-0.5">{item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
