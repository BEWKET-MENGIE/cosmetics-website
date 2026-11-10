// app/admin/products/page.tsx
import Link from 'next/link';
import { AdminHeading, EmptyState, PRIMARY_BUTTON, StatusBadge, TABLE_WRAP, TD, TH } from '@/components/admin/AdminUi';
import { ProductRowActions } from '@/components/admin/ProductRowActions';
import { db } from '@/lib/db';
import { formatETB } from '@/lib/format';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'low', label: 'Low stock' },
];

interface ProductsPageProps {
  searchParams: Promise<{ q?: string; filter?: string }>;
}

function hrefFor(filter: string, q: string) {
  const search = new URLSearchParams();
  if (filter !== 'all') search.set('filter', filter);
  if (q) search.set('q', q);
  const query = search.toString();
  return query ? `/admin/products?${query}` : '/admin/products';
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim().slice(0, 80);
  const filter = FILTERS.some((f) => f.value === sp.filter) ? (sp.filter as string) : 'all';

  const products = await db.product.findMany({
    where: {
      ...(q ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] } : {}),
      ...(filter === 'active' ? { isActive: true } : {}),
      ...(filter === 'hidden' ? { isActive: false } : {}),
      ...(filter === 'low' ? { stock: { lte: 5 } } : {}),
    },
    orderBy: [{ createdAt: 'desc' }, { name: 'asc' }],
    include: { category: { select: { name: true } } },
  });

  return (
    <div>
      <AdminHeading
        title="Products"
        description={`${products.length} ${products.length === 1 ? 'product' : 'products'}`}
        actions={
          <Link href="/admin/products/new" className={PRIMARY_BUTTON}>
            New product
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Filter products" className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Link
              key={item.value}
              href={hrefFor(item.value, q)}
              aria-current={filter === item.value ? 'true' : undefined}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                filter === item.value
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-rose-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action="/admin/products" method="get" role="search" className="flex gap-2">
          {filter !== 'all' && <input type="hidden" name="filter" value={filter} />}
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <input
            id="product-search"
            name="q"
            defaultValue={q}
            placeholder="Search by name"
            className="w-56 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-2 focus:outline-rose-500"
          />
          <button type="submit" className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            Search
          </button>
        </form>
      </div>

      {products.length === 0 ? (
        <EmptyState>No products match these filters.</EmptyState>
      ) : (
        <div className={TABLE_WRAP}>
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr>
                <th className={TH}>Product</th>
                <th className={TH}>Category</th>
                <th className={TH}>Price</th>
                <th className={TH}>Stock</th>
                <th className={TH}>Status</th>
                <th className={TH}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className={TD}>
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-lg bg-slate-100 object-cover" />
                      <div className="min-w-0">
                        <Link href={`/admin/products/${product.id}`} className="font-semibold text-slate-900 hover:text-rose-600">
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {[product.featured && 'Featured', product.isBestSeller && 'Bestseller', product.isNew && 'New']
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={TD}>{product.category.name}</td>
                  <td className={TD}>{formatETB(product.price)}</td>
                  <td className={TD}>
                    <span className={product.stock <= 5 ? 'font-bold text-amber-600' : ''}>
                      {product.stock === 0 ? 'Out of stock' : product.stock}
                    </span>
                  </td>
                  <td className={TD}>
                    <StatusBadge status={product.isActive ? 'active' : 'hidden'} />
                  </td>
                  <td className={TD}>
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/products/${product.id}`} className="text-sm font-semibold text-rose-600 hover:underline">
                        Edit
                      </Link>
                      <ProductRowActions id={product.id} isActive={product.isActive} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}