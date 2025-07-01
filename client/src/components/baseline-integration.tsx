import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Shield, Clock, Users, Target } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface BaselineIntegrationProps {
  boundaries?: any[]; // Current user boundaries
  className?: string;
}

export default function BaselineIntegration({ 
  boundaries = [],
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

    const nonNegotiableCount = userBaseline.nonNegotiableBoundaries?.length || 0;
    const flexibleCount = userBaseline.flexibleBoundaries?.length || 0;
    const totalBoundaries = boundaries.length;
    
    // Calculate compatibility based on boundary alignment
    const alignedBoundaries = boundaries.filter(boundary => {
      const boundaryType = boundary.importance >= 8 ? 'non-negotiable' : 'flexible';
      return boundaryType === 'non-negotiable' ? 
        userBaseline.nonNegotiableBoundaries?.some((nb: string) => 
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
    
    if (userBaseline.nonNegotiableBoundaries?.some((b: string) => 
      title.includes(b.toLowerCase().split(' ')[0]) || title.includes(b.toLowerCase().split(' ')[1])
    )) {
      return { level: 'high', color: 'bg-green-100 text-green-800' };
    }
    
    if (userBaseline.flexibleBoundaries?.some((b: string) => 
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
                    <p className="text-xs text-gray-600 capitalize">{userBaseline.communicationStyle || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Space Needs</p>
                    <p className="text-xs text-gray-600 capitalize">{userBaseline.personalSpaceNeeds || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Recovery Time</p>
                    <p className="text-xs text-gray-600">{userBaseline.recoveryTimeNeeded || 0}h after interaction</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Social Energy</p>
                    <p className="text-xs text-gray-600 capitalize">{userBaseline.socialEnergyLevel || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Conflict Style</p>
                    <p className="text-xs text-gray-600">{userBaseline.conflictResolution?.replace('-', ' ') || 'Not set'}</p>
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

      {/* Boundary Analysis */}
      {boundaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Boundary-Baseline Alignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {boundaries.slice(0, 5).map((boundary: any) => {
                const compatibility = getBoundaryCompatibility(boundary.title);
                return (
                  <div key={boundary.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{boundary.title}</h4>
                      <p className="text-sm text-gray-600">{boundary.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={compatibility.color}>
                        {compatibility.level} priority
                      </Badge>
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    </div>
                  </div>
                );
              })}
              
              {boundaries.length > 5 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  ... and {boundaries.length - 5} more boundaries
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Non-Negotiable vs Flexible Boundaries - Only show if baseline exists */}
      {userBaseline && (userBaseline.nonNegotiableBoundaries?.length > 0 || userBaseline.flexibleBoundaries?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {userBaseline.nonNegotiableBoundaries?.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700 text-sm">Non-Negotiable Boundaries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userBaseline.nonNegotiableBoundaries.map((boundary: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                      <span>{boundary}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {userBaseline.flexibleBoundaries?.length > 0 && (
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-700 text-sm">Flexible Boundaries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userBaseline.flexibleBoundaries.map((boundary: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                      <span>{boundary}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}