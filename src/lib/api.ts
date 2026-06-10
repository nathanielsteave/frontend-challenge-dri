import { Product } from '@/types';

const BASE_URL = 'https://fakestoreapi.com';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error('Gagal memuat produk');
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error(`Produk ${id} tidak ditemukan`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) throw new Error('Gagal memuat kategori');
  return res.json();
}
