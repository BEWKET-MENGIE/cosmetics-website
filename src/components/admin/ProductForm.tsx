// src/components/admin/ProductForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Field, SelectField, TextAreaField } from '@/components/ui/FormField';
import { patchJson, postJson } from '@/lib/api';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from './AdminUi';

export interface ProductFormValues {
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  image: string;
  price: string;
  stock: string;
  isNew: boolean;
  isBestSeller: boolean;
  featured: boolean;
  isActive: boolean;
}

interface ProductFormProps {
  categories: { id: string; name: string }[];
  /** Present when editing */
  productId?: string;
  initial?: ProductFormValues;
}

const EMPTY: ProductFormValues = {
  name: '',
  slug: '',
  categoryId: '',
  description: '',
  image: '/images/shop/product-1.jpg',
  price: '',
  stock: '20',
  isNew: false,
  isBestSeller: false,
  featured: false,
  isActive: true,
};

const FLAGS: { key: 'isNew' | 'isBestSeller' | 'featured' | 'isActive'; label: string; hint: string }[] = [
  { key: 'isActive', label: 'Visible in the shop', hint: 'Untick to hide it without deleting.' },
  { key: 'featured', label: 'Featured', hint: 'Shown on the Featured Products page.' },
  { key: 'isBestSeller', label: 'Bestseller badge', hint: 'Shows a "Best Seller" label on the card.' },
  { key: 'isNew', label: 'New badge', hint: 'Shows a "New" label on the card.' },
];

export const ProductForm: React.FC<ProductFormProps> = ({ categories, productId, initial }) => {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const set =
    (key: keyof ProductFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: '' }));
    };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setBusy(true);

    const payload = {
      name: values.name,
      slug: values.slug,
      categoryId: values.categoryId,
      description: values.description,
      image: values.image,
      price: values.price.trim() === '' ? undefined : Number(values.price),
      stock: values.stock.trim() === '' ? undefined : Number(values.stock),
      isNew: values.isNew,
      isBestSeller: values.isBestSeller,
      featured: values.featured,
      isActive: values.isActive,
    };

    const result = productId
      ? await patchJson(`/api/admin/products/${productId}`, payload)
      : await postJson('/api/admin/products', payload);
    setBusy(false);

    if (!result.ok) {
      setErrors(result.fields);
      setFormError(result.error);
      const first = Object.keys(result.fields)[0];
      if (first) document.getElementById(`product-${first}`)?.focus();
      return;
    }

    router.push('/admin/products');
    router.refresh();
  };

  const imageOk = values.image.startsWith('/') || values.image.startsWith('https://');

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="product-name" label="Name" required value={values.name} onChange={set('name')} error={errors.name} />
        </div>

        <SelectField
          id="product-categoryId"
          label="Category"
          required
          value={values.categoryId}
          onChange={set('categoryId')}
          error={errors.categoryId}
        >
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>

        <Field
          id="product-slug"
          label="Web address (optional)"
          value={values.slug}
          onChange={set('slug')}
          error={errors.slug}
          hint="Leave empty to create it from the name. It becomes /shop/your-address."
        />

        <div className="sm:col-span-2">
          <TextAreaField
            id="product-description"
            label="Description"
            required
            rows={4}
            value={values.description}
            onChange={set('description')}
            error={errors.description}
          />
        </div>

        <Field
          id="product-price"
          label="Price (ETB)"
          type="number"
          inputMode="numeric"
          min={1}
          required
          value={values.price}
          onChange={set('price')}
          error={errors.price}
        />
        <Field
          id="product-stock"
          label="Stock"
          type="number"
          inputMode="numeric"
          min={0}
          required
          value={values.stock}
          onChange={set('stock')}
          error={errors.stock}
        />

        <div className="sm:col-span-2">
          <Field
            id="product-image"
            label="Image"
            required
            value={values.image}
            onChange={set('image')}
            error={errors.image}
            hint="A file in the public folder, like /images/shop/product-1.jpg, or an https link."
          />
          {imageOk && (
            <img src={values.image} alt="Preview" className="mt-3 h-32 w-32 rounded-xl border border-slate-200 bg-slate-100 object-cover" />
          )}
        </div>
      </div>

      <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <legend className="px-2 text-sm font-bold text-slate-900">Visibility and badges</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {FLAGS.map((flag) => (
            <label key={flag.key} className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={values[flag.key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [flag.key]: e.target.checked }))}
                className="mt-1 h-4 w-4 accent-rose-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">{flag.label}</span>
                <span className="block text-xs text-slate-500">{flag.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {formError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} aria-busy={busy} className={PRIMARY_BUTTON}>
          {busy ? 'Saving...' : productId ? 'Save changes' : 'Create product'}
        </button>
        <Link href="/admin/products" className={SECONDARY_BUTTON}>
          Cancel
        </Link>
      </div>
    </form>
  );
};