import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";

export default function Boundaries() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Loading state
  if (isLoading) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-sm">B</span>
        </div>
        <p className="text-neutral-600">Loading your boundaries...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">My Boundaries</h1>
            <p className="text-neutral-600 mt-2">Define and manage your personal boundaries</p>
          </div>
          
          <Button disabled className="opacity-50 cursor-not-allowed">
            <Plus className="w-4 h-4 mr-2" />
            Add Boundary (Coming Soon)
          </Button>
        </div>

        {/* Under Construction Message */}
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Boundaries System Under Construction</h3>
            <p className="text-neutral-600 mb-4">
              We're building an automated boundary system that connects with your baseline assessment. This will help create meaningful boundaries based on your personal needs and values.
            </p>
            <p className="text-sm text-neutral-500">
              Complete your baseline assessment first to enable automatic boundary generation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}