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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Heart, User, Calendar, MapPin, Flag } from "lucide-react";

export default function Relationships() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);

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
    dateMet: "",
    howMet: "",
    currentStatus: "active",
    isPrivate: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const profileData = {
      name: formData.name,
      nickname: formData.nickname || null,
      relationshipType: formData.relationshipType,
      dateMet: formData.dateMet ? new Date(formData.dateMet) : null,
      howMet: formData.howMet || null,
      currentStatus: formData.currentStatus,
      isPrivate: formData.isPrivate,
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
      dateMet: profile.dateMet ? new Date(profile.dateMet).toISOString().split('T')[0] : "",
      howMet: profile.howMet || "",
      currentStatus: profile.currentStatus || "active",
      isPrivate: profile.isPrivate || false,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingProfile(null);
    setFormData({
      name: "",
      nickname: "",
      relationshipType: "",
      dateMet: "",
      howMet: "",
      currentStatus: "active",
      isPrivate: false,
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
        dateMet: "",
        howMet: "",
        currentStatus: "active",
        isPrivate: false,
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProfile ? "Edit Relationship Profile" : "Create New Relationship Profile"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currentStatus">Current Status</Label>
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPrivate"
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
                  />
                  <Label htmlFor="isPrivate">Keep this profile private</Label>
                </div>

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
                    
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => window.location.href = `/relationships/${profile.id}`}
                    >
                      View Details
                    </Button>
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
      </div>
    </div>
  );
}