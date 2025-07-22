import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Shield, Clock, Users, Target } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface BaselineIntegrationProps {
  boundaries?: any[]; // Current user boundaries
  relationships?: any[]; // User relationships with stats
  className?: string;
}

export default function BaselineIntegration({ 
  boundaries = [],
  relationships = [],
  className = "" 
}: BaselineIntegrationProps) {
  const [, setLocation] = useLocation();

  // Fetch real baseline data
  const { data: userBaseline, isLoading: baselineLoading } = useQuery({
    queryKey: ["/api/baseline"],
    retry: false,
  });

  // Analyze compatibility with boundaries if baseline exists
  const analyzeCompatibility = () => {
    if (!userBaseline || !boundaries.length) return null;

    const nonNegotiableCount = (userBaseline as any).nonNegotiableBoundaries?.length || 0;
    const flexibleCount = (userBaseline as any).flexibleBoundaries?.length || 0;
    const totalBoundaries = boundaries.length;
    
    // Calculate compatibility based on boundary alignment
    const alignedBoundaries = boundaries.filter(boundary => {
      const boundaryType = boundary.importance >= 8 ? 'non-negotiable' : 'flexible';
      return boundaryType === 'non-negotiable' ? 
        (userBaseline as any).nonNegotiableBoundaries?.some((nb: string) => 
          nb.toLowerCase().includes(boundary.category.toLowerCase()) ||
          boundary.title.toLowerCase().includes(nb.toLowerCase())
        ) : true;
    });

    return {
      compatibilityScore: Math.round((alignedBoundaries.length / totalBoundaries) * 100),
      alignedCount: alignedBoundaries.length,
      totalCount: totalBoundaries,
      nonNegotiableCount,
      flexibleCount
    };
  };

  const compatibility = analyzeCompatibility();

  const getBoundaryCompatibility = (boundaryTitle: string) => {
    if (!userBaseline) return { level: 'unknown', color: 'bg-gray-100 text-gray-600' };
    
    const title = boundaryTitle.toLowerCase();
    
    if ((userBaseline as any).nonNegotiableBoundaries?.some((b: string) => 
      title.includes(b.toLowerCase().split(' ')[0]) || title.includes(b.toLowerCase().split(' ')[1])
    )) {
      return { level: 'high', color: 'bg-green-100 text-green-800' };
    }
    
    if ((userBaseline as any).flexibleBoundaries?.some((b: string) => 
      title.includes(b.toLowerCase().split(' ')[0])
    )) {
      return { level: 'medium', color: 'bg-yellow-100 text-yellow-800' };
    }
    
    return { level: 'neutral', color: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Baseline Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Brain className="w-5 h-5" />
            Your Personal Baseline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {baselineLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="h-3 bg-blue-200 rounded w-1/2"></div>
            </div>
          ) : !userBaseline ? (
            <div className="text-center py-6">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-sm text-blue-700 mb-2">No baseline assessment found</p>
              <p className="text-xs text-blue-600">Get personalized boundary recommendations</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <div>
                    <p className="text-sm font-medium">Communication Style</p>
                    <p className="text-xs text-gray-600 capitalize">{(userBaseline as any).communicationStyle || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Space Needs</p>
                    <p className="text-xs text-gray-600 capitalize">{(userBaseline as any).personalSpaceNeeds || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Recovery Time</p>
                    <p className="text-xs text-gray-600">{(userBaseline as any).recoveryTimeNeeded || 0}h after interaction</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Social Energy</p>
                    <p className="text-xs text-gray-600 capitalize">{(userBaseline as any).socialEnergyLevel || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Conflict Style</p>
                    <p className="text-xs text-gray-600">{(userBaseline as any).conflictResolution?.replace('-', ' ') || 'Not set'}</p>
                  </div>
                </div>
              </div>
              
              {/* Show compatibility analysis if baseline exists */}
              {compatibility && (
                <div className="bg-blue-100 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Boundary Compatibility Analysis</h4>
                  <div className="text-xs text-blue-700">
                    <p>• {compatibility.alignedCount} of {compatibility.totalCount} boundaries align with your baseline</p>
                    <p>• Compatibility Score: {compatibility.compatibilityScore}%</p>
                    <p>• {compatibility.nonNegotiableCount} non-negotiable preferences tracked</p>
                  </div>
                </div>
              )}
            </>
          )}
          
          {!userBaseline && (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
              <div>
                <p className="text-sm font-medium text-blue-800">Complete Your Baseline Assessment</p>
                <p className="text-xs text-blue-600">Get personalized boundary recommendations</p>
              </div>
              <Button 
                size="sm" 
                onClick={() => setLocation('/baseline')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Take Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Baseline-Derived Boundaries */}
      {userBaseline && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="w-5 h-5" />
              Boundary-Baseline Alignment
            </CardTitle>
            <p className="text-sm text-green-700">
              Boundaries derived from your personal baseline assessment
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Non-negotiable boundaries */}
              {(userBaseline as any).nonNegotiableBoundaries && (userBaseline as any).nonNegotiableBoundaries.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Non-Negotiable Boundaries
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(userBaseline as any).nonNegotiableBoundaries.map((boundary: string, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{boundary}</p>
                            <Badge className="mt-1 bg-red-100 text-red-800 text-xs">Critical</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Flexible boundaries */}
              {(userBaseline as any).flexibleBoundaries && (userBaseline as any).flexibleBoundaries.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Flexible Boundaries
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(userBaseline as any).flexibleBoundaries.map((boundary: string, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{boundary}</p>
                            <Badge className="mt-1 bg-yellow-100 text-yellow-800 text-xs">Flexible</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Communication deal-breakers */}
              {(userBaseline as any).communicationDealBreakers && (userBaseline as any).communicationDealBreakers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    Communication Deal-Breakers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(userBaseline as any).communicationDealBreakers.map((boundary: string, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{boundary}</p>
                            <Badge className="mt-1 bg-red-100 text-red-800 text-xs">Deal-breaker</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(!(userBaseline as any).nonNegotiableBoundaries?.length && !(userBaseline as any).flexibleBoundaries?.length && !(userBaseline as any).communicationDealBreakers?.length) && (
                <div className="text-center py-6">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-sm text-green-700 mb-2">No baseline boundaries set</p>
                  <p className="text-xs text-green-600">Complete your baseline assessment to see boundaries here</p>
                  <Button 
                    size="sm" 
                    onClick={() => setLocation('/baseline')}
                    className="mt-3 bg-green-600 hover:bg-green-700"
                  >
                    Update Baseline
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}



      {/* Relationship Compatibility Analysis */}
      {userBaseline && relationships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-500" />
              Relationship Compatibility Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relationships.slice(0, 3).map((relationship: any) => {
                const stats = relationship.stats || {};
                const greenFlags = stats.greenFlags || 0;
                const redFlags = stats.redFlags || 0;
                const totalFlags = greenFlags + redFlags;
                const flagRatio = totalFlags > 0 ? Math.round((greenFlags / totalFlags) * 100) : 50;
                
                // Calculate basic compatibility based on flag ratio and safety rating
                let compatibilityScore = flagRatio;
                if (stats.averageSafetyRating) {
                  compatibilityScore = Math.round((flagRatio * 0.7) + (stats.averageSafetyRating * 10 * 0.3));
                }
                
                const getCompatibilityColor = (score: number) => {
                  if (score >= 80) return 'text-green-700 bg-green-50 border-green-200';
                  if (score >= 60) return 'text-blue-700 bg-blue-50 border-blue-200';
                  if (score >= 40) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
                  return 'text-red-700 bg-red-50 border-red-200';
                };
                
                return (
                  <div key={relationship.id} className={`p-4 rounded-lg border ${getCompatibilityColor(compatibilityScore)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{relationship.name}</h4>
                      <Badge className="bg-white">
                        {compatibilityScore}% Compatible
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-green-600 font-medium">{greenFlags}</span> Green Flags
                      </div>
                      <div>
                        <span className="text-red-600 font-medium">{redFlags}</span> Red Flags
                      </div>
                      <div>
                        Safety: <span className="font-medium">{stats.averageSafetyRating ? `${stats.averageSafetyRating}/5` : 'Not rated'}</span>
                      </div>
                      <div>
                        Check-ins: <span className="font-medium">{stats.checkInCount || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {relationships.length > 3 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  ... and {relationships.length - 3} more relationships
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
}