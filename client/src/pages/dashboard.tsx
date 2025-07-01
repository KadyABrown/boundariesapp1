import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import BoundaryForm from "@/components/boundary-form";
import ActivityTimeline from "@/components/activity-timeline";
import WeeklyProgress from "@/components/weekly-progress";
import BoundaryBuddy from "@/components/boundary-buddy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Smile, Plus, BookOpen, TrendingUp, Heart, Users } from "lucide-react";

// Relationship summary component for dashboard
function RelationshipSummaryCard({ relationship }: { relationship: any }) {
  const { data: stats } = useQuery({
    queryKey: [`/api/relationships/${relationship.id}/stats`],
    retry: false,
  });

  const healthScore = stats ? stats.greenFlags - stats.redFlags : 0;
  
  const getHealthStatus = () => {
    if (healthScore >= 5) return { label: "Going Well", color: "text-green-600", bgColor: "bg-green-50" };
    if (healthScore >= 0) return { label: "Balanced", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (healthScore >= -3) return { label: "Mixed Signals", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { label: "Needs Attention", color: "text-orange-600", bgColor: "bg-orange-50" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div 
      className="p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => window.location.href = `/relationships/${relationship.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">{relationship.name}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${healthStatus.bgColor} ${healthStatus.color}`}>
          {healthStatus.label}
        </span>
      </div>
      
      {stats && (
        <div className="flex items-center gap-4 text-xs text-neutral-600">
          <span className="text-green-600">+{stats.greenFlags}</span>
          <span className="text-red-600">-{stats.redFlags}</span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {stats.checkInCount}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
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

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: boundaries } = useQuery({
    queryKey: ["/api/boundaries"],
    retry: false,
  });

  const { data: relationships } = useQuery({
    queryKey: ["/api/relationships"],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-sm">B</span>
        </div>
        <p className="text-neutral-600">Loading your boundary space...</p>
      </div>
    </div>;
  }

  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const activeBoundaries = boundaries?.filter((b: any) => b.isActive) || [];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Good morning!</h2>
                <p className="text-purple-100 mb-4">How are your boundaries feeling today?</p>
                <Button 
                  className="bg-white text-primary hover:bg-purple-50"
                  onClick={() => document.getElementById('boundary-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Track
                </Button>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Smile className="w-12 h-12 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>This Week's Overview</CardTitle>
                  <span className="text-sm text-neutral-500">{currentDate}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Boundaries Respected</p>
                        <p className="text-2xl font-bold text-green-700">
                          {statsLoading ? "..." : stats?.weeklyRespected || 0}
                        </p>
                        <p className="text-xs text-green-600">
                          of {stats?.weeklyTotal || 0} total entries
                        </p>
                      </div>
                      <CheckCircle className="text-green-500 w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-600 text-sm font-medium">Challenges</p>
                        <p className="text-2xl font-bold text-amber-700">
                          {statsLoading ? "..." : (stats?.weeklyTotal || 0) - (stats?.weeklyRespected || 0)}
                        </p>
                        <p className="text-xs text-amber-600">
                          boundary challenges
                        </p>
                      </div>
                      <AlertTriangle className="text-amber-500 w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Average Mood</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {statsLoading ? "..." : (stats?.averageMood?.toFixed(1) || "7.5")}
                        </p>
                        <p className="text-xs text-blue-600">
                          out of 10 scale
                        </p>
                      </div>
                      <Smile className="text-blue-500 w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => document.getElementById('boundary-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Boundary Experience
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <ActivityTimeline />

            {/* Boundary Tracker Form */}
            <div id="boundary-form">
              <BoundaryForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <WeeklyProgress />

            {/* Relationship Trends */}
            {relationships && Array.isArray(relationships) && relationships.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Relationship Trends
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = '/relationships'}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relationships.slice(0, 3).map((relationship: any) => (
                      <RelationshipSummaryCard key={relationship.id} relationship={relationship} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* My Boundaries */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Boundaries</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => window.location.href = '/boundaries'}>
                    Manage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeBoundaries.slice(0, 4).map((boundary: any) => (
                    <div key={boundary.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium text-neutral-800">{boundary.title}</span>
                      </div>
                      <span className="text-xs text-neutral-500">Active</span>
                    </div>
                  ))}
                  
                  {activeBoundaries.length === 0 && (
                    <div className="text-center py-6 text-neutral-500">
                      <p className="text-sm mb-2">No boundaries defined yet</p>
                      <Button variant="outline" size="sm" onClick={() => window.location.href = '/boundaries'}>
                        Create Your First Boundary
                      </Button>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-4" 
                  onClick={() => window.location.href = '/boundaries'}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Boundary
                </Button>
              </CardContent>
            </Card>

            {/* Reflection Corner */}
            <Card>
              <CardHeader>
                <CardTitle>Reflection Corner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200 mb-4">
                  <h4 className="font-medium text-neutral-800 mb-2">Today's Prompt</h4>
                  <p className="text-sm text-neutral-600 mb-3">
                    "What boundary felt most challenging to maintain today, and what can you learn from that experience?"
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Reflect on this →
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-between">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-neutral-400" />
                      Open Journal
                    </span>
                    <span>→</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between"
                    onClick={() => window.location.href = '/insights'}
                  >
                    <span className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-neutral-400" />
                      View Insights
                    </span>
                    <span>→</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Need Support?</h3>
              <p className="text-neutral-600 mb-4">Access resources and guidance for healthy boundary setting</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-secondary hover:bg-secondary/90">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Resources
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/api/export/csv'}>
                  <Plus className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Boundary Buddy */}
      <div className="fixed bottom-6 right-6 z-40">
        <BoundaryBuddy context="general" position="floating" />
      </div>
    </div>
  );
}
