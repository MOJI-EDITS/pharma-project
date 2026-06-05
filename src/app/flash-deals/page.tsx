import ProductGrid from '@/components/products/ProductGrid';
import InfoPage from '@/components/layout/InfoPage';
import { productsData } from '@/lib/data/products';

export const metadata = {
  title: 'Flash Deals | Pharma Plus',
  description: 'Limited-time deals on medicines and wellness products',
};

export default function FlashDealsPage() {
  const deals = productsData.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 24);

  return (
    <InfoPage title="Flash Deals" maxWidth="xl">
      <p className="text-gray-600 mb-6">Limited-time offers — grab them before they are gone.</p>
      {deals.length > 0 ? (
        <ProductGrid products={deals} variant="flash" />
      ) : (
        <p className="text-gray-600">No flash deals available right now. Check back soon!</p>
      )}
    </InfoPage>
  );
}
