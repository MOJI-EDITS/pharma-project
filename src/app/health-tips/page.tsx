import React from 'react';
import { Heart, Zap, Brain, Utensils, Droplet, Moon } from 'lucide-react';

interface HealthTip {
  id: number;
  title: string;
  description: string;
  content: string;
  icon: React.ReactNode;
  category: string;
  date: string;
}

export default function HealthTips() {
  const healthTips: HealthTip[] = [
    {
      id: 1,
      title: 'Stay Hydrated Daily',
      description: 'Water is essential for every function in your body',
      content: 'Drinking adequate water helps maintain body temperature, transports nutrients, removes waste, and cushions joints. Aim for at least 8-10 glasses (2-3 liters) of water daily. Increase intake during exercise or in hot weather.',
      icon: <Droplet className="w-8 h-8 text-blue-500" />,
      category: 'Hydration',
      date: 'June 5, 2024'
    },
    {
      id: 2,
      title: 'Get Regular Exercise',
      description: 'Physical activity boosts your overall health and mood',
      content: 'Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week. Include strength training 2-3 times weekly. Exercise reduces the risk of chronic diseases, improves mental health, and enhances sleep quality.',
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      category: 'Fitness',
      date: 'June 4, 2024'
    },
    {
      id: 3,
      title: 'Eat a Balanced Diet',
      description: 'Nutrition is the foundation of good health',
      content: 'Include fruits, vegetables, whole grains, lean proteins, and healthy fats in your daily meals. Limit processed foods, added sugars, and excessive sodium. A balanced diet provides essential nutrients, maintains healthy weight, and prevents chronic diseases.',
      icon: <Utensils className="w-8 h-8 text-green-500" />,
      category: 'Nutrition',
      date: 'June 3, 2024'
    },
    {
      id: 4,
      title: 'Prioritize Quality Sleep',
      description: 'Sleep is crucial for physical and mental restoration',
      content: 'Adults should aim for 7-9 hours of quality sleep per night. Maintain a consistent sleep schedule, create a dark and cool sleeping environment, and avoid screens 1 hour before bed. Good sleep boosts immunity, improves mood, and enhances cognitive function.',
      icon: <Moon className="w-8 h-8 text-indigo-500" />,
      category: 'Sleep',
      date: 'June 2, 2024'
    },
    {
      id: 5,
      title: 'Manage Stress Effectively',
      description: 'Chronic stress can impact your overall health',
      content: 'Practice relaxation techniques like meditation, deep breathing, or yoga. Take regular breaks from work, engage in hobbies you enjoy, and maintain strong social connections. Managing stress reduces blood pressure, improves digestion, and strengthens immunity.',
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      category: 'Mental Health',
      date: 'June 1, 2024'
    },
    {
      id: 6,
      title: 'Maintain Heart Health',
      description: 'Your heart is vital - take care of it',
      content: 'Keep your heart healthy by exercising regularly, eating a heart-healthy diet rich in omega-3 fatty acids, managing blood pressure and cholesterol levels, and avoiding smoking. Regular check-ups help monitor cardiovascular health and catch issues early.',
      icon: <Heart className="w-8 h-8 text-red-500" />,
      category: 'Cardiovascular',
      date: 'May 31, 2024'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Health Tips & Wellness Advice</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover expert health tips and lifestyle recommendations to help you live a healthier, happier life.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {healthTips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {tip.icon}
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {tip.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{tip.content}</p>
              <p className="text-xs text-gray-500">{tip.date}</p>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-3">Important Health Reminders</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3"></span>
              <span>Always consult with a healthcare professional before making significant health changes</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3"></span>
              <span>Keep up with regular health check-ups and screenings</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3"></span>
              <span>Maintain a record of your medications and health history</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3"></span>
              <span>Listen to your body and seek medical attention when needed</span>
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Health Products?</h3>
          <p className="text-gray-600 mb-6">Browse our wide range of health and wellness products</p>
          <a
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Shop Health Products
          </a>
        </div>
      </div>
    </div>
  );
}
