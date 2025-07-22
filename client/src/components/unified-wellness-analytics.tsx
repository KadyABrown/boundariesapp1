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
  Heart,
  Users,
  Zap,
  Target
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

interface Relationship {
  id: number;
  name: string;
  relationshipType: string;
  relationshipStatus: string;
}

interface UnifiedWellnessAnalyticsProps {
  interactions: ComprehensiveInteraction[];
  relationships: Relationship[];
}

export default function UnifiedWellnessAnalytics({ interactions, relationships }: UnifiedWellnessAnalyticsProps) {
  const analytics = useMemo(() => {
    if (!interactions || interactions.length === 0 || !relationships || relationships.length === 0) {
      return null;
    }

    const validInteractions = interactions.filter(i => 
      i.preEnergyLevel !== null && i.postEnergyLevel !== null
    );

    if (validInteractions.length === 0) {
      return null;
    }

    // Create relationship lookup
    const relationshipLookup = relationships.reduce((acc, rel) => {
      acc[rel.id] = rel;
      return acc;
    }, {} as Record<number, Relationship>);

    // Enhanced interactions with relationship context
    const enrichedInteractions = validInteractions.map(interaction => ({
      ...interaction,
      relationship: relationshipLookup[interaction.relationshipId]
    })).filter(i => i.relationship); // Only include interactions with valid relationships

    // Relationship Type Impact Analysis
    const relationshipTypeImpact = enrichedInteractions.reduce((acc, interaction) => {
      const type = interaction.relationship.relationshipType;
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalEnergyChange: 0,
          totalAnxietyChange: 0,
          totalSelfWorthChange: 0,
          physicalSymptoms: [],
          emotionalStates: [],
          boundaryViolations: 0,
          avgRecoveryTime: 0,
          recoveryTimes: []
        };
      }
      
      acc[type].count += 1;
      acc[type].totalEnergyChange += (interaction.postEnergyLevel || 0) - (interaction.preEnergyLevel || 0);
      
      if (interaction.preAnxietyLevel !== null && interaction.postAnxietyLevel !== null) {
        acc[type].totalAnxietyChange += (interaction.postAnxietyLevel || 0) - (interaction.preAnxietyLevel || 0);
      }
      
      if (interaction.preSelfWorth !== null && interaction.postSelfWorth !== null) {
        acc[type].totalSelfWorthChange += (interaction.postSelfWorth || 0) - (interaction.preSelfWorth || 0);
      }
      
      if (interaction.physicalSymptoms) {
        acc[type].physicalSymptoms.push(...interaction.physicalSymptoms);
      }
      
      if (interaction.emotionalStates) {
        acc[type].emotionalStates.push(...interaction.emotionalStates);
      }
      
      if (interaction.boundaryTesting) {
        acc[type].boundaryViolations += 1;
      }
      
      if (interaction.recoveryTimeMinutes) {
        acc[type].recoveryTimes.push(interaction.recoveryTimeMinutes);
      }
      
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages and patterns for each relationship type
    const relationshipTypeAnalysis = Object.entries(relationshipTypeImpact).map(([type, data]) => {
      const avgEnergyChange = data.totalEnergyChange / data.count;
      const avgAnxietyChange = data.totalAnxietyChange / data.count;
      const avgSelfWorthChange = data.totalSelfWorthChange / data.count;
      const boundaryViolationRate = (data.boundaryViolations / data.count) * 100;
      const avgRecoveryTime = data.recoveryTimes.length > 0 
        ? data.recoveryTimes.reduce((sum: number, time: number) => sum + time, 0) / data.recoveryTimes.length
        : 0;
      
      // Most common physical symptoms for this relationship type
      const symptomCounts = data.physicalSymptoms.reduce((acc: Record<string, number>, symptom: string) => {
        acc[symptom] = (acc[symptom] || 0) + 1;
        return acc;
      }, {});
      
      const topSymptoms = Object.entries(symptomCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([symptom, count]) => ({ symptom, count }));

      // Most common emotional states for this relationship type
      const emotionCounts = data.emotionalStates.reduce((acc: Record<string, number>, emotion: string) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {});
      
      const topEmotions = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([emotion, count]) => ({ emotion, count }));

      return {
        type,
        count: data.count,
        avgEnergyChange,
        avgAnxietyChange,
        avgSelfWorthChange,
        boundaryViolationRate,
        avgRecoveryTime,
        topSymptoms,
        topEmotions,
        overallWellnessScore: Math.round(
          ((avgEnergyChange + 5) / 10) * 30 + // Energy impact (30%)
          ((5 - avgAnxietyChange) / 10) * 25 + // Anxiety impact (25%)
          ((avgSelfWorthChange + 5) / 10) * 25 + // Self-worth impact (25%)
          ((100 - boundaryViolationRate) / 100) * 20 // Boundary respect (20%)
        )
      };
    }).sort((a, b) => b.overallWellnessScore - a.overallWellnessScore);

    // Relationship Status Impact Analysis
    const relationshipStatusImpact = enrichedInteractions.reduce((acc, interaction) => {
      const status = interaction.relationship.relationshipStatus;
      if (!acc[status]) {
        acc[status] = {
          count: 0,
          totalEnergyChange: 0,
          physicalSymptoms: [],
          emotionalStates: []
        };
      }
      
      acc[status].count += 1;
      acc[status].totalEnergyChange += (interaction.postEnergyLevel || 0) - (interaction.preEnergyLevel || 0);
      
      if (interaction.physicalSymptoms) {
        acc[status].physicalSymptoms.push(...interaction.physicalSymptoms);
      }
      
      if (interaction.emotionalStates) {
        acc[status].emotionalStates.push(...interaction.emotionalStates);
      }
      
      return acc;
    }, {} as Record<string, any>);

    const statusAnalysis = Object.entries(relationshipStatusImpact).map(([status, data]) => ({
      status,
      count: data.count,
      avgEnergyChange: data.totalEnergyChange / data.count,
      topSymptom: data.physicalSymptoms.length > 0 
        ? Object.entries(data.physicalSymptoms.reduce((acc: Record<string, number>, symptom: string) => {
            acc[symptom] = (acc[symptom] || 0) + 1;
            return acc;
          }, {})).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0]
        : null,
      topEmotion: data.emotionalStates.length > 0
        ? Object.entries(data.emotionalStates.reduce((acc: Record<string, number>, emotion: string) => {
            acc[emotion] = (acc[emotion] || 0) + 1;
            return acc;
          }, {})).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0]
        : null
    }));

    return {
      totalInteractions: enrichedInteractions.length,
      relationshipTypeAnalysis,
      statusAnalysis
    };
  }, [interactions, relationships]);

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Unified Wellness Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No comprehensive interaction data available yet. Use the CIT tracker to log interactions across different relationships.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cross-Relationship Wellness Impact
            <Badge variant="secondary">{analytics.totalInteractions} interactions analyzed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Understanding how different types of relationships and their stages impact your emotional and physical wellness.
          </p>
        </CardContent>
      </Card>

      {/* Relationship Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Relationship Type Wellness Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {analytics.relationshipTypeAnalysis.map((typeData, index) => (
            <motion.div
              key={typeData.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg capitalize">
                    {typeData.type.replace('-', ' ')} Relationships
                  </span>
                  <Badge variant="outline">{typeData.count} interactions</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Wellness Score:</span>
                  <Badge className={
                    typeData.overallWellnessScore >= 70 ? 'bg-green-500' :
                    typeData.overallWellnessScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }>
                    {typeData.overallWellnessScore}%
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Energy Impact */}
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className={`text-xl font-bold flex items-center justify-center gap-1 ${
                    typeData.avgEnergyChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {typeData.avgEnergyChange > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {typeData.avgEnergyChange > 0 ? '+' : ''}{typeData.avgEnergyChange.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Avg Energy Impact</div>
                </div>

                {/* Boundary Violations */}
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className={`text-xl font-bold ${
                    typeData.boundaryViolationRate < 20 ? 'text-green-600' : 
                    typeData.boundaryViolationRate < 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {typeData.boundaryViolationRate.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Boundary Testing Rate</div>
                </div>

                {/* Recovery Time */}
                {typeData.avgRecoveryTime > 0 && (
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {Math.round(typeData.avgRecoveryTime)}m
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Avg Recovery Time</div>
                  </div>
                )}
              </div>

              {/* Physical & Emotional Patterns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {typeData.topSymptoms.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Common Physical Symptoms
                    </h4>
                    <div className="space-y-1">
                      {typeData.topSymptoms.map((symptom) => (
                        <div key={symptom.symptom} className="flex justify-between text-sm">
                          <span>{symptom.symptom}</span>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round((symptom.count / typeData.count) * 100)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {typeData.topEmotions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Common Emotional States
                    </h4>
                    <div className="space-y-1">
                      {typeData.topEmotions.map((emotion) => (
                        <div key={emotion.emotion} className="flex justify-between text-sm">
                          <span>{emotion.emotion}</span>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round((emotion.count / typeData.count) * 100)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Relationship Status Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Relationship Status Impact Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.statusAnalysis.map((statusData, index) => (
              <motion.div
                key={statusData.status}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="text-center">
                  <h3 className="font-semibold capitalize">{statusData.status.replace('-', ' ')}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    {statusData.count} interactions
                  </Badge>
                </div>

                <div className="text-center p-2 bg-slate-50 rounded">
                  <div className={`text-lg font-bold ${
                    statusData.avgEnergyChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {statusData.avgEnergyChange > 0 ? '+' : ''}{statusData.avgEnergyChange.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Energy Impact</div>
                </div>

                {statusData.topSymptom && (
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Most common symptom:</span>
                    <div className="text-sm font-medium">{statusData.topSymptom}</div>
                  </div>
                )}

                {statusData.topEmotion && (
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Most common emotion:</span>
                    <div className="text-sm font-medium">{statusData.topEmotion}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Key Wellness Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.relationshipTypeAnalysis.length > 0 && (
            <>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Most Supportive Relationship Type</span>
                </div>
                <p className="text-sm text-green-800">
                  <strong>{analytics.relationshipTypeAnalysis[0].type.replace('-', ' ')} relationships</strong> have the highest wellness score 
                  ({analytics.relationshipTypeAnalysis[0].overallWellnessScore}%) with an average energy boost of 
                  {analytics.relationshipTypeAnalysis[0].avgEnergyChange > 0 ? '+' : ''}{analytics.relationshipTypeAnalysis[0].avgEnergyChange.toFixed(1)} points.
                </p>
              </div>

              {analytics.relationshipTypeAnalysis.find(type => type.overallWellnessScore < 50) && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-700 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Relationship Type Requiring Attention</span>
                  </div>
                  <p className="text-sm text-orange-800">
                    Your <strong>{analytics.relationshipTypeAnalysis.find(type => type.overallWellnessScore < 50)?.type.replace('-', ' ')} relationships</strong> show 
                    concerning patterns with lower wellness scores. Consider reviewing boundaries and communication strategies for these connections.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}