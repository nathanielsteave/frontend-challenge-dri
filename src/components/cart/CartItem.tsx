'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { CartItem } from '@/types';
import { removeFromCart, updateQuantity } from '@/store/cartSlice';
import { formatPrice } from '@/lib/utils';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

interface CartItemRowProps {
  item: CartItem;
  compact?: boolean;
}

export default function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const dispatch = useDispatch();

  return (
    <div className={`flex gap-3 ${compact ? 'py-3' : 'py-4'} border-b border-gray-100 last:border-0`}>
      <Link href={`/product/${item.id}`} className="shrink-0">
        <div className={`${compact ? 'w-14 h-14' : 'w-20 h-20'} bg-gray-50 border border-gray-100 rounded p-1.5`}>
          <div className="relative w-full h-full">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="72px"
              className="object-contain"
            />
          </div>
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${item.id}`}
          className="text-xs font-medium text-gray-700 hover:text-[#2b3a4e] transition-colors line-clamp-2"
        >
          {item.title}
        </Link>
        <p className="text-sm font-semibold text-gray-900 mt-1">
          {formatPrice(item.price)}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded">
            <button
              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <FiMinus className="text-xs" />
            </button>
            <span className="w-8 text-center text-xs font-medium text-gray-800 border-x border-gray-200">
              {item.quantity}
            </span>
            <button
              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <FiPlus className="text-xs" />
            </button>
          </div>

          <button
            onClick={() => dispatch(removeFromCart(item.id))}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Remove item"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
