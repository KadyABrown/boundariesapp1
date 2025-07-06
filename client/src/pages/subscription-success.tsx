import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function SubscriptionSuccessPage() {
  const [isChecking, setIsChecking] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get session ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (!sessionId) {
          setError('No session ID found');
          setIsChecking(false);
          return;
        }

        // Verify the payment and create user account
        const response = await apiRequest('POST', '/api/subscription/verify-session', {
          sessionId: sessionId
        });
        
        const result = await response.json();
        
        if (result.success) {
          setSubscriptionStatus({ status: 'active' });
          // Redirect to profile to complete setup after a brief delay
          setTimeout(() => {
            window.location.href = '/profile?onboarding=true';
          }, 3000);
        } else {
          setError(result.message || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Failed to verify payment');
      } finally {
        setIsChecking(false);
      }
    };

    verifyPayment();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Your Subscription
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = subscriptionStatus?.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">BoundarySpace</span>
            </div>
            <Button 
              onClick={() => window.location.href = "/dashboard"}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Success Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl">
            <CardHeader className="pb-4">
              {isActive ? (
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
              ) : (
                <Loader2 className="h-20 w-20 text-yellow-600 mx-auto mb-6 animate-spin" />
              )}
              <CardTitle className="text-3xl font-bold text-gray-900">
                {isActive ? "Welcome to BoundarySpace!" : "Payment Processing"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isActive ? (
                <>
                  <p className="text-xl text-gray-600 mb-8">
                    Your subscription is now active! Let's get your account set up.
                  </p>

                  <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      Ready to start? Here's what's next:
                    </h3>
                    <div className="text-left space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
                        <span className="text-blue-700">Complete your profile (name, username, preferences)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
                        <span className="text-blue-700">Take your personal baseline assessment</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
                        <span className="text-blue-700">Start tracking your first relationship</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                      What's included in your subscription:
                    </h3>
                    <div className="text-left space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-green-700">Comprehensive Interaction Tracking (CIT)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-green-700">Personal Baseline Assessment</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-green-700">Advanced Pattern Recognition</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-green-700">Real-time Health Scoring</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-green-700">Cross-relationship Analytics</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-green-700">Privacy-first Data Security</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      size="lg" 
                      className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3 w-full"
                      onClick={() => window.location.href = "/profile?onboarding=true"}
                    >
                      Complete Setup Now
                    </Button>
                    <p className="text-sm text-blue-600">
                      Taking you to your profile setup automatically in a few seconds...
                    </p>
                    <p className="text-sm text-gray-500">
                      You can update your name, username, and preferences anytime in settings.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xl text-gray-600 mb-8">
                    Your payment is being processed. This usually takes just a few moments.
                  </p>
                  
                  <div className="bg-yellow-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                      What happens next:
                    </h3>
                    <div className="text-left space-y-2 text-yellow-700">
                      <p>• Your payment will be confirmed within 1-2 minutes</p>
                      <p>• You'll receive email confirmation once active</p>
                      <p>• Full access will be granted automatically</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      variant="outline"
                      onClick={() => window.location.reload()}
                      className="w-full"
                    >
                      Check Status Again
                    </Button>
                    <p className="text-sm text-gray-500">
                      If you continue to see this message, please contact support.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold">BoundarySpace</span>
          </div>
          <p className="text-gray-400 mb-4">
            Transform your relationships through intelligent tracking and analysis
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/support" className="text-gray-400 hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}