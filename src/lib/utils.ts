// fakestoreapi returns USD, convert ke IDR (kurs $1 = Rp17.900)
export function formatPrice(price: number): string {
  const idr = Math.round(price * 17900);
  return `Rp${new Intl.NumberFormat('id-ID').format(idr)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
