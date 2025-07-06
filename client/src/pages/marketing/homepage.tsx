import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, Heart, TrendingUp, Users, CheckCircle, ArrowRight, Menu } from "lucide-react";

export default function MarketingHomepage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">BoundarySpace</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="/pricing" className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</a>
              <a href="/demo" className="text-gray-600 hover:text-purple-600 transition-colors">Demo</a>
              <a href="/faq" className="text-gray-600 hover:text-purple-600 transition-colors">FAQ</a>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Get Started
              </Button>
            </div>
            
            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 mt-6">
                  <a 
                    href="/" 
                    className="text-lg font-medium transition-colors hover:text-purple-600 text-purple-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </a>
                  <a 
                    href="/pricing" 
                    className="text-lg font-medium transition-colors hover:text-purple-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Pricing
                  </a>
                  <a 
                    href="/demo" 
                    className="text-lg font-medium transition-colors hover:text-purple-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Demo
                  </a>
                  <a 
                    href="/faq" 
                    className="text-lg font-medium transition-colors hover:text-purple-600"
                    onClick={() => setIsOpen(false)}
                  >
                    FAQ
                  </a>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = "/api/login";
                    }}
                    className="bg-purple-600 hover:bg-purple-700 mt-4"
                  >
                    Get Started
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Know Your 
            <span className="text-purple-600">Boundaries</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track relationship patterns, understand your boundaries, and make data-driven decisions 
            about the people in your life. BoundarySpace helps you prioritize your emotional well-being.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
              onClick={() => window.location.href = "/api/login"}
            >
              Try BoundarySpace <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Relationship Health
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to understand, track, and improve your relationships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Personal Baseline Assessment</h3>
                <p className="text-gray-600">
                  Understand your communication style, emotional needs, and boundary requirements 
                  to create a personalized foundation for healthy relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Interaction Tracking</h3>
                <p className="text-gray-600">
                  Log detailed interactions with comprehensive before/after measurements to 
                  identify patterns and their impact on your well-being.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Relationship Analytics</h3>
                <p className="text-gray-600">
                  Get intelligent insights, health scores, and pattern analysis to make 
                  informed decisions about your relationships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-8">Why Choose BoundarySpace?</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-semibold mb-2">Data-Driven Insights</h4>
                <p className="text-purple-100">Make relationship decisions based on real patterns, not just emotions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-semibold mb-2">Privacy First</h4>
                <p className="text-purple-100">Your relationship data is completely private and secure.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-semibold mb-2">Easy to Use</h4>
                <p className="text-purple-100">Simple interface designed for daily use without overwhelming complexity.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-semibold mb-2">Comprehensive Tracking</h4>
                <p className="text-purple-100">Track everything from energy levels to boundary violations in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Relationships?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of people who are building healthier, more fulfilling relationships with BoundarySpace.
          </p>
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-lg px-12 py-4"
            onClick={() => window.location.href = "/api/login"}
          >
            Try Demo
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            $12.99/month subscription • Cancel anytime
          </p>
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
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
            © 2025 BoundarySpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}