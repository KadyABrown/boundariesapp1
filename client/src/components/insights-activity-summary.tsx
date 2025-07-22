import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  AlertTriangle,
  Heart,
  CloudRain,
  Sun,
  Activity,
  X,
  ArrowRight
} from "lucide-react";

interface ActivitySummary {
  hasNewRecommendations: boolean;
  relationshipWeatherChanges: Array<{
    name: string;
    oldCondition: string;
    newCondition: string;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  recentInteractions: number;
  newStatusChanges: Array<{
    name: string;
    oldStatus: string;
    newStatus: string;
  }>;
  energyTrends: {
    improving: string[];
    declining: string[];
  };
  lastVisited: Date | null;
}

interface InsightsActivitySummaryProps {
  onDismiss?: () => void;
  onNavigateToRecommendations?: () => void;
}

export default function InsightsActivitySummary({ 
  onDismiss, 
  onNavigateToRecommendations 
}: InsightsActivitySummaryProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastVisitTime, setLastVisitTime] = useState<Date | null>(null);

  // Fetch user data to analyze changes
  const { data: interactions } = useQuery({
    queryKey: ["/api/interactions"],
    retry: false,
  });

  const { data: relationships } = useQuery({
    queryKey: ["/api/relationships"],
    retry: false,
  });

  // Get last visit time from localStorage
  useEffect(() => {
    const lastVisit = localStorage.getItem('insights-last-visit');
    if (lastVisit) {
      setLastVisitTime(new Date(lastVisit));
    }
    
    // Update last visit time
    localStorage.setItem('insights-last-visit', new Date().toISOString());
  }, []);

  const generateActivitySummary = (): ActivitySummary | null => {
    if (!interactions || !Array.isArray(interactions) || !relationships || !Array.isArray(relationships) || !lastVisitTime) return null;

    // Filter interactions since last visit
    const recentInteractions = interactions.filter((interaction: any) => 
      new Date(interaction.createdAt) > lastVisitTime
    );

    // Analyze energy trends
    const energyTrends = analyzeEnergyTrends(recentInteractions);
    
    // Detect relationship weather changes (simplified simulation)
    const weatherChanges = detectWeatherChanges(relationships, recentInteractions);
    
    // Find status changes (relationships that changed status recently)
    const statusChanges = detectStatusChanges(relationships, lastVisitTime);

    // Check if there are new recommendations (based on recent negative patterns)
    const hasNewRecommendations = recentInteractions.some((interaction: any) => {
      const energyChange = (interaction.postEnergyLevel || 5) - (interaction.preEnergyLevel || 5);
      const hasSymptoms = interaction.physicalSymptoms && Array.isArray(interaction.physicalSymptoms) && interaction.physicalSymptoms.length > 0;
      return energyChange <= -3 || hasSymptoms;
    });

    return {
      hasNewRecommendations,
      relationshipWeatherChanges: weatherChanges,
      recentInteractions: recentInteractions.length,
      newStatusChanges: statusChanges,
      energyTrends,
      lastVisited: lastVisitTime
    };
  };

  const analyzeEnergyTrends = (recentInteractions: any[]) => {
    if (!Array.isArray(relationships)) return { improving: [], declining: [] };
    
    const relationshipTrends: { [key: string]: number[] } = {};
    
    // Group interactions by relationship
    recentInteractions.forEach((interaction: any) => {
      const relId = interaction.relationshipId;
      if (!relationshipTrends[relId]) relationshipTrends[relId] = [];
      
      const energyChange = (interaction.postEnergyLevel || 5) - (interaction.preEnergyLevel || 5);
      relationshipTrends[relId].push(energyChange);
    });

    const improving: string[] = [];
    const declining: string[] = [];

    Object.entries(relationshipTrends).forEach(([relId, changes]) => {
      if (changes.length < 2) return;
      
      const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
      const relName = relationships.find((r: any) => r.id.toString() === relId)?.name || 'Unknown';
      
      if (avgChange >= 2) improving.push(relName);
      else if (avgChange <= -2) declining.push(relName);
    });

    return { improving, declining };
  };

  const detectWeatherChanges = (relationships: any[], recentInteractions: any[]) => {
    if (!Array.isArray(relationships)) return [];
    
    // Simplified weather detection based on recent interaction patterns
    return relationships.slice(0, 2).map((rel: any) => {
      const relInteractions = recentInteractions.filter(i => i.relationshipId === rel.id);
      if (relInteractions.length === 0) return null;

      const avgEnergyChange = relInteractions.reduce((sum: number, i: any) => 
        sum + ((i.postEnergyLevel || 5) - (i.preEnergyLevel || 5)), 0
      ) / relInteractions.length;

      let newCondition = 'Partly Cloudy';
      let trend: 'improving' | 'declining' | 'stable' = 'stable';

      if (avgEnergyChange >= 2) {
        newCondition = 'Sunny';
        trend = 'improving';
      } else if (avgEnergyChange <= -2) {
        newCondition = 'Stormy';
        trend = 'declining';
      }

      return {
        name: rel.name,
        oldCondition: 'Cloudy', // Simplified - would track previous state
        newCondition,
        trend
      };
    }).filter(Boolean) as Array<{
      name: string;
      oldCondition: string;
      newCondition: string;
      trend: 'improving' | 'declining' | 'stable';
    }>;
  };

  const detectStatusChanges = (relationships: any[], lastVisit: Date) => {
    if (!Array.isArray(relationships)) return [];
    
    // Simplified status change detection
    return relationships.filter((rel: any) => {
      const updatedAt = new Date(rel.updatedAt || rel.createdAt);
      return updatedAt > lastVisit;
    }).slice(0, 2).map((rel: any) => ({
      name: rel.name,
      oldStatus: 'interested', // Simplified
      newStatus: rel.status || 'interested'
    }));
  };

  const summary = generateActivitySummary();

  if (!summary || !isVisible) return null;

  const hasAnyActivity = summary.hasNewRecommendations || 
                        summary.recentInteractions > 0 || 
                        summary.relationshipWeatherChanges.length > 0 ||
                        summary.newStatusChanges.length > 0;

  if (!hasAnyActivity) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const timeSinceLastVisit = lastVisitTime ? 
    Math.round((Date.now() - lastVisitTime.getTime()) / (1000 * 60 * 60)) : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    What's New Since Your Last Visit
                  </h3>
                  <p className="text-sm text-blue-700">
                    {timeSinceLastVisit > 0 && `${timeSinceLastVisit} hours ago`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* New Recommendations Alert */}
              {summary.hasNewRecommendations && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-orange-100 border border-orange-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-800">New Recommendations</span>
                    <Badge variant="destructive" className="text-xs">Alert</Badge>
                  </div>
                  <p className="text-sm text-orange-700 mb-3">
                    Your recent interactions triggered new personalized wellness strategies.
                  </p>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={onNavigateToRecommendations}
                  >
                    View Recommendations
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </motion.div>
              )}

              {/* Recent Activity Summary */}
              {summary.recentInteractions > 0 && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Activity Summary</span>
                  </div>
                  <p className="text-sm text-green-700">
                    <strong>{summary.recentInteractions}</strong> new interactions logged
                  </p>
                  {summary.energyTrends.improving.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      ↗️ Energy improving: {summary.energyTrends.improving.join(', ')}
                    </p>
                  )}
                  {summary.energyTrends.declining.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      ↘️ Energy declining: {summary.energyTrends.declining.join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Weather Changes */}
              {summary.relationshipWeatherChanges.length > 0 && (
                <div className="bg-purple-100 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CloudRain className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Weather Updates</span>
                  </div>
                  <div className="space-y-2">
                    {summary.relationshipWeatherChanges.map((change, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-purple-800">{change.name}</div>
                        <div className="flex items-center gap-2 text-xs text-purple-600">
                          {change.trend === 'improving' ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : change.trend === 'declining' ? (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          ) : (
                            <Sun className="h-3 w-3 text-yellow-600" />
                          )}
                          <span>{change.oldCondition} → {change.newCondition}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Changes */}
              {summary.newStatusChanges.length > 0 && (
                <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Status Changes</span>
                  </div>
                  {summary.newStatusChanges.map((change, index) => (
                    <div key={index} className="text-sm text-yellow-700">
                      <strong>{change.name}</strong> status updated to{' '}
                      <Badge variant="outline" className="text-xs">
                        {change.newStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Hint */}
            <div className="flex items-center justify-between pt-4 border-t border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Clock className="h-4 w-4" />
                <span>Check the Analytics tab for detailed wellness recommendations</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToRecommendations}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Go to Analytics
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}