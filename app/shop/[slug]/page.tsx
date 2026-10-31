// app/shop/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductDetail } from '@/components/Shop/ProductDetail';
import { SHOP_CATEGORIES, categoryHref } from '@/data/categories';
import { ALL_PRODUCTS, getProductBySlug, getRelatedProducts, productSlug } from '@/lib/products';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Builds every product page ahead of time
export function generateStaticParams() {
  return ALL_PRODUCTS.map((product) => ({ slug: productSlug(product) }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product not found | LUMIÈRE' };

  return {
    title: `${product.name} | LUMIÈRE`,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [{ url: product.image }] },
  };
}

function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl animate-pulse gap-10 px-4 py-16 lg:grid-cols-2" aria-busy="true">
      <div className="aspect-square rounded-3xl bg-slate-200" />
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-10 w-3/4 rounded bg-slate-200" />
        <div className="h-24 rounded bg-slate-200" />
      </div>
    </div>
  );
}

async function ProductContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const category = SHOP_CATEGORIES.find((c) => c.productCategory === product.category);

  // Structured data so Google can show price and rating
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'ETB', availability: 'https://schema.org/InStock' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewsCount },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-rose-600">Home</Link>
              </li>
              <ChevronRight size={14} aria-hidden="true" />
              <li>
                <Link href="/shop" className="hover:text-rose-600">Shop</Link>
              </li>
              <ChevronRight size={14} aria-hidden="true" />
              <li>
                <Link
                  href={category ? categoryHref(category.slug) : '/shop'}
                  className="hover:text-rose-600"
                >
                  {product.category}
                </Link>
              </li>
              <ChevronRight size={14} aria-hidden="true" />
              <li aria-current="page" className="font-semibold text-slate-800">
                {product.name}
              </li>
            </ol>
          </nav>

          <ProductDetail product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="related-title" className="mb-8 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              You May Also Like
            </h2>
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.id} className="flex">
                  <div className="w-full">
                    <ProductCard product={item} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  // Suspense is required because `params` is awaited (Cache Components is enabled)
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}