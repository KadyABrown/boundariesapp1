import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Access Required",
        description: "Please log in to view your dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-600 mt-1">Your relationship insights will appear here</p>
          </div>
        </div>

        {/* Under Construction */}
        <Card>
          <CardContent className="p-12 text-center">
            <Construction className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-700 mb-2">Dashboard Under Development</h2>
            <p className="text-neutral-600 mb-6">
              We're building meaningful insights based on your baseline assessment and interaction tracking.
              Complete your baseline first to unlock personalized relationship analysis.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.href = '/baseline'}>
                Complete Baseline Assessment
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/relationships'}>
                Track Relationships
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}