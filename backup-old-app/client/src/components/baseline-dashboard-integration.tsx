import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Heart, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

interface BaselineDashboardIntegrationProps {
  className?: string;
}

export default function BaselineDashboardIntegration({ 
  className = "" 
}: BaselineDashboardIntegrationProps) {
  const [, setLocation] = useLocation();

  // Fetch baseline data
  const { data: baseline, isLoading: baselineLoading } = useQuery({
    queryKey: ["/api/baseline"],
    retry: false,
  });

  // Fetch relationships data
  const { data: relationships } = useQuery({
    queryKey: ["/api/relationships"],
    retry: false,
  });

  // Fetch boundaries data
  const { data: boundaries } = useQuery({
    queryKey: ["/api/boundaries"],
    retry: false,
  });

  if (baselineLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no baseline exists, prompt user to complete it
  if (!baseline) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Your Personal Baseline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Complete Your Baseline Assessment</h3>
            <p className="text-gray-600 mb-6">
              Your baseline assessment helps analyze relationships and automatically populates relevant boundaries.
            </p>
            <Button 
              onClick={() => setLocation('/baseline')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Start Baseline Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate data flow connections
  const baselineGeneratedBoundaries = boundaries?.filter((b: any) => 
    b.category === 'communication' || 
    b.category === 'personal-space' || 
    b.category === 'emotional-support' ||
    b.category === 'non-negotiable' ||
    b.category === 'emotional-safety'
  ) || [];

  const relationshipCompatibilityScores = relationships?.map((rel: any) => {
    // Calculate compatibility based on baseline
    const communicationMatch = baseline.communicationStyle ? 1 : 0;
    const boundaryRespect = baselineGeneratedBoundaries.length > 0 ? 0.8 : 0;
    const score = Math.round((communicationMatch + boundaryRespect) * 50);
    return { ...rel, compatibilityScore: score };
  }) || [];

  const highCompatibilityRelationships = relationshipCompatibilityScores.filter(r => r.compatibilityScore >= 70);
  const lowCompatibilityRelationships = relationshipCompatibilityScores.filter(r => r.compatibilityScore < 50);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Baseline Data Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Baseline Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Baseline Assessment Complete</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Communication Style:</span>
              <p className="font-medium capitalize">{baseline.communicationStyle?.replace('-', ' ') || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-600">Personal Space Needs:</span>
              <p className="font-medium capitalize">{baseline.personalSpaceNeeds || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-600">Emotional Support:</span>
              <p className="font-medium capitalize">{baseline.emotionalSupport || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-600">Conflict Resolution:</span>
              <p className="font-medium capitalize">{baseline.conflictResolution?.replace('-', ' ') || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Auto-Generated Boundaries */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Auto-Generated Boundaries ({baselineGeneratedBoundaries.length})
          </h4>
          {baselineGeneratedBoundaries.length > 0 ? (
            <div className="space-y-2">
              {baselineGeneratedBoundaries.slice(0, 3).map((boundary: any) => (
                <div key={boundary.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-green-800">{boundary.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {boundary.importance}/10
                  </Badge>
                </div>
              ))}
              {baselineGeneratedBoundaries.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLocation('/boundaries')}
                  className="text-green-600 hover:text-green-700"
                >
                  View all {baselineGeneratedBoundaries.length} boundaries →
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Complete your baseline assessment to auto-generate relevant boundaries.
            </p>
          )}
        </div>

        {/* Relationship Compatibility Analysis */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-purple-500" />
            Relationship Compatibility Analysis
          </h4>
          
          {relationships && relationships.length > 0 ? (
            <div className="space-y-3">
              {/* High Compatibility */}
              {highCompatibilityRelationships.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      High Baseline Compatibility ({highCompatibilityRelationships.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {highCompatibilityRelationships.slice(0, 2).map((rel: any) => (
                      <div key={rel.id} className="flex items-center justify-between">
                        <span className="text-sm text-green-700">{rel.name}</span>
                        <Badge className="bg-green-600 text-white text-xs">
                          {rel.compatibilityScore}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Compatibility Alert */}
              {lowCompatibilityRelationships.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      Needs Attention ({lowCompatibilityRelationships.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {lowCompatibilityRelationships.slice(0, 2).map((rel: any) => (
                      <div key={rel.id} className="flex items-center justify-between">
                        <span className="text-sm text-orange-700">{rel.name}</span>
                        <Badge variant="destructive" className="text-xs">
                          {rel.compatibilityScore}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-orange-600 mt-2">
                    Consider discussing your core needs and boundaries with these relationships.
                  </p>
                </div>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLocation('/relationships')}
                className="w-full mt-3"
              >
                View All Relationship Analysis →
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-3">
                Add relationships to see compatibility analysis based on your baseline.
              </p>
              <Button 
                size="sm" 
                onClick={() => setLocation('/relationships')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add First Relationship
              </Button>
            </div>
          )}
        </div>

        {/* Action Items */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Next Steps</h4>
          <div className="space-y-2">
            {relationships && relationships.length === 0 && (
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm text-blue-800">Add your first relationship profile</span>
                <Button size="sm" variant="ghost" onClick={() => setLocation('/relationships')}>
                  Add →
                </Button>
              </div>
            )}
            
            {relationships && relationships.length > 0 && (
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span className="text-sm text-purple-800">Track interactions to improve insights</span>
                <Button size="sm" variant="ghost" onClick={() => setLocation('/relationships')}>
                  Track →
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-green-800">View comprehensive insights dashboard</span>
              <Button size="sm" variant="ghost" onClick={() => setLocation('/insights')}>
                Insights →
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}