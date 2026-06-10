'use client';

import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  clearCart,
} from '@/store/cartSlice';
import CartItemRow from './CartItem';
import { formatPrice } from '@/lib/utils';
import { FiShoppingBag, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function CartPageContent() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <FiShoppingBag className="mx-auto text-3xl text-gray-300 mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Your cart is empty</h1>
        <p className="text-gray-500 text-sm mb-6">
          Browse our products and add items to your cart.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2b3a4e] hover:bg-[#1f2d3d] text-white rounded text-sm font-medium transition-colors"
        >
          <FiArrowLeft className="text-xs" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = total > 100 ? 0 : 9.99;
  const orderTotal = total + shipping;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded text-xs font-medium transition-colors cursor-pointer"
        >
          <FiTrash2 className="text-xs" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* cart items */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded p-5">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* order summary */}
        <div>
          <div className="bg-white border border-gray-100 rounded p-5 sticky top-20">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Free shipping over $100</p>
              )}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                <span className="font-medium text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <button className="w-full mt-5 py-2.5 bg-[#2b3a4e] hover:bg-[#1f2d3d] text-white rounded text-sm font-medium transition-colors cursor-pointer">
              Checkout
            </button>

            <Link
              href="/"
              className="block mt-3 text-center text-xs text-gray-500 hover:text-[#2b3a4e] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
