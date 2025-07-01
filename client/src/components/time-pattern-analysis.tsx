import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Sun, 
  Moon, 
  Coffee,
  Sunset,
  Target,
  Brain,
  MapPin,
  Users
} from "lucide-react";

interface TimeBasedInteraction {
  timestamp: string;
  dayOfWeek: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  hour: number;
  healthScore: number;
  energyImpact: number;
  boundaryViolated: boolean;
  location: string;
  stressLevel: number;
  relationshipId: number;
  relationshipName: string;
}

interface TimePatternAnalysisProps {
  interactions: TimeBasedInteraction[];
  relationshipName: string;
}

export default function TimePatternAnalysis({ interactions, relationshipName }: TimePatternAnalysisProps) {
  
  // Time of day analysis
  const timeOfDayPatterns = useMemo(() => {
    const timeSlots = {
      morning: { violations: 0, total: 0, avgHealth: 0, avgEnergy: 0 },
      afternoon: { violations: 0, total: 0, avgHealth: 0, avgEnergy: 0 },
      evening: { violations: 0, total: 0, avgHealth: 0, avgEnergy: 0 },
      night: { violations: 0, total: 0, avgHealth: 0, avgEnergy: 0 }
    };

    interactions.forEach(interaction => {
      const slot = timeSlots[interaction.timeOfDay];
      slot.total++;
      if (interaction.boundaryViolated) slot.violations++;
      slot.avgHealth += interaction.healthScore;
      slot.avgEnergy += interaction.energyImpact;
    });

    Object.values(timeSlots).forEach(slot => {
      if (slot.total > 0) {
        slot.avgHealth = slot.avgHealth / slot.total;
        slot.avgEnergy = slot.avgEnergy / slot.total;
      }
    });

    return Object.entries(timeSlots).map(([time, data]) => ({
      time: time.charAt(0).toUpperCase() + time.slice(1),
      violationRate: data.total > 0 ? Math.round((data.violations / data.total) * 100) : 0,
      avgHealth: Math.round(data.avgHealth),
      avgEnergy: Number(data.avgEnergy.toFixed(1)),
      totalInteractions: data.total,
      icon: time === 'morning' ? Sun : time === 'afternoon' ? Coffee : time === 'evening' ? Sunset : Moon
    }));
  }, [interactions]);

  // Day of week patterns
  const dayOfWeekPatterns = useMemo(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayData = days.reduce((acc, day) => {
      acc[day] = { violations: 0, total: 0, avgStress: 0, avgHealth: 0 };
      return acc;
    }, {} as Record<string, any>);

    interactions.forEach(interaction => {
      const day = interaction.dayOfWeek;
      if (dayData[day]) {
        dayData[day].total++;
        if (interaction.boundaryViolated) dayData[day].violations++;
        dayData[day].avgStress += interaction.stressLevel;
        dayData[day].avgHealth += interaction.healthScore;
      }
    });

    return days.map(day => {
      const data = dayData[day];
      return {
        day: day.slice(0, 3),
        fullDay: day,
        violationRate: data.total > 0 ? Math.round((data.violations / data.total) * 100) : 0,
        avgStress: data.total > 0 ? Math.round(data.avgStress / data.total) : 0,
        avgHealth: data.total > 0 ? Math.round(data.avgHealth / data.total) : 0,
        totalInteractions: data.total
      };
    });
  }, [interactions]);

  // Hourly violation patterns
  const hourlyPatterns = useMemo(() => {
    const hourData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      violations: 0,
      total: 0,
      displayHour: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`
    }));

    interactions.forEach(interaction => {
      const hour = interaction.hour;
      hourData[hour].total++;
      if (interaction.boundaryViolated) hourData[hour].violations++;
    });

    return hourData.map(data => ({
      ...data,
      violationRate: data.total > 0 ? Math.round((data.violations / data.total) * 100) : 0
    })).filter(data => data.total > 0);
  }, [interactions]);

  // Location-based patterns
  const locationPatterns = useMemo(() => {
    const locationData: Record<string, { violations: number; total: number; avgHealth: number }> = {};

    interactions.forEach(interaction => {
      const location = interaction.location || 'Unknown';
      if (!locationData[location]) {
        locationData[location] = { violations: 0, total: 0, avgHealth: 0 };
      }
      locationData[location].total++;
      if (interaction.boundaryViolated) locationData[location].violations++;
      locationData[location].avgHealth += interaction.healthScore;
    });

    return Object.entries(locationData)
      .map(([location, data]) => ({
        location,
        violationRate: Math.round((data.violations / data.total) * 100),
        avgHealth: Math.round(data.avgHealth / data.total),
        totalInteractions: data.total
      }))
      .sort((a, b) => b.violationRate - a.violationRate)
      .slice(0, 8);
  }, [interactions]);

  // Trend analysis over time
  const trendsOverTime = useMemo(() => {
    if (interactions.length < 5) return [];

    const sortedInteractions = [...interactions].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const weeklyData: Record<string, { violations: number; total: number; avgHealth: number; avgEnergy: number }> = {};

    sortedInteractions.forEach(interaction => {
      const date = new Date(interaction.timestamp);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { violations: 0, total: 0, avgHealth: 0, avgEnergy: 0 };
      }

      weeklyData[weekKey].total++;
      if (interaction.boundaryViolated) weeklyData[weekKey].violations++;
      weeklyData[weekKey].avgHealth += interaction.healthScore;
      weeklyData[weekKey].avgEnergy += interaction.energyImpact;
    });

    return Object.entries(weeklyData)
      .map(([week, data]) => ({
        week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        violationRate: Math.round((data.violations / data.total) * 100),
        avgHealth: Math.round(data.avgHealth / data.total),
        avgEnergy: Number((data.avgEnergy / data.total).toFixed(1)),
        totalInteractions: data.total
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
  }, [interactions]);

  // Key insights
  const insights = useMemo(() => {
    const riskiestTime = timeOfDayPatterns.reduce((max, current) => 
      current.violationRate > max.violationRate ? current : max
    );
    
    const riskiestDay = dayOfWeekPatterns.reduce((max, current) => 
      current.violationRate > max.violationRate ? current : max
    );

    const safestTime = timeOfDayPatterns.reduce((min, current) => 
      current.violationRate < min.violationRate ? current : min
    );

    const riskiestLocation = locationPatterns[0];

    const recentTrend = trendsOverTime.length >= 3 ? (
      trendsOverTime[trendsOverTime.length - 1].violationRate > trendsOverTime[trendsOverTime.length - 3].violationRate ? 'increasing' : 'decreasing'
    ) : 'stable';

    return {
      riskiestTime,
      riskiestDay,
      safestTime,
      riskiestLocation,
      recentTrend,
      totalInteractions: interactions.length
    };
  }, [timeOfDayPatterns, dayOfWeekPatterns, locationPatterns, trendsOverTime, interactions.length]);

  if (interactions.length < 3) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Not enough data for time pattern analysis</h3>
          <p className="text-gray-600">Log more interactions to see time-based patterns and insights</p>
        </CardContent>
      </Card>
    );
  }

  const getTimeIcon = (time: string) => {
    switch (time.toLowerCase()) {
      case 'morning': return Sun;
      case 'afternoon': return Coffee;
      case 'evening': return Sunset;
      case 'night': return Moon;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Insights Summary */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            Time Pattern Insights for {relationshipName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Riskiest Time</div>
              <div className="font-semibold text-red-700">
                {insights.riskiestTime.time} ({insights.riskiestTime.violationRate}%)
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Riskiest Day</div>
              <div className="font-semibold text-orange-700">
                {insights.riskiestDay.fullDay} ({insights.riskiestDay.violationRate}%)
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Safest Time</div>
              <div className="font-semibold text-green-700">
                {insights.safestTime.time} ({insights.safestTime.violationRate}%)
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Recent Trend</div>
              <div className={`font-semibold ${
                insights.recentTrend === 'increasing' ? 'text-red-700' : 
                insights.recentTrend === 'decreasing' ? 'text-green-700' : 'text-gray-700'
              }`}>
                {insights.recentTrend === 'increasing' ? 'Worsening' :
                 insights.recentTrend === 'decreasing' ? 'Improving' : 'Stable'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time of Day Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-orange-600" />
              Time of Day Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeOfDayPatterns.map((timeSlot) => {
                const Icon = getTimeIcon(timeSlot.time);
                return (
                  <motion.div
                    key={timeSlot.time}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">{timeSlot.time}</div>
                        <div className="text-sm text-gray-600">
                          {timeSlot.totalInteractions} interactions
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={`${
                        timeSlot.violationRate > 50 ? 'bg-red-100 text-red-700' :
                        timeSlot.violationRate > 25 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {timeSlot.violationRate}% violations
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        Energy: {timeSlot.avgEnergy > 0 ? '+' : ''}{timeSlot.avgEnergy}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day of Week Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Day of Week Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dayOfWeekPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value}%`,
                    name === 'violationRate' ? 'Violation Rate' : 'Average Health'
                  ]}
                />
                <Bar dataKey="violationRate" fill="#ef4444" name="violationRate" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Heat Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Hourly Violation Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="displayHour"
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'Violation Rate']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="violationRate" 
                stroke="#8b5cf6" 
                fill="#c4b5fd" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Location and Trend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Location Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {locationPatterns.length > 0 ? (
              <div className="space-y-3">
                {locationPatterns.map((location, index) => (
                  <div key={location.location} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{location.location}</div>
                      <div className="text-sm text-gray-600">
                        {location.totalInteractions} interactions
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${
                        location.violationRate > 50 ? 'bg-red-100 text-red-700' :
                        location.violationRate > 25 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {location.violationRate}% risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No location data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trends Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Trends Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'violationRate' ? `${value}%` : `${value}`,
                      name === 'violationRate' ? 'Violation Rate' : 
                      name === 'avgHealth' ? 'Health Score' : 'Energy Impact'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="violationRate" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="violationRate"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgHealth" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="avgHealth"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Need more historical data to show trends
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actionable Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="w-5 h-5" />
            Time-Based Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.riskiestTime.violationRate > 30 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">High-Risk Time Period</h4>
                  <p className="text-sm text-gray-700">
                    Boundary violations are most common in the <strong>{insights.riskiestTime.time.toLowerCase()}</strong>. 
                    Consider being extra vigilant during this time or limiting interactions.
                  </p>
                </div>
              </div>
            )}

            {insights.riskiestDay.violationRate > 40 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <Calendar className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Problematic Day Pattern</h4>
                  <p className="text-sm text-gray-700">
                    <strong>{insights.riskiestDay.fullDay}s</strong> show the highest violation rate at {insights.riskiestDay.violationRate}%. 
                    Consider what makes this day different - stress levels, schedule, or their circumstances.
                  </p>
                </div>
              </div>
            )}

            {insights.riskiestLocation && insights.riskiestLocation.violationRate > 50 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800">Location Risk Factor</h4>
                  <p className="text-sm text-gray-700">
                    Interactions at <strong>{insights.riskiestLocation.location}</strong> have a {insights.riskiestLocation.violationRate}% violation rate. 
                    Consider meeting in different locations or having backup plans for these settings.
                  </p>
                </div>
              </div>
            )}

            {insights.recentTrend === 'increasing' && (
              <div className="flex items-start gap-3 p-3 bg-red-100 rounded-lg border border-red-200">
                <TrendingDown className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Deteriorating Pattern</h4>
                  <p className="text-sm text-red-700">
                    The relationship quality has been declining recently. Consider reassessing your boundaries 
                    and whether this relationship is sustainable in its current form.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}