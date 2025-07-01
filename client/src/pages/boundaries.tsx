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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Shield, Target, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BaselineIntegration from "@/components/baseline-integration";
import SimpleBoundaryGoals from "@/components/simple-boundary-goals";

export default function Boundaries() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBoundary, setEditingBoundary] = useState<any>(null);

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

  const { data: boundaries, isLoading: boundariesLoading } = useQuery({
    queryKey: ["/api/boundaries"],
    retry: false,
  });

  const createBoundaryMutation = useMutation({
    mutationFn: async (boundaryData: any) => {
      await apiRequest("POST", "/api/boundaries", boundaryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boundaries"] });
      setIsDialogOpen(false);
      setEditingBoundary(null);
      toast({
        title: "Success",
        description: "Boundary created successfully",
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
        description: "Failed to create boundary",
        variant: "destructive",
      });
    },
  });

  const updateBoundaryMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      await apiRequest("PUT", `/api/boundaries/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boundaries"] });
      setIsDialogOpen(false);
      setEditingBoundary(null);
      toast({
        title: "Success",
        description: "Boundary updated successfully",
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
        description: "Failed to update boundary",
        variant: "destructive",
      });
    },
  });

  const deleteBoundaryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/boundaries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boundaries"] });
      toast({
        title: "Success",
        description: "Boundary deleted successfully",
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
        description: "Failed to delete boundary",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const boundaryData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      importance: parseInt(formData.get("importance") as string),
      isActive: formData.get("isActive") === "on",
    };

    if (editingBoundary) {
      updateBoundaryMutation.mutate({ id: editingBoundary.id, ...boundaryData });
    } else {
      createBoundaryMutation.mutate(boundaryData);
    }
  };

  const openEditDialog = (boundary: any) => {
    setEditingBoundary(boundary);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBoundary(null);
    setIsDialogOpen(true);
  };

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-sm">B</span>
        </div>
        <p className="text-neutral-600">Loading your boundaries...</p>
      </div>
    </div>;
  }

  const categoryColors: Record<string, string> = {
    "work-life": "bg-blue-500",
    "social-media": "bg-purple-500",
    "personal-space": "bg-green-500",
    "emotional": "bg-amber-500",
    "financial": "bg-red-500",
    "time": "bg-indigo-500",
    "relationships": "bg-pink-500",
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">My Boundaries</h1>
            <p className="text-neutral-600 mt-2">Define and manage your personal boundaries</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Boundary
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingBoundary ? "Edit Boundary" : "Create New Boundary"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Boundary Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingBoundary?.title || ""}
                    placeholder="e.g., Work-Life Balance"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={editingBoundary?.category || ""} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work-life">Work-Life Balance</SelectItem>
                      <SelectItem value="social-media">Social Media & Technology</SelectItem>
                      <SelectItem value="personal-space">Personal Space</SelectItem>
                      <SelectItem value="emotional">Emotional Boundaries</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="time">Time Management</SelectItem>
                      <SelectItem value="relationships">Relationships</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingBoundary?.description || ""}
                    placeholder="Describe this boundary and why it's important to you..."
                    className="h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="importance">Importance Level: {editingBoundary?.importance || 5}</Label>
                  <Slider
                    name="importance"
                    defaultValue={[editingBoundary?.importance || 5]}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    name="isActive"
                    defaultChecked={editingBoundary?.isActive !== false}
                  />
                  <Label htmlFor="isActive">Active boundary</Label>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={createBoundaryMutation.isPending || updateBoundaryMutation.isPending}
                  >
                    {editingBoundary ? "Update Boundary" : "Create Boundary"}
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

        {/* Main Content with Tabs */}
        <Tabs defaultValue="boundaries" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="boundaries" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              My Boundaries
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Boundary Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="boundaries" className="mt-6">
            {/* Baseline Integration */}
            <BaselineIntegration 
              boundaries={Array.isArray(boundaries) ? boundaries : []}
              className="mb-8"
            />

            {boundariesLoading ? (
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
        ) : boundaries && boundaries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boundaries.map((boundary: any) => (
              <Card key={boundary.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${categoryColors[boundary.category] || 'bg-neutral-500'} rounded-full`}></div>
                      <div>
                        <CardTitle className="text-lg">{boundary.title}</CardTitle>
                        <p className="text-sm text-neutral-500 capitalize">
                          {boundary.category.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(boundary)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBoundaryMutation.mutate(boundary.id)}
                        disabled={deleteBoundaryMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {boundary.description && (
                    <p className="text-sm text-neutral-600 mb-4">{boundary.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Importance: {boundary.importance}/10</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      boundary.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {boundary.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">No Boundaries Yet</h3>
              <p className="text-neutral-600 mb-6">
                Start your boundary journey by defining your first personal boundary
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Boundary
              </Button>
            </CardContent>
          </Card>
        )}
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <SimpleBoundaryGoals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
