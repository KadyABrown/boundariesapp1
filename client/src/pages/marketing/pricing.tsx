import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/"}>
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">BoundarySpace</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/"}
              >
                ← Back to Home
              </Button>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Header */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent 
            <span className="text-purple-600"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Start your relationship health journey today. No hidden fees, no complex tiers - just powerful tools to transform your relationships.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-2 border-purple-200 shadow-2xl">
            <CardHeader className="text-center py-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-4xl font-bold mb-4">BoundarySpace Premium</CardTitle>
              <div className="text-6xl font-bold mb-4">$12.99</div>
              <p className="text-xl text-purple-100">per month</p>
            </CardHeader>
            <CardContent className="p-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">Complete Personal Baseline Assessment</span>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">Unlimited Relationship Tracking</span>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">Comprehensive Interaction Logging</span>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">Advanced Pattern Recognition</span>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">Real-time Health Scoring</span>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">Cross-relationship Analytics</span>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">Privacy-first Data Security</span>
                </div>
                <div className="flex items-center gap-4">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span className="text-lg">Mobile-optimized Interface</span>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 text-lg px-12 py-4 w-full"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Start Your Free Assessment
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  No credit card required • No time limits • No hidden costs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Why is BoundarySpace Free?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                We believe everyone deserves access to tools that help build healthier relationships, 
                regardless of their financial situation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community First</h3>
              <p className="text-gray-600">
                BoundarySpace is supported by a community of users who value relationship health 
                and emotional well-being above profit.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sustainable Growth</h3>
              <p className="text-gray-600">
                We focus on creating value for our users first. Revenue models may be explored 
                in the future, but never at the expense of accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Common Questions</h2>
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Will BoundarySpace always be free?</h3>
              <p className="text-gray-600">
                Yes, the core features of BoundarySpace will always remain free. We may introduce 
                optional premium features in the future, but the essential relationship tracking 
                and analysis tools will never be behind a paywall.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Are there any usage limits?</h3>
              <p className="text-gray-600">
                No. You can track unlimited relationships, log unlimited interactions, and access 
                all analytics features without any restrictions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">How do you keep the service running?</h3>
              <p className="text-gray-600">
                BoundarySpace is currently funded by its creators who believe in making relationship 
                health tools accessible to everyone. We operate efficiently and focus on sustainable growth.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Can I support BoundarySpace?</h3>
              <p className="text-gray-600">
                The best way to support us is by using the platform, sharing it with others who 
                might benefit, and providing feedback to help us improve. Word-of-mouth is our 
                primary growth strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join the community of people transforming their relationships with data-driven insights.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-12 py-4"
            onClick={() => window.location.href = "/api/login"}
          >
            Begin Your Free Assessment
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold">BoundarySpace</span>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering healthier relationships through data-driven insights.
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/features" className="hover:text-white transition-colors">Features</a>
            <a href="/demo" className="hover:text-white transition-colors">Demo</a>
            <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
            © 2025 BoundarySpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}