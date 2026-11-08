// src/components/features/FeaturedProducts.tsx
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getFeaturedProducts } from '@/server/catalog';

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Featured Products" title="Beauty Favorites Loved by Our Customers" />

        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id} className="flex">
              <div className="w-full">
                <ProductCard product={product} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}