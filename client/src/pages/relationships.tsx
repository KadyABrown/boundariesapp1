import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Heart, User, Calendar, MapPin, Flag, Brain, Target, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import ComprehensiveInteractionTracker from "@/components/comprehensive-interaction-tracker";
import ComprehensiveInteractionsView from "@/components/comprehensive-interactions-view";
import RelationshipProfileDetail from "@/components/relationship-profile-detail";
import TriggerAnalysisTracker from "@/components/trigger-analysis-tracker";
import CommunicationSilenceTracker from "@/components/communication-silence-tracker";
import RelationshipHealthAnalytics from "@/components/relationship-health-analytics";
import CrossRelationshipComparison from "@/components/cross-relationship-comparison";
import TimePatternAnalysis from "@/components/time-pattern-analysis";

export default function Relationships() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'profile-detail'>('overview');
  const [selectedRelationship, setSelectedRelationship] = useState<any>(null);
  const [trackingMode, setTrackingMode] = useState<'interaction' | 'view-interactions' | 'triggers' | 'patterns' | 'analytics' | 'comparison'>('interaction');
  const [showInteractionTracker, setShowInteractionTracker] = useState(false);
  const [relationshipTriggers, setRelationshipTriggers] = useState<any[]>([]);

  // Redirect to home if not authenticated
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

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["/api/relationships"],
    retry: false,
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      await apiRequest("POST", "/api/relationships", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/relationships"] });
      setIsDialogOpen(false);
      setEditingProfile(null);
      toast({
        title: "Success",
        description: "Relationship profile created successfully",
      });
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
        description: "Failed to create relationship profile",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      await apiRequest("PUT", `/api/relationships/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/relationships"] });
      setIsDialogOpen(false);
      setEditingProfile(null);
      toast({
        title: "Success",
        description: "Relationship profile updated successfully",
      });
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
        description: "Failed to update relationship profile",
        variant: "destructive",
      });
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/relationships/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/relationships"] });
      toast({
        title: "Success",
        description: "Relationship profile deleted successfully",
      });
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
        description: "Failed to delete relationship profile",
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    relationshipType: "",
    relationshipStatus: "",
    dateMet: "",
    howMet: "",
    currentStatus: "active",
    isPrivate: false,
    
    // Privacy & Sharing Controls
    shareWithFriends: false,
    shareWithTherapist: false,
    silentEndNotification: false,
    flagVisibility: "private",
    
    // Emotional Tracking Preferences
    enableEmotionalCheckins: true,
    supportPrompts: [] as string[],
    
    // Notes & Tags
    importantNotes: "",
    customTags: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const profileData = {
      name: formData.name,
      nickname: formData.nickname || null,
      relationshipType: formData.relationshipType,
      relationshipStatus: formData.relationshipStatus || null,
      dateMet: formData.dateMet ? new Date(formData.dateMet) : null,
      howMet: formData.howMet || null,
      currentStatus: formData.currentStatus,
      isPrivate: formData.isPrivate,
      
      // Privacy & Sharing Controls
      shareWithFriends: formData.shareWithFriends,
      shareWithTherapist: formData.shareWithTherapist,
      silentEndNotification: formData.silentEndNotification,
      flagVisibility: formData.flagVisibility,
      
      // Emotional Tracking Preferences
      enableEmotionalCheckins: formData.enableEmotionalCheckins,
      supportPrompts: formData.supportPrompts,
      
      // Notes & Tags
      importantNotes: formData.importantNotes || null,
      customTags: formData.customTags,
    };

    console.log("Submitting profile data:", profileData);

    if (editingProfile) {
      updateProfileMutation.mutate({ id: editingProfile.id, ...profileData });
    } else {
      createProfileMutation.mutate(profileData);
    }
  };

  const openEditDialog = (profile: any) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name || "",
      nickname: profile.nickname || "",
      relationshipType: profile.relationshipType || "",
      relationshipStatus: profile.relationshipStatus || "",
      dateMet: profile.dateMet ? new Date(profile.dateMet).toISOString().split('T')[0] : "",
      howMet: profile.howMet || "",
      currentStatus: profile.currentStatus || "active",
      isPrivate: profile.isPrivate || false,
      
      // Privacy & Sharing Controls
      shareWithFriends: profile.shareWithFriends || false,
      shareWithTherapist: profile.shareWithTherapist || false,
      silentEndNotification: profile.silentEndNotification || false,
      flagVisibility: profile.flagVisibility || "private",
      
      // Emotional Tracking Preferences
      enableEmotionalCheckins: profile.enableEmotionalCheckins !== false,
      supportPrompts: profile.supportPrompts || [],
      
      // Notes & Tags
      importantNotes: profile.importantNotes || "",
      customTags: profile.customTags || [],
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProfile(null);
    setFormData({
      name: "",
      nickname: "",
      relationshipType: "",
      relationshipStatus: "",
      dateMet: "",
      howMet: "",
      currentStatus: "active",
      isPrivate: false,
      
      // Privacy & Sharing Controls
      shareWithFriends: false,
      shareWithTherapist: false,
      silentEndNotification: false,
      flagVisibility: "private",
      
      // Emotional Tracking Preferences
      enableEmotionalCheckins: true,
      supportPrompts: [],
      
      // Notes & Tags
      importantNotes: "",
      customTags: [],
    });
    setIsDialogOpen(true);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setFormData({
        name: "",
        nickname: "",
        relationshipType: "",
        relationshipStatus: "",
        dateMet: "",
        howMet: "",
        currentStatus: "active",
        isPrivate: false,
        
        // Privacy & Sharing Controls
        shareWithFriends: false,
        shareWithTherapist: false,
        silentEndNotification: false,
        flagVisibility: "private",
        
        // Emotional Tracking Preferences
        enableEmotionalCheckins: true,
        supportPrompts: [],
        
        // Notes & Tags
        importantNotes: "",
        customTags: [],
      });
    }
  }, [isDialogOpen]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-sm">B</span>
        </div>
        <p className="text-neutral-600">Loading your relationships...</p>
      </div>
    </div>;
  }

  const relationshipTypeColors: Record<string, string> = {
    "romantic": "bg-red-500",
    "platonic": "bg-blue-500",
    "situationship": "bg-purple-500",
    "family": "bg-green-500",
    "workplace": "bg-orange-500",
    "other": "bg-neutral-500",
  };

  const statusColors: Record<string, string> = {
    "active": "bg-green-100 text-green-700 border-green-200",
    "inactive": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "ended": "bg-neutral-100 text-neutral-700 border-neutral-200",
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Dating Behavior Checklist</h1>
            <p className="text-neutral-600 mt-2">Track and evaluate your romantic connections</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Relationship
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProfile ? "Edit Relationship Profile" : "Create New Relationship Profile"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Their name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nickname">Nickname (Optional)</Label>
                    <Input
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                      placeholder="What you call them"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="relationshipType">Relationship Type</Label>
                    <Select 
                      name="relationshipType" 
                      value={formData.relationshipType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, relationshipType: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="romantic">Romantic</SelectItem>
                        <SelectItem value="platonic">Platonic</SelectItem>
                        <SelectItem value="situationship">Situationship</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="workplace">Workplace</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="relationshipStatus">Relationship Status</Label>
                    <Select 
                      name="relationshipStatus" 
                      value={formData.relationshipStatus} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, relationshipStatus: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interested">Interested</SelectItem>
                        <SelectItem value="mutual-interest">Mutual Interest</SelectItem>
                        <SelectItem value="talking">Talking</SelectItem>
                        <SelectItem value="flirting">Flirting</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="dating">Dating</SelectItem>
                        <SelectItem value="casual-relationship">Relationship - Casual</SelectItem>
                        <SelectItem value="committed-relationship">Relationship - Committed</SelectItem>
                        <SelectItem value="off-and-on">Off & On</SelectItem>
                        <SelectItem value="on-the-rocks">On the Rocks</SelectItem>
                        <SelectItem value="ending-soon">The End is Near</SelectItem>
                        <SelectItem value="over">Over</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentStatus">Activity Status</Label>
                    <Select 
                      name="currentStatus" 
                      value={formData.currentStatus} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currentStatus: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateMet">Date Met (Optional)</Label>
                    <Input
                      id="dateMet"
                      name="dateMet"
                      type="date"
                      value={formData.dateMet}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateMet: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="howMet">How You Met</Label>
                    <Select 
                      name="howMet" 
                      value={formData.howMet} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, howMet: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How did you meet?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="app">Dating App</SelectItem>
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="irl">In Real Life</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="friends">Through Friends</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Privacy & Sharing Controls */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      🔐 Privacy & Sharing Controls
                      <span className="text-xs">Click to expand</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg bg-neutral-50">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isPrivate"
                          checked={formData.isPrivate}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
                        />
                        <Label htmlFor="isPrivate">Private</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="shareWithFriends"
                          checked={formData.shareWithFriends}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithFriends: checked }))}
                        />
                        <Label htmlFor="shareWithFriends">Share with Trusted Friends</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="shareWithTherapist"
                          checked={formData.shareWithTherapist}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, shareWithTherapist: checked }))}
                        />
                        <Label htmlFor="shareWithTherapist">Share with Therapist/Guardian</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="silentEndNotification"
                          checked={formData.silentEndNotification}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, silentEndNotification: checked }))}
                        />
                        <Label htmlFor="silentEndNotification">Silently notify shared viewers if this relationship ends</Label>
                      </div>
                      
                      <div>
                        <Label htmlFor="flagVisibility">Flag Visibility</Label>
                        <Select 
                          name="flagVisibility" 
                          value={formData.flagVisibility} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, flagVisibility: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Who can see red/green flags?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">Private (only me)</SelectItem>
                            <SelectItem value="friends">Friends can see</SelectItem>
                            <SelectItem value="therapist">Therapist can see</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Emotional Tracking Preferences */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      📊 Emotional Tracking Preferences
                      <span className="text-xs">Click to expand</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg bg-neutral-50">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="enableEmotionalCheckins"
                          checked={formData.enableEmotionalCheckins}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableEmotionalCheckins: checked }))}
                        />
                        <Label htmlFor="enableEmotionalCheckins">Track emotional check-ins</Label>
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
                                id={prompt.value}
                                checked={formData.supportPrompts.includes(prompt.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      supportPrompts: [...prev.supportPrompts, prompt.value] 
                                    }));
                                  } else {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      supportPrompts: prev.supportPrompts.filter(p => p !== prompt.value) 
                                    }));
                                  }
                                }}
                              />
                              <Label htmlFor={prompt.value} className="text-sm">{prompt.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Notes & Tags */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      💬 Notes & Tags
                      <span className="text-xs">Click to expand</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg bg-neutral-50">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="importantNotes">What's important about this relationship to you?</Label>
                        <Textarea
                          id="importantNotes"
                          value={formData.importantNotes}
                          onChange={(e) => setFormData(prev => ({ ...prev, importantNotes: e.target.value }))}
                          placeholder="Share your thoughts about this relationship..."
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="customTags">Custom Tags or Labels (Optional)</Label>
                        <Input
                          id="customTags"
                          value={formData.customTags.join(", ")}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            customTags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag) 
                          }))}
                          placeholder="work colleague, gym buddy, college friend (separate with commas)"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex space-x-3">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={createProfileMutation.isPending || updateProfileMutation.isPending}
                  >
                    {editingProfile ? "Update Profile" : "Create Profile"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {profilesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-200 rounded"></div>
                    <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : profiles && profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile: any) => (
              <Card key={profile.id} className="relative cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${relationshipTypeColors[profile.relationshipType] || 'bg-neutral-500'} rounded-full`}></div>
                      <div>
                        <CardTitle className="text-lg">
                          {profile.nickname || profile.name}
                          {profile.nickname && (
                            <span className="text-sm text-neutral-500 font-normal ml-2">({profile.name})</span>
                          )}
                        </CardTitle>
                        <p className="text-sm text-neutral-500 capitalize">
                          {profile.relationshipType}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRelationship(profile);
                          setActiveView('profile-detail');
                        }}
                        title="View Profile & Interactions"
                      >
                        <User className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(profile)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProfileMutation.mutate(profile.id)}
                        disabled={deleteProfileMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.dateMet && (
                      <div className="flex items-center space-x-2 text-sm text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        <span>Met {new Date(profile.dateMet).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {profile.howMet && (
                      <div className="flex items-center space-x-2 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span className="capitalize">{profile.howMet.replace('-', ' ')}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        className={`text-xs font-medium border ${statusColors[profile.currentStatus] || 'bg-neutral-100 text-neutral-700 border-neutral-200'}`}
                      >
                        {profile.currentStatus}
                      </Badge>
                      
                      {profile.isPrivate && (
                        <div className="text-xs text-neutral-500 flex items-center space-x-1">
                          <Flag className="w-3 h-3" />
                          <span>Private</span>
                        </div>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">No Relationships Yet</h3>
              <p className="text-neutral-600 mb-6">
                Start tracking your connections and evaluating relationship patterns
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Relationship
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Advanced Tracking View */}
        {activeView === 'detailed' && selectedRelationship && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Advanced Tracking: {selectedRelationship.name}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Comprehensive relationship analysis and pattern tracking
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveView('overview');
                        setSelectedRelationship(null);
                      }}
                    >
                      ← Back to Overview
                    </Button>
                  </div>

                  {/* Tracking Mode Tabs */}
                  <div className="flex space-x-1 mt-6 bg-white rounded-lg p-1 border">
                    {[
                      { id: 'interaction', label: 'Log Interaction', icon: Brain },
                      { id: 'view-interactions', label: 'View Interactions', icon: Calendar },
                      { id: 'triggers', label: 'Trigger Analysis', icon: Target },
                      { id: 'patterns', label: 'Time Patterns', icon: Clock },
                      { id: 'analytics', label: 'Health Analytics', icon: TrendingUp },
                      { id: 'comparison', label: 'Comparison', icon: BarChart3 }
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setTrackingMode(id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                          trackingMode === id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {trackingMode === 'interaction' && (
                    <ComprehensiveInteractionTracker
                      relationshipId={selectedRelationship.id}
                      relationshipName={selectedRelationship.name}
                      isOpen={true}
                      onClose={() => {
                        setSelectedRelationship(null);
                        setTrackingMode('interaction');
                      }}
                      onSubmit={async (data) => {
                        try {
                          // Map frontend data to database schema
                          const mappedData = {
                            relationshipId: data.relationshipId,
                            
                            // Pre-interaction state
                            preEnergyLevel: data.energyBefore,
                            preAnxietyLevel: data.anxietyBefore,
                            preSelfWorth: data.selfWorthBefore,
                            preMood: data.moodBefore,
                            preWarningSigns: data.emotionalWarningSignsPresent || [],
                            
                            // Interaction context
                            interactionType: data.interactionType,
                            durationMinutes: data.duration,
                            locationSetting: data.location,
                            witnessesPresent: data.witnesses,
                            boundaryTesting: data.boundariesTested,
                            
                            // Post-interaction impact
                            postEnergyLevel: data.energyAfter,
                            postAnxietyLevel: data.anxietyAfter,
                            postSelfWorth: data.selfWorthAfter,
                            physicalSymptoms: data.physicalSymptomsAfter || [],
                            emotionalStates: data.emotionalStateAfter || [],
                            
                            // Recovery analysis
                            recoveryTimeMinutes: data.recoveryTime,
                            recoveryStrategies: data.recoveryStrategies || [],
                            whatHelped: data.whatHelped?.join(', ') || '',
                            whatMadeWorse: data.whatMadeItWorse?.join(', ') || '',
                            supportUsed: data.copingSkillsUsed || [],
                            
                            // Learning and growth
                            warningSignsRecognized: data.warningSignsNoticed || [],
                            boundariesMaintained: data.boundariesMaintained || [],
                            selfAdvocacyActions: data.selfAdvocacyActions || [],
                            lessonsLearned: data.lessonsLearned || '',
                            futureStrategies: data.futurePreparation?.join(', ') || ''
                          };
                          
                          // Save interaction data to backend
                          await apiRequest("POST", "/api/interactions", mappedData);
                          
                          // Close modal and refresh data
                          setSelectedRelationship(null);
                          setTrackingMode('interaction');
                          
                          // Invalidate queries to refresh relationship data
                          queryClient.invalidateQueries({ queryKey: ["/api/relationships"] });
                          
                          toast({
                            title: "Interaction Logged",
                            description: "Your detailed interaction data has been saved for analysis",
                          });
                        } catch (error) {
                          console.error("Error saving interaction:", error);
                          toast({
                            title: "Error",
                            description: "Failed to save interaction data. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    />
                  )}

                  {trackingMode === 'view-interactions' && (
                    <ComprehensiveInteractionsView
                      relationshipId={selectedRelationship.id}
                      relationshipName={selectedRelationship.name}
                    />
                  )}

                  {trackingMode === 'triggers' && (
                    <TriggerAnalysisTracker
                      relationshipId={selectedRelationship.id}
                      relationshipName={selectedRelationship.name}
                      existingTriggers={relationshipTriggers}
                      onUpdateTriggers={(triggers) => {
                        setRelationshipTriggers(triggers);
                        toast({
                          title: "Triggers Updated",
                          description: "Your trigger patterns have been saved successfully.",
                        });
                      }}
                    />
                  )}

                  {trackingMode === 'patterns' && (
                    <TimePatternAnalysis
                      interactions={[]} // This would be loaded from the database
                      relationshipName={selectedRelationship.name}
                    />
                  )}

                  {trackingMode === 'analytics' && (
                    <RelationshipHealthAnalytics
                      interactions={[]} // This would be loaded from the database
                      relationshipName={selectedRelationship.name}
                    />
                  )}

                  {trackingMode === 'comparison' && (
                    <CrossRelationshipComparison
                      relationships={[]} // This would be all relationships with calculated metrics
                      userBaseline={null} // User's personal baseline assessment
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Detail View */}
        {activeView === 'profile-detail' && selectedRelationship && (
          <RelationshipProfileDetail 
            relationship={selectedRelationship}
            onClose={() => {
              setActiveView('overview');
              setSelectedRelationship(null);
            }}
          />
        )}
      </div>
    </div>
  );
}