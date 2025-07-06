import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const emotionOptions = [
  { value: "very-negative", emoji: "😢", label: "Very Hard", color: "hover:border-red-200 hover:bg-red-50" },
  { value: "negative", emoji: "😔", label: "Difficult", color: "hover:border-orange-200 hover:bg-orange-50" },
  { value: "neutral", emoji: "😐", label: "Neutral", color: "hover:border-yellow-200 hover:bg-yellow-50" },
  { value: "positive", emoji: "😊", label: "Good", color: "hover:border-green-200 hover:bg-green-50" },
  { value: "very-positive", emoji: "🤗", label: "Empowering", color: "hover:border-blue-200 hover:bg-blue-50" },
];

const statusOptions = [
  { value: "respected", label: "Respected", description: "I successfully maintained this boundary" },
  { value: "challenged", label: "Challenged", description: "This boundary was tested or difficult to maintain" },
  { value: "communicated", label: "Communicated", description: "I expressed or discussed this boundary" },
  { value: "violated", label: "Violated", description: "This boundary was crossed or broken" },
];

export default function BoundaryForm() {
  const { toast } = useToast();
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const createEntryMutation = useMutation({
    mutationFn: async (entryData: any) => {
      await apiRequest("POST", "/api/boundary-entries", entryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boundary-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setSelectedEmotion("");
      setCategory("");
      setStatus("");
      setDescription("");
      toast({
        title: "Success",
        description: "Boundary experience saved successfully",
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
        description: "Failed to save boundary experience",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !description || !selectedEmotion || !status) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createEntryMutation.mutate({
      category,
      description,
      emotionalImpact: selectedEmotion,
      status,
    });
  };

  const clearForm = () => {
    setSelectedEmotion("");
    setCategory("");
    setStatus("");
    setDescription("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Boundary Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
              Boundary Category
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a boundary type..." />
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
            <Label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-2">
              What happened?
            </Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="How did this boundary experience go?" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-neutral-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
              Describe your experience
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your boundary experience..."
              className="h-24 resize-none"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-3">
              How did it feel?
            </Label>
            <div className="flex justify-between items-center space-x-2">
              {emotionOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedEmotion(option.value)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    selectedEmotion === option.value
                      ? "border-primary bg-primary/10"
                      : `border-transparent ${option.color}`
                  }`}
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs text-neutral-600">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createEntryMutation.isPending}
            >
              {createEntryMutation.isPending ? "Saving..." : "Save Entry"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={clearForm}
              disabled={createEntryMutation.isPending}
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
