import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Heart, 
  Battery, 
  Brain,
  Activity,
  Shield,
  Clock,
  Target,
  Thermometer,
  Zap
} from "lucide-react";

interface ComprehensiveInteractionData {
  timestamp: string;
  energyBefore: number;
  energyAfter: number;
  anxietyBefore: number;
  anxietyAfter: number;
  selfWorthBefore: number;
  selfWorthAfter: number;
  physicalSymptomsAfter: string[];
  emotionalStateAfter: string[];
  recoveryTime: number;
  recoveryStrategies: string[];
  whatHelped: string[];
  boundariesMaintained: string[];
  copingSkillsUsed: string[];
  supportSystemEngaged: boolean;
  interactionType: string;
  duration: number;
  boundariesTested: boolean;
}

interface RelationshipHealthAnalyticsProps {
  interactions: ComprehensiveInteractionData[];
  relationshipName: string;
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
}

export default function RelationshipHealthAnalytics({
  interactions,
  relationshipName,
  timeframe = 'month'
}: RelationshipHealthAnalyticsProps) {
  
  // Filter interactions by timeframe
  const filteredInteractions = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeframe) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoff.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }

    return interactions.filter(i => new Date(i.timestamp) >= cutoff);
  }, [interactions, timeframe]);

  // Calculate comprehensive metrics
  const healthMetrics = useMemo(() => {
    if (filteredInteractions.length === 0) {
      return {
        energyImpact: 0,
        anxietyImpact: 0,
        selfWorthImpact: 0,
        averageRecoveryTime: 0,
        physicalSymptomFrequency: 0,
        boundaryViolationRate: 0,
        supportEngagementRate: 0,
        copingSkillsEffectiveness: 0,
        overallHealthScore: 50,
        riskLevel: 'unknown' as const
      };
    }

    const totalInteractions = filteredInteractions.length;
    
    // Energy Impact Analysis
    const energyChanges = filteredInteractions.map(i => i.energyAfter - i.energyBefore);
    const avgEnergyImpact = energyChanges.reduce((sum, change) => sum + change, 0) / totalInteractions;
    
    // Anxiety Impact Analysis
    const anxietyChanges = filteredInteractions.map(i => i.anxietyAfter - i.anxietyBefore);
    const avgAnxietyImpact = anxietyChanges.reduce((sum, change) => sum + change, 0) / totalInteractions;
    
    // Self-Worth Impact Analysis
    const selfWorthChanges = filteredInteractions.map(i => i.selfWorthAfter - i.selfWorthBefore);
    const avgSelfWorthImpact = selfWorthChanges.reduce((sum, change) => sum + change, 0) / totalInteractions;
    
    // Recovery Time Analysis
    const avgRecoveryTime = filteredInteractions.reduce((sum, i) => sum + i.recoveryTime, 0) / totalInteractions;
    
    // Physical Symptoms Frequency
    const interactionsWithSymptoms = filteredInteractions.filter(i => i.physicalSymptomsAfter.length > 0).length;
    const physicalSymptomFreq = (interactionsWithSymptoms / totalInteractions) * 100;
    
    // Boundary Violation Rate
    const boundaryViolations = filteredInteractions.filter(i => i.boundariesTested).length;
    const boundaryViolationRate = (boundaryViolations / totalInteractions) * 100;
    
    // Support System Engagement
    const supportEngaged = filteredInteractions.filter(i => i.supportSystemEngaged).length;
    const supportEngagementRate = (supportEngaged / totalInteractions) * 100;
    
    // Coping Skills Effectiveness (interactions where coping skills were used and recovery was faster)
    const effectiveCoping = filteredInteractions.filter(i => 
      i.copingSkillsUsed.length > 0 && i.recoveryTime <= avgRecoveryTime
    ).length;
    const copingEffectiveness = totalInteractions > 0 ? (effectiveCoping / totalInteractions) * 100 : 0;
    
    // Overall Health Score Calculation
    let healthScore = 50; // Base score
    
    // Energy impact (positive = good, negative = bad)
    healthScore += avgEnergyImpact * 10;
    
    // Anxiety impact (negative = good, positive = bad)
    healthScore -= avgAnxietyImpact * 8;
    
    // Self-worth impact (positive = good, negative = bad)
    healthScore += avgSelfWorthImpact * 12;
    
    // Recovery time (lower = better)
    healthScore -= (avgRecoveryTime / 60) * 5; // Penalty for long recovery
    
    // Physical symptoms (lower = better)
    healthScore -= physicalSymptomFreq * 0.8;
    
    // Boundary violations (lower = better)
    healthScore -= boundaryViolationRate * 1.2;
    
    // Support engagement (higher = better, up to a point)
    healthScore += Math.min(supportEngagementRate * 0.3, 15);
    
    // Coping effectiveness (higher = better)
    healthScore += copingEffectiveness * 0.4;
    
    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));
    
    // Risk Level Determination
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (healthScore >= 70) riskLevel = 'low';
    else if (healthScore >= 50) riskLevel = 'medium';
    else if (healthScore >= 30) riskLevel = 'high';
    else riskLevel = 'critical';

    return {
      energyImpact: avgEnergyImpact,
      anxietyImpact: avgAnxietyImpact,
      selfWorthImpact: avgSelfWorthImpact,
      averageRecoveryTime: avgRecoveryTime,
      physicalSymptomFrequency: physicalSymptomFreq,
      boundaryViolationRate: boundaryViolationRate,
      supportEngagementRate: supportEngagementRate,
      copingSkillsEffectiveness: copingEffectiveness,
      overallHealthScore: healthScore,
      riskLevel
    };
  }, [filteredInteractions]);

  // Prepare trend data for charts
  const trendData = useMemo(() => {
    return filteredInteractions.map((interaction, index) => ({
      date: new Date(interaction.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      energyChange: interaction.energyAfter - interaction.energyBefore,
      anxietyChange: interaction.anxietyAfter - interaction.anxietyBefore,
      selfWorthChange: interaction.selfWorthAfter - interaction.selfWorthBefore,
      recoveryTime: interaction.recoveryTime,
      physicalSymptoms: interaction.physicalSymptomsAfter.length,
      index
    }));
  }, [filteredInteractions]);

  // Physical symptoms analysis
  const physicalSymptomsAnalysis = useMemo(() => {
    const symptomCounts: Record<string, number> = {};
    filteredInteractions.forEach(interaction => {
      interaction.physicalSymptomsAfter.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });
    
    return Object.entries(symptomCounts)
      .map(([symptom, count]) => ({
        symptom,
        count,
        percentage: Math.round((count / filteredInteractions.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredInteractions]);

  // Recovery strategies effectiveness
  const recoveryEffectiveness = useMemo(() => {
    const strategyStats: Record<string, { uses: number; avgRecoveryTime: number }> = {};
    
    filteredInteractions.forEach(interaction => {
      interaction.recoveryStrategies.forEach(strategy => {
        if (!strategyStats[strategy]) {
          strategyStats[strategy] = { uses: 0, avgRecoveryTime: 0 };
        }
        strategyStats[strategy].uses++;
        strategyStats[strategy].avgRecoveryTime += interaction.recoveryTime;
      });
    });

    return Object.entries(strategyStats)
      .map(([strategy, stats]) => ({
        strategy,
        uses: stats.uses,
        avgRecoveryTime: Math.round(stats.avgRecoveryTime / stats.uses),
        effectiveness: Math.round((1 / (stats.avgRecoveryTime / stats.uses)) * 1000) // Inverse of recovery time
      }))
      .sort((a, b) => a.avgRecoveryTime - b.avgRecoveryTime)
      .slice(0, 6);
  }, [filteredInteractions]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 border-green-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  if (filteredInteractions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No interaction data available</h3>
          <p className="text-gray-600">Log interactions to see comprehensive health analytics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Overall Health Score */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Relationship Health Analytics: {relationshipName}
            </span>
            <Badge className={`px-3 py-1 ${getRiskColor(healthMetrics.riskLevel)}`}>
              {healthMetrics.riskLevel.toUpperCase()} RISK
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Health Score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="50" cy="50" r="40"
                    stroke={healthMetrics.overallHealthScore >= 70 ? "#10b981" : 
                           healthMetrics.overallHealthScore >= 50 ? "#f59e0b" :
                           healthMetrics.overallHealthScore >= 30 ? "#f97316" : "#ef4444"}
                    strokeWidth="8" fill="none" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - healthMetrics.overallHealthScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getHealthScoreColor(healthMetrics.overallHealthScore)}`}>
                    {healthMetrics.overallHealthScore}
                  </span>
                </div>
              </div>
              <h3 className="font-medium text-gray-800">Health Score</h3>
              <p className="text-sm text-gray-600">Based on {filteredInteractions.length} interactions</p>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Energy Impact</span>
                  <span className={`text-sm font-medium ${
                    healthMetrics.energyImpact > 0 ? 'text-green-600' : 
                    healthMetrics.energyImpact < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {healthMetrics.energyImpact > 0 ? '+' : ''}{healthMetrics.energyImpact.toFixed(1)}
                  </span>
                </div>
                <Progress 
                  value={Math.abs(healthMetrics.energyImpact) * 10} 
                  className={`h-2 ${healthMetrics.energyImpact >= 0 ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Recovery Time</span>
                  <span className="text-sm font-medium text-gray-800">
                    {healthMetrics.averageRecoveryTime < 60 ? 
                      `${Math.round(healthMetrics.averageRecoveryTime)} min` :
                      `${(healthMetrics.averageRecoveryTime / 60).toFixed(1)} hrs`
                    }
                  </span>
                </div>
                <Progress value={Math.min(100, (healthMetrics.averageRecoveryTime / 240) * 100)} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Boundary Violations</span>
                  <span className="text-sm font-medium text-red-600">
                    {healthMetrics.boundaryViolationRate.toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={healthMetrics.boundaryViolationRate} 
                  className="h-2 [&>div]:bg-red-500"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Physical Symptoms</span>
                  <span className="text-sm font-medium text-orange-600">
                    {healthMetrics.physicalSymptomFrequency.toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={healthMetrics.physicalSymptomFrequency} 
                  className="h-2 [&>div]:bg-orange-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Self-Worth Impact</span>
                  <span className={`text-sm font-medium ${
                    healthMetrics.selfWorthImpact > 0 ? 'text-green-600' : 
                    healthMetrics.selfWorthImpact < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {healthMetrics.selfWorthImpact > 0 ? '+' : ''}{healthMetrics.selfWorthImpact.toFixed(1)}
                  </span>
                </div>
                <Progress 
                  value={Math.abs(healthMetrics.selfWorthImpact) * 10} 
                  className={`h-2 ${healthMetrics.selfWorthImpact >= 0 ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Support Engagement</span>
                  <span className="text-sm font-medium text-blue-600">
                    {healthMetrics.supportEngagementRate.toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={healthMetrics.supportEngagementRate} 
                  className="h-2 [&>div]:bg-blue-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy and Mood Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Energy & Self-Worth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[-5, 5]} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value > 0 ? '+' : ''}${value.toFixed(1)}`,
                    name === 'energyChange' ? 'Energy Change' : 'Self-Worth Change'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="energyChange" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="energyChange"
                />
                <Line 
                  type="monotone" 
                  dataKey="selfWorthChange" 
                  stroke="#ec4899" 
                  strokeWidth={2}
                  name="selfWorthChange"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recovery Time and Anxiety */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Recovery & Anxiety Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'recoveryTime' ? `${value} min` : `${value > 0 ? '+' : ''}${value}`,
                    name === 'recoveryTime' ? 'Recovery Time' : 'Anxiety Change'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="recoveryTime" 
                  stackId="1"
                  stroke="#f97316" 
                  fill="#fed7aa"
                />
                <Line 
                  type="monotone" 
                  dataKey="anxietyChange" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Physical Symptoms Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-600" />
              Most Common Physical Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {physicalSymptomsAnalysis.map((symptom, index) => (
                <div key={symptom.symptom} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{symptom.symptom}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(symptom.count / filteredInteractions.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{symptom.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recovery Strategy Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Most Effective Recovery Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recoveryEffectiveness.map((strategy, index) => (
                <div key={strategy.strategy} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{strategy.strategy}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {strategy.uses} uses
                    </Badge>
                    <span className="text-sm text-green-600 font-medium">
                      {strategy.avgRecoveryTime < 60 ? 
                        `${strategy.avgRecoveryTime}m` : 
                        `${(strategy.avgRecoveryTime / 60).toFixed(1)}h`
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Alerts */}
      {healthMetrics.riskLevel === 'high' || healthMetrics.riskLevel === 'critical' && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Health Concerns Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthMetrics.energyImpact < -2 && (
                <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg">
                  <Battery className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Severe Energy Drain</h4>
                    <p className="text-sm text-red-700">
                      This relationship consistently drains your energy by {Math.abs(healthMetrics.energyImpact).toFixed(1)} points on average.
                    </p>
                  </div>
                </div>
              )}
              
              {healthMetrics.physicalSymptomFrequency > 50 && (
                <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg">
                  <Thermometer className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">High Physical Impact</h4>
                    <p className="text-sm text-red-700">
                      {healthMetrics.physicalSymptomFrequency.toFixed(0)}% of interactions cause physical symptoms. Consider consulting a healthcare provider.
                    </p>
                  </div>
                </div>
              )}
              
              {healthMetrics.selfWorthImpact < -1.5 && (
                <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg">
                  <Heart className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Self-Worth Erosion</h4>
                    <p className="text-sm text-red-700">
                      This relationship is significantly impacting your self-worth. Consider professional support or limiting contact.
                    </p>
                  </div>
                </div>
              )}
              
              {healthMetrics.averageRecoveryTime > 180 && (
                <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg">
                  <Clock className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Extended Recovery Time</h4>
                    <p className="text-sm text-red-700">
                      You need {(healthMetrics.averageRecoveryTime / 60).toFixed(1)} hours on average to recover. This is concerning for your wellbeing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}