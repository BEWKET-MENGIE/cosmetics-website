// prisma/seed.ts
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client';
import { ARTICLES } from '../src/data/articles';
import { SHOP_CATEGORIES } from '../src/data/categories';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const FREE_SHIPPING_THRESHOLD = 5000; // keep in sync with src/lib/constants.ts
const SHIPPING_FEE = 150;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

// ---------------------------------------------------------------- products
interface SeedProduct {
  name: string;
  /** Category slug from src/data/categories.ts */
  category: string;
  description: string;
  price: number; // ETB
  rating: number;
  reviewsCount: number;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  featured?: boolean;
}

// Image n = /images/shop/product-n.jpg, in this order
const PRODUCTS: SeedProduct[] = [
  {
    name: 'Rose Elixir Facial Serum',
    category: 'skincare',
    description: 'A lightweight serum with rose extract that leaves skin feeling soft, hydrated and fresh.',
    price: 2400,
    rating: 4.9,
    reviewsCount: 312,
    stock: 40,
    isBestSeller: true,
    featured: true,
  },
  {
    name: 'Botanical Velvet Lip Butter',
    category: 'lip-care',
    description: 'A creamy lip butter with plant oils for soft, comfortable lips all day.',
    price: 1200,
    rating: 4.8,
    reviewsCount: 420,
    stock: 80,
    isBestSeller: true,
    featured: true,
  },
  {
    name: 'Hydrating Radiance Cream',
    category: 'skincare',
    description: 'A rich daily moisturizer that helps skin feel plump, smooth and comfortable.',
    price: 2800,
    rating: 5,
    reviewsCount: 96,
    stock: 35,
    featured: true,
  },
  {
    name: 'Argan Radiance Oil',
    category: 'oils',
    description: 'A cold-pressed argan oil that adds a soft, healthy-looking glow to face and hair.',
    price: 2600,
    rating: 4.9,
    reviewsCount: 275,
    stock: 30,
    isBestSeller: true,
    featured: true,
  },
  {
    name: 'Gentle Botanical Cleanser',
    category: 'skincare',
    description: 'A mild gel cleanser that removes the day without leaving skin feeling tight.',
    price: 1500,
    rating: 4.7,
    reviewsCount: 241,
    stock: 60,
    isNew: true,
    featured: true,
  },
  {
    name: 'Honey Sugar Lip Scrub',
    category: 'lip-care',
    description: 'A gentle scrub that buffs away dry flakes and leaves lips smooth.',
    price: 900,
    rating: 4.7,
    reviewsCount: 156,
    stock: 70,
    featured: true,
  },
  {
    name: 'Petal Glow Blush',
    category: 'makeup',
    description: 'A buildable cream blush with a natural, dewy flush of color.',
    price: 1600,
    rating: 4.8,
    reviewsCount: 207,
    stock: 45,
    isBestSeller: true,
    featured: true,
  },
  {
    name: 'Rosehip Seed Face Oil',
    category: 'oils',
    description: 'A light, fast-absorbing facial oil pressed from rosehip seeds.',
    price: 2200,
    rating: 4.7,
    reviewsCount: 164,
    stock: 28,
    featured: true,
  },
  {
    name: 'Overnight Renewal Mask',
    category: 'skincare',
    description: 'A creamy sleeping mask that helps skin feel refreshed by morning.',
    price: 1900,
    rating: 4.6,
    reviewsCount: 74,
    stock: 25,
  },
  {
    name: 'Tinted Rose Lip Balm',
    category: 'lip-care',
    description: 'A sheer tinted balm that adds a touch of rose color and moisture.',
    price: 1100,
    rating: 4.6,
    reviewsCount: 98,
    stock: 55,
    isNew: true,
  },
  {
    name: 'Silk Skin Concealer',
    category: 'makeup',
    description: 'A lightweight concealer that blends easily for a smooth, natural finish.',
    price: 1700,
    rating: 4.5,
    reviewsCount: 133,
    stock: 40,
  },
  {
    name: 'Volume Botanical Mascara',
    category: 'makeup',
    description: 'A flexible-wand mascara that adds length and volume without clumping.',
    price: 1400,
    rating: 4.4,
    reviewsCount: 89,
    stock: 50,
    isNew: true,
  },
];

// ------------------------------------------------------------ testimonials
const TESTIMONIALS = [
  {
    name: 'Hanna Tesfaye',
    role: 'Verified buyer',
    rating: 5,
    comment: 'The serum feels incredibly light and my skin looks fresher after two weeks. Delivery was fast too.',
  },
  {
    name: 'Meron Alemu',
    role: 'Verified buyer',
    rating: 5,
    comment: 'I have sensitive skin and this was the first cream that did not bother me. I already ordered a second jar.',
  },
  {
    name: 'Selam Bekele',
    role: 'Makeup lover',
    rating: 4,
    comment: 'Petal Glow Blush is the prettiest natural flush. I wish there were more shades.',
  },
  {
    name: 'Rahel Getachew',
    role: 'Verified buyer',
    rating: 5,
    comment: 'The lip butter is now in every bag I own. Smells lovely and lasts all day.',
  },
  {
    name: 'Sara Mulugeta',
    role: 'Skincare enthusiast',
    rating: 5,
    comment: 'The quiz on the website pointed me to the right oil and the packaging arrived beautifully.',
  },
  {
    name: 'Lidya Haile',
    role: 'Verified buyer',
    rating: 4,
    comment: 'Great quality and friendly support. Delivery to Hawassa took four days, which was fine.',
  },
].map((t, index) => ({ ...t, avatar: `/images/avatars/avatar-${index + 1}.jpg` }));

// ------------------------------------------------------------------ orders
interface SeedOrder {
  number: string;
  daysAgo: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef?: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
  /** [product name, quantity] */
  lines: [string, number][];
}

const ORDERS: SeedOrder[] = [
  {
    number: 'LUM-1001',
    daysAgo: 14,
    status: 'delivered',
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    fullName: 'Hanna Tesfaye',
    phone: '0911000001',
    email: 'hanna@example.com',
    city: 'Addis Ababa',
    address: 'Bole, Woreda 03, House 214',
    lines: [
      ['Rose Elixir Facial Serum', 1],
      ['Botanical Velvet Lip Butter', 2],
    ],
  },
  {
    number: 'LUM-1002',
    daysAgo: 9,
    status: 'shipped',
    paymentMethod: 'telebirr',
    paymentStatus: 'paid',
    fullName: 'Meron Alemu',
    phone: '0911000002',
    city: 'Bahir Dar',
    address: 'Kebele 11, near the lake road',
    notes: 'Please call before delivery.',
    lines: [
      ['Hydrating Radiance Cream', 2],
      ['Argan Radiance Oil', 1],
    ],
  },
  {
    number: 'LUM-1003',
    daysAgo: 3,
    status: 'pending',
    paymentMethod: 'chapa',
    paymentStatus: 'unpaid',
    paymentRef: 'LUM-1003-TEST',
    fullName: 'Selam Bekele',
    phone: '0911000003',
    email: 'selam@example.com',
    city: 'Hawassa',
    address: 'Tabor sub-city, behind the market',
    lines: [
      ['Petal Glow Blush', 1],
      ['Volume Botanical Mascara', 1],
    ],
  },
  {
    number: 'LUM-1004',
    daysAgo: 1,
    status: 'cancelled',
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    fullName: 'Rahel Getachew',
    phone: '0911000004',
    email: 'rahel@example.com',
    city: 'Adama',
    address: 'Posta Bet area, house 12',
    lines: [['Gentle Botanical Cleanser', 1]],
  },
];

// ------------------------------------------------- subscribers and messages
const SUBSCRIBERS = [
  'hanna@example.com',
  'meron@example.com',
  'selam@example.com',
  'sara@example.com',
  'lidya@example.com',
];

const MESSAGES = [
  {
    name: 'Sara Mulugeta',
    email: 'sara@example.com',
    subject: 'Product advice',
    message: 'Which oil would you suggest for very dry skin in the dry season?',
    status: 'new',
  },
  {
    name: 'Lidya Haile',
    email: 'lidya@example.com',
    subject: 'Order question',
    message: 'Can I change the delivery address for my order before it ships?',
    status: 'replied',
  },
  {
    name: 'Dawit Kebede',
    email: 'dawit@example.com',
    subject: 'Partnership',
    message: 'I run a small salon in Mekelle and would like to ask about wholesale prices.',
    status: 'new',
  },
];

// -------------------------------------------------------------------- main
async function main() {
  console.log('Clearing old data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.article.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.contactMessage.deleteMany();

  console.log('Creating categories...');
  const categoryIds = new Map<string, string>();
  for (const [index, category] of SHOP_CATEGORIES.entries()) {
    const created = await prisma.category.create({
      data: {
        slug: category.slug,
        name: category.name,
        label: category.productCategory,
        description: category.description,
        image: category.image,
        sortOrder: index,
      },
    });
    categoryIds.set(category.slug, created.id);
  }

  console.log('Creating products...');
  const productsByName = new Map<string, { id: string; name: string; price: number; image: string }>();
  for (const [index, product] of PRODUCTS.entries()) {
    const categoryId = categoryIds.get(product.category);
    if (!categoryId) throw new Error(`Unknown category slug: ${product.category}`);

    const created = await prisma.product.create({
      data: {
        slug: slugify(product.name),
        name: product.name,
        description: product.description,
        image: `/images/shop/product-${index + 1}.jpg`,
        price: product.price,
        rating: product.rating,
        reviewsCount: product.reviewsCount,
        stock: product.stock,
        isNew: product.isNew ?? false,
        isBestSeller: product.isBestSeller ?? false,
        featured: product.featured ?? false,
        categoryId,
      },
    });
    productsByName.set(product.name, created);
  }

  console.log('Creating articles, testimonials, subscribers, messages...');
  await prisma.article.createMany({
    data: ARTICLES.map((article) => ({
      slug: article.slug,
      title: article.title,
      category: article.category,
      publishedAt: new Date(article.date),
      authorName: article.author.name,
      authorRole: article.author.role,
      excerpt: article.excerpt,
      image: article.image,
      imageAlt: article.imageAlt,
      featured: article.featured ?? false,
      body: JSON.stringify(article.body),
    })),
  });
  await prisma.testimonial.createMany({ data: TESTIMONIALS });
  await prisma.subscriber.createMany({ data: SUBSCRIBERS.map((email) => ({ email })) });
  await prisma.contactMessage.createMany({ data: MESSAGES });

  console.log('Creating orders...');
  for (const order of ORDERS) {
    const items = order.lines.map(([name, quantity]) => {
      const product = productsByName.get(name);
      if (!product) throw new Error(`Unknown product in order ${order.number}: ${name}`);
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

    await prisma.order.create({
      data: {
        number: order.number,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentRef: order.paymentRef ?? null,
        subtotal,
        shipping,
        total: subtotal + shipping,
        fullName: order.fullName,
        phone: order.phone,
        email: order.email ?? null,
        city: order.city,
        address: order.address,
        notes: order.notes ?? null,
        createdAt: daysAgo(order.daysAgo),
        items: { create: items },
      },
    });
  }

  console.log('Done.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());