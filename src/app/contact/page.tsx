import InfoPage from '@/components/layout/InfoPage';

export const metadata = {
  title: 'Contact Us | Pharma Plus',
  description: 'Get in touch with Pharma Plus customer support',
};

export default function ContactPage() {
  return (
    <InfoPage title="Contact Us" maxWidth="xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <span className="font-medium text-gray-900">Phone:</span> 0311 113 2529
            </p>
            <p>
              <span className="font-medium text-gray-900">Email:</span> help@pharmaplus.pk
            </p>
            <p>
              <span className="font-medium text-gray-900">Hours:</span> Mon–Sat, 9am–9pm PKT
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2563eb] text-white py-2 px-4 rounded-md hover:bg-[#1d4ed8]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </InfoPage>
  );
}
