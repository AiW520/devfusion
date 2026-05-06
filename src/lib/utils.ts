import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeJsonParse<T = any>(input: string, defaultValue: T): T {
  try {
    const parsed = JSON.parse(input)
    return parsed as T
  } catch {
    return defaultValue
  }
}
