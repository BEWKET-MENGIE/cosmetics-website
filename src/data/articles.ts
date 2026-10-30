// src/data/articles.ts

export type ArticleBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string };

export interface Author {
  name: string;
  role: string;
}

export interface Article {
  /** Used in the URL: /news/<slug> */
  slug: string;
  title: string;
  category: string;
  /** ISO date: YYYY-MM-DD */
  date: string;
  author: Author;
  excerpt: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  body: ArticleBlock[];
}

// PLACEHOLDER CONTENT: replace the names, text and photos with your real articles.
// Avoid medical claims in published copy ("cures", "treats", "boosts collagen").
export const ARTICLES: Article[] = [
  {
    slug: 'ultimate-guide-hyaluronic-acid-glass-skin',
    title: 'The Ultimate Guide to Hyaluronic Acid & Glass Skin',
    category: 'Skincare Tips',
    date: '2026-10-24',
    author: { name: 'Dr. Elena Rostova', role: 'Skincare Advisor' },
    excerpt:
      'Discover how to layer serums effectively for deep, long-lasting moisture and a radiant glow.',
    image: '/images/journal/article-1.jpg',
    imageAlt: 'A hydrating facial serum bottle beside a soft towel',
    featured: true,
    body: [
      {
        type: 'paragraph',
        text: 'Hyaluronic acid is a humectant, which means it helps skin hold on to water. Used well, it can leave skin feeling plumper, smoother and more comfortable throughout the day.',
      },
      { type: 'heading', text: 'Apply it to damp skin' },
      {
        type: 'paragraph',
        text: 'Humectants work best when there is water to draw in. Apply your serum to slightly damp skin right after cleansing, then seal it in with a moisturizer so the hydration stays where you want it.',
      },
      {
        type: 'quote',
        text: 'Hydration is a layering game: water first, then a serum, then something to lock it in.',
      },
      { type: 'heading', text: 'Keep the routine simple' },
      {
        type: 'paragraph',
        text: 'You do not need five hydrating products. One serum and one moisturizer you enjoy using every day will do more than a crowded shelf you never finish.',
      },
    ],
  },
  {
    slug: 'botanical-oils-for-sensitive-skin',
    title: 'Why Botanical Oils are Better for Sensitive Skin',
    category: 'Ingredients',
    date: '2026-10-18',
    author: { name: 'Sophia Chen', role: 'Formulation Writer' },
    excerpt:
      'Cold-pressed plant extracts nourish skin barriers without triggering irritation or clogging pores.',
    image: '/images/journal/article-2.jpg',
    imageAlt: 'A dropper bottle of botanical face oil on a stone surface',
    body: [
      {
        type: 'paragraph',
        text: 'Many people with sensitive skin find that simple, fragrance-free botanical oils feel gentler than long ingredient lists full of actives. The right oil can soften skin and help it hold on to moisture.',
      },
      { type: 'heading', text: 'Choose lighter oils first' },
      {
        type: 'paragraph',
        text: 'Jojoba and squalane-style oils feel light and are easy to start with. Heavier oils can be wonderful for dry skin, but they are not everyone\u2019s favorite on a first try.',
      },
      { type: 'heading', text: 'Always patch test' },
      {
        type: 'paragraph',
        text: 'Natural does not mean risk-free. Test a small amount on your inner arm for a day before using a new oil on your face, and stop if you notice redness or itching.',
      },
    ],
  },
  {
    slug: 'five-daily-habits-for-a-morning-glow',
    title: '5 Daily Habits for a Youthful Morning Glow',
    category: 'Self Care',
    date: '2026-10-10',
    author: { name: 'Maya Lin', role: 'Wellness Editor' },
    excerpt:
      'Simple ritual swaps that help reduce puffiness and brighten how your skin looks and feels each morning.',
    image: '/images/journal/article-3.jpg',
    imageAlt: 'A calm morning skincare setup with a glass of water',
    body: [
      {
        type: 'paragraph',
        text: 'A good morning glow starts the night before. Small, repeatable habits add up far more than one expensive product.',
      },
      { type: 'heading', text: 'The five habits' },
      {
        type: 'paragraph',
        text: 'Drink a glass of water when you wake up. Cleanse gently with lukewarm water. Apply sunscreen every single day. Sleep on a clean pillowcase. Wind down without screens for the last half hour of your evening.',
      },
      {
        type: 'quote',
        text: 'Consistency beats intensity, every time.',
      },
    ],
  },
  {
    slug: 'build-a-simple-three-step-routine',
    title: 'How to Build a Simple Three-Step Routine',
    category: 'Routines',
    date: '2026-10-03',
    author: { name: 'Sophia Chen', role: 'Formulation Writer' },
    excerpt:
      'Cleanse, moisturize, protect. A beginner-friendly routine you can actually stick with.',
    image: '/images/journal/article-4.jpg',
    imageAlt: 'Three skincare products lined up on a pink background',
    body: [
      {
        type: 'paragraph',
        text: 'If you are new to skincare, three steps are plenty. They cover the basics your skin needs every day without overwhelming your budget or your mornings.',
      },
      { type: 'heading', text: 'Morning' },
      {
        type: 'paragraph',
        text: 'Cleanse with a gentle face wash, apply a light moisturizer, and finish with sunscreen. That is the whole routine.',
      },
      { type: 'heading', text: 'Evening' },
      {
        type: 'paragraph',
        text: 'Cleanse to remove the day, then moisturize. Add one extra product, such as a serum, only after your skin is comfortable with the basics.',
      },
    ],
  },
  {
    slug: 'rosehip-oil-what-it-does-and-who-it-suits',
    title: 'Rosehip Oil: What It Does and Who It Suits',
    category: 'Ingredients',
    date: '2026-09-26',
    author: { name: 'Dr. Elena Rostova', role: 'Skincare Advisor' },
    excerpt:
      'A closer look at one of the most popular botanical oils and how to work it into your routine.',
    image: '/images/journal/article-5.jpg',
    imageAlt: 'Rosehip oil in an amber bottle next to fresh rosehips',
    body: [
      {
        type: 'paragraph',
        text: 'Rosehip oil is pressed from the seeds of rose bushes and is loved for its light, silky feel. It is a popular choice for people who want a little extra softness without a heavy finish.',
      },
      { type: 'heading', text: 'How to use it' },
      {
        type: 'paragraph',
        text: 'Warm two or three drops between your palms and press them onto clean skin in the evening. Because oils sit on top of the skin, apply them after water-based serums and before you go to bed.',
      },
    ],
  },
  {
    slug: 'layering-skincare-in-the-right-order',
    title: 'Layering Skincare in the Right Order',
    category: 'Skincare Tips',
    date: '2026-09-19',
    author: { name: 'Maya Lin', role: 'Wellness Editor' },
    excerpt:
      'The simple rule of thumb that makes every product in your routine work better.',
    image: '/images/journal/article-6.jpg',
    imageAlt: 'A row of skincare bottles arranged from thin to thick textures',
    body: [
      {
        type: 'paragraph',
        text: 'The easiest rule of skincare layering is to go from the thinnest texture to the thickest. Water-based products go first, creams come next, and oils or sunscreen finish the routine.',
      },
      { type: 'heading', text: 'Give each layer a moment' },
      {
        type: 'paragraph',
        text: 'You do not need to wait long. Thirty seconds between products is usually enough for each layer to settle before the next one goes on.',
      },
    ],
  },
];

export const ARTICLE_CATEGORIES: string[] = Array.from(new Set(ARTICLES.map((a) => a.category)));

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Same-category articles first, then the rest. Never includes the current one. */
export function getRelatedArticles(current: Article, limit = 3): Article[] {
  const others = ARTICLES.filter((a) => a.slug !== current.slug);
  const sameCategory = others.filter((a) => a.category === current.category);
  const rest = others.filter((a) => a.category !== current.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getReadingMinutes(article: Article): number {
  const words = article.body.map((block) => block.text).join(' ').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}