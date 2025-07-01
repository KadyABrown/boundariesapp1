import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle, 
  AlertTriangle, 
  Brain, 
  Target, 
  Clock, 
  TrendingUp,
  Eye,
  Lightbulb,
  Calendar,
  MapPin,
  Users,
  Zap
} from "lucide-react";

interface TriggerPattern {
  id: string;
  trigger: string;
  category: 'topic' | 'location' | 'time' | 'people' | 'behavior' | 'emotional-state';
  violationCount: number;
  totalOccurrences: number;
  violationRate: number;
  averageSeverity: number;
  timesSinceLastBoundary: number[];
  contextualFactors: string[];
  userReactions: string[];
  effectiveResponses: string[];
  lastOccurrence: string;
}

interface TriggerAnalysisTrackerProps {
  relationshipId: number;
  relationshipName: string;
  existingTriggers?: TriggerPattern[];
  onUpdateTriggers: (triggers: TriggerPattern[]) => void;
}

const commonTopicTriggers = [
  'Money/Finances', 'Past relationships', 'Family issues', 'Work stress', 
  'Future plans', 'Social activities', 'Personal boundaries', 'Time management',
  'Lifestyle choices', 'Values/beliefs', 'Appearance comments', 'Decision making'
];

const contextualFactors = [
  'They were stressed', 'I was tired', 'Others were present', 'Private setting',
  'After drinking', 'During conflict', 'When they need something', 'Holiday/special event',
  'Financial pressure', 'Work deadline', 'Family visiting', 'Health issues'
];

const userReactionPatterns = [
  'I got defensive', 'I shut down', 'I got angry', 'I tried to explain',
  'I changed the subject', 'I gave in', 'I left the room', 'I stood my ground',
  'I got emotional', 'I became confused', 'I felt guilty', 'I questioned myself'
];

const effectiveResponseStrategies = [
  'Set clear boundary immediately', 'Redirected conversation', 'Used humor to deflect',
  'Asked clarifying questions', 'Stated my needs directly', 'Took a break',
  'Called them out respectfully', 'Changed the subject', 'Left the situation',
  'Used "I" statements', 'Stayed calm and factual', 'Got support from others'
];

export default function TriggerAnalysisTracker({
  relationshipId,
  relationshipName,
  existingTriggers = [],
  onUpdateTriggers
}: TriggerAnalysisTrackerProps) {
  const [activeTab, setActiveTab] = useState<'patterns' | 'add-trigger' | 'insights'>('patterns');
  const [newTrigger, setNewTrigger] = useState({
    trigger: '',
    category: 'topic' as const,
    contextualFactors: [] as string[],
    userReaction: '',
    effectiveResponse: '',
    severity: 5,
    boundaryViolated: false,
    customContext: '',
    timeOfDay: '',
    location: '',
    peoplePresent: ''
  });

  const calculateTriggerInsights = () => {
    const sortedTriggers = [...existingTriggers].sort((a, b) => b.violationRate - a.violationRate);
    const highRiskTriggers = sortedTriggers.filter(t => t.violationRate > 70);
    const improvingTriggers = sortedTriggers.filter(t => {
      const recentViolations = t.timesSinceLastBoundary.slice(-3);
      return recentViolations.length > 1 && recentViolations[recentViolations.length - 1] > recentViolations[0];
    });

    return {
      mostProblematic: sortedTriggers.slice(0, 3),
      improving: improvingTriggers,
      highRisk: highRiskTriggers,
      totalTriggers: existingTriggers.length,
      averageViolationRate: existingTriggers.length > 0 ? 
        existingTriggers.reduce((sum, t) => sum + t.violationRate, 0) / existingTriggers.length : 0
    };
  };

  const insights = calculateTriggerInsights();

  const handleAddTrigger = () => {
    const trigger: TriggerPattern = {
      id: Date.now().toString(),
      trigger: newTrigger.trigger,
      category: newTrigger.category,
      violationCount: newTrigger.boundaryViolated ? 1 : 0,
      totalOccurrences: 1,
      violationRate: newTrigger.boundaryViolated ? 100 : 0,
      averageSeverity: newTrigger.severity,
      timesSinceLastBoundary: [0], // Days since last boundary was set for this trigger
      contextualFactors: [...newTrigger.contextualFactors, newTrigger.customContext].filter(Boolean),
      userReactions: newTrigger.userReaction ? [newTrigger.userReaction] : [],
      effectiveResponses: newTrigger.effectiveResponse ? [newTrigger.effectiveResponse] : [],
      lastOccurrence: new Date().toISOString()
    };

    const updatedTriggers = [...existingTriggers, trigger];
    onUpdateTriggers(updatedTriggers);

    // Reset form
    setNewTrigger({
      trigger: '',
      category: 'topic',
      contextualFactors: [],
      userReaction: '',
      effectiveResponse: '',
      severity: 5,
      boundaryViolated: false,
      customContext: '',
      timeOfDay: '',
      location: '',
      peoplePresent: ''
    });
    setActiveTab('patterns');
  };

  const toggleContextualFactor = (factor: string) => {
    setNewTrigger(prev => ({
      ...prev,
      contextualFactors: prev.contextualFactors.includes(factor)
        ? prev.contextualFactors.filter(f => f !== factor)
        : [...prev.contextualFactors, factor]
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'topic': return MessageCircle;
      case 'location': return MapPin;
      case 'time': return Clock;
      case 'people': return Users;
      case 'behavior': return Eye;
      case 'emotional-state': return Brain;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'topic': return 'from-blue-500 to-blue-600';
      case 'location': return 'from-green-500 to-green-600';
      case 'time': return 'from-purple-500 to-purple-600';
      case 'people': return 'from-orange-500 to-orange-600';
      case 'behavior': return 'from-red-500 to-red-600';
      case 'emotional-state': return 'from-pink-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const renderPatterns = () => (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{insights.totalTriggers}</div>
            <div className="text-sm text-gray-600">Identified Triggers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{insights.highRisk.length}</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{insights.improving.length}</div>
            <div className="text-sm text-gray-600">Improving</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(insights.averageViolationRate)}%
            </div>
            <div className="text-sm text-gray-600">Avg Violation Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Trigger List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Trigger Patterns</h3>
          <Button onClick={() => setActiveTab('add-trigger')} className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Log New Trigger
          </Button>
        </div>

        {existingTriggers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No triggers identified yet</h3>
              <p className="text-gray-600 mb-4">
                Start logging conversation topics and situations that lead to boundary violations
              </p>
              <Button onClick={() => setActiveTab('add-trigger')}>
                Log First Trigger
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {existingTriggers.map((trigger) => {
              const Icon = getCategoryIcon(trigger.category);
              const colorClass = getCategoryColor(trigger.category);
              
              return (
                <motion.div
                  key={trigger.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-800">{trigger.trigger}</h4>
                          <Badge variant="outline" className="text-xs capitalize">
                            {trigger.category.replace('-', ' ')}
                          </Badge>
                          {trigger.violationRate > 70 && (
                            <Badge className="bg-red-100 text-red-700 border-red-300">
                              High Risk
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <div className="text-sm text-gray-600">Violation Rate</div>
                            <div className="font-medium text-red-600">{Math.round(trigger.violationRate)}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Occurrences</div>
                            <div className="font-medium">{trigger.totalOccurrences}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Avg Severity</div>
                            <div className="font-medium">{trigger.averageSeverity.toFixed(1)}/10</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Last Seen</div>
                            <div className="font-medium text-xs">
                              {new Date(trigger.lastOccurrence).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-1">Violation Rate</div>
                          <Progress 
                            value={trigger.violationRate} 
                            className={`h-2 ${trigger.violationRate > 70 ? '[&>div]:bg-red-500' : 
                                      trigger.violationRate > 40 ? '[&>div]:bg-orange-500' : '[&>div]:bg-yellow-500'}`}
                          />
                        </div>

                        {trigger.contextualFactors.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm text-gray-600 mb-2">Common Context</div>
                            <div className="flex flex-wrap gap-1">
                              {trigger.contextualFactors.slice(0, 3).map((factor, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {factor}
                                </Badge>
                              ))}
                              {trigger.contextualFactors.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{trigger.contextualFactors.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {trigger.effectiveResponses.length > 0 && (
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Effective Responses</div>
                            <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                              {trigger.effectiveResponses.slice(0, 2).join(', ')}
                              {trigger.effectiveResponses.length > 2 && '...'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderAddTrigger = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Log New Trigger</h3>
        <Button variant="outline" onClick={() => setActiveTab('patterns')}>
          Back to Patterns
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Trigger Description */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What topic or situation triggered a problem?</Label>
            <Input
              value={newTrigger.trigger}
              onChange={(e) => setNewTrigger(prev => ({ ...prev, trigger: e.target.value }))}
              placeholder="e.g., 'Discussing weekend plans', 'When I said no to dinner'"
              className="w-full"
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Category</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { value: 'topic', label: 'Conversation Topic', icon: MessageCircle },
                { value: 'location', label: 'Location/Setting', icon: MapPin },
                { value: 'time', label: 'Time/Timing', icon: Clock },
                { value: 'people', label: 'People Present', icon: Users },
                { value: 'behavior', label: 'Their Behavior', icon: Eye },
                { value: 'emotional-state', label: 'Emotional State', icon: Brain }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setNewTrigger(prev => ({ ...prev, category: value as any }))}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    newTrigger.category === value 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-2 text-blue-600" />
                  <div className="font-medium text-sm">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Contextual Factors */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What was the context? (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {contextualFactors.map(factor => (
                <div key={factor} className="flex items-center space-x-2">
                  <Checkbox
                    id={factor}
                    checked={newTrigger.contextualFactors.includes(factor)}
                    onCheckedChange={() => toggleContextualFactor(factor)}
                  />
                  <Label htmlFor={factor} className="text-sm">{factor}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Context */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Additional context (optional)</Label>
            <Textarea
              value={newTrigger.customContext}
              onChange={(e) => setNewTrigger(prev => ({ ...prev, customContext: e.target.value }))}
              placeholder="Any other relevant details about the situation..."
              className="min-h-[80px]"
            />
          </div>

          {/* Boundary Violation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="violation"
              checked={newTrigger.boundaryViolated}
              onCheckedChange={(checked) => setNewTrigger(prev => ({ ...prev, boundaryViolated: !!checked }))}
            />
            <Label htmlFor="violation">This situation led to a boundary violation</Label>
          </div>

          {/* Severity */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Severity of impact (1-10)</Label>
            <div className="flex items-center space-x-4">
              <Input
                type="range"
                min="1"
                max="10"
                value={newTrigger.severity}
                onChange={(e) => setNewTrigger(prev => ({ ...prev, severity: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-lg font-medium w-8">{newTrigger.severity}</span>
            </div>
          </div>

          {/* Your Reaction */}
          <div className="space-y-3">
            <Label className="text-base font-medium">How did you typically react?</Label>
            <select
              value={newTrigger.userReaction}
              onChange={(e) => setNewTrigger(prev => ({ ...prev, userReaction: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select your reaction...</option>
              {userReactionPatterns.map(reaction => (
                <option key={reaction} value={reaction}>{reaction}</option>
              ))}
            </select>
          </div>

          {/* Effective Response */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What response worked well? (if any)</Label>
            <select
              value={newTrigger.effectiveResponse}
              onChange={(e) => setNewTrigger(prev => ({ ...prev, effectiveResponse: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select effective response...</option>
              {effectiveResponseStrategies.map(strategy => (
                <option key={strategy} value={strategy}>{strategy}</option>
              ))}
            </select>
          </div>

          <Button 
            onClick={handleAddTrigger} 
            disabled={!newTrigger.trigger}
            className="w-full"
          >
            Save Trigger Pattern
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Trigger Insights</h3>

      {insights.mostProblematic.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Highest Risk Triggers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.mostProblematic.map(trigger => (
                <div key={trigger.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium text-gray-800">{trigger.trigger}</div>
                    <div className="text-sm text-gray-600">
                      {trigger.violationCount} violations out of {trigger.totalOccurrences} times
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-300">
                    {Math.round(trigger.violationRate)}% violation rate
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {insights.improving.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              Improving Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.improving.map(trigger => (
                <div key={trigger.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium text-gray-800">{trigger.trigger}</div>
                    <div className="text-sm text-gray-600">
                      Fewer violations in recent interactions
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    Improving
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'patterns', label: 'Trigger Patterns', icon: Target },
          { id: 'add-trigger', label: 'Log Trigger', icon: Zap },
          { id: 'insights', label: 'Insights', icon: Lightbulb }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all flex-1 justify-center ${
              activeTab === id 
                ? 'bg-white shadow-sm text-blue-600 font-medium' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'patterns' && renderPatterns()}
      {activeTab === 'add-trigger' && renderAddTrigger()}
      {activeTab === 'insights' && renderInsights()}
    </div>
  );
}