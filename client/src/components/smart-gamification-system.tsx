import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Heart, 
  Target, 
  Zap, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Coffee,
  Sun,
  CloudRain
} from "lucide-react";
// import { AudioEffects } from "@/lib/audioEffects";
import AchievementToast from "./achievement-toast";

interface UserBehaviorData {
  recentInteractions: any[];
  relationships: any[];
  boundaryEntries: any[];
  dashboardStats: any;
}

interface SmartNotification {
  id: string;
  type: 'bounce-back' | 'daily-prompt' | 'achievement' | 'warning';
  title: string;
  message: string;
  icon: any;
  color: string;
  priority: 'high' | 'medium' | 'low';
  actionText?: string;
  action?: () => void;
  triggerCondition: string;
}

export default function SmartGamificationSystem() {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [achievementToShow, setAchievementToShow] = useState<any>(null);
  const [showAchievement, setShowAchievement] = useState(false);

  // Fetch user behavior data
  const { data: interactions } = useQuery({
    queryKey: ["/api/interactions"],
    retry: false,
  });

  const { data: relationships } = useQuery({
    queryKey: ["/api/relationships"],
    retry: false,
  });

  const { data: boundaryEntries } = useQuery({
    queryKey: ["/api/boundary-entries"],
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  useEffect(() => {
    if (interactions && relationships && boundaryEntries && stats) {
      analyzeUserBehaviorAndTriggerNotifications({
        recentInteractions: interactions,
        relationships,
        boundaryEntries,
        dashboardStats: stats
      });
    }
  }, [interactions, relationships, boundaryEntries, stats]);

  const analyzeUserBehaviorAndTriggerNotifications = (data: UserBehaviorData) => {
    const newNotifications: SmartNotification[] = [];
    
    // Analyze recent interaction patterns for "Bounce Back Stronger" triggers
    const recentNegativeInteractions = data.recentInteractions.filter((interaction: any) => {
      const energyChange = interaction.postEnergyLevel - interaction.preEnergyLevel;
      const hasPhysicalSymptoms = interaction.physicalSymptoms && interaction.physicalSymptoms.length > 0;
      const hasBoundaryViolations = interaction.boundariesViolated && interaction.boundariesViolated.length > 0;
      
      return energyChange <= -3 || hasPhysicalSymptoms || hasBoundaryViolations;
    });

    // Check for recovery patterns (negative interaction followed by positive recovery)
    const recentPositiveRecovery = data.recentInteractions.some((interaction: any, index: number) => {
      if (index === 0) return false;
      
      const previousInteraction = data.recentInteractions[index - 1];
      const currentEnergyChange = interaction.postEnergyLevel - interaction.preEnergyLevel;
      const previousEnergyChange = previousInteraction.postEnergyLevel - previousInteraction.preEnergyLevel;
      
      // Found a recovery pattern: negative followed by positive
      return previousEnergyChange <= -2 && currentEnergyChange >= 2;
    });

    // BOUNCE BACK STRONGER: Trigger when user shows resilience after difficult interactions
    if (recentNegativeInteractions.length > 0 && recentPositiveRecovery) {
      newNotifications.push({
        id: 'bounce-back-stronger',
        type: 'bounce-back',
        title: 'Bounce Back Stronger! 💪',
        message: `You recovered beautifully from a challenging interaction. That's real growth!`,
        icon: TrendingUp,
        color: 'from-emerald-500 to-green-600',
        priority: 'high',
        actionText: 'See Your Progress',
        action: () => window.location.href = '/insights',
        triggerCondition: 'Negative interaction followed by positive recovery'
      });
    }

    // BOUNDARY SUCCESS: When user successfully maintains boundaries despite pressure
    const successfulBoundaryDefense = data.recentInteractions.some((interaction: any) => {
      const boundariesMet = interaction.boundariesMet && interaction.boundariesMet.length > 0;
      const boundariesViolated = interaction.boundariesViolated && interaction.boundariesViolated.length > 0;
      const boundaryTesting = interaction.boundaryTesting === true;
      
      // Successfully maintained boundaries despite testing
      return boundariesMet && !boundariesViolated && boundaryTesting;
    });

    if (successfulBoundaryDefense) {
      newNotifications.push({
        id: 'boundary-champion',
        type: 'achievement',
        title: 'Boundary Champion! 🛡️',
        message: 'You stood strong when your boundaries were tested. That takes courage!',
        icon: Shield,
        color: 'from-purple-500 to-indigo-600',
        priority: 'high',
        actionText: 'View Achievement',
        action: () => {
          triggerAchievement({
            id: 'boundary-defender',
            title: 'Boundary Defender',
            description: 'Successfully maintained boundaries under pressure',
            icon: 'Shield',
            category: 'special',
            points: 25,
            threshold: 1,
            progress: 1,
            unlocked: true,
            unlockedAt: new Date()
          });
        },
        triggerCondition: 'Maintained boundaries despite testing'
      });
    }

    // DAILY PROMPT: For regular active users who haven't logged today
    const lastInteractionDate = data.recentInteractions[0]?.createdAt;
    const hoursSinceLastInteraction = lastInteractionDate ? 
      (Date.now() - new Date(lastInteractionDate).getTime()) / (1000 * 60 * 60) : 24;
    
    const isActiveUser = data.recentInteractions.length >= 3; // 3+ interactions total
    const needsDailyPrompt = hoursSinceLastInteraction >= 8 && hoursSinceLastInteraction < 48;

    if (isActiveUser && needsDailyPrompt) {
      newNotifications.push({
        id: 'daily-check-in',
        type: 'daily-prompt',
        title: 'Daily Reflection Time ☀️',
        message: 'How did your relationships feel today? A quick check-in helps track patterns.',
        icon: Sun,
        color: 'from-amber-400 to-orange-500',
        priority: 'medium',
        actionText: 'Quick Check-in',
        action: () => document.getElementById('boundary-form')?.scrollIntoView({ behavior: 'smooth' }),
        triggerCondition: 'Active user, 8+ hours since last interaction'
      });
    }

    // ENERGY DRAIN WARNING: Multiple draining interactions in workplace relationships
    const workplaceRelationships = data.relationships.filter((rel: any) => 
      rel.relationshipType === 'workplace'
    );
    
    const workplaceInteractions = data.recentInteractions.filter((interaction: any) =>
      workplaceRelationships.some((rel: any) => rel.id === interaction.relationshipId)
    );

    const drainingWorkplacePattern = workplaceInteractions.filter((interaction: any) => {
      const energyChange = interaction.postEnergyLevel - interaction.preEnergyLevel;
      return energyChange <= -2;
    }).length >= 2;

    if (drainingWorkplacePattern) {
      newNotifications.push({
        id: 'workplace-energy-drain',
        type: 'warning',
        title: 'Workplace Energy Alert ⚠️',
        message: 'Your workplace interactions are consistently draining. Consider protective strategies.',
        icon: AlertTriangle,
        color: 'from-orange-500 to-red-500',
        priority: 'high',
        actionText: 'See Recommendations',
        action: () => window.location.href = '/insights?tab=wellness',
        triggerCondition: 'Multiple draining workplace interactions'
      });
    }

    // RELATIONSHIP GROWTH: Positive trend in previously challenging relationship
    const improvingRelationships = data.relationships.filter((rel: any) => {
      const relInteractions = data.recentInteractions
        .filter((interaction: any) => interaction.relationshipId === rel.id)
        .slice(0, 3); // Last 3 interactions
      
      if (relInteractions.length < 2) return false;
      
      const recentEnergyChange = relInteractions[0].postEnergyLevel - relInteractions[0].preEnergyLevel;
      const olderEnergyChange = relInteractions[1].postEnergyLevel - relInteractions[1].preEnergyLevel;
      
      return olderEnergyChange <= -1 && recentEnergyChange >= 2; // Improvement pattern
    });

    if (improvingRelationships.length > 0) {
      newNotifications.push({
        id: 'relationship-growth',
        type: 'achievement',
        title: 'Relationship Growth! 🌱',
        message: `Your relationship with ${improvingRelationships[0].name} is showing positive changes!`,
        icon: Heart,
        color: 'from-pink-500 to-rose-600',
        priority: 'medium',
        actionText: 'View Progress',
        action: () => window.location.href = `/relationships/${improvingRelationships[0].id}`,
        triggerCondition: 'Positive trend in previously challenging relationship'
      });
    }

    // Update notifications state
    setNotifications(newNotifications.slice(0, 2)); // Show max 2 notifications
  };

  const triggerAchievement = (achievement: any) => {
    setAchievementToShow(achievement);
    setShowAchievement(true);
    // AudioEffects.playAchievementUnlock();
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <>
      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className={`border-l-4 ${
                notification.priority === 'high' ? 'border-l-red-500' :
                notification.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
              } shadow-md`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${notification.color} text-white`}>
                        <notification.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                        
                        {notification.actionText && (
                          <Button
                            size="sm"
                            className={`bg-gradient-to-r ${notification.color} hover:shadow-lg transition-all duration-200`}
                            onClick={notification.action}
                          >
                            {notification.actionText}
                          </Button>
                        )}
                        
                        <div className="mt-2 text-xs text-gray-400">
                          Triggered by: {notification.triggerCondition}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Achievement Toast */}
      <AchievementToast
        achievement={achievementToShow}
        onClose={() => {
          setShowAchievement(false);
          setAchievementToShow(null);
        }}
        isVisible={showAchievement}
      />
    </>
  );
}