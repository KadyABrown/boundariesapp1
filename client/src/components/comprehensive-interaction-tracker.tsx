import { useState, useEffect } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Activity,
  Thermometer,
  Eye,
  ChevronRight,
  ChevronLeft,
  Save,
  RotateCcw
} from "lucide-react";

interface ComprehensiveInteractionData {
  // Basic info
  relationshipId: number;
  timestamp: string;
  
  // Pre-interaction state
  energyBefore: number; // 1-10
  moodBefore: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
  anxietyBefore: number; // 1-10
  selfWorthBefore: number; // 1-10
  physicalStateBefore: string[];
  emotionalWarningSignsPresent: string[];
  
  // Interaction details
  interactionType: string;
  duration: number; // minutes
  location: string;
  witnesses: boolean;
  topicsDiscussed: string[];
  boundariesTested: boolean;
  
  // Immediate post-interaction
  energyAfter: number; // 1-10
  moodAfter: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
  anxietyAfter: number; // 1-10
  selfWorthAfter: number; // 1-10
  physicalSymptomsAfter: string[];
  emotionalStateAfter: string[];
  
  // Recovery tracking
  recoveryTime: number; // minutes to feel normal
  recoveryStrategies: string[];
  whatHelped: string[];
  whatMadeItWorse: string[];
  
  // Resilience building
  boundariesMaintained: string[];
  copingSkillsUsed: string[];
  supportSystemEngaged: boolean;
  selfAdvocacyActions: string[];
  
  // Reflection
  lessonsLearned: string;
  warningSignsNoticed: string[];
  futurePreparation: string[];
  
  // Baseline Values Validation (NEW)
  communicationStyleRespected: boolean;
  emotionalNeedsMet: boolean;
  boundariesRespected: boolean;
  triggersAvoided: boolean;
  coreValuesAligned: boolean;
  dealBreakersPresent: boolean;
  baselineCompatibilityScore: number; // 1-10
}

interface ComprehensiveInteractionTrackerProps {
  relationshipId: number;
  relationshipName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ComprehensiveInteractionData) => Promise<void>;
}

const physicalSymptoms = [
  'Headache', 'Muscle tension', 'Fatigue', 'Nausea', 'Racing heart',
  'Shallow breathing', 'Sweating', 'Trembling', 'Dizziness', 'Chest tightness',
  'Stomach upset', 'Back pain', 'Jaw clenching', 'Sleep disruption', 'Appetite changes'
];

const emotionalStates = [
  'Angry', 'Frustrated', 'Sad', 'Anxious', 'Overwhelmed', 'Confused',
  'Disappointed', 'Hurt', 'Guilty', 'Ashamed', 'Numb', 'Hopeless',
  'Validated', 'Proud', 'Relieved', 'Calm', 'Grateful', 'Empowered'
];

const emotionalWarningSigns = [
  'Feeling on edge', 'Dreading the interaction', 'Physical tension',
  'Difficulty concentrating', 'Ruminating thoughts', 'Sleep issues',
  'Appetite changes', 'Irritability', 'Emotional numbness', 'Hypervigilance'
];

const recoveryStrategies = [
  'Deep breathing', 'Physical exercise', 'Calling a friend', 'Journaling',
  'Meditation', 'Taking a bath', 'Listening to music', 'Being in nature',
  'Creative activities', 'Professional therapy', 'Self-care routine', 'Alone time'
];

const copingSkills = [
  'Set clear boundaries', 'Used assertive communication', 'Took breaks',
  'Redirected conversation', 'Stayed calm', 'Asked for clarification',
  'Removed myself from situation', 'Used grounding techniques', 'Practiced self-compassion'
];

const interactionTypes = [
  'Casual conversation', 'Planned meeting', 'Conflict discussion', 'Social gathering',
  'Work interaction', 'Family event', 'Phone call', 'Text exchange', 'Unexpected encounter'
];

export default function ComprehensiveInteractionTracker({
  relationshipId,
  relationshipName,
  isOpen,
  onClose,
  onSubmit
}: ComprehensiveInteractionTrackerProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<ComprehensiveInteractionData>>({
    relationshipId,
    timestamp: new Date().toISOString(),
    energyBefore: 5,
    anxietyBefore: 5,
    selfWorthBefore: 5,
    energyAfter: 5,
    anxietyAfter: 5,
    selfWorthAfter: 5,
    duration: 30,
    recoveryTime: 60,
    witnesses: false,
    boundariesTested: false,
    supportSystemEngaged: false,
    physicalStateBefore: [],
    emotionalWarningSignsPresent: [],
    physicalSymptomsAfter: [],
    emotionalStateAfter: [],
    topicsDiscussed: [],
    recoveryStrategies: [],
    whatHelped: [],
    whatMadeItWorse: [],
    boundariesMaintained: [],
    copingSkillsUsed: [],
    selfAdvocacyActions: [],
    warningSignsNoticed: [],
    futurePreparation: []
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

  const getEnergyImpact = () => {
    const before = data.energyBefore || 5;
    const after = data.energyAfter || 5;
    const diff = after - before;
    if (diff > 2) return { label: 'Energy Boost', color: 'text-green-600', icon: TrendingUp };
    if (diff < -2) return { label: 'Energy Drain', color: 'text-red-600', icon: TrendingDown };
    return { label: 'Neutral Impact', color: 'text-gray-600', icon: Activity };
  };

  const getAnxietyChange = () => {
    const before = data.anxietyBefore || 5;
    const after = data.anxietyAfter || 5;
    return after - before;
  };

  const getSelfWorthChange = () => {
    const before = data.selfWorthBefore || 5;
    const after = data.selfWorthAfter || 5;
    return after - before;
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(data as ComprehensiveInteractionData);
      setStep(1);
      setData({
      relationshipId,
      timestamp: new Date().toISOString(),
      energyBefore: 5,
      anxietyBefore: 5,
      selfWorthBefore: 5,
      energyAfter: 5,
      anxietyAfter: 5,
      selfWorthAfter: 5,
      duration: 30,
      recoveryTime: 60,
      witnesses: false,
      boundariesTested: false,
      supportSystemEngaged: false,
      physicalStateBefore: [],
      emotionalWarningSignsPresent: [],
      physicalSymptomsAfter: [],
      emotionalStateAfter: [],
      topicsDiscussed: [],
      recoveryStrategies: [],
      whatHelped: [],
      whatMadeItWorse: [],
      boundariesMaintained: [],
      copingSkillsUsed: [],
      selfAdvocacyActions: [],
      warningSignsNoticed: [],
      futurePreparation: []
    });
      onClose();
    } catch (error) {
      console.error("Failed to submit interaction:", error);
      // Don't close on error, let user try again
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Before the interaction with {relationshipName}
              </h3>
              <p className="text-sm text-gray-600">How were you feeling beforehand?</p>
            </div>

            {/* Energy Level Before */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Battery className="w-5 h-5 text-blue-600" />
                Energy Level Before
              </Label>
              <Slider
                value={[data.energyBefore || 5]}
                onValueChange={([value]) => updateData('energyBefore', value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 - Completely Drained</span>
                <span className="font-medium">{data.energyBefore}/10</span>
                <span>10 - Highly Energized</span>
              </div>
            </div>

            {/* Anxiety Level Before */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Anxiety Level Before
              </Label>
              <Slider
                value={[data.anxietyBefore || 5]}
                onValueChange={([value]) => updateData('anxietyBefore', value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 - Very Calm</span>
                <span className="font-medium">{data.anxietyBefore}/10</span>
                <span>10 - Extremely Anxious</span>
              </div>
            </div>

            {/* Self-Worth Before */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Self-Worth Level Before
              </Label>
              <Slider
                value={[data.selfWorthBefore || 5]}
                onValueChange={([value]) => updateData('selfWorthBefore', value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 - Very Low</span>
                <span className="font-medium">{data.selfWorthBefore}/10</span>
                <span>10 - Very High</span>
              </div>
            </div>

            {/* Mood Before */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Overall Mood Before</Label>
              <RadioGroup 
                value={data.moodBefore} 
                onValueChange={(value) => updateData('moodBefore', value)}
              >
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: 'very-negative', emoji: '😞', label: 'Very Upset' },
                    { value: 'negative', emoji: '😕', label: 'Upset' },
                    { value: 'neutral', emoji: '😐', label: 'Neutral' },
                    { value: 'positive', emoji: '😊', label: 'Good' },
                    { value: 'very-positive', emoji: '😄', label: 'Great' }
                  ].map(mood => (
                    <div key={mood.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={mood.value} id={mood.value} />
                      <Label htmlFor={mood.value} className="text-center cursor-pointer">
                        <div className="text-2xl">{mood.emoji}</div>
                        <div className="text-xs">{mood.label}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Emotional Warning Signs */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                Warning Signs Present (Select any that apply)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {emotionalWarningSigns.map(sign => (
                  <div key={sign} className="flex items-center space-x-2">
                    <Checkbox
                      id={sign}
                      checked={(data.emotionalWarningSignsPresent || []).includes(sign)}
                      onCheckedChange={() => toggleArrayField('emotionalWarningSignsPresent', sign)}
                    />
                    <Label htmlFor={sign} className="text-sm">{sign}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                About the interaction
              </h3>
              <p className="text-sm text-gray-600">Tell us what happened</p>
            </div>

            {/* Interaction Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Type of Interaction</Label>
              <Select value={data.interactionType} onValueChange={(value) => updateData('interactionType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interaction type" />
                </SelectTrigger>
                <SelectContent>
                  {interactionTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Duration (minutes)
              </Label>
              <Input
                type="number"
                value={data.duration || ''}
                onChange={(e) => updateData('duration', parseInt(e.target.value) || 0)}
                placeholder="30"
              />
            </div>

            {/* Location */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Location/Setting</Label>
              <Input
                value={data.location || ''}
                onChange={(e) => updateData('location', e.target.value)}
                placeholder="Home, work, restaurant, etc."
              />
            </div>

            {/* Others Present */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="witnesses"
                checked={data.witnesses}
                onCheckedChange={(checked) => updateData('witnesses', checked)}
              />
              <Label htmlFor="witnesses">Others were present during this interaction</Label>
            </div>

            {/* Boundaries Tested */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="boundaries"
                checked={data.boundariesTested}
                onCheckedChange={(checked) => updateData('boundariesTested', checked)}
              />
              <Label htmlFor="boundaries">They tested or violated my boundaries</Label>
            </div>

            {/* Topics Discussed */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Main topics discussed</Label>
              <Textarea
                value={(data.topicsDiscussed || []).join(', ')}
                onChange={(e) => updateData('topicsDiscussed', e.target.value.split(', ').filter(Boolean))}
                placeholder="Work, family, relationship issues, etc."
                className="min-h-[80px]"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Immediately after the interaction
              </h3>
              <p className="text-sm text-gray-600">How did you feel right afterward?</p>
            </div>

            {/* Energy After */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Battery className="w-5 h-5 text-blue-600" />
                Energy Level After
              </Label>
              <Slider
                value={[data.energyAfter || 5]}
                onValueChange={([value]) => updateData('energyAfter', value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 - Completely Drained</span>
                <span className="font-medium">{data.energyAfter}/10</span>
                <span>10 - Highly Energized</span>
              </div>
              
              {/* Energy Impact Display */}
              {data.energyBefore && data.energyAfter && (
                <div className="flex items-center justify-center gap-2 p-2 bg-gray-50 rounded">
                  {(() => {
                    const impact = getEnergyImpact();
                    return (
                      <>
                        <impact.icon className={`w-4 h-4 ${impact.color}`} />
                        <span className={`text-sm font-medium ${impact.color}`}>
                          {impact.label}: {data.energyBefore} → {data.energyAfter}
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Anxiety After */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Anxiety Level After
              </Label>
              <Slider
                value={[data.anxietyAfter || 5]}
                onValueChange={([value]) => updateData('anxietyAfter', value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 - Very Calm</span>
                <span className="font-medium">{data.anxietyAfter}/10</span>
                <span>10 - Extremely Anxious</span>
              </div>
              
              {/* Anxiety Change Display */}
              {data.anxietyBefore && data.anxietyAfter && (
                <div className="text-center p-2 bg-gray-50 rounded">
                  <span className={`text-sm font-medium ${
                    getAnxietyChange() > 0 ? 'text-red-600' : 
                    getAnxietyChange() < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    Anxiety Change: {getAnxietyChange() > 0 ? '+' : ''}{getAnxietyChange()}
                  </span>
                </div>
              )}
            </div>

            {/* Self-Worth After */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Self-Worth Level After
              </Label>
              <Slider
                value={[data.selfWorthAfter || 5]}
                onValueChange={([value]) => updateData('selfWorthAfter', value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 - Very Low</span>
                <span className="font-medium">{data.selfWorthAfter}/10</span>
                <span>10 - Very High</span>
              </div>
              
              {/* Self-Worth Change Display */}
              {data.selfWorthBefore && data.selfWorthAfter && (
                <div className="text-center p-2 bg-gray-50 rounded">
                  <span className={`text-sm font-medium ${
                    getSelfWorthChange() > 0 ? 'text-green-600' : 
                    getSelfWorthChange() < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    Self-Worth Change: {getSelfWorthChange() > 0 ? '+' : ''}{getSelfWorthChange()}
                  </span>
                </div>
              )}
            </div>

            {/* Physical Symptoms After */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-red-600" />
                Physical Symptoms (Select any you experienced)
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {physicalSymptoms.map(symptom => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={(data.physicalSymptomsAfter || []).includes(symptom)}
                      onCheckedChange={() => toggleArrayField('physicalSymptomsAfter', symptom)}
                    />
                    <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Emotional State After */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Emotional State (Select all that apply)
              </Label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {emotionalStates.map(state => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={state}
                      checked={(data.emotionalStateAfter || []).includes(state)}
                      onCheckedChange={() => toggleArrayField('emotionalStateAfter', state)}
                    />
                    <Label htmlFor={state} className="text-sm">{state}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Recovery and resilience
              </h3>
              <p className="text-sm text-gray-600">How did you recover and what helped?</p>
            </div>

            {/* Recovery Time */}
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Time to feel normal again (minutes)
              </Label>
              <Slider
                value={[data.recoveryTime || 60]}
                onValueChange={([value]) => updateData('recoveryTime', value)}
                min={0}
                max={480}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Immediate</span>
                <span className="font-medium">
                  {data.recoveryTime === 0 ? 'Immediate' : 
                   (data.recoveryTime || 0) < 60 ? `${data.recoveryTime} min` :
                   `${Math.round((data.recoveryTime || 0) / 60 * 10) / 10} hours`}
                </span>
                <span>8+ Hours</span>
              </div>
            </div>

            {/* Recovery Strategies Used */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Recovery strategies you used</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {recoveryStrategies.map(strategy => (
                  <div key={strategy} className="flex items-center space-x-2">
                    <Checkbox
                      id={strategy}
                      checked={(data.recoveryStrategies || []).includes(strategy)}
                      onCheckedChange={() => toggleArrayField('recoveryStrategies', strategy)}
                    />
                    <Label htmlFor={strategy} className="text-sm">{strategy}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* What Helped */}
            <div className="space-y-3">
              <Label className="text-base font-medium">What helped you recover fastest?</Label>
              <Textarea
                value={(data.whatHelped || []).join(', ')}
                onChange={(e) => updateData('whatHelped', e.target.value.split(', ').filter(Boolean))}
                placeholder="Specific actions, thoughts, or activities that helped..."
                className="min-h-[60px]"
              />
            </div>

            {/* What Made It Worse */}
            <div className="space-y-3">
              <Label className="text-base font-medium">What made recovery harder?</Label>
              <Textarea
                value={(data.whatMadeItWorse || []).join(', ')}
                onChange={(e) => updateData('whatMadeItWorse', e.target.value.split(', ').filter(Boolean))}
                placeholder="Things that prolonged recovery or made you feel worse..."
                className="min-h-[60px]"
              />
            </div>

            {/* Coping Skills Used */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Coping skills you used during the interaction</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {copingSkills.map(skill => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={(data.copingSkillsUsed || []).includes(skill)}
                      onCheckedChange={() => toggleArrayField('copingSkillsUsed', skill)}
                    />
                    <Label htmlFor={skill} className="text-sm">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Support System */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="support"
                checked={data.supportSystemEngaged}
                onCheckedChange={(checked) => updateData('supportSystemEngaged', checked)}
              />
              <Label htmlFor="support">I reached out to friends, family, or professionals for support</Label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How well did this interaction align with your baseline values?
              </h3>
              <p className="text-sm text-gray-600">Evaluate compatibility with your personal needs</p>
            </div>

            <div className="space-y-4">
              {/* Communication Style Respected */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <Label className="font-medium">My communication style was respected</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="communication-respected"
                    checked={data.communicationStyleRespected || false}
                    onCheckedChange={(checked) => updateData('communicationStyleRespected', checked)}
                  />
                  <Label htmlFor="communication-respected">Yes</Label>
                </div>
              </div>

              {/* Emotional Needs Met */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <Label className="font-medium">My emotional needs were met</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emotional-needs"
                    checked={data.emotionalNeedsMet || false}
                    onCheckedChange={(checked) => updateData('emotionalNeedsMet', checked)}
                  />
                  <Label htmlFor="emotional-needs">Yes</Label>
                </div>
              </div>

              {/* Boundaries Respected */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <Label className="font-medium">My boundaries were respected</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="boundaries-respected"
                    checked={data.boundariesRespected || false}
                    onCheckedChange={(checked) => updateData('boundariesRespected', checked)}
                  />
                  <Label htmlFor="boundaries-respected">Yes</Label>
                </div>
              </div>

              {/* Triggers Avoided */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <Label className="font-medium">My emotional triggers were avoided</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="triggers-avoided"
                    checked={data.triggersAvoided || false}
                    onCheckedChange={(checked) => updateData('triggersAvoided', checked)}
                  />
                  <Label htmlFor="triggers-avoided">Yes</Label>
                </div>
              </div>

              {/* Core Values Aligned */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <Label className="font-medium">This interaction aligned with my core values</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="values-aligned"
                    checked={data.coreValuesAligned || false}
                    onCheckedChange={(checked) => updateData('coreValuesAligned', checked)}
                  />
                  <Label htmlFor="values-aligned">Yes</Label>
                </div>
              </div>

              {/* Deal Breakers Present */}
              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <Label className="font-medium">Any of my deal-breakers were present</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="deal-breakers"
                    checked={data.dealBreakersPresent || false}
                    onCheckedChange={(checked) => updateData('dealBreakersPresent', checked)}
                  />
                  <Label htmlFor="deal-breakers">Yes</Label>
                </div>
              </div>

              {/* Overall Compatibility Score */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Overall Baseline Compatibility (1-10)
                </Label>
                <Slider
                  value={[data.baselineCompatibilityScore || 5]}
                  onValueChange={([value]) => updateData('baselineCompatibilityScore', value)}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 - Completely Incompatible</span>
                  <span className="font-medium">{data.baselineCompatibilityScore}/10</span>
                  <span>10 - Perfectly Compatible</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Reflection and learning
              </h3>
              <p className="text-sm text-gray-600">What did you learn for next time?</p>
            </div>

            {/* Warning Signs Noticed */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Warning signs you noticed during or after</Label>
              <Textarea
                value={(data.warningSignsNoticed || []).join(', ')}
                onChange={(e) => updateData('warningSignsNoticed', e.target.value.split(', ').filter(Boolean))}
                placeholder="Body language, tone changes, energy shifts, gut feelings..."
                className="min-h-[80px]"
              />
            </div>

            {/* Boundaries Maintained */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Boundaries you successfully maintained</Label>
              <Textarea
                value={(data.boundariesMaintained || []).join(', ')}
                onChange={(e) => updateData('boundariesMaintained', e.target.value.split(', ').filter(Boolean))}
                placeholder="Times you said no, redirected conversation, protected your energy..."
                className="min-h-[80px]"
              />
            </div>

            {/* Self-Advocacy Actions */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Ways you advocated for yourself</Label>
              <Textarea
                value={(data.selfAdvocacyActions || []).join(', ')}
                onChange={(e) => updateData('selfAdvocacyActions', e.target.value.split(', ').filter(Boolean))}
                placeholder="Spoke up, asked for what you needed, corrected them..."
                className="min-h-[80px]"
              />
            </div>

            {/* Lessons Learned */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Key lessons learned</Label>
              <Textarea
                value={data.lessonsLearned || ''}
                onChange={(e) => updateData('lessonsLearned', e.target.value)}
                placeholder="What would you do differently? What patterns do you notice?"
                className="min-h-[100px]"
              />
            </div>

            {/* Future Preparation */}
            <div className="space-y-3">
              <Label className="text-base font-medium">How will you prepare for next time?</Label>
              <Textarea
                value={(data.futurePreparation || []).join(', ')}
                onChange={(e) => updateData('futurePreparation', e.target.value.split(', ').filter(Boolean))}
                placeholder="Strategies, phrases, boundaries, exit plans..."
                className="min-h-[80px]"
              />
            </div>

            {/* Summary Display */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-3">Interaction Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Energy Impact:</span>
                    <div className={`font-medium ${getEnergyImpact().color}`}>
                      {data.energyBefore} → {data.energyAfter}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600">Recovery Time:</span>
                    <div className="font-medium">
                      {data.recoveryTime === 0 ? 'Immediate' : 
                       (data.recoveryTime || 0) < 60 ? `${data.recoveryTime} min` :
                       `${Math.round((data.recoveryTime || 0) / 60 * 10) / 10} hours`}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600">Anxiety Change:</span>
                    <div className={`font-medium ${
                      getAnxietyChange() > 0 ? 'text-red-600' : 
                      getAnxietyChange() < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {getAnxietyChange() > 0 ? '+' : ''}{getAnxietyChange()}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600">Self-Worth Change:</span>
                    <div className={`font-medium ${
                      getSelfWorthChange() > 0 ? 'text-green-600' : 
                      getSelfWorthChange() < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {getSelfWorthChange() > 0 ? '+' : ''}{getSelfWorthChange()}
                    </div>
                  </div>
                </div>
                
                {(data.physicalSymptomsAfter?.length || 0) > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <span className="text-blue-600 text-sm">Physical Impact: </span>
                    <span className="text-sm">{data.physicalSymptomsAfter?.slice(0, 3).join(', ')}</span>
                    {(data.physicalSymptomsAfter?.length || 0) > 3 && 
                      <span className="text-gray-500"> +{(data.physicalSymptomsAfter?.length || 0) - 3} more</span>
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Comprehensive Interaction Tracker</span>
            <Badge variant="outline">Step {step} of 5</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(1);
                  onClose();
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Cancel
              </Button>

              {step < 6 ? (
                <Button
                  onClick={() => setStep(Math.min(6, step + 1))}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Save Interaction
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}