import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AudioEffects } from "@/lib/audioEffects";
import { 
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  Heart,
  Zap,
  Star,
  Gift,
  Sparkles
} from "lucide-react";

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: any;
  points: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
  type: 'log' | 'reflect' | 'respect' | 'streak';
  deadline: Date;
}

interface DailyChallengesProps {
  onCompleteChallenge?: (challengeId: string) => void;
}

const getDailyChallenge = (): DailyChallenge[] => {
  const today = new Date();
  const challenges = [
    {
      id: 'daily_entry',
      title: 'Daily Check-In',
      description: 'Log at least one boundary entry today',
      icon: Target,
      points: 25,
      completed: false,
      progress: 0,
      maxProgress: 1,
      type: 'log' as const,
      deadline: new Date(today.setHours(23, 59, 59, 999))
    },
    {
      id: 'reflection_time',
      title: 'Mindful Moment',
      description: 'Take 2 minutes to reflect on your boundaries',
      icon: Heart,
      points: 15,
      completed: false,
      progress: 0,
      maxProgress: 1,
      type: 'reflect' as const,
      deadline: new Date(today.setHours(23, 59, 59, 999))
    },
    {
      id: 'respect_boundary',
      title: 'Boundary Champion',
      description: 'Respect 3 boundaries throughout the day',
      icon: Star,
      points: 35,
      completed: false,
      progress: 0,
      maxProgress: 3,
      type: 'respect' as const,
      deadline: new Date(today.setHours(23, 59, 59, 999))
    }
  ];

  return challenges;
};

export default function DailyChallenges({ onCompleteChallenge }: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<DailyChallenge[]>(getDailyChallenge());
  const [confetti, setConfetti] = useState(false);

  const completedCount = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.reduce((sum, c) => sum + (c.completed ? c.points : 0), 0);

  const handleCompleteChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId && !challenge.completed) {
        AudioEffects.playAchievementUnlock();
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
        
        if (onCompleteChallenge) {
          onCompleteChallenge(challengeId);
        }
        
        return { ...challenge, completed: true, progress: challenge.maxProgress };
      }
      return challenge;
    }));
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Confetti Animation */}
      <AnimatePresence>
        {confetti && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  y: -10,
                  x: Math.random() * 100,
                  rotate: 0,
                  scale: 0.5
                }}
                animate={{
                  opacity: 0,
                  y: 400,
                  x: Math.random() * 100 + (Math.random() - 0.5) * 200,
                  rotate: 360,
                  scale: 1
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className={`absolute w-3 h-3 ${
                  ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][i % 5]
                } rounded-full`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '0%'
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-blue-500" />
            Daily Challenges
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {getTimeRemaining()} left
          </div>
        </div>
        
        {/* Progress Overview */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>{completedCount}/{challenges.length} complete</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            +{totalPoints} points earned
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {challenges.map((challenge, index) => {
          const Icon = challenge.icon;
          const progressPercent = (challenge.progress / challenge.maxProgress) * 100;
          
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 border rounded-lg transition-all ${
                challenge.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  challenge.completed 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}>
                  {challenge.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className="w-4 h-4 text-gray-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium text-sm ${
                      challenge.completed ? 'text-green-700' : 'text-gray-900'
                    }`}>
                      {challenge.title}
                    </h4>
                    <Badge 
                      variant={challenge.completed ? "default" : "secondary"}
                      className="text-xs"
                    >
                      +{challenge.points}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {challenge.description}
                  </p>

                  {challenge.maxProgress > 1 && (
                    <div className="mb-2">
                      <Progress 
                        value={progressPercent} 
                        className="h-1.5" 
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {challenge.progress}/{challenge.maxProgress}
                      </div>
                    </div>
                  )}

                  {!challenge.completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCompleteChallenge(challenge.id)}
                      className="text-xs h-6 px-2"
                    >
                      {challenge.maxProgress > 1 ? 'Mark Progress' : 'Complete'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Completion Bonus */}
        {completedCount === challenges.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-yellow-700">All Challenges Complete!</span>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-sm text-yellow-600 mb-2">
              Amazing work! You've completed all today's challenges.
            </p>
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
              +50 Bonus Points
            </Badge>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}