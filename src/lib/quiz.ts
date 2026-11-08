// src/lib/quiz.ts
import { SHOP_CATEGORIES } from '@/data/categories';
import { CONCERN_TIPS, SKIN_TIPS } from '@/data/quiz';
import type { QuizQuestionId } from '@/data/quiz';
import type { Product } from '@/types';

export type QuizAnswers = Partial<Record<QuizQuestionId, string>>;

export interface QuizResult {
  categoryName: string;
  categorySlug: string | undefined;
  products: Product[];
  skinTip: string | undefined;
  concernTip: string | undefined;
}

export function getQuizResult(answers: QuizAnswers, allProducts: Product[]): QuizResult {
  const category = SHOP_CATEGORIES.find((c) => c.slug === answers.focus);

  const inCategory = category
    ? allProducts.filter((product) => product.category === category.productCategory)
    : [];
  // If the chosen category has no products yet, fall back to the best-rated overall
  const pool = inCategory.length > 0 ? inCategory : allProducts;
  const products = [...pool].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return {
    categoryName: category?.name ?? 'Our favorites',
    categorySlug: category?.slug,
    products,
    skinTip: answers.skin ? SKIN_TIPS[answers.skin] : undefined,
    concernTip: answers.concern ? CONCERN_TIPS[answers.concern] : undefined,
  };
}