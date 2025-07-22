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
  
  // Enhanced tracking for better predictive analysis
  interactionType: string; // casual, planned, conflict, intimate, work-related
  duration: number; // minutes
  location: string; // home, public, their-place, phone, text
  
  // Baseline compatibility tracking
  communicationMet: boolean;
  emotionalNeedsMet: string[];
  triggersOccurred: string[];
  dealBreakersCrossed: string[];
  repeatedTriggers: string[];
  
  // Energy and mood tracking
  energyBefore: number; // 1-10
  energyAfter: number; // 1-10
  moodBefore: string; // positive, neutral, negative, anxious
  moodAfter: string;
  
  // Conflict and boundary tracking
  boundariesRespected: boolean;
  conflictOccurred: boolean;
  conflictResolved: boolean;
  
  // Predictive indicators
  redFlagsNoticed: string[];
  positiveSignsNoticed: string[];
  futureComfortLevel: number; // 1-10 how comfortable you'd be with similar interactions
  
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
    interactionType: 'casual',
    duration: 30,
    location: 'home',
    communicationMet: false,
    emotionalNeedsMet: [],
    triggersOccurred: [],
    dealBreakersCrossed: [],
    repeatedTriggers: [],
    energyBefore: 5,
    energyAfter: 5,
    moodBefore: 'neutral',
    moodAfter: 'neutral',
    boundariesRespected: true,
    conflictOccurred: false,
    conflictResolved: true,
    redFlagsNoticed: [],
    positiveSignsNoticed: [],
    futureComfortLevel: 5,
    overallCompatibility: 5,
    notes: '',
  });

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: string, value: string) => {
    setData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[] || [];
      const isSelected = currentArray.includes(value);
      return {
        ...prev,
        [field]: isSelected
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const getTopCommunicationNeed = () => {
    if (!baseline?.communicationStyle) return null;
    const style = baseline.communicationStyle;
    const needs = {
      'direct': 'Clear, straightforward communication',
      'gentle': 'Gentle, considerate approach',
      'collaborative': 'Working together on solutions',
      'assertive': 'Confident, respectful expression'
    };
    return { key: style, label: needs[style as keyof typeof needs] || style };
  };

  const getCommonTriggers = () => {
    if (!previousInteractions || !Array.isArray(previousInteractions)) return [];
    const triggerCounts = previousInteractions
      .flatMap((interaction: any) => interaction.triggersOccurred || [])
      .reduce((acc: Record<string, number>, trigger: string) => {
        acc[trigger] = (acc[trigger] || 0) + 1;
        return acc;
      }, {});
    
    // Return triggers that occurred more than once
    return Object.entries(triggerCounts)
      .filter(([_, count]) => count > 1)
      .map(([trigger, _]) => trigger);
  };

  const getEmotionalNeeds = () => {
    if (!baseline) return [];
    
    const needs = [];
    
    // Map baseline emotional support to needs using new schema
    if (baseline.emotionalSupportLevel === 'high') {
      needs.push('Frequent check-ins', 'Emotional validation', 'Active listening');
    } else if (baseline.emotionalSupportLevel === 'moderate') {
      needs.push('Regular support', 'Understanding', 'Empathy');
    } else if (baseline.emotionalSupportLevel === 'low') {
      needs.push('Respect for independence', 'Space when needed');
    } else if (baseline.emotionalSupportLevel === 'variable') {
      needs.push('Flexible support', 'Reading emotional cues', 'Asking about needs');
    }
    
    // Add validation needs using new schema
    if (baseline.validationFrequency === 'daily') {
      needs.push('Daily affirmation', 'Regular positive feedback');
    } else if (baseline.validationFrequency === 'weekly') {
      needs.push('Weekly validation', 'Recognition of efforts');
    } else if (baseline.validationFrequency === 'monthly') {
      needs.push('Occasional validation', 'Recognition of achievements');
    }
    
    // Add energy givers from baseline
    if (baseline.energyGivers) {
      needs.push(...baseline.energyGivers.map((giver: string) => giver.replace('-', ' ')));
    }
    
    return needs.filter(Boolean);
  };

  const getPersonalTriggers = () => {
    if (!baseline) return [];
    
    // Use new baseline schema - emotionalTriggers
    const triggers = [...(baseline.emotionalTriggers || [])];
    
    // Add triggers based on communication style and conflict resolution
    if (baseline.communicationStyle === 'direct' && baseline.conflictResolution === 'immediate-discussion') {
      triggers.push('avoiding-important-conversations', 'being-dismissive');
    }
    
    if (baseline.conflictResolution === 'cool-down-first') {
      triggers.push('pressuring-for-immediate-responses', 'not-giving-processing-time');
    }
    
    if (baseline.conflictResolution === 'written-communication') {
      triggers.push('confrontational-verbal-approach', 'overwhelming-in-person-discussion');
    }
    
    // Add energy drainers as potential triggers
    if (baseline.energyDrainers) {
      triggers.push(...baseline.energyDrainers);
    }
    
    // Remove duplicates and return formatted for display
    return Array.from(new Set(triggers))
      .filter(Boolean)
      .map(trigger => trigger.replace('-', ' '));
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