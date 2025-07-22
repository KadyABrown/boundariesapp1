import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield,
  Heart,
  Battery,
  Brain,
  CheckCircle,
  XCircle
} from "lucide-react";

interface RelationshipCompatibilityAnalysisProps {
  relationshipId: number;
  relationshipName: string;
  interactions: any[];
  baseline: any;
}

interface CompatibilityInsight {
  category: string;
  score: number;
  status: 'excellent' | 'good' | 'concerning' | 'poor';
  insight: string;
  recommendation: string;
}

export default function RelationshipCompatibilityAnalysis({ 
  relationshipId, 
  relationshipName, 
  interactions, 
  baseline 
}: RelationshipCompatibilityAnalysisProps) {
  
  const analyzeCompatibility = (): CompatibilityInsight[] => {
    if (!interactions.length || !baseline) return [];

    const insights: CompatibilityInsight[] = [];

    // Communication Style Compatibility
    const communicationRespected = interactions.filter(i => i.communicationStyleRespected).length;
    const communicationScore = (communicationRespected / interactions.length) * 100;
    insights.push({
      category: 'Communication Style',
      score: communicationScore,
      status: communicationScore >= 80 ? 'excellent' : communicationScore >= 60 ? 'good' : communicationScore >= 40 ? 'concerning' : 'poor',
      insight: `Your communication style is respected in ${communicationScore.toFixed(0)}% of interactions`,
      recommendation: communicationScore < 60 ? 
        `Consider discussing your ${baseline.communicationStyle} communication preference with ${relationshipName}` :
        'Your communication styles are well-aligned'
    });

    // Boundary Respect Analysis
    const boundariesRespected = interactions.filter(i => i.boundariesRespected).length;
    const boundaryScore = (boundariesRespected / interactions.length) * 100;
    insights.push({
      category: 'Boundary Respect',
      score: boundaryScore,
      status: boundaryScore >= 90 ? 'excellent' : boundaryScore >= 70 ? 'good' : boundaryScore >= 50 ? 'concerning' : 'poor',
      insight: `Your boundaries are respected in ${boundaryScore.toFixed(0)}% of interactions`,
      recommendation: boundaryScore < 70 ? 
        'This relationship shows concerning patterns of boundary violations that need addressing' :
        'Your boundaries are generally well-respected'
    });

    // Trigger Avoidance Analysis
    const triggersAvoided = interactions.filter(i => i.triggersAvoided).length;
    const triggerScore = (triggersAvoided / interactions.length) * 100;
    insights.push({
      category: 'Trigger Management',
      score: triggerScore,
      status: triggerScore >= 80 ? 'excellent' : triggerScore >= 60 ? 'good' : triggerScore >= 40 ? 'concerning' : 'poor',
      insight: `Your emotional triggers are avoided in ${triggerScore.toFixed(0)}% of interactions`,
      recommendation: triggerScore < 60 ? 
        `Share your trigger list with ${relationshipName} to improve emotional safety` :
        'Your emotional triggers are well-managed in this relationship'
    });

    // Energy Impact Analysis
    const energyChanges = interactions.map(i => (i.energyAfter || 5) - (i.energyBefore || 5));
    const avgEnergyChange = energyChanges.reduce((sum, change) => sum + change, 0) / energyChanges.length;
    const energyScore = Math.max(0, Math.min(100, ((avgEnergyChange + 5) / 10) * 100));
    insights.push({
      category: 'Energy Impact',
      score: energyScore,
      status: energyScore >= 70 ? 'excellent' : energyScore >= 55 ? 'good' : energyScore >= 40 ? 'concerning' : 'poor',
      insight: avgEnergyChange > 0 ? 
        `This relationship energizes you (+${avgEnergyChange.toFixed(1)} average energy change)` :
        `This relationship drains your energy (${avgEnergyChange.toFixed(1)} average energy change)`,
      recommendation: avgEnergyChange < -1 ? 
        'Consider limiting time or changing interaction patterns to protect your energy' :
        'This relationship has a positive or neutral energy impact'
    });

    // Self-Worth Impact Analysis
    const selfWorthChanges = interactions.map(i => (i.selfWorthAfter || 5) - (i.selfWorthBefore || 5));
    const avgSelfWorthChange = selfWorthChanges.reduce((sum, change) => sum + change, 0) / selfWorthChanges.length;
    const selfWorthScore = Math.max(0, Math.min(100, ((avgSelfWorthChange + 5) / 10) * 100));
    insights.push({
      category: 'Self-Worth Impact',
      score: selfWorthScore,
      status: selfWorthScore >= 70 ? 'excellent' : selfWorthScore >= 55 ? 'good' : selfWorthScore >= 40 ? 'concerning' : 'poor',
      insight: avgSelfWorthChange > 0 ? 
        `This relationship boosts your self-worth (+${avgSelfWorthChange.toFixed(1)} average)` :
        `This relationship impacts your self-worth negatively (${avgSelfWorthChange.toFixed(1)} average)`,
      recommendation: avgSelfWorthChange < -1 ? 
        'This relationship may be damaging to your self-esteem and needs careful evaluation' :
        'This relationship supports or maintains your self-worth'
    });

    return insights;
  };

  const calculateOverallCompatibility = (insights: CompatibilityInsight[]): number => {
    if (!insights.length) return 0;
    return insights.reduce((sum, insight) => sum + insight.score, 0) / insights.length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'concerning': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'concerning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'poor': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Communication Style': return <Brain className="w-5 h-5" />;
      case 'Boundary Respect': return <Shield className="w-5 h-5" />;
      case 'Trigger Management': return <AlertTriangle className="w-5 h-5" />;
      case 'Energy Impact': return <Battery className="w-5 h-5" />;
      case 'Self-Worth Impact': return <Heart className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const insights = analyzeCompatibility();
  const overallCompatibility = calculateOverallCompatibility(insights);

  if (!baseline) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Baseline Compatibility Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Complete Your Personal Baseline Assessment</h3>
            <p className="text-gray-600 mb-4">
              To analyze relationship compatibility, we need to understand your core values and needs.
            </p>
            <Button>Complete Baseline Assessment</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!interactions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Baseline Compatibility Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Interaction Data Yet</h3>
            <p className="text-gray-600 mb-4">
              Complete some Comprehensive Interaction Tracking sessions to see compatibility analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Compatibility Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Overall Baseline Compatibility with {relationshipName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {overallCompatibility.toFixed(0)}%
            </div>
            <Progress value={overallCompatibility} className="w-full mb-4" />
            <Badge 
              className={getStatusColor(
                overallCompatibility >= 80 ? 'excellent' : 
                overallCompatibility >= 60 ? 'good' : 
                overallCompatibility >= 40 ? 'concerning' : 'poor'
              )}
            >
              {overallCompatibility >= 80 ? 'Highly Compatible' : 
               overallCompatibility >= 60 ? 'Moderately Compatible' : 
               overallCompatibility >= 40 ? 'Some Compatibility Issues' : 'Low Compatibility'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Compatibility Analysis */}
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(insight.category)}
                  <div>
                    <h4 className="font-semibold">{insight.category}</h4>
                    <p className="text-sm text-gray-600">{insight.insight}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(insight.status)}
                  <span className="font-semibold">{insight.score.toFixed(0)}%</span>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={insight.score} className="mb-2" />
                <p className="text-sm text-gray-700">{insight.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Baseline Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Personal Baseline Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Communication Style</h4>
              <Badge variant="outline">{baseline.communicationStyle}</Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Emotional Support Level</h4>
              <Badge variant="outline">{baseline.emotionalSupportLevel}</Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Personal Space Needs</h4>
              <Badge variant="outline">{baseline.personalSpaceNeeds}</Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Conflict Resolution</h4>
              <Badge variant="outline">{baseline.conflictResolutionStyle}</Badge>
            </div>
          </div>
          
          {baseline.triggers && baseline.triggers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Your Key Triggers</h4>
              <div className="flex flex-wrap gap-2">
                {baseline.triggers.slice(0, 5).map((trigger: string, index: number) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {trigger}
                  </Badge>
                ))}
                {baseline.triggers.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{baseline.triggers.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}