import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, Shuffle, Heart, Lightbulb, Shield, Star } from "lucide-react";

interface BoundaryQuote {
  id: string;
  text: string;
  author?: string;
  category: 'strength' | 'self-care' | 'respect' | 'growth' | 'empowerment';
  userProgress?: number; // 0-100, determines which quotes appear
}

const boundaryQuotes: BoundaryQuote[] = [
  {
    id: 'strength_1',
    text: "Setting boundaries is a way of caring for myself. It doesn't make me mean, selfish, or uncaring because I don't do things your way.",
    author: "Christine Morgan",
    category: 'strength',
    userProgress: 0
  },
  {
    id: 'self_care_1',
    text: "Boundaries are not walls. They are gates that allow you to enjoy the beauty of your own garden.",
    category: 'self-care',
    userProgress: 10
  },
  {
    id: 'respect_1',
    text: "When we fail to set boundaries and hold people accountable, we feel used and mistreated.",
    author: "Brené Brown",
    category: 'respect',
    userProgress: 20
  },
  {
    id: 'growth_1',
    text: "Your boundaries are a reflection of how well you value yourself.",
    category: 'growth',
    userProgress: 30
  },
  {
    id: 'empowerment_1',
    text: "You have the right to say no without feeling guilty, mean, or selfish.",
    category: 'empowerment',
    userProgress: 0
  },
  {
    id: 'strength_2',
    text: "Boundaries are the distance at which I can love you and me simultaneously.",
    author: "Prentis Hemphill",
    category: 'strength',
    userProgress: 40
  },
  {
    id: 'self_care_2',
    text: "Self-care is how you take your power back.",
    author: "Lalah Delia",
    category: 'self-care',
    userProgress: 25
  },
  {
    id: 'respect_2',
    text: "Teaching people how to treat you is not manipulation. It's communication.",
    category: 'respect',
    userProgress: 35
  },
  {
    id: 'growth_2',
    text: "Every time you honor your boundaries, you're voting for the person you want to become.",
    category: 'growth',
    userProgress: 50
  },
  {
    id: 'empowerment_2',
    text: "No is a complete sentence. It does not require justification or explanation.",
    category: 'empowerment',
    userProgress: 15
  },
  {
    id: 'strength_3',
    text: "Your peace is more important than driving yourself crazy trying to understand why something happened the way it did.",
    category: 'strength',
    userProgress: 60
  },
  {
    id: 'self_care_3',
    text: "You can't pour from an empty cup. Take care of yourself first.",
    category: 'self-care',
    userProgress: 70
  }
];

const categoryIcons = {
  strength: Shield,
  'self-care': Heart,
  respect: Star,
  growth: Lightbulb,
  empowerment: Quote
};

const categoryColors = {
  strength: 'from-blue-500 to-blue-600',
  'self-care': 'from-pink-500 to-pink-600',
  respect: 'from-purple-500 to-purple-600',
  growth: 'from-green-500 to-green-600',
  empowerment: 'from-orange-500 to-orange-600'
};

interface BoundaryQuotesProps {
  userProgress?: number; // 0-100 based on user's boundary journey
  compact?: boolean;
}

export default function BoundaryQuotes({ userProgress = 0, compact = false }: BoundaryQuotesProps) {
  const [currentQuote, setCurrentQuote] = useState<BoundaryQuote | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Filter quotes based on user progress (unlock quotes as they progress)
  const availableQuotes = boundaryQuotes.filter(quote => 
    (quote.userProgress || 0) <= userProgress
  );

  const getRandomQuote = () => {
    if (availableQuotes.length === 0) return boundaryQuotes[0];
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    return availableQuotes[randomIndex];
  };

  useEffect(() => {
    // Set initial quote
    setCurrentQuote(getRandomQuote());
    
    // Auto-refresh quote every 30 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote(getRandomQuote());
        setIsVisible(true);
      }, 300);
    }, 30000);

    return () => clearInterval(interval);
  }, [userProgress]);

  const handleNewQuote = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsVisible(true);
    }, 300);
  };

  if (!currentQuote) return null;

  const Icon = categoryIcons[currentQuote.category];
  const gradient = categoryColors[currentQuote.category];

  if (compact) {
    return (
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-br ${gradient} flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  "{currentQuote.text}"
                </p>
                {currentQuote.author && (
                  <p className="text-xs text-gray-500 mt-2">— {currentQuote.author}</p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNewQuote}
                  className="mt-2 p-0 h-auto text-xs text-blue-600 hover:text-blue-700"
                >
                  <Shuffle className="w-3 h-3 mr-1" />
                  New quote
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 10 }}
            className={`p-3 rounded-full bg-gradient-to-br ${gradient} flex-shrink-0`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {isVisible && (
                    <motion.div
                      key={currentQuote.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Quote className="w-8 h-8 text-gray-300 mb-3" />
                      <blockquote className="text-gray-800 font-medium leading-relaxed mb-3 text-lg">
                        {currentQuote.text}
                      </blockquote>
                      {currentQuote.author && (
                        <cite className="text-gray-600 text-sm">— {currentQuote.author}</cite>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNewQuote}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <Shuffle className="w-4 h-4" />
                New Quote
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                {currentQuote.category.replace('-', ' ')}
              </span>
              <span className="text-xs text-gray-400">
                {availableQuotes.length} quotes unlocked
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}