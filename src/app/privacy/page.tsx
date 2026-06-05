import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'Privacy Policy | Pharma Plus',
  description: 'How Pharma Plus handles your personal data',
};

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy">
      <div className="text-gray-600 space-y-4">
        <p>
          We value your privacy and are committed to protecting your personal information. We collect
          only the data needed to process orders, provide support, and improve our services.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>We do not sell your personal data to third parties.</li>
          <li>Payment details are processed securely through our payment partners.</li>
          <li>You may request deletion of your account data by contacting support.</li>
        </ul>
      </div>
    </InfoPage>
  );
}
