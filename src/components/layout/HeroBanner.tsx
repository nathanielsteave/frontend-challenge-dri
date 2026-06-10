'use client';

import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="relative h-[280px] sm:h-[320px] md:h-[360px] flex items-center justify-center overflow-hidden bg-gray-900">
      <Image
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
        alt="Tjermin Boutique Interior"
        fill
        priority
        className="object-cover"
      />
      {/* overlay */}
      <div className="absolute inset-0 bg-[#2b3a4e]/75 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#2b3a4e]/30 via-[#2b3a4e]/60 to-[#2b3a4e]/90" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-sm">
          Tjermin Marketplace
        </h1>
        <p className="mt-3 text-white/80 text-sm sm:text-base max-w-lg mx-auto tracking-wide font-medium drop-shadow-sm">
          Find your perfect things from our premium selection.
        </p>
      </div>
    </section>
  );
}
