import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Phone,
  Calendar,
  Target,
  Eye,
  Shield,
  Brain
} from "lucide-react";

interface BoundaryEvent {
  id: string;
  timestamp: string;
  boundaryType: 'said-no' | 'set-limit' | 'called-out-behavior' | 'ended-conversation' | 'requested-space';
  description: string;
  severity: 'low' | 'medium' | 'high';
  theirReaction: 'accepted' | 'pushed-back' | 'got-angry' | 'guilt-tripped' | 'silent-treatment' | 'respect-shown';
}

interface CommunicationPattern {
  id: string;
  lastContactDate: string;
  lastBoundaryDate: string;
  daysSinceBoundary: number;
  daysSinceLastContact: number;
  boundaryType: string;
  typicalSilenceDuration: number; // days
  hasResumedContact: boolean;
  patternNotes: string;
  isNormalPattern: boolean;
}

interface CommunicationSilenceTrackerProps {
  relationshipId: number;
  relationshipName: string;
  boundaryEvents: BoundaryEvent[];
  communicationPatterns: CommunicationPattern[];
  onLogBoundary: (boundary: Omit<BoundaryEvent, 'id' | 'timestamp'>) => void;
  onUpdateCommunication: (lastContactDate: string) => void;
}

export default function CommunicationSilenceTracker({
  relationshipId,
  relationshipName,
  boundaryEvents,
  communicationPatterns,
  onLogBoundary,
  onUpdateCommunication
}: CommunicationSilenceTrackerProps) {
  const [showBoundaryDialog, setShowBoundaryDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [newBoundary, setNewBoundary] = useState({
    boundaryType: 'said-no' as const,
    description: '',
    severity: 'medium' as const,
    theirReaction: 'accepted' as const
  });
  const [lastContactDate, setLastContactDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Calculate current silence analysis
  const silenceAnalysis = useMemo(() => {
    const now = new Date();
    const mostRecentBoundary = boundaryEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    const mostRecentContact = communicationPatterns
      .sort((a, b) => new Date(b.lastContactDate).getTime() - new Date(a.lastContactDate).getTime())[0];

    if (!mostRecentBoundary || !mostRecentContact) {
      return {
        isInSilencePeriod: false,
        daysSinceBoundary: 0,
        daysSinceContact: 0,
        isNormalPattern: true,
        prediction: '',
        recommendation: ''
      };
    }

    const daysSinceBoundary = Math.floor(
      (now.getTime() - new Date(mostRecentBoundary.timestamp).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const daysSinceContact = Math.floor(
      (now.getTime() - new Date(mostRecentContact.lastContactDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate typical silence duration for this person after boundaries
    const historicalSilences = communicationPatterns.filter(p => p.typicalSilenceDuration > 0);
    const avgSilenceDuration = historicalSilences.length > 0 
      ? historicalSilences.reduce((sum, p) => sum + p.typicalSilenceDuration, 0) / historicalSilences.length
      : 3; // Default assumption

    const isInSilencePeriod = daysSinceContact >= 1 && daysSinceBoundary <= 14;
    const isNormalPattern = daysSinceContact <= avgSilenceDuration + 2;

    let prediction = '';
    let recommendation = '';

    if (isInSilencePeriod) {
      if (daysSinceContact < avgSilenceDuration) {
        prediction = `This silence period is normal for ${relationshipName}. They typically take ${Math.round(avgSilenceDuration)} days to resume contact after boundaries.`;
        recommendation = 'Give them space. This appears to be their normal processing time.';
      } else if (daysSinceContact <= avgSilenceDuration + 2) {
        prediction = `Approaching the upper end of their typical silence period. Contact usually resumes within the next 1-2 days.`;
        recommendation = 'Continue waiting. They may be processing or testing your resolve.';
      } else {
        prediction = `This silence period is longer than usual. May indicate they\'re escalating their response or permanently distancing.`;
        recommendation = 'Consider if this relationship is worth the emotional energy. Extended silence after reasonable boundaries is concerning.';
      }
    }

    return {
      isInSilencePeriod,
      daysSinceBoundary,
      daysSinceContact,
      isNormalPattern,
      prediction,
      recommendation,
      avgSilenceDuration: Math.round(avgSilenceDuration)
    };
  }, [boundaryEvents, communicationPatterns, relationshipName]);

  // Boundary response patterns
  const boundaryResponsePatterns = useMemo(() => {
    const reactionCounts = boundaryEvents.reduce((acc, event) => {
      acc[event.theirReaction] = (acc[event.theirReaction] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalEvents = boundaryEvents.length;
    
    return Object.entries(reactionCounts).map(([reaction, count]) => ({
      reaction,
      count,
      percentage: Math.round((count / totalEvents) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [boundaryEvents]);

  const getReactionColor = (reaction: string) => {
    switch (reaction) {
      case 'accepted':
      case 'respect-shown':
        return 'text-green-600 bg-green-100';
      case 'pushed-back':
      case 'guilt-tripped':
        return 'text-orange-600 bg-orange-100';
      case 'got-angry':
      case 'silent-treatment':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getReactionLabel = (reaction: string) => {
    switch (reaction) {
      case 'accepted': return 'Accepted Gracefully';
      case 'pushed-back': return 'Pushed Back';
      case 'got-angry': return 'Got Angry';
      case 'guilt-tripped': return 'Used Guilt';
      case 'silent-treatment': return 'Silent Treatment';
      case 'respect-shown': return 'Showed Respect';
      default: return reaction;
    }
  };

  const handleLogBoundary = () => {
    onLogBoundary(newBoundary);
    setNewBoundary({
      boundaryType: 'said-no',
      description: '',
      severity: 'medium',
      theirReaction: 'accepted'
    });
    setShowBoundaryDialog(false);
  };

  const handleUpdateContact = () => {
    onUpdateCommunication(lastContactDate);
    setShowContactDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className={`border-2 ${
        silenceAnalysis.isInSilencePeriod 
          ? silenceAnalysis.isNormalPattern 
            ? 'border-blue-200 bg-blue-50' 
            : 'border-orange-200 bg-orange-50'
          : 'border-green-200 bg-green-50'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            Communication Status with {relationshipName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {silenceAnalysis.daysSinceContact}
              </div>
              <div className="text-sm text-gray-600">Days Since Last Contact</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {silenceAnalysis.daysSinceBoundary}
              </div>
              <div className="text-sm text-gray-600">Days Since Last Boundary</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {silenceAnalysis.avgSilenceDuration}
              </div>
              <div className="text-sm text-gray-600">Typical Silence Duration</div>
            </div>
          </div>

          {silenceAnalysis.prediction && (
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Pattern Analysis</h4>
                  <p className="text-gray-700 mb-3">{silenceAnalysis.prediction}</p>
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-700 font-medium">{silenceAnalysis.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Dialog open={showBoundaryDialog} onOpenChange={setShowBoundaryDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Log Boundary Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Boundary Setting Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Type of boundary set</Label>
                    <select
                      value={newBoundary.boundaryType}
                      onChange={(e) => setNewBoundary(prev => ({ ...prev, boundaryType: e.target.value as any }))}
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option value="said-no">Said No to Request</option>
                      <option value="set-limit">Set a Limit</option>
                      <option value="called-out-behavior">Called Out Behavior</option>
                      <option value="ended-conversation">Ended Conversation</option>
                      <option value="requested-space">Requested Space</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={newBoundary.description}
                      onChange={(e) => setNewBoundary(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What boundary did you set?"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label>Their immediate reaction</Label>
                    <select
                      value={newBoundary.theirReaction}
                      onChange={(e) => setNewBoundary(prev => ({ ...prev, theirReaction: e.target.value as any }))}
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option value="accepted">Accepted Gracefully</option>
                      <option value="respect-shown">Showed Respect</option>
                      <option value="pushed-back">Pushed Back</option>
                      <option value="got-angry">Got Angry</option>
                      <option value="guilt-tripped">Used Guilt Trip</option>
                      <option value="silent-treatment">Gave Silent Treatment</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>Severity of boundary</Label>
                    <select
                      value={newBoundary.severity}
                      onChange={(e) => setNewBoundary(prev => ({ ...prev, severity: e.target.value as any }))}
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option value="low">Low - Minor request</option>
                      <option value="medium">Medium - Important boundary</option>
                      <option value="high">High - Major boundary/limit</option>
                    </select>
                  </div>
                  
                  <Button onClick={handleLogBoundary} className="w-full">
                    Log Boundary Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Update Last Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Last Contact Date</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>When did you last hear from them?</Label>
                    <Input
                      type="date"
                      value={lastContactDate}
                      onChange={(e) => setLastContactDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button onClick={handleUpdateContact} className="w-full">
                    Update Contact Date
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Boundary Response Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            How They Typically Respond to Boundaries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {boundaryResponsePatterns.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No boundary events logged yet</h3>
              <p className="text-gray-600 mb-4">
                Start tracking how they respond when you set boundaries
              </p>
              <Button onClick={() => setShowBoundaryDialog(true)}>
                Log First Boundary Event
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {boundaryResponsePatterns.map(({ reaction, count, percentage }) => (
                <div key={reaction} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getReactionColor(reaction)}>
                      {getReactionLabel(reaction)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {count} time{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={percentage} className="w-24 h-2" />
                    <span className="text-sm font-medium w-12">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Boundary Events */}
      {boundaryEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Boundary Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {boundaryEvents
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 5)
                .map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {event.boundaryType.replace('-', ' ')}
                        </Badge>
                        <Badge className={`text-xs ${getReactionColor(event.theirReaction)}`}>
                          {getReactionLabel(event.theirReaction)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.timestamp).toLocaleDateString()} • 
                        {Math.floor((Date.now() - new Date(event.timestamp).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Silence Pattern Warnings */}
      {silenceAnalysis.isInSilencePeriod && !silenceAnalysis.isNormalPattern && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800 mb-1">Extended Silence Period</h4>
                <p className="text-sm text-orange-700">
                  This silence period is longer than their typical pattern. This may indicate:
                </p>
                <ul className="text-sm text-orange-700 mt-2 ml-4 list-disc">
                  <li>They're testing your resolve on the boundary</li>
                  <li>They're processing the boundary change</li>
                  <li>They're giving you the silent treatment as punishment</li>
                  <li>They may be distancing themselves from the relationship</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}