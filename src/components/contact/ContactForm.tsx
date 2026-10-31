// src/components/contact/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Field, SelectField, TextAreaField } from '@/components/ui/FormField';

const SUBJECTS = ['Order question', 'Product advice', 'Returns & refunds', 'Partnership', 'Something else'];

interface Values {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: '', email: '', subject: SUBJECTS[0], message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactForm: React.FC = () => {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onChange =
    (key: keyof Values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
      setSent(false);
    };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const found: Errors = {};
    if (values.name.trim().length < 2) found.name = 'Please enter your name.';
    if (!EMAIL_RE.test(values.email.trim())) found.email = 'Enter a valid email address.';
    if (values.message.trim().length < 10) found.message = 'Please write at least 10 characters.';
    setErrors(found);

    const first = (['name', 'email', 'message'] as const).find((key) => found[key]);
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    // TODO: send `values` to your API / email service
    setSent(true);
    setValues(EMPTY);
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contact-name"
          label="Name"
          autoComplete="name"
          required
          value={values.name}
          onChange={onChange('name')}
          error={errors.name}
        />
        <Field
          id="contact-email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={onChange('email')}
          error={errors.email}
        />
      </div>

      <SelectField id="contact-subject" label="Subject" value={values.subject} onChange={onChange('subject')}>
        {SUBJECTS.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </SelectField>

      <TextAreaField
        id="contact-message"
        label="Message"
        rows={6}
        required
        value={values.message}
        onChange={onChange('message')}
        error={errors.message}
      />

      <button
        type="submit"
        className="w-full cursor-pointer rounded-full bg-rose-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600 sm:w-auto"
      >
        Send Message
      </button>

      <p role="status" className="min-h-6 text-sm font-semibold text-emerald-600">
        {sent && (
          <span className="flex items-center gap-2">
            <CheckCircle2 size={18} aria-hidden="true" /> Thank you! We will reply within 2 business days.
          </span>
        )}
      </p>
    </form>
  );
};