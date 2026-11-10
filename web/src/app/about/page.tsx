'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import Sidebar from '@/components/dashboard/Sidebar';
import MenuButton from '@/components/dashboard/MenuButton';
import { Heart, Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MenuButton onClick={() => setSidebarOpen(true)} />
      <div className="min-h-screen bg-muted/50 pt-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-4">About Wamumbi</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Bringing hope and transforming lives of orphaned children through community-based initiatives
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-brand/10 rounded-lg">
                  <Target className="w-8 h-8 text-brand" />
                </div>
                <h2 className="text-2xl font-bold text-foreground ml-4">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To improve the lives of orphaned children and support their guardians through 
                community-based initiatives, ensuring every child has access to safe housing, 
                quality education, and healthcare services.
              </p>
            </div>

            <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-chart-4/15 rounded-lg">
                  <Heart className="w-8 h-8 text-chart-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground ml-4">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A world where every orphaned child has the opportunity to thrive, grow, and 
                reach their full potential in a supportive and nurturing environment.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-card rounded-xl shadow-sm p-8 border border-border mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="prose max-w-none text-muted-foreground">
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
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl shadow-sm p-6 border border-border text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-info/15 rounded-full">
                    <Heart className="w-8 h-8 text-info" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Compassion</h3>
                <p className="text-muted-foreground">
                  We approach every child with empathy, understanding, and unconditional love.
                </p>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-success/15 rounded-full">
                    <Users className="w-8 h-8 text-success" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Community</h3>
                <p className="text-muted-foreground">
                  We believe in the power of community and work collaboratively to create lasting change.
                </p>
              </div>

              <div className="bg-card rounded-xl shadow-sm p-6 border border-border text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-brand/10 rounded-full">
                    <Award className="w-8 h-8 text-brand" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in everything we do, ensuring the highest quality of care and support.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-brand rounded-xl shadow-lg p-12 text-center text-brand-foreground">
            <h2 className="text-3xl font-bold mb-4">Join Us in Making a Difference</h2>
            <p className="text-xl mb-8 opacity-90">
              Together, we can transform the lives of orphaned children and give them the future they deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/donate"
                className="bg-card text-brand hover:bg-accent font-bold py-3 px-8 rounded-full transition duration-300"
              >
                Donate Now
              </a>
              <a
                href="/volunteers"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full transition duration-300"
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
