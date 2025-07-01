import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Shield, Bell, Users, Heart } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImageUrl?: string;
  userRole: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    dailyReminders?: boolean;
    weeklyReports?: boolean;
    flagAlerts?: boolean;
  };
  defaultPrivacySetting: string;
  bio?: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProfileStats {
  totalRelationships: number;
  activeBoundaries: number;
  weeklyEntries: number;
  sharedProfiles: number;
}

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for profile editing
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    bio: "",
    userRole: "standard",
    defaultPrivacySetting: "private",
    notificationPreferences: {
      email: true,
      push: false,
      dailyReminders: true,
      weeklyReports: true,
      flagAlerts: true
    }
  });

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated,
  });

  // Fetch profile statistics
  const { data: stats } = useQuery<ProfileStats>({
    queryKey: ["/api/profile/stats"],
    enabled: isAuthenticated,
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        username: profile.username || "",
        phoneNumber: (profile as any).phoneNumber || "",
        bio: profile.bio || "",
        userRole: profile.userRole || "standard",
        defaultPrivacySetting: profile.defaultPrivacySetting || "private",
        notificationPreferences: {
          email: profile.notificationPreferences?.email ?? true,
          push: profile.notificationPreferences?.push ?? false,
          dailyReminders: (profile.notificationPreferences as any)?.dailyReminders ?? true,
          weeklyReports: (profile.notificationPreferences as any)?.weeklyReports ?? true,
          flagAlerts: (profile.notificationPreferences as any)?.flagAlerts ?? true
        }
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      await apiRequest("PATCH", "/api/profile", updates);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
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
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle authentication redirect
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

  const handleSaveProfile = () => {
    console.log("Saving profile with data:", profileData);
    updateProfileMutation.mutate(profileData);
  };

  const getUserInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    } else if (profile?.email) {
      return profile.email[0].toUpperCase();
    }
    return "U";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "therapist": return "bg-blue-100 text-blue-800";
      case "guardian": return "bg-green-100 text-green-800";
      case "minor": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile?.profileImageUrl} alt="Profile" />
                <AvatarFallback className="text-lg font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">
                    {profile?.firstName && profile?.lastName 
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile?.username || "User Profile"
                    }
                  </h1>
                  <Badge className={getRoleBadgeColor(profile?.userRole || "standard")}>
                    {(profile?.userRole || "standard").charAt(0).toUpperCase() + (profile?.userRole || "standard").slice(1)}
                  </Badge>
                </div>
                <p className="text-neutral-600">{profile?.email}</p>
                {profile?.username && (
                  <p className="text-sm text-neutral-500">@{profile.username}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-500">Member since</p>
                <p className="text-sm font-medium">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.totalRelationships}</p>
                <p className="text-sm text-neutral-600">Relationships</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.activeBoundaries}</p>
                <p className="text-sm text-neutral-600">Active Boundaries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Settings className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.weeklyEntries}</p>
                <p className="text-sm text-neutral-600">This Week</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.sharedProfiles}</p>
                <p className="text-sm text-neutral-600">Shared Profiles</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Management Tabs */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Sharing</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Choose a unique username"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    This will be used for sharing profiles with others
                  </p>
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Allows friends to find you by phone number
                  </p>
                </div>

                <div>
                  <Label htmlFor="userRole">Account Type</Label>
                  <Select 
                    value={profileData.userRole}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, userRole: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard User</SelectItem>
                      <SelectItem value="therapist">Therapist</SelectItem>
                      <SelectItem value="guardian">Parent/Guardian</SelectItem>
                      <SelectItem value="minor">Minor (Under 18)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell others about yourself..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="w-full"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-neutral-500">
                        Receive updates about your relationships and boundaries
                      </p>
                    </div>
                    <Switch
                      checked={profileData.notificationPreferences.email}
                      onCheckedChange={(checked) => 
                        setProfileData(prev => ({ 
                          ...prev, 
                          notificationPreferences: { ...prev.notificationPreferences, email: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-neutral-500">
                        Get notified about important updates
                      </p>
                    </div>
                    <Switch
                      checked={profileData.notificationPreferences.push}
                      onCheckedChange={(checked) => 
                        setProfileData(prev => ({ 
                          ...prev, 
                          notificationPreferences: { ...prev.notificationPreferences, push: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* App Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    App Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Daily Check-in Reminders</Label>
                      <p className="text-sm text-neutral-500">
                        Get reminded to log your boundary experiences
                      </p>
                    </div>
                    <Switch
                      checked={profileData.notificationPreferences.dailyReminders !== false}
                      onCheckedChange={(checked) => 
                        setProfileData(prev => ({ 
                          ...prev, 
                          notificationPreferences: { ...prev.notificationPreferences, dailyReminders: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Progress Reports</Label>
                      <p className="text-sm text-neutral-500">
                        Receive weekly summaries of your boundary tracking
                      </p>
                    </div>
                    <Switch
                      checked={profileData.notificationPreferences.weeklyReports !== false}
                      onCheckedChange={(checked) => 
                        setProfileData(prev => ({ 
                          ...prev, 
                          notificationPreferences: { ...prev.notificationPreferences, weeklyReports: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Relationship Flag Alerts</Label>
                      <p className="text-sm text-neutral-500">
                        Get notified when red flags are detected in relationships
                      </p>
                    </div>
                    <Switch
                      checked={profileData.notificationPreferences.flagAlerts !== false}
                      onCheckedChange={(checked) => 
                        setProfileData(prev => ({ 
                          ...prev, 
                          notificationPreferences: { ...prev.notificationPreferences, flagAlerts: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Data & Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Export Your Data</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Download all your boundary entries, relationships, and progress data as a CSV file.
                    </p>
                    <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
                      Download Data Export
                    </Button>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Account Deletion</h4>
                    <p className="text-sm text-orange-800 mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                className="w-full"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save All Preferences"}
              </Button>
            </div>
          </TabsContent>

          {/* Privacy & Sharing Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Sharing Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Privacy Setting for New Relationships</Label>
                  <Select 
                    value={profileData.defaultPrivacySetting}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, defaultPrivacySetting: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private (Only me)</SelectItem>
                      <SelectItem value="friends_only">Friends Only</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-500 mt-1">
                    This setting will be used as default for new relationships you create
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Data Sharing Overview</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your relationship data is encrypted and secure</li>
                    <li>• You control who can see each relationship profile</li>
                    <li>• Therapists and guardians can only see what you explicitly share</li>
                    <li>• You can revoke access at any time</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="w-full"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Privacy Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}