import { X } from 'lucide-react';
import { BlogPost } from '../data/blueblendsData';
import { ResilientImage } from './ResilientImage';

interface ArticleReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export function ArticleReaderModal({ post, onClose }: ArticleReaderModalProps) {
  if (!post) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl border border-black/[0.08] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08] shrink-0">
          <div className="text-xs text-[#626262]">
            <span>All Posts</span>
            <span className="mx-1.5" aria-hidden="true">/</span>
            <span className="text-[#0D0D0D] font-medium truncate max-w-[240px] sm:max-w-md inline-block align-bottom">
              {post.title}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close article"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#626262] hover:text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <article className="overflow-y-auto px-6 sm:px-10 py-8 space-y-6">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#626262]">
              <span>{post.author}</span>
              <span aria-hidden="true">·</span>
              <span>{post.publishedLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
            </div>
            <h2
              id="article-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0D0D0D] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {post.title}
            </h2>
          </header>

          <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#F3F3F3] border border-black/[0.08]">
            <ResilientImage
              src={post.image}
              alt={post.imageAlt}
              fallbackLabel={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6 text-[15px] sm:text-base text-[#333333] leading-relaxed">
            {post.sections.map((section, idx) => (
              <section key={idx} className="space-y-3">
                {section.heading && (
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#0D0D0D] pt-2">
                    {section.heading}
                  </h3>
                )}
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 pl-5 list-disc text-[#333333]">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
