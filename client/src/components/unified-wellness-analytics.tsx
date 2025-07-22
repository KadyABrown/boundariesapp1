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
  greenFlags?: number;
  redFlags?: number;
  averageSafetyRating?: number;
  checkInCount?: number;
  overallHealthScore?: number;
}

interface UnifiedWellnessAnalyticsProps {
  interactions: ComprehensiveInteraction[];
  relationships: Relationship[];
}

export default function UnifiedWellnessAnalytics({ interactions = [], relationships = [] }: UnifiedWellnessAnalyticsProps) {
  const analytics = useMemo(() => {
    if (!interactions || interactions.length === 0 || !relationships || relationships.length === 0) {
      return null;
    }

    const validInteractions = interactions.filter(i => 
      i.preEnergyLevel !== undefined && i.postEnergyLevel !== undefined && 
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

  // Show meaningful analytics or helpful explanation
  const hasData = interactions.length > 0 && relationships.length > 0;
  
  if (!hasData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Unified Wellness Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 space-y-4">
              <div className="text-2xl font-bold text-neutral-400">Getting Started</div>
              <p className="text-neutral-600">
                Track more interactions to unlock comprehensive wellness insights including:
              </p>
              <div className="grid grid-cols-1 gap-4 text-sm text-neutral-500">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="font-medium mb-2">Energy Analysis</div>
                  <p>How different relationships affect your daily energy levels</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="font-medium mb-2">Recovery Patterns</div>
                  <p>Time needed to feel normal after challenging interactions</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="font-medium mb-2">Boundary Success</div>
                  <p>Which relationships support vs challenge your boundaries</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="font-medium mb-2">Personal Recommendations</div>
                  <p>Actionable strategies based on your specific patterns</p>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-sm text-neutral-500">
                  Currently showing: {relationships.length} relationships, {interactions.length} interactions tracked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
              className="border rounded-lg p-4 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-base sm:text-lg capitalize">
                    {typeData.type.replace('-', ' ')} Relationships
                  </span>
                  <Badge variant="outline" className="text-xs">{typeData.count} interactions</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Wellness Score:</span>
                  <Badge className={
                    typeData.overallWellnessScore >= 70 ? 'bg-green-500' :
                    typeData.overallWellnessScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }>
                    {typeData.overallWellnessScore}%
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Energy Impact */}
                <div className="text-center p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <div className={`text-lg sm:text-xl font-bold flex items-center justify-center gap-1 ${
                    typeData.avgEnergyChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {typeData.avgEnergyChange > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {typeData.avgEnergyChange > 0 ? '+' : ''}{typeData.avgEnergyChange.toFixed(1)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Avg Energy Impact</div>
                </div>

                {/* Boundary Violations */}
                <div className="text-center p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <div className={`text-lg sm:text-xl font-bold ${
                    typeData.boundaryViolationRate < 20 ? 'text-green-600' : 
                    typeData.boundaryViolationRate < 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {typeData.boundaryViolationRate.toFixed(0)}%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Boundary Testing Rate</div>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

      {/* Personalized Wellness Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Personalized Wellness Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {analytics.relationshipTypeAnalysis.length > 0 && (
            <>
              {/* Most Supportive Relationship Type */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-3">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Your Wellness Strength</span>
                </div>
                <p className="text-sm text-green-800 mb-3 leading-relaxed">
                  <strong>{analytics.relationshipTypeAnalysis[0].type.replace('-', ' ')} relationships</strong> energize you most 
                  (wellness score: {analytics.relationshipTypeAnalysis[0].overallWellnessScore}%, 
                  energy boost: {analytics.relationshipTypeAnalysis[0].avgEnergyChange > 0 ? '+' : ''}{analytics.relationshipTypeAnalysis[0].avgEnergyChange.toFixed(1)}).
                </p>
                <div className="bg-green-100 p-3 rounded border-l-4 border-green-500">
                  <h4 className="font-medium text-green-800 mb-2">Actionable Strategy:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Schedule more time with these relationships when you need emotional recharge</li>
                    <li>• Use their support patterns as a template for other relationships</li>
                    <li>• Notice what specific behaviors make these interactions energizing</li>
                  </ul>
                </div>
              </div>

              {/* Challenging Relationship Types */}
              {analytics.relationshipTypeAnalysis.filter(type => type.overallWellnessScore < 60).map(challengingType => (
                <div key={challengingType.type} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-700 mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">
                      {challengingType.type.replace('-', ' ')} Relationships Need Support
                    </span>
                  </div>
                  <p className="text-sm text-orange-800 mb-3 leading-relaxed">
                    Wellness score: {challengingType.overallWellnessScore}%, 
                    Energy impact: {challengingType.avgEnergyChange > 0 ? '+' : ''}{challengingType.avgEnergyChange.toFixed(1)}, 
                    Boundary violations: {challengingType.boundaryViolationRate.toFixed(0)}%
                  </p>
                  <div className="bg-orange-100 p-3 rounded border-l-4 border-orange-500 space-y-3">
                    <div>
                      <h4 className="font-medium text-orange-800 mb-2">Immediate Actions:</h4>
                      <ul className="text-sm text-orange-700 space-y-1 leading-relaxed">
                        {challengingType.boundaryViolationRate > 30 && (
                          <li>• <strong>Strengthen boundaries:</strong> Practice saying "no" and set clear expectations</li>
                        )}
                        {challengingType.avgEnergyChange < -2 && (
                          <li>• <strong>Energy protection:</strong> Limit interaction time or schedule recovery time after</li>
                        )}
                        {challengingType.avgRecoveryTime > 120 && (
                          <li>• <strong>Recovery planning:</strong> Have specific strategies ready for post-interaction recovery</li>
                        )}
                      </ul>
                    </div>
                    
                    {challengingType.topSymptoms.length > 0 && (
                      <div>
                        <h4 className="font-medium text-orange-800 mb-2">Physical Wellness:</h4>
                        <p className="text-sm text-orange-700 leading-relaxed">
                          Your body frequently responds with <strong>{challengingType.topSymptoms[0].symptom}</strong> during these interactions. 
                          Consider stress-reduction techniques before and after these encounters.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Physical Symptoms Recommendations */}
              {analytics.relationshipTypeAnalysis.some(type => type.topSymptoms.length > 0) && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 mb-3">
                    <Activity className="h-4 w-4" />
                    <span className="font-medium">Body-Mind Connection Insights</span>
                  </div>
                  <div className="bg-blue-100 p-3 rounded border-l-4 border-blue-500">
                    <h4 className="font-medium text-blue-800 mb-2">Wellness Protocol:</h4>
                    <ul className="text-sm text-blue-700 space-y-1 leading-relaxed">
                      <li>• <strong>Before difficult interactions:</strong> Try deep breathing or light stretching</li>
                      <li>• <strong>During interactions:</strong> Notice early physical warning signs</li>
                      <li>• <strong>After interactions:</strong> Use recovery time based on your patterns (avg: {
                        Math.round(analytics.relationshipTypeAnalysis
                          .reduce((sum, type) => sum + type.avgRecoveryTime, 0) / analytics.relationshipTypeAnalysis.length)
                      } minutes)</li>
                      <li>• <strong>Long-term:</strong> Consider discussing persistent physical symptoms with a healthcare provider</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Relationship Status Patterns */}
              {analytics.statusAnalysis.length > 1 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-700 mb-3">
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">Relationship Stage Patterns</span>
                  </div>
                  <div className="bg-purple-100 p-3 rounded border-l-4 border-purple-500">
                    <h4 className="font-medium text-purple-800 mb-2">Pattern Analysis:</h4>
                    <div className="text-sm text-purple-700 space-y-2">
                      {analytics.statusAnalysis.slice(0, 2).map(status => (
                        <div key={status.status}>
                          <strong>{status.status.replace('-', ' ')} relationships:</strong> 
                          {status.avgEnergyChange > 0 ? (
                            <span className="text-green-600"> Energizing (+{status.avgEnergyChange.toFixed(1)})</span>
                          ) : (
                            <span className="text-red-600"> Draining ({status.avgEnergyChange.toFixed(1)})</span>
                          )}
                          {status.topEmotion && <span> • Often feel: {status.topEmotion}</span>}
                        </div>
                      ))}
                      <div className="mt-2 pt-2 border-t border-purple-200">
                        <strong>Insight:</strong> Notice how relationship stages affect your energy. 
                        Use this awareness to prepare for interactions and set appropriate boundaries.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Celebration */}
              {analytics.relationshipTypeAnalysis.filter(type => type.overallWellnessScore >= 70).length > 1 && (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">Relationship Wellness Strengths</span>
                  </div>
                  <p className="text-sm text-emerald-800">
                    <strong>Great news!</strong> You have {analytics.relationshipTypeAnalysis.filter(type => type.overallWellnessScore >= 70).length} relationship 
                    types with excellent wellness scores (70%+). This shows you know how to build and maintain healthy connections.
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