import Link from 'next/link';
import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'Help Center | Pharma Plus',
  description: 'Frequently asked questions and customer support',
};

export default function HelpPage() {
  return (
    <InfoPage title="Help Center">
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-[#2563eb] pl-4">
            <h3 className="font-medium text-gray-900">How do I place an order?</h3>
            <p className="text-gray-600 mt-2">
              Browse our products, add items to your cart, and proceed to checkout.
            </p>
          </div>
          <div className="border-l-4 border-[#2563eb] pl-4">
            <h3 className="font-medium text-gray-900">What payment methods do you accept?</h3>
            <p className="text-gray-600 mt-2">
              We accept JazzCash, EasyPaisa, COD, Visa, and Mastercard.
            </p>
          </div>
          <div className="border-l-4 border-[#2563eb] pl-4">
            <h3 className="font-medium text-gray-900">How do I return an item?</h3>
            <p className="text-gray-600 mt-2">
              See our <Link href="/returns" className="text-[#2563eb] hover:underline">returns guide</Link> or
              contact support at help@pharmaplus.pk.
            </p>
          </div>
        </div>
      </section>
    </InfoPage>
  );
}
