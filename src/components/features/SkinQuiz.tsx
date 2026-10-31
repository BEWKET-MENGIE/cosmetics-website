// src/components/features/SkinQuiz.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { categoryHref } from '@/data/categories';
import { QUIZ_QUESTIONS } from '@/data/quiz';
import { getQuizResult } from '@/lib/quiz';
import type { QuizAnswers } from '@/lib/quiz';

const TOTAL = QUIZ_QUESTIONS.length;

export const SkinQuiz: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const isResult = step >= TOTAL;
  const question = isResult ? undefined : QUIZ_QUESTIONS[step];
  const selected = question ? answers[question.id] : undefined;

  // After each step, move keyboard and screen reader focus to the new heading
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  if (!question) {
    const result = getQuizResult(answers);

    return (
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-700">
            <Sparkles size={14} aria-hidden="true" /> Your result
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-serif text-3xl font-bold text-slate-900 focus:outline-none sm:text-5xl"
          >
            Picked for you: <span className="italic text-rose-600">{result.categoryName}</span>
          </h2>
        </div>

        <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {result.skinTip && (
            <li className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600">For your skin</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{result.skinTip}</p>
            </li>
          )}
          {result.concernTip && (
            <li className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600">Your goal</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{result.concernTip}</p>
            </li>
          )}
        </ul>

        <h3 className="mb-6 mt-14 text-center font-serif text-2xl font-bold text-slate-900">
          Start with these
        </h3>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {result.products.map((product) => (
            <li key={product.id} className="flex">
              <div className="w-full">
                <ProductCard product={product} />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {result.categorySlug && (
            <Link
              href={categoryHref(result.categorySlug)}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600"
            >
              See all in {result.categoryName} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
          <button
            type="button"
            onClick={restart}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-600"
          >
            <RotateCcw size={16} aria-hidden="true" /> Retake the quiz
          </button>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-slate-500">
          This quiz gives general guidance, not medical advice. If you have a skin condition, please
          check with a dermatologist.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-slate-600">
          Question {step + 1} of {TOTAL}
        </p>
        <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-rose-100">
          <div
            className="h-full rounded-full bg-rose-500 transition-all duration-500 motion-reduce:transition-none"
            style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (selected) setStep((s) => s + 1);
        }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
      >
        {/* `key` replays the fade-in on every question */}
        <fieldset key={question.id} className="animate-fade-up motion-reduce:animate-none">
          <legend className="sr-only">{question.title}</legend>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-serif text-2xl font-bold text-slate-900 focus:outline-none sm:text-3xl"
          >
            {question.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{question.hint}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-rose-300 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rose-500"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={selected === option.value}
                  onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.value }))}
                  className="mt-1 h-4 w-4 accent-rose-500"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-900">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-600">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back
          </button>

          <button
            type="submit"
            disabled={!selected}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {step === TOTAL - 1 ? 'See my results' : 'Next'} <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
};