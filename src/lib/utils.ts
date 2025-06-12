import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CardCategory } from '@/types';
import { CARD_COLORS } from '@/lib/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getCardCategoryColor(category?: CardCategory): string {
  if (category && CARD_COLORS[category]) {
    return CARD_COLORS[category];
  }
  return CARD_COLORS.Unknown;
}

export function getPrimaryCategory(categories: CardCategory[]): CardCategory {
  return categories.length > 0 ? categories[0] : 'Unknown';
}
