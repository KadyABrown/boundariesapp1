import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingDown, TrendingUp, Clock, Brain, Heart, Zap, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ComprehensiveInteractionsViewProps {
  relationshipId: number;
  relationshipName: string;
}

interface ComprehensiveInteraction {
  id: number;
  userId: string;
  relationshipId: number;
  createdAt: string;
  preEnergyLevel: number;
  preAnxietyLevel: number;
  preSelfWorth: number;
  preMood: string;
  preWarningSigns: string[];
  interactionType: string;
  durationMinutes: number;
  locationSetting: string;
  witnessesPresent: boolean;
  boundaryTesting: boolean;
  postEnergyLevel: number;
  postAnxietyLevel: number;
  postSelfWorth: number;
  physicalSymptoms: string[];
  emotionalStates: string[];
  recoveryTimeMinutes: number;
  recoveryStrategies: string[];
  whatHelped: string;
  whatMadeWorse: string;
  supportUsed: string[];
  warningSignsRecognized: string[];
  boundariesMaintained: string[];
  selfAdvocacyActions: string[];
  lessonsLearned: string;
  futureStrategies: string;
}

export default function ComprehensiveInteractionsView({ relationshipId, relationshipName }: ComprehensiveInteractionsViewProps) {
  const { data: interactions, isLoading } = useQuery<ComprehensiveInteraction[]>({
    queryKey: ['/api/interactions', relationshipId],
    refetchOnWindowFocus: false,
  });

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'very-positive': return 'bg-green-100 text-green-800';
      case 'positive': return 'bg-blue-100 text-blue-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'negative': return 'bg-orange-100 text-orange-800';
      case 'very-negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnergyChange = (before: number, after: number) => {
    const change = after - before;
    return {
      value: change,
      color: change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600',
      icon: change > 0 ? TrendingUp : change < 0 ? TrendingDown : null
    };
  };

  const getImpactSeverity = (energyChange: number, anxietyChange: number, selfWorthChange: number) => {
    const totalChange = Math.abs(energyChange) + Math.abs(anxietyChange) + Math.abs(selfWorthChange);
    if (totalChange >= 15) return { label: 'High Impact', color: 'bg-red-100 text-red-800' };
    if (totalChange >= 8) return { label: 'Medium Impact', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Low Impact', color: 'bg-green-100 text-green-800' };
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Comprehensive Interactions</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!interactions || interactions.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold">Comprehensive Interactions</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No Interactions Recorded</h4>
          <p className="text-gray-500">
            Use the "Log Interaction" tab to start tracking detailed interaction data with {relationshipName}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-semibold">Comprehensive Interactions</h3>
        <Badge variant="outline">{interactions.length} recorded</Badge>
      </div>

      <div className="space-y-6">
        {interactions.map((interaction) => {
          const energyChange = getEnergyChange(interaction.preEnergyLevel, interaction.postEnergyLevel);
          const anxietyChange = getEnergyChange(interaction.preAnxietyLevel, interaction.postAnxietyLevel);
          const selfWorthChange = getEnergyChange(interaction.preSelfWorth, interaction.postSelfWorth);
          const impactSeverity = getImpactSeverity(
            energyChange.value,
            anxietyChange.value,
            selfWorthChange.value
          );

          return (
            <Card key={interaction.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {interaction.interactionType}
                      <Badge className={impactSeverity.color}>{impactSeverity.label}</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(interaction.createdAt), 'PPP p')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {interaction.durationMinutes}m
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Pre/Post State Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="font-medium text-sm">Energy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{interaction.preEnergyLevel} → {interaction.postEnergyLevel}</span>
                      {energyChange.icon && (
                        <energyChange.icon className={`w-4 h-4 ${energyChange.color}`} />
                      )}
                      <span className={`text-sm font-medium ${energyChange.color}`}>
                        {energyChange.value > 0 ? '+' : ''}{energyChange.value}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-sm">Anxiety</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{interaction.preAnxietyLevel} → {interaction.postAnxietyLevel}</span>
                      {anxietyChange.icon && (
                        <anxietyChange.icon className={`w-4 h-4 ${anxietyChange.color}`} />
                      )}
                      <span className={`text-sm font-medium ${anxietyChange.color}`}>
                        {anxietyChange.value > 0 ? '+' : ''}{anxietyChange.value}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="font-medium text-sm">Self-Worth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{interaction.preSelfWorth} → {interaction.postSelfWorth}</span>
                      {selfWorthChange.icon && (
                        <selfWorthChange.icon className={`w-4 h-4 ${selfWorthChange.color}`} />
                      )}
                      <span className={`text-sm font-medium ${selfWorthChange.color}`}>
                        {selfWorthChange.value > 0 ? '+' : ''}{selfWorthChange.value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mood & Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm text-gray-700 mb-2">Pre-Interaction Mood</h5>
                    <Badge className={getMoodColor(interaction.preMood)}>
                      {interaction.preMood?.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-gray-700 mb-2">Recovery Time</h5>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{interaction.recoveryTimeMinutes} minutes</span>
                    </div>
                  </div>
                </div>

                {/* Warning Signs & Symptoms */}
                {(interaction.preWarningSigns?.length > 0 || interaction.physicalSymptoms?.length > 0) && (
                  <div className="space-y-3">
                    {interaction.preWarningSigns?.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Warning Signs Present</h5>
                        <div className="flex flex-wrap gap-1">
                          {interaction.preWarningSigns.map((sign, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {sign}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {interaction.physicalSymptoms?.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Physical Symptoms After</h5>
                        <div className="flex flex-wrap gap-1">
                          {interaction.physicalSymptoms.map((symptom, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Recovery & Learning */}
                {(interaction.recoveryStrategies?.length > 0 || interaction.lessonsLearned) && (
                  <div className="space-y-3 pt-3 border-t">
                    {interaction.recoveryStrategies?.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Recovery Strategies Used</h5>
                        <div className="flex flex-wrap gap-1">
                          {interaction.recoveryStrategies.map((strategy, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {strategy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {interaction.lessonsLearned && (
                      <div>
                        <h5 className="font-medium text-sm text-gray-700 mb-2">Lessons Learned</h5>
                        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          {interaction.lessonsLearned}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Boundary Testing Alert */}
                {interaction.boundaryTesting && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Boundary Testing Detected</span>
                    </div>
                    <p className="text-xs text-orange-700 mt-1">
                      This interaction involved boundary testing behavior that may require attention.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}