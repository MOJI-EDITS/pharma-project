import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'How to Return | Pharma Plus',
  description: 'Return and refund policy for Pharma Plus orders',
};

export default function ReturnsPage() {
  return (
    <InfoPage title="How to Return">
      <div className="text-gray-600 space-y-4">
        <p>
          We want you to be completely satisfied with your purchase. If you need to return an item,
          please follow these steps:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Contact our customer service team within 7 days of delivery.</li>
          <li>Pack the item securely in its original packaging.</li>
          <li>Ship the item back to us using a trackable courier service.</li>
          <li>Once we receive and inspect the item, we will process your refund or exchange.</li>
        </ol>
      </div>
    </InfoPage>
  );
}
