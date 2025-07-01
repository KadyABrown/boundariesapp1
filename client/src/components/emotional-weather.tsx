import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  Wind,
  CloudDrizzle,
  Snowflake,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

interface WeatherData {
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'windy';
  temperature: number; // 0-100 representing emotional warmth
  mood: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface RelationshipWeatherData {
  id: number;
  name: string;
  weather: WeatherData;
  lastUpdated: Date;
}

interface EmotionalWeatherProps {
  relationships?: RelationshipWeatherData[];
  className?: string;
}

const weatherIcons = {
  sunny: Sun,
  'partly-cloudy': Cloud,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: Zap,
  snowy: CloudSnow,
  windy: Wind
};

const weatherColors = {
  sunny: 'from-yellow-400 to-orange-500',
  'partly-cloudy': 'from-blue-400 to-gray-400',
  cloudy: 'from-gray-400 to-gray-600',
  rainy: 'from-blue-600 to-gray-700',
  stormy: 'from-purple-600 to-red-600',
  snowy: 'from-blue-200 to-white',
  windy: 'from-green-400 to-blue-400'
};

const weatherDescriptions = {
  sunny: "Clear skies and warm feelings",
  'partly-cloudy': "Mixed emotions with hopeful moments",
  cloudy: "Uncertain but stable dynamics",
  rainy: "Some emotional challenges to work through",
  stormy: "Intense feelings and potential conflict",
  snowy: "Cool distance but peaceful",
  windy: "Change and movement in the relationship"
};

const getWeatherFromRelationship = (relationship: any): WeatherData => {
  if (!relationship) {
    return {
      condition: 'partly-cloudy',
      temperature: 50,
      mood: 'Neutral',
      trend: 'stable',
      description: 'No recent activity'
    };
  }

  const stats = relationship.stats || {};
  const greenFlags = stats.greenFlags || 0;
  const redFlags = stats.redFlags || 0;
  const safetyRating = stats.averageSafetyRating || 5;
  
  // Calculate overall health score
  const healthScore = Math.max(0, Math.min(100, 
    (greenFlags * 10) - (redFlags * 15) + (safetyRating * 8)
  ));

  let condition: WeatherData['condition'];
  let mood: string;
  let temperature: number;

  if (healthScore >= 80) {
    condition = 'sunny';
    mood = 'Thriving';
    temperature = 85 + (healthScore - 80) * 0.75;
  } else if (healthScore >= 60) {
    condition = 'partly-cloudy';
    mood = 'Good';
    temperature = 65 + (healthScore - 60) * 1;
  } else if (healthScore >= 40) {
    condition = 'cloudy';
    mood = 'Uncertain';
    temperature = 45 + (healthScore - 40) * 1;
  } else if (healthScore >= 20) {
    condition = 'rainy';
    mood = 'Challenging';
    temperature = 25 + (healthScore - 20) * 1;
  } else {
    condition = 'stormy';
    mood = 'Turbulent';
    temperature = 10 + healthScore * 0.75;
  }

  // Determine trend based on recent activity
  const trend: WeatherData['trend'] = redFlags > greenFlags ? 'down' : 
                                      greenFlags > redFlags ? 'up' : 'stable';

  return {
    condition,
    temperature: Math.round(temperature),
    mood,
    trend,
    description: weatherDescriptions[condition]
  };
};

const WeatherIcon = ({ condition, size = 24 }: { condition: WeatherData['condition'], size?: number }) => {
  const Icon = weatherIcons[condition];
  
  return (
    <motion.div
      animate={{
        rotate: condition === 'windy' ? [0, 5, -5, 0] : 0,
        scale: condition === 'stormy' ? [1, 1.1, 1] : 1,
        y: condition === 'sunny' ? [0, -2, 0] : 0
      }}
      transition={{
        duration: condition === 'stormy' ? 0.5 : 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Icon size={size} className="text-white drop-shadow-lg" />
    </motion.div>
  );
};

const TrendIndicator = ({ trend }: { trend: WeatherData['trend'] }) => {
  const icons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus
  };
  
  const colors = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-gray-500'
  };
  
  const Icon = icons[trend];
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${colors[trend]}`}
    >
      <Icon size={16} />
    </motion.div>
  );
};

const WeatherCard = ({ relationship }: { relationship: RelationshipWeatherData }) => {
  const { weather, name } = relationship;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      <Card className="relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${weatherColors[weather.condition]} opacity-20`} />
        
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium truncate">{name}</CardTitle>
            <TrendIndicator trend={weather.trend} />
          </div>
        </CardHeader>
        
        <CardContent className="relative pt-0">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-full bg-gradient-to-br ${weatherColors[weather.condition]}`}>
              <WeatherIcon condition={weather.condition} size={20} />
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">{weather.temperature}°</div>
              <div className="text-xs text-muted-foreground">warmth</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {weather.mood}
            </Badge>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              {weather.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const OverallWeatherSummary = ({ relationships }: { relationships: RelationshipWeatherData[] }) => {
  const avgTemperature = relationships.length > 0 
    ? Math.round(relationships.reduce((sum, r) => sum + r.weather.temperature, 0) / relationships.length)
    : 50;
  
  const dominantCondition = relationships.length > 0
    ? relationships.reduce((prev, current) => 
        current.weather.temperature > prev.weather.temperature ? current : prev
      ).weather.condition
    : 'partly-cloudy';
  
  const positiveCount = relationships.filter(r => r.weather.temperature >= 60).length;
  const totalCount = relationships.length;
  
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${weatherColors[dominantCondition]} opacity-10`} />
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Emotional Climate
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-4 rounded-full bg-gradient-to-br ${weatherColors[dominantCondition]}`}>
            <WeatherIcon condition={dominantCondition} size={32} />
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">{avgTemperature}°</div>
            <div className="text-sm text-muted-foreground">average warmth</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Healthy relationships</span>
            <span className="font-medium">{positiveCount}/{totalCount}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${totalCount > 0 ? (positiveCount / totalCount) * 100 : 0}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            {totalCount === 0 
              ? "No relationships to analyze yet"
              : `${Math.round((positiveCount / totalCount) * 100)}% of your relationships show positive emotional weather`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function EmotionalWeather({ relationships: propRelationships, className }: EmotionalWeatherProps) {
  const [relationships, setRelationships] = useState<RelationshipWeatherData[]>([]);
  
  useEffect(() => {
    if (propRelationships) {
      setRelationships(propRelationships);
    }
  }, [propRelationships]);

  return (
    <div className={`space-y-6 ${className}`}>
      <OverallWeatherSummary relationships={relationships} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {relationships.map((relationship, index) => (
            <motion.div
              key={relationship.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <WeatherCard relationship={relationship} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {relationships.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mb-4">
            <Cloud className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Weather Data Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start tracking your relationships to see their emotional weather patterns. 
            Each relationship will show up as its own weather forecast based on recent activity.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export { getWeatherFromRelationship, type WeatherData, type RelationshipWeatherData };