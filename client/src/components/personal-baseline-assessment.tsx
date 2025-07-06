import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Heart, Shield, MessageSquare, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PersonalBaselineAssessmentProps {
  existingBaseline?: any;
  onComplete: (baseline: any) => void;
  onCancel: () => void;
}

export default function PersonalBaselineAssessment({ 
  existingBaseline, 
  onComplete, 
  onCancel 
}: PersonalBaselineAssessmentProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Initialize communication styles in default order
  const [communicationStyles, setCommunicationStyles] = useState([
    { value: "direct", label: "Direct and straightforward" },
    { value: "gentle", label: "Gentle and diplomatic" },
    { value: "collaborative", label: "Collaborative and discussion-focused" },
    { value: "assertive", label: "Assertive but respectful" }
  ]);
  const [baselineData, setBaselineData] = useState({
    // Communication Preferences
    communicationStyle: existingBaseline?.communicationStyle || '',
    communicationStyleRanking: existingBaseline?.communicationStyleRanking || [],
    conflictResolution: existingBaseline?.conflictResolution || '',
    listeningNeeds: existingBaseline?.listeningNeeds || [],
    feedbackPreference: existingBaseline?.feedbackPreference || '',
    
    // Emotional Needs
    emotionalSupport: existingBaseline?.emotionalSupport || '',
    emotionalValidationNeeds: existingBaseline?.emotionalValidationNeeds || '',
    validationStyle: existingBaseline?.validationStyle || [],
    affectionStyle: existingBaseline?.affectionStyle || [],
    validationNeeds: existingBaseline?.validationNeeds || '',
    emotionalProcessingTime: existingBaseline?.emotionalProcessingTime || 0,
    triggers: existingBaseline?.triggers || [],
    comfortingSources: existingBaseline?.comfortingSources || [],
    
    // Boundary Requirements
    personalSpaceNeeds: existingBaseline?.personalSpaceNeeds || '',
    privacyLevel: existingBaseline?.privacyLevel || '',
    decisionMakingStyle: existingBaseline?.decisionMakingStyle || '',
    nonNegotiableBoundaries: existingBaseline?.nonNegotiableBoundaries || [],
    flexibleBoundaries: existingBaseline?.flexibleBoundaries || [],
    
    // Core Values & Deal-breakers
    coreValues: existingBaseline?.coreValues || [],
    dealBreakers: existingBaseline?.dealBreakers || [],
    toleranceLevels: existingBaseline?.toleranceLevels || {},
    
    // Physical & Mental Health Patterns
    energyDrains: existingBaseline?.energyDrains || [],
    energySources: existingBaseline?.energySources || [],
    anxietyTriggers: existingBaseline?.anxietyTriggers || [],
    selfWorthFactors: existingBaseline?.selfWorthFactors || [],
    physicalSymptomTriggers: existingBaseline?.physicalSymptomTriggers || []
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await apiRequest('/api/baseline', 'POST', baselineData);
      toast({
        title: "Baseline Assessment Complete",
        description: "Your personal baseline has been saved and will be used to analyze relationship patterns.",
      });
      onComplete(result);
    } catch (error) {
      console.error('Error saving baseline:', error);
      toast({
        title: "Error",
        description: "Failed to save baseline assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateData = (key: string, value: any) => {
    setBaselineData(prev => ({ ...prev, [key]: value }));
  };

  const addToArray = (key: string, value: string) => {
    if (value.trim()) {
      setBaselineData(prev => ({
        ...prev,
        [key]: [...(prev[key as keyof typeof prev] as string[]), value.trim()]
      }));
    }
  };

  const removeFromArray = (key: string, index: number) => {
    setBaselineData(prev => ({
      ...prev,
      [key]: (prev[key as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-blue-500" />
              <h3 className="text-xl font-semibold">Communication Preferences</h3>
              <p className="text-gray-600">How do you prefer to communicate and handle conflicts?</p>
            </div>

            <div className="space-y-6">
              {/* Communication Style Ranking */}
              <div>
                <Label className="text-base font-medium">Rank your communication preferences from most to least preferred:</Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">Drag to reorder. The system will automatically assign weights based on your ranking.</p>
                <div className="mt-3 space-y-2">
                  {communicationStyles.map((style, index) => (
                    <div 
                      key={style.value} 
                      className="flex items-center gap-3 p-3 border rounded-lg bg-white cursor-move hover:bg-gray-50 transition-colors"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', index.toString());
                        e.currentTarget.classList.add('opacity-50');
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove('opacity-50');
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                        const targetIndex = index;
                        
                        if (draggedIndex !== targetIndex) {
                          const newStyles = [...communicationStyles];
                          const draggedItem = newStyles[draggedIndex];
                          newStyles.splice(draggedIndex, 1);
                          newStyles.splice(targetIndex, 0, draggedItem);
                          setCommunicationStyles(newStyles);
                          
                          // Update baselineData with new ranking
                          const ranking = newStyles.map(s => s.value);
                          updateData('communicationStyleRanking', ranking);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <span className="text-xs text-gray-500">≡</span>
                      </div>
                      <Label className="flex-1 cursor-move">{style.label}</Label>

                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">This ranking helps the system automatically score how well others communicate with your preferences.</p>
              </div>

              <div>
                <Label className="text-base font-medium">When there's conflict, I prefer to:</Label>
                <RadioGroup 
                  value={baselineData.conflictResolution} 
                  onValueChange={(value) => updateData('conflictResolution', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="address-immediately" id="address-immediately" />
                    <Label htmlFor="address-immediately">Address it immediately and openly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="time-to-process" id="time-to-process" />
                    <Label htmlFor="time-to-process">Take time to process before discussing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="find-compromise" id="find-compromise" />
                    <Label htmlFor="find-compromise">Focus on finding a compromise</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="understand-first" id="understand-first" />
                    <Label htmlFor="understand-first">Understand their perspective first</Label>
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
              <Heart className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <h3 className="text-xl font-semibold">Emotional Needs</h3>
              <p className="text-gray-600">What do you need to feel emotionally supported and secure?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">I need this level of emotional support:</Label>
                <RadioGroup 
                  value={baselineData.emotionalSupport} 
                  onValueChange={(value) => updateData('emotionalSupport', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high-support" />
                    <Label htmlFor="high-support">High - frequent check-ins and emotional availability</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate-support" />
                    <Label htmlFor="moderate-support">Moderate - regular but not constant support</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low-support" />
                    <Label htmlFor="low-support">Low - occasional support when needed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="independent" id="independent-support" />
                    <Label htmlFor="independent-support">Very independent - minimal emotional support needed</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Emotional Validation Needs */}
              <div>
                <Label className="text-base font-medium">I need emotional validation through:</Label>
                <div className="mt-2 space-y-2">
                  {[
                    "Verbal acknowledgment of my feelings",
                    "Active listening without trying to fix",
                    "Being asked how I'm feeling",
                    "Having my perspective acknowledged",
                    "Receiving empathy when I'm struggling",
                    "Being told my feelings are valid",
                    "Having someone sit with me in difficult emotions",
                    "Being reassured that I'm understood"
                  ].map((validation) => (
                    <div key={validation} className="flex items-center space-x-2">
                      <Checkbox
                        id={validation}
                        checked={baselineData.validationStyle.includes(validation)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            addToArray('validationStyle', validation);
                          } else {
                            const index = baselineData.validationStyle.indexOf(validation);
                            if (index > -1) removeFromArray('validationStyle', index);
                          }
                        }}
                      />
                      <Label htmlFor={validation} className="text-sm">{validation}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">When I need emotional validation, I prefer:</Label>
                <RadioGroup 
                  value={baselineData.emotionalValidationNeeds} 
                  onValueChange={(value) => updateData('emotionalValidationNeeds', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="immediate-validation" />
                    <Label htmlFor="immediate-validation">Immediate acknowledgment and support</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gentle" id="gentle-validation" />
                    <Label htmlFor="gentle-validation">Gentle, patient validation at my pace</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="space-first" id="space-first-validation" />
                    <Label htmlFor="space-first-validation">Space to process, then validation when I ask</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal-validation" />
                    <Label htmlFor="minimal-validation">Minimal validation - I process internally</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">My emotional triggers include:</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    'Being dismissed or ignored',
                    'Raised voices or yelling', 
                    'Being interrupted',
                    'Feeling criticized',
                    'Being rushed or pressured',
                    'Having boundaries violated',
                    'Not being heard',
                    'Being blamed',
                    'Feeling misunderstood',
                    'Being lied to',
                    'Having decisions made for me',
                    'Being compared to others',
                    'Passive-aggressive comments',
                    'Dismissive tone or language',
                    'Silent treatment',
                    'Sarcasm during serious conversations'
                  ].map(trigger => (
                    <div key={trigger} className="flex items-center space-x-2">
                      <Checkbox
                        id={trigger}
                        checked={baselineData.triggers.includes(trigger)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateData('triggers', [...baselineData.triggers, trigger]);
                          } else {
                            updateData('triggers', baselineData.triggers.filter((t: string) => t !== trigger));
                          }
                        }}
                      />
                      <Label htmlFor={trigger} className="text-sm">{trigger}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <h3 className="text-xl font-semibold">Boundary Requirements</h3>
              <p className="text-gray-600">What boundaries are essential for your wellbeing?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">My non-negotiable boundaries:</Label>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {[
                    'No yelling or verbal abuse',
                    'Respect my "no" when I say it',
                    'No touching without permission',
                    'Respect my privacy and personal space',
                    'No lying or deception',
                    'No pressuring me to do things I\'m uncomfortable with',
                    'Respect my time and commitments',
                    'No name-calling or insults',
                    'Allow me to have my own opinions',
                    'No threatening behavior',
                    'Respect my relationships with others',
                    'No controlling my choices or decisions'
                  ].map(boundary => (
                    <div key={boundary} className="flex items-center space-x-2">
                      <Checkbox
                        id={boundary}
                        checked={baselineData.nonNegotiableBoundaries.includes(boundary)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateData('nonNegotiableBoundaries', [...baselineData.nonNegotiableBoundaries, boundary]);
                          } else {
                            updateData('nonNegotiableBoundaries', baselineData.nonNegotiableBoundaries.filter((b: string) => b !== boundary));
                          }
                        }}
                      />
                      <Label htmlFor={boundary} className="text-sm">{boundary}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Personal space and privacy needs:</Label>
                <RadioGroup 
                  value={baselineData.personalSpaceNeeds} 
                  onValueChange={(value) => updateData('personalSpaceNeeds', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high-space" />
                    <Label htmlFor="high-space">High - need significant alone time and personal space</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate-space" />
                    <Label htmlFor="moderate-space">Moderate - need some personal time and space</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low-space" />
                    <Label htmlFor="low-space">Low - comfortable with limited personal space</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="flexible-space" />
                    <Label htmlFor="flexible-space">Flexible - varies based on relationship and context</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
              <h3 className="text-xl font-semibold">Health Impact Patterns</h3>
              <p className="text-gray-600">What behaviors and situations affect your physical and mental health?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Things that drain my energy:</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    'Arguments and conflict',
                    'Being interrupted constantly',
                    'Feeling rushed or pressured',
                    'Having to repeat myself',
                    'Being criticized or judged',
                    'Loud or chaotic environments',
                    'Feeling unheard or dismissed',
                    'Having my boundaries violated',
                    'Being around negative energy',
                    'Dealing with dishonesty',
                    'Feeling controlled or manipulated',
                    'Having to defend my choices'
                  ].map(drain => (
                    <div key={drain} className="flex items-center space-x-2">
                      <Checkbox
                        id={drain}
                        checked={baselineData.energyDrains.includes(drain)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateData('energyDrains', [...baselineData.energyDrains, drain]);
                          } else {
                            updateData('energyDrains', baselineData.energyDrains.filter((d: string) => d !== drain));
                          }
                        }}
                      />
                      <Label htmlFor={drain} className="text-sm">{drain}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Things that boost my energy:</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    'Deep, meaningful conversations',
                    'Being truly heard and understood',
                    'Feeling supported and validated',
                    'Having my boundaries respected',
                    'Laughing and having fun together',
                    'Feeling appreciated and valued',
                    'Honest and open communication',
                    'Peaceful, calm environments',
                    'Being encouraged to be myself',
                    'Having my feelings acknowledged',
                    'Feeling safe to express myself',
                    'Collaborative problem-solving'
                  ].map(source => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox
                        id={source}
                        checked={baselineData.energySources.includes(source)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateData('energySources', [...baselineData.energySources, source]);
                          } else {
                            updateData('energySources', baselineData.energySources.filter((s: string) => s !== source));
                          }
                        }}
                      />
                      <Label htmlFor={source} className="text-sm">{source}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Brain className="w-12 h-12 mx-auto mb-3 text-purple-500" />
              <h3 className="text-xl font-semibold">Review & Complete</h3>
              <p className="text-gray-600">Review your baseline assessment before saving</p>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Communication Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Style:</strong> {baselineData.communicationStyle}</p>
                  <p><strong>Conflict Resolution:</strong> {baselineData.conflictResolution}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emotional Needs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Support Level:</strong> {baselineData.emotionalSupport}</p>
                  {baselineData.triggers.length > 0 && (
                    <div>
                      <strong>Triggers:</strong> {baselineData.triggers.join(', ')}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Boundaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Personal Space:</strong> {baselineData.personalSpaceNeeds}</p>
                  {baselineData.nonNegotiableBoundaries.length > 0 && (
                    <div>
                      <strong>Non-negotiables:</strong> {baselineData.nonNegotiableBoundaries.join(', ')}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  {baselineData.energyDrains.length > 0 && (
                    <div className="mb-2">
                      <strong>Energy Drains:</strong> {baselineData.energyDrains.join(', ')}
                    </div>
                  )}
                  {baselineData.energySources.length > 0 && (
                    <div>
                      <strong>Energy Sources:</strong> {baselineData.energySources.join(', ')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Personal Baseline Assessment</h2>
              <p className="text-gray-600">Step {currentStep} of 5</p>
            </div>
            <Button variant="ghost" onClick={onCancel} className="text-xl">×</Button>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={currentStep === 1 ? onCancel : handleBack}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button onClick={handleNext}>
              {currentStep === 5 ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}