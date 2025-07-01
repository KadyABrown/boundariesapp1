import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Clock, Edit, Trash2 } from "lucide-react";
import { format, subDays, subWeeks, subMonths } from "date-fns";

interface BoundaryGoal {
  id: number;
  userId: string;
  category: string;
  title: string;
  description?: string;
  targetFrequency: string;
  targetCount?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GoalProgress {
  goal: BoundaryGoal;
  totalEntries: number;
  respectEntries: number;
  progressPercentage: number;
}

export default function BoundaryGoalsManager() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<BoundaryGoal | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Fetch boundary goals
  const { data: goals = [] } = useQuery<BoundaryGoal[]>({
    queryKey: ['/api/boundary-goals'],
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: (goalData: Partial<BoundaryGoal>) => 
      apiRequest('POST', '/api/boundary-goals', goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/boundary-goals'] });
      setShowCreateDialog(false);
      toast({ title: "Goal created successfully!" });
    },
  });

  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: ({ id, ...goalData }: Partial<BoundaryGoal> & { id: number }) => 
      apiRequest('PUT', `/api/boundary-goals/${id}`, goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/boundary-goals'] });
      setEditingGoal(null);
      toast({ title: "Goal updated successfully!" });
    },
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: (goalId: number) => 
      apiRequest('DELETE', `/api/boundary-goals/${goalId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/boundary-goals'] });
      toast({ title: "Goal deleted successfully!" });
    },
  });

  // Fetch goal progress
  const { data: progressData } = useQuery({
    queryKey: ['/api/boundary-goals/progress', selectedTimeframe],
    queryFn: async () => {
      if (!goals.length) return [];
      
      const endDate = new Date();
      let startDate: Date;
      
      switch (selectedTimeframe) {
        case 'week':
          startDate = subWeeks(endDate, 1);
          break;
        case 'month':
          startDate = subMonths(endDate, 1);
          break;
        case 'quarter':
          startDate = subMonths(endDate, 3);
          break;
        default:
          startDate = subWeeks(endDate, 1);
      }

      const progressPromises = goals.map(async (goal: BoundaryGoal) => {
        const response = await fetch(
          `/api/boundary-goals/${goal.id}/progress?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        if (!response.ok) return null;
        return response.json();
      });

      const results = await Promise.all(progressPromises);
      return results.filter(Boolean);
    },
    enabled: goals.length > 0,
  });

  const handleCreateGoal = (formData: FormData) => {
    const goalData = {
      category: formData.get('category') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      targetFrequency: formData.get('targetFrequency') as string,
      targetCount: parseInt(formData.get('targetCount') as string) || undefined,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string || undefined,
      isActive: true,
    };

    createGoalMutation.mutate(goalData);
  };

  const handleUpdateGoal = (formData: FormData) => {
    if (!editingGoal) return;

    const goalData = {
      id: editingGoal.id,
      category: formData.get('category') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      targetFrequency: formData.get('targetFrequency') as string,
      targetCount: parseInt(formData.get('targetCount') as string) || undefined,
      endDate: formData.get('endDate') as string || undefined,
      isActive: formData.get('isActive') === 'true',
    };

    updateGoalMutation.mutate(goalData);
  };

  const GoalForm = ({ goal, onSubmit }: { goal?: BoundaryGoal; onSubmit: (formData: FormData) => void }) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={goal?.category || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal-space">Personal Space</SelectItem>
            <SelectItem value="emotional">Emotional</SelectItem>
            <SelectItem value="time">Time</SelectItem>
            <SelectItem value="communication">Communication</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="social-media">Social Media</SelectItem>
            <SelectItem value="work-life">Work-Life</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Goal Title</Label>
        <Input
          name="title"
          placeholder="e.g., Say no to weekend work requests"
          defaultValue={goal?.title || ''}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          placeholder="Describe your boundary goal..."
          defaultValue={goal?.description || ''}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetFrequency">Target Frequency</Label>
          <Select name="targetFrequency" defaultValue={goal?.targetFrequency || ''}>
            <SelectTrigger>
              <SelectValue placeholder="How often?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="as-needed">As Needed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetCount">Target Count (Optional)</Label>
          <Input
            name="targetCount"
            type="number"
            placeholder="e.g., 5"
            defaultValue={goal?.targetCount || ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            name="startDate"
            type="date"
            defaultValue={goal?.startDate ? format(new Date(goal.startDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            name="endDate"
            type="date"
            defaultValue={goal?.endDate ? format(new Date(goal.endDate), 'yyyy-MM-dd') : ''}
          />
        </div>
      </div>

      {goal && (
        <div className="space-y-2">
          <Label htmlFor="isActive">Status</Label>
          <Select name="isActive" defaultValue={goal.isActive ? 'true' : 'false'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="w-full">
        {goal ? 'Update Goal' : 'Create Goal'}
      </Button>
    </form>
  );

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (goal: BoundaryGoal) => {
    if (!goal.isActive) return <Badge variant="secondary">Paused</Badge>;
    if (goal.endDate && new Date(goal.endDate) < new Date()) return <Badge variant="destructive">Expired</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Boundary Goals</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Boundary Goal</DialogTitle>
              </DialogHeader>
              <GoalForm onSubmit={handleCreateGoal} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Goals Overview */}
      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No boundary goals yet</h3>
            <p className="text-muted-foreground mb-4">Set specific goals to track your boundary progress</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal: BoundaryGoal) => {
            const progress = progressData?.find((p: GoalProgress) => p.goal.id === goal.id);
            
            return (
              <Card key={goal.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        {getStatusBadge(goal)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">{goal.category.replace('-', ' ')}</span>
                        <span>•</span>
                        <span className="capitalize">{goal.targetFrequency}</span>
                        {goal.targetCount && (
                          <>
                            <span>•</span>
                            <span>Target: {goal.targetCount}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingGoal(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGoalMutation.mutate(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                  )}

                  {progress && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress ({selectedTimeframe})</span>
                        <span className="text-sm font-bold">{progress.progressPercentage}%</span>
                      </div>
                      
                      <Progress 
                        value={progress.progressPercentage} 
                        className="h-2"
                      />
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600">{progress.respectEntries}</div>
                          <div className="text-xs text-muted-foreground">Respected</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{progress.totalEntries}</div>
                          <div className="text-xs text-muted-foreground">Total Entries</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {Math.round((progress.respectEntries / Math.max(progress.totalEntries, 1)) * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Started {format(new Date(goal.startDate), 'MMM d, yyyy')}
                    </div>
                    {goal.endDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Ends {format(new Date(goal.endDate), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Goal Dialog */}
      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Boundary Goal</DialogTitle>
          </DialogHeader>
          {editingGoal && <GoalForm goal={editingGoal} onSubmit={handleUpdateGoal} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}