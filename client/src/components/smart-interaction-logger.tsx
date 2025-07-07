import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Battery, 
  Heart, 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Target,
  Shield,
  Zap,
  MessageCircle,
  CheckCircle,
  XCircle,
  Calculator
} from "lucide-react";

interface SmartInteractionData {
  // Basic info
  relationshipId: number;
  timestamp: string;
  
  // Pre-interaction state
  preEnergyLevel: number; // 1-10
  preAnxietyLevel: number; // 1-10
  preSelfWorth: number; // 1-10
  preMood: string;
  
  // Interaction context
  interactionType: string;
  durationMinutes: number;
  locationSetting: string;
  witnessesPresent: boolean;
  
  // Smart baseline comparison
  communicationStyleUsed: string; // How they communicated with you
  validationReceived: string[]; // Types of validation you received
  triggersEncountered: string[]; // Triggers from baseline that occurred
  
  // Post-interaction impact
  postEnergyLevel: number;
  postAnxietyLevel: number;
  postSelfWorth: number;
  physicalSymptoms: string[];
  emotionalStates: string[];
  
  // Recovery
  recoveryTimeMinutes: number;
  
  // Auto-calculated scores
  communicationAlignmentScore?: number; // 0-100 based on baseline preferences
  validationScore?: number; // 0-100 based on validation needs
  triggerImpactScore?: number; // 0-100 based on triggers encountered
  overallCompatibilityScore?: number; // Combined score
}

interface SmartInteractionLoggerProps {
  relationshipId: number;
  relationshipName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SmartInteractionData) => void;
}

export default function SmartInteractionLogger({
  relationshipId,
  relationshipName,
  isOpen,
  onClose,
  onSave
}: SmartInteractionLoggerProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<SmartInteractionData>({
    relationshipId,
    timestamp: new Date().toISOString(),
    preEnergyLevel: 5,
    preAnxietyLevel: 5,
    preSelfWorth: 5,
    preMood: 'neutral',
    interactionType: '',
    durationMinutes: 30,
    locationSetting: '',
    witnessesPresent: false,
    communicationStyleUsed: '',
    validationReceived: [],
    triggersEncountered: [],
    postEnergyLevel: 5,
    postAnxietyLevel: 5,
    postSelfWorth: 5,
    physicalSymptoms: [],
    emotionalStates: [],
    recoveryTimeMinutes: 0
  });

  // Load user's baseline for automatic comparison
  const { data: baseline } = useQuery({
    queryKey: ['/api/baseline'],
    enabled: isOpen,
  });

  // Calculate scores based on baseline comparison
  const calculateScores = () => {
    if (!baseline) return;

    const scores = {
      communicationAlignmentScore: 50, // Default neutral
      validationScore: 50,
      triggerImpactScore: 50,
      overallCompatibilityScore: 50
    };

    // Communication Alignment Score (0-100)
    if (data.communicationStyleUsed && baseline.communicationStyleRanking && baseline.communicationStyleRanking.length > 0) {
      // Find position of used style in user's ranking (0-based index)
      const stylePosition = baseline.communicationStyleRanking.indexOf(data.communicationStyleUsed);
      
      if (stylePosition !== -1) {
        // Automatically assign weights: 1st = 10, 2nd = 8, 3rd = 6, 4th = 4
        const weight = 10 - (stylePosition * 2);
        scores.communicationAlignmentScore = Math.max(0, (weight / 10) * 100);
      }
    }

    // Validation Score (0-100)
    if (data.validationReceived.length > 0 && baseline.validationStyle) {
      const validationMatch = data.validationReceived.filter(v => 
        baseline.validationStyle.includes(v)
      ).length;
      const totalNeeded = baseline.validationStyle.length;
      scores.validationScore = Math.round((validationMatch / Math.max(1, totalNeeded)) * 100);
    }

    // Trigger Impact Score (0-100, lower is worse)
    if (data.triggersEncountered.length > 0 && baseline.triggers) {
      const triggerCount = data.triggersEncountered.filter(t => 
        baseline.triggers.includes(t)
      ).length;
      // More triggers = lower score
      scores.triggerImpactScore = Math.max(0, 100 - (triggerCount * 25));
    }

    // Overall Compatibility Score (weighted average)
    scores.overallCompatibilityScore = Math.round(
      (scores.communicationAlignmentScore * 0.4) +
      (scores.validationScore * 0.3) +
      (scores.triggerImpactScore * 0.3)
    );

    setData(prev => ({ ...prev, ...scores }));
  };

  useEffect(() => {
    calculateScores();
  }, [data.communicationStyleUsed, data.validationReceived, data.triggersEncountered, baseline]);

  const updateData = (key: keyof SmartInteractionData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await apiRequest('/api/interactions', 'POST', data);
      toast({
        title: "Interaction Logged",
        description: `Smart analysis complete. Compatibility score: ${data.overallCompatibilityScore}%`,
      });
      onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving interaction:', error);
      toast({
        title: "Error",
        description: "Failed to save interaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Battery className="w-12 h-12 mx-auto mb-3 text-blue-500" />
              <h3 className="text-xl font-semibold">Before the Interaction</h3>
              <p className="text-gray-600">How were you feeling before talking with {relationshipName}?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Energy Level (1 = exhausted, 10 = energized)</Label>
                <Slider
                  value={[data.preEnergyLevel]}
                  onValueChange={(value) => updateData('preEnergyLevel', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="text-center text-sm text-gray-600 mt-1">{data.preEnergyLevel}/10</div>
              </div>

              <div>
                <Label>Anxiety Level (1 = calm, 10 = very anxious)</Label>
                <Slider
                  value={[data.preAnxietyLevel]}
                  onValueChange={(value) => updateData('preAnxietyLevel', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="text-center text-sm text-gray-600 mt-1">{data.preAnxietyLevel}/10</div>
              </div>

              <div>
                <Label>Self-Worth (1 = low, 10 = confident)</Label>
                <Slider
                  value={[data.preSelfWorth]}
                  onValueChange={(value) => updateData('preSelfWorth', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="text-center text-sm text-gray-600 mt-1">{data.preSelfWorth}/10</div>
              </div>

              <div>
                <Label>Overall Mood</Label>
                <RadioGroup
                  value={data.preMood}
                  onValueChange={(value) => updateData('preMood', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-negative" id="very-negative" />
                    <Label htmlFor="very-negative">😰 Very Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="negative" id="negative" />
                    <Label htmlFor="negative">😟 Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="neutral" />
                    <Label htmlFor="neutral">😐 Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="positive" id="positive" />
                    <Label htmlFor="positive">😊 Good</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-positive" id="very-positive" />
                    <Label htmlFor="very-positive">😄 Very Good</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <h3 className="text-xl font-semibold">Smart Communication Analysis</h3>
              <p className="text-gray-600">How did they communicate? (Auto-scored against your preferences)</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>How did {relationshipName} communicate with you?</Label>
                <RadioGroup
                  value={data.communicationStyleUsed}
                  onValueChange={(value) => updateData('communicationStyleUsed', value)}
                  className="mt-2"
                >
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="direct" id="comm-direct" />
                      <Label htmlFor="comm-direct">Direct and straightforward</Label>
                    </div>
                    <Badge variant="outline">Weight: 10</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gentle" id="comm-gentle" />
                      <Label htmlFor="comm-gentle">Gentle and diplomatic</Label>
                    </div>
                    <Badge variant="outline">Weight: 8</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="collaborative" id="comm-collab" />
                      <Label htmlFor="comm-collab">Collaborative discussion</Label>
                    </div>
                    <Badge variant="outline">Weight: 6</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="assertive" id="comm-assert" />
                      <Label htmlFor="comm-assert">Assertive but respectful</Label>
                    </div>
                    <Badge variant="outline">Weight: 4</Badge>
                  </div>
                </RadioGroup>
              </div>

              {baseline?.validationStyle && (
                <div>
                  <Label>What emotional validation did you receive?</Label>
                  <div className="mt-2 space-y-2">
                    {baseline.validationStyle.map((validation: string) => (
                      <div key={validation} className="flex items-center space-x-2">
                        <Checkbox
                          id={validation}
                          checked={data.validationReceived.includes(validation)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateData('validationReceived', [...data.validationReceived, validation]);
                            } else {
                              updateData('validationReceived', data.validationReceived.filter(v => v !== validation));
                            }
                          }}
                        />
                        <Label htmlFor={validation} className="text-sm">{validation}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {baseline?.triggers && (
                <div>
                  <Label>Which of your triggers occurred? (Auto-counted for impact)</Label>
                  <div className="mt-2 space-y-2">
                    {baseline.triggers.map((trigger: string) => (
                      <div key={trigger} className="flex items-center space-x-2">
                        <Checkbox
                          id={trigger}
                          checked={data.triggersEncountered.includes(trigger)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateData('triggersEncountered', [...data.triggersEncountered, trigger]);
                            } else {
                              updateData('triggersEncountered', data.triggersEncountered.filter(t => t !== trigger));
                            }
                          }}
                        />
                        <Label htmlFor={trigger} className="text-sm text-red-600">{trigger}</Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Each trigger reduces compatibility score by 25 points</p>
                </div>
              )}

              {/* Auto-calculated scores display */}
              {data.communicationAlignmentScore !== undefined && (
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Auto-Calculated Scores</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Communication Alignment:</span>
                        <span className="font-medium">{data.communicationAlignmentScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Validation Score:</span>
                        <span className="font-medium">{data.validationScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trigger Impact:</span>
                        <span className="font-medium">{data.triggerImpactScore}%</span>
                      </div>
                      <hr className="my-1" />
                      <div className="flex justify-between font-medium">
                        <span>Overall Compatibility:</span>
                        <span className={`${data.overallCompatibilityScore! >= 70 ? 'text-green-600' : data.overallCompatibilityScore! >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {data.overallCompatibilityScore}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <h3 className="text-xl font-semibold">After the Interaction</h3>
              <p className="text-gray-600">How did you feel after talking with {relationshipName}?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Energy Level After (1 = exhausted, 10 = energized)</Label>
                <Slider
                  value={[data.postEnergyLevel]}
                  onValueChange={(value) => updateData('postEnergyLevel', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{data.postEnergyLevel}/10</span>
                  <span className={`font-medium ${data.postEnergyLevel > data.preEnergyLevel ? 'text-green-600' : data.postEnergyLevel < data.preEnergyLevel ? 'text-red-600' : 'text-gray-600'}`}>
                    {data.postEnergyLevel > data.preEnergyLevel ? `+${data.postEnergyLevel - data.preEnergyLevel}` : 
                     data.postEnergyLevel < data.preEnergyLevel ? `${data.postEnergyLevel - data.preEnergyLevel}` : 'No change'}
                  </span>
                </div>
              </div>

              <div>
                <Label>Recovery Time (minutes to feel normal again)</Label>
                <Input
                  type="number"
                  value={data.recoveryTimeMinutes}
                  onChange={(e) => updateData('recoveryTimeMinutes', parseInt(e.target.value) || 0)}
                  className="mt-2"
                  placeholder="0"
                />
              </div>

              <div>
                <Label>Physical symptoms experienced</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    'Headache', 'Tension', 'Fatigue', 'Nausea',
                    'Heart racing', 'Stomach upset', 'Muscle pain', 'Insomnia'
                  ].map(symptom => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={data.physicalSymptoms.includes(symptom)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateData('physicalSymptoms', [...data.physicalSymptoms, symptom]);
                          } else {
                            updateData('physicalSymptoms', data.physicalSymptoms.filter(s => s !== symptom));
                          }
                        }}
                      />
                      <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Smart Analysis Summary</h4>
                <div className="text-sm text-gray-600">
                  <p>Triggers encountered: <span className="font-medium text-red-600">{data.triggersEncountered.length}</span></p>
                  <p>Baseline compatibility: <span className={`font-medium ${data.overallCompatibilityScore! >= 70 ? 'text-green-600' : data.overallCompatibilityScore! >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{data.overallCompatibilityScore}%</span></p>
                  <p>Energy impact: <span className={`font-medium ${data.postEnergyLevel > data.preEnergyLevel ? 'text-green-600' : data.postEnergyLevel < data.preEnergyLevel ? 'text-red-600' : 'text-gray-600'}`}>
                    {data.postEnergyLevel > data.preEnergyLevel ? 'Energizing' : 
                     data.postEnergyLevel < data.preEnergyLevel ? 'Draining' : 'Neutral'}
                  </span></p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Smart Interaction Logger</h2>
              <p className="text-gray-600">Step {currentStep} of 3 - {relationshipName}</p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-xl">×</Button>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={currentStep === 1 ? onClose : () => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button 
              onClick={currentStep === 3 ? handleSave : () => setCurrentStep(currentStep + 1)}
            >
              {currentStep === 3 ? 'Save & Analyze' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}