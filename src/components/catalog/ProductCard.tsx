import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Rating from '@/components/ui/Rating';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  // truncate biar muat di card
  const shortDesc =
    product.description.length > 70
      ? product.description.slice(0, 70).trimEnd() + '.'
      : product.description;

  // mapping category display berdasarkan title
  const titleLower = product.title.toLowerCase();
  let displayCategory = "";
  if (titleLower.includes('tee') || titleLower.includes('shirt') || titleLower.includes('hoodie') || titleLower.includes('jacket') || titleLower.includes('raincoat') || titleLower.includes('jeans')) {
    displayCategory = "MEN'S & WOMEN'S FASHION";
  } else if (titleLower.includes('sneaker') || titleLower.includes('shoe') || titleLower.includes('boot')) {
    displayCategory = "SHOES & ACCESSORIES";
  } else if (titleLower.includes('tote') || titleLower.includes('bag') || titleLower.includes('backpack') || titleLower.includes('wallet')) {
    displayCategory = "BAGS & WALLETS";
  } else if (titleLower.includes('bike') || titleLower.includes('bicycle')) {
    displayCategory = "SPORTS & OUTDOOR";
  } else if (titleLower.includes('watch')) {
    displayCategory = "WATCHES";
  } else if (titleLower.includes('sandal') || titleLower.includes('slipper')) {
    displayCategory = "SHOES & SANDALS";
  } else if (titleLower.includes('sunglasses')) {
    displayCategory = "FASHION ACCESSORIES";
  } else {
    // Fallback
    if (product.category === "men's clothing" || product.category === "women's clothing") {
      displayCategory = "MEN'S & WOMEN'S FASHION";
    } else if (product.category === "jewelery") {
      displayCategory = "SHOES & ACCESSORIES";
    } else {
      displayCategory = "SPORTS & OUTDOOR";
    }
  }

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
        <div className="relative h-52 sm:h-56 bg-gray-100 overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-300"
            priority={index < 3}
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {index === 6 && (
              <span className="bg-[#d97706] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase shadow-sm">
                BEST DEAL
              </span>
            )}
            {(index === 2 || index === 6 || index === 8) && (
              <span className="bg-[#10b981] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase shadow-sm">
                PROMO
              </span>
            )}
            {index === 4 && (
              <span className="bg-[#2b3a4e] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase shadow-sm">
                PREMIUM
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="mb-2">
            <Rating rate={product.rating.rate} showCount={false} />
          </div>

          <h3 className="text-sm font-bold text-[#2b3a4e] leading-snug">
            {product.title.length > 40
              ? product.title.slice(0, 40).trimEnd() + '...'
              : product.title}
          </h3>

          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
            {displayCategory}
          </p>

          <p className="text-xs text-gray-500 mt-2 leading-relaxed flex-1">
            {shortDesc}
          </p>

          <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-50">
            <div>
              <span className="text-[10px] text-gray-400 block mb-0.5 font-medium">Starting at</span>
              <span className="text-sm sm:text-base font-extrabold text-[#2b3a4e]">
                {formatPrice(product.price)}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-[#2b3a4e] transition-colors flex items-center gap-0.5">
              View <span className="font-normal text-[10px]">&gt;</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
