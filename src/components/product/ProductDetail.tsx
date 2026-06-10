'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/utils';
import { FiChevronRight, FiChevronLeft, FiAlertCircle, FiHeart } from 'react-icons/fi';
import ProductCard from '@/components/catalog/ProductCard';

interface ProductDetailProps {
  productId: number;
}

const CATEGORY_MAP: Record<string, string> = {
  "men's clothing": 'Clothing',
  "women's clothing": 'Clothing',
  electronics: 'Electronics',
  jewelery: 'Accessories',
};

// tag kategori buat display di product detail
const CATEGORY_TAGS: Record<string, string[]> = {
  "men's clothing": ['Apparel', 'Bestseller'],
  "women's clothing": ['Apparel', 'Trending'],
  electronics: ['Electronics', 'New'],
  jewelery: ['Accessories', 'Premium'],
};

export default function ProductDetail({ productId }: ProductDetailProps) {
  const dispatch = useDispatch();
  const { data: product, isLoading, isError } = useProduct(productId);
  const { data: allProducts } = useProducts();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const totalImages = 4;

  const relatedProducts = allProducts
    ?.filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ ...product, quantity }));
    setIsAdded(true);
    toast.success('Added to cart!', {
      duration: 1500,
      style: {
        background: '#0b1329',
        color: '#fff',
        fontSize: '13px',
        borderRadius: '6px',
      },
    });
    setTimeout(() => setIsAdded(false), 1200);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // harga asli sebelum diskon (fake markup ~15%)
  const originalPrice = product ? Math.round(product.price * 1.15 * 100) / 100 : 0;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-3 w-48 bg-gray-100 rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg" />
              <div className="flex gap-3 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-24 h-24 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-100 rounded" />
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
              <div className="h-10 w-40 bg-gray-100 rounded mt-4" />
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-20 bg-gray-100 rounded-full" />
                <div className="h-8 w-24 bg-gray-100 rounded-full" />
              </div>
              <div className="h-12 w-full bg-gray-100 rounded-lg mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <FiAlertCircle className="mx-auto text-3xl text-red-400 mb-3" />
        <h2 className="text-lg font-medium text-gray-800 mb-1">Product not found</h2>
        <p className="text-gray-500 text-sm mb-4">
          The product you&apos;re looking for is not available.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2 bg-[#0b1329] text-white rounded-lg text-sm hover:bg-[#1a2340] transition-colors"
        >
          Back to Store
        </Link>
      </div>
    );
  }

  const tags = CATEGORY_TAGS[product.category] || ['General'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <FiChevronRight className="text-xs" />
        <Link href="/#catalog" className="hover:text-gray-600 transition-colors">
          {CATEGORY_MAP[product.category] || product.category}
        </Link>
        <FiChevronRight className="text-xs" />
        <span className="text-[#0b1329] font-semibold">{product.title.length > 30 ? product.title.slice(0, 30) + '...' : product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* image gallery */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden group">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8"
              priority
            />

            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#0b1329] hover:scale-105 transition-all cursor-pointer"
              aria-label="Previous image"
            >
              <FiChevronLeft className="text-lg" />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#0b1329] hover:scale-105 transition-all cursor-pointer"
              aria-label="Next image"
            >
              <FiChevronRight className="text-lg" />
            </button>

            {/* image counter */}
            <span className="absolute bottom-4 right-4 bg-[#0b1329]/70 text-white text-xs font-medium px-3 py-1 rounded-full">
              {activeImageIndex + 1} / {totalImages}
            </span>
          </div>

          {/* thumbnails */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: totalImages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`relative aspect-square border-2 rounded-lg cursor-pointer bg-gray-50 transition-all overflow-hidden ${
                  i === activeImageIndex ? 'border-[#0b1329]' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={product.image}
                  alt={`${product.title} view ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>

        {/* product info */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1329] leading-tight">
            {product.title}
          </h1>

          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {product.description}
          </p>

          {/* price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-[#0b1329]">
              {formatPrice(product.price)}
            </span>
            <span className="text-base text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          </div>

          {/* details line */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-[#0b1329] mb-1">Details</p>
            <p className="text-sm text-gray-500">
              {CATEGORY_MAP[product.category] || product.category} • Rating {product.rating.rate}/5 • {product.rating.count} reviews
            </p>
          </div>

          {/* category tags */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-[#0b1329] mb-2">Category</p>
            <div className="flex gap-2">
              {tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold ${
                    i === 0
                      ? 'border border-gray-300 text-gray-700'
                      : 'bg-[#0b1329] text-white'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* qty + wishlist row */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-lg font-medium transition-colors cursor-pointer"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-sm text-[#0b1329] font-semibold border-x border-gray-200 select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-lg font-medium transition-colors cursor-pointer"
              >
                +
              </button>
            </div>

            <button className="flex-1 h-10 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
              <FiHeart className="text-base" />
              Wishlist
            </button>
          </div>

          {/* add to cart */}
          <button
            onClick={handleAddToCart}
            className={`mt-4 w-full py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0b1329] text-white hover:bg-[#1a2340]'
            }`}
          >
            {isAdded ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>

          {/* specs table */}
          <div className="mt-6 space-y-0 border-t border-gray-100">
            <div className="flex justify-between py-2.5 text-sm border-b border-gray-100">
              <span className="text-gray-400">SKU:</span>
              <span className="text-[#0b1329] font-medium">BT-{String(product.id).padStart(3, '0')}</span>
            </div>
            <div className="flex justify-between py-2.5 text-sm border-b border-gray-100">
              <span className="text-gray-400">Material:</span>
              <span className="text-[#0b1329] font-medium">100% Organic Cotton</span>
            </div>
            <div className="flex justify-between py-2.5 text-sm border-b border-gray-100">
              <span className="text-gray-400">Stock:</span>
              <span className="text-[#0b1329] font-medium">In Stock ({product.rating.count})</span>
            </div>
          </div>

          {/* accordion */}
          <div className="mt-2 divide-y divide-gray-100">
            <div className="py-4">
              <button
                onClick={() => toggleSection('additional')}
                className="w-full flex justify-between items-center text-left text-sm font-semibold text-[#0b1329] cursor-pointer"
              >
                <span>Additional Info</span>
                <FiChevronRight className={`text-sm text-gray-400 transition-transform ${openSection === 'additional' ? 'rotate-90' : ''}`} />
              </button>
              {openSection === 'additional' && (
                <div className="mt-3 text-sm text-gray-500 leading-relaxed space-y-1">
                  <p>Category: {CATEGORY_MAP[product.category] || product.category}</p>
                  <p>Rating: {product.rating.rate} out of 5 ({product.rating.count} reviews)</p>
                  <p>Condition: New</p>
                  <p>Origin: Imported</p>
                </div>
              )}
            </div>

            <div className="py-4">
              <button
                onClick={() => toggleSection('details')}
                className="w-full flex justify-between items-center text-left text-sm font-semibold text-[#0b1329] cursor-pointer"
              >
                <span>Details</span>
                <FiChevronRight className={`text-sm text-gray-400 transition-transform ${openSection === 'details' ? 'rotate-90' : ''}`} />
              </button>
              {openSection === 'details' && (
                <div className="mt-3 text-sm text-gray-500 leading-relaxed">
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#0b1329]">
              You might also like
            </h2>
            <Link href="/#catalog" className="text-sm text-gray-500 hover:text-[#0b1329] transition-colors flex items-center gap-1">
              More Products <FiChevronRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rp, index) => (
              <ProductCard key={rp.id} product={rp} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
