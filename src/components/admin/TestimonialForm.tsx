// src/components/admin/TestimonialForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, SelectField, TextAreaField } from '@/components/ui/FormField';
import { postJson } from '@/lib/api';
import { PRIMARY_BUTTON } from './AdminUi';

const EMPTY = { name: '', role: 'Verified buyer', rating: '5', comment: '', avatar: '', isPublished: true };

export const TestimonialForm: React.FC = () => {
  const router = useRouter();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const set =
    (key: 'name' | 'role' | 'rating' | 'comment' | 'avatar') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: '' }));
    };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setBusy(true);

    const result = await postJson('/api/admin/testimonials', { ...values, rating: Number(values.rating) });
    setBusy(false);

    if (!result.ok) {
      setErrors(result.fields);
      setFormError(result.error);
      const first = Object.keys(result.fields)[0];
      if (first) document.getElementById(`testimonial-${first}`)?.focus();
      return;
    }

    setValues(EMPTY);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="testimonial-name" label="Name" required value={values.name} onChange={set('name')} error={errors.name} />
        <Field id="testimonial-role" label="Role" required value={values.role} onChange={set('role')} error={errors.role} />
        <SelectField id="testimonial-rating" label="Rating" value={values.rating} onChange={set('rating')} error={errors.rating}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'star' : 'stars'}
            </option>
          ))}
        </SelectField>
        <Field
          id="testimonial-avatar"
          label="Photo (optional)"
          value={values.avatar}
          onChange={set('avatar')}
          error={errors.avatar}
          hint="A path like /images/avatars/avatar-1.jpg. Leave empty to show initials."
        />
      </div>

      <TextAreaField
        id="testimonial-comment"
        label="What they said"
        rows={4}
        required
        value={values.comment}
        onChange={set('comment')}
        error={errors.comment}
      />

      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={values.isPublished}
          onChange={(e) => setValues((prev) => ({ ...prev, isPublished: e.target.checked }))}
          className="h-4 w-4 accent-rose-500"
        />
        Show on the site straight away
      </label>

      {formError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {formError}
        </p>
      )}

      <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON}>
        {busy ? 'Saving...' : 'Add testimonial'}
      </button>
    </form>
  );
};