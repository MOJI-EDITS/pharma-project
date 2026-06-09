import Link from 'next/link';
import { Headphones, Mail, CreditCard, Truck, Zap, Shield, Clock, PackageCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 shadow-2xl border-t border-gray-200">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-bold mb-4 uppercase text-gray-900">Customer Care</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="text-gray-600 hover:text-purple-600">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-purple-600">Contact Us</Link></li>
                <li><Link href="/returns" className="text-gray-600 hover:text-purple-600">How to Return</Link></li>
                <li><Link href="/track-order" className="text-gray-600 hover:text-purple-600">Track Order</Link></li>
                <li><Link href="/warranty" className="text-gray-600 hover:text-purple-600">Warranty Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold mb-4 uppercase text-gray-900">Pharma Plus</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-600 hover:text-purple-600">About Pharma Plus</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-purple-600">Join Pharma Plus</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-purple-600">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-purple-600">Privacy Policy</Link></li>
                <li><Link href="/digital" className="text-gray-600 hover:text-purple-600">Digital Services</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold mb-4 uppercase text-gray-900">Make Money with Us</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sell" className="text-gray-600 hover:text-purple-600">Sell on Pharma Plus</Link></li>
                <li><Link href="/affiliate" className="text-gray-600 hover:text-purple-600">Pharma Plus Affiliate Program</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold mb-4 uppercase text-gray-900">Payment & Delivery</h3>
              
              {/* Payment Methods */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-gray-900 font-semibold">Payment Methods</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  JazzCash
                </div>
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  EasyPaisa
                </div>
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  COD
                </div>
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  Visa
                </div>
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  Mastercard
                </div>
              </div>
              </div>
              
              {/* Delivery Partners */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-gray-900 font-semibold">Delivery Partners</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  TCS
                </div>
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  Trax
                </div>
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  M&P
                </div>
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  BlueEx
                </div>
                <div className="w-20 h-9 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-semibold text-gray-800 shadow-sm">
                  Call Courier
                </div>
              </div>
              </div>
              
              {/* Why Choose Us */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PackageCheck className="w-4 h-4 text-purple-600" />
                  <p className="text-sm text-gray-900 font-semibold">Why Choose Us</p>
                </div>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    Same-Day Delivery in Major Cities
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    100% Authentic Medicines
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    Easy Returns & Refunds
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded flex items-center justify-center text-white font-black text-lg">P</div>
              <span className="text-lg font-bold text-gray-900">Pharma Plus</span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-700">
              <div className="flex items-center space-x-1">
                <Headphones className="w-4 h-4 text-purple-600" />
                <span>0311 113 2529</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4 text-purple-600" />
                <span>help@pharmaplus.pk</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mt-4 md:mt-0">© 2025 Pharma Plus. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
