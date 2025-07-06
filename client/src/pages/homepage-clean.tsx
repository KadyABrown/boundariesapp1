import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Users, Shield, Heart, Target, CheckCircle } from 'lucide-react';

export default function HomepageClean() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">BoundarySpace</span>
            </div>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Understand Your Relationships Like Never Before
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            BoundarySpace helps you track relationship health, respect boundaries, and build stronger connections through intelligent data-driven insights.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" onClick={() => window.location.href = '/auth/login'}>
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="text-center">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personal Baseline Assessment</h3>
                <p className="text-gray-600">
                  Define your communication style, emotional needs, and boundaries to create a foundation for healthy relationships.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="text-center">
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comprehensive Interaction Tracking</h3>
                <p className="text-gray-600">
                  Log detailed interactions with energy, mood, and boundary tracking to understand relationship patterns.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="text-center">
                <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Boundary Health Analytics</h3>
                <p className="text-gray-600">
                  Track boundary violations, respect rates, and get insights on relationship health and compatibility.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How BoundarySpace Works</h2>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Complete Your Baseline Assessment</h3>
                <p className="text-gray-600">
                  Answer questions about your communication style, emotional needs, and personal boundaries to create your relationship foundation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track Your Relationships</h3>
                <p className="text-gray-600">
                  Add relationships and log interactions with detailed pre/post measurements of energy, anxiety, and emotional state.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Intelligent Insights</h3>
                <p className="text-gray-600">
                  Receive relationship health scores, boundary violation rates, and personalized recommendations for healthier connections.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose BoundarySpace?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Data-Driven Relationship Insights</h4>
                <p className="text-gray-600">Make informed decisions about your relationships based on real interaction data.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Personal Boundary Respect</h4>
                <p className="text-gray-600">Track how well your boundaries are respected across all relationships.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Pattern Recognition</h4>
                <p className="text-gray-600">Identify triggers, energy drains, and positive relationship patterns automatically.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Personalized Recommendations</h4>
                <p className="text-gray-600">Get specific guidance based on your unique baseline and relationship data.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Relationships?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users building healthier, more conscious relationships.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" onClick={() => window.location.href = '/auth/login'}>
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </div>
  );
}