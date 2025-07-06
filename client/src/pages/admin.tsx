import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
  Crown,
  UserX
} from "lucide-react";
import { useState, useEffect } from "react";

function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'cancelled'>('all');

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

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
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

  // Helper functions
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

  const getAccountTypeBadge = (userId: string, email: string) => {
    const isUserAdmin = email === "hello@roxzmedia.com" || userId === "44415082";
    if (isUserAdmin) {
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
          <Crown className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
        User
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Trial</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  // Filter users based on search term and subscription status
  const filteredUsers = Array.isArray(allUsers) ? allUsers.filter((user: any) => {
    // Search filter
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Subscription filter
    const isPremium = user.stripeCustomerId && user.stripeSubscriptionId && user.subscriptionStatus === 'active';
    let matchesFilter = true;
    
    if (userFilter === 'active') {
      matchesFilter = isPremium;
    } else if (userFilter === 'cancelled') {
      matchesFilter = !isPremium;
    }
    
    return matchesSearch && matchesFilter;
  }) : [];

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">You need to be logged in to access the admin panel.</p>
            <Button onClick={() => window.location.href = "/api/login"}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[80vh]">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, track subscriptions, and monitor app performance.</p>
        </div>

        {/* Admin Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {adminStats?.totalUsers || Array.isArray(allUsers) ? allUsers.length : 0}
                  </p>
                  <p className="text-sm text-green-600">
                    +{adminStats?.newUsersThisWeek || 0} this week
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Premium Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {adminStats?.premiumUsers || 0}
                  </p>
                  <p className="text-sm text-green-600">
                    +{adminStats?.newSubscribersThisWeek || 0} this week
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Trials</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {adminStats?.activeTrials || 0}
                  </p>
                  <p className="text-sm text-blue-600">
                    {adminStats?.trialConversionRate || 0}% conversion
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${adminStats?.monthlyRevenue || 0}
                  </p>
                  <p className="text-sm text-green-600">
                    +{adminStats?.revenueGrowth || 0}% growth
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Users</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={userFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserFilter('all')}
                  >
                    All Users
                  </Button>
                  <Button
                    variant={userFilter === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserFilter('active')}
                  >
                    Active Subscribers
                  </Button>
                  <Button
                    variant={userFilter === 'cancelled' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUserFilter('cancelled')}
                  >
                    Free Users
                  </Button>
                </div>
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
      </div>
    </div>
  );
}

export default AdminPage;