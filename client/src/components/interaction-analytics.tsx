import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Activity,
  Brain,
  Clock,
  Heart,
  Shield,
  Zap
} from "lucide-react";

interface ComprehensiveInteraction {
  id: number;
  relationshipId: number;
  createdAt: string;
  preEnergyLevel?: number;
  postEnergyLevel?: number;
  preAnxietyLevel?: number;
  postAnxietyLevel?: number;
  preSelfWorth?: number;
  postSelfWorth?: number;
  physicalSymptoms?: string[];
  emotionalStates?: string[];
  recoveryTimeMinutes?: number;
  interactionType?: string;
  durationMinutes?: number;
  boundaryTesting?: boolean;
  communicationQuality?: number;
  emotionalNeedsMet?: number;
  valuesAlignment?: number;
}

interface InteractionAnalyticsProps {
  interactions: ComprehensiveInteraction[];
  relationshipName: string;
}

export default function InteractionAnalytics({ interactions, relationshipName }: InteractionAnalyticsProps) {
  const analytics = useMemo(() => {
    if (!interactions || interactions.length === 0) {
      return null;
    }

    const validInteractions = interactions.filter(i => 
      i.preEnergyLevel !== null && i.postEnergyLevel !== null
    );

    if (validInteractions.length === 0) {
      return null;
    }

    // Energy Impact Analysis
    const energyChanges = validInteractions.map(i => 
      (i.postEnergyLevel || 0) - (i.preEnergyLevel || 0)
    );
    const avgEnergyChange = energyChanges.reduce((sum, change) => sum + change, 0) / energyChanges.length;
    const energyDraining = energyChanges.filter(change => change < 0).length;
    const energyBoosting = energyChanges.filter(change => change > 0).length;

    // Physical Symptoms Analysis
    const allSymptoms = validInteractions.flatMap(i => i.physicalSymptoms || []);
    const symptomCounts = allSymptoms.reduce((acc, symptom) => {
      acc[symptom] = (acc[symptom] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topSymptoms = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Emotional Impact Analysis
    const anxietyChanges = validInteractions
      .filter(i => i.preAnxietyLevel !== null && i.postAnxietyLevel !== null)
      .map(i => (i.postAnxietyLevel || 0) - (i.preAnxietyLevel || 0));
    const avgAnxietyChange = anxietyChanges.length > 0 
      ? anxietyChanges.reduce((sum, change) => sum + change, 0) / anxietyChanges.length 
      : 0;

    // Self-Worth Impact Analysis
    const selfWorthChanges = validInteractions
      .filter(i => i.preSelfWorth !== null && i.postSelfWorth !== null)
      .map(i => (i.postSelfWorth || 0) - (i.preSelfWorth || 0));
    const avgSelfWorthChange = selfWorthChanges.length > 0
      ? selfWorthChanges.reduce((sum, change) => sum + change, 0) / selfWorthChanges.length
      : 0;

    // Recovery Time Analysis
    const recoveryTimes = validInteractions
      .filter(i => i.recoveryTimeMinutes !== null)
      .map(i => i.recoveryTimeMinutes || 0);
    const avgRecoveryTime = recoveryTimes.length > 0
      ? recoveryTimes.reduce((sum, time) => sum + time, 0) / recoveryTimes.length
      : 0;

    // Boundary Testing Frequency
    const boundaryViolations = validInteractions.filter(i => i.boundaryTesting).length;
    const boundaryViolationRate = (boundaryViolations / validInteractions.length) * 100;

    // Communication Quality
    const commQualityScores = validInteractions
      .filter(i => i.communicationQuality !== null)
      .map(i => i.communicationQuality || 0);
    const avgCommQuality = commQualityScores.length > 0
      ? commQualityScores.reduce((sum, score) => sum + score, 0) / commQualityScores.length
      : 0;

    return {
      totalInteractions: validInteractions.length,
      avgEnergyChange,
      energyDraining,
      energyBoosting,
      topSymptoms,
      avgAnxietyChange,
      avgSelfWorthChange,
      avgRecoveryTime,
      boundaryViolationRate,
      avgCommQuality
    };
  }, [interactions]);

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Interaction Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No comprehensive interaction data available yet. Use the CIT tracker to log interactions and see patterns.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Interaction Impact Analysis
            <Badge variant="secondary">{analytics.totalInteractions} interactions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Energy Impact */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Energy Impact
              </span>
              <div className="flex items-center gap-2">
                {analytics.avgEnergyChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={analytics.avgEnergyChange > 0 ? "text-green-600" : "text-red-600"}>
                  {analytics.avgEnergyChange > 0 ? "+" : ""}{analytics.avgEnergyChange.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Energizing interactions:</span>
                <span className="text-green-600">{analytics.energyBoosting}</span>
              </div>
              <div className="flex justify-between">
                <span>Draining interactions:</span>
                <span className="text-red-600">{analytics.energyDraining}</span>
              </div>
            </div>
          </div>

          {/* Emotional Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Anxiety Impact
              </div>
              <div className="flex items-center gap-2">
                {analytics.avgAnxietyChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                <span className={analytics.avgAnxietyChange > 0 ? "text-red-600" : "text-green-600"}>
                  {analytics.avgAnxietyChange > 0 ? "+" : ""}{analytics.avgAnxietyChange.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Self-Worth Impact
              </div>
              <div className="flex items-center gap-2">
                {analytics.avgSelfWorthChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={analytics.avgSelfWorthChange > 0 ? "text-green-600" : "text-red-600"}>
                  {analytics.avgSelfWorthChange > 0 ? "+" : ""}{analytics.avgSelfWorthChange.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Recovery Time */}
          {analytics.avgRecoveryTime > 0 && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Average Recovery Time
              </span>
              <span className="font-medium">
                {Math.round(analytics.avgRecoveryTime)} minutes
                {analytics.avgRecoveryTime > 60 && (
                  <span className="text-muted-foreground ml-1">
                    ({(analytics.avgRecoveryTime / 60).toFixed(1)} hours)
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Boundary Testing */}
          {analytics.boundaryViolationRate > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Boundary Testing Rate
                </span>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-600 font-medium">
                    {analytics.boundaryViolationRate.toFixed(0)}%
                  </span>
                </div>
              </div>
              <Progress 
                value={analytics.boundaryViolationRate} 
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Physical Symptoms Analysis */}
      {analytics.topSymptoms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Physical Impact Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topSymptoms.map(([symptom, count], index) => (
                <motion.div
                  key={symptom}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg"
                >
                  <span className="font-medium">{symptom}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {count} time{count > 1 ? 's' : ''}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {((count / analytics.totalInteractions) * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            {analytics.topSymptoms.length > 0 && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Physical Impact Alert</span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  You've experienced physical symptoms after {analytics.topSymptoms.length > 1 ? 'multiple interactions' : 'interactions'} with {relationshipName}. 
                  Consider discussing these patterns with a healthcare provider or therapist.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Communication Quality */}
      {analytics.avgCommQuality > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Communication Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Average Communication Quality</span>
                <span className="font-medium">{analytics.avgCommQuality.toFixed(1)}/10</span>
              </div>
              <Progress 
                value={(analytics.avgCommQuality / 10) * 100} 
                className="h-2"
              />
              <div className="text-sm text-muted-foreground">
                Based on your ratings from {analytics.totalInteractions} interactions
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}