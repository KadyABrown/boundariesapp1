import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Save, CheckCircle } from 'lucide-react';

interface BaselineData {
  communicationStyle: string;
  conflictResolution: string;
  emotionalSupport: string;
  personalSpaceNeeds: string;
  emotionalProcessingTime: number;
  responseTimeExpectation: number;
  triggers: string[];
  nonNegotiableBoundaries: string[];
  notes: string;
}

export default function BaselinePageClean() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');
  const [newBoundary, setNewBoundary] = useState('');

  const [formData, setFormData] = useState<BaselineData>({
    communicationStyle: '',
    conflictResolution: '',
    emotionalSupport: '',
    personalSpaceNeeds: '',
    emotionalProcessingTime: 0,
    responseTimeExpectation: 0,
    triggers: [],
    nonNegotiableBoundaries: [],
    notes: ''
  });

  // Check if user has existing baseline
  const { data: existingBaseline, isLoading } = useQuery({
    queryKey: ['/api/baseline/latest'],
    queryFn: async () => {
      const response = await fetch('/api/baseline/latest');
      if (!response.ok) return null;
      return response.json();
    }
  });

  // Save baseline mutation
  const saveBaseline = useMutation({
    mutationFn: async (data: BaselineData) => {
      const response = await fetch('/api/baseline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save baseline');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Baseline Saved!",
        description: "Your personal baseline has been successfully saved."
      });
      setCurrentStep(5); // Show success step
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: 'triggers' | 'nonNegotiableBoundaries', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeFromArray = (field: 'triggers' | 'nonNegotiableBoundaries', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveBaseline.mutateAsync(formData);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Loading...</div>
      </div>
    );
  }

  if (existingBaseline && currentStep !== 5) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Baseline Assessment Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                You've already completed your personal baseline assessment. This assessment helps the app analyze your relationships and boundaries.
              </p>
              
              <div className="bg-neutral-50 p-4 rounded-lg space-y-2">
                <p><strong>Communication Style:</strong> {existingBaseline.communicationStyle}</p>
                <p><strong>Conflict Resolution:</strong> {existingBaseline.conflictResolution}</p>
                <p><strong>Emotional Support:</strong> {existingBaseline.emotionalSupport}</p>
                <p><strong>Personal Space:</strong> {existingBaseline.personalSpaceNeeds}</p>
              </div>

              <Button onClick={() => setCurrentStep(1)} variant="outline">
                Update Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Communication Preferences</CardTitle>
        <p className="text-gray-600">How do you prefer to communicate and handle conflict?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">I prefer to communicate:</Label>
          <RadioGroup value={formData.communicationStyle} onValueChange={(value) => updateField('communicationStyle', value)} className="mt-2">
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
          <Label className="text-base font-medium">When there's conflict, I prefer to:</Label>
          <RadioGroup value={formData.conflictResolution} onValueChange={(value) => updateField('conflictResolution', value)} className="mt-2">
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
        <p className="text-gray-600">What do you need to feel emotionally supported?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">I need this level of emotional support:</Label>
          <RadioGroup value={formData.emotionalSupport} onValueChange={(value) => updateField('emotionalSupport', value)} className="mt-2">
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
          <Label htmlFor="processing-time" className="text-base font-medium">
            Hours I need to process emotions
          </Label>
          <Input
            id="processing-time"
            type="number"
            value={formData.emotionalProcessingTime}
            onChange={(e) => updateField('emotionalProcessingTime', parseInt(e.target.value) || 0)}
            placeholder="How many hours do you need?"
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Boundaries & Personal Space</CardTitle>
        <p className="text-gray-600">Help us understand your space and response time needs.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">My personal space needs are:</Label>
          <RadioGroup value={formData.personalSpaceNeeds} onValueChange={(value) => updateField('personalSpaceNeeds', value)} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="space-high" />
              <Label htmlFor="space-high">High - I need lots of alone time</Label>
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
          <Label htmlFor="response-time" className="text-base font-medium">
            Hours before I expect a response
          </Label>
          <Input
            id="response-time"
            type="number"
            value={formData.responseTimeExpectation}
            onChange={(e) => updateField('responseTimeExpectation', parseInt(e.target.value) || 0)}
            placeholder="How many hours is reasonable?"
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Triggers & Boundaries</CardTitle>
        <p className="text-gray-600">What are your personal triggers and non-negotiable boundaries?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Personal Triggers</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              placeholder="Add a trigger..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addToArray('triggers', newTrigger);
                  setNewTrigger('');
                }
              }}
            />
            <Button 
              onClick={() => {
                addToArray('triggers', newTrigger);
                setNewTrigger('');
              }}
              variant="outline"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.triggers.map((trigger, index) => (
              <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {trigger}
                <button onClick={() => removeFromArray('triggers', index)} className="hover:text-destructive">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Non-Negotiable Boundaries</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newBoundary}
              onChange={(e) => setNewBoundary(e.target.value)}
              placeholder="Add a boundary..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addToArray('nonNegotiableBoundaries', newBoundary);
                  setNewBoundary('');
                }
              }}
            />
            <Button 
              onClick={() => {
                addToArray('nonNegotiableBoundaries', newBoundary);
                setNewBoundary('');
              }}
              variant="outline"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.nonNegotiableBoundaries.map((boundary, index) => (
              <span key={index} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {boundary}
                <button onClick={() => removeFromArray('nonNegotiableBoundaries', index)} className="hover:text-destructive">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="text-base font-medium">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Any additional context about your needs..."
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderSuccess = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-6 w-6" />
          Baseline Assessment Complete!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">
            Your personal baseline has been saved successfully. This will now be used to analyze your relationships and track boundary respect.
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">What happens next:</h4>
            <ul className="text-green-700 space-y-1 text-sm">
              <li>• Boundary goals have been automatically created from your assessment</li>
              <li>• Start tracking relationships and interactions</li>
              <li>• The app will calculate compatibility scores based on your baseline</li>
              <li>• View boundary violation rates in the Boundaries tab</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => window.location.href = '/relationships'}>
              Start Tracking Relationships
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/boundaries'}>
              View Boundary Goals
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.communicationStyle && formData.conflictResolution;
      case 2:
        return formData.emotionalSupport;
      case 3:
        return formData.personalSpaceNeeds;
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Personal Baseline Assessment</h1>
        <p className="text-gray-600">
          This assessment creates your personal foundation for relationship analysis. Step {currentStep} of 4.
        </p>
      </div>

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {currentStep === 5 && renderSuccess()}

      {currentStep < 5 && (
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : window.history.back()}
            disabled={isSaving}
          >
            {currentStep === 1 ? 'Back' : 'Previous'}
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed() || isSaving}
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
      )}
    </div>
  );
}