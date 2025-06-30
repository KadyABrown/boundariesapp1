import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  MessageSquare, 
  TrendingUp,
  Shield,
  Flag
} from "lucide-react";

// Behavioral flags data
const behavioralFlagsData = [
  {
    category: "Communication",
    flags: [
      { name: "Listens actively", type: "green", description: "Pays attention and responds thoughtfully" },
      { name: "Communicates clearly", type: "green", description: "Expresses thoughts and feelings openly" },
      { name: "Respects boundaries", type: "green", description: "Honors your limits and requests" },
      { name: "Interrupts frequently", type: "red", description: "Often cuts you off when speaking" },
      { name: "Dismisses your feelings", type: "red", description: "Minimizes or ignores your emotions" },
      { name: "Silent treatment", type: "red", description: "Stops communicating as punishment" },
    ]
  },
  {
    category: "Respect",
    flags: [
      { name: "Shows appreciation", type: "green", description: "Regularly expresses gratitude" },
      { name: "Supports your goals", type: "green", description: "Encourages your dreams and ambitions" },
      { name: "Values your opinion", type: "green", description: "Asks for and considers your input" },
      { name: "Makes important decisions alone", type: "red", description: "Excludes you from significant choices" },
      { name: "Criticizes publicly", type: "red", description: "Puts you down in front of others" },
      { name: "Controls your choices", type: "red", description: "Tries to limit your freedom or autonomy" },
    ]
  },
  {
    category: "Emotional Consistency",
    flags: [
      { name: "Emotionally stable", type: "green", description: "Maintains consistent emotional responses" },
      { name: "Handles conflict well", type: "green", description: "Addresses disagreements constructively" },
      { name: "Shows empathy", type: "green", description: "Understands and shares your feelings" },
      { name: "Unpredictable mood swings", type: "red", description: "Emotional state changes drastically" },
      { name: "Explosive anger", type: "red", description: "Reacts with intense, uncontrolled anger" },
      { name: "Emotional manipulation", type: "red", description: "Uses emotions to control or guilt you" },
    ]
  },
  {
    category: "Trust & Reliability",
    flags: [
      { name: "Keeps promises", type: "green", description: "Follows through on commitments" },
      { name: "Honest and transparent", type: "green", description: "Tells the truth and shares openly" },
      { name: "Reliable presence", type: "green", description: "Shows up when they say they will" },
      { name: "Breaks promises regularly", type: "red", description: "Often fails to keep commitments" },
      { name: "Lies or hides things", type: "red", description: "Dishonest about actions or feelings" },
      { name: "Cancels plans frequently", type: "red", description: "Often backs out at the last minute" },
    ]
  }
];

interface RelationshipDetailProps {
  profileId: string;
}

export default function RelationshipDetail({ profileId }: RelationshipDetailProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [safetyRating, setSafetyRating] = useState([7]);

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

  const { data: profile } = useQuery({
    queryKey: ["/api/relationships", profileId],
    retry: false,
  });

  const { data: checkIns } = useQuery({
    queryKey: ["/api/relationships", profileId, "check-ins"],
    retry: false,
  });

  const { data: flags } = useQuery({
    queryKey: ["/api/relationships", profileId, "flags"],
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/relationships", profileId, "stats"],
    retry: false,
  });

  const createCheckInMutation = useMutation({
    mutationFn: async (checkInData: any) => {
      await apiRequest("POST", `/api/relationships/${profileId}/check-ins`, checkInData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/relationships", profileId, "check-ins"] });
      queryClient.invalidateQueries({ queryKey: ["/api/relationships", profileId, "stats"] });
      setIsCheckInDialogOpen(false);
      toast({
        title: "Success",
        description: "Emotional check-in saved successfully",
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
        description: "Failed to save check-in",
        variant: "destructive",
      });
    },
  });

  const updateFlagMutation = useMutation({
    mutationFn: async ({ flagData, existingFlag }: any) => {
      if (existingFlag) {
        await apiRequest("PUT", `/api/relationships/${profileId}/flags/${existingFlag.id}`, flagData);
      } else {
        await apiRequest("POST", `/api/relationships/${profileId}/flags`, flagData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/relationships", profileId, "flags"] });
      queryClient.invalidateQueries({ queryKey: ["/api/relationships", profileId, "stats"] });
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
        description: "Failed to update behavioral flag",
        variant: "destructive",
      });
    },
  });

  const handleCheckInSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const checkInData = {
      feelSafeAndExcited: formData.get("feelSafeAndExcited") as string,
      feelSupported: formData.get("feelSupported") as string,
      emotionalToneChanged: formData.get("emotionalToneChanged") as string,
      overallSafetyRating: safetyRating[0],
      notes: formData.get("notes") as string,
    };

    createCheckInMutation.mutate(checkInData);
  };

  const handleFlagToggle = (flag: any, category: string, isPresent: boolean) => {
    const existingFlag = flags?.find((f: any) => 
      f.flagCategory === category && f.flagName === flag.name
    );

    const flagData = {
      flagCategory: category,
      flagName: flag.name,
      flagType: flag.type,
      isPresent,
      notes: "",
    };

    updateFlagMutation.mutate({ flagData, existingFlag });
  };

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white text-sm">B</span>
        </div>
        <p className="text-neutral-600">Loading relationship details...</p>
      </div>
    </div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">Relationship Not Found</h3>
        <p className="text-neutral-600 mb-4">This relationship profile doesn't exist or you don't have access to it.</p>
        <Button onClick={() => window.location.href = '/relationships'}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Relationships
        </Button>
      </div>
    </div>;
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const checkInDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return checkInDate.toLocaleDateString();
  };

  const greenFlagCount = stats?.greenFlags || 0;
  const redFlagCount = stats?.redFlags || 0;
  const totalFlags = greenFlagCount + redFlagCount;
  const healthScore = totalFlags > 0 ? Math.round((greenFlagCount / totalFlags) * 100) : 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/relationships'}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Relationships
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">
                {profile.nickname || profile.name}
                {profile.nickname && (
                  <span className="text-lg text-neutral-500 font-normal ml-2">({profile.name})</span>
                )}
              </h1>
              <p className="text-neutral-600 mt-2 capitalize">
                {profile.relationshipType} • {profile.currentStatus}
              </p>
            </div>
            
            <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Emotional Check-in
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Emotional Safety Check-in</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleCheckInSubmit} className="space-y-6">
                  <div>
                    <Label>Did I feel safe and excited in the beginning?</Label>
                    <Select name="feelSafeAndExcited" required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="unsure">Unsure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Do I still feel supported?</Label>
                    <Select name="feelSupported" required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="unsure">Unsure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Has the emotional tone changed?</Label>
                    <Select name="emotionalToneChanged" required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes, it has changed</SelectItem>
                        <SelectItem value="no">No, it's consistent</SelectItem>
                        <SelectItem value="unsure">Unsure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Overall Safety Rating: {safetyRating[0]}/10</Label>
                    <Slider
                      value={safetyRating}
                      onValueChange={setSafetyRating}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-neutral-500 mt-1">
                      <span>Unsafe</span>
                      <span>Very Safe</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any additional thoughts or observations..."
                      className="mt-2 h-24 resize-none"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={createCheckInMutation.isPending}
                    >
                      Save Check-in
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCheckInDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-neutral-800">{healthScore}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600">Green Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-neutral-800">{greenFlagCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600">Red Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-neutral-800">{redFlagCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600">Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-neutral-800">{stats?.checkInCount || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="behavioral-flags" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="behavioral-flags">Behavioral Flags</TabsTrigger>
            <TabsTrigger value="check-ins">Emotional Check-ins</TabsTrigger>
          </TabsList>

          <TabsContent value="behavioral-flags" className="space-y-6">
            {behavioralFlagsData.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.flags.map((flag) => {
                      const existingFlag = flags?.find((f: any) => 
                        f.flagCategory === category.category && f.flagName === flag.name
                      );
                      const isChecked = existingFlag?.isPresent || false;

                      return (
                        <div 
                          key={flag.name} 
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isChecked 
                              ? flag.type === 'green' 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-red-300 bg-red-50'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => 
                                handleFlagToggle(flag, category.category, !!checked)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-neutral-800">{flag.name}</h4>
                                <Badge 
                                  variant={flag.type === 'green' ? 'default' : 'destructive'}
                                  className="text-xs"
                                >
                                  {flag.type === 'green' ? 'Green' : 'Red'}
                                </Badge>
                              </div>
                              <p className="text-sm text-neutral-600 mt-1">{flag.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="check-ins" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Emotional Safety History</CardTitle>
                  {stats?.averageSafetyRating && (
                    <div className="text-sm text-neutral-600">
                      Average Rating: {stats.averageSafetyRating.toFixed(1)}/10
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {checkIns && checkIns.length > 0 ? (
                  <div className="space-y-4">
                    {checkIns.map((checkIn: any) => (
                      <div key={checkIn.id} className="p-4 bg-neutral-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">Safety Rating: {checkIn.overallSafetyRating}/10</span>
                          </div>
                          <span className="text-sm text-neutral-500">
                            {formatTimeAgo(checkIn.createdAt)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <span className="text-xs text-neutral-500">Safe & Excited</span>
                            <p className="font-medium capitalize">{checkIn.feelSafeAndExcited}</p>
                          </div>
                          <div>
                            <span className="text-xs text-neutral-500">Feel Supported</span>
                            <p className="font-medium capitalize">{checkIn.feelSupported}</p>
                          </div>
                          <div>
                            <span className="text-xs text-neutral-500">Tone Changed</span>
                            <p className="font-medium capitalize">{checkIn.emotionalToneChanged}</p>
                          </div>
                        </div>
                        
                        {checkIn.notes && (
                          <div>
                            <span className="text-xs text-neutral-500">Notes</span>
                            <p className="text-sm text-neutral-700 mt-1">{checkIn.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                    <p className="text-sm mb-2">No emotional check-ins yet</p>
                    <p className="text-xs">Start tracking your emotional safety with this person</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}