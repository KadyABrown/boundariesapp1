import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Zap, 
  CloudDrizzle,
  Thermometer,
  Wind,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import BoundaryBuddy from "@/components/boundary-buddy";

interface WeatherData {
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  temperature: number; // Emotional temperature (0-100)
  humidity: number; // Relationship tension (0-100)  
  windSpeed: number; // Communication flow (0-100)
  visibility: number; // Trust level (0-100)
  pressure: number; // Overall relationship health (0-100)
  forecast: WeatherForecast[];
}

interface WeatherForecast {
  day: string;
  condition: WeatherData['condition'];
  temperature: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface RelationshipWeather {
  relationshipName: string;
  weather: WeatherData;
  lastUpdated: Date;
}

const weatherIcons = {
  sunny: Sun,
  'partly-cloudy': Cloud,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: Zap,
  snowy: CloudSnow
};

const weatherColors = {
  sunny: 'text-yellow-500 bg-yellow-50 border-yellow-200',
  'partly-cloudy': 'text-blue-400 bg-blue-50 border-blue-200',
  cloudy: 'text-gray-500 bg-gray-50 border-gray-200',
  rainy: 'text-blue-600 bg-blue-50 border-blue-300',
  stormy: 'text-purple-600 bg-purple-50 border-purple-300',
  snowy: 'text-cyan-400 bg-cyan-50 border-cyan-200'
};

const weatherDescriptions = {
  sunny: 'Clear and harmonious',
  'partly-cloudy': 'Generally positive with minor concerns',
  cloudy: 'Mixed emotions and uncertainty',
  rainy: 'Frequent challenges and tension',
  stormy: 'Intense conflicts and volatility',
  snowy: 'Emotional distance and communication freeze'
};

interface EmotionalWeatherProps {
  relationships?: any[];
  userProfile?: any;
  showForecast?: boolean;
}

export default function EmotionalWeather({ relationships, userProfile, showForecast = true }: EmotionalWeatherProps) {
  const [selectedRelationship, setSelectedRelationship] = useState<number>(0);
  const [currentWeather, setCurrentWeather] = useState<RelationshipWeather[]>([]);

  useEffect(() => {
    if (relationships && relationships.length > 0) {
      // Convert actual relationship data to weather format
      const weatherData = relationships.map((rel: any) => {
        console.log("Processing relationship for weather:", rel.name, {
          greenFlags: rel.greenFlags,
          redFlags: rel.redFlags,
          healthScore: rel.healthScore,
          averageSafetyRating: rel.averageSafetyRating,
          interactionBasedFlags: rel.interactionBasedFlags
        });

        // Use health score if available, otherwise calculate from flags
        let temperature = 50; // default neutral
        if (rel.healthScore !== undefined) {
          temperature = rel.healthScore;
        } else if (rel.greenFlags !== undefined && rel.redFlags !== undefined) {
          const totalFlags = rel.greenFlags + rel.redFlags;
          temperature = totalFlags > 0 ? Math.round((rel.greenFlags / totalFlags) * 100) : 50;
        }
        
        // Calculate relationship metrics from available data
        const safetyScore = rel.averageSafetyRating ? rel.averageSafetyRating * 10 : 50;
        const tension = rel.redFlags || 0;
        const communication = rel.greenFlags || 0;
        
        return {
          relationshipName: rel.name || 'Unknown',
          weather: generateWeatherFromMetrics(temperature, tension),
          lastUpdated: new Date()
        };
      });
      setCurrentWeather(weatherData);
    } else {
      // Generate realistic test data with user's name if available
      setCurrentWeather(generateRealisticWeatherData(userProfile));
    }
  }, [relationships, userProfile]);

  const getTemperatureColor = (temp: number) => {
    if (temp >= 80) return 'text-red-500';
    if (temp >= 60) return 'text-orange-500';
    if (temp >= 40) return 'text-yellow-500';
    if (temp >= 20) return 'text-blue-500';
    return 'text-cyan-500';
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'temperature': return Thermometer;
      case 'humidity': return CloudDrizzle;
      case 'wind': return Wind;
      case 'visibility': return Eye;
      default: return Thermometer;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-500';
      case 'declining': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Always show weather display - if no data, useEffect will populate with sample data
  if (currentWeather.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-500" />
            Emotional Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const current = currentWeather[selectedRelationship];
  const WeatherIcon = weatherIcons[current.weather.condition];

  return (
    <div className="space-y-6">
      {/* Current Weather Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`${weatherColors[current.weather.condition]} border-2`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: current.weather.condition === 'sunny' ? 360 : 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <WeatherIcon className="w-6 h-6" />
                </motion.div>
                Emotional Weather
              </CardTitle>
              <div className="flex items-center gap-2">
                <BoundaryBuddy context="emotional-weather" />
                {currentWeather.length > 1 && (
                  <select
                    value={selectedRelationship}
                    onChange={(e) => setSelectedRelationship(Number(e.target.value))}
                    className="bg-transparent border border-current rounded px-2 py-1 text-sm"
                  >
                    {currentWeather.map((rel, index) => (
                      <option key={index} value={index} className="bg-white text-black">
                        {rel.relationshipName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Weather Display */}
            <div className="text-center space-y-2">
              <motion.div
                className="text-6xl font-bold"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className={getTemperatureColor(current.weather.temperature)}>
                  {current.weather.temperature}°
                </span>
              </motion.div>
              <p className="text-lg font-medium">{weatherDescriptions[current.weather.condition]}</p>
              <Badge variant="secondary" className="text-xs">
                {current.relationshipName}
              </Badge>
              <p className="text-xs opacity-60 italic mt-2">
                {!relationships || relationships.length === 0 
                  ? "Sample data - Add relationships to see your real patterns"
                  : "Based on your tracked flags, check-ins, and interactions"
                }
              </p>
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                className="text-center p-3 bg-white/20 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Thermometer className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs opacity-80">Emotional Temp</p>
                <p className="font-bold">{current.weather.temperature}°</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-white/20 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <CloudDrizzle className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs opacity-80">Tension</p>
                <p className="font-bold">{current.weather.humidity}%</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-white/20 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Wind className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs opacity-80">Communication</p>
                <p className="font-bold">{current.weather.windSpeed}mph</p>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-white/20 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Eye className="w-4 h-4 mx-auto mb-1" />
                <p className="text-xs opacity-80">Trust</p>
                <p className="font-bold">{current.weather.visibility}%</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Forecast */}
      {showForecast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">5-Day Emotional Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {current.weather.forecast.map((day, index) => {
                  const DayIcon = weatherIcons[day.condition];
                  const TrendIcon = getTrendIcon(day.trend);
                  
                  return (
                    <motion.div
                      key={day.day}
                      className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-xs font-medium text-gray-600 mb-2">{day.day}</p>
                      <DayIcon className="w-5 h-5 mx-auto mb-2 text-gray-700" />
                      <p className="text-sm font-bold mb-1">{day.temperature}°</p>
                      <TrendIcon className={`w-3 h-3 mx-auto ${getTrendColor(day.trend)}`} />
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weather Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weather Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generateWeatherInsights(current.weather).map((insight, index) => (
                <motion.div
                  key={index}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="text-sm text-blue-800">{insight}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function generateRealisticWeatherData(userProfile?: any): RelationshipWeather[] {
  // Create example relationship types focused on actual relationships, not environments
  const relationships = [
    { name: "Sample Close Friend", baseTemp: 85, baseTension: 15 },
    { name: "Sample Family Member", baseTemp: 70, baseTension: 35 },
    { name: "Sample Dating Interest", baseTemp: 75, baseTension: 25 }
  ];

  return relationships.map(rel => {
    const weather = generateWeatherFromMetrics(rel.baseTemp, rel.baseTension);
    return {
      relationshipName: rel.name,
      weather,
      lastUpdated: new Date()
    };
  });
}

function generateWeatherCondition(temperature: number, tension: number): WeatherData['condition'] {
  if (temperature >= 80 && tension <= 20) return 'sunny';
  else if (temperature >= 60 && tension <= 40) return 'partly-cloudy';
  else if (temperature >= 40 && tension <= 60) return 'cloudy';
  else if (temperature >= 20 && tension <= 80) return 'rainy';
  else if (tension >= 80) return 'stormy';
  else return 'snowy';
}

function generateWeatherFromMetrics(temperature: number, tension: number): WeatherData {
  const condition = generateWeatherCondition(temperature, tension);

  const forecast: WeatherForecast[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => {
    const variation = Math.random() * 20 - 10;
    const forecastTemp = Math.max(0, Math.min(100, temperature + variation));
    const forecastTension = Math.max(0, Math.min(100, tension + variation));
    
    let trend: WeatherForecast['trend'] = 'stable';
    if (variation > 5) trend = 'improving';
    else if (variation < -5) trend = 'declining';

    return {
      day,
      condition: generateWeatherCondition(forecastTemp, forecastTension),
      temperature: Math.round(forecastTemp),
      trend
    };
  });

  return {
    condition,
    temperature: Math.round(temperature),
    humidity: Math.round(tension),
    windSpeed: Math.round(100 - tension), // Better communication when less tension
    visibility: Math.round((temperature + (100 - tension)) / 2), // Trust correlates with temp and low tension
    pressure: Math.round((temperature * 0.7) + ((100 - tension) * 0.3)), // Overall health
    forecast
  };
}

function generateWeatherInsights(weather: WeatherData): string[] {
  const insights: string[] = [];

  if (weather.temperature >= 80) {
    insights.push("🌟 High emotional warmth indicates strong positive feelings and connection.");
  } else if (weather.temperature <= 30) {
    insights.push("❄️ Low emotional temperature suggests distance or cooling feelings. Consider reconnecting.");
  }

  if (weather.humidity >= 70) {
    insights.push("⛈️ High tension levels detected. This might be a good time for open communication.");
  } else if (weather.humidity <= 30) {
    insights.push("☀️ Low tension levels create ideal conditions for deeper conversations.");
  }

  if (weather.windSpeed >= 70) {
    insights.push("💨 Strong communication flow - conversations are happening freely and openly.");
  } else if (weather.windSpeed <= 30) {
    insights.push("🌫️ Communication may be stagnant. Consider initiating meaningful dialogue.");
  }

  if (weather.visibility >= 80) {
    insights.push("👁️ Excellent trust levels provide clear relationship visibility and security.");
  } else if (weather.visibility <= 40) {
    insights.push("🌁 Limited trust visibility. Building transparency could improve relationship clarity.");
  }

  return insights;
}