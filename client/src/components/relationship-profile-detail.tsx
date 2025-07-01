import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Calendar, Heart, Flag, TrendingUp, MessageSquare, Brain } from "lucide-react";
import { format } from "date-fns";
import ComprehensiveInteractionsView from "./comprehensive-interactions-view";

interface RelationshipProfileDetailProps {
  relationship: any;
  onClose: () => void;
}

export default function RelationshipProfileDetail({ relationship, onClose }: RelationshipProfileDetailProps) {
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
    if (!stats) return 0;
    const totalFlags = stats.greenFlags + stats.redFlags;
    if (totalFlags === 0) return 0;
    return Math.round((stats.greenFlags / totalFlags) * 100);
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  <TabsTrigger value="flags">Flags & Check-ins</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="p-6 space-y-6">
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
                      <CardTitle>Privacy & Sharing</CardTitle>
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

                <TabsContent value="flags" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Behavioral Flags */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Flag className="w-5 h-5 text-orange-500" />
                          Behavioral Flags
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
                            {flags.map((flag: any) => (
                              <div key={flag.id} className="border rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant={flag.flagType === 'green' ? 'default' : 'destructive'}>
                                        {flag.flagType} flag
                                      </Badge>
                                      <span className="text-sm text-gray-500">{flag.category}</span>
                                    </div>
                                    <p className="text-sm font-medium mt-1">{flag.behavior}</p>
                                    {flag.notes && (
                                      <p className="text-xs text-gray-600 mt-1">{flag.notes}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No flags recorded yet</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Check-ins */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-blue-500" />
                          Recent Check-ins
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        Relationship Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 text-center py-8">
                        Advanced analysis features coming soon. This will include pattern recognition, 
                        trigger analysis, and personalized insights based on your interactions.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}