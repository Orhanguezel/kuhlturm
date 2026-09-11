import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const API_BASE_URL = (typeof window === 'undefined' ? process.env.API_INTERNAL_URL : undefined) ?? process.env.NEXT_PUBLIC_API_URL ?? 'https://kuhlturm.com/api';
