'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import { Heart, Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">About Wamumbi</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bringing hope and transforming lives of orphaned children through community-based initiatives
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-rose-100 rounded-lg">
                  <Target className="w-8 h-8 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To improve the lives of orphaned children and support their guardians through 
                community-based initiatives, ensuring every child has access to safe housing, 
                quality education, and healthcare services.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">Our Vision</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                A world where every orphaned child has the opportunity to thrive, grow, and 
                reach their full potential in a supportive and nurturing environment.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Wamumbi Charity Foundation was established with a deep commitment to making a 
                lasting difference in the lives of orphaned children. Founded on the principles 
                of compassion, community, and empowerment, we recognized the urgent need to 
                provide comprehensive support to children who have lost their parents.
              </p>
              <p className="mb-4">
                Our journey began when a group of dedicated individuals came together, united 
                by a shared vision of creating a better future for vulnerable children. We 
                understood that addressing the needs of orphaned children required more than 
                just providing basic necessities—it required a holistic approach that encompasses 
                education, healthcare, emotional support, and community integration.
              </p>
              <p>
                Today, we work closely with local communities, guardians, and partners to ensure 
                that every child under our care has access to the resources and opportunities 
                they need to succeed. Through our various programs and initiatives, we continue 
                to expand our reach and deepen our impact.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Compassion</h3>
                <p className="text-gray-600">
                  We approach every child with empathy, understanding, and unconditional love.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
                <p className="text-gray-600">
                  We believe in the power of community and work collaboratively to create lasting change.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-rose-100 rounded-full">
                    <Award className="w-8 h-8 text-rose-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in everything we do, ensuring the highest quality of care and support.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl shadow-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Us in Making a Difference</h2>
            <p className="text-xl mb-8 opacity-90">
              Together, we can transform the lives of orphaned children and give them the future they deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/donate"
                className="bg-white text-rose-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition duration-300"
              >
                Donate Now
              </a>
              <a
                href="/volunteers"
                className="bg-rose-700 hover:bg-rose-800 text-white font-bold py-3 px-8 rounded-full transition duration-300"
              >
                Become a Volunteer
              </a>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
