'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Subscribed successfully!');
      setEmail('');
    }
  };

  return (
    <section className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-[#2b3a4e] text-2xl font-extrabold tracking-tight">
          Stay Updated
        </h3>
        <p className="mt-2 text-gray-500 text-xs sm:text-sm max-w-lg mx-auto font-medium">
          Subscribe to receive notifications about new inventory and special offers
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded text-gray-800 placeholder-gray-400 text-xs focus:outline-none focus:border-gray-300 font-medium"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#2b3a4e] hover:bg-[#1f2d3d] text-white rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
