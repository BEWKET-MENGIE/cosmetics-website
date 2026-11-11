// src/components/testimonial/ReviewForm.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { Field, TextAreaField } from '@/components/ui/FormField';
import { postJson } from '@/lib/api';

type Errors = { name?: string; rating?: string; comment?: string };

export const ReviewForm: React.FC = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [trap, setTrap] = useState(''); // honeypot: only bots fill this in
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const found: Errors = {};
    if (name.trim().length < 2) found.name = 'Please enter your name.';
    if (rating < 1) found.rating = 'Please choose a rating.';
    if (comment.trim().length < 10) found.comment = 'Please write at least 10 characters.';
    setErrors(found);

    const first = (['name', 'rating', 'comment'] as const).find((key) => found[key]);
    if (first) {
      document.getElementById(first === 'rating' ? 'review-rating-1' : `review-${first}`)?.focus();
      return;
    }

    setBusy(true);
    const result = await postJson('/api/reviews', { name, rating, comment, website: trap });
    setBusy(false);

    if (!result.ok) {
      setErrors({ name: result.fields.name, rating: result.fields.rating, comment: result.fields.comment });
      setFormError(result.error);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto text-emerald-500" size={44} aria-hidden="true" />
        <h3 className="mt-4 font-serif text-2xl font-bold text-slate-900">Thank you for your review!</h3>
        <p className="mt-2 text-sm text-slate-700">It will appear on this page once our team has approved it.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <Field
        id="review-name"
        label="Your name"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors((prev) => ({ ...prev, name: undefined }));
        }}
        error={errors.name}
      />

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-slate-800">
          Rating <span aria-hidden="true" className="text-rose-500">*</span>
        </legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className="cursor-pointer rounded-lg p-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rose-500"
            >
              <input
                id={`review-rating-${value}`}
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => {
                  setRating(value);
                  setErrors((prev) => ({ ...prev, rating: undefined }));
                }}
                className="sr-only"
              />
              <span className="sr-only">{value === 1 ? '1 star' : `${value} stars`}</span>
              <Star
                size={30}
                aria-hidden="true"
                className={value <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300'}
              />
            </label>
          ))}
        </div>
        {errors.rating && (
          <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
            {errors.rating}
          </p>
        )}
      </fieldset>

      <TextAreaField
        id="review-comment"
        label="Your review"
        rows={5}
        required
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          setErrors((prev) => ({ ...prev, comment: undefined }));
        }}
        error={errors.comment}
        hint="Tell us what you bought and how it worked for you."
      />

      {/* Honeypot: hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      {formError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className="w-full cursor-pointer rounded-full bg-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? 'Sending...' : 'Submit my review'}
      </button>
    </form>
  );
};