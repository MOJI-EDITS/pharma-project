import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'About Us | Pharma Plus',
  description: 'Learn about Pharma Plus and our mission',
};

export default function AboutPage() {
  return (
    <InfoPage title="About Pharma Plus">
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          Pharma Plus is a modern healthcare web platform dedicated to making medicines and
          pharmaceutical information easily accessible, reliable, and convenient for everyone.
        </p>
        <p>
          At Pharma Plus, we focus on quality, authenticity, and care. We ensure that all medicines
          listed on our platform come from verified sources and meet approved healthcare standards.
        </p>
        <p className="font-semibold text-gray-900">
          Pharma Plus — because your health deserves reliability, trust, and care.
        </p>
      </div>
    </InfoPage>
  );
}
