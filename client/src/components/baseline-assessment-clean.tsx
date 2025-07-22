import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface BaselineAssessmentProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export default function BaselineAssessmentClean({ onComplete, onCancel }: BaselineAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Simple form data that matches database schema exactly
  const [formData, setFormData] = useState({
    // Communication
    communicationStyle: '',
    communicationStyleRanking: [],
    conflictResolution: '',
    feedbackPreference: '',
    listeningNeeds: [],
    communicationDealBreakers: [],
    
    // Emotional
    emotionalSupport: '',
    emotionalValidationNeeds: '',
    validationStyle: [],
    affectionStyle: [],
    validationNeeds: '',
    emotionalProcessingTime: 0,
    triggers: [],
    comfortingSources: [],
    
    // Boundaries
    personalSpaceNeeds: '',
    aloneTimeFrequency: '',
    decisionMakingStyle: '',
    privacyLevels: [],
    nonNegotiableBoundaries: [],
    flexibleBoundaries: [],
    
    // Time
    responseTimeExpectation: 0,
    availabilityWindows: [],
    socialEnergyLevel: '',
    recoveryTimeNeeded: 0,
    
    // Growth
    personalGrowthPriorities: [],
    relationshipGoals: [],
    valueAlignment: [],
    dealBreakerBehaviors: [],
    
    // Notes
    notes: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: string, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeFromArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Saving baseline data:', formData);
      await onComplete(formData);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Communication Style</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>How do you prefer to communicate?</Label>
          <RadioGroup value={formData.communicationStyle} onValueChange={(value) => updateField('communicationStyle', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct">Direct and straightforward</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gentle" id="gentle" />
              <Label htmlFor="gentle">Gentle and considerate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="collaborative" id="collaborative" />
              <Label htmlFor="collaborative">Collaborative discussion</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="assertive" id="assertive" />
              <Label htmlFor="assertive">Assertive and clear</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>How do you handle conflict?</Label>
          <RadioGroup value={formData.conflictResolution} onValueChange={(value) => updateField('conflictResolution', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="address-immediately" id="address-immediately" />
              <Label htmlFor="address-immediately">Address it right away</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="need-time-to-process" id="need-time-to-process" />
              <Label htmlFor="need-time-to-process">Need time to process first</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="avoid-conflict" id="avoid-conflict" />
              <Label htmlFor="avoid-conflict">Prefer to avoid conflict</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="address-when-calm" id="address-when-calm" />
              <Label htmlFor="address-when-calm">Address when everyone is calm</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Emotional Needs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>How much emotional support do you need?</Label>
          <RadioGroup value={formData.emotionalSupport} onValueChange={(value) => updateField('emotionalSupport', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high">High - frequent check-ins and support</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium - regular but not constant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low">Low - occasional support is enough</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Processing time needed (hours)</Label>
          <Input
            type="number"
            value={formData.emotionalProcessingTime}
            onChange={(e) => updateField('emotionalProcessingTime', parseInt(e.target.value) || 0)}
            placeholder="How many hours do you need to process emotions?"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Boundaries</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Personal space needs</Label>
          <RadioGroup value={formData.personalSpaceNeeds} onValueChange={(value) => updateField('personalSpaceNeeds', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="space-high" />
              <Label htmlFor="space-high">High - need lots of alone time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="space-medium" />
              <Label htmlFor="space-medium">Medium - some alone time needed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="space-low" />
              <Label htmlFor="space-low">Low - comfortable with little alone time</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Response time expectation (hours)</Label>
          <Input
            type="number"
            value={formData.responseTimeExpectation}
            onChange={(e) => updateField('responseTimeExpectation', parseInt(e.target.value) || 0)}
            placeholder="How many hours before you expect a response?"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Baseline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Communication Style:</strong> {formData.communicationStyle}
        </div>
        <div>
          <strong>Conflict Resolution:</strong> {formData.conflictResolution}
        </div>
        <div>
          <strong>Emotional Support:</strong> {formData.emotionalSupport}
        </div>
        <div>
          <strong>Personal Space:</strong> {formData.personalSpaceNeeds}
        </div>
        <div>
          <Label>Additional notes (optional)</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Any additional context about your needs..."
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Personal Baseline Assessment</h2>
        <p className="text-gray-600">Step {currentStep} of 4</p>
      </div>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : () => setCurrentStep(currentStep - 1)}
          disabled={isSaving}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={isSaving}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Baseline'}
          </Button>
        )}
      </div>
    </div>
  );
}