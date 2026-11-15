import { ArrowUpRight } from 'lucide-react';
import { BlogPost } from '../data/blueblendsData';
import { ResilientImage } from './ResilientImage';

interface JournalSectionProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export function JournalSection({ posts, onSelectPost }: JournalSectionProps) {
  return (
    <section
      id="journal"
      className="py-16 lg:py-24 bg-white border-b border-black/[0.08]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0D0D0D]"
              style={{ textWrap: 'balance' }}
            >
              Insights & Guides
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#626262]">
              Practical reading on graphic design, foundational programming, and digital product strategy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col justify-between border border-black/[0.08] rounded-xl overflow-hidden bg-white transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div>
                <button
                  type="button"
                  onClick={() => onSelectPost(post)}
                  className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#005EFF]"
                >
                  <div className="aspect-[4/3] w-full bg-[#F3F3F3] overflow-hidden">
                    <ResilientImage
                      src={post.image}
                      alt={post.imageAlt}
                      fallbackLabel={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                </button>

                <div className="p-6 pb-4">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#626262] mb-2.5">
                    <span>{post.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.publishedLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPost(post)}
                    className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] rounded-sm"
                  >
                    <h3 className="font-display text-lg font-semibold text-[#0D0D0D] group-hover:text-[#005EFF] transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </button>

                  <p className="mt-2.5 text-sm text-[#626262] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectPost(post)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#005EFF] hover:text-[#0F2CCF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] rounded-sm"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
