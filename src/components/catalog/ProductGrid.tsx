'use client';

import { useState, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';
import { FiAlertCircle, FiRefreshCw, FiFilter, FiX, FiList, FiChevronDown } from 'react-icons/fi';
import { BsGrid3X3GapFill } from 'react-icons/bs';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating';

export default function ProductGrid() {
  const { data: products, isLoading, isError, refetch } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = [...products];

    // category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'fashion') {
        filtered = filtered.filter((p) => p.category === "men's clothing" || p.category === "women's clothing");
      } else if (selectedCategory === 'accessories') {
        filtered = filtered.filter((p) => p.category === "jewelery");
      } else if (selectedCategory === 'sports') {
        filtered = filtered.filter((p) => p.category === "electronics");
      } else if (selectedCategory === 'bags') {
        filtered = filtered.filter((p) => 
          p.title.toLowerCase().includes('bag') || 
          p.title.toLowerCase().includes('tote') || 
          p.title.toLowerCase().includes('pack')
        );
      }
    }

    // search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // price range
    if (priceRange !== 'all') {
      if (priceRange === '500000+') {
        filtered = filtered.filter((p) => (p.price * 1000) >= 500000);
      } else {
        const [min, max] = priceRange.split('-').map(Number);
        filtered = filtered.filter((p) => {
          const idrPrice = p.price * 1000;
          return idrPrice >= min && idrPrice <= max;
        });
      }
    }

    // sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const headingTitle = {
    all: 'Sedan Vehicles',
    fashion: "Men's & Women's Fashion",
    accessories: 'Shoes & Accessories',
    bags: 'Bags & Wallets',
    sports: 'Sports & Outdoor',
  }[selectedCategory] || 'Sedan Vehicles';

  return (
    <section id="catalog" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* sidebar desktop */}
          <aside className="hidden lg:block w-52 shrink-0">
            <CategoryFilter
              selected={selectedCategory}
              onSelect={(cat) => {
                setSelectedCategory(cat);
                setVisibleCount(9); // Reset pagination on category change
              }}
              priceRange={priceRange}
              onPriceRangeChange={(range) => {
                setPriceRange(range);
                setVisibleCount(9); // Reset pagination on price change
              }}
            />
          </aside>

          {/* sidebar mobile */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebarOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg p-5 overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <FiFilter className="text-[#2b3a4e] text-sm" />
                    <span className="text-sm font-semibold text-[#2b3a4e]">Filters</span>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <FiX className="text-gray-500" />
                  </button>
                </div>
                <CategoryFilter
                  selected={selectedCategory}
                  onSelect={(cat) => {
                    setSelectedCategory(cat);
                    setVisibleCount(9);
                  }}
                  priceRange={priceRange}
                  onPriceRangeChange={(range) => {
                    setPriceRange(range);
                    setVisibleCount(9);
                  }}
                />
                <div className="mt-6">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                {/* mobile filter toggle */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  <FiFilter className="text-xs" />
                  Filters
                </button>

                <h2 className="text-lg font-bold text-[#2b3a4e] tracking-tight">
                  {headingTitle}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* search desktop */}
                <div className="hidden sm:block">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>

                {/* sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded text-xs text-gray-600 bg-white focus:outline-none focus:border-gray-300 cursor-pointer font-medium"
                  >
                    <option value="default">Sort by</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>

                {/* view toggles */}
                <div className="hidden sm:flex items-center border border-gray-200 rounded overflow-hidden">
                  <button className="p-2 bg-[#2b3a4e] text-white cursor-pointer" aria-label="Grid view">
                    <BsGrid3X3GapFill className="text-xs" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer" aria-label="List view">
                    <FiList className="text-xs" />
                  </button>
                </div>
              </div>
            </div>

            {/* mobile search */}
            <div className="sm:hidden mb-4">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* error */}
            {isError && (
              <div className="text-center py-16">
                <FiAlertCircle className="mx-auto text-3xl text-red-400 mb-3" />
                <h3 className="text-base font-medium text-gray-800 mb-1">Failed to load products</h3>
                <p className="text-gray-500 text-sm mb-4">Something went wrong. Please try again.</p>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2b3a4e] hover:bg-[#1f2d3d] text-white rounded text-sm cursor-pointer"
                >
                  <FiRefreshCw className="text-xs" /> Retry
                </button>
              </div>
            )}

            {/* loading */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            )}

            {/* products */}
            {!isLoading && !isError && (
              <>
                {displayedProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-sm">No products found.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                        setPriceRange('all');
                        setVisibleCount(9);
                      }}
                      className="mt-3 text-[#2b3a4e] hover:underline text-sm cursor-pointer font-medium"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {displayedProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                )}

                {/* load more */}
                {filteredProducts.length > visibleCount && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 9)}
                      className="px-6 py-2.5 border border-[#2b3a4e] text-[#2b3a4e] hover:bg-[#2b3a4e] hover:text-white transition-all rounded font-semibold text-xs tracking-wide cursor-pointer bg-white"
                    >
                      Show More Products
                    </button>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <p className="text-xs text-gray-400">
                    Showing {displayedProducts.length} of {filteredProducts.length} products
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
