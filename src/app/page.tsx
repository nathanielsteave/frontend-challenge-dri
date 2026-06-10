import HeroBanner from '@/components/layout/HeroBanner';
import ProductGrid from '@/components/catalog/ProductGrid';
import Newsletter from '@/components/layout/Newsletter';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <ProductGrid />
      <Newsletter />
    </>
  );
}
