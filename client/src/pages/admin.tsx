import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, DollarSign, TrendingUp, Search, Trash2, UserCheck, Activity, Calendar, AlertTriangle, Eye, MessageSquare, Settings, BarChart3, RefreshCw, UserPlus } from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userNote, setUserNote] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });

  // Check if user is admin
  if (!user || (user as any)?.email !== "hello@roxzmedia.com") {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-neutral-600">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch all users
  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
  });

  // Create premium user mutation
  const createPremiumUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("POST", "/api/admin/create-premium-user", userData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Premium User Created",
        description: `Successfully created premium account for ${newUserData.email}`,
      });
      setShowCreateUserDialog(false);
      setNewUserData({ email: "", firstName: "", lastName: "", phoneNumber: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create User",
        description: error.message || "An error occurred while creating the user",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  // Filter users based on search and filter type
  const filteredUsers = allUsers ? (allUsers as any[]).filter((user: any) => {
    const matchesSearch = !searchTerm || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
      (filterType === "premium" && user.subscriptionStatus === "active") ||
      (filterType === "free" && user.subscriptionStatus !== "active");
    
    return matchesSearch && matchesFilter;
  }) : [];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>
          <p className="text-neutral-600 mt-2">Manage users and monitor platform metrics</p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-8 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-6 bg-neutral-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Total Users</p>
                    <p className="text-2xl font-bold text-neutral-900">{(stats as any)?.totalUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Premium Users</p>
                    <p className="text-2xl font-bold text-neutral-900">{(stats as any)?.premiumUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-neutral-900">${((stats as any)?.premiumUsers || 0) * 12.99}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-600">Growth Rate</p>
                    <p className="text-2xl font-bold text-neutral-900">{(stats as any)?.growthRate || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="churn">Churn</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-neutral-600">Active Users (7d)</p>
                      <p className="text-2xl font-bold text-neutral-900">{(stats as any)?.activeUsers7d || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-neutral-600">At Risk Users</p>
                      <p className="text-2xl font-bold text-neutral-900">{(stats as any)?.atRiskUsers || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <RefreshCw className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-neutral-600">Churn Rate</p>
                      <p className="text-2xl font-bold text-neutral-900">{(stats as any)?.churnRate || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-neutral-600">Avg Session</p>
                      <p className="text-2xl font-bold text-neutral-900">{(stats as any)?.avgSessionLength || 0}m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab - Enhanced User Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>User Management & Profile Drill-Down</CardTitle>
                  <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Create Premium User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create Premium User Account</DialogTitle>
                        <p className="text-sm text-neutral-600">
                          Create a new user account with immediate premium access. This bypasses the subscription flow.
                        </p>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              placeholder="John"
                              value={newUserData.firstName}
                              onChange={(e) => setNewUserData(prev => ({ ...prev, firstName: e.target.value }))}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              value={newUserData.lastName}
                              onChange={(e) => setNewUserData(prev => ({ ...prev, lastName: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            placeholder="+1 (555) 123-4567"
                            value={newUserData.phoneNumber}
                            onChange={(e) => setNewUserData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowCreateUserDialog(false)}
                          disabled={createPremiumUserMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => createPremiumUserMutation.mutate(newUserData)}
                          disabled={!newUserData.email || createPremiumUserMutation.isPending}
                        >
                          {createPremiumUserMutation.isPending ? "Creating..." : "Create Premium User"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2 flex-1">
                    <Search className="w-4 h-4 text-neutral-400" />
                    <Input
                      placeholder="Search users by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="premium">Premium Users</SelectItem>
                      <SelectItem value="free">Free Users</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="support-tickets">Has Support Tickets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded animate-pulse">
                        <div className="flex-1">
                          <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                        <div className="w-16 h-8 bg-neutral-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="space-y-4">
                    {filteredUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded hover:bg-neutral-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium text-neutral-900">
                                {user.firstName || user.lastName ? 
                                  `${user.firstName || ''} ${user.lastName || ''}`.trim() : 
                                  user.username || 'Anonymous User'
                                }
                              </p>
                              <p className="text-sm text-neutral-600">{user.email}</p>
                              <div className="flex gap-1 mt-1">
                                <Badge variant={user.subscriptionStatus === "active" ? "default" : "secondary"}>
                                  {user.subscriptionStatus === "active" ? "Premium" : "Free"}
                                </Badge>
                                {user.engagementRisk === "high" && (
                                  <Badge variant="destructive">High Risk</Badge>
                                )}
                                {user.hasSupportTickets && (
                                  <Badge variant="outline">Support Ticket</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>User Profile: {user.email}</DialogTitle>
                              </DialogHeader>
                              <UserProfileDrillDown user={user} />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${user.email}?`)) {
                                deleteUserMutation.mutate(user.id);
                              }
                            }}
                            disabled={deleteUserMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    No users found matching your criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab - Feature Usage Heatmap */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <FeatureUsageHeatmap stats={stats} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Churn Tab - Churn & Retention Insights */}
          <TabsContent value="churn" className="space-y-6">
            <ChurnDashboard stats={stats} users={Array.isArray(allUsers) ? allUsers : []} />
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <FeedbackManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// User Profile Drill-Down Component
function UserProfileDrillDown({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Signup Date:</strong> {new Date(user.createdAt).toLocaleDateString()}</div>
            <div><strong>Last Login:</strong> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</div>
            <div><strong>Phone:</strong> {user.phoneNumber || 'Not provided'}</div>
            <div><strong>Subscription:</strong> {user.subscriptionStatus || 'Free'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Total Sessions:</strong> {user.totalSessions || 0}</div>
            <div><strong>Avg Session Time:</strong> {user.avgSessionTime || 0}m</div>
            <div><strong>Relationships Created:</strong> {user.relationshipsCount || 0}</div>
            <div><strong>Boundaries Set:</strong> {user.boundariesCount || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {user.activityLog?.slice(0, 10).map((activity: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{activity.action}</span>
                <span className="text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
              </div>
            )) || <div className="text-gray-500">No activity data</div>}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">App Usage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Dashboard: {user.pageViews?.dashboard || 0} views</div>
            <div>Relationships: {user.pageViews?.relationships || 0} views</div>
            <div>Boundaries: {user.pageViews?.boundaries || 0} views</div>
            <div>Analytics: {user.pageViews?.analytics || 0} views</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Manual Overrides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Reset Password</Button>
            <Button size="sm" variant="outline">Extend Trial</Button>
            <Button size="sm" variant="destructive">Pause Access</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Feature Usage Heatmap Component
function FeatureUsageHeatmap({ stats }: { stats: any }) {
  const features = [
    { name: 'Dashboard', usage: stats?.featureUsage?.dashboard || 0, color: 'bg-blue-500' },
    { name: 'Relationship Tracking', usage: stats?.featureUsage?.relationships || 0, color: 'bg-green-500' },
    { name: 'Boundary Management', usage: stats?.featureUsage?.boundaries || 0, color: 'bg-purple-500' },
    { name: 'Emotional Check-ins', usage: stats?.featureUsage?.checkins || 0, color: 'bg-pink-500' },
    { name: 'Flag System', usage: stats?.featureUsage?.flags || 0, color: 'bg-yellow-500' },
    { name: 'Analytics', usage: stats?.featureUsage?.analytics || 0, color: 'bg-red-500' },
    { name: 'Timeline', usage: stats?.featureUsage?.timeline || 0, color: 'bg-indigo-500' },
    { name: 'Friends System', usage: stats?.featureUsage?.friends || 0, color: 'bg-teal-500' },
  ];

  const maxUsage = Math.max(...features.map(f => f.usage));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => (
          <div key={feature.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{feature.name}</span>
              <span className="font-medium">{feature.usage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${feature.color}`}
                style={{ width: `${maxUsage > 0 ? (feature.usage / maxUsage) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Most used feature: {features.sort((a, b) => b.usage - a.usage)[0]?.name} ({features.sort((a, b) => b.usage - a.usage)[0]?.usage}%)</li>
            <li>• Least used feature: {features.sort((a, b) => a.usage - b.usage)[0]?.name} ({features.sort((a, b) => a.usage - b.usage)[0]?.usage}%)</li>
            <li>• Features with low adoption (&lt;20%): {features.filter(f => f.usage < 20).length} features</li>
            <li>• High engagement features (&gt;60%): {features.filter(f => f.usage > 60).length} features</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// Churn Dashboard Component
function ChurnDashboard({ stats, users }: { stats: any; users: any[] }) {
  const churnData = {
    monthlyChurnRate: stats?.churnRate || 0,
    avgSubscriptionLength: stats?.avgSubscriptionLength || 0,
    totalCancellations: stats?.totalCancellations || 0,
    recentCancellations: stats?.recentCancellations || [],
  };

  const riskFactors = [
    { factor: 'No login in 7 days', count: stats?.riskFactors?.noLogin7d || 0 },
    { factor: 'No login in 14 days', count: stats?.riskFactors?.noLogin14d || 0 },
    { factor: 'No login in 30 days', count: stats?.riskFactors?.noLogin30d || 0 },
    { factor: 'Incomplete onboarding', count: stats?.riskFactors?.incompleteOnboarding || 0 },
    { factor: 'Low feature usage', count: stats?.riskFactors?.lowFeatureUsage || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{churnData.monthlyChurnRate}%</p>
              <p className="text-sm text-gray-600">Monthly Churn Rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{churnData.avgSubscriptionLength}</p>
              <p className="text-sm text-gray-600">Avg Subscription (days)</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{churnData.totalCancellations}</p>
              <p className="text-sm text-gray-600">Total Cancellations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Risk Scoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskFactors.map((risk, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm">{risk.factor}</span>
                <Badge variant={risk.count > 10 ? "destructive" : risk.count > 5 ? "default" : "secondary"}>
                  {risk.count} users
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Cancellations</CardTitle>
        </CardHeader>
        <CardContent>
          {churnData.recentCancellations.length > 0 ? (
            <div className="space-y-3">
              {churnData.recentCancellations.slice(0, 5).map((cancellation: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{cancellation.email}</p>
                    <p className="text-sm text-gray-600">Reason: {cancellation.reason || 'Not provided'}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(cancellation.cancelledAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent cancellations
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Feedback Management Component
function FeedbackManagement() {
  const { data: feedbackItems, isLoading } = useQuery({
    queryKey: ["/api/feedback"],
    retry: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Feedback & Support Integration</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : Array.isArray(feedbackItems) && feedbackItems.length > 0 ? (
          <div className="space-y-4">
            {feedbackItems.map((item: any) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{item.title}</h3>
                      <Badge variant={item.type === 'bug' ? 'destructive' : item.type === 'feature' ? 'default' : 'secondary'}>
                        {item.type}
                      </Badge>
                      <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="text-xs text-gray-500">
                      Submitted by: {item.submittedBy} on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Select value={item.status}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reported">Reported</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No feedback items found
          </div>
        )}
      </CardContent>
    </Card>
  );
}