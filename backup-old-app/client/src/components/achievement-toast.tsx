import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
  isVisible: boolean;
}

export default function AchievementToast({ achievement, onClose, isVisible }: AchievementToastProps) {
  useEffect(() => {
    if (isVisible && achievement) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Show for 4 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, achievement, onClose]);

  if (!achievement) return null;

  const Icon = achievementIcons[achievement.icon];
  
  const categoryColors = {
    streak: 'from-orange-400 to-red-500',
    consistency: 'from-blue-400 to-purple-500',
    milestone: 'from-green-400 to-teal-500',
    special: 'from-pink-400 to-purple-600'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.6
          }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-xl overflow-hidden">
            {/* Animated sparkles background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 100 - 50
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>

            <CardContent className="p-4 relative">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className={`p-3 rounded-full bg-gradient-to-br ${categoryColors[achievement.category]} shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Achievement Unlocked!</span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-bold text-gray-900 mb-1"
                  >
                    {achievement.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-gray-600 mb-2"
                  >
                    {achievement.description}
                  </motion.p>

                  {/* Points Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      +{achievement.points} points
                    </Badge>
                  </motion.div>
                </div>

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </motion.button>
              </div>
            </CardContent>

            {/* Progress bar animation */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 3.2 }}
              className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 origin-left"
            />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}