import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Calendar, Heart, Flag, TrendingUp, MessageSquare, Brain, Plus, Edit2, BarChart3 } from "lucide-react";

import { format } from "date-fns";
import ComprehensiveInteractionsView from "./comprehensive-interactions-view";
import ComprehensiveInteractionTracker from "./comprehensive-interaction-tracker";
import InteractionAnalytics from "./interaction-analytics";
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

  if (!interactions || interactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No interaction data available yet.</p>
        <p className="text-sm mt-2">Use the "Log New" tab to track interactions and see analysis here.</p>
      </div>
    );
  }

  // Calculate simple metrics from interaction data
  const totalInteractions = interactions.length;
  const avgEnergyBefore = interactions.reduce((sum: number, i: any) => sum + (i.preEnergyLevel || 0), 0) / totalInteractions;
  const avgEnergyAfter = interactions.reduce((sum: number, i: any) => sum + (i.postEnergyLevel || 0), 0) / totalInteractions;
  const energyChange = avgEnergyAfter - avgEnergyBefore;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalInteractions}</div>
          <div className="text-sm text-gray-600">Total Interactions</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{avgEnergyBefore.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Avg Energy Before</div>
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
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  
  // Flag form state
  const [flagFormData, setFlagFormData] = useState({
    flagType: 'green',
    category: 'communication',
    behavior: '',
    notes: ''
  });
  const [editingFlagId, setEditingFlagId] = useState<number | null>(null);
  
  const { data: flags, isLoading: flagsLoading } = useQuery({
    queryKey: [`/api/relationships/${relationship.id}/flags`],
    refetchOnWindowFocus: false,
  });

  const { data: checkIns, isLoading: checkInsLoading } = useQuery({
    queryKey: [`/api/relationships/${relationship.id}/check-ins`],
    refetchOnWindowFocus: false,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/relationships/${relationship.id}/stats`],
    refetchOnWindowFocus: false,
  });

  const { data: interactions } = useQuery({
    queryKey: [`/api/interactions/${relationship.id}`],
    refetchOnWindowFocus: false,
  });

  const getHealthScore = () => {
    if (!stats) return 50; // Default to neutral score when no data
    // Use the comprehensive health score if available, otherwise fall back to flag-based calculation
    if ((stats as any).overallHealthScore !== undefined) {
      return (stats as any).overallHealthScore;
    }
    const totalFlags = (stats as any).greenFlags + (stats as any).redFlags;
    if (totalFlags === 0) return 50; // Default to neutral when no flags
    return Math.round(((stats as any).greenFlags / totalFlags) * 100);
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
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-4xl">
                    <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="interactions" className="text-xs sm:text-sm">Interactions</TabsTrigger>
                    <TabsTrigger value="log-new" className="text-xs sm:text-sm">Log New</TabsTrigger>
                    <TabsTrigger value="flags" className="text-xs sm:text-sm">Flags & Check-ins</TabsTrigger>
                    <TabsTrigger value="analysis" className="text-xs sm:text-sm">Analysis</TabsTrigger>
                  </TabsList>

                </div>
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
                            {statsLoading ? "..." : `${getHealthScore()}%`}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Health Score</div>
                          {!statsLoading && (
                            <div className="text-xs text-gray-500 mt-1">
                              {((stats as any)?.greenFlags || 0) + ((stats as any)?.redFlags || 0) === 0 
                                ? "Add flags to calculate"
                                : `Based on ${((stats as any)?.greenFlags || 0) + ((stats as any)?.redFlags || 0)} flags`
                              }
                            </div>
                          )}
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-green-600">
                            {stats?.greenFlags || 0}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Green Flags</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-red-600">
                            {stats?.redFlags || 0}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Red Flags</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-blue-600">
                            {stats?.checkInCount || 0}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">Check-ins</div>
                        </div>
                      </div>
                      {stats?.averageSafetyRating && (
                        <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Average Safety Rating</span>
                            <span className="font-semibold">{stats.averageSafetyRating}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(stats.averageSafetyRating / 10) * 100}%` }}
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
                            {stats.interactionCount > 0 && (
                              <div className="border-t pt-2 text-xs text-gray-600">
                                <div className="flex justify-between">
                                  <span>CIT Interactions:</span>
                                  <span className="font-medium">{stats.interactionCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Energy Impact:</span>
                                  <span className={`font-medium ${stats.energyImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stats.energyImpact >= 0 ? '+' : ''}{stats.energyImpact?.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            )}
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
                        <div className="flex items-center gap-2">
                          <span>Privacy & Sharing</span>
                          <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                        </div>
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Behavioral Flags */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Flag className="w-5 h-5 text-orange-500" />
                            Behavioral Flags
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setShowFlagDialog(true)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Flag
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {flagsLoading ? (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                          </div>
                        ) : flags && flags.length > 0 ? (
                          <div className="space-y-3">
                            {flags.map((flag: any) => {
                              console.log('Flag data:', flag); // Debug log
                              const isGreen = flag.flag_type === 'green';
                              return (
                                <div key={flag.id} className="border rounded-lg p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <Badge 
                                          className={`border ${
                                            isGreen 
                                              ? "bg-green-100 text-green-800 border-green-200" 
                                              : "bg-red-100 text-red-800 border-red-200"
                                          }`}
                                        >
                                          {flag.flag_type} flag
                                        </Badge>
                                        <span className="text-sm text-gray-500">{flag.flag_category}</span>
                                      </div>
                                      <p className="text-sm font-medium mt-1">{flag.flag_name}</p>
                                      {flag.notes && (
                                        <p className="text-xs text-gray-600 mt-1">{flag.notes}</p>
                                      )}
                                    </div>
                                    <div className="flex gap-1 ml-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          // Pre-fill form with flag data for editing
                                          setFlagFormData({
                                            flagType: flag.flag_type,
                                            category: flag.flag_category,
                                            behavior: flag.flag_name,
                                            notes: flag.notes || ''
                                          });
                                          setEditingFlagId(flag.id);
                                          setShowFlagDialog(true);
                                        }}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={async () => {
                                          try {
                                            await apiRequest("DELETE", `/api/relationships/${relationship.id}/flags/${flag.id}`);
                                            queryClient.invalidateQueries({ queryKey: [`/api/relationships/${relationship.id}/flags`] });
                                            queryClient.invalidateQueries({ queryKey: [`/api/relationships/${relationship.id}/stats`] });
                                            toast({
                                              title: "Flag Deleted",
                                              description: "The behavioral flag has been removed.",
                                            });
                                          } catch (error) {
                                            toast({
                                              title: "Error",
                                              description: "Failed to delete flag. Please try again.",
                                              variant: "destructive",
                                            });
                                          }
                                        }}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No flags recorded yet
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Check-ins */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                            Recent Check-ins
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setShowCheckInDialog(true)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Check In
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {checkInsLoading ? (
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                          </div>
                        ) : checkIns && checkIns.length > 0 ? (
                          <div className="space-y-3">
                            {checkIns.slice(0, 5).map((checkIn: any) => (
                              <div key={checkIn.id} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">Safety: {checkIn.safetyRating}/10</p>
                                    <p className="text-xs text-gray-500">
                                      {format(new Date(checkIn.createdAt), 'MMM d, yyyy')}
                                    </p>
                                  </div>
                                  <Badge variant="outline">Check-in</Badge>
                                </div>
                                {checkIn.notes && (
                                  <p className="text-xs text-gray-600 mt-2">{checkIn.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No check-ins recorded yet</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
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
              // Transform form field names to match database schema
              const transformedData = {
                userId: data.userId,
                relationshipId: data.relationshipId,
                
                // Pre-interaction state (form fields -> database fields)
                preEnergyLevel: data.energyBefore,
                preAnxietyLevel: data.anxietyBefore,
                preSelfWorth: data.selfWorthBefore,
                preMood: data.moodBefore,
                preWarningSigns: Array.isArray(data.emotionalWarningSignsPresent) ? data.emotionalWarningSignsPresent : [],
                
                // Interaction context
                interactionType: data.interactionType,
                durationMinutes: data.duration,
                locationSetting: data.location || '',
                witnessesPresent: data.witnesses || false,
                boundaryTesting: data.boundariesTested || false,
                
                // Post-interaction impact
                postEnergyLevel: data.energyAfter,
                postAnxietyLevel: data.anxietyAfter,
                postSelfWorth: data.selfWorthAfter,
                physicalSymptoms: Array.isArray(data.physicalSymptomsAfter) ? data.physicalSymptomsAfter : [],
                emotionalStates: Array.isArray(data.emotionalStateAfter) ? data.emotionalStateAfter : [],
                
                // Recovery analysis
                recoveryTimeMinutes: data.recoveryTime,
                recoveryStrategies: Array.isArray(data.recoveryStrategies) ? data.recoveryStrategies : [],
                whatHelped: Array.isArray(data.whatHelped) ? data.whatHelped.join(', ') : data.whatHelped || '',
                whatMadeWorse: Array.isArray(data.whatMadeItWorse) ? data.whatMadeItWorse.join(', ') : data.whatMadeItWorse || '',
                supportUsed: Array.isArray(data.copingSkillsUsed) ? data.copingSkillsUsed : [],
                
                // Learning and growth
                warningSignsRecognized: Array.isArray(data.warningSignsNoticed) ? data.warningSignsNoticed : [],
                boundariesMaintained: Array.isArray(data.boundariesMaintained) ? data.boundariesMaintained : [],
                selfAdvocacyActions: Array.isArray(data.selfAdvocacyActions) ? data.selfAdvocacyActions : [],
                lessonsLearned: data.lessonsLearned || '',
                futureStrategies: Array.isArray(data.futurePreparation) ? data.futurePreparation.join(', ') : data.futurePreparation || '',
                
                // Compatibility assessment
                communicationQuality: data.communicationQuality,
                communicationIssues: Array.isArray(data.communicationIssues) ? data.communicationIssues : [],
                boundaryViolations: Array.isArray(data.boundaryViolations) ? data.boundaryViolations : [],
                boundariesMet: Array.isArray(data.boundariesMet) ? data.boundariesMet : [],
                emotionalNeedsMet: data.emotionalNeedsMet,
                valuesAlignment: data.valuesAlignment
              };
              
              await apiRequest("POST", "/api/interactions", transformedData);
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

      {/* Flag Creation Dialog */}
      {showFlagDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingFlagId ? 'Edit Behavioral Flag' : 'Add Behavioral Flag'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Flag Type</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={flagFormData.flagType}
                  onChange={(e) => setFlagFormData({...flagFormData, flagType: e.target.value})}
                >
                  <option value="green">Green Flag (Positive)</option>
                  <option value="red">Red Flag (Concerning)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={flagFormData.category}
                  onChange={(e) => setFlagFormData({...flagFormData, category: e.target.value})}
                >
                  <option value="communication">Communication</option>
                  <option value="respect">Respect</option>
                  <option value="trust">Trust & Reliability</option>
                  <option value="emotional">Emotional Consistency</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Behavior Description</label>
                <textarea 
                  className="w-full mt-1 p-2 border rounded-md" 
                  rows={3} 
                  placeholder="Describe the specific behavior you observed..."
                  value={flagFormData.behavior}
                  onChange={(e) => setFlagFormData({...flagFormData, behavior: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                <textarea 
                  className="w-full mt-1 p-2 border rounded-md" 
                  rows={2} 
                  placeholder="Additional context or notes..."
                  value={flagFormData.notes}
                  onChange={(e) => setFlagFormData({...flagFormData, notes: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={() => {
                  setFlagFormData({
                    flagType: 'green',
                    category: 'communication',
                    behavior: '',
                    notes: ''
                  });
                  setEditingFlagId(null);
                  setShowFlagDialog(false);
                }} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={async () => {
                  try {
                    if (!flagFormData.behavior.trim()) {
                      toast({
                        title: "Missing Information",
                        description: "Please describe the behavior before saving.",
                        variant: "destructive",
                      });
                      return;
                    }

                    const flagData = {
                      profileId: relationship.id,
                      flagCategory: flagFormData.category,
                      flagName: flagFormData.behavior,
                      flagType: flagFormData.flagType,
                      isPresent: true,
                      notes: flagFormData.notes || null
                    };

                    if (editingFlagId) {
                      // Update existing flag
                      await apiRequest("PUT", `/api/relationships/${relationship.id}/flags/${editingFlagId}`, flagData);
                      toast({
                        title: "Flag Updated",
                        description: "Behavioral flag has been updated successfully.",
                      });
                    } else {
                      // Create new flag
                      await apiRequest("POST", `/api/relationships/${relationship.id}/flags`, flagData);
                      toast({
                        title: "Flag Added",
                        description: "Behavioral flag has been recorded successfully.",
                      });
                    }
                    
                    // Reset form
                    setFlagFormData({
                      flagType: 'green',
                      category: 'communication',
                      behavior: '',
                      notes: ''
                    });
                    setEditingFlagId(null);
                    setShowFlagDialog(false);
                    
                    // Invalidate queries to refresh data
                    queryClient.invalidateQueries({ queryKey: [`/api/relationships/${relationship.id}/flags`] });
                    queryClient.invalidateQueries({ queryKey: [`/api/relationships/${relationship.id}/stats`] });
                  } catch (error) {
                    console.error("Error saving flag:", error);
                    toast({
                      title: "Error",
                      description: `Failed to ${editingFlagId ? 'update' : 'add'} flag. Please try again.`,
                      variant: "destructive",
                    });
                  }
                }} 
                className="flex-1"
                disabled={!flagFormData.behavior.trim()}
              >
                {editingFlagId ? 'Update Flag' : 'Add Flag'}
              </Button>
            </div>
          </div>
        </div>
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