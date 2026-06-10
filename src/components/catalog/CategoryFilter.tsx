import { FiFilter } from 'react-icons/fi';

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
}

const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Rp0 - Rp500.000', value: '0-500000' },
  { label: 'Rp500.000 - Rp1.000.000', value: '500000-1000000' },
  { label: 'Rp1.000.000 - Rp5.000.000', value: '1000000-5000000' },
  { label: 'Rp5.000.000 - Rp10.000.000', value: '5000000-10000000' },
  { label: 'Rp10.000.000 +', value: '10000000+' },
];

const CATEGORIES = [
  { label: 'All Categories', value: 'all' },
  { label: "Men's & Women's Fashion", value: 'fashion' },
  { label: 'Shoes & Accessories', value: 'accessories' },
  { label: 'Bags & Wallets', value: 'bags' },
  { label: 'Sports & Outdoor', value: 'sports' },
];

export default function CategoryFilter({
  selected,
  onSelect,
  priceRange,
  onPriceRangeChange,
}: CategoryFilterProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <FiFilter className="text-[#2b3a4e] text-sm" />
        <span className="text-sm font-semibold text-[#2b3a4e]">Filters</span>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-bold text-[#2b3a4e] uppercase tracking-widest mb-3">
          CATEGORY
        </h4>
        <ul className="space-y-1">
          {CATEGORIES.map((category) => {
            const isActive = selected === category.value;
            return (
              <li key={category.value} className={category.value === 'all' ? 'pb-1.5 mb-1.5 border-b border-gray-100' : ''}>
                <button
                  onClick={() => onSelect(category.value)}
                  className={`
                    w-full text-left py-1 text-sm transition-colors cursor-pointer
                    ${isActive
                      ? 'text-[#2b3a4e] font-semibold'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {category.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-bold text-[#2b3a4e] uppercase tracking-widest mb-3">
          PRICE RANGE
        </h4>
        <ul className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <li key={range.value}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={priceRange === range.value}
                  onChange={() => onPriceRangeChange(range.value)}
                  className="w-4 h-4 rounded border-gray-300 text-[#2b3a4e] focus:ring-[#2b3a4e]/20 cursor-pointer accent-[#2b3a4e]"
                />
                <span className={`text-sm ${priceRange === range.value ? 'text-[#2b3a4e] font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  {range.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
