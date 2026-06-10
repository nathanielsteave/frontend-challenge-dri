'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectCartCount } from '@/store/cartSlice';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiSearch } from 'react-icons/fi';

interface NavbarProps {
  onCartOpen: () => void;
}

export default function Navbar({ onCartOpen }: NavbarProps) {
  const cartCount = useSelector(selectCartCount);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPromoBar, setShowPromoBar] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* promo bar */}
      {showPromoBar && (
        <div className="bg-[#f8f9fa] border-b border-gray-100 py-2 px-4 relative flex items-center justify-center text-center">
          <button
            onClick={() => setShowPromoBar(false)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label="Close promotion"
          >
            <FiX className="text-xs" />
          </button>
          <p className="text-[10px] sm:text-xs text-gray-600 tracking-tight font-medium">
            <span className="font-semibold text-gray-800">Premium Selection</span> — Certified Pre-Owned Vehicles <span className="underline cursor-pointer ml-1 font-semibold text-gray-800">Browse Inventory &gt;</span>
          </p>
        </div>
      )}

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-[#2b3a4e] text-xl font-black tracking-wider hover:opacity-90 transition-opacity">
            TJERMIN
          </Link>

          {/* nav links desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-500 hover:text-[#2b3a4e] text-xs font-semibold tracking-wide transition-colors">
              Home
            </Link>
            <Link href="/#catalog" className="text-gray-500 hover:text-[#2b3a4e] text-xs font-semibold tracking-wide transition-colors">
              Inventory
            </Link>
            <Link href="/" className="text-gray-500 hover:text-[#2b3a4e] text-xs font-semibold tracking-wide transition-colors">
              About
            </Link>
            <Link href="/" className="text-gray-500 hover:text-[#2b3a4e] text-xs font-semibold tracking-wide transition-colors">
              Contact
            </Link>
          </div>

          {/* icons */}
          <div className="hidden md:flex items-center gap-5">
            <button
              className="text-gray-500 hover:text-[#2b3a4e] transition-colors cursor-pointer p-1"
              aria-label="Search"
            >
              <FiSearch className="text-lg" />
            </button>
            <button
              className="text-gray-500 hover:text-[#2b3a4e] transition-colors cursor-pointer p-1"
              aria-label="Account"
            >
              <FiUser className="text-lg" />
            </button>
            <button
              onClick={onCartOpen}
              className="relative text-gray-500 hover:text-[#2b3a4e] transition-colors cursor-pointer p-1"
              aria-label="Open cart"
              id="cart-button"
            >
              <FiShoppingCart className="text-lg" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#2b3a4e] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* mobile icons */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              className="text-gray-500 hover:text-[#2b3a4e] transition-colors cursor-pointer p-1"
              aria-label="Search"
            >
              <FiSearch className="text-lg" />
            </button>
            <button
              onClick={onCartOpen}
              className="relative text-gray-500 hover:text-[#2b3a4e] transition-colors cursor-pointer p-1"
              aria-label="Open cart"
            >
              <FiShoppingCart className="text-lg" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#2b3a4e] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            <button
              className="text-gray-500 hover:text-[#2b3a4e] transition-colors cursor-pointer p-1"
              aria-label="Account"
            >
              <FiUser className="text-lg" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-[#2b3a4e] cursor-pointer p-1"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 bg-white">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 hover:text-[#2b3a4e] text-xs font-semibold tracking-wide">
              Home
            </Link>
            <Link href="/#catalog" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 hover:text-[#2b3a4e] text-xs font-semibold tracking-wide">
              Inventory
            </Link>
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 hover:text-[#2b3a4e] text-xs font-semibold tracking-wide">
              About
            </Link>
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 hover:text-[#2b3a4e] text-xs font-semibold tracking-wide">
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
