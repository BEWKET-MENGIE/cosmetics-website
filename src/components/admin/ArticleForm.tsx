// src/components/admin/ArticleForm.tsx
'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Field, TextAreaField } from '@/components/ui/FormField';
import { patchJson, postJson } from '@/lib/api';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from './AdminUi';

type BlockType = 'heading' | 'paragraph' | 'quote';

interface BlockValue {
  type: BlockType;
  text: string;
}

interface BlockState extends BlockValue {
  key: number;
}

export interface ArticleFormValues {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  featured: boolean;
  isPublished: boolean;
  body: BlockValue[];
}

interface ArticleFormProps {
  /** Present when editing */
  articleId?: string;
  initial: ArticleFormValues;
  /** Existing categories, offered as suggestions so spelling stays consistent */
  categories: string[];
}

const BLOCK_LABELS: Record<BlockType, string> = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  quote: 'Quote',
};

const iconButton =
  'cursor-pointer rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-rose-300 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40';

export const ArticleForm: React.FC<ArticleFormProps> = ({ articleId, initial, categories }) => {
  const router = useRouter();
  const [values, setValues] = useState<Omit<ArticleFormValues, 'body'>>(() => {
    const { body: _body, ...rest } = initial;
    return rest;
  });
  const nextKey = useRef(initial.body.length);
  const [blocks, setBlocks] = useState<BlockState[]>(() => initial.body.map((block, index) => ({ ...block, key: index })));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const set =
    (key: keyof Omit<ArticleFormValues, 'body' | 'featured' | 'isPublished'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: '' }));
    };

  const addBlock = (type: BlockType) =>
    setBlocks((prev) => [...prev, { key: nextKey.current++, type, text: '' }]);

  const updateBlock = (key: number, text: string) => {
    setBlocks((prev) => prev.map((block) => (block.key === key ? { ...block, text } : block)));
    setErrors((prev) => ({ ...prev, body: '' }));
  };

  const removeBlock = (key: number) => setBlocks((prev) => prev.filter((block) => block.key !== key));

  const moveBlock = (index: number, delta: -1 | 1) =>
    setBlocks((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setBusy(true);

    const payload = { ...values, body: blocks.map(({ type, text }) => ({ type, text })) };
    const result = articleId
      ? await patchJson(`/api/admin/articles/${articleId}`, payload)
      : await postJson('/api/admin/articles', payload);
    setBusy(false);

    if (!result.ok) {
      setErrors(result.fields);
      setFormError(result.error);
      const first = Object.keys(result.fields).find((key) => !key.startsWith('body'));
      if (first) document.getElementById(`article-${first}`)?.focus();
      return;
    }

    router.push('/admin/articles');
    router.refresh();
  };

  const imageOk = values.image.startsWith('/') || values.image.startsWith('https://');

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="article-title" label="Title" required value={values.title} onChange={set('title')} error={errors.title} />
        </div>

        <Field
          id="article-category"
          label="Category"
          required
          list="article-categories"
          value={values.category}
          onChange={set('category')}
          error={errors.category}
          hint="Pick an existing one or type a new one."
        />
        <datalist id="article-categories">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>

        <Field
          id="article-publishedAt"
          label="Publication date"
          type="date"
          required
          value={values.publishedAt}
          onChange={set('publishedAt')}
          error={errors.publishedAt}
        />

        <div className="sm:col-span-2">
          <TextAreaField
            id="article-excerpt"
            label="Short summary"
            rows={3}
            required
            value={values.excerpt}
            onChange={set('excerpt')}
            error={errors.excerpt}
            hint="Shown on the cards and in search results. Up to 300 characters."
          />
        </div>

        <Field id="article-authorName" label="Author" required value={values.authorName} onChange={set('authorName')} error={errors.authorName} />
        <Field id="article-authorRole" label="Author role" required value={values.authorRole} onChange={set('authorRole')} error={errors.authorRole} />

        <div className="sm:col-span-2">
          <Field
            id="article-image"
            label="Cover image"
            required
            value={values.image}
            onChange={set('image')}
            error={errors.image}
            hint="A file in the public folder, like /images/journal/article-1.jpg, or an https link."
          />
          {imageOk && (
            <img src={values.image} alt="Preview" className="mt-3 h-28 w-48 rounded-xl border border-slate-200 bg-slate-100 object-cover" />
          )}
        </div>
        <div className="sm:col-span-2">
          <Field
            id="article-imageAlt"
            label="Describe the image"
            required
            value={values.imageAlt}
            onChange={set('imageAlt')}
            error={errors.imageAlt}
            hint="For people who cannot see it, and for search engines."
          />
        </div>

        <div className="sm:col-span-2">
          <Field
            id="article-slug"
            label="Web address (optional)"
            value={values.slug}
            onChange={set('slug')}
            error={errors.slug}
            hint="Leave empty to create it from the title. It becomes /news/your-address."
          />
        </div>
      </div>

      {/* Body */}
      <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <legend className="px-2 text-sm font-bold text-slate-900">Article body</legend>

        {errors.body && (
          <p role="alert" className="mb-3 text-sm font-medium text-rose-600">
            {errors.body}
          </p>
        )}

        <ol className="space-y-4">
          {blocks.map((block, index) => {
            const fieldError = errors[`body.${index}.text`];
            const inputId = `article-block-${block.key}`;
            return (
              <li key={block.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {BLOCK_LABELS[block.type]} {index + 1}
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} aria-label={`Move block ${index + 1} up`} className={iconButton}>
                      <ArrowUp size={14} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} aria-label={`Move block ${index + 1} down`} className={iconButton}>
                      <ArrowDown size={14} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => removeBlock(block.key)} aria-label={`Remove block ${index + 1}`} className={`${iconButton} hover:bg-rose-50`}>
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <textarea
                  id={inputId}
                  rows={block.type === 'heading' ? 1 : 4}
                  value={block.text}
                  onChange={(e) => updateBlock(block.key, e.target.value)}
                  aria-invalid={fieldError ? true : undefined}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 focus:outline-2 focus:outline-rose-500 ${
                    fieldError ? 'border-rose-400' : 'border-slate-200'
                  } ${block.type === 'quote' ? 'italic' : ''}`}
                />
                {fieldError && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                    {fieldError}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-5 flex flex-wrap gap-3">
          {(['paragraph', 'heading', 'quote'] as const).map((type) => (
            <button key={type} type="button" onClick={() => addBlock(type)} className={SECONDARY_BUTTON}>
              <Plus size={14} aria-hidden="true" /> Add {BLOCK_LABELS[type].toLowerCase()}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <legend className="px-2 text-sm font-bold text-slate-900">Publishing</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={values.isPublished}
              onChange={(e) => setValues((prev) => ({ ...prev, isPublished: e.target.checked }))}
              className="mt-1 h-4 w-4 accent-rose-500"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-900">Published</span>
              <span className="block text-xs text-slate-500">Untick to keep it as a draft that visitors cannot see.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => setValues((prev) => ({ ...prev, featured: e.target.checked }))}
              className="mt-1 h-4 w-4 accent-rose-500"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-900">Featured</span>
              <span className="block text-xs text-slate-500">Shown large at the top of the Journal. Only one article can be featured.</span>
            </span>
          </label>
        </div>
      </fieldset>

      {formError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON}>
          {busy ? 'Saving...' : articleId ? 'Save changes' : 'Create article'}
        </button>
        <Link href="/admin/articles" className={SECONDARY_BUTTON}>
          Cancel
        </Link>
      </div>
    </form>
  );
};