import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Users, Target, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function SubscriptionSuccess() {
  useEffect(() => {
    // Add confetti or celebration effect here if desired
    console.log("Subscription successful!");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-800 dark:text-green-200">
            Welcome to BoundaryCore!
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Your subscription is now active! We've created your account - just log in to start building healthier relationships.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold mb-1">Track Relationships</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Monitor relationship health and patterns
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold mb-1">Set Boundaries</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Define and maintain personal boundaries
              </p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold mb-1">Get Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Analyze patterns and track progress
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">Next Steps:</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Complete your baseline assessment to personalize your experience
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Create your first relationship profile to start tracking
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Set up your personal boundaries and goals
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button className="w-full sm:w-auto" size="lg" onClick={() => window.location.href = '/api/login'}>
              Log In to Your Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Questions? Check out our <Link href="/faq" className="text-blue-600 hover:underline">FAQ</Link> or contact support.</p>
            <p className="mt-1">You can manage your subscription anytime in your account settings.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}