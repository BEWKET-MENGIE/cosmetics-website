// app/contact/page.tsx
import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Us | LUMIÈRE',
  description: 'Questions about an order or a product? Send us a message.',
};

export default function ContactPage() {
  const { email, phone, phoneHref, address } = SITE.contact;

  const details = [
    { Icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { Icon: Phone, label: 'Phone', value: phone, href: phoneHref },
    { Icon: MapPin, label: 'Address', value: address },
    { Icon: Clock, label: 'Response time', value: 'Within 2 business days' },
  ];

  return (
    <>
      <section className="bg-linear-to-b from-rose-50 via-white to-white pb-10 pt-16 text-center sm:pt-24">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600">Get in touch</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-slate-900 sm:text-6xl">
            We&apos;d love to <span className="italic text-rose-600">hear from you</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            Questions about an order, a product or your skin? Send us a message and we will help.
          </p>
        </div>
      </section>

      <section className="pb-20 pt-6">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
          <ContactForm />

          <aside className="space-y-4">
            <ul className="space-y-4">
              {details.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                    {href ? (
                      <a href={href} className="font-semibold text-slate-900 transition-colors hover:text-rose-600">
                        {value}
                      </a>
                    ) : (
                      <p className="font-semibold text-slate-900">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="mb-4 text-sm font-semibold text-white">Follow us</p>
              <SocialLinks />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}