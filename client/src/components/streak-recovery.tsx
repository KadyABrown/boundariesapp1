import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Target, 
  Lightbulb, 
  Heart, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { AudioEffects } from "@/lib/audioEffects";

interface StreakRecoveryProps {
  currentStreak: number;
  longestStreak: number;
  daysSinceLastEntry: number;
  onStartRecovery?: () => void;
  onQuickEntry?: () => void;
}

interface RecoveryAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: string;
  action: () => void;
}

export default function StreakRecovery({ 
  currentStreak, 
  longestStreak, 
  daysSinceLastEntry,
  onStartRecovery,
  onQuickEntry
}: StreakRecoveryProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Show recovery options when streak is broken (no entries for 2+ days)
  const needsRecovery = daysSinceLastEntry >= 2;
  const isEmergency = daysSinceLastEntry >= 7; // Week without entries

  const recoveryActions: RecoveryAction[] = [
    {
      id: 'quick-reflection',
      title: 'Quick Reflection',
      description: 'Share one boundary experience from today',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      points: 5,
      difficulty: 'easy',
      timeEstimate: '2 min',
      action: () => {
        AudioEffects.playAchievementUnlock();
        onQuickEntry?.();
      }
    },
    {
      id: 'boundary-check',
      title: 'Boundary Check-in',
      description: 'Review your active boundaries and update status',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      points: 10,
      difficulty: 'easy',
      timeEstimate: '5 min',
      action: () => {
        AudioEffects.playAchievementUnlock();
        window.location.href = '/boundaries';
      }
    },
    {
      id: 'relationship-update',
      title: 'Relationship Update',
      description: 'Log recent interactions and flag behaviors',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      points: 15,
      difficulty: 'medium',
      timeEstimate: '10 min',
      action: () => {
        AudioEffects.playAchievementUnlock();
        window.location.href = '/relationships';
      }
    },
    {
      id: 'goal-reset',
      title: 'Goal Reset & Planning',
      description: 'Set new boundary goals and create action plan',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      points: 25,
      difficulty: 'hard',
      timeEstimate: '15 min',
      action: () => {
        AudioEffects.playLevelUp();
        // Open goal setting modal or navigate to planning page
        onStartRecovery?.();
      }
    }
  ];

  const handleActionSelect = (action: RecoveryAction) => {
    setSelectedAction(action.id);
    setIsRecovering(true);
    
    setTimeout(() => {
      action.action();
      setIsRecovering(false);
    }, 1000);
  };

  const getMotivationalMessage = () => {
    if (isEmergency) {
      return {
        title: "Time to Reconnect",
        message: "It's been a week since your last check-in. Let's gently restart your boundary journey.",
        type: "emergency" as const
      };
    } else if (daysSinceLastEntry >= 4) {
      return {
        title: "Missing You!",  
        message: "Your boundaries need some attention. A small step today can make a big difference.",
        type: "warning" as const
      };
    } else {
      return {
        title: "Bounce Back Stronger",
        message: "Every boundary expert has off days. Let's rebuild your streak together!",
        type: "encouraging" as const
      };
    }
  };

  const getStreakProgress = () => {
    if (longestStreak === 0) return 0;
    return Math.min((currentStreak / longestStreak) * 100, 100);
  };

  if (!needsRecovery) return null;

  const motivation = getMotivationalMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className={`border-2 ${
        motivation.type === 'emergency' ? 'border-red-200 bg-red-50' :
        motivation.type === 'warning' ? 'border-orange-200 bg-orange-50' :
        'border-blue-200 bg-blue-50'
      }`}>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${
              motivation.type === 'emergency' ? 'bg-red-100' :
              motivation.type === 'warning' ? 'bg-orange-100' :
              'bg-blue-100'
            }`}>
              {motivation.type === 'emergency' ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <RefreshCw className="w-6 h-6 text-blue-600" />
              )}
            </div>
            
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{motivation.title}</CardTitle>
              <p className="text-gray-600 mb-4">{motivation.message}</p>
              
              {/* Streak Status */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{currentStreak}</p>
                  <p className="text-xs text-gray-500">Current Streak</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Progress to Personal Best</span>
                    <span className="text-sm font-medium">{longestStreak} days</span>
                  </div>
                  <Progress value={getStreakProgress()} className="h-2" />
                </div>
              </div>

              {/* Days Since Last Entry */}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {daysSinceLastEntry} {daysSinceLastEntry === 1 ? 'day' : 'days'} since last entry
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Choose Your Recovery Path
            </h3>

            <div className="grid gap-3">
              {recoveryActions.map((action) => (
                <motion.div
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAction === action.id 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => handleActionSelect(action)}
                >
                  {/* Background gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-5`} 
                  />
                  
                  <div className="relative p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-800">{action.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              +{action.points} pts
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {action.timeEstimate}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                action.difficulty === 'easy' ? 'border-green-300 text-green-700' :
                                action.difficulty === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                'border-red-300 text-red-700'
                              }`}
                            >
                              {action.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Loading overlay */}
                  <AnimatePresence>
                    {isRecovering && selectedAction === action.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/80 flex items-center justify-center"
                      >
                        <div className="flex items-center gap-2 text-blue-600">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="w-5 h-5" />
                          </motion.div>
                          <span className="font-medium">Starting...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Complete any action to restart your streak</span>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-blue-600"
                  onClick={() => window.location.href = '/profile'}
                >
                  View Progress →
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}