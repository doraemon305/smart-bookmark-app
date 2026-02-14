import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Bookmark, ArrowRight, Zap, Shield, RefreshCw } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      setLocation('/dashboard');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Bookmark className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Smart Bookmarks</span>
          </div>
          <Button
            onClick={() => setLocation('/auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Save Your Favorite Links, Instantly
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Smart Bookmarks is the elegant way to organize and access your web links. Real-time synchronization across all your devices, private and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setLocation('/auth')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-3 px-8 rounded-lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-3xl opacity-20" />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-4">
                {[
                  { title: 'React Documentation', url: 'react.dev' },
                  { title: 'Next.js Guide', url: 'nextjs.org' },
                  { title: 'Tailwind CSS', url: 'tailwindcss.com' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage your bookmarks efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: RefreshCw,
                title: 'Real-time Sync',
                description: 'Your bookmarks sync instantly across all your devices and browser tabs',
              },
              {
                icon: Shield,
                title: 'Private & Secure',
                description: 'Your bookmarks are encrypted and only visible to you',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Instant access to your bookmarks with a beautiful, responsive interface',
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to organize your bookmarks?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Sign in with your Google account and start saving your favorite links today
          </p>
          <Button
            onClick={() => setLocation('/auth')}
            size="lg"
            className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-lg"
          >
            Sign In with Google
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-white">Smart Bookmarks</span>
            </div>
            <p className="text-sm">© 2026 Smart Bookmarks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
