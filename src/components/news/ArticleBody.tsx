// src/components/news/ArticleBody.tsx
import React from 'react';
import type { ArticleBlock } from '@/data/articles';

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({ blocks }) => {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={key}
                className="pt-6 font-serif text-2xl font-bold leading-snug text-slate-900 sm:text-3xl"
              >
                {block.text}
              </h2>
            );

          case 'quote':
            return (
              <blockquote
                key={key}
                className="my-8 border-l-4 border-rose-400 bg-rose-50/60 py-4 pl-6 pr-4 font-serif text-xl italic leading-relaxed text-slate-800 sm:text-2xl"
              >
                {block.text}
              </blockquote>
            );

          case 'paragraph':
            return (
              <p
                key={key}
                className={`text-base leading-8 text-slate-700 sm:text-lg sm:leading-9 ${
                  // Drop cap on the very first paragraph
                  index === 0
                    ? 'first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.9] first-letter:text-rose-600'
                    : ''
                }`}
              >
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
};