import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, ArrowLeft, Save, CheckCircle, Heart, Shield } from 'lucide-react';
import Navigation from '@/components/navigation';

interface BaselineData {
  communicationStyle: string;
  conflictResolution: string;
  feedbackPreference: string;
  emotionalSupport: string;
  emotionalProcessingTime: number;
  validationNeeds: string;
  personalSpaceNeeds: string;
  responseTimeExpectation: number;
  aloneTimeFrequency: string;
  triggers: string[];
  dealBreakerBehaviors: string[];
  nonNegotiableBoundaries: string[];
  notes: string;
}

const TOTAL_STEPS = 6;

export default function BaselinePageClean() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BaselineData>({
    communicationStyle: '',
    conflictResolution: '',
    feedbackPreference: '',
    emotionalSupport: '',
    emotionalProcessingTime: 0,
    validationNeeds: '',
    personalSpaceNeeds: '',
    responseTimeExpectation: 0,
    aloneTimeFrequency: '',
    triggers: [],
    dealBreakerBehaviors: [],
    nonNegotiableBoundaries: [],
    notes: ''
  });

  // Check if user has existing baseline
  const { data: existingBaseline, isLoading } = useQuery({
    queryKey: ['/api/baseline']
  });

  // Save baseline mutation
  const saveBaseline = useMutation({
    mutationFn: async (data: BaselineData) => {
      const response = await apiRequest('POST', '/api/baseline', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Baseline Saved!",
        description: "Your personal baseline has been saved successfully.",
      });
      // Redirect to dashboard
      window.location.href = '/';
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save baseline. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Populate form with existing baseline data when it loads
  useEffect(() => {
    if (existingBaseline) {
      setFormData({
        communicationStyle: existingBaseline.communicationStyle || '',
        conflictResolution: existingBaseline.conflictResolution || '',
        feedbackPreference: existingBaseline.feedbackPreference || '',
        emotionalSupport: existingBaseline.emotionalSupport || '',
        emotionalProcessingTime: existingBaseline.emotionalProcessingTime || 0,
        validationNeeds: existingBaseline.validationNeeds || '',
        personalSpaceNeeds: existingBaseline.personalSpaceNeeds || '',
        responseTimeExpectation: existingBaseline.responseTimeExpectation || 0,
        aloneTimeFrequency: existingBaseline.aloneTimeFrequency || '',
        triggers: existingBaseline.triggers || [],
        dealBreakerBehaviors: existingBaseline.dealBreakerBehaviors || [],
        nonNegotiableBoundaries: existingBaseline.nonNegotiableBoundaries || [],
        notes: existingBaseline.notes || ''
      });
    }
  }, [existingBaseline]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof BaselineData, item: string) => {
    const currentArray = formData[field] as string[];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item]
    }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    saveBaseline.mutate(formData);
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading your baseline...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 mb-8 border-0 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">Personal Baseline Assessment</h1>
              <p className="text-lg text-neutral-600">
                Help us understand your communication style and emotional needs
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-neutral-600 mt-2">Step {currentStep} of {TOTAL_STEPS}</p>
          </div>
        </div>

        {/* Question Cards */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            
            {/* Step 1: Communication Style */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">Communication Preferences</h2>
                  <p className="text-neutral-600">How do you prefer to communicate and handle feedback?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold text-neutral-800 mb-4 block">
                      What's your preferred communication style?
                    </Label>
                    <RadioGroup 
                      value={formData.communicationStyle} 
                      onValueChange={(value) => updateFormData('communicationStyle', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="direct" id="direct" />
                        <Label htmlFor="direct" className="flex-1 cursor-pointer">
                          <span className="font-medium">Direct</span> - I appreciate clear, straightforward communication
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="gentle" id="gentle" />
                        <Label htmlFor="gentle" className="flex-1 cursor-pointer">
                          <span className="font-medium">Gentle</span> - I prefer soft, considerate approaches
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="collaborative" id="collaborative" />
                        <Label htmlFor="collaborative" className="flex-1 cursor-pointer">
                          <span className="font-medium">Collaborative</span> - I like working together to find solutions
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="assertive" id="assertive" />
                        <Label htmlFor="assertive" className="flex-1 cursor-pointer">
                          <span className="font-medium">Assertive</span> - I'm comfortable with confident, firm communication
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold text-neutral-800 mb-4 block">
                      How do you handle conflict?
                    </Label>
                    <RadioGroup 
                      value={formData.conflictResolution} 
                      onValueChange={(value) => updateFormData('conflictResolution', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="address-immediately" id="address-immediately" />
                        <Label htmlFor="address-immediately" className="flex-1 cursor-pointer">
                          <span className="font-medium">Address immediately</span> - I prefer to resolve issues right away
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="need-time-to-process" id="need-time-to-process" />
                        <Label htmlFor="need-time-to-process" className="flex-1 cursor-pointer">
                          <span className="font-medium">Need time to process</span> - I need space before addressing conflicts
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="address-when-calm" id="address-when-calm" />
                        <Label htmlFor="address-when-calm" className="flex-1 cursor-pointer">
                          <span className="font-medium">Address when calm</span> - I prefer to wait until emotions settle
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="avoid-conflict" id="avoid-conflict" />
                        <Label htmlFor="avoid-conflict" className="flex-1 cursor-pointer">
                          <span className="font-medium">Avoid conflict</span> - I tend to avoid confrontational situations
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Emotional Needs */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-rose-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">Emotional Needs</h2>
                  <p className="text-neutral-600">Help us understand your emotional support preferences</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold text-neutral-800 mb-4 block">
                      How much emotional support do you typically need?
                    </Label>
                    <RadioGroup 
                      value={formData.emotionalSupport} 
                      onValueChange={(value) => updateFormData('emotionalSupport', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="high" id="high-support" />
                        <Label htmlFor="high-support" className="flex-1 cursor-pointer">
                          <span className="font-medium">High</span> - I need frequent emotional check-ins and support
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="medium" id="medium-support" />
                        <Label htmlFor="medium-support" className="flex-1 cursor-pointer">
                          <span className="font-medium">Medium</span> - I appreciate regular emotional connection
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="low" id="low-support" />
                        <Label htmlFor="low-support" className="flex-1 cursor-pointer">
                          <span className="font-medium">Low</span> - I'm comfortable with minimal emotional support
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold text-neutral-800 mb-4 block">
                      How much time do you typically need to process emotional situations?
                    </Label>
                    <RadioGroup 
                      value={formData.emotionalProcessingTime.toString()} 
                      onValueChange={(value) => updateFormData('emotionalProcessingTime', parseInt(value))}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="1" id="1-hour" />
                        <Label htmlFor="1-hour" className="flex-1 cursor-pointer">
                          <span className="font-medium">1 hour</span> - I process emotions quickly
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="4" id="4-hours" />
                        <Label htmlFor="4-hours" className="flex-1 cursor-pointer">
                          <span className="font-medium">4 hours</span> - I need a few hours to process
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="12" id="12-hours" />
                        <Label htmlFor="12-hours" className="flex-1 cursor-pointer">
                          <span className="font-medium">12 hours</span> - I need half a day or more
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="24" id="24-hours" />
                        <Label htmlFor="24-hours" className="flex-1 cursor-pointer">
                          <span className="font-medium">24+ hours</span> - I need a full day or more to process
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Personal Space & Time */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">Personal Space & Time</h2>
                  <p className="text-neutral-600">Let us know about your space and time preferences</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold text-neutral-800 mb-4 block">
                      How much personal space do you need?
                    </Label>
                    <RadioGroup 
                      value={formData.personalSpaceNeeds} 
                      onValueChange={(value) => updateFormData('personalSpaceNeeds', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="high" id="high-space" />
                        <Label htmlFor="high-space" className="flex-1 cursor-pointer">
                          <span className="font-medium">High</span> - I need lots of alone time and personal space
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="medium" id="medium-space" />
                        <Label htmlFor="medium-space" className="flex-1 cursor-pointer">
                          <span className="font-medium">Medium</span> - I appreciate regular personal time
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="low" id="low-space" />
                        <Label htmlFor="low-space" className="flex-1 cursor-pointer">
                          <span className="font-medium">Low</span> - I'm comfortable with minimal personal space
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold text-neutral-800 mb-4 block">
                      How quickly do you expect responses to messages?
                    </Label>
                    <RadioGroup 
                      value={formData.responseTimeExpectation.toString()} 
                      onValueChange={(value) => updateFormData('responseTimeExpectation', parseInt(value))}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="1" id="1-hour-response" />
                        <Label htmlFor="1-hour-response" className="flex-1 cursor-pointer">
                          <span className="font-medium">Within 1 hour</span> - I prefer quick responses
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="4" id="4-hour-response" />
                        <Label htmlFor="4-hour-response" className="flex-1 cursor-pointer">
                          <span className="font-medium">Within 4 hours</span> - Same day responses work for me
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="24" id="24-hour-response" />
                        <Label htmlFor="24-hour-response" className="flex-1 cursor-pointer">
                          <span className="font-medium">Within 24 hours</span> - I'm patient with responses
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <RadioGroupItem value="72" id="72-hour-response" />
                        <Label htmlFor="72-hour-response" className="flex-1 cursor-pointer">
                          <span className="font-medium">Within 3 days</span> - I don't mind waiting for responses
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Common Triggers */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">Personal Triggers</h2>
                  <p className="text-neutral-600">Select behaviors or situations that typically upset you</p>
                </div>

                <div>
                  <Label className="text-lg font-semibold text-neutral-800 mb-4 block">
                    Which of these are common triggers for you? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Being interrupted while speaking',
                      'Having my decisions questioned',
                      'Unexpected changes to plans',
                      'Passive-aggressive behavior',
                      'Being ignored or dismissed',
                      'Overly critical comments',
                      'Boundary pushing or testing',
                      'Guilt trips or manipulation',
                      'Being talked over in groups',
                      'Unsolicited advice',
                      'Being rushed or pressured',
                      'Having my privacy invaded'
                    ].map((trigger) => (
                      <div key={trigger} className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <Checkbox 
                          id={trigger}
                          checked={formData.triggers.includes(trigger)}
                          onCheckedChange={() => toggleArrayItem('triggers', trigger)}
                        />
                        <Label htmlFor={trigger} className="flex-1 cursor-pointer text-sm">
                          {trigger}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Deal Breakers */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">Deal Breaker Behaviors</h2>
                  <p className="text-neutral-600">Select behaviors that are absolute red flags for you</p>
                </div>

                <div>
                  <Label className="text-lg font-semibold text-neutral-800 mb-4 block">
                    Which behaviors are deal breakers in relationships? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Dishonesty or lying',
                      'Emotional manipulation',
                      'Disrespecting boundaries repeatedly',
                      'Verbal abuse or insults',
                      'Controlling behavior',
                      'Infidelity or cheating',
                      'Substance abuse issues',
                      'Physical aggression',
                      'Financial dishonesty',
                      'Refusing to communicate',
                      'Extreme jealousy',
                      'Disrespecting family/friends'
                    ].map((behavior) => (
                      <div key={behavior} className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <Checkbox 
                          id={behavior}
                          checked={formData.dealBreakerBehaviors.includes(behavior)}
                          onCheckedChange={() => toggleArrayItem('dealBreakerBehaviors', behavior)}
                        />
                        <Label htmlFor={behavior} className="flex-1 cursor-pointer text-sm">
                          {behavior}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Non-Negotiable Boundaries */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 mb-2">Non-Negotiable Boundaries</h2>
                  <p className="text-neutral-600">Select the boundaries that are most important to you</p>
                </div>

                <div>
                  <Label className="text-lg font-semibold text-neutral-800 mb-4 block">
                    Which boundaries are non-negotiable for you? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Respect for my time and schedule',
                      'Privacy of personal information',
                      'Financial independence/transparency',
                      'Physical space and belongings',
                      'Communication during work hours',
                      'Respect for my family/friends',
                      'Personal values and beliefs',
                      'Health and wellness routines',
                      'Social media privacy',
                      'Decision-making autonomy',
                      'Emotional boundaries',
                      'Professional/career respect'
                    ].map((boundary) => (
                      <div key={boundary} className="flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <Checkbox 
                          id={boundary}
                          checked={formData.nonNegotiableBoundaries.includes(boundary)}
                          onCheckedChange={() => toggleArrayItem('nonNegotiableBoundaries', boundary)}
                        />
                        <Label htmlFor={boundary} className="flex-1 cursor-pointer text-sm">
                          {boundary}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-neutral-600">
            {currentStep} of {TOTAL_STEPS}
          </div>

          {currentStep < TOTAL_STEPS ? (
            <Button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={saveBaseline.isPending}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {saveBaseline.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Complete Assessment
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}