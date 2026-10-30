import React from 'react';
import { SkinQuiz } from '@/components/features/SkinQuiz';

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SkinQuiz />
      </div>
    </main>
  );
}