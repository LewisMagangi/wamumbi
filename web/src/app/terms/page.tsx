'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import Sidebar from '@/components/dashboard/Sidebar';
import MenuButton from '@/components/dashboard/MenuButton';

export default function TermsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MenuButton onClick={() => setSidebarOpen(true)} />
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
            <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Wamumbi. These Terms and Conditions govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Definitions</h2>
              <p className="text-gray-700 mb-4">
                <strong>&ldquo;Organization,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;</strong> and <strong>&ldquo;our&rdquo;</strong> refer to Wamumbi.<br />
                <strong>&ldquo;User,&rdquo; &ldquo;you,&rdquo;</strong> and <strong>&ldquo;your&rdquo;</strong> refer to individuals accessing or using our services.<br />
                <strong>&ldquo;Services&rdquo;</strong> refers to all features, content, and services provided through our website.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Use of Services</h2>
              <p className="text-gray-700 mb-4">
                You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To transmit any unsolicited or unauthorized advertising or promotional material</li>
                <li>To impersonate or attempt to impersonate the Organization or another user</li>
                <li>In any way that could disable, overburden, or impair the website</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Donations</h2>
              <p className="text-gray-700 mb-4">
                All donations made through our website are voluntary and non-refundable except as required by law. We reserve the right to refuse or return any donation at our discretion. Donors will receive acknowledgment of their donations for tax purposes where applicable.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Volunteer Services</h2>
              <p className="text-gray-700 mb-4">
                Volunteers must comply with all organization policies and procedures. We reserve the right to reject any volunteer application or terminate volunteer services at any time. Background checks may be required for certain volunteer positions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The website and its entire contents, features, and functionality are owned by Wamumbi and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must notify us immediately of any unauthorized use of your account.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your information.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                Our services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, secure, or error-free.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the fullest extent permitted by law, Wamumbi shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page with a new &ldquo;Last updated&rdquo; date. Your continued use of our services after such changes constitutes acceptance of the modified Terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <p className="text-gray-700">
                  <strong>Wamumbi</strong><br />
                  Email: legal@wamumbi.org<br />
                  Phone: +254 123 456 789<br />
                  Address: Nairobi, Kenya
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
