import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import type { InsertInteractionTrackerEntry } from '@shared/schema';

interface InteractionTrackerProps {
  relationshipId: number;
  relationshipName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

interface InteractionTrackerData {
  relationshipId: number;
  timestamp: string;
  communicationMet: boolean;
  emotionalNeedsMet: string[];
  triggersOccurred: string[];
  dealBreakersCrossed: string[];
  repeatedTriggers: string[];
  overallCompatibility: number; // 1-10
  notes: string;
}

export default function InteractionTracker({
  relationshipId,
  relationshipName,
  isOpen,
  onClose,
  onSubmit
}: InteractionTrackerProps) {
  const [step, setStep] = useState(1);
  
  // Fetch user's baseline assessment
  const { data: baseline } = useQuery({
    queryKey: ['/api/baseline'],
    refetchOnWindowFocus: false,
  });

  // Fetch previous interactions to identify patterns
  const { data: previousInteractions } = useQuery({
    queryKey: ['/api/interaction-tracker', relationshipId],
    refetchOnWindowFocus: false,
  });

  const [data, setData] = useState<Partial<InteractionTrackerData>>({
    relationshipId,
    timestamp: new Date().toISOString(),
    communicationMet: false,
    emotionalNeedsMet: [],
    triggersOccurred: [],
    dealBreakersCrossed: [],
    repeatedTriggers: [],
    overallCompatibility: 5,
    notes: '',
  });

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev]?.includes?.(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[] || []), value]
    }));
  };

  const getTopCommunicationNeed = () => {
    if (!baseline?.communicationPreferences) return null;
    const prefs = baseline.communicationPreferences;
    const priorities = [
      { key: 'direct', label: 'Direct Feedback', value: prefs.direct || 0 },
      { key: 'gentle', label: 'Gentle Communication', value: prefs.gentle || 0 },
      { key: 'collaborative', label: 'Collaborative Discussion', value: prefs.collaborative || 0 },
      { key: 'assertive', label: 'Assertive Expression', value: prefs.assertive || 0 }
    ];
    return priorities.reduce((max, curr) => curr.value > max.value ? curr : max);
  };

  const getCommonTriggers = () => {
    if (!previousInteractions || !Array.isArray(previousInteractions)) return [];
    const recentTriggers = previousInteractions
      .flatMap((interaction: any) => interaction.triggersOccurred || [])
      .filter((trigger, index, arr) => arr.indexOf(trigger) !== index); // Find duplicates
    return [...new Set(recentTriggers)]; // Remove duplicates
  };

  const getEmotionalNeeds = () => {
    if (!baseline) return [];
    
    const needs = [];
    
    // Map baseline emotional support to needs
    if (baseline.emotionalSupport === 'high') {
      needs.push('Frequent check-ins', 'Emotional validation', 'Active listening');
    } else if (baseline.emotionalSupport === 'medium') {
      needs.push('Regular support', 'Understanding', 'Empathy');
    } else if (baseline.emotionalSupport === 'low') {
      needs.push('Respect for independence', 'Space when needed');
    }
    
    // Add validation needs
    if (baseline.validationNeeds === 'frequent') {
      needs.push('Regular affirmation', 'Positive feedback');
    } else if (baseline.validationNeeds === 'moderate') {
      needs.push('Occasional validation', 'Recognition');
    }
    
    return needs.filter(Boolean);
  };

  const getPersonalTriggers = () => {
    if (!baseline) return [];
    
    // Combine triggers from baseline with common relationship triggers
    const triggers = [...(baseline.triggers || [])];
    
    // Add triggers based on communication style
    if (baseline.communicationStyle === 'direct' && baseline.conflictResolution === 'discuss-immediately') {
      triggers.push('Avoiding important conversations', 'Being dismissive');
    }
    
    if (baseline.conflictResolution === 'need-time-to-process') {
      triggers.push('Pressuring for immediate responses', 'Not giving processing time');
    }
    
    if (baseline.conflictResolution === 'avoid-conflict') {
      triggers.push('Confrontational approach', 'Aggressive tone');
    }
    
    // Remove duplicates and return
    return [...new Set(triggers)].filter(Boolean);
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(data as InteractionTrackerData);
      setStep(1);
      setData({
        relationshipId,
        timestamp: new Date().toISOString(),
        communicationMet: false,
        emotionalNeedsMet: [],
        triggersOccurred: [],
        dealBreakersCrossed: [],
        repeatedTriggers: [],
        overallCompatibility: 5,
        notes: '',
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit interaction:', error);
    }
  };

  if (!isOpen) return null;

  const renderStep1 = () => {
    if (!baseline) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Complete your Personal Baseline Assessment first to get personalized questions.</p>
          <Button onClick={onClose}>Complete Baseline Assessment</Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Communication Check</h3>
          <p className="text-sm text-muted-foreground">
            Based on your personal baseline preferences
          </p>
        </div>

        {/* Direct Communication Style Question */}
        {baseline.communicationStyle && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="communication-met"
                checked={data.communicationMet}
                onCheckedChange={(checked) => updateData('communicationMet', checked)}
              />
              <Label htmlFor="communication-met" className="text-sm">
                You prefer <span className="font-semibold">{baseline.communicationStyle}</span> communication. 
                Did they communicate with you in this way today?
              </Label>
            </div>
          </div>
        )}

        {/* Conflict Resolution Question */}
        {baseline.conflictResolution && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Checkbox
                id="conflict-handled"
                checked={data.conflictHandledWell}
                onCheckedChange={(checked) => updateData('conflictHandledWell', checked)}
              />
              <Label htmlFor="conflict-handled" className="text-sm">
                You handle conflict by wanting to <span className="font-semibold">{baseline.conflictResolution.replace(/-/g, ' ')}</span>. 
                Were any disagreements handled in this way?
              </Label>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label className="text-sm font-medium">How well did they honor your communication preferences today? (1-10):</Label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Button
                key={num}
                type="button"
                variant={data.overallCompatibility === num ? "default" : "outline"}
                size="sm"
                onClick={() => updateData('overallCompatibility', num)}
                className="w-10 h-10"
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Needs & Triggers Assessment</h3>
          <p className="text-sm text-muted-foreground">
            Check what occurred during this interaction
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">
              <CheckCircle className="inline-block w-4 h-4 mr-2 text-green-600" />
              Emotional needs that were met:
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {getEmotionalNeeds().map((need) => (
                <div key={need} className="flex items-center space-x-2">
                  <Checkbox
                    id={`need-${need}`}
                    checked={data.emotionalNeedsMet?.includes(need)}
                    onCheckedChange={() => toggleArrayField('emotionalNeedsMet', need)}
                  />
                  <Label htmlFor={`need-${need}`} className="text-sm">
                    {need}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">
              <AlertTriangle className="inline-block w-4 h-4 mr-2 text-amber-600" />
              Personal triggers that occurred:
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {getPersonalTriggers().map((trigger, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`trigger-${index}`}
                    checked={data.triggersOccurred?.includes(trigger)}
                    onCheckedChange={() => toggleArrayField('triggersOccurred', trigger)}
                  />
                  <Label htmlFor={`trigger-${index}`} className="text-sm">
                    {trigger}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const commonTriggers = getCommonTriggers();
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Pattern Recognition</h3>
          <p className="text-sm text-muted-foreground">
            Based on your interaction history with {relationshipName}
          </p>
        </div>

        {commonTriggers.length > 0 && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              You've previously reported these triggers with {relationshipName}. Did any occur again?
            </Label>
            {commonTriggers.map((trigger, index) => (
              <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`pattern-${index}`}
                    checked={data.triggersOccurred?.includes(trigger)}
                    onCheckedChange={() => toggleArrayField('triggersOccurred', trigger)}
                  />
                  <Label htmlFor={`pattern-${index}`} className="text-sm">
                    {trigger}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Additional notes about this interaction:
          </Label>
          <Textarea
            id="notes"
            value={data.notes}
            onChange={(e) => updateData('notes', e.target.value)}
            placeholder="Any specific details about how this interaction went..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Interaction Tracker - {relationshipName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full ${
                  step >= stepNum ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? onClose : () => setStep(step - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
              >
                Complete Assessment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}