import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";

interface PaywallProps {
  children: React.ReactNode;
  feature?: string;
}

export function Paywall({ children, feature = "this feature" }: PaywallProps) {
  const { user } = useAuth();
  
  // Check if user has active subscription
  // TEMP: Set to false so you can see the paywall demo
  const hasSubscription = false;
  // Normal: user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trial';
  
  if (hasSubscription) {
    return <>{children}</>;
  }
  
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
        <Button className="w-full" onClick={() => window.location.href = '/subscribe'}>
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
        <p className="text-sm text-gray-500">
          14-day free trial • Cancel anytime
        </p>
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