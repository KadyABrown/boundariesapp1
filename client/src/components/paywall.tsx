import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StripeSubscriptionButton } from "@/components/stripe-subscription-button";
import { Lock, Crown, Heart, TrendingUp, Users, Shield } from "lucide-react";

interface PaywallProps {
  children: React.ReactNode;
  feature?: string;
  overlay?: boolean;
}

export function Paywall({ children, feature = "this feature", overlay = false }: PaywallProps) {
  const { user } = useAuth();
  
  // Check if user has active subscription
  // TEMP: Set to false so you can see the paywall demo
  const hasSubscription = false;
  // Normal: user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trial';
  
  if (hasSubscription) {
    return <>{children}</>;
  }

  // Full dashboard overlay mode
  if (overlay) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
        {/* Blurred background content */}
        <div className="blur-sm opacity-30 pointer-events-none">
          {children}
        </div>
        
        {/* Paywall overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl border-2 border-primary/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to BoundaryCore
              </CardTitle>
              <p className="text-lg text-gray-600">
                Your personal relationship health tracking platform
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Features grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Relationship Tracking</h3>
                    <p className="text-sm text-gray-600">Monitor relationship health with behavioral flags and emotional check-ins</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Personal Analytics</h3>
                    <p className="text-sm text-gray-600">Get insights into patterns, triggers, and relationship compatibility</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Boundary Management</h3>
                    <p className="text-sm text-gray-600">Set, track, and maintain healthy personal boundaries</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Friend Circle Privacy</h3>
                    <p className="text-sm text-gray-600">Share insights with trusted friends while maintaining privacy control</p>
                  </div>
                </div>
              </div>

              {/* Pricing info */}
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">$12.99/month</div>
                <p className="text-gray-600 mb-4">Everything you need for healthy relationships</p>
              </div>

              {/* CTA Button */}
              <StripeSubscriptionButton className="w-full py-4 text-lg font-semibold">
                <Crown className="w-5 h-5 mr-2" />
                Start Your Journey Today
              </StripeSubscriptionButton>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Secure payment powered by Stripe • Cancel anytime
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Small component paywall mode
  return (
    <Card className="border-2 border-yellow-200 bg-yellow-50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-yellow-600" />
        </div>
        <CardTitle className="text-lg">Premium Feature</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">
          {feature} is available with a BoundaryCore subscription.
        </p>
        <StripeSubscriptionButton className="w-full">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </StripeSubscriptionButton>
      </CardContent>
    </Card>
  );
}

// Simple wrapper for premium features
export function Premium({ children, feature }: { children: React.ReactNode; feature?: string }) {
  return (
    <Paywall feature={feature}>
      {children}
    </Paywall>
  );
}

// Full dashboard paywall
export function DashboardPaywall({ children }: { children: React.ReactNode }) {
  return (
    <Paywall overlay={true}>
      {children}
    </Paywall>
  );
}