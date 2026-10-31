// src/components/checkout/CheckoutForm.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Field, SelectField, TextAreaField } from '@/components/ui/FormField';
import { ETHIOPIAN_CITIES } from '@/lib/constants';
import { PAYMENT_METHODS, calcShipping, createOrderId, saveLastOrder } from '@/lib/orders';
import type { Order, PaymentMethod } from '@/lib/orders';
import { OrderSummary } from './OrderSummary';

interface Values {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
}

type ErrorKey = 'fullName' | 'phone' | 'email' | 'city' | 'address' | 'terms';
type Errors = Partial<Record<ErrorKey, string>>;

const EMPTY: Values = { fullName: '', phone: '', email: '', city: '', address: '', notes: '' };
const FIELD_ORDER: ErrorKey[] = ['fullName', 'phone', 'email', 'city', 'address', 'terms'];

// Ethiopian mobile numbers: 09xxxxxxxx, 07xxxxxxxx, +2519xxxxxxxx, +2517xxxxxxxx
const PHONE_RE = /^(?:\+251|251|0)?[79]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values, agreed: boolean): Errors {
  const errors: Errors = {};
  if (values.fullName.trim().length < 2) errors.fullName = 'Please enter your full name.';
  if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Enter a valid mobile number, for example 0911 234 567.';
  }
  if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Enter a valid email address, or leave it empty.';
  }
  if (!values.city) errors.city = 'Please choose your city.';
  if (values.address.trim().length < 5) errors.address = 'Please enter your delivery address.';
  if (!agreed) errors.terms = 'Please accept the terms to continue.';
  return errors;
}

const Section: React.FC<{ step: number; title: string; children: React.ReactNode }> = ({
  step,
  title,
  children,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <h2 className="mb-6 flex items-center gap-3 font-serif text-xl font-bold text-slate-900">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 font-sans text-sm font-bold text-white"
      >
        {step}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

export const CheckoutForm: React.FC = () => {
  const router = useRouter();
  const { cart, isHydrated, subtotal, clearCart } = useCart();

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [method, setMethod] = useState<PaymentMethod>('cod');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  const onChange =
    (key: keyof Values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const found = validate(values, agreed);
    setErrors(found);

    const firstError = FIELD_ORDER.find((key) => found[key]);
    if (firstError) {
      document.getElementById(`checkout-${firstError}`)?.focus();
      return;
    }

    setSubmitting(true);

    const order: Order = {
      id: createOrderId(),
      placedAt: new Date().toISOString(),
      items: cart.map(({ id, name, price, quantity, image }) => ({ id, name, price, quantity, image })),
      subtotal,
      shipping,
      total,
      customer: {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
      },
      address: { city: values.city, details: values.address.trim(), notes: values.notes.trim() },
      paymentMethod: method,
    };

    // TODO: send `order` to your backend / payment provider here (Chapa, Telebirr...).
    // For now it is only saved in the browser so the confirmation page can show it.
    saveLastOrder(order);
    clearCart();
    router.push('/checkout/success');
  };

  // Wait for the saved cart to load, otherwise "empty" flashes for a moment
  if (!isHydrated) {
    return <div aria-busy="true" className="h-96 animate-pulse rounded-2xl bg-slate-200/70" />;
  }

  if (cart.length === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
          <ShoppingBag className="text-rose-500" size={32} aria-hidden="true" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">Your bag is empty</h2>
        <p className="mt-3 text-slate-600">Add a few products before checking out.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/shop">Go to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-8">
        <Section step={1} title="Contact">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                id="checkout-fullName"
                label="Full name"
                autoComplete="name"
                required
                value={values.fullName}
                onChange={onChange('fullName')}
                error={errors.fullName}
              />
            </div>
            <Field
              id="checkout-phone"
              label="Phone number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="0911 234 567"
              required
              value={values.phone}
              onChange={onChange('phone')}
              error={errors.phone}
              hint="We call this number to confirm your order."
            />
            <Field
              id="checkout-email"
              label="Email (optional)"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={onChange('email')}
              error={errors.email}
            />
          </div>
        </Section>

        <Section step={2} title="Delivery">
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              id="checkout-city"
              label="City"
              required
              value={values.city}
              onChange={onChange('city')}
              error={errors.city}
            >
              <option value="">Select your city</option>
              {ETHIOPIAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </SelectField>
            <Field
              id="checkout-address"
              label="Address"
              autoComplete="street-address"
              placeholder="Sub-city, neighborhood, street, house number"
              required
              value={values.address}
              onChange={onChange('address')}
              error={errors.address}
            />
            <div className="sm:col-span-2">
              <TextAreaField
                id="checkout-notes"
                label="Delivery notes (optional)"
                rows={3}
                placeholder="Landmarks, preferred delivery time..."
                value={values.notes}
                onChange={onChange('notes')}
              />
            </div>
          </div>
        </Section>

        <Section step={3} title="Payment">
          <fieldset>
            <legend className="sr-only">Payment method</legend>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-start gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-rose-300 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rose-500"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={method === option.value}
                    onChange={() => setMethod(option.value)}
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
        </Section>
      </div>

      <OrderSummary
        items={cart}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        className="lg:sticky lg:top-28"
      >
        <div className="mt-5">
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600">
            <input
              id="checkout-terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? 'checkout-terms-error' : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-rose-500"
            />
            <span>
              I agree to the{' '}
              <Link href="/legal/terms" className="font-semibold text-rose-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/legal/returns" className="font-semibold text-rose-600 hover:underline">
                Returns Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p id="checkout-terms-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.terms}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-500 py-4 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Lock size={16} aria-hidden="true" />
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </OrderSummary>
    </form>
  );
};