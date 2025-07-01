import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, HelpCircle, Lightbulb, TrendingUp, Cloud } from "lucide-react";

interface BoundaryBuddyProps {
  context: 'emotional-weather' | 'timeline' | 'achievements' | 'general';
  trigger?: React.ReactNode;
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

export default function BoundaryBuddy({ context, trigger }: BoundaryBuddyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const explanation = explanations[context];
  const IconComponent = explanation.icon;

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsOpen(true)}
      className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
    >
      <HelpCircle className="w-4 h-4" />
      Ask Boundary Buddy
    </Button>
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
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 z-50"
            >
              <Card className="border-2 border-blue-200 shadow-xl">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{explanation.title}</h3>
                          <p className="text-blue-100 text-sm">Your friendly boundary guide</p>
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
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
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
                  <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
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