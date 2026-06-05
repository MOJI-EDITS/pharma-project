import Link from 'next/link';
import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'Affiliate Program | Pharma Plus',
  description: 'Earn commissions with the Pharma Plus affiliate program',
};

export default function AffiliatePage() {
  return (
    <InfoPage title="Pharma Plus Affiliate Program">
      <p className="text-gray-600 mb-4">
        Join our affiliate program and earn commissions by promoting Pharma Plus products on your
        website or social channels.
      </p>
      <Link href="/contact" className="text-[#2563eb] font-medium hover:underline">
        Apply for the affiliate program →
      </Link>
    </InfoPage>
  );
}
