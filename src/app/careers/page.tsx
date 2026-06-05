import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'Careers | Pharma Plus',
  description: 'Join the Pharma Plus team',
};

export default function CareersPage() {
  return (
    <InfoPage title="Join Pharma Plus">
      <p className="text-gray-600">
        We are always looking for talented individuals to join our team in pharmacy operations,
        logistics, technology, and customer support. Check back soon for open positions, or email
        careers@pharmaplus.pk with your CV.
      </p>
    </InfoPage>
  );
}
