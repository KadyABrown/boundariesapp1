import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Battery, 
  Heart, 
  Brain, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Clock,
  Calendar
} from "lucide-react";

interface MoodEnergyData {
  timestamp: string;
  energyBefore: number; // 1-10
  energyAfter: number; // 1-10
  mood: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
  physicalSymptoms: string[];
  emotionalState: string[];
  recoveryTime: number; // minutes to feel normal again
  contextId: string; // links to interaction
}

interface MoodEnergyTrackerProps {
  onDataUpdate: (data: Partial<MoodEnergyData>) => void;
  initialData?: Partial<MoodEnergyData>;
  mode: 'before' | 'after' | 'recovery';
  relationshipName?: string;
}

const physicalSymptoms = [
  { id: 'headache', label: 'Headache', severity: 'medium' },
  { id: 'tension', label: 'Muscle Tension', severity: 'medium' },
  { id: 'fatigue', label: 'Fatigue', severity: 'high' },
  { id: 'nausea', label: 'Nausea/Stomach Issues', severity: 'high' },
  { id: 'insomnia', label: 'Sleep Problems', severity: 'high' },
  { id: 'appetite', label: 'Appetite Changes', severity: 'medium' },
  { id: 'racing-heart', label: 'Racing Heart', severity: 'high' },
  { id: 'shallow-breathing', label: 'Shallow Breathing', severity: 'medium' },
  { id: 'restlessness', label: 'Restlessness', severity: 'medium' },
  { id: 'numbness', label: 'Emotional Numbness', severity: 'high' }
];

const emotionalStates = [
  { id: 'anxious', label: 'Anxious', category: 'stress' },
  { id: 'angry', label: 'Angry', category: 'stress' },
  { id: 'sad', label: 'Sad', category: 'low' },
  { id: 'confused', label: 'Confused', category: 'cognitive' },
  { id: 'overwhelmed', label: 'Overwhelmed', category: 'stress' },
  { id: 'disappointed', label: 'Disappointed', category: 'low' },
  { id: 'frustrated', label: 'Frustrated', category: 'stress' },
  { id: 'grateful', label: 'Grateful', category: 'positive' },
  { id: 'relieved', label: 'Relieved', category: 'positive' },
  { id: 'hopeful', label: 'Hopeful', category: 'positive' },
  { id: 'validated', label: 'Validated', category: 'positive' },
  { id: 'proud', label: 'Proud', category: 'positive' },
  { id: 'calm', label: 'Calm', category: 'neutral' },
  { id: 'neutral', label: 'Neutral', category: 'neutral' }
];

const moodEmojis = {
  'very-negative': { emoji: '😞', label: 'Very Upset', color: 'text-red-600' },
  'negative': { emoji: '😕', label: 'Upset', color: 'text-orange-600' },
  'neutral': { emoji: '😐', label: 'Neutral', color: 'text-gray-600' },
  'positive': { emoji: '😊', label: 'Good', color: 'text-green-600' },
  'very-positive': { emoji: '😄', label: 'Great', color: 'text-green-700' }
};

export default function MoodEnergyTracker({ 
  onDataUpdate, 
  initialData, 
  mode, 
  relationshipName 
}: MoodEnergyTrackerProps) {
  const [energyLevel, setEnergyLevel] = useState<number[]>([initialData?.energyBefore || initialData?.energyAfter || 5]);
  const [mood, setMood] = useState<string>(initialData?.mood || 'neutral');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialData?.physicalSymptoms || []);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(initialData?.emotionalState || []);
  const [recoveryTime, setRecoveryTime] = useState<number[]>([initialData?.recoveryTime || 30]);

  useEffect(() => {
    const data: Partial<MoodEnergyData> = {
      timestamp: new Date().toISOString(),
      physicalSymptoms: selectedSymptoms,
      emotionalState: selectedEmotions,
      mood: mood as any
    };

    if (mode === 'before') {
      data.energyBefore = energyLevel[0];
    } else if (mode === 'after') {
      data.energyAfter = energyLevel[0];
    } else if (mode === 'recovery') {
      data.recoveryTime = recoveryTime[0];
    }

    onDataUpdate(data);
  }, [energyLevel, mood, selectedSymptoms, selectedEmotions, recoveryTime, mode, onDataUpdate]);

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleEmotionToggle = (emotionId: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotionId) 
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  const getEnergyIcon = (level: number) => {
    if (level >= 8) return { icon: Zap, color: 'text-green-600' };
    if (level >= 6) return { icon: Battery, color: 'text-blue-600' };
    if (level >= 4) return { icon: Heart, color: 'text-orange-600' };
    return { icon: AlertCircle, color: 'text-red-600' };
  };

  const getEnergyDescription = (level: number) => {
    if (level >= 9) return "Energized & Ready";
    if (level >= 7) return "Good Energy";
    if (level >= 5) return "Moderate Energy";
    if (level >= 3) return "Low Energy";
    return "Completely Drained";
  };

  const energyIcon = getEnergyIcon(energyLevel[0]);
  const currentMood = moodEmojis[mood as keyof typeof moodEmojis];

  const getHeaderTitle = () => {
    switch (mode) {
      case 'before':
        return `How are you feeling before seeing ${relationshipName}?`;
      case 'after':
        return `How are you feeling after that interaction?`;
      case 'recovery':
        return `How long did it take to feel normal again?`;
      default:
        return "How are you feeling?";
    }
  };

  const getGroupedEmotions = () => {
    const grouped = emotionalStates.reduce((acc, emotion) => {
      if (!acc[emotion.category]) acc[emotion.category] = [];
      acc[emotion.category].push(emotion);
      return acc;
    }, {} as Record<string, typeof emotionalStates>);
    return grouped;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {getHeaderTitle()}
        </h3>
        <p className="text-sm text-gray-600">
          This helps track patterns and the emotional impact of your relationships
        </p>
      </div>

      {/* Energy Level */}
      {(mode === 'before' || mode === 'after') && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <energyIcon.icon className={`w-5 h-5 ${energyIcon.color}`} />
                  Energy Level
                </Label>
                <Badge variant="outline" className={energyIcon.color}>
                  {getEnergyDescription(energyLevel[0])}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <Slider
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 - Completely Drained</span>
                  <span className="font-medium text-gray-800">{energyLevel[0]}/10</span>
                  <span>10 - Highly Energized</span>
                </div>
              </div>

              {/* Energy visualization */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-4 flex-1 rounded ${
                      i < energyLevel[0] 
                        ? energyLevel[0] >= 7 ? 'bg-green-500' : 
                          energyLevel[0] >= 4 ? 'bg-orange-500' : 'bg-red-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recovery Time */}
      {mode === 'recovery' && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Recovery Time
              </Label>
              
              <div className="space-y-3">
                <Slider
                  value={recoveryTime}
                  onValueChange={setRecoveryTime}
                  min={0}
                  max={480} // 8 hours
                  step={15}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Immediate</span>
                  <span className="font-medium text-gray-800">
                    {recoveryTime[0] === 0 ? 'Immediate' : 
                     recoveryTime[0] < 60 ? `${recoveryTime[0]} minutes` :
                     `${Math.round(recoveryTime[0] / 60 * 10) / 10} hours`}
                  </span>
                  <span>8+ Hours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Selection */}
      {(mode === 'before' || mode === 'after') && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Overall Mood
              </Label>
              
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(moodEmojis).map(([key, { emoji, label, color }]) => (
                  <button
                    key={key}
                    onClick={() => setMood(key)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      mood === key 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{emoji}</div>
                    <div className={`text-xs ${color}`}>{label}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emotional States */}
      {(mode === 'before' || mode === 'after') && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Emotional State
                <span className="text-sm font-normal text-gray-500">(Select all that apply)</span>
              </Label>
              
              {Object.entries(getGroupedEmotions()).map(([category, emotions]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 capitalize">
                    {category === 'stress' ? 'Stress & Tension' :
                     category === 'low' ? 'Low Feelings' :
                     category === 'cognitive' ? 'Mental State' :
                     category === 'positive' ? 'Positive Feelings' :
                     'Neutral State'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {emotions.map((emotion) => (
                      <Badge
                        key={emotion.id}
                        variant={selectedEmotions.includes(emotion.id) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          selectedEmotions.includes(emotion.id) 
                            ? category === 'positive' ? 'bg-green-600 hover:bg-green-700' :
                              category === 'stress' ? 'bg-red-600 hover:bg-red-700' :
                              category === 'low' ? 'bg-orange-600 hover:bg-orange-700' :
                              'bg-blue-600 hover:bg-blue-700'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleEmotionToggle(emotion.id)}
                      >
                        {emotion.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Physical Symptoms */}
      {mode === 'after' && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Physical Symptoms
                <span className="text-sm font-normal text-gray-500">(If any)</span>
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                {physicalSymptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    onClick={() => handleSymptomToggle(symptom.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSymptoms.includes(symptom.id)
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{symptom.label}</span>
                      {selectedSymptoms.includes(symptom.id) && (
                        <CheckCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs mt-1 ${
                        symptom.severity === 'high' ? 'border-red-300 text-red-700' :
                        'border-orange-300 text-orange-700'
                      }`}
                    >
                      {symptom.severity} concern
                    </Badge>
                  </div>
                ))}
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    <strong>Notice:</strong> Physical symptoms may indicate this relationship is affecting your health. 
                    Consider tracking patterns and discussing with a healthcare provider if symptoms persist.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {mode === 'after' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">Quick Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Energy Impact:</span>
                <div className="font-medium">
                  {initialData?.energyBefore && energyLevel[0] !== undefined ? (
                    <span className={`flex items-center gap-1 ${
                      energyLevel[0] > (initialData.energyBefore || 5) ? 'text-green-600' : 
                      energyLevel[0] < (initialData.energyBefore || 5) ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {energyLevel[0] > (initialData.energyBefore || 5) ? <TrendingUp className="w-4 h-4" /> : 
                       energyLevel[0] < (initialData.energyBefore || 5) ? <TrendingDown className="w-4 h-4" /> : <Meh className="w-4 h-4" />}
                      {initialData.energyBefore} → {energyLevel[0]}
                    </span>
                  ) : (
                    'Not measured'
                  )}
                </div>
              </div>
              <div>
                <span className="text-blue-600">Mood:</span>
                <div className="font-medium flex items-center gap-2">
                  <span>{currentMood.emoji}</span>
                  <span className={currentMood.color}>{currentMood.label}</span>
                </div>
              </div>
            </div>
            
            {(selectedEmotions.length > 0 || selectedSymptoms.length > 0) && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                {selectedEmotions.length > 0 && (
                  <div className="mb-2">
                    <span className="text-blue-600 text-sm">Emotions: </span>
                    <span className="text-sm">{selectedEmotions.slice(0, 3).join(', ')}</span>
                    {selectedEmotions.length > 3 && <span className="text-gray-500"> +{selectedEmotions.length - 3} more</span>}
                  </div>
                )}
                {selectedSymptoms.length > 0 && (
                  <div>
                    <span className="text-blue-600 text-sm">Physical: </span>
                    <span className="text-sm">{selectedSymptoms.slice(0, 2).join(', ')}</span>
                    {selectedSymptoms.length > 2 && <span className="text-gray-500"> +{selectedSymptoms.length - 2} more</span>}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}