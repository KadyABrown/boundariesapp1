import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Heart, 
  MessageCircle, 
  Shield, 
  Clock, 
  Users, 
  Target,
  Brain,
  CheckCircle,
  X
} from "lucide-react";

interface BaselineAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseline?: any;
  onSave: (baseline: any) => void;
}

const communicationOptions = [
  { value: 'direct', label: 'Direct - I say what I mean clearly' },
  { value: 'gentle', label: 'Gentle - I prefer softer approaches' },
  { value: 'collaborative', label: 'Collaborative - We figure it out together' },
  { value: 'assertive', label: 'Assertive - I stand up for my needs' }
];

const conflictOptions = [
  { value: 'discuss-immediately', label: 'Address right away when issues come up' },
  { value: 'need-time-to-process', label: 'Give me time to think before discussing' },
  { value: 'avoid-conflict', label: 'Prefer to avoid confrontation when possible' },
  { value: 'address-when-calm', label: 'Wait until we\'re both calm to discuss' }
];

const emotionalSupportOptions = [
  { value: 'high', label: 'High - I need lots of emotional check-ins' },
  { value: 'medium', label: 'Medium - Regular support but not constantly' },
  { value: 'low', label: 'Low - I mostly handle things independently' }
];

const validationOptions = [
  { value: 'frequent', label: 'Frequent - I like regular affirmation' },
  { value: 'moderate', label: 'Moderate - Some validation is nice' },
  { value: 'minimal', label: 'Minimal - I don\'t need much external validation' }
];

export default function BaselineAssessmentModal({
  isOpen,
  onClose,
  baseline,
  onSave
}: BaselineAssessmentModalProps) {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState({
    // Communication preferences
    communicationStyle: '',
    conflictResolution: '',
    
    // Emotional needs
    emotionalSupport: '',
    validationNeeds: '',
    triggers: [] as string[],
    
    // Boundary requirements
    personalSpaceNeeds: '',
    nonNegotiableBoundaries: [] as string[],
    
    // Values
    dealBreakerBehaviors: [] as string[]
  });

  useEffect(() => {
    if (baseline && isOpen) {
      setData(baseline);
      setShowResults(true);
    } else {
      setShowResults(false);
      setStep(1);
    }
  }, [baseline, isOpen]);

  const updateData = (key: string, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayToggle = (key: string, value: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key as keyof typeof prev].includes(value)
        ? (prev[key as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[key as keyof typeof prev] as string[]), value]
    }));
  };

  const handleSubmit = () => {
    onSave(data);
    setShowResults(true);
  };

  const renderQuizStep = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Communication Preferences</h3>
            <p className="text-gray-600">How do you prefer to communicate in relationships?</p>
          </div>

          <div>
            <Label className="text-base font-medium">Your communication style:</Label>
            <RadioGroup 
              value={data.communicationStyle} 
              onValueChange={(value) => updateData('communicationStyle', value)}
              className="mt-3 space-y-3"
            >
              {communicationOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">How you handle conflict:</Label>
            <RadioGroup 
              value={data.conflictResolution} 
              onValueChange={(value) => updateData('conflictResolution', value)}
              className="mt-3 space-y-3"
            >
              {conflictOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Emotional Needs</h3>
            <p className="text-gray-600">What do you need emotionally in relationships?</p>
          </div>

          <div>
            <Label className="text-base font-medium">Emotional support level:</Label>
            <RadioGroup 
              value={data.emotionalSupport} 
              onValueChange={(value) => updateData('emotionalSupport', value)}
              className="mt-3 space-y-3"
            >
              {emotionalSupportOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">Validation needs:</Label>
            <RadioGroup 
              value={data.validationNeeds} 
              onValueChange={(value) => updateData('validationNeeds', value)}
              className="mt-3 space-y-3"
            >
              {validationOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Boundaries & Deal-Breakers</h3>
          <p className="text-gray-600">What are your non-negotiable boundaries?</p>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            Personal triggers to watch for:
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Being interrupted',
              'Cancelled plans',
              'Not listening',
              'Dismissing feelings',
              'Being late',
              'Broken promises'
            ].map(trigger => (
              <div key={trigger} className="flex items-center space-x-2">
                <Checkbox
                  id={trigger}
                  checked={data.triggers.includes(trigger)}
                  onCheckedChange={() => handleArrayToggle('triggers', trigger)}
                />
                <Label htmlFor={trigger} className="text-sm cursor-pointer">
                  {trigger}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            Absolute deal-breakers:
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {[
              'Lying or dishonesty',
              'Disrespecting boundaries',
              'Emotional manipulation',
              'Consistent unreliability'
            ].map(dealbreaker => (
              <div key={dealbreaker} className="flex items-center space-x-2">
                <Checkbox
                  id={dealbreaker}
                  checked={data.dealBreakerBehaviors.includes(dealbreaker)}
                  onCheckedChange={() => handleArrayToggle('dealBreakerBehaviors', dealbreaker)}
                />
                <Label htmlFor={dealbreaker} className="text-sm cursor-pointer">
                  {dealbreaker}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Your Personal Baseline</h3>
        <p className="text-gray-600">Here's your relationship compatibility profile</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              Communication Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Style:</strong> {data.communicationStyle?.replace('-', ' ')}</p>
            <p><strong>Conflict Resolution:</strong> {data.conflictResolution?.replace('-', ' ')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-red-500" />
              Emotional Needs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Support Level:</strong> {data.emotionalSupport}</p>
            <p><strong>Validation Needs:</strong> {data.validationNeeds}</p>
            {data.triggers.length > 0 && (
              <div>
                <strong>Personal Triggers:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.triggers.map(trigger => (
                    <Badge key={trigger} variant="outline" className="text-xs">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {data.dealBreakerBehaviors.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-orange-500" />
                Deal-Breakers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {data.dealBreakerBehaviors.map(behavior => (
                  <Badge key={behavior} variant="destructive" className="text-xs">
                    {behavior}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Now you're ready!</strong> Your interaction tracker will ask personalized questions based on these preferences to help you identify relationship patterns.
        </p>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Personal Baseline Assessment</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {showResults ? renderResults() : (
            <div>
              {/* Progress bar */}
              <div className="mb-6">
                <Progress value={(step / 3) * 100} className="h-2" />
                <p className="text-center text-sm text-gray-500 mt-2">
                  Step {step} of 3
                </p>
              </div>

              {renderQuizStep()}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                
                {step === 3 ? (
                  <Button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Complete Assessment
                  </Button>
                ) : (
                  <Button
                    onClick={() => setStep(Math.min(3, step + 1))}
                    disabled={
                      (step === 1 && (!data.communicationStyle || !data.conflictResolution)) ||
                      (step === 2 && (!data.emotionalSupport || !data.validationNeeds))
                    }
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}

          {showResults && (
            <div className="flex justify-center mt-6">
              <Button onClick={() => setShowResults(false)}>
                Edit Assessment
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}