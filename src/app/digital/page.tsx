import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'Digital Services | Pharma Plus',
  description: 'Digital healthcare services from Pharma Plus',
};

export default function DigitalPage() {
  return (
    <InfoPage title="Digital Services">
      <div className="text-gray-600 space-y-4">
        <p>Explore our digital services for healthcare and wellness:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>AI pharmacist chat for medicine guidance</li>
          <li>Online prescription upload and verification</li>
          <li>Health tips and wellness articles</li>
          <li>Order tracking and notifications</li>
        </ul>
      </div>
    </InfoPage>
  );
}
