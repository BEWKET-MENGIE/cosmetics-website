// src/data/categories.ts

export interface ShopCategory {
  /** URL-safe id, used as /shop?category=<slug> */
  slug: string;
  name: string;
  /** Must match the `category` value on products in src/data/products.ts */
  productCategory: string;
  description: string;
  /** Path inside /public (do not write "public" in it) */
  image: string;
  productCount: number;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    slug: 'skincare',
    name: 'Skincare Essentials',
    productCategory: 'Skincare',
    description: 'Cleansers, botanical serums, and hydrators designed for daily glow.',
    image: '/images/categories/skincare.jpg',
    productCount: 24,
  },
  {
    slug: 'lip-care',
    name: 'Lip Care & Balms',
    productCategory: 'Lip Care',
    description: 'Nourishing oils, tinted butter balms, and exfoliating lip scrubs.',
    image: '/images/categories/lip-care.jpg',
    productCount: 12,
  },
  {
    slug: 'makeup',
    name: 'Eye & Face Makeup',
    productCategory: 'Eye & Face Makeup',
    description: 'Lightweight concealers, glowing blushes, and organic mascaras.',
    image: '/images/categories/makeup.jpg',
    productCount: 18,
  },
  {
    slug: 'oils',
    name: 'Natural Beauty Oils',
    productCategory: 'Natural Oils',
    description: 'Cold-pressed jojoba, rosehip, and argan elixirs for hair and face.',
    image: '/images/categories/oils.jpg',
    productCount: 9,
  },
];

/** Link to the shop, pre-filtered by category. */
export const categoryHref = (slug: string) => `/shop?category=${encodeURIComponent(slug)}`;

/** "1 Product" / "24 Products" */
export const formatProductCount = (count: number) =>
  `${count} ${count === 1 ? 'Product' : 'Products'}`;