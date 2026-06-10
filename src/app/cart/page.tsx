import CartPageContent from '@/components/cart/CartPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keranjang Belanja - Tjermin',
  description: 'Lihat dan kelola keranjang belanja kamu.',
};

export default function CartPage() {
  return (
    <div className="bg-white min-h-screen">
      <CartPageContent />
    </div>
  );
}
