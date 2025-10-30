'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import Sidebar from '@/components/dashboard/Sidebar';
import MenuButton from '@/components/dashboard/MenuButton';
import { Heart, Smartphone, CreditCard } from 'lucide-react';

export default function DonatePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MenuButton onClick={() => setSidebarOpen(true)} />
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-rose-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Difference Today</h1>
            <p className="text-xl text-gray-600">
              Your generosity helps us provide hope and support to orphaned children
            </p>
          </div>

          {/* M-Pesa Payment Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-6">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Donate via M-Pesa</h2>
                <p className="text-gray-600">Quick and secure mobile payment</p>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Donate:</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                  <span>Go to M-Pesa on your phone</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                  <span>Select &ldquo;Lipa na M-Pesa&rdquo; then &ldquo;Buy Goods and Services&rdquo;</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                  <span>Enter Till Number: <strong className="text-green-700 text-xl">8392352</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
                  <span>Enter the amount you wish to donate</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
                  <span>Enter your M-Pesa PIN and confirm</span>
                </li>
              </ol>
            </div>

            <div className="text-center bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Business Name</p>
              <p className="text-2xl font-bold text-gray-900 mb-4">Wamumbi Blossoms</p>
              <div className="inline-block bg-white border-2 border-gray-200 rounded-lg px-8 py-4">
                <p className="text-sm text-gray-600 mb-1">M-Pesa Till Number</p>
                <p className="text-4xl font-bold text-green-600">8392352</p>
              </div>
            </div>
          </div>

          {/* Online Payment Coming Soon */}
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-start">
              <div className="bg-rose-100 rounded-lg p-3 mr-4">
                <CreditCard className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Online Payment Integration</h2>
                <p className="text-gray-700 mb-4">
                  We&apos;re working on bringing you more convenient payment options including credit cards, 
                  debit cards, and other online payment methods.
                </p>
                <div className="inline-block bg-white border border-rose-300 rounded-lg px-4 py-2">
                  <p className="text-rose-600 font-semibold">🚀 Coming Soon!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700">
              Thank you for your generosity! Your donation helps us provide education, healthcare, 
              and support to orphaned children in need.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              For any questions or receipt inquiries, please contact us at{' '}
              <a href="mailto:info@wamumbi.org" className="text-rose-600 hover:underline">
                info@wamumbi.org
              </a>
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}