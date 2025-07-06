import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MoodEnergyTracker from "@/components/mood-energy-tracker";
import { 
  Zap, 
  MessageSquare, 
  AlertTriangle, 
  Heart, 
  Clock, 
  MapPin, 
  Users, 
  Mic,
  Camera,
  Calendar,
  TrendingDown,
  TrendingUp,
  Shield,
  Target,
  Plus,
  X
} from "lucide-react";

interface QuickLogTemplate {
  id: string;
  title: string;
  description: string;
  flagType: 'red' | 'green';
  category: string;
  icon: any;
  color: string;
  commonTriggers?: string[];
  suggestedResponses?: string[];
  severity: 'low' | 'medium' | 'high';
}

interface SmartInteractionLoggerProps {
  relationshipId: number;
  relationshipName: string;
  onSubmit: (data: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

const quickLogTemplates: QuickLogTemplate[] = [
  // Red Flags
  {
    id: 'interruption',
    title: 'Interrupted/Talked Over',
    description: 'They consistently interrupt or dismiss what I\'m saying',
    flagType: 'red',
    category: 'Communication',
    icon: MessageSquare,
    color: 'from-red-500 to-red-600',
    severity: 'medium',
    commonTriggers: ['Important conversation', 'Sharing feelings', 'Setting boundaries'],
    suggestedResponses: ['Stop, I was still talking', 'Please let me finish', 'I need you to listen']
  },
  {
    id: 'guilt-trip',
    title: 'Guilt-Tripping',
    description: 'Made me feel guilty for having boundaries or saying no',
    flagType: 'red',
    category: 'Emotional Manipulation',
    icon: AlertTriangle,
    color: 'from-orange-500 to-red-600',
    severity: 'high',
    commonTriggers: ['Saying no', 'Setting limits', 'Prioritizing myself'],
    suggestedResponses: ['I won\'t feel guilty for taking care of myself', 'This is what works for me', 'I\'m not responsible for your feelings about my boundaries']
  },
  {
    id: 'ignored-no',
    title: 'Ignored My "No"',
    description: 'Pushed after I clearly said no or set a boundary',
    flagType: 'red',
    category: 'Boundary Violation',
    icon: Shield,
    color: 'from-red-600 to-red-700',
    severity: 'high',
    commonTriggers: ['Clear boundary setting', 'Saying no', 'Declining requests'],
    suggestedResponses: ['I already said no', 'I need you to respect my decision', 'This conversation is over']
  },
  {
    id: 'emotional-outburst',
    title: 'Emotional Outburst',
    description: 'Yelled, raged, or had disproportionate emotional reaction',
    flagType: 'red',
    category: 'Emotional Regulation',
    icon: TrendingDown,
    color: 'from-red-500 to-red-700',
    severity: 'high',
    commonTriggers: ['Disagreement', 'Not getting their way', 'Being held accountable'],
    suggestedResponses: ['I need you to calm down', 'We can talk when you\'re ready to be respectful', 'I\'m leaving until you can regulate yourself']
  },

  // Green Flags  
  {
    id: 'respected-boundary',
    title: 'Respected My Boundary',
    description: 'Accepted my limits without pushback or guilt-tripping',
    flagType: 'green',
    category: 'Boundary Respect',
    icon: Shield,
    color: 'from-green-500 to-green-600',
    severity: 'low',
  },
  {
    id: 'active-listening',
    title: 'Really Listened',
    description: 'Gave me their full attention and responded thoughtfully',
    flagType: 'green',
    category: 'Communication',
    icon: Heart,
    color: 'from-green-500 to-blue-500',
    severity: 'low',
  },
  {
    id: 'took-accountability',
    title: 'Took Accountability',
    description: 'Owned their mistake without deflecting or making excuses',
    flagType: 'green',
    category: 'Accountability',
    icon: Target,
    color: 'from-blue-500 to-green-600',
    severity: 'low',
  },
  {
    id: 'checked-in',
    title: 'Checked In on Me',
    description: 'Asked how I\'m doing and genuinely cared about the answer',
    flagType: 'green',
    category: 'Emotional Support',
    icon: Heart,
    color: 'from-pink-500 to-green-500',
    severity: 'low',
  }
];

export default function SmartInteractionLogger({
  relationshipId,
  relationshipName,
  onSubmit,
  isOpen,
  onClose
}: SmartInteractionLoggerProps) {
  const [step, setStep] = useState<'mood-before' | 'template' | 'details' | 'mood-after' | 'recovery'>('mood-before');
  const [selectedTemplate, setSelectedTemplate] = useState<QuickLogTemplate | null>(null);
  const [customDetails, setCustomDetails] = useState('');
  const [emotionalImpact, setEmotionalImpact] = useState<string>('');
  const [contextualData, setContextualData] = useState({
    location: '',
    timeOfDay: '',
    witnesses: '',
    trigger: '',
    duration: '',
    myEnergyBefore: '',
    myEnergyAfter: ''
  });
  const [moodData, setMoodData] = useState<any>({});
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when dialog closes
      setSelectedTemplate(null);
      setCustomDetails('');
      setEmotionalImpact('');
      setContextualData({
        location: '',
        timeOfDay: '',
        witnesses: '',
        trigger: '',
        duration: '',
        myEnergyBefore: '',
        myEnergyAfter: ''
      });
    }
  }, [isOpen]);

  const handleTemplateSelect = (template: QuickLogTemplate) => {
    setSelectedTemplate(template);
  };

  const handleSubmit = () => {
    if (!selectedTemplate) return;

    const logData = {
      relationshipId,
      templateId: selectedTemplate.id,
      flagType: selectedTemplate.flagType,
      category: selectedTemplate.category,
      title: selectedTemplate.title,
      description: selectedTemplate.description,
      customDetails,
      emotionalImpact,
      severity: selectedTemplate.severity,
      contextualData,
      timestamp: new Date().toISOString(),
      // Include suggested responses for red flags
      suggestedResponses: selectedTemplate.suggestedResponses || []
    };

    onSubmit(logData);
    onClose();
  };

  const getTemplatesByType = (type: 'red' | 'green') => {
    return quickLogTemplates.filter(t => t.flagType === type);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Log Interaction with {relationshipName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedTemplate ? (
            // Template Selection Phase
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Choose the interaction type that best describes what happened:
                </p>
              </div>

              {/* Red Flags Section */}
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Concerning Behaviors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getTemplatesByType('red').map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTemplateSelect(template)}
                      className="cursor-pointer p-4 border-2 border-red-200 rounded-lg hover:border-red-300 bg-red-50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${template.color}`}>
                          <template.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1">{template.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{template.category}</Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                template.severity === 'high' ? 'border-red-400 text-red-700' :
                                template.severity === 'medium' ? 'border-orange-400 text-orange-700' :
                                'border-yellow-400 text-yellow-700'
                              }`}
                            >
                              {template.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Green Flags Section */}
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Positive Behaviors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getTemplatesByType('green').map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTemplateSelect(template)}
                      className="cursor-pointer p-4 border-2 border-green-200 rounded-lg hover:border-green-300 bg-green-50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${template.color}`}>
                          <template.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1">{template.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Custom Entry Option */}
              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedTemplate({
                    id: 'custom',
                    title: 'Custom Entry',
                    description: 'Describe the interaction in your own words',
                    flagType: 'green', // Will be changed in form
                    category: 'General',
                    icon: Plus,
                    color: 'from-gray-500 to-gray-600',
                    severity: 'medium'
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom Entry
                </Button>
              </div>
            </div>
          ) : (
            // Detail Entry Phase
            <div className="space-y-6">
              {/* Selected Template Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedTemplate.color}`}>
                    <selectedTemplate.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{selectedTemplate.title}</h3>
                    <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Custom Details */}
              <div className="space-y-3">
                <Label>Additional Details</Label>
                <Textarea
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  placeholder="Describe what exactly happened, what was said, how it made you feel..."
                  className="min-h-[100px]"
                />
                
                {/* Voice Input Option */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                    className={isRecording ? 'bg-red-100 border-red-300' : ''}
                  >
                    <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'text-red-600' : ''}`} />
                    {isRecording ? 'Stop Recording' : 'Voice Input'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photo
                  </Button>
                </div>
              </div>

              {/* Emotional Impact */}
              <div className="space-y-3">
                <Label>How did this affect you emotionally?</Label>
                <Select value={emotionalImpact} onValueChange={setEmotionalImpact}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select emotional impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-positive">Very Positive - Felt appreciated and supported</SelectItem>
                    <SelectItem value="positive">Positive - Felt good about the interaction</SelectItem>
                    <SelectItem value="neutral">Neutral - No strong emotional impact</SelectItem>
                    <SelectItem value="negative">Negative - Felt frustrated or upset</SelectItem>
                    <SelectItem value="very-negative">Very Negative - Felt hurt, angry, or drained</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contextual Data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Energy Before (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={contextualData.myEnergyBefore}
                    onChange={(e) => setContextualData(prev => ({ ...prev, myEnergyBefore: e.target.value }))}
                    placeholder="8"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Energy After (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={contextualData.myEnergyAfter}
                    onChange={(e) => setContextualData(prev => ({ ...prev, myEnergyAfter: e.target.value }))}
                    placeholder="3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location/Setting
                  </Label>
                  <Input
                    value={contextualData.location}
                    onChange={(e) => setContextualData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Home, work, public place..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration
                  </Label>
                  <Input
                    value={contextualData.duration}
                    onChange={(e) => setContextualData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="5 minutes, 2 hours..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Who else was present?
                </Label>
                <Input
                  value={contextualData.witnesses}
                  onChange={(e) => setContextualData(prev => ({ ...prev, witnesses: e.target.value }))}
                  placeholder="Just us, their friends, my family..."
                />
              </div>

              {/* Suggested Responses for Red Flags */}
              {selectedTemplate.flagType === 'red' && selectedTemplate.suggestedResponses && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Suggested Responses for Next Time:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {selectedTemplate.suggestedResponses.map((response, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span>"{response}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  Log Interaction
                </Button>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}