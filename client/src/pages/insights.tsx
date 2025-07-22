import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import ActivityTimeline, { TimelineEvent } from "@/components/activity-timeline";
import EmotionalWeather from "@/components/emotional-weather";
import BoundaryBuddy from "@/components/boundary-buddy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calendar, BarChart3, Download, Activity } from "lucide-react";
import UnifiedWellnessAnalytics from "@/components/unified-wellness-analytics";
import InsightsActivitySummary from "@/components/insights-activity-summary";

export default function Insights() {
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

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: entries } = useQuery({
    queryKey: ["/api/boundary-entries", { limit: 100 }],
    retry: false,
  });

  const { data: relationships } = useQuery({
    queryKey: ["/api/relationships"],
    retry: false,
  });

  // Fetch stats for each relationship to get flag counts
  const relationshipStatsQueries = useQuery({
    queryKey: ["relationship-stats", relationships],
    queryFn: async () => {
      if (!Array.isArray(relationships) || relationships.length === 0) return [];
      
      const statsPromises = relationships.map((rel: any) =>
        fetch(`/api/relationships/${rel.id}/stats`)
          .then(res => res.json())
          .then(stats => ({ ...rel, ...stats }))
      );
      
      return Promise.all(statsPromises);
    },
    enabled: !!relationships && Array.isArray(relationships) && relationships.length > 0,
    retry: false,
  });

  // Transform relationships data to include both structures for component compatibility
  const transformedRelationships = useMemo(() => {
    const relationshipsWithStats = relationshipStatsQueries.data || [];
    if (!Array.isArray(relationshipsWithStats)) return [];
    
    return relationshipsWithStats.map((rel: any) => ({
      ...rel,
      greenFlags: rel.greenFlags || 0,
      redFlags: rel.redFlags || 0,
      flags: {
        green: rel.greenFlags || 0,
        red: rel.redFlags || 0
      },
      checkInCount: rel.checkInCount || 0,
      averageSafetyRating: rel.averageSafetyRating || 5
    }));
  }, [relationships]);

  const { data: userProfile } = useQuery({
    queryKey: ["/api/profile"],
    retry: false,
  });

  // Fetch all interactions across relationships
  const { data: allInteractions } = useQuery({
    queryKey: ["/api/interactions"],
    retry: false,
  });

  // Convert boundary entries and relationship data to timeline events
  const timelineEvents = useMemo((): TimelineEvent[] => {
    const events: TimelineEvent[] = [];
    
    // Add boundary entries as timeline events
    if (Array.isArray(entries)) {
      entries.forEach((entry: any) => {
        events.push({
          id: `boundary-${entry.id}`,
          type: 'boundary',
          date: new Date(entry.createdAt),
          title: `${entry.status === 'respected' ? 'Respected' : entry.status === 'violated' ? 'Violated' : 'Worked on'} ${entry.boundaryTitle}`,
          description: entry.notes || undefined,
          data: {
            boundaryType: entry.boundaryTitle,
            status: entry.status,
            emotionalRating: entry.emotionalRating
          }
        });
      });
    }
    
    // Add sample relationship milestone events
    if (Array.isArray(relationships)) {
      relationships.forEach((rel: any) => {
        const createdDate = new Date(rel.createdAt);
        events.push({
          id: `milestone-${rel.id}`,
          type: 'milestone',
          date: createdDate,
          title: `Started tracking relationship`,
          relationshipId: rel.id,
          relationshipName: rel.name,
          data: {
            milestoneType: 'relationship_start',
            achievement: `Began monitoring dynamics with ${rel.name}`
          }
        });
        
        // Add sample emotional check-ins if the relationship is older than a week
        const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated > 7) {
          const checkInDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          events.push({
            id: `checkin-${rel.id}-1`,
            type: 'checkin',
            date: checkInDate,
            title: 'Weekly emotional check-in',
            relationshipId: rel.id,
            relationshipName: rel.name,
            data: {
              safetyRating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
              emotionalTone: ['positive', 'neutral', 'concerned'][Math.floor(Math.random() * 3)]
            }
          });
        }
      });
    }
    
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [entries, relationships]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-sm">B</span>
        </div>
        <p className="text-neutral-600">Loading your insights...</p>
      </div>
    </div>;
  }

  // Calculate insights from entries
  const totalEntries = Array.isArray(entries) ? entries.length : 0;
  const respectedEntries = Array.isArray(entries) ? entries.filter((e: any) => e.status === 'respected').length : 0;
  const challengedEntries = Array.isArray(entries) ? entries.filter((e: any) => e.status === 'challenged').length : 0;
  const positiveEmotions = Array.isArray(entries) ? entries.filter((e: any) => ['positive', 'very-positive'].includes(e.emotionalImpact)).length : 0;
  
  const successRate = totalEntries > 0 ? Math.round((respectedEntries / totalEntries) * 100) : 0;
  const positivityRate = totalEntries > 0 ? Math.round((positiveEmotions / totalEntries) * 100) : 0;

  // Get category breakdown
  const categoryStats = Array.isArray(entries) ? entries.reduce((acc: any, entry: any) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {}) : {};

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Boundary Insights</h1>
            <p className="text-neutral-600 mt-2">Understand your boundary patterns and progress</p>
          </div>
          
          <Button variant="outline" onClick={() => window.location.href = '/api/export/csv'}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Activity Summary Banner */}
        <InsightsActivitySummary 
          onNavigateToRecommendations={() => {
            // Switch to analytics tab
            const analyticsTab = document.querySelector('[value="analytics"]') as HTMLElement;
            analyticsTab?.click();
          }}
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 py-2 md:px-4">
              <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 py-2 md:px-4">
              <Activity className="w-3 h-3 md:w-4 md:h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 py-2 md:px-4">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              Weather
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 py-2 md:px-4">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Boundary Buddy for Overview Tab */}
            <BoundaryBuddy 
              context="insights-overview"
              hasNewRecommendations={true}
              onNavigateToAnalytics={() => {
                const analyticsTab = document.querySelector('[value="analytics"]') as HTMLElement;
                analyticsTab?.click();
              }}
            />

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-neutral-800">{totalEntries}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-neutral-800">{successRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600">Positive Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold text-neutral-800">{positivityRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600">Weekly Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span className="text-2xl font-bold text-neutral-800">
                  {Math.round(totalEntries / 4) || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Boundary Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Boundary Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Respected</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${totalEntries > 0 ? (respectedEntries / totalEntries) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{respectedEntries}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-amber-700">Challenged</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full" 
                        style={{ width: `${totalEntries > 0 ? (challengedEntries / totalEntries) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{challengedEntries}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Communicated</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${totalEntries > 0 ? ((Array.isArray(entries) ? entries.filter((e: any) => e.status === 'communicated').length : 0) / totalEntries) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {Array.isArray(entries) ? entries.filter((e: any) => e.status === 'communicated').length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Boundary Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Most Active Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.length > 0 ? topCategories.map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700 capitalize">
                      {(category as string).replace('-', ' ')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${totalEntries > 0 ? ((count as number) / totalEntries) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{count as number}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-neutral-500 text-center py-8">
                    No boundary data yet. Start tracking to see insights!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emotional Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Emotional Impact Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['very-positive', 'positive', 'neutral', 'negative', 'very-negative'].map((impact) => {
                  const count = entries?.filter((e: any) => e.emotionalImpact === impact).length || 0;
                  const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
                  
                  const colors = {
                    'very-positive': 'bg-green-500',
                    'positive': 'bg-green-400',
                    'neutral': 'bg-neutral-400',
                    'negative': 'bg-amber-400',
                    'very-negative': 'bg-red-500',
                  };
                  
                  const labels = {
                    'very-positive': 'Very Positive',
                    'positive': 'Positive',
                    'neutral': 'Neutral',
                    'negative': 'Negative',
                    'very-negative': 'Very Negative',
                  };
                  
                  return (
                    <div key={impact} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-700">
                        {labels[impact as keyof typeof labels]}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-neutral-200 rounded-full h-2">
                          <div 
                            className={`${colors[impact as keyof typeof colors]} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {totalEntries === 0 ? (
                  <p className="text-sm text-neutral-500">
                    Start tracking your boundaries to unlock personalized insights!
                  </p>
                ) : (
                  <>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>Success Rate:</strong> You've respected {successRate}% of your boundaries. 
                        {successRate >= 80 ? " Excellent work!" : successRate >= 60 ? " Keep improving!" : " Consider reviewing your boundary strategies."}
                      </p>
                    </div>
                    
                    {topCategories.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Most Active:</strong> Your "{(topCategories[0][0] as string).replace('-', ' ')}" 
                          boundaries need the most attention with {topCategories[0][1]} entries.
                        </p>
                      </div>
                    )}
                    
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800">
                        <strong>Emotional Wellbeing:</strong> {positivityRate}% of your boundary experiences had a positive impact.
                        {positivityRate >= 70 ? " Great emotional awareness!" : " Consider focusing on supportive boundary practices."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Relationship Activity Timeline</h2>
              <BoundaryBuddy context="timeline" />
            </div>
            <ActivityTimeline events={timelineEvents} />
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <EmotionalWeather userProfile={userProfile} relationships={transformedRelationships} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <UnifiedWellnessAnalytics 
              interactions={allInteractions || []} 
              relationships={relationships || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
