import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Search,
  Mail,
  Phone,
  Crown,
  Download,
  FileText,
  Database,
  Eye,
  Activity,
  BarChart3,
  AlertTriangle,
  Settings,
  UserX
} from "lucide-react";
import { useState, useEffect } from "react";

function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFeatureHeatmap, setShowFeatureHeatmap] = useState(false);
  const [showChurnDashboard, setShowChurnDashboard] = useState(false);

  // Admin authorization check
  const isAdmin = user?.email === "hello@roxzmedia.com" || user?.id === "44415082";

  // Fetch all users and their stats
  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && isAdmin,
    retry: false,
  });

  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && isAdmin,
    retry: false,
  });

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

  if (isLoading || statsLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Access Denied</h3>
              <p className="text-neutral-600">
                You don't have admin permissions to view this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const filteredUsers = allUsers.filter((user: any) =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const deleteUser = (userId: string, email: string) => {
    if (confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Canceled</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  const getAccountTypeBadge = (userId: string, email: string) => {
    // Check if user is admin (same logic as isAdmin check)
    const isUserAdmin = email === "hello@roxzmedia.com" || userId === "44415082";
    
    if (isUserAdmin) {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
          <Crown className="w-3 h-3" />
          Admin
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600">
        User
      </Badge>
    );
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
          return value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportUserData = () => {
    const exportData = filteredUsers.map((user: any) => ({
      'User ID': user.id,
      'First Name': user.firstName || '',
      'Last Name': user.lastName || '',
      'Email': user.email || '',
      'Subscription Status': user.subscriptionStatus || 'free',
      'Relationship Count': user.relationshipCount || 0,
      'Join Date': user.createdAt ? formatDate(user.createdAt) : '',
      'Last Active': user.lastActiveAt ? formatDate(user.lastActiveAt) : 'Never'
    }));
    
    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `boundaryspace-users-${timestamp}.csv`);
    
    toast({
      title: "Export Complete",
      description: `Exported ${exportData.length} user records to CSV`,
    });
  };

  const exportBusinessData = () => {
    const businessData = [{
      'Total Users': adminStats?.totalUsers || allUsers.length,
      'Premium Users': adminStats?.premiumUsers || 0,
      'Active Trials': adminStats?.activeTrials || 0,
      'Monthly Revenue': adminStats?.monthlyRevenue || 0,
      'New Users This Week': adminStats?.newUsersThisWeek || 0,
      'New Subscribers This Week': adminStats?.newSubscribersThisWeek || 0,
      'Trial Conversion Rate': `${adminStats?.trialConversionRate || 0}%`,
      'Revenue Growth': `${adminStats?.revenueGrowth || 0}%`,
      'Export Date': new Date().toLocaleDateString()
    }];
    
    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(businessData, `boundaryspace-analytics-${timestamp}.csv`);
    
    toast({
      title: "Analytics Export Complete",
      description: "Business metrics exported to CSV",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage users, subscriptions, and monitor app usage
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.totalUsers || allUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                +{adminStats?.newUsersThisWeek || 0} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Subscribers</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.premiumUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{adminStats?.newSubscribersThisWeek || 0} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.activeTrials || 0}</div>
              <p className="text-xs text-muted-foreground">
                {adminStats?.trialConversionRate || 0}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${adminStats?.monthlyRevenue || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{adminStats?.revenueGrowth || 0}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Navigation */}
        <div className="mb-8">
          <div className="flex gap-2 border-b">
            <Button 
              variant={!showFeatureHeatmap && !showChurnDashboard ? "default" : "ghost"}
              onClick={() => {
                setShowFeatureHeatmap(false);
                setShowChurnDashboard(false);
                setSelectedUser(null);
              }}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              User Management
            </Button>
            <Button 
              variant={showFeatureHeatmap ? "default" : "ghost"}
              onClick={() => {
                setShowFeatureHeatmap(true);
                setShowChurnDashboard(false);
                setSelectedUser(null);
              }}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Feature Analytics
            </Button>
            <Button 
              variant={showChurnDashboard ? "default" : "ghost"}
              onClick={() => {
                setShowChurnDashboard(true);
                setShowFeatureHeatmap(false);
                setSelectedUser(null);
              }}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Churn Analysis
            </Button>
          </div>
        </div>

        {/* Export Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={exportUserData} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export User Data
              </Button>
              <Button onClick={exportBusinessData} variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Export Analytics
              </Button>
              <div className="text-sm text-gray-600 flex items-center">
                <span>Downloads include: User profiles, subscription status, activity data</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Analytics Dashboard */}
        {showFeatureHeatmap && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Feature Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Feature Analytics Coming Soon</h3>
                <p>Detailed feature usage analytics will be available here.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Churn Analysis Dashboard */}
        {showChurnDashboard && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Churn Analysis Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Churn Analysis Coming Soon</h3>
                <p>User retention and churn analysis will be available here.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Profile Drill-Down */}
        {selectedUser && (
          <Card className="fixed inset-0 z-50 bg-white m-4 overflow-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  User Profile Details
                </CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedUser(null)}
                  className="p-2"
                >
                  <UserX className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">User Profile Details Coming Soon</h3>
                <p>Detailed user activity and profile information will be available here.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Management */}
        {!showFeatureHeatmap && !showChurnDashboard && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Users</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Account Type</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Relationships</th>
                    <th className="text-left py-3 px-4">Last Active</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {user.profileImageUrl ? (
                            <img 
                              src={user.profileImageUrl} 
                              alt={user.firstName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {user.firstName || 'Unknown'} {user.lastName || ''}
                            </div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.email || 'No email'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getAccountTypeBadge(user.id, user.email)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(user.subscriptionStatus || 'free')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.relationshipCount || 0} profiles
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {user.lastActiveAt ? formatDate(user.lastActiveAt) : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(user.id, user.email)}
                          className="flex items-center gap-1"
                        >
                          <UserX className="w-4 h-4" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}

export default AdminPage;