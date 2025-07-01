import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Flame, 
  Star, 
  Target, 
  Zap, 
  Award,
  Calendar,
  TrendingUp,
  Shield,
  Heart,
  CheckCircle2,
  Gift,
  Sparkles,
  Medal
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof achievementIcons;
  category: 'streak' | 'consistency' | 'milestone' | 'special';
  points: number;
  threshold: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface GameStats {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  boundariesRespected: number;
  level: number;
  pointsToNextLevel: number;
  weeklyGoal: number;
  weeklyProgress: number;
  achievements: Achievement[];
}

const achievementIcons = {
  Trophy,
  Flame,
  Star,
  Target,
  Zap,
  Award,
  Calendar,
  TrendingUp,
  Shield,
  Heart,
  CheckCircle2,
  Gift,
  Sparkles,
  Medal
};

const levelThresholds = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000];

const defaultAchievements: Omit<Achievement, 'progress' | 'unlocked'>[] = [
  {
    id: 'first_entry',
    title: 'First Steps',
    description: 'Log your first boundary entry',
    icon: 'Star',
    category: 'milestone',
    points: 25,
    threshold: 1
  },
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day tracking streak',
    icon: 'Flame',
    category: 'streak',
    points: 100,
    threshold: 7
  },
  {
    id: 'month_streak',
    title: 'Monthly Master',
    description: 'Maintain a 30-day tracking streak',
    icon: 'Calendar',
    category: 'streak',
    points: 300,
    threshold: 30
  },
  {
    id: 'respect_champion',
    title: 'Respect Champion',
    description: 'Log 50 respected boundaries',
    icon: 'Shield',
    category: 'milestone',
    points: 200,
    threshold: 50
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Track boundaries for 14 consecutive days',
    icon: 'Target',
    category: 'consistency',
    points: 150,
    threshold: 14
  },
  {
    id: 'hundred_club',
    title: 'Hundred Club',
    description: 'Log 100 boundary entries total',
    icon: 'Trophy',
    category: 'milestone',
    points: 250,
    threshold: 100
  },
  {
    id: 'self_care_hero',
    title: 'Self-Care Hero',
    description: 'Maintain 80% respect rate over 30 entries',
    icon: 'Heart',
    category: 'special',
    points: 300,
    threshold: 30
  },
  {
    id: 'level_five',
    title: 'Rising Star',
    description: 'Reach level 5',
    icon: 'Sparkles',
    category: 'milestone',
    points: 200,
    threshold: 5
  },
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: 'Complete weekly goal 4 weeks in a row',
    icon: 'Medal',
    category: 'special',
    points: 400,
    threshold: 4
  }
];

const calculateLevel = (points: number): number => {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (points >= levelThresholds[i]) {
      return i;
    }
  }
  return 0;
};

const calculatePointsToNextLevel = (points: number, level: number): number => {
  if (level >= levelThresholds.length - 1) return 0;
  return levelThresholds[level + 1] - points;
};

const AchievementCard = ({ achievement, onClaim }: { 
  achievement: Achievement; 
  onClaim?: (achievement: Achievement) => void;
}) => {
  const Icon = achievementIcons[achievement.icon];
  const isComplete = achievement.progress >= achievement.threshold;
  const progressPercent = Math.min((achievement.progress / achievement.threshold) * 100, 100);
  
  const categoryColors = {
    streak: 'from-orange-400 to-red-500',
    consistency: 'from-blue-400 to-purple-500',
    milestone: 'from-green-400 to-teal-500',
    special: 'from-pink-400 to-purple-600'
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className={`relative overflow-hidden ${achievement.unlocked ? 'ring-2 ring-yellow-400' : ''}`}>
        {achievement.unlocked && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 className="w-5 h-5 text-yellow-500" />
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-gradient-to-br ${categoryColors[achievement.category]} ${!isComplete ? 'opacity-50' : ''}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-medium text-sm ${!isComplete ? 'text-muted-foreground' : ''}`}>
                {achievement.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {achievement.description}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className={`font-medium ${isComplete ? 'text-green-600' : ''}`}>
                {achievement.progress}/{achievement.threshold}
              </span>
            </div>
            
            <Progress value={progressPercent} className="h-2" />
            
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="text-xs">
                +{achievement.points} pts
              </Badge>
              
              {achievement.unlocked && !achievement.unlockedAt && onClaim && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onClaim(achievement)}
                  className="text-xs h-7"
                >
                  Claim
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StreakDisplay = ({ currentStreak, longestStreak }: { 
  currentStreak: number; 
  longestStreak: number; 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="w-5 h-5 text-orange-500" />
          Streak Power
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <motion.div
              key={currentStreak}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-orange-500 mb-1"
            >
              {currentStreak}
            </motion.div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground mb-1">
              {longestStreak}
            </div>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>Keep going! Every day counts.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LevelProgress = ({ level, points, pointsToNextLevel }: {
  level: number;
  points: number;
  pointsToNextLevel: number;
}) => {
  const currentLevelPoints = levelThresholds[level];
  const nextLevelPoints = level < levelThresholds.length - 1 ? levelThresholds[level + 1] : currentLevelPoints;
  const progressInLevel = points - currentLevelPoints;
  const totalPointsInLevel = nextLevelPoints - currentLevelPoints;
  const progressPercent = totalPointsInLevel > 0 ? (progressInLevel / totalPointsInLevel) * 100 : 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-blue-500" />
          Level {level}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Points</span>
            <span className="font-bold text-blue-600">{points.toLocaleString()}</span>
          </div>
          
          {pointsToNextLevel > 0 ? (
            <>
              <Progress value={progressPercent} className="h-3" />
              <div className="text-center text-sm text-muted-foreground">
                {pointsToNextLevel.toLocaleString()} points to level {level + 1}
              </div>
            </>
          ) : (
            <div className="text-center text-sm font-medium text-green-600">
              Maximum level reached! 🎉
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const WeeklyGoal = ({ weeklyGoal, weeklyProgress }: {
  weeklyGoal: number;
  weeklyProgress: number;
}) => {
  const progressPercent = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  const isComplete = weeklyProgress >= weeklyGoal;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-green-500" />
          Weekly Goal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className={`font-bold ${isComplete ? 'text-green-600' : 'text-gray-600'}`}>
              {weeklyProgress}/{weeklyGoal}
            </span>
          </div>
          
          <Progress value={progressPercent} className="h-3" />
          
          {isComplete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center text-sm font-medium text-green-600 flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              Goal completed! 🎉
            </motion.div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              {weeklyGoal - weeklyProgress} more entries to reach your goal
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface BoundaryBoostProps {
  gameStats?: GameStats;
  onClaimAchievement?: (achievement: Achievement) => void;
}

export default function BoundaryBoost({ gameStats, onClaimAchievement }: BoundaryBoostProps) {
  const [stats, setStats] = useState<GameStats>({
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalEntries: 0,
    boundariesRespected: 0,
    level: 0,
    pointsToNextLevel: 100,
    weeklyGoal: 7,
    weeklyProgress: 0,
    achievements: defaultAchievements.map(ach => ({
      ...ach,
      progress: 0,
      unlocked: false
    }))
  });

  useEffect(() => {
    if (gameStats) {
      setStats(gameStats);
    }
  }, [gameStats]);

  const unlockedAchievements = stats.achievements.filter(a => a.unlocked);
  const lockedAchievements = stats.achievements.filter(a => !a.unlocked);
  const nearCompletionAchievements = lockedAchievements
    .filter(a => a.progress / a.threshold >= 0.75)
    .sort((a, b) => (b.progress / b.threshold) - (a.progress / a.threshold));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LevelProgress 
          level={stats.level} 
          points={stats.totalPoints} 
          pointsToNextLevel={stats.pointsToNextLevel} 
        />
        <StreakDisplay 
          currentStreak={stats.currentStreak} 
          longestStreak={stats.longestStreak} 
        />
        <WeeklyGoal 
          weeklyGoal={stats.weeklyGoal} 
          weeklyProgress={stats.weeklyProgress} 
        />
      </div>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.slice(0, 6).map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement}
                onClaim={onClaimAchievement}
              />
            ))}
          </div>
        </div>
      )}

      {/* Almost There */}
      {nearCompletionAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Almost There!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearCompletionAchievements.slice(0, 3).map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-500" />
          All Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.achievements.map((achievement) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement}
              onClaim={onClaimAchievement}
            />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {stats.totalEntries === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mb-4">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-2">Start Your Boundary Journey!</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Begin tracking your boundaries to unlock achievements, build streaks, and level up your boundary skills.
          </p>
          <Button>
            <Target className="w-4 h-4 mr-2" />
            Log Your First Entry
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export type { GameStats, Achievement };