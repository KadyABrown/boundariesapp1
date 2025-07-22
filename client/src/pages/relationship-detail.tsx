import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import RelationshipHealthTracker from "@/components/relationship-health-tracker";
import DealBreakerAlert from "@/components/deal-breaker-alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar, MapPin, User, Settings } from "lucide-react";
import { useParams, Link } from "wouter";

interface RelationshipProfile {
  id: number;
  name: string;
  nickname?: string;
  relationshipType: string;
  relationshipStatus?: string;
  dateMet?: string;
  howMet?: string;
  currentStatus: string;
  isPrivate: boolean;
  shareWithFriends: boolean;
  shareWithTherapist: boolean;
  silentEndNotification: boolean;
  flagVisibility: string;
  enableEmotionalCheckins: boolean;
  supportPrompts: string[];
  importantNotes?: string;
  customTags: string[];
  createdAt: string;
}

export default function RelationshipDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Settings dialog state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsData, setSettingsData] = useState({
    isPrivate: false,
    shareWithFriends: false,
    shareWithTherapist: false,
    silentEndNotification: false,
    flagVisibility: 'private',
    enableEmotionalCheckins: true,
    supportPrompts: [] as string[]
  });

  // Fetch relationship profile
  const { data: profile, isLoading: profileLoading, error } = useQuery<RelationshipProfile>({
    queryKey: [`/api/relationships/${id}`],
    enabled: !!id && isAuthenticated,
  });

  // Initialize settings data when profile loads
  useEffect(() => {
    if (profile) {
      setSettingsData({
        isPrivate: profile.isPrivate || false,
        shareWithFriends: profile.shareWithFriends || false,
        shareWithTherapist: profile.shareWithTherapist || false,
        silentEndNotification: profile.silentEndNotification || false,
        flagVisibility: profile.flagVisibility || 'private',
        enableEmotionalCheckins: profile.enableEmotionalCheckins || true,
        supportPrompts: profile.supportPrompts || []
      });
    }
  }, [profile]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: any) => {
      await apiRequest(`/api/relationships/${id}`, "PATCH", updates);
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your privacy and sharing preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/relationships/${id}`] });
      setSettingsOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle authentication errors
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Handle API errors
  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [error, toast]);

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-32 bg-neutral-200 rounded"></div>
            <div className="h-64 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Relationship Not Found
            </h2>
            <p className="text-neutral-600 mb-6">
              The relationship profile you're looking for doesn't exist or you don't have access to it.
            </p>
            <Link href="/relationships">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Relationships
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/relationships">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Relationships
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-500" />
                  <div>
                    <h1 className="text-2xl font-bold">
                      {profile.nickname || profile.name}
                      {profile.nickname && (
                        <span className="text-lg font-normal text-neutral-500 ml-2">
                          ({profile.name})
                        </span>
                      )}
                    </h1>
                    <p className="text-sm text-neutral-500 capitalize font-normal">
                      {profile.relationshipType} • {profile.currentStatus}
                    </p>
                  </div>
                </div>
                
                {/* Settings Button */}
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Privacy & Sharing Settings</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {/* Privacy Controls */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm">Privacy Controls</h3>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="settings-isPrivate"
                            checked={settingsData.isPrivate}
                            onCheckedChange={(checked) => 
                              setSettingsData(prev => ({ ...prev, isPrivate: checked }))
                            }
                          />
                          <Label htmlFor="settings-isPrivate">Private</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="settings-shareWithFriends"
                            checked={settingsData.shareWithFriends}
                            onCheckedChange={(checked) => 
                              setSettingsData(prev => ({ ...prev, shareWithFriends: checked }))
                            }
                          />
                          <Label htmlFor="settings-shareWithFriends">Share with Trusted Friends</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="settings-shareWithTherapist"
                            checked={settingsData.shareWithTherapist}
                            onCheckedChange={(checked) => 
                              setSettingsData(prev => ({ ...prev, shareWithTherapist: checked }))
                            }
                          />
                          <Label htmlFor="settings-shareWithTherapist">Share with Therapist/Guardian</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="settings-silentEndNotification"
                            checked={settingsData.silentEndNotification}
                            onCheckedChange={(checked) => 
                              setSettingsData(prev => ({ ...prev, silentEndNotification: checked }))
                            }
                          />
                          <Label htmlFor="settings-silentEndNotification">Silently notify shared viewers if this relationship ends</Label>
                        </div>
                        
                        <div>
                          <Label htmlFor="settings-flagVisibility" className="text-sm font-medium">Flag Visibility</Label>
                          <Select 
                            value={settingsData.flagVisibility}
                            onValueChange={(value) => 
                              setSettingsData(prev => ({ ...prev, flagVisibility: value }))
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Private (only me)</SelectItem>
                              <SelectItem value="friends">Friends can see</SelectItem>
                              <SelectItem value="therapist">Therapist can see</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Emotional Tracking */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm">Emotional Tracking</h3>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="settings-enableEmotionalCheckins"
                            checked={settingsData.enableEmotionalCheckins}
                            onCheckedChange={(checked) => 
                              setSettingsData(prev => ({ ...prev, enableEmotionalCheckins: checked }))
                            }
                          />
                          <Label htmlFor="settings-enableEmotionalCheckins">Track emotional check-ins</Label>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Support prompts for:</Label>
                          <div className="space-y-2 mt-2">
                            {[
                              { value: "boundaries", label: "Setting boundaries" },
                              { value: "conversations", label: "Having a hard conversation" },
                              { value: "ending", label: "Ending the relationship" },
                              { value: "journaling", label: "Journaling/self-reflection" }
                            ].map((prompt) => (
                              <div key={prompt.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`settings-${prompt.value}`}
                                  checked={settingsData.supportPrompts.includes(prompt.value)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSettingsData(prev => ({ 
                                        ...prev, 
                                        supportPrompts: [...prev.supportPrompts, prompt.value] 
                                      }));
                                    } else {
                                      setSettingsData(prev => ({ 
                                        ...prev, 
                                        supportPrompts: prev.supportPrompts.filter(p => p !== prompt.value) 
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`settings-${prompt.value}`} className="text-sm">{prompt.label}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => setSettingsOpen(false)}
                        variant="outline" 
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => updateSettingsMutation.mutate(settingsData)}
                        disabled={updateSettingsMutation.isPending}
                        className="flex-1"
                      >
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {profile.dateMet && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span>Met {new Date(profile.dateMet).toLocaleDateString()}</span>
                  </div>
                )}
                {profile.howMet && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span className="capitalize">{profile.howMet.replace('-', ' ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  <span>{profile.isPrivate ? "Private" : "Shared"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Tracking System */}
        {profile && (
          <>
            {/* Deal Breaker Alerts */}
            <DealBreakerAlert 
              relationshipId={profile.id}
              relationshipName={profile.nickname || profile.name}
              showActions={true}
              className="mb-6"
            />
            
            <RelationshipHealthTracker 
              profileId={profile.id} 
              profileName={profile.nickname || profile.name}
            />
          </>
        )}
      </div>
    </div>
  );
}