import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Shield, Clock, Users, Target } from "lucide-react";
import { useLocation } from "wouter";

interface BaselineIntegrationProps {
  userBaseline?: any; // Will be properly typed once the API is connected
  boundaries?: any[]; // Current user boundaries
  className?: string;
}

export default function BaselineIntegration({ 
  userBaseline, 
  boundaries = [],
  className = "" 
}: BaselineIntegrationProps) {
  const [, setLocation] = useLocation();

  // Mock baseline data for demonstration (will be replaced with real data)
  const mockBaseline = {
    communicationStyle: 'collaborative',
    conflictResolution: 'address-when-calm',
    personalSpaceNeeds: 'medium',
    emotionalSupport: 'medium',
    socialEnergyLevel: 'medium',
    recoveryTimeNeeded: 2,
    nonNegotiableBoundaries: [
      'Respect for personal time',
      'No yelling during conflicts',
      'Privacy of personal devices'
    ],
    flexibleBoundaries: [
      'Social plans frequency',
      'Response time expectations',
      'Physical affection levels'
    ],
    valueAlignment: [
      'Honesty and transparency',
      'Personal growth',
      'Family importance'
    ]
  };

  const displayBaseline = userBaseline || mockBaseline;

  const getBoundaryCompatibility = (boundaryTitle: string) => {
    // Simple compatibility check based on boundary title and baseline
    const title = boundaryTitle.toLowerCase();
    
    if (displayBaseline.nonNegotiableBoundaries.some((b: string) => 
      title.includes(b.toLowerCase().split(' ')[0]) || title.includes(b.toLowerCase().split(' ')[1])
    )) {
      return { level: 'high', color: 'bg-green-100 text-green-800' };
    }
    
    if (displayBaseline.flexibleBoundaries.some((b: string) => 
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <div>
                <p className="text-sm font-medium">Communication Style</p>
                <p className="text-xs text-gray-600 capitalize">{displayBaseline.communicationStyle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Space Needs</p>
                <p className="text-xs text-gray-600 capitalize">{displayBaseline.personalSpaceNeeds}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Recovery Time</p>
                <p className="text-xs text-gray-600">{displayBaseline.recoveryTimeNeeded}h after interaction</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Social Energy</p>
                <p className="text-xs text-gray-600 capitalize">{displayBaseline.socialEnergyLevel}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Conflict Style</p>
                <p className="text-xs text-gray-600">{displayBaseline.conflictResolution.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
          
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

      {/* Non-Negotiable vs Flexible Boundaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 text-sm">Non-Negotiable Boundaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {displayBaseline.nonNegotiableBoundaries.map((boundary: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span>{boundary}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-700 text-sm">Flexible Boundaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {displayBaseline.flexibleBoundaries.map((boundary: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                  <span>{boundary}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}