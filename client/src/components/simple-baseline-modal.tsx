import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Heart, MessageCircle, Shield } from "lucide-react";
import {
  ENERGY_GIVERS,
  ENERGY_DRAINERS,
  EMOTIONAL_TRIGGERS,
  DEAL_BREAKER_BEHAVIORS,
  AFFECTION_STYLES,
  COMMUNICATION_STYLES,
  CONFLICT_RESOLUTION_STYLES,
  EMOTIONAL_SUPPORT_LEVELS,
  VALIDATION_FREQUENCIES,
  PERSONAL_SPACE_NEEDS,
  PRIVACY_PREFERENCES,
  DECISION_MAKING_STYLES
} from "@/data/quiz-options";

interface SimpleBaselineModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseline?: any;
  onSave: (baseline: any) => void;
}

export default function SimpleBaselineModal({
  isOpen,
  onClose,
  baseline,
  onSave
}: SimpleBaselineModalProps) {
  const [data, setData] = useState({
    communicationStyle: '',
    conflictResolution: '',
    energyGivers: [] as string[],
    energyDrainers: [] as string[],
    emotionalTriggers: [] as string[],
    dealBreakerBehaviors: [] as string[],
    personalSpaceNeeds: '',
    privacyPreferences: '',
    decisionMakingStyle: '',
    emotionalSupportLevel: '',
    affectionStyles: [] as string[],
    validationFrequency: ''
  });

  useEffect(() => {
    if (baseline && isOpen) {
      setData({
        communicationStyle: baseline.communicationStyle || '',
        conflictResolution: baseline.conflictResolution || '',
        energyGivers: Array.isArray(baseline.energyGivers) ? baseline.energyGivers : [],
        energyDrainers: Array.isArray(baseline.energyDrainers) ? baseline.energyDrainers : [],
        emotionalTriggers: Array.isArray(baseline.emotionalTriggers) ? baseline.emotionalTriggers : [],
        dealBreakerBehaviors: Array.isArray(baseline.dealBreakerBehaviors) ? baseline.dealBreakerBehaviors : [],
        personalSpaceNeeds: baseline.personalSpaceNeeds || '',
        privacyPreferences: baseline.privacyPreferences || '',
        decisionMakingStyle: baseline.decisionMakingStyle || '',
        emotionalSupportLevel: baseline.emotionalSupportLevel || '',
        affectionStyles: Array.isArray(baseline.affectionStyles) ? baseline.affectionStyles : [],
        validationFrequency: baseline.validationFrequency || ''
      });
    }
  }, [baseline, isOpen]);

  const handleArrayToggle = (key: string, value: string) => {
    setData(prev => {
      const currentArray = prev[key as keyof typeof prev] as string[];
      const isSelected = currentArray.includes(value);
      return {
        ...prev,
        [key]: isSelected
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Personal Baseline Assessment</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8 p-6">
          {/* Communication Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Communication Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Communication Style:</Label>
                <RadioGroup 
                  value={data.communicationStyle} 
                  onValueChange={(value) => setData(prev => ({ ...prev, communicationStyle: value }))}
                  className="mt-2"
                >
                  {COMMUNICATION_STYLES.map(option => (
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
                <Label className="text-base font-medium">Conflict Resolution:</Label>
                <RadioGroup 
                  value={data.conflictResolution} 
                  onValueChange={(value) => setData(prev => ({ ...prev, conflictResolution: value }))}
                  className="mt-2"
                >
                  {CONFLICT_RESOLUTION_STYLES.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Energy Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-500" />
                Energy Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">What gives you energy? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {ENERGY_GIVERS.map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={item}
                        checked={data.energyGivers.includes(item)}
                        onCheckedChange={() => handleArrayToggle('energyGivers', item)}
                      />
                      <Label htmlFor={item} className="text-sm cursor-pointer capitalize">
                        {item.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">What drains your energy? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {ENERGY_DRAINERS.map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`drainer-${item}`}
                        checked={data.energyDrainers.includes(item)}
                        onCheckedChange={() => handleArrayToggle('energyDrainers', item)}
                      />
                      <Label htmlFor={`drainer-${item}`} className="text-sm cursor-pointer capitalize">
                        {item.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Triggers & Deal-breakers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Triggers & Deal-breakers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Emotional triggers (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {EMOTIONAL_TRIGGERS.map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`trigger-${item}`}
                        checked={data.emotionalTriggers.includes(item)}
                        onCheckedChange={() => handleArrayToggle('emotionalTriggers', item)}
                      />
                      <Label htmlFor={`trigger-${item}`} className="text-sm cursor-pointer capitalize">
                        {item.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Deal-breaker behaviors (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {DEAL_BREAKER_BEHAVIORS.map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dealbreaker-${item}`}
                        checked={data.dealBreakerBehaviors.includes(item)}
                        onCheckedChange={() => handleArrayToggle('dealBreakerBehaviors', item)}
                      />
                      <Label htmlFor={`dealbreaker-${item}`} className="text-sm cursor-pointer capitalize">
                        {item.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
              Save Assessment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}