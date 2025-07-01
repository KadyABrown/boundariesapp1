import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, HelpCircle, Lightbulb, TrendingUp, Cloud, MessageCircle } from "lucide-react";

interface BoundaryBuddyProps {
  context: 'emotional-weather' | 'timeline' | 'achievements' | 'general';
  trigger?: React.ReactNode;
  position?: 'floating' | 'inline';
}

const explanations = {
  'emotional-weather': {
    title: "Understanding Your Emotional Weather",
    icon: Cloud,
    sections: [
      {
        title: "What is Emotional Weather?",
        content: "Think of your relationships like weather patterns. Just like weather, relationships have different 'climates' that change over time based on various factors."
      },
      {
        title: "Reading the Metrics",
        content: "• **Temperature**: How warm and positive the relationship feels\n• **Tension**: The level of stress or conflict present\n• **Communication**: How freely information flows between you\n• **Trust**: Your visibility into the relationship's true state"
      },
      {
        title: "Weather Conditions",
        content: "• **☀️ Sunny**: High warmth, low tension - everything's great!\n• **⛅ Partly Cloudy**: Generally good with minor concerns\n• **☁️ Cloudy**: Mixed feelings, some uncertainty\n• **🌧️ Rainy**: Frequent challenges and conflicts\n• **⛈️ Stormy**: Intense volatility and major issues\n• **❄️ Snowy**: Cold distance, communication breakdown"
      },
      {
        title: "The 5-Day Forecast",
        content: "Based on recent patterns, this shows how your relationship dynamics might evolve. Green arrows mean improving trends, red arrows show declining patterns."
      }
    ]
  },
  'timeline': {
    title: "Your Relationship Timeline",
    icon: TrendingUp,
    sections: [
      {
        title: "What You're Seeing",
        content: "This timeline shows the story of your relationships and boundaries over time - every interaction, milestone, and pattern that matters."
      },
      {
        title: "Event Types",
        content: "• **Boundaries**: When you respected, challenged, or worked on personal limits\n• **Flags**: Positive (green) or concerning (red) behaviors you've noticed\n• **Check-ins**: Your emotional safety and relationship health assessments\n• **Milestones**: Important relationship moments and status changes"
      },
      {
        title: "Using the Timeline",
        content: "Click any event to see details. Use filters to focus on specific types of activities. Switch between timeline and list views for different perspectives."
      }
    ]
  },
  'achievements': {
    title: "Your Boundary Journey",
    icon: Lightbulb,
    sections: [
      {
        title: "What Are Achievements?",
        content: "These celebrate your progress in building healthier relationships and stronger boundaries. Each achievement recognizes a meaningful step in your personal growth."
      },
      {
        title: "Types of Recognition",
        content: "• **Streaks**: Consistent daily boundary awareness\n• **Milestones**: Major accomplishments in relationship tracking\n• **Consistency**: Regular engagement with boundary practices\n• **Special**: Unique achievements for exceptional progress"
      },
      {
        title: "Points and Levels",
        content: "Points reflect your engagement and growth. Levels unlock as you develop stronger boundary skills and relationship awareness over time."
      }
    ]
  },
  'general': {
    title: "Welcome to BoundarySpace",
    icon: HelpCircle,
    sections: [
      {
        title: "Your Personal Boundary Assistant",
        content: "I'm here to help you understand and navigate your relationship dynamics. Think of me as your guide through the world of healthy boundaries."
      },
      {
        title: "What I Can Help With",
        content: "• Explaining what data and insights mean\n• Providing context for relationship patterns\n• Offering guidance on boundary practices\n• Celebrating your progress and growth"
      },
      {
        title: "Getting Started",
        content: "Look for my help icon throughout the app. I'll provide explanations tailored to whatever you're viewing, making your boundary journey clearer and more meaningful."
      }
    ]
  }
};

export default function BoundaryBuddy({ context, trigger, position = 'inline' }: BoundaryBuddyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const explanation = explanations[context];
  const IconComponent = explanation.icon;

  const playNotificationSound = () => {
    try {
      // Create a gentle notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a gentle bell-like sound
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Set frequencies for a pleasant chord (C and E)
      oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
      
      // Create envelope for gentle fade in/out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      // Connect nodes
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start and stop
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.8);
      oscillator2.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      // Silently fail if audio context isn't available
      console.log('Audio not available');
    }
  };

  const handleOpenDialog = () => {
    setIsAnimating(true);
    setIsOpen(true);
    playNotificationSound();
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Animated Buddy Character
  const BuddyCharacter = () => (
    <motion.div
      className="relative cursor-pointer"
      onClick={handleOpenDialog}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Buddy Body */}
      <motion.div
        className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-lg flex items-center justify-center border-3 border-white"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Buddy Face */}
        <div className="relative">
          {/* Eyes */}
          <div className="flex gap-1 mb-1">
            <motion.div 
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
            />
          </div>
          {/* Smile */}
          <div className="w-2 h-1 border-b-2 border-white rounded-full mx-auto" />
        </div>
      </motion.div>

      {/* Speech Bubble Indicator */}
      <motion.div
        className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        <MessageCircle className="w-2 h-2 text-white" />
      </motion.div>

      {/* Hover hint */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
      >
        Ask me for help!
      </motion.div>
    </motion.div>
  );

  const defaultTrigger = position === 'floating' ? <BuddyCharacter /> : (
    <BuddyCharacter />
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-4 z-50 flex items-center justify-center"
            >
              <Card className="border-2 border-blue-200 shadow-xl w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden">
                <CardContent className="p-0 flex flex-col h-full min-h-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Animated Buddy in Header */}
                        <motion.div
                          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30"
                          animate={{
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <div className="relative">
                            {/* Eyes */}
                            <div className="flex gap-0.5 mb-0.5">
                              <div className="w-1 h-1 bg-white rounded-full" />
                              <div className="w-1 h-1 bg-white rounded-full" />
                            </div>
                            {/* Smile */}
                            <div className="w-1.5 h-0.5 border-b border-white rounded-full mx-auto" />
                          </div>
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-lg">{explanation.title}</h3>
                          <p className="text-blue-100 text-sm">Hi! I'm Buddy, your boundary guide 👋</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-white/20 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                    <div className="space-y-3">
                      {explanation.sections.map((section, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {section.title}
                          </h4>
                          <div className="text-sm text-gray-700 leading-relaxed pl-4">
                            {section.content.split('\n').map((line, lineIndex) => (
                              <div key={lineIndex} className={lineIndex > 0 ? 'mt-1' : ''}>
                                {line}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600">
                        💡 Tip: Look for help icons throughout the app for context-specific guidance
                      </p>
                      <Button
                        onClick={() => setIsOpen(false)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Got it!
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}