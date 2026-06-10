'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import { FiCheck } from 'react-icons/fi';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'large';
}

export default function AddToCartButton({ product, variant = 'default' }: AddToCartButtonProps) {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    setIsAdded(true);

    toast.success('Added to cart!', {
      duration: 1500,
      style: {
        background: '#2b3a4e',
        color: '#fff',
        fontSize: '13px',
        borderRadius: '4px',
      },
    });

    setTimeout(() => setIsAdded(false), 1200);
  };

  const isLarge = variant === 'large';

  return (
    <button
      onClick={handleAddToCart}
      className={`
        w-full font-medium transition-all duration-200 cursor-pointer rounded
        ${isLarge ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'}
        ${isAdded
          ? 'bg-emerald-600 text-white'
          : 'bg-[#2b3a4e] text-white hover:bg-[#1f2d3d]'
        }
      `}
    >
      {isAdded ? (
        <span className="flex items-center justify-center gap-1.5">
          <FiCheck className="text-sm" />
          Added!
        </span>
      ) : (
        'Add to Cart'
      )}
    </button>
  );
}
