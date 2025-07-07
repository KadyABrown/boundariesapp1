import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Check, ArrowRight } from "lucide-react";

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-green-200 shadow-2xl">
        <CardHeader className="text-center py-12 bg-gradient-to-r from-green-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold mb-4">Payment Successful!</CardTitle>
          <p className="text-xl text-green-100">Welcome to BoundaryCore Premium</p>
        </CardHeader>
        <CardContent className="p-12 text-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your subscription is now active
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                You now have full access to all BoundaryCore features including relationship tracking, 
                pattern analysis, and personalized insights.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                What's Next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span>Create your account and log in to BoundaryCore</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span>Complete your personal baseline assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span>Start tracking your first relationship</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-lg px-12 py-4 w-full"
                onClick={() => window.location.href = "/api/login"}
              >
                Access Your Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-sm text-gray-500">
                You will receive a confirmation email shortly with your subscription details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}