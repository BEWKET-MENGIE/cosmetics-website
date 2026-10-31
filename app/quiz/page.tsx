// app/quiz/page.tsx
import type { Metadata } from 'next';
import { SkinQuiz } from '@/components/features/SkinQuiz';

export const metadata: Metadata = {
  title: 'Skin Routine Quiz | LUMIÈRE',
  description: 'Answer three quick questions and get product picks and tips for your skin.',
};

export default function QuizPage() {
  return (
    <section className="bg-linear-to-b from-rose-50 via-white to-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600">Skin Routine Quiz</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Find your <span className="italic text-rose-600">perfect match</span>
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Three quick questions. Personal tips and product picks in under a minute.
          </p>
        </header>
        <SkinQuiz />
      </div>
    </section>
  );
}