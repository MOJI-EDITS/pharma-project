import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'Warranty Policy | Pharma Plus',
  description: 'Product warranty information for Pharma Plus',
};

export default function WarrantyPage() {
  return (
    <InfoPage title="Warranty Policy">
      <p className="text-gray-600">
        All our products come with a standard manufacturer warranty. Please check the product
        details page for specific warranty information. Medical devices and electronics may have
        extended warranty options — contact support for details.
      </p>
    </InfoPage>
  );
}
