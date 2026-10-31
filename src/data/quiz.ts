// src/data/quiz.ts

export type QuizQuestionId = 'focus' | 'skin' | 'concern';

export interface QuizOption {
  value: string;
  label: string;
  description: string;
}

export interface QuizQuestion {
  id: QuizQuestionId;
  title: string;
  hint: string;
  options: QuizOption[];
}

// The "focus" option values must match the category slugs in src/data/categories.ts
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'focus',
    title: 'What are you looking for today?',
    hint: 'Pick the area you want to focus on first.',
    options: [
      { value: 'skincare', label: 'Skincare', description: 'Serums, creams and daily essentials' },
      { value: 'lip-care', label: 'Lip care', description: 'Balms, butters and gentle scrubs' },
      { value: 'makeup', label: 'Makeup', description: 'Light, skin-loving color' },
      { value: 'oils', label: 'Natural oils', description: 'Botanical oils for face and hair' },
    ],
  },
  {
    id: 'skin',
    title: 'How would you describe your skin?',
    hint: 'Choose the one that fits you most days.',
    options: [
      { value: 'dry', label: 'Dry', description: 'Often feels tight or looks flaky' },
      { value: 'oily', label: 'Oily', description: 'Shiny, especially by midday' },
      { value: 'combination', label: 'Combination', description: 'Oily T-zone, drier cheeks' },
      { value: 'sensitive', label: 'Sensitive', description: 'Easily irritated or reactive' },
    ],
  },
  {
    id: 'concern',
    title: 'What would you like to improve most?',
    hint: 'We will tailor the tips to this.',
    options: [
      { value: 'hydration', label: 'Hydration', description: 'Skin that feels comfortable all day' },
      { value: 'glow', label: 'Radiance', description: 'A fresher, brighter look' },
      { value: 'softness', label: 'Softness', description: 'Smooth, supple texture' },
      { value: 'comfort', label: 'Comfort', description: 'Calmer, gentler routines' },
    ],
  },
];

// General guidance only: keep medical claims out of this copy.
export const SKIN_TIPS: Record<string, string> = {
  dry: 'Look for rich, nourishing textures and apply them to slightly damp skin to help lock in moisture.',
  oily: 'Choose lightweight, non-greasy formulas. Skipping moisturizer entirely does not usually help.',
  combination: 'Use lighter textures on your T-zone and something richer on the drier areas.',
  sensitive:
    'Keep your routine simple, introduce one new product at a time and always patch test before regular use.',
};

export const CONCERN_TIPS: Record<string, string> = {
  hydration: 'Layer from thinnest to thickest: water-based products first, creams and oils last.',
  glow: 'Consistency beats intensity. Cleanse gently, moisturize and wear sunscreen every day.',
  softness: 'Soft skin comes from regular moisture, so apply your cream or oil every evening.',
  comfort: 'Keep it short and fragrance-free, and give new products a few weeks before judging them.',
};