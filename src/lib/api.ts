import { Product } from '@/types';

const BASE_URL = 'https://fakestoreapi.com';
const FETCH_TIMEOUT = 10000; // 10 detik

async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timeout: ${url} tidak merespons dalam ${timeoutMs / 1000} detik`);
    }
    throw error;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetchWithTimeout(`${BASE_URL}/products`);
  if (!res.ok) throw new Error('Gagal memuat produk');
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetchWithTimeout(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error(`Produk ${id} tidak ditemukan`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetchWithTimeout(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error('Gagal memuat kategori');
  return res.json();
}
