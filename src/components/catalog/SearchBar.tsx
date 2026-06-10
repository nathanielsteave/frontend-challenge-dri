'use client';

import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xs">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:border-[#2b3a4e]/40 transition-colors"
        id="search-bar"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <FiX className="text-gray-400 text-xs" />
        </button>
      )}
    </div>
  );
}
