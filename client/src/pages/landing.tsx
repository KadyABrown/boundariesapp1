import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, TrendingUp, Users, CheckCircle, ArrowRight, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">BoundarySpace</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-indigo-600 font-medium">Home</a>
              <a href="/demo" className="text-gray-600 hover:text-gray-900">Demo</a>
              <a href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              {user ? (
                <a href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Dashboard
                </a>
              ) : (
                <div className="flex items-center space-x-4">
                  <a href="/api/login" className="text-gray-600 hover:text-gray-900">Log In</a>
                  <a href="/pricing" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Subscribe
                  </a>
                </div>
              )}
            </div>
            <div className="md:hidden">
              {user ? (
                <a href="/dashboard" className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm">
                  Dashboard
                </a>
              ) : (
                <a href="/api/login" className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm">
                  Log In
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Know Your Boundaries.
              <span className="text-indigo-600 block">Build Better Relationships.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track emotional patterns, set healthy boundaries, and gain insights into your relationships. 
              BoundarySpace helps you understand yourself and build stronger connections.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg w-full sm:w-auto"
                onClick={() => window.location.href = '/subscribe'}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-4 text-lg rounded-lg w-full sm:w-auto"
                onClick={() => window.location.href = '/demo'}
              >
                Try Demo
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center space-x-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600 ml-2">Trusted by 1,000+ users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Relationship Health
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed to help you understand patterns, set boundaries, and grow stronger relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Relationship Analytics</h3>
                <p className="text-gray-600">
                  Track health scores, behavioral flags, and emotional patterns to understand your relationship dynamics.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Boundary Management</h3>
                <p className="text-gray-600">
                  Set, track, and maintain healthy boundaries with guided tools and progress monitoring.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Tracking</h3>
                <p className="text-gray-600">
                  Monitor emotional check-ins, interaction patterns, and recovery times for deeper insights.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Emotional Intelligence</h3>
                <p className="text-gray-600">
                  Develop self-awareness through guided assessments and personalized baseline comparisons.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pattern Recognition</h3>
                <p className="text-gray-600">
                  Identify triggers, communication gaps, and recurring relationship patterns automatically.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy First</h3>
                <p className="text-gray-600">
                  Your relationship data is encrypted and private, with granular sharing controls for friends and therapists.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How BoundarySpace Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A simple, three-step process to start building healthier relationships today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Your Baseline</h3>
              <p className="text-gray-600">
                Take our comprehensive assessment to understand your communication style, emotional needs, and boundary preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Track Your Relationships</h3>
              <p className="text-gray-600">
                Create profiles for important relationships and log emotional check-ins, behavioral flags, and interactions.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gain Insights</h3>
              <p className="text-gray-600">
                Discover patterns, receive personalized recommendations, and build stronger, healthier relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 sm:px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
            Loved by Users Worldwide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex space-x-1 justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "BoundarySpace helped me recognize patterns I never saw before. My relationships have improved dramatically."
                </p>
                <div className="font-medium text-gray-900">Sarah M.</div>
                <div className="text-sm text-gray-500">Relationship Coach</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex space-x-1 justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The emotional check-ins and boundary tracking have been life-changing. Finally, a tool that gets it."
                </p>
                <div className="font-medium text-gray-900">Alex T.</div>
                <div className="text-sm text-gray-500">Therapist</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex space-x-1 justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "I love how it helps me understand my emotional patterns. The insights are incredibly valuable."
                </p>
                <div className="font-medium text-gray-900">Jamie L.</div>
                <div className="text-sm text-gray-500">Software Engineer</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Relationships?
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are building healthier, more fulfilling relationships with BoundarySpace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg w-full sm:w-auto"
              onClick={() => window.location.href = '/subscribe'}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg rounded-lg w-full sm:w-auto"
              onClick={() => window.location.href = '/demo'}
            >
              Try Demo First
            </Button>
          </div>
          <div className="mt-6 text-indigo-100">
            <p>7-day free trial • No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <Heart className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">BoundarySpace</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <a href="/demo" className="text-gray-300 hover:text-white">Demo</a>
              <a href="/faq" className="text-gray-300 hover:text-white">FAQ</a>
              <a href="/pricing" className="text-gray-300 hover:text-white">Pricing</a>
              <a href="mailto:support@boundaryspace.com" className="text-gray-300 hover:text-white">Support</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BoundarySpace. All rights reserved. Built with care for healthier relationships.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}