import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Calendar, Heart, Flag, TrendingUp, MessageSquare, Brain, Plus, Edit2 } from "lucide-react";
import { format } from "date-fns";
import ComprehensiveInteractionsView from "./comprehensive-interactions-view";
import ComprehensiveInteractionTracker from "./comprehensive-interaction-tracker";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Simple analysis component to show CIT data insights
function InteractionAnalysis({ relationshipId }: { relationshipId: number }) {
  const { data: interactions, isLoading } = useQuery({
    queryKey: ['/api/interactions', relationshipId],
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Loading analysis...</div>;
  }

  if (!interactions || !Array.isArray(interactions) || interactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No interaction data available yet.</p>
        <p className="text-sm mt-2">Use the "Log New" tab to track interactions and see analysis here.</p>
      </div>
    );
  }

  // Calculate comprehensive health metrics from interaction data
  const totalInteractions = interactions.length;
  const avgEnergyBefore = interactions.reduce((sum: number, i: any) => sum + (i.preEnergyLevel || 0), 0) / totalInteractions;
  const avgEnergyAfter = interactions.reduce((sum: number, i: any) => sum + (i.postEnergyLevel || 0), 0) / totalInteractions;
  const energyChange = avgEnergyAfter - avgEnergyBefore;
  
  const avgAnxietyBefore = interactions.reduce((sum: number, i: any) => sum + (i.preAnxietyLevel || 0), 0) / totalInteractions;
  const avgAnxietyAfter = interactions.reduce((sum: number, i: any) => sum + (i.postAnxietyLevel || 0), 0) / totalInteractions;
  const anxietyChange = avgAnxietyAfter - avgAnxietyBefore;
  
  const avgSelfWorthBefore = interactions.reduce((sum: number, i: any) => sum + (i.preSelfWorth || 0), 0) / totalInteractions;
  const avgSelfWorthAfter = interactions.reduce((sum: number, i: any) => sum + (i.postSelfWorth || 0), 0) / totalInteractions;
  const selfWorthChange = avgSelfWorthAfter - avgSelfWorthBefore;
  
  const avgRecoveryTime = interactions.reduce((sum: number, i: any) => sum + (i.recoveryTimeMinutes || 0), 0) / totalInteractions;
  
  // Calculate overall health score (0-100)
  const healthScore = Math.round(
    ((energyChange + 10) / 20) * 25 + // Energy impact (25%)
    ((10 - anxietyChange) / 20) * 25 + // Anxiety impact (25%)
    ((selfWorthChange + 10) / 20) * 25 + // Self-worth impact (25%)
    (Math.max(0, (120 - avgRecoveryTime)) / 120) * 25 // Recovery time (25%)
  );

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Relationship Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-4xl font-bold ${healthScore >= 70 ? 'text-green-600' : healthScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
              {healthScore}%
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Based on {totalInteractions} interaction{totalInteractions !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalInteractions}</div>
          <div className="text-sm text-gray-600">Total Interactions</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className={`text-2xl font-bold ${energyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {energyChange > 0 ? '+' : ''}{energyChange.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Avg Energy Impact</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className={`text-2xl font-bold ${anxietyChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {anxietyChange > 0 ? '+' : ''}{anxietyChange.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Avg Anxiety Impact</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{Math.round(avgRecoveryTime)}</div>
          <div className="text-sm text-gray-600">Avg Recovery (min)</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className={`text-2xl font-bold ${energyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {energyChange >= 0 ? '+' : ''}{energyChange.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Avg Energy Impact</div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <p><strong>Recent Interactions:</strong></p>
        {interactions.slice(0, 3).map((interaction: any) => (
          <div key={interaction.id} className="border-l-2 border-blue-200 pl-3 mt-2">
            <p className="font-medium">{interaction.interactionType}</p>
            <p className="text-xs text-gray-500">{new Date(interaction.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RelationshipProfileDetailProps {
  relationship: any;
  onClose: () => void;
}

export default function RelationshipProfileDetail({ relationship, onClose }: RelationshipProfileDetailProps) {
  const { toast } = useToast();
  const [showCIT, setShowCIT] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  
  const { data: flags, isLoading: flagsLoading } = useQuery({
    queryKey: ['/api/relationships', relationship.id, 'flags'],
    refetchOnWindowFocus: false,
  });

  const { data: checkIns, isLoading: checkInsLoading } = useQuery({
    queryKey: ['/api/relationships', relationship.id, 'check-ins'],
    refetchOnWindowFocus: false,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/relationships', relationship.id, 'stats'],
    refetchOnWindowFocus: false,
  });

  const getHealthScore = () => {
    if (!stats || typeof stats !== 'object') return 0;
    const greenFlags = (stats as any).greenFlags || 0;
    const redFlags = (stats as any).redFlags || 0;
    const totalFlags = greenFlags + redFlags;
    if (totalFlags === 0) return 0;
    return Math.round((greenFlags / totalFlags) * 100);
  };

  const getHealthColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const relationshipTypeColors: { [key: string]: string } = {
    'romantic-partner': 'bg-pink-500',
    'dating': 'bg-red-500',
    'friend': 'bg-blue-500',
    'family': 'bg-green-500',
    'work': 'bg-purple-500',
    'acquaintance': 'bg-gray-500',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 ${relationshipTypeColors[relationship.relationshipType] || 'bg-gray-500'} rounded-full`}></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {relationship.nickname || relationship.name}
                    {relationship.nickname && (
                      <span className="text-lg text-gray-500 font-normal ml-2">({relationship.name})</span>
                    )}
                  </h2>
                  <p className="text-gray-600 capitalize">
                    {relationship.relationshipType} • {relationship.relationshipStatus}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="overview" className="h-full flex flex-col">
              <div className="px-6 pt-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  <TabsTrigger value="log-new">Log New</TabsTrigger>
                  <TabsTrigger value="flags">Flags & Check-ins</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="p-6 space-y-6">
                  {/* Health Metrics - Prominent Display */}
                  <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Relationship Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className={`text-3xl font-bold ${getHealthColor(getHealthScore())}`}>
                            {getHealthScore()}%
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Health Score</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-green-600">
                            {(stats as any)?.greenFlags || 0}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Green Flags</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-red-600">
                            {(stats as any)?.redFlags || 0}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Red Flags</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-blue-600">
                            {(stats as any)?.checkInCount || 0}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Check-ins</div>
                        </div>
                      </div>
                      {(stats as any)?.averageSafetyRating && (
                        <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Average Safety Rating</span>
                            <span className="font-semibold">{(stats as any).averageSafetyRating}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${((stats as any).averageSafetyRating / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-pink-500" />
                          Relationship Info
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <p className="text-gray-800 capitalize">{relationship.relationshipStatus}</p>
                        </div>
                        {relationship.dateMet && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Date Met</label>
                            <p className="text-gray-800">{format(new Date(relationship.dateMet), 'PPP')}</p>
                          </div>
                        )}
                        {relationship.location && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Location</label>
                            <p className="text-gray-800">{relationship.location}</p>
                          </div>
                        )}
                        {relationship.contactFrequency && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Contact Frequency</label>
                            <p className="text-gray-800">{relationship.contactFrequency}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-500" />
                          Health Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {statsLoading ? (
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ) : stats ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Health Score</span>
                              <Badge className={getHealthColor(getHealthScore())}>
                                {getHealthScore()}%
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.greenFlags}</div>
                                <div className="text-gray-500">Green Flags</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">{stats.redFlags}</div>
                                <div className="text-gray-500">Red Flags</div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{stats.checkInCount}</div>
                              <div className="text-gray-500 text-sm">Check-ins</div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500">No data available</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Description */}
                  {relationship.description && (
                    <Card>
                      <CardHeader>
                        <CardTitle>About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{relationship.description}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Privacy Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Privacy & Sharing</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowSettingsDialog(true)}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <label className="font-medium text-gray-600">Friend Sharing</label>
                          <p className="text-gray-800">{relationship.shareWithFriends ? 'Enabled' : 'Disabled'}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-600">Therapist Sharing</label>
                          <p className="text-gray-800">{relationship.shareWithTherapist ? 'Enabled' : 'Disabled'}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-600">Silent Notifications</label>
                          <p className="text-gray-800">{relationship.silentNotifications ? 'Enabled' : 'Disabled'}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-600">Flag Visibility</label>
                          <p className="text-gray-800">{relationship.hideFlagsFromSummary ? 'Hidden' : 'Visible'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="interactions" className="p-0">
                  <ComprehensiveInteractionsView
                    relationshipId={relationship.id}
                    relationshipName={relationship.name}
                  />
                </TabsContent>

                <TabsContent value="log-new" className="p-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">Log New Interaction</h3>
                      <p className="text-gray-600">Track your interaction with {relationship.name}</p>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        // Open the CIT modal
                        setShowCIT(true);
                      }}
                      className="w-full h-16 text-lg"
                    >
                      <Brain className="w-6 h-6 mr-3" />
                      Start Comprehensive Interaction Tracker
                    </Button>
                    
                    <div className="text-sm text-gray-500 space-y-2">
                      <p><strong>What you'll track:</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Energy and mood before/after</li>
                        <li>Physical and emotional impacts</li>
                        <li>Recovery time and strategies</li>
                        <li>Boundaries and self-advocacy</li>
                        <li>Lessons learned and future planning</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="flags" className="p-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        Baseline Compatibility Health Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Get CIT interactions for this relationship
                        const { data: interactions } = useQuery({
                          queryKey: ['/api/interactions', relationship.id],
                          refetchOnWindowFocus: false,
                        });
                        
                        if (!interactions || interactions.length === 0) {
                          return (
                            <div className="text-center py-8">
                              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                              <h3 className="text-lg font-semibold mb-2">No Interaction Data Yet</h3>
                              <p className="text-gray-600 mb-4">
                                Use the Comprehensive Interaction Tracker to start analyzing compatibility with your baseline values.
                              </p>
                              <Button onClick={() => setShowCIT(true)} className="mt-4">
                                Start First CIT Session
                              </Button>
                            </div>
                          );
                        }
                        
                        // Calculate health metrics from CIT data
                        const totalInteractions = interactions.length;
                        const communicationRespected = interactions.filter((i: any) => i.communicationStyleRespected).length;
                        const boundariesRespected = interactions.filter((i: any) => i.boundariesRespected).length;
                        const triggersAvoided = interactions.filter((i: any) => i.triggersAvoided).length;
                        const valuesAligned = interactions.filter((i: any) => i.coreValuesAligned).length;
                        const dealBreakers = interactions.filter((i: any) => i.dealBreakersPresent).length;
                        
                        const avgEnergyChange = interactions.reduce((sum: number, i: any) => 
                          sum + ((i.energyAfter || 5) - (i.energyBefore || 5)), 0) / totalInteractions;
                        const avgSelfWorthChange = interactions.reduce((sum: number, i: any) => 
                          sum + ((i.selfWorthAfter || 5) - (i.selfWorthBefore || 5)), 0) / totalInteractions;
                        
                        // Calculate overall health score based on baseline compatibility
                        const healthScore = Math.round(
                          ((communicationRespected / totalInteractions) * 20) +
                          ((boundariesRespected / totalInteractions) * 25) +
                          ((triggersAvoided / totalInteractions) * 20) +
                          ((valuesAligned / totalInteractions) * 15) +
                          (Math.max(0, (5 + avgEnergyChange) / 10) * 10) +
                          (Math.max(0, (5 + avgSelfWorthChange) / 10) * 10) -
                          ((dealBreakers / totalInteractions) * 25)
                        );
                        
                        const finalScore = Math.max(0, Math.min(100, healthScore));
                        
                        return (
                          <div className="space-y-6">
                            <div className="text-center">
                              <div className="text-4xl font-bold mb-2 text-blue-600">
                                {finalScore}%
                              </div>
                              <Badge 
                                variant={finalScore >= 80 ? 'default' : finalScore >= 60 ? 'secondary' : 'destructive'}
                                className="text-sm"
                              >
                                {finalScore >= 80 ? 'Highly Compatible with Your Baseline' : 
                                 finalScore >= 60 ? 'Moderately Compatible' : 
                                 finalScore >= 40 ? 'Some Compatibility Issues' : 'Low Baseline Compatibility'}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-2">
                                Based on {totalInteractions} interaction{totalInteractions !== 1 ? 's' : ''}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Communication Respected:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${(communicationRespected / totalInteractions) * 100}%` }}
                                      />
                                    </div>
                                    <span className="font-medium w-8">{Math.round((communicationRespected / totalInteractions) * 100)}%</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Boundaries Respected:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${(boundariesRespected / totalInteractions) * 100}%` }}
                                      />
                                    </div>
                                    <span className="font-medium w-8">{Math.round((boundariesRespected / totalInteractions) * 100)}%</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Triggers Avoided:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-yellow-500 h-2 rounded-full"
                                        style={{ width: `${(triggersAvoided / totalInteractions) * 100}%` }}
                                      />
                                    </div>
                                    <span className="font-medium w-8">{Math.round((triggersAvoided / totalInteractions) * 100)}%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Values Aligned:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: `${(valuesAligned / totalInteractions) * 100}%` }}
                                      />
                                    </div>
                                    <span className="font-medium w-8">{Math.round((valuesAligned / totalInteractions) * 100)}%</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Avg Energy Impact:</span>
                                  <span className={`font-medium ${avgEnergyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {avgEnergyChange >= 0 ? '+' : ''}{avgEnergyChange.toFixed(1)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Avg Self-Worth Impact:</span>
                                  <span className={`font-medium ${avgSelfWorthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {avgSelfWorthChange >= 0 ? '+' : ''}{avgSelfWorthChange.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {dealBreakers > 0 && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-5 h-5 text-red-600" />
                                  <span className="text-sm font-medium text-red-800">
                                    Deal-breakers present in {dealBreakers} of {totalInteractions} interactions
                                  </span>
                                </div>
                                <p className="text-xs text-red-700 mt-1">
                                  This indicates serious compatibility issues that need immediate attention.
                                </p>
                              </div>
                            )}
                            
                            {finalScore < 60 && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                  <span className="text-sm font-medium text-yellow-800">
                                    Low baseline compatibility detected
                                  </span>
                                </div>
                                <p className="text-xs text-yellow-700 mt-1">
                                  Consider discussing your core needs and boundaries with {relationship.name}.
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="p-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-500" />
                          Interaction Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <InteractionAnalysis relationshipId={relationship.id} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* CIT Modal */}
      {showCIT && (
        <ComprehensiveInteractionTracker
          relationshipId={relationship.id}
          relationshipName={relationship.name}
          isOpen={showCIT}
          onClose={() => setShowCIT(false)}
          onSubmit={async (data: any) => {
            try {
              await apiRequest("POST", "/api/interactions", data);
              queryClient.invalidateQueries({ queryKey: ['/api/interactions', relationship.id] });
              setShowCIT(false);
              toast({
                title: "Interaction Logged",
                description: "Your interaction has been saved successfully. View it in the Interactions tab.",
              });
            } catch (error) {
              console.error("Error saving interaction:", error);
              toast({
                title: "Error",
                description: "Failed to save interaction. Please try again.",
                variant: "destructive",
              });
            }
          }}
        />
      )}



      {/* Simple Check-in Dialog */}
      {showCheckInDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Emotional Check-in</h3>
            <p className="text-gray-600 mb-4">
              Quick check-in interface coming soon. For now, use the Comprehensive Interaction Tracker to log detailed emotional states before and after interactions.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowCheckInDialog(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Settings Dialog */}
      {showSettingsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Privacy Settings</h3>
            <p className="text-gray-600 mb-4">
              Privacy settings editor coming soon. For now, these settings can be modified when creating or editing the relationship profile.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowSettingsDialog(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}