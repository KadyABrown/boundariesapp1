import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Shield, Target, Plus, ArrowRight } from 'lucide-react';

export default function DashboardPageClean() {
  // Check if user has completed baseline
  const { data: baseline, isLoading: baselineLoading } = useQuery({
    queryKey: ['/api/baseline/latest'],
    queryFn: async () => {
      const response = await fetch('/api/baseline/latest');
      if (!response.ok) return null;
      return response.json();
    }
  });

  // Get relationships count
  const { data: relationships = [], isLoading: relationshipsLoading } = useQuery({
    queryKey: ['/api/relationships'],
    queryFn: async () => {
      const response = await fetch('/api/relationships');
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Get boundary goals
  const { data: boundaryGoals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['/api/boundary-goals'],
    queryFn: async () => {
      const response = await fetch('/api/boundary-goals');
      if (!response.ok) return [];
      return response.json();
    }
  });

  if (baselineLoading || relationshipsLoading || goalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  const hasBaseline = !!baseline;
  const relationshipCount = relationships.length;
  const goalCount = boundaryGoals.length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to BoundarySpace - your relationship health tracking center.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Baseline Assessment</p>
                <p className="text-2xl font-bold">
                  {hasBaseline ? 'Complete' : 'Needed'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Relationships Tracked</p>
                <p className="text-2xl font-bold">{relationshipCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Boundary Goals</p>
                <p className="text-2xl font-bold">{goalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {!hasBaseline && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Get Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Complete your personal baseline assessment to start tracking relationship health and boundaries.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Your baseline assessment will help us:</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Understand your communication style and needs</li>
                  <li>• Identify your personal triggers and boundaries</li>
                  <li>• Calculate relationship compatibility scores</li>
                  <li>• Generate personalized boundary goals</li>
                </ul>
              </div>

              <Button size="lg" onClick={() => window.location.href = '/baseline'}>
                Start Baseline Assessment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Relationships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relationshipCount === 0 ? (
                <>
                  <p className="text-gray-600">
                    Start tracking a relationship to begin comprehensive interaction logging (CIT).
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/relationships'}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Relationship
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-gray-600">
                    You're tracking {relationshipCount} relationship{relationshipCount !== 1 ? 's' : ''}. Continue logging interactions for better insights.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/relationships'}>
                    View Relationships
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Boundary Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goalCount === 0 ? (
                <>
                  <p className="text-gray-600">
                    {hasBaseline 
                      ? "Your boundary goals will appear as you track relationships and interactions."
                      : "Complete your baseline assessment to automatically generate boundary goals."
                    }
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/boundaries'}>
                    View Boundaries
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-gray-600">
                    You have {goalCount} active boundary goal{goalCount !== 1 ? 's' : ''}. Track your respect rates and patterns.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/boundaries'}>
                    View Goals
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}