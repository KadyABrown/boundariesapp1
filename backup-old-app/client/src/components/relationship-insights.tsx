import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Calendar,
  Target,
  Brain,
  Lightbulb,
  ArrowRight,
  BarChart3,
  Zap,
  Heart,
  Users,
  MessageCircle,
  Eye
} from "lucide-react";

interface InteractionData {
  id: string;
  timestamp: string;
  flagType: 'red' | 'green';
  category: string;
  severity: 'low' | 'medium' | 'high';
  templateId: string;
  title: string;
  emotionalImpact: string;
  contextualData: {
    location: string;
    timeOfDay: string;
    witnesses: string;
    myEnergyBefore: string;
    myEnergyAfter: string;
  };
}

interface PatternInsight {
  id: string;
  type: 'trend' | 'warning' | 'cycle' | 'improvement' | 'trigger';
  title: string;
  description: string;
  confidence: number; // 0-100
  actionable: boolean;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  supportingData: string[];
}

interface RelationshipInsightsProps {
  relationshipId: number;
  relationshipName: string;
  interactions: InteractionData[];
}

export default function RelationshipInsights({ 
  relationshipId, 
  relationshipName, 
  interactions 
}: RelationshipInsightsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // Filter interactions by timeframe
  const filteredInteractions = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (selectedTimeframe) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoff.setMonth(now.getMonth() - 3);
        break;
    }

    return interactions.filter(i => new Date(i.timestamp) >= cutoff);
  }, [interactions, selectedTimeframe]);

  // Generate insights from interaction patterns
  const insights = useMemo(() => {
    const patterns: PatternInsight[] = [];

    if (filteredInteractions.length < 3) {
      return patterns;
    }

    // 1. Trend Analysis
    const redFlags = filteredInteractions.filter(i => i.flagType === 'red');
    const greenFlags = filteredInteractions.filter(i => i.flagType === 'green');
    const recentRed = redFlags.filter(i => 
      new Date(i.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const previousRed = redFlags.filter(i => {
      const date = new Date(i.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      return date <= weekAgo && date >= twoWeeksAgo;
    });

    if (recentRed.length > previousRed.length && recentRed.length > 2) {
      patterns.push({
        id: 'escalating-violations',
        type: 'warning',
        title: 'Escalating Boundary Violations',
        description: `Red flag incidents have increased ${Math.round(((recentRed.length - previousRed.length) / Math.max(previousRed.length, 1)) * 100)}% in the past week`,
        confidence: 85,
        actionable: true,
        severity: 'high',
        recommendations: [
          'Consider having a direct conversation about boundaries',
          'Document these incidents for future reference',
          'Evaluate if this relationship is becoming unsafe',
          'Reach out to trusted friends or therapist for support'
        ],
        supportingData: [
          `${recentRed.length} violations this week vs ${previousRed.length} last week`,
          `Most common: ${getMostCommonCategory(recentRed)}`
        ]
      });
    }

    // 2. Communication Pattern Analysis
    const communicationViolations = redFlags.filter(i => i.category === 'Communication');
    if (communicationViolations.length >= 3) {
      patterns.push({
        id: 'communication-issues',
        type: 'trend',
        title: 'Persistent Communication Problems',
        description: 'This person consistently struggles with respectful communication',
        confidence: 90,
        actionable: true,
        severity: 'medium',
        recommendations: [
          'Set clear communication boundaries before important conversations',
          'Use "I" statements to express your needs',
          'Consider ending conversations when they become disrespectful',
          'Practice phrases: "I need you to listen" or "Let me finish my thought"'
        ],
        supportingData: [
          `${communicationViolations.length} communication violations recorded`,
          'Pattern: Interrupting, dismissing, or talking over you'
        ]
      });
    }

    // 3. Energy Impact Analysis
    const energyDrains = filteredInteractions.filter(i => {
      const before = parseInt(i.contextualData.myEnergyBefore) || 5;
      const after = parseInt(i.contextualData.myEnergyAfter) || 5;
      return after < before - 2; // Significant energy drop
    });

    if (energyDrains.length > filteredInteractions.length * 0.6) {
      patterns.push({
        id: 'energy-drain',
        type: 'warning',
        title: 'Consistently Draining Your Energy',
        description: `${Math.round((energyDrains.length / filteredInteractions.length) * 100)}% of interactions leave you feeling drained`,
        confidence: 80,
        actionable: true,
        severity: 'high',
        recommendations: [
          'Limit time spent with this person',
          'Plan recovery time after interactions',
          'Notice what topics or situations drain you most',
          'Consider if this relationship is worth the energy cost'
        ],
        supportingData: [
          `Average energy drop: ${calculateAverageEnergyDrop(energyDrains)} points`,
          'This is significantly above normal interaction patterns'
        ]
      });
    }

    // 4. Positive Progress Recognition
    if (greenFlags.length > redFlags.length) {
      patterns.push({
        id: 'positive-trend',
        type: 'improvement',
        title: 'Relationship Showing Positive Signs',
        description: 'More positive interactions than concerning ones recently',
        confidence: 75,
        actionable: true,
        severity: 'low',
        recommendations: [
          'Acknowledge and appreciate the positive changes',
          'Continue setting clear boundaries',
          'Notice what leads to their best behavior',
          'Stay consistent with your standards'
        ],
        supportingData: [
          `${greenFlags.length} positive vs ${redFlags.length} concerning interactions`,
          `Strong areas: ${getMostCommonCategory(greenFlags)}`
        ]
      });
    }

    // 5. Location/Context Patterns
    const contextPatterns = analyzeContextPatterns(redFlags);
    if (contextPatterns.confidence > 70) {
      patterns.push({
        id: 'context-trigger',
        type: 'trigger',
        title: `Violations Often Happen ${contextPatterns.context}`,
        description: contextPatterns.description,
        confidence: contextPatterns.confidence,
        actionable: true,
        severity: 'medium',
        recommendations: [
          `Be extra vigilant during ${contextPatterns.context}`,
          'Have an exit strategy ready for these situations',
          'Consider avoiding this context when possible',
          'Prepare boundary-setting phrases in advance'
        ],
        supportingData: contextPatterns.supportingData
      });
    }

    // 6. Cycle Detection
    const cyclePattern = detectCycles(filteredInteractions);
    if (cyclePattern.detected) {
      patterns.push({
        id: 'behavioral-cycle',
        type: 'cycle',
        title: 'Repeating Behavioral Cycle Detected',
        description: cyclePattern.description,
        confidence: cyclePattern.confidence,
        actionable: true,
        severity: 'medium',
        recommendations: [
          'Document the cycle pattern to stay aware',
          'Interrupt the cycle by changing your response',
          'Don\'t expect permanent change without consistent effort from them',
          'Protect yourself during the "difficult" phases'
        ],
        supportingData: cyclePattern.supportingData
      });
    }

    return patterns.sort((a, b) => {
      // Sort by severity then confidence
      const severityWeight = { high: 3, medium: 2, low: 1 };
      if (severityWeight[a.severity] !== severityWeight[b.severity]) {
        return severityWeight[b.severity] - severityWeight[a.severity];
      }
      return b.confidence - a.confidence;
    });
  }, [filteredInteractions]);

  // Helper functions
  function getMostCommonCategory(interactions: InteractionData[]): string {
    const categories = interactions.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'General';
  }

  function calculateAverageEnergyDrop(interactions: InteractionData[]): number {
    const drops = interactions.map(i => {
      const before = parseInt(i.contextualData.myEnergyBefore) || 5;
      const after = parseInt(i.contextualData.myEnergyAfter) || 5;
      return before - after;
    });
    return Math.round(drops.reduce((sum, drop) => sum + drop, 0) / drops.length * 10) / 10;
  }

  function analyzeContextPatterns(redFlags: InteractionData[]) {
    const contexts = redFlags.reduce((acc, flag) => {
      const location = flag.contextualData.location?.toLowerCase() || '';
      const witnesses = flag.contextualData.witnesses?.toLowerCase() || '';
      
      if (location.includes('private') || location.includes('home') || witnesses.includes('alone')) {
        acc.private = (acc.private || 0) + 1;
      }
      if (location.includes('public') || witnesses.includes('others') || witnesses.includes('friends')) {
        acc.public = (acc.public || 0) + 1;
      }
      if (witnesses.includes('family') || location.includes('family')) {
        acc.family = (acc.family || 0) + 1;
      }
      
      return acc;
    }, {} as Record<string, number>);

    const total = redFlags.length;
    const maxContext = Object.entries(contexts)
      .sort(([,a], [,b]) => b - a)[0];

    if (!maxContext || maxContext[1] < total * 0.6) {
      return { confidence: 0, context: '', description: '', supportingData: [] };
    }

    const percentage = Math.round((maxContext[1] / total) * 100);
    return {
      confidence: Math.min(percentage, 90),
      context: maxContext[0] === 'private' ? 'in private' : 
               maxContext[0] === 'public' ? 'in public' : 'around family',
      description: `${percentage}% of violations occur ${maxContext[0] === 'private' ? 'when you\'re alone' : 
                   maxContext[0] === 'public' ? 'in public settings' : 'around family members'}`,
      supportingData: [
        `${maxContext[1]} out of ${total} violations in this context`,
        'This suggests their behavior changes based on audience'
      ]
    };
  }

  function detectCycles(interactions: InteractionData[]) {
    // Simple cycle detection - look for alternating patterns
    if (interactions.length < 6) {
      return { detected: false, description: '', confidence: 0, supportingData: [] };
    }

    const timeline = interactions
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(i => i.flagType);

    // Look for red-green-red patterns
    let cycles = 0;
    for (let i = 0; i < timeline.length - 2; i++) {
      if (timeline[i] === 'red' && timeline[i + 1] === 'green' && timeline[i + 2] === 'red') {
        cycles++;
      }
    }

    if (cycles >= 2) {
      return {
        detected: true,
        description: 'Pattern of violations followed by good behavior, then violations again',
        confidence: Math.min(80, cycles * 20),
        supportingData: [
          `${cycles} cycles detected in recent interactions`,
          'This pattern may indicate manipulation or lack of lasting change'
        ]
      };
    }

    return { detected: false, description: '', confidence: 0, supportingData: [] };
  }

  const getInsightIcon = (type: PatternInsight['type']) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'trend': return TrendingDown;
      case 'improvement': return TrendingUp;
      case 'cycle': return Clock;
      case 'trigger': return Zap;
      default: return Brain;
    }
  };

  const getInsightColor = (severity: string, type: string) => {
    if (type === 'improvement') return 'from-green-500 to-green-600';
    switch (severity) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-orange-500 to-orange-600';
      case 'low': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Calculate overall relationship health score
  const healthScore = useMemo(() => {
    if (filteredInteractions.length === 0) return 50;
    
    const redCount = filteredInteractions.filter(i => i.flagType === 'red').length;
    const greenCount = filteredInteractions.filter(i => i.flagType === 'green').length;
    const total = filteredInteractions.length;
    
    const greenRatio = greenCount / total;
    const redRatio = redCount / total;
    
    // Base score from ratio
    let score = (greenRatio * 100) - (redRatio * 50);
    
    // Adjust for severity of red flags
    const highSeverityRed = filteredInteractions.filter(i => 
      i.flagType === 'red' && i.severity === 'high'
    ).length;
    score -= highSeverityRed * 15;
    
    // Adjust for energy impact
    const energyDrains = filteredInteractions.filter(i => {
      const before = parseInt(i.contextualData.myEnergyBefore) || 5;
      const after = parseInt(i.contextualData.myEnergyAfter) || 5;
      return after < before - 2;
    });
    score -= (energyDrains.length / total) * 30;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [filteredInteractions]);

  const getHealthCategory = (score: number) => {
    if (score >= 80) return { label: 'Thriving', color: 'text-green-700', bg: 'bg-green-100' };
    if (score >= 60) return { label: 'Stable', color: 'text-blue-700', bg: 'bg-blue-100' };
    if (score >= 40) return { label: 'Concerning', color: 'text-orange-700', bg: 'bg-orange-100' };
    return { label: 'Toxic', color: 'text-red-700', bg: 'bg-red-100' };
  };

  const healthCategory = getHealthCategory(healthScore);

  return (
    <div className="space-y-6">
      {/* Header with Health Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              Relationship Intelligence
            </CardTitle>
            <div className="flex gap-2">
              {(['week', 'month', 'quarter'] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className="capitalize"
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Health Score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={healthScore >= 60 ? "#10b981" : healthScore >= 40 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 40 * (1 - healthScore / 100)
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{healthScore}</span>
                </div>
              </div>
              <Badge className={`${healthCategory.bg} ${healthCategory.color} border-0`}>
                {healthCategory.label}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredInteractions.filter(i => i.flagType === 'green').length}
                </div>
                <div className="text-sm text-gray-600">Positive Interactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredInteractions.filter(i => i.flagType === 'red').length}
                </div>
                <div className="text-sm text-gray-600">Red Flags</div>
              </div>
            </div>

            {/* Insights Summary */}
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{insights.length}</div>
              <div className="text-sm text-gray-600">Pattern Insights</div>
              <div className="text-xs text-gray-500 mt-1">
                {insights.filter(i => i.severity === 'high').length} high priority
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pattern Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Pattern Insights & Recommendations
          </h3>
          
          {insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            const colorClass = getInsightColor(insight.severity, insight.type);
            
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-l-4 ${
                  insight.severity === 'high' ? 'border-l-red-500' :
                  insight.severity === 'medium' ? 'border-l-orange-500' :
                  insight.type === 'improvement' ? 'border-l-green-500' :
                  'border-l-blue-500'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClass}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{insight.description}</p>
                        
                        {/* Supporting Data */}
                        {insight.supportingData.length > 0 && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Supporting Data:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {insight.supportingData.map((data, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-gray-400">•</span>
                                  <span>{data}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Recommendations */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Recommended Actions:
                          </h5>
                          <ul className="space-y-2">
                            {insight.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm">
                                <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* No Insights State */}
      {insights.length === 0 && filteredInteractions.length > 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Not enough data for pattern analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Log more interactions to unlock behavioral insights and recommendations
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Log New Interaction
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredInteractions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No interactions recorded
            </h3>
            <p className="text-gray-600 mb-4">
              Start logging interactions to see behavioral patterns and insights
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Log First Interaction
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}