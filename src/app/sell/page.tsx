import Link from 'next/link';
import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'Sell on Pharma Plus | Pharma Plus',
  description: 'Become a seller on the Pharma Plus marketplace',
};

export default function SellPage() {
  return (
    <InfoPage title="Sell on Pharma Plus">
      <p className="text-gray-600 mb-4">
        Interested in selling your pharmacy or wellness products on Pharma Plus? We partner with
        licensed suppliers and verified sellers.
      </p>
      <Link href="/contact" className="text-[#2563eb] font-medium hover:underline">
        Contact us to get started →
      </Link>
    </InfoPage>
  );
}
