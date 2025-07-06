import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Heart, Shield, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Pricing() {
  const { user } = useAuth();

  const features = [
    "Unlimited relationship profiles",
    "Advanced behavioral flag system",
    "Emotional safety check-ins",
    "Personal baseline assessment",
    "Comprehensive interaction tracking",
    "Timeline visualization",
    "Friend circle privacy controls",
    "Trigger pattern analysis",
    "Boundary goal management",
    "Health score analytics",
    "Cross-relationship comparison",
    "Mobile-responsive design"
  ];

  const monthlyPrice = 12.99;
  const annualPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount

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
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/demo" className="text-gray-600 hover:text-gray-900">Demo</a>
              <a href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
              <a href="/pricing" className="text-indigo-600 font-medium">Pricing</a>
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
            {/* Mobile menu button */}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            One plan with everything you need to build healthier relationships
          </p>
          

        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <Card className="border-2 border-indigo-200 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                BoundarySpace Pro
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  $12.99
                </span>
                <span className="text-gray-600 ml-2">
                  /month
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              {user ? (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg"
                  onClick={() => window.location.href = '/subscribe'}
                >
                  Start Your Subscription
                </Button>
              ) : (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Get Started Now
                </Button>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  7-day free trial • Cancel anytime • No setup fees
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Secure & Private</h3>
              <p className="text-gray-600">Your relationship data is encrypted and never shared</p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingUp className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Evidence-Based</h3>
              <p className="text-gray-600">Built on relationship psychology research</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Compassionate Design</h3>
              <p className="text-gray-600">Supportive tools for personal growth</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use enterprise-grade encryption and never share your personal relationship data with third parties.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day free trial to ensure the app meets your needs before you subscribe. All subscriptions are final once the trial period ends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}