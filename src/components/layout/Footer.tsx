import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P+</span>
              </div>
              <span className="text-xl font-bold">PharmaPlus</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted partner in healthcare. We provide premium pharmaceutical products 
              and healthcare solutions with fast delivery and expert support.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@pharmaplus.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>123 Healthcare St, Medical City</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products" className="hover:text-blue-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-blue-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/prescriptions" className="hover:text-blue-400 transition-colors">
                  Prescriptions
                </Link>
              </li>
              <li>
                <Link href="/health-tips" className="hover:text-blue-400 transition-colors">
                  Health Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/category/pain-relief" className="hover:text-blue-400 transition-colors">
                  Pain Relief
                </Link>
              </li>
              <li>
                <Link href="/category/cold-flu" className="hover:text-blue-400 transition-colors">
                  Cold & Flu
                </Link>
              </li>
              <li>
                <Link href="/category/allergy" className="hover:text-blue-400 transition-colors">
                  Allergy
                </Link>
              </li>
              <li>
                <Link href="/category/digestive" className="hover:text-blue-400 transition-colors">
                  Digestive Health
                </Link>
              </li>
              <li>
                <Link href="/category/vitamins" className="hover:text-blue-400 transition-colors">
                  Vitamins & Supplements
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 PharmaPlus. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}