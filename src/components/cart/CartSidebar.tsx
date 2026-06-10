'use client';

import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, selectCartCount, clearCart } from '@/store/cartSlice';
import CartItemRow from './CartItem';
import { formatPrice } from '@/lib/utils';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Cart {count > 0 && <span className="text-gray-400 font-normal">({count})</span>}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <FiX className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <FiShoppingBag className="text-2xl text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#2b3a4e] text-white rounded text-sm hover:bg-[#1f2d3d] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow key={item.id} item={item} compact />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-base font-bold text-gray-900">
                {formatPrice(total)}
              </span>
            </div>

            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full py-2.5 bg-[#2b3a4e] hover:bg-[#1f2d3d] text-white text-center rounded text-sm font-medium transition-colors"
            >
              View Full Cart
            </Link>

            <button
              onClick={() => dispatch(clearCart())}
              className="w-full py-2 text-red-500 hover:bg-red-50 text-center rounded text-xs font-medium transition-colors cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
