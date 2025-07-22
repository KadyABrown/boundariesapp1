import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  Shield, 
  MessageCircle,
  Clock,
  Target,
  Star,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap
} from "lucide-react";

interface RelationshipMetrics {
  id: number;
  name: string;
  relationshipType: string;
  
  // Health Metrics
  overallHealthScore: number;
  energyImpact: number; // Average energy change per interaction
  boundaryRespectRate: number; // % of times boundaries are respected
  communicationQuality: number; // Based on positive vs negative communication events
  emotionalSafety: number; // Based on anxiety/self-worth impacts
  recoveryTime: number; // Average time to recover from interactions
  
  // Interaction Data
  totalInteractions: number;
  positiveInteractions: number;
  negativeInteractions: number;
  lastInteractionDate: string;
  
  // Growth Indicators
  improvementTrend: 'improving' | 'stable' | 'declining';
  boundaryGrowth: number; // How much they've improved at respecting boundaries
  personalGrowthContribution: number; // How much this relationship helps your growth
  
  // Warning Indicators
  redFlags: number;
  greenFlags: number;
  triggerFrequency: number; // How often they trigger your identified triggers
  supportLevel: number; // How supportive they are during difficult times
}

interface CrossRelationshipComparisonProps {
  relationships: RelationshipMetrics[];
  userBaseline?: any;
  timeframe?: 'month' | 'quarter' | 'year';
}

export default function CrossRelationshipComparison({
  relationships,
  userBaseline,
  timeframe = 'quarter'
}: CrossRelationshipComparisonProps) {

  // Calculate comparative metrics
  const comparisonMetrics = useMemo(() => {
    if (relationships.length === 0) return null;

    const healthiest = relationships.reduce((best, current) => 
      current.overallHealthScore > best.overallHealthScore ? current : best
    );
    
    const mostProblematic = relationships.reduce((worst, current) => 
      current.overallHealthScore < worst.overallHealthScore ? current : worst
    );
    
    const mostEnergizing = relationships.reduce((best, current) => 
      current.energyImpact > best.energyImpact ? current : best
    );
    
    const mostDraining = relationships.reduce((worst, current) => 
      current.energyImpact < worst.energyImpact ? current : worst
    );

    const avgHealthScore = relationships.reduce((sum, r) => sum + r.overallHealthScore, 0) / relationships.length;
    const avgEnergyImpact = relationships.reduce((sum, r) => sum + r.energyImpact, 0) / relationships.length;
    const avgBoundaryRespect = relationships.reduce((sum, r) => sum + r.boundaryRespectRate, 0) / relationships.length;

    return {
      healthiest,
      mostProblematic,
      mostEnergizing,
      mostDraining,
      avgHealthScore,
      avgEnergyImpact,
      avgBoundaryRespect,
      totalRelationships: relationships.length,
      healthyRelationships: relationships.filter(r => r.overallHealthScore >= 70).length,
      concerningRelationships: relationships.filter(r => r.overallHealthScore < 40).length
    };
  }, [relationships]);

  // Prepare data for relationship comparison chart
  const comparisonChartData = useMemo(() => {
    return relationships.map(relationship => ({
      name: relationship.name.length > 10 ? relationship.name.substring(0, 10) + '...' : relationship.name,
      fullName: relationship.name,
      health: relationship.overallHealthScore,
      energy: ((relationship.energyImpact + 5) / 10) * 100, // Normalize to 0-100
      boundaries: relationship.boundaryRespectRate,
      communication: relationship.communicationQuality,
      safety: relationship.emotionalSafety,
      type: relationship.relationshipType
    }));
  }, [relationships]);

  // Radar chart data for relationship patterns
  const radarData = useMemo(() => {
    const categories = ['Health', 'Energy', 'Boundaries', 'Communication', 'Safety', 'Support'];
    
    return relationships.slice(0, 3).map(relationship => ({
      name: relationship.name,
      Health: relationship.overallHealthScore,
      Energy: ((relationship.energyImpact + 5) / 10) * 100,
      Boundaries: relationship.boundaryRespectRate,
      Communication: relationship.communicationQuality,
      Safety: relationship.emotionalSafety,
      Support: relationship.supportLevel
    }));
  }, [relationships]);

  // Personal growth tracking
  const growthMetrics = useMemo(() => {
    const growthContributors = relationships.filter(r => r.personalGrowthContribution > 60);
    const improvingRelationships = relationships.filter(r => r.improvementTrend === 'improving');
    const decliningRelationships = relationships.filter(r => r.improvementTrend === 'declining');
    
    const boundaryGrowthAvg = relationships.reduce((sum, r) => sum + r.boundaryGrowth, 0) / relationships.length;

    return {
      growthContributors,
      improvingRelationships,
      decliningRelationships,
      boundaryGrowthAvg,
      totalGrowthScore: (boundaryGrowthAvg + (improvingRelationships.length / relationships.length) * 100) / 2
    };
  }, [relationships]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRelationshipTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'romantic': return '#ec4899';
      case 'family': return '#3b82f6';
      case 'friend': return '#10b981';
      case 'work': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (!comparisonMetrics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No relationship data for comparison</h3>
          <p className="text-gray-600">Track interactions with multiple people to see comparative analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{comparisonMetrics.totalRelationships}</div>
            <div className="text-sm text-gray-600">Total Relationships</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{comparisonMetrics.healthyRelationships}</div>
            <div className="text-sm text-gray-600">Healthy (70+)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{comparisonMetrics.concerningRelationships}</div>
            <div className="text-sm text-gray-600">Concerning (&lt;40)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(comparisonMetrics.avgHealthScore)}
            </div>
            <div className="text-sm text-gray-600">Average Health</div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best vs Worst */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Relationship Extremes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-green-800">Healthiest Relationship</h4>
                <Badge className="bg-green-100 text-green-700">
                  {comparisonMetrics.healthiest.overallHealthScore}% Health
                </Badge>
              </div>
              <p className="text-sm text-green-700 mb-2">
                <strong>{comparisonMetrics.healthiest.name}</strong> ({comparisonMetrics.healthiest.relationshipType})
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-green-600">Energy Impact:</span>
                  <span className="ml-1 font-medium">
                    {comparisonMetrics.healthiest.energyImpact > 0 ? '+' : ''}
                    {comparisonMetrics.healthiest.energyImpact.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-green-600">Boundary Respect:</span>
                  <span className="ml-1 font-medium">{comparisonMetrics.healthiest.boundaryRespectRate}%</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-red-800">Most Problematic</h4>
                <Badge className="bg-red-100 text-red-700">
                  {comparisonMetrics.mostProblematic.overallHealthScore}% Health
                </Badge>
              </div>
              <p className="text-sm text-red-700 mb-2">
                <strong>{comparisonMetrics.mostProblematic.name}</strong> ({comparisonMetrics.mostProblematic.relationshipType})
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-red-600">Energy Impact:</span>
                  <span className="ml-1 font-medium">
                    {comparisonMetrics.mostProblematic.energyImpact.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-red-600">Recovery Time:</span>
                  <span className="ml-1 font-medium">
                    {comparisonMetrics.mostProblematic.recoveryTime}h
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Energy Impact Comparison</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Most Energizing:</span>
                  <span className="text-sm font-medium text-green-600">
                    {comparisonMetrics.mostEnergizing.name} (+{comparisonMetrics.mostEnergizing.energyImpact.toFixed(1)})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Most Draining:</span>
                  <span className="text-sm font-medium text-red-600">
                    {comparisonMetrics.mostDraining.name} ({comparisonMetrics.mostDraining.energyImpact.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Growth Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Personal Growth Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {Math.round(growthMetrics.totalGrowthScore)}%
              </div>
              <div className="text-sm text-gray-600">Overall Growth Score</div>
              <Progress value={growthMetrics.totalGrowthScore} className="mt-2" />
            </div>

            {growthMetrics.growthContributors.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Growth Contributors</h4>
                <div className="space-y-2">
                  {growthMetrics.growthContributors.slice(0, 3).map(relationship => (
                    <div key={relationship.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">{relationship.name}</span>
                      <Badge className="bg-green-100 text-green-700">
                        {relationship.personalGrowthContribution}% helpful
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {growthMetrics.improvingRelationships.length}
                </div>
                <div className="text-xs text-gray-600">Improving</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {growthMetrics.decliningRelationships.length}
                </div>
                <div className="text-xs text-gray-600">Declining</div>
              </div>
            </div>

            {growthMetrics.decliningRelationships.length > 0 && (
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <h4 className="font-medium text-orange-800">Needs Attention</h4>
                </div>
                <div className="space-y-1">
                  {growthMetrics.decliningRelationships.slice(0, 2).map(relationship => (
                    <div key={relationship.id} className="text-sm text-orange-700">
                      {relationship.name} - showing decline in quality
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-600" />
              Health Score Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: any, name: string, props: any) => [
                    `${value}%`,
                    props.payload.fullName
                  ]}
                />
                <Bar 
                  dataKey="health" 
                  fill={(entry: any) => {
                    if (entry.health >= 80) return '#10b981';
                    if (entry.health >= 60) return '#3b82f6';
                    if (entry.health >= 40) return '#f59e0b';
                    return '#ef4444';
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Multi-Metric Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Relationship Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData[0] ? [radarData[0]] : []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis domain={[0, 100]} />
                {radarData.map((relationship, index) => (
                  <Radar
                    key={relationship.name}
                    name={relationship.name}
                    dataKey="Health"
                    stroke={getRelationshipTypeColor('default')}
                    fill={getRelationshipTypeColor('default')}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            Detailed Relationship Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2">Relationship</th>
                  <th className="text-center p-2">Health Score</th>
                  <th className="text-center p-2">Energy Impact</th>
                  <th className="text-center p-2">Boundary Respect</th>
                  <th className="text-center p-2">Communication</th>
                  <th className="text-center p-2">Recovery Time</th>
                  <th className="text-center p-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {relationships
                  .sort((a, b) => b.overallHealthScore - a.overallHealthScore)
                  .map((relationship) => (
                    <tr key={relationship.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{relationship.name}</div>
                          <div className="text-xs text-gray-500">{relationship.relationshipType}</div>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <Badge className={getHealthColor(relationship.overallHealthScore)}>
                          {relationship.overallHealthScore}%
                        </Badge>
                      </td>
                      <td className="text-center p-2">
                        <span className={`font-medium ${
                          relationship.energyImpact > 0 ? 'text-green-600' : 
                          relationship.energyImpact < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {relationship.energyImpact > 0 ? '+' : ''}{relationship.energyImpact.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-center p-2">
                        <div className="flex items-center justify-center">
                          <Progress value={relationship.boundaryRespectRate} className="w-16 h-2" />
                          <span className="ml-2 text-xs">{relationship.boundaryRespectRate}%</span>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <Progress value={relationship.communicationQuality} className="w-16 h-2 mx-auto" />
                      </td>
                      <td className="text-center p-2">
                        <span className="text-xs">
                          {relationship.recoveryTime < 1 ? 
                            `${Math.round(relationship.recoveryTime * 60)}m` : 
                            `${relationship.recoveryTime.toFixed(1)}h`}
                        </span>
                      </td>
                      <td className="text-center p-2">
                        {relationship.improvementTrend === 'improving' ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                        ) : relationship.improvementTrend === 'declining' ? (
                          <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />
                        ) : (
                          <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights and Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Zap className="w-5 h-5" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {comparisonMetrics.avgHealthScore < 50 && (
              <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Overall Relationship Health Concern</h4>
                  <p className="text-sm text-red-700">
                    Your average relationship health score is {Math.round(comparisonMetrics.avgHealthScore)}%. 
                    Consider focusing on relationships that energize you and setting stronger boundaries with others.
                  </p>
                </div>
              </div>
            )}

            {comparisonMetrics.avgEnergyImpact < -1 && (
              <div className="flex items-start gap-3 p-3 bg-orange-100 rounded-lg">
                <Battery className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Energy Drain Pattern</h4>
                  <p className="text-sm text-orange-700">
                    Your relationships are draining your energy on average. Consider spending more time with 
                    {comparisonMetrics.mostEnergizing.name} and limiting contact with energy-draining individuals.
                  </p>
                </div>
              </div>
            )}

            {comparisonMetrics.avgBoundaryRespect < 70 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-100 rounded-lg">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Boundary Respect Issues</h4>
                  <p className="text-sm text-yellow-700">
                    Only {Math.round(comparisonMetrics.avgBoundaryRespect)}% boundary respect rate across relationships. 
                    Focus on clearer boundary communication and consequences for violations.
                  </p>
                </div>
              </div>
            )}

            {growthMetrics.improvingRelationships.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Positive Progress</h4>
                  <p className="text-sm text-green-700">
                    {growthMetrics.improvingRelationships.length} relationship(s) are showing improvement. 
                    Your boundary work and communication efforts are paying off!
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}