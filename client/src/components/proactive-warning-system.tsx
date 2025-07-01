import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  TrendingUp, 
  Brain, 
  MessageCircle,
  Eye,
  Target,
  Lightbulb,
  X,
  CheckCircle,
  ArrowRight,
  Zap
} from "lucide-react";

interface WarningAlert {
  id: string;
  type: 'pattern' | 'escalation' | 'context' | 'recovery' | 'boundary';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  triggers: string[];
  recommendations: string[];
  suggestedPhrases?: string[];
  exitStrategies?: string[];
  confidence: number;
  timeframe: string;
  dismissed?: boolean;
}

interface InteractionHistory {
  id: string;
  timestamp: string;
  flagType: 'red' | 'green';
  category: string;
  severity: 'low' | 'medium' | 'high';
  templateId: string;
  contextualData: {
    location: string;
    timeOfDay: string;
    witnesses: string;
    myEnergyBefore: string;
    myEnergyAfter: string;
  };
}

interface ProactiveWarningSystemProps {
  relationshipId: number;
  relationshipName: string;
  interactions: InteractionHistory[];
  currentContext?: {
    plannedMeeting?: boolean;
    topic?: string;
    location?: string;
    others?: string[];
  };
  onDismissAlert: (alertId: string) => void;
}

export default function ProactiveWarningSystem({
  relationshipId,
  relationshipName,
  interactions,
  currentContext,
  onDismissAlert
}: ProactiveWarningSystemProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);

  // Generate proactive warnings based on patterns
  const warnings = useMemo(() => {
    const alerts: WarningAlert[] = [];
    
    if (interactions.length < 3) return alerts;

    const now = new Date();
    const recentInteractions = interactions.filter(i => 
      new Date(i.timestamp) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    );

    // 1. Escalation Pattern Warning
    const redFlags = recentInteractions.filter(i => i.flagType === 'red');
    const lastWeekRed = redFlags.filter(i => 
      new Date(i.timestamp) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    );
    
    if (lastWeekRed.length >= 3) {
      alerts.push({
        id: 'escalation-warning',
        type: 'escalation',
        severity: 'high',
        title: '⚠️ Escalating Pattern Detected',
        description: `${lastWeekRed.length} concerning incidents in the past week. This relationship may be becoming unsafe.`,
        triggers: ['Multiple violations', 'Increasing frequency', 'Pattern escalation'],
        recommendations: [
          'Consider limiting contact with this person',
          'Document all interactions for safety',
          'Reach out to trusted friends or professionals',
          'Have an exit strategy ready for future interactions'
        ],
        suggestedPhrases: [
          '"I need some space to think about this."',
          '"We can continue this conversation later."',
          '"I\'m not comfortable with this topic right now."'
        ],
        exitStrategies: [
          'Say you have an urgent call to take',
          'Mention you need to leave for another commitment',
          'Use the "bathroom break" to reassess the situation'
        ],
        confidence: 90,
        timeframe: 'Immediate attention needed'
      });
    }

    // 2. Context-Based Warning
    if (currentContext?.location && currentContext?.topic) {
      const contextViolations = redFlags.filter(i => 
        i.contextualData.location?.toLowerCase().includes(currentContext.location?.toLowerCase() || '') ||
        (currentContext.topic && i.templateId.includes('communication'))
      );

      if (contextViolations.length >= 2) {
        alerts.push({
          id: 'context-warning',
          type: 'context',
          severity: 'medium',
          title: '🎯 High-Risk Situation',
          description: `Similar contexts have led to boundary violations ${contextViolations.length} times before.`,
          triggers: [`Location: ${currentContext.location}`, `Topic: ${currentContext.topic}`],
          recommendations: [
            'Set clear expectations before the conversation starts',
            'Keep the interaction brief and focused',
            'Have your boundaries ready to state clearly',
            'Trust your instincts if something feels off'
          ],
          suggestedPhrases: [
            '"Let\'s keep this conversation focused."',
            '"I\'d prefer to discuss this briefly."',
            '"I need us to stay on topic."'
          ],
          confidence: 75,
          timeframe: 'Before next interaction'
        });
      }
    }

    // 3. Communication Pattern Warning
    const communicationViolations = redFlags.filter(i => i.category === 'Communication');
    if (communicationViolations.length >= 3) {
      alerts.push({
        id: 'communication-pattern',
        type: 'pattern',
        severity: 'medium',
        title: '💬 Communication Red Flags',
        description: 'This person consistently interrupts, dismisses, or talks over you.',
        triggers: ['Interrupting', 'Not listening', 'Dismissive behavior'],
        recommendations: [
          'Use assertive language to reclaim your speaking time',
          'Set communication ground rules upfront',
          'Practice phrases to stop interruptions',
          'Consider whether this person respects your voice'
        ],
        suggestedPhrases: [
          '"Excuse me, I wasn\'t finished."',
          '"Please let me complete my thought."',
          '"I need you to listen to what I\'m saying."',
          '"Hold on, I was still talking."'
        ],
        confidence: 85,
        timeframe: 'Next conversation'
      });
    }

    // 4. Energy Drain Warning
    const energyDrains = recentInteractions.filter(i => {
      const before = parseInt(i.contextualData.myEnergyBefore) || 5;
      const after = parseInt(i.contextualData.myEnergyAfter) || 5;
      return after < before - 3;
    });

    if (energyDrains.length > recentInteractions.length * 0.7) {
      alerts.push({
        id: 'energy-drain',
        type: 'pattern',
        severity: 'high',
        title: '🔋 Severe Energy Drain Pattern',
        description: 'Most interactions with this person leave you significantly drained.',
        triggers: ['Consistent energy loss', 'Emotional exhaustion', 'Physical symptoms'],
        recommendations: [
          'Limit interaction time to protect your energy',
          'Schedule recovery time after seeing them',
          'Consider if this relationship is worth the energy cost',
          'Notice what specific behaviors drain you most'
        ],
        confidence: 80,
        timeframe: 'Ongoing pattern management'
      });
    }

    // 5. Recovery Time Warning
    const slowRecovery = recentInteractions.filter(i => 
      i.contextualData && parseInt(i.contextualData.myEnergyAfter) < 4
    );

    if (slowRecovery.length >= 2) {
      alerts.push({
        id: 'recovery-concern',
        type: 'recovery',
        severity: 'medium',
        title: '⏰ Slow Recovery Pattern',
        description: 'You\'re taking longer to feel normal after interactions with this person.',
        triggers: ['Extended recovery time', 'Lingering emotional impact', 'Disrupted well-being'],
        recommendations: [
          'Build in longer buffer time after seeing them',
          'Practice self-care rituals that help you recover',
          'Notice what helps you bounce back faster',
          'Consider reducing frequency of contact'
        ],
        confidence: 70,
        timeframe: 'After each interaction'
      });
    }

    // 6. Boundary Testing Pattern
    const boundaryViolations = redFlags.filter(i => i.category === 'Boundary Violation');
    if (boundaryViolations.length >= 2) {
      alerts.push({
        id: 'boundary-testing',
        type: 'boundary',
        severity: 'high',
        title: '🛡️ Boundary Testing Detected',
        description: 'This person repeatedly tests or ignores your stated boundaries.',
        triggers: ['Ignoring "no"', 'Pushing after boundaries set', 'Minimizing your limits'],
        recommendations: [
          'Be prepared to enforce consequences immediately',
          'State boundaries clearly and don\'t explain or justify',
          'Remove yourself if boundaries continue to be violated',
          'Document boundary violations for future reference'
        ],
        suggestedPhrases: [
          '"I already gave you my answer."',
          '"I won\'t be discussing this further."',
          '"My boundary hasn\'t changed."',
          '"This conversation is over."'
        ],
        exitStrategies: [
          'End the conversation immediately',
          'Leave the location if necessary',
          'Block communication channels temporarily',
          'Involve others if you feel unsafe'
        ],
        confidence: 95,
        timeframe: 'Immediate boundary enforcement needed'
      });
    }

    return alerts.filter(alert => !dismissedAlerts.includes(alert.id));
  }, [interactions, currentContext, dismissedAlerts]);

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    onDismissAlert(alertId);
  };

  const toggleExpanded = (alertId: string) => {
    setExpandedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-red-700 border-red-500';
      case 'high': return 'from-red-500 to-red-600 border-red-400';
      case 'medium': return 'from-orange-500 to-orange-600 border-orange-400';
      case 'low': return 'from-yellow-500 to-yellow-600 border-yellow-400';
      default: return 'from-gray-500 to-gray-600 border-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': 
      case 'high': return AlertTriangle;
      case 'medium': return Eye;
      case 'low': return Lightbulb;
      default: return Brain;
    }
  };

  if (warnings.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">No Immediate Concerns</h3>
              <p className="text-sm text-green-700">
                Recent interactions show no concerning patterns. Stay aware and trust your instincts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Proactive Insights for {relationshipName}
        </h3>
        <Badge variant="outline" className="text-purple-700">
          {warnings.length} alert{warnings.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <AnimatePresence>
        {warnings.map((warning, index) => {
          const SeverityIcon = getSeverityIcon(warning.severity);
          const isExpanded = expandedAlerts.includes(warning.id);
          
          return (
            <motion.div
              key={warning.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-l-4 ${getSeverityColor(warning.severity)}`}>
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${getSeverityColor(warning.severity).split(' ')[0]} ${getSeverityColor(warning.severity).split(' ')[1]}`}>
                          <SeverityIcon className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-800">{warning.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                warning.severity === 'critical' || warning.severity === 'high' ? 'border-red-300 text-red-700' :
                                warning.severity === 'medium' ? 'border-orange-300 text-orange-700' :
                                'border-yellow-300 text-yellow-700'
                              }`}
                            >
                              {warning.confidence}% confidence
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{warning.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {warning.timeframe}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {warning.type}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(warning.id)}
                            className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                          >
                            {isExpanded ? 'Show Less' : 'Show Recommendations'}
                            <ArrowRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </Button>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismissAlert(warning.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 space-y-4">
                          {/* Triggers */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">What triggers this:</h5>
                            <div className="flex flex-wrap gap-2">
                              {warning.triggers.map((trigger, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {trigger}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Recommendations */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Recommended actions:</h5>
                            <ul className="space-y-2">
                              {warning.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Suggested Phrases */}
                          {warning.suggestedPhrases && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Phrases to use:</h5>
                              <div className="space-y-2">
                                {warning.suggestedPhrases.map((phrase, i) => (
                                  <div key={i} className="p-2 bg-blue-50 rounded border border-blue-200">
                                    <span className="text-sm text-blue-800 font-medium">{phrase}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Exit Strategies */}
                          {warning.exitStrategies && (
                            <div>
                              <h5 className="text-sm font-medium text-red-700 mb-2">Exit strategies if needed:</h5>
                              <ul className="space-y-1">
                                {warning.exitStrategies.map((strategy, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{strategy}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}