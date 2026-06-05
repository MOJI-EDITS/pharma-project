import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'Terms & Conditions | Pharma Plus',
  description: 'Terms and conditions for using Pharma Plus',
};

export default function TermsPage() {
  return (
    <InfoPage title="Terms & Conditions">
      <div className="text-gray-600 space-y-4">
        <p>By using the Pharma Plus website, you agree to the following terms:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>All medicines are sold in accordance with local pharmacy regulations.</li>
          <li>Prescription items require a valid prescription before dispatch.</li>
          <li>Prices and availability are subject to change without notice.</li>
          <li>Pharma Plus is not liable for misuse of products purchased through the platform.</li>
        </ul>
      </div>
    </InfoPage>
  );
}
