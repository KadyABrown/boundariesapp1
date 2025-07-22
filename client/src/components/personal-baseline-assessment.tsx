import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TagInput } from "@/components/ui/tag-input";
import { 
  Heart, 
  MessageCircle, 
  Shield, 
  Clock, 
  Users, 
  Target,
  Brain,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Star
} from "lucide-react";

interface PersonalBaseline {
  // Communication Preferences
  communicationStyle: 'direct' | 'gentle' | 'collaborative' | 'assertive';
  conflictResolution: 'discuss-immediately' | 'need-time-to-process' | 'avoid-conflict' | 'address-when-calm';
  feedbackPreference: 'frequent-check-ins' | 'only-when-needed' | 'scheduled-discussions' | 'in-the-moment';
  listeningNeeds: string[];
  communicationDealBreakers: string[];
  
  // Emotional Needs
  emotionalSupport: 'high' | 'medium' | 'low';
  affectionStyle: string[];
  validationNeeds: 'frequent' | 'moderate' | 'minimal';
  emotionalProcessingTime: number; // hours
  triggers: string[];
  comfortingSources: string[];
  
  // Boundary Requirements
  personalSpaceNeeds: 'high' | 'medium' | 'low';
  aloneTimeFrequency: 'daily' | 'few-times-week' | 'weekly' | 'rarely';
  decisionMakingStyle: 'independent' | 'collaborative' | 'seek-input' | 'guided';
  privacyLevels: string[];
  nonNegotiableBoundaries: string[];
  flexibleBoundaries: string[];
  
  // Time and Availability
  responseTimeExpectation: number; // hours
  availabilityWindows: string[];
  socialEnergyLevel: 'high' | 'medium' | 'low';
  recoveryTimeNeeded: number; // hours after social interaction
  
  // Social Energy Impact Assessment
  socialEnergyPreference?: 'large-groups-energizing' | 'small-groups-ideal' | 'one-on-one-energizing' | 'quiet-activities' | 'significant-alone-time';
  socialRecoveryTime?: 'no-recovery-needed' | 'thirty-minutes' | 'one-to-two-hours' | 'several-hours' | 'full-day';
  
  // Growth and Values
  personalGrowthPriorities: string[];
  relationshipGoals: string[];
  valueAlignment: string[];
  dealBreakerBehaviors: string[];
}

interface CompatibilityScore {
  overall: number;
  communication: number;
  emotional: number;
  boundaries: number;
  timeAvailability: number;
  valuesAlignment: number;
}

interface PersonalBaselineAssessmentProps {
  baseline?: PersonalBaseline;
  onSaveBaseline: (baseline: PersonalBaseline) => void;
  relationshipData?: any[]; // For compatibility analysis
}

const communicationStyles = [
  { value: 'direct', label: 'Direct & Straightforward', description: 'I prefer clear, honest communication' },
  { value: 'gentle', label: 'Gentle & Considerate', description: 'I need kindness in how things are communicated' },
  { value: 'collaborative', label: 'Collaborative', description: 'I like to work together to solve problems' },
  { value: 'assertive', label: 'Assertive', description: 'I speak up for my needs confidently' }
];

const affectionStyles = [
  'Words of affirmation', 'Quality time', 'Physical touch', 'Acts of service', 
  'Gift giving', 'Active listening', 'Encouragement', 'Shared activities'
];

const listeningNeeds = [
  'Full attention when speaking', 'No interrupting', 'Ask questions to understand',
  'Validation of feelings', 'Solutions when asked', 'Just listen sometimes',
  'Remember important details', 'Follow up later'
];

const privacyLevels = [
  'Phone/device privacy', 'Personal space in home', 'Time with friends alone',
  'Financial independence', 'Personal goals/dreams', 'Past relationships',
  'Family relationships', 'Work life separation'
];

const valueAlignments = [
  'Honesty and transparency', 'Personal growth', 'Family importance',
  'Career ambition', 'Financial responsibility', 'Health and wellness',
  'Social justice', 'Spirituality/religion', 'Adventure and travel',
  'Community involvement', 'Environmental consciousness', 'Creativity'
];

export default function PersonalBaselineAssessment({
  baseline,
  onSaveBaseline,
  relationshipData = []
}: PersonalBaselineAssessmentProps) {
  const [activeSection, setActiveSection] = useState<'communication' | 'emotional' | 'boundaries' | 'time' | 'values' | 'compatibility'>('communication');
  const [formData, setFormData] = useState<PersonalBaseline>({
    communicationStyle: 'collaborative',
    conflictResolution: 'address-when-calm',
    feedbackPreference: 'only-when-needed',
    listeningNeeds: [],
    communicationDealBreakers: [],
    emotionalSupport: 'medium',
    affectionStyle: [],
    validationNeeds: 'moderate',
    emotionalProcessingTime: 4,
    triggers: [],
    comfortingSources: [],
    personalSpaceNeeds: 'medium',
    aloneTimeFrequency: 'few-times-week',
    decisionMakingStyle: 'collaborative',
    privacyLevels: [],
    nonNegotiableBoundaries: [],
    flexibleBoundaries: [],
    responseTimeExpectation: 4,
    availabilityWindows: [],
    socialEnergyLevel: 'medium',
    recoveryTimeNeeded: 2,
    personalGrowthPriorities: [],
    relationshipGoals: [],
    valueAlignment: [],
    dealBreakerBehaviors: [],
    socialEnergyPreference: undefined,
    socialRecoveryTime: undefined,
    ...baseline
  });

  const toggleArrayField = (field: keyof PersonalBaseline, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const calculateCompatibility = (relationshipId: number): CompatibilityScore => {
    // Mock compatibility calculation - in real app would use relationship data
    // This would analyze interaction patterns, boundary respect, communication success, etc.
    
    const baseScore = Math.random() * 40 + 30; // 30-70 base range
    
    return {
      overall: Math.round(baseScore + Math.random() * 30),
      communication: Math.round(baseScore + Math.random() * 20),
      emotional: Math.round(baseScore + Math.random() * 25),
      boundaries: Math.round(baseScore + Math.random() * 35),
      timeAvailability: Math.round(baseScore + Math.random() * 15),
      valuesAlignment: Math.round(baseScore + Math.random() * 30)
    };
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'communication':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Communication Preferences</h3>
            
            {/* Communication Style */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Preferred Communication Style</Label>
              <div className="grid gap-3">
                {communicationStyles.map(style => (
                  <button
                    key={style.value}
                    onClick={() => setFormData(prev => ({ ...prev, communicationStyle: style.value as any }))}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.communicationStyle === style.value 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium mb-1">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Listening Needs */}
            <div className="space-y-3">
              <Label className="text-base font-medium">What I need when someone is listening to me</Label>
              <div className="grid grid-cols-2 gap-2">
                {listeningNeeds.map(need => (
                  <div key={need} className="flex items-center space-x-2">
                    <Checkbox
                      id={need}
                      checked={formData.listeningNeeds.includes(need)}
                      onCheckedChange={() => toggleArrayField('listeningNeeds', need)}
                    />
                    <Label htmlFor={need} className="text-sm">{need}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Conflict Resolution */}
            <div className="space-y-3">
              <Label className="text-base font-medium">How I handle conflicts</Label>
              <select
                value={formData.conflictResolution}
                onChange={(e) => setFormData(prev => ({ ...prev, conflictResolution: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="discuss-immediately">I prefer to discuss issues immediately</option>
                <option value="need-time-to-process">I need time to process before discussing</option>
                <option value="avoid-conflict">I tend to avoid conflict when possible</option>
                <option value="address-when-calm">I address issues when we're both calm</option>
              </select>
            </div>

            {/* Communication Deal Breakers */}
            <TagInput
              label="Communication deal breakers (specific behaviors)"
              placeholder="e.g., Yelling or raising voice"
              value={formData.communicationDealBreakers}
              onChange={(communicationDealBreakers) => setFormData(prev => ({ ...prev, communicationDealBreakers }))}
              maxTags={8}
            />
          </div>
        );

      case 'emotional':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Emotional Needs</h3>
            
            {/* Emotional Support Level */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Level of emotional support I need</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'high', label: 'High Support', desc: 'Frequent check-ins and validation' },
                  { value: 'medium', label: 'Moderate Support', desc: 'Support during difficult times' },
                  { value: 'low', label: 'Independent', desc: 'Minimal emotional support needed' }
                ].map(level => (
                  <button
                    key={level.value}
                    onClick={() => setFormData(prev => ({ ...prev, emotionalSupport: level.value as any }))}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      formData.emotionalSupport === level.value 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium mb-1">{level.label}</div>
                    <div className="text-xs text-gray-600">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Affection Styles */}
            <div className="space-y-3">
              <Label className="text-base font-medium">How I prefer to receive affection (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {affectionStyles.map(style => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={style}
                      checked={formData.affectionStyle.includes(style)}
                      onCheckedChange={() => toggleArrayField('affectionStyle', style)}
                    />
                    <Label htmlFor={style} className="text-sm">{style}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing Time */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Time I need to process difficult emotions (hours)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[formData.emotionalProcessingTime]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, emotionalProcessingTime: value }))}
                  min={0.5}
                  max={48}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-lg font-medium w-16">
                  {formData.emotionalProcessingTime < 1 ? 
                    `${formData.emotionalProcessingTime * 60}m` : 
                    `${formData.emotionalProcessingTime}h`}
                </span>
              </div>
            </div>

            {/* Triggers */}
            <TagInput
              label="My emotional triggers (things that upset me)"
              placeholder="e.g., Being ignored or dismissed"
              value={formData.triggers}
              onChange={(triggers) => setFormData(prev => ({ ...prev, triggers }))}
              maxTags={8}
            />

            {/* Comforting Sources */}
            <TagInput
              label="What comforts me when I'm upset"
              placeholder="e.g., Physical comfort (hugs, holding hands)"
              value={formData.comfortingSources}
              onChange={(comfortingSources) => setFormData(prev => ({ ...prev, comfortingSources }))}
              maxTags={8}
            />

            {/* Social Energy Preference */}
            <div className="space-y-3">
              <Label className="text-base font-medium">How do social interactions typically affect your energy levels?</Label>
              <div className="space-y-2">
                {[
                  { value: 'large-groups-energizing', label: 'Large groups energize me' },
                  { value: 'small-groups-ideal', label: 'Small groups are ideal for me' },
                  { value: 'one-on-one-energizing', label: 'One-on-one conversations energize me most' },
                  { value: 'quiet-activities', label: 'I prefer quiet activities to recharge' },
                  { value: 'significant-alone-time', label: 'I need significant alone time after social events' }
                ].map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={option.value}
                      name="socialEnergyPreference"
                      value={option.value}
                      checked={formData.socialEnergyPreference === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, socialEnergyPreference: e.target.value as any }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Recovery Time */}
            <div className="space-y-3">
              <Label className="text-base font-medium">After spending time with people, how much recovery time do you typically need?</Label>
              <div className="space-y-2">
                {[
                  { value: 'no-recovery-needed', label: 'No recovery needed - I feel more energized' },
                  { value: 'thirty-minutes', label: '30 minutes to reset' },
                  { value: 'one-to-two-hours', label: '1-2 hours of quiet time' },
                  { value: 'several-hours', label: 'Several hours of alone time' },
                  { value: 'full-day', label: 'A full day to recharge' }
                ].map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={option.value}
                      name="socialRecoveryTime"
                      value={option.value}
                      checked={formData.socialRecoveryTime === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, socialRecoveryTime: e.target.value as any }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'boundaries':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Boundary Requirements</h3>
            
            {/* Personal Space */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Personal space needs</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'high', label: 'High', desc: 'Need significant alone time' },
                  { value: 'medium', label: 'Moderate', desc: 'Some alone time needed' },
                  { value: 'low', label: 'Low', desc: 'Prefer being together most times' }
                ].map(level => (
                  <button
                    key={level.value}
                    onClick={() => setFormData(prev => ({ ...prev, personalSpaceNeeds: level.value as any }))}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      formData.personalSpaceNeeds === level.value 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium mb-1">{level.label}</div>
                    <div className="text-xs text-gray-600">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Levels */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Important privacy areas for me</Label>
              <div className="grid grid-cols-2 gap-2">
                {privacyLevels.map(level => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={level}
                      checked={formData.privacyLevels.includes(level)}
                      onCheckedChange={() => toggleArrayField('privacyLevels', level)}
                    />
                    <Label htmlFor={level} className="text-sm">{level}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Negotiable Boundaries */}
            <TagInput
              label="Non-negotiable boundaries (absolute requirements)"
              placeholder="e.g., No yelling or verbal abuse"
              value={formData.nonNegotiableBoundaries}
              onChange={(nonNegotiableBoundaries) => setFormData(prev => ({ ...prev, nonNegotiableBoundaries }))}
              maxTags={10}
            />

            {/* Flexible Boundaries */}
            <TagInput
              label="Flexible boundaries (can be discussed and adjusted)"
              placeholder="e.g., How much time we spend together"
              value={formData.flexibleBoundaries}
              onChange={(flexibleBoundaries) => setFormData(prev => ({ ...prev, flexibleBoundaries }))}
              maxTags={10}
            />
          </div>
        );

      case 'values':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Values & Growth</h3>
            
            {/* Value Alignment */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Values that are important to me in relationships</Label>
              <div className="grid grid-cols-2 gap-2">
                {valueAlignments.map(value => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={value}
                      checked={formData.valueAlignment.includes(value)}
                      onCheckedChange={() => toggleArrayField('valueAlignment', value)}
                    />
                    <Label htmlFor={value} className="text-sm">{value}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationship Goals */}
            <TagInput
              label="What I want from my relationships"
              placeholder="e.g., Mutual growth and support"
              value={formData.relationshipGoals}
              onChange={(relationshipGoals) => setFormData(prev => ({ ...prev, relationshipGoals }))}
              maxTags={8}
            />

            {/* Deal Breaker Behaviors */}
            <TagInput
              label="Behaviors that would end a relationship for me"
              placeholder="e.g., Any form of abuse"
              value={formData.dealBreakerBehaviors}
              onChange={(dealBreakerBehaviors) => setFormData(prev => ({ ...prev, dealBreakerBehaviors }))}
              maxTags={10}
            />
          </div>
        );

      case 'compatibility':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Relationship Compatibility Analysis</h3>
            
            {relationshipData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No relationship data yet</h3>
                  <p className="text-gray-600">
                    Log interactions with people to see compatibility analysis based on your baseline
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {relationshipData.slice(0, 5).map((relationship) => {
                  const compatibility = calculateCompatibility(relationship.id);
                  
                  return (
                    <Card key={relationship.id} className="border-2">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">{relationship.name}</h4>
                            <p className="text-sm text-gray-600">{relationship.relationshipType}</p>
                          </div>
                          <Badge className={`text-lg px-3 py-1 ${getCompatibilityColor(compatibility.overall)}`}>
                            {compatibility.overall}% Match
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          {[
                            { label: 'Communication', score: compatibility.communication, icon: MessageCircle },
                            { label: 'Emotional', score: compatibility.emotional, icon: Heart },
                            { label: 'Boundaries', score: compatibility.boundaries, icon: Shield },
                            { label: 'Time/Availability', score: compatibility.timeAvailability, icon: Clock },
                            { label: 'Values', score: compatibility.valuesAlignment, icon: Star }
                          ].map(({ label, score, icon: Icon }) => (
                            <div key={label} className="text-center">
                              <Icon className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                              <div className="text-sm text-gray-600 mb-1">{label}</div>
                              <div className="font-semibold text-lg">{score}%</div>
                              <Progress value={score} className="h-1 mt-1" />
                            </div>
                          ))}
                        </div>

                        {/* Compatibility Insights */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="text-sm text-gray-700">
                              {compatibility.overall >= 80 ? (
                                <span className="text-green-700">
                                  <strong>Excellent compatibility!</strong> This relationship aligns well with your baseline needs across most areas.
                                </span>
                              ) : compatibility.overall >= 60 ? (
                                <span className="text-blue-700">
                                  <strong>Good compatibility.</strong> Some areas may need attention, particularly {
                                    [
                                      { name: 'communication', score: compatibility.communication },
                                      { name: 'boundaries', score: compatibility.boundaries },
                                      { name: 'emotional needs', score: compatibility.emotional }
                                    ].sort((a, b) => a.score - b.score)[0].name
                                  }.
                                </span>
                              ) : compatibility.overall >= 40 ? (
                                <span className="text-yellow-700">
                                  <strong>Moderate compatibility.</strong> Significant differences in key areas may require ongoing work or compromise.
                                </span>
                              ) : (
                                <span className="text-red-700">
                                  <strong>Low compatibility.</strong> This relationship may be causing stress due to misaligned needs and boundaries.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
        {[
          { id: 'communication', label: 'Communication', icon: MessageCircle },
          { id: 'emotional', label: 'Emotional Needs', icon: Heart },
          { id: 'boundaries', label: 'Boundaries', icon: Shield },
          { id: 'values', label: 'Values & Growth', icon: Star },
          { id: 'compatibility', label: 'Compatibility', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeSection === id 
                ? 'bg-white shadow-sm text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <Card>
        <CardContent className="p-6">
          {renderSection()}
          
          {activeSection !== 'compatibility' && (
            <div className="flex justify-end mt-6 pt-6 border-t">
              <Button onClick={() => onSaveBaseline(formData)} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Save Baseline
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Status */}
      {baseline && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">Baseline Assessment Complete</h4>
                <p className="text-sm text-green-700">
                  Your personal baseline is saved and being used for compatibility analysis with your relationships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}