'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';
import { Toaster } from 'react-hot-toast';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Toaster position="bottom-right" />
    </>
  );
}
