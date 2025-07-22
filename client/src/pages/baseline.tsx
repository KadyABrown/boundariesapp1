import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import BaselineIntegration from "@/components/baseline-integration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target, Heart, MessageCircle, Shield } from "lucide-react";

export default function BaselinePage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Fetch relationships data for compatibility analysis
  const { data: relationships = [] } = useQuery({
    queryKey: ["/api/relationships"],
    enabled: isAuthenticated,
  });

  // Fetch relationship stats for each relationship to enhance compatibility analysis
  const { data: relationshipStats } = useQuery({
    queryKey: ["/api/relationships", "stats"],
    queryFn: async () => {
      if (!Array.isArray(relationships) || !relationships.length) return [];
      
      const statsPromises = relationships.map(async (rel: any) => {
        const response = await fetch(`/api/relationships/${rel.id}/stats`);
        if (!response.ok) return null;
        const stats = await response.json();
        return { ...rel, stats };
      });
      
      return Promise.all(statsPromises);
    },
    enabled: isAuthenticated && Array.isArray(relationships) && relationships.length > 0,
  });

  // Fetch current baseline
  const { data: currentBaseline } = useQuery({
    queryKey: ["/api/baseline"],
    enabled: isAuthenticated,
  });

  // Fetch baseline versions for historical tracking
  const { data: baselineVersions = [] } = useQuery({
    queryKey: ["/api/baseline/versions"],
    enabled: isAuthenticated,
  });

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



  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personal Baseline Assessment</h1>
              <p className="text-gray-600 mt-1">
                Define your communication style, emotional needs, and boundaries to get compatibility insights
              </p>
            </div>
          </div>

          {/* Why This Matters */}
          <Card className="border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Why Your Baseline Matters</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800">Communication</h4>
                    <p className="text-sm text-blue-700">Get compatibility scores based on your communication style</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800">Emotional Needs</h4>
                    <p className="text-sm text-blue-700">See how well relationships meet your emotional requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800">Boundaries</h4>
                    <p className="text-sm text-blue-700">Track boundary respect against your specific needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800">Compatibility</h4>
                    <p className="text-sm text-blue-700">Get personalized relationship health insights</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Baseline Summary */}
        <BaselineIntegration 
          boundaries={[]}
          relationships={Array.isArray(relationshipStats) ? relationshipStats : (Array.isArray(relationships) ? relationships : [])}
        />
      </div>
    </div>
  );
}