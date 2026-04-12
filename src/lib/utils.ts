export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateRentalPrice(pricePerDay: number, days: number): number {
  let discount = 0
  if (days >= 28) discount = 0.4
  else if (days >= 7) discount = 0.15
  return pricePerDay * days * (1 - discount)
}

export function getDaysBetween(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Default tax rates (fallback if settings not loaded)
export const DEFAULT_CAR_TAX = 9.5
export const DEFAULT_VILLA_TAX = 14
