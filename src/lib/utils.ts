import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Цілі числа від start (або від 0, якщо end не задано) до end з кроком step —
 * для рендерингу фіксованих сіток.
 */
export const range = (start: number, end?: number, step = 1): number[] => {
  const output: number[] = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export function playersWord(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'гравців';
  if (mod10 === 1) return 'гравець';
  if (mod10 >= 2 && mod10 <= 4) return 'гравці';
  return 'гравців';
}
