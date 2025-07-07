import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Shield, CreditCard, User, Trash2 } from "lucide-react";
import SubscriptionManagement from "@/components/subscription-management";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    dailyReminders: true,
    weeklyReports: true,
    flagAlerts: true
  });

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    defaultPrivacySetting: "friends",
    profileVisibility: "public",
    dataSharing: false
  });

  // Save notification preferences
  const saveNotificationsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/user/notifications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      });
    },
  });

  // Save privacy settings
  const savePrivacyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/user/privacy", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Privacy settings updated",
        description: "Your privacy settings have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update privacy settings.",
        variant: "destructive",
      });
    },
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    saveNotificationsMutation.mutate(updated);
  };

  const handlePrivacyChange = (key: string, value: any) => {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    savePrivacyMutation.mutate(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and privacy settings</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive important updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-reminders" className="text-base font-medium">Daily Reminders</Label>
                    <p className="text-sm text-gray-600">Get daily reminders to check in on your boundaries</p>
                  </div>
                  <Switch
                    id="daily-reminders"
                    checked={notifications.dailyReminders}
                    onCheckedChange={(checked) => handleNotificationChange("dailyReminders", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports" className="text-base font-medium">Weekly Reports</Label>
                    <p className="text-sm text-gray-600">Receive weekly boundary health summaries</p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="flag-alerts" className="text-base font-medium">Flag Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified when patterns suggest potential red flags</p>
                  </div>
                  <Switch
                    id="flag-alerts"
                    checked={notifications.flagAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("flagAlerts", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="default-privacy" className="text-base font-medium">Default Privacy Setting</Label>
                  <p className="text-sm text-gray-600 mb-3">Who can see your new relationship profiles by default</p>
                  <select
                    id="default-privacy"
                    value={privacy.defaultPrivacySetting}
                    onChange={(e) => handlePrivacyChange("defaultPrivacySetting", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="private">Private (Only me)</option>
                    <option value="friends">Friends only</option>
                    <option value="close-friends">Close friends only</option>
                    <option value="therapist">Include therapist/professional</option>
                  </select>
                </div>
                
                <Separator />
                
                <div>
                  <Label htmlFor="profile-visibility" className="text-base font-medium">Profile Visibility</Label>
                  <p className="text-sm text-gray-600 mb-3">Who can find and view your profile</p>
                  <select
                    id="profile-visibility"
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing" className="text-base font-medium">Anonymous Data Sharing</Label>
                    <p className="text-sm text-gray-600">Help improve BoundarySpace by sharing anonymous usage data</p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => handlePrivacyChange("dataSharing", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SubscriptionManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={user?.username || ""}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start gap-3">
                      <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-800">Delete Account</h4>
                        <p className="text-sm text-red-700 mb-3">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}