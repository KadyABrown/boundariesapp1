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
import { Target, Plus, CheckCircle, X, Edit, Trash2, Calendar } from "lucide-react";
import { format, startOfDay, subDays, isToday } from "date-fns";

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

interface GoalCheckIn {
  id: number;
  userId: string;
  goalId: number;
  date: string;
  status: 'hit' | 'missed' | 'partial';
  notes?: string;
  createdAt: string;
}

function GoalForm({ goal, onSubmit }: { goal?: BoundaryGoal; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    category: goal?.category || 'personal-space',
    targetFrequency: goal?.targetFrequency || 'daily',
    targetCount: goal?.targetCount || 1,
    startDate: goal?.startDate ? goal.startDate.split('T')[0] : format(new Date(), 'yyyy-MM-dd'),
    endDate: goal?.endDate ? goal.endDate.split('T')[0] : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Goal Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Maintain work-life boundaries"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of what you want to achieve..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work-life">Work-Life</SelectItem>
              <SelectItem value="personal-space">Personal Space</SelectItem>
              <SelectItem value="social-media">Social Media</SelectItem>
              <SelectItem value="relationships">Relationships</SelectItem>
              <SelectItem value="time-management">Time Management</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select value={formData.targetFrequency} onValueChange={(value) => setFormData({ ...formData, targetFrequency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">
          {goal ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
}

function CheckInButton({ goal, checkIn, onCheckIn }: { 
  goal: BoundaryGoal; 
  checkIn?: GoalCheckIn; 
  onCheckIn: (status: 'hit' | 'missed' | 'partial', notes?: string) => void;
}) {
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [notes, setNotes] = useState(checkIn?.notes || '');
  const [selectedStatus, setSelectedStatus] = useState<'hit' | 'missed' | 'partial'>('hit');

  const handleQuickCheckIn = (status: 'hit' | 'missed') => {
    onCheckIn(status);
  };

  const handleDetailedCheckIn = () => {
    onCheckIn(selectedStatus, notes);
    setShowNotesDialog(false);
    setNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hit': return 'text-green-600 bg-green-50 border-green-200';
      case 'missed': return 'text-red-600 bg-red-50 border-red-200';
      case 'partial': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (checkIn) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(checkIn.status)}`}>
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium capitalize">{checkIn.status}</span>
        {checkIn.notes && (
          <span className="text-xs opacity-75">• {checkIn.notes}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-green-600 border-green-200 hover:bg-green-50"
        onClick={() => handleQuickCheckIn('hit')}
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Hit
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 border-red-200 hover:bg-red-50"
        onClick={() => handleQuickCheckIn('missed')}
      >
        <X className="h-4 w-4 mr-1" />
        Missed
      </Button>

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-gray-600">
            Add Notes
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Check-in with Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={(value: 'hit' | 'missed' | 'partial') => setSelectedStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hit">Hit - Achieved my goal</SelectItem>
                  <SelectItem value="partial">Partial - Made some progress</SelectItem>
                  <SelectItem value="missed">Missed - Didn't achieve it</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it go? What helped or hindered you?"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleDetailedCheckIn}>
                Save Check-in
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SimpleBoundaryGoals() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<BoundaryGoal | null>(null);

  // Fetch boundary goals
  const { data: goals = [] } = useQuery<BoundaryGoal[]>({
    queryKey: ['/api/boundary-goals'],
  });

  // Fetch today's check-ins
  const { data: todaysCheckIns = [] } = useQuery<GoalCheckIn[]>({
    queryKey: ['/api/goal-checkins', 'today'],
    queryFn: async () => {
      const today = startOfDay(new Date());
      const responses = await Promise.all(
        goals.map(goal => 
          fetch(`/api/goal-checkins/${goal.id}?startDate=${today.toISOString()}&endDate=${new Date().toISOString()}`)
            .then(res => res.ok ? res.json() : [])
        )
      );
      return responses.flat();
    },
    enabled: goals.length > 0,
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

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: (checkInData: Partial<GoalCheckIn>) => 
      apiRequest('POST', '/api/goal-checkins', checkInData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goal-checkins'] });
      toast({ title: "Check-in recorded!" });
    },
  });

  const handleCreateGoal = (data: any) => {
    createGoalMutation.mutate(data);
  };

  const handleUpdateGoal = (data: any) => {
    if (editingGoal) {
      updateGoalMutation.mutate({ id: editingGoal.id, ...data });
    }
  };

  const handleCheckIn = (goal: BoundaryGoal, status: 'hit' | 'missed' | 'partial', notes?: string) => {
    checkInMutation.mutate({
      goalId: goal.id,
      date: new Date().toISOString(),
      status,
      notes: notes || undefined,
    });
  };

  const getTodaysCheckIn = (goalId: number) => {
    return todaysCheckIns.find(checkIn => 
      checkIn.goalId === goalId && isToday(new Date(checkIn.date))
    );
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

      {/* Today's Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No goals created yet</p>
              <p className="text-sm">Create your first boundary goal to start tracking!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.filter(goal => goal.isActive).map((goal) => {
                const todaysCheckIn = getTodaysCheckIn(goal.id);
                
                return (
                  <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {goal.category.replace('-', ' ')} • {goal.targetFrequency}
                      </p>
                    </div>
                    
                    <CheckInButton
                      goal={goal}
                      checkIn={todaysCheckIn}
                      onCheckIn={(status, notes) => handleCheckIn(goal, status, notes)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals Overview */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {goals.map((goal: BoundaryGoal) => {
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

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Started {format(new Date(goal.startDate), 'MMM d, yyyy')}
                        </div>
                        {goal.endDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Ends {format(new Date(goal.endDate), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
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