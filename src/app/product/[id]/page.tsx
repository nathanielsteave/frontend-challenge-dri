'use client';

import { use } from 'react';
import ProductDetail from '@/components/product/ProductDetail';

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="bg-white min-h-screen">
      <ProductDetail productId={parseInt(id, 10)} />
    </div>
  );
}
