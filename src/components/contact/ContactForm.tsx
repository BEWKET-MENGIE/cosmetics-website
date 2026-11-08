// src/components/contact/ContactForm.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Field, SelectField, TextAreaField } from '@/components/ui/FormField';
import { postJson } from '@/lib/api';

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
const KEYS: (keyof Values)[] = ['name', 'email', 'subject', 'message'];

export const ContactForm: React.FC = () => {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [trap, setTrap] = useState(''); // honeypot: only bots fill this in
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const onChange =
    (key: keyof Values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
      setSent(false);
      setServerError('');
    };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError('');

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

    setSending(true);
    const result = await postJson<{ ok: true }>('/api/contact', { ...values, website: trap });
    setSending(false);

    if (!result.ok) {
      const fromServer: Errors = {};
      for (const key of KEYS) {
        if (result.fields[key]) fromServer[key] = result.fields[key];
      }
      setErrors(fromServer);
      setServerError(result.error);
      return;
    }

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

      <SelectField
        id="contact-subject"
        label="Subject"
        value={values.subject}
        onChange={onChange('subject')}
        error={errors.subject}
      >
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

      {/* Honeypot: hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        aria-busy={sending}
        className="w-full cursor-pointer rounded-full bg-rose-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {sending ? 'Sending...' : 'Send Message'}
      </button>

      <div className="min-h-6 text-sm font-semibold" role={serverError ? 'alert' : 'status'}>
        {serverError && <p className="text-rose-600">{serverError}</p>}
        {sent && (
          <p className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={18} aria-hidden="true" /> Thank you! We will reply within 2 business days.
          </p>
        )}
      </div>
    </form>
  );
};