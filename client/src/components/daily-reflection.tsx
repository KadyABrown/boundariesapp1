import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, BookOpen, Smile } from "lucide-react";

export default function DailyReflection() {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(7);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reflections = [] } = useQuery({
    queryKey: ["/api/reflections"],
    retry: false,
  });

  const createReflectionMutation = useMutation({
    mutationFn: async (reflectionData: { content: string; mood: number }) => {
      const res = await apiRequest("POST", "/api/reflections", {
        content: reflectionData.content,
        mood: reflectionData.mood,
        prompt: "Daily reflection: How did your relationships and boundaries feel today?"
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reflections"] });
      setContent("");
      setMood(7);
      toast({
        title: "Reflection Saved",
        description: "Your daily reflection has been recorded.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please write something for your reflection.",
        variant: "destructive",
      });
      return;
    }
    createReflectionMutation.mutate({ content: content.trim(), mood });
  };

  const getMoodEmoji = (moodValue: number) => {
    if (moodValue <= 3) return "😢";
    if (moodValue <= 5) return "😐";
    if (moodValue <= 7) return "🙂";
    if (moodValue <= 9) return "😊";
    return "😄";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Daily Reflection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-neutral-600">
              Take a moment to reflect on your boundary experiences today. How did your interactions make you feel?
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What stood out to you today in your relationships?
                </label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-neutral-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Reflect on your interactions, emotions, and any insights about your boundaries..."
                  maxLength={1000}
                />
                <div className="text-xs text-neutral-500 mt-1">
                  {content.length}/1000 characters
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Overall mood today: {mood}/10 {getMoodEmoji(mood)}
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>1 - Very Low</span>
                  <span>10 - Excellent</span>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={createReflectionMutation.isPending}
              >
                {createReflectionMutation.isPending ? "Saving..." : "Save Reflection"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reflections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Reflections
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(reflections) && reflections.length > 0 ? (
            <div className="space-y-4">
              {reflections.slice(0, 5).map((reflection: any) => (
                <div key={reflection.id} className="border rounded-lg p-4 bg-neutral-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">
                        {formatDate(reflection.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Smile className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">
                        {reflection.mood}/10 {getMoodEmoji(reflection.mood)}
                      </span>
                    </div>
                  </div>
                  <p className="text-neutral-700 text-sm leading-relaxed">
                    {reflection.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 mb-2">No reflections yet</p>
              <p className="text-neutral-400 text-sm">
                Start your first daily reflection above to begin tracking your emotional journey.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}