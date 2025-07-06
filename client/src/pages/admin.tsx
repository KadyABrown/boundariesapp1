import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, UserCheck } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>
          <p className="text-neutral-600 mt-2">Manage users and monitor platform metrics</p>
        </div>

        {/* Simple stats cards with placeholder data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600">Total Users</p>
                  <p className="text-2xl font-bold text-neutral-900">12</p>
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
                  <p className="text-2xl font-bold text-neutral-900">3</p>
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
                  <p className="text-2xl font-bold text-neutral-900">$38.97</p>
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
                  <p className="text-2xl font-bold text-neutral-900">+15%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Under Construction notice */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <Users className="h-16 w-16 text-neutral-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">Under Construction</h3>
              <p className="text-neutral-600 mb-6">
                The user management system is being built. Focus is currently on core relationship tracking features.
              </p>
              <div className="text-sm text-neutral-500">
                Basic stats are available above. Full user management coming soon.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}