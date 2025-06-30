import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, TrendingUp, TrendingDown, AlertTriangle, Heart, MessageCircle, Shield, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RelationshipHealthTrackerProps {
  profileId: number;
  profileName: string;
}

interface RelationshipStats {
  greenFlags: number;
  redFlags: number;
  averageSafetyRating: number;
  checkInCount: number;
}

interface BehavioralFlag {
  id: number;
  flagCategory: string;
  flagName: string;
  flagType: "green" | "red";
  isPresent: boolean;
  notes?: string;
  createdAt: string;
}

interface EmotionalCheckIn {
  id: number;
  feelSafeAndExcited: string;
  feelSupported: string;
  emotionalToneChanged: string;
  overallSafetyRating: number;
  notes?: string;
  createdAt: string;
}

// Test data for flag options
const flagOptions = [
  {
    category: "Communication",
    flags: [
      { name: "Listens actively", type: "green" as const, description: "Pays attention and responds thoughtfully" },
      { name: "Communicates clearly", type: "green" as const, description: "Expresses thoughts and feelings openly" },
      { name: "Respects boundaries", type: "green" as const, description: "Honors your limits and requests" },
      { name: "Interrupts frequently", type: "red" as const, description: "Often cuts you off when speaking" },
      { name: "Dismisses your feelings", type: "red" as const, description: "Minimizes or ignores your emotions" },
      { name: "Silent treatment", type: "red" as const, description: "Stops communicating as punishment" },
    ]
  },
  {
    category: "Respect",
    flags: [
      { name: "Shows appreciation", type: "green" as const, description: "Regularly expresses gratitude" },
      { name: "Supports your goals", type: "green" as const, description: "Encourages your dreams and ambitions" },
      { name: "Values your opinion", type: "green" as const, description: "Asks for and considers your input" },
      { name: "Makes decisions alone", type: "red" as const, description: "Excludes you from significant choices" },
      { name: "Criticizes publicly", type: "red" as const, description: "Puts you down in front of others" },
      { name: "Controls your choices", type: "red" as const, description: "Tries to limit your freedom or autonomy" },
    ]
  },
  {
    category: "Trust",
    flags: [
      { name: "Keeps promises", type: "green" as const, description: "Follows through on commitments" },
      { name: "Is transparent", type: "green" as const, description: "Shares information openly and honestly" },
      { name: "Admits mistakes", type: "green" as const, description: "Takes responsibility for errors" },
      { name: "Breaks promises", type: "red" as const, description: "Fails to follow through on commitments" },
      { name: "Hides information", type: "red" as const, description: "Keeps secrets or withholds important details" },
      { name: "Lies or deceives", type: "red" as const, description: "Tells lies to avoid conflict or consequences" },
    ]
  }
];

export default function RelationshipHealthTracker({ profileId, profileName }: RelationshipHealthTrackerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFlag, setSelectedFlag] = useState<string>("");
  const [flagNotes, setFlagNotes] = useState("");
  const [checkInData, setCheckInData] = useState({
    feelSafeAndExcited: "",
    feelSupported: "",
    emotionalToneChanged: "",
    overallSafetyRating: 5,
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch relationship stats
  const { data: stats } = useQuery<RelationshipStats>({
    queryKey: ['/api/relationships', profileId, 'stats'],
  });

  // Fetch behavioral flags
  const { data: flags = [] } = useQuery<BehavioralFlag[]>({
    queryKey: ['/api/relationships', profileId, 'flags'],
  });

  // Fetch emotional check-ins
  const { data: checkIns = [] } = useQuery<EmotionalCheckIn[]>({
    queryKey: ['/api/relationships', profileId, 'check-ins'],
  });

  // Add flag mutation
  const addFlagMutation = useMutation({
    mutationFn: async (data: any) => {
      const selectedFlagData = flagOptions
        .flatMap(cat => cat.flags)
        .find(flag => flag.name === selectedFlag);
      
      if (!selectedFlagData) throw new Error("Flag not found");

      console.log("Making flag API call with profileId:", profileId);
      return apiRequest(
        "POST",
        `/api/relationships/${profileId}/flags`,
        {
          flagCategory: selectedCategory,
          flagName: selectedFlag,
          flagType: selectedFlagData.type,
          isPresent: true,
          notes: flagNotes
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/relationships'] });
      setSelectedCategory("");
      setSelectedFlag("");
      setFlagNotes("");
      toast({ title: "Flag added successfully" });
    },
    onError: () => {
      toast({ title: "Error adding flag", variant: "destructive" });
    }
  });

  // Add check-in mutation
  const addCheckInMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Making check-in API call with profileId:", profileId);
      return apiRequest(
        "POST",
        `/api/relationships/${profileId}/check-ins`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/relationships'] });
      setCheckInData({
        feelSafeAndExcited: "",
        feelSupported: "",
        emotionalToneChanged: "",
        overallSafetyRating: 5,
        notes: ""
      });
      toast({ title: "Check-in recorded successfully" });
    },
    onError: () => {
      toast({ title: "Error recording check-in", variant: "destructive" });
    }
  });

  // Calculate health score
  const healthScore = stats ? stats.greenFlags - stats.redFlags : 0;
  const healthPercentage = Math.max(0, Math.min(100, (healthScore + 20) * 2.5)); // Scale to 0-100%

  const getHealthStatus = () => {
    if (healthScore >= 5) return { label: "Going Well", color: "bg-green-500", icon: Heart };
    if (healthScore >= 0) return { label: "Balanced", color: "bg-blue-500", icon: MessageCircle };
    if (healthScore >= -3) return { label: "Mixed Signals", color: "bg-yellow-500", icon: AlertTriangle };
    return { label: "Needs Attention", color: "bg-orange-500", icon: Shield };
  };

  const healthStatus = getHealthStatus();
  const StatusIcon = healthStatus.icon;

  const availableFlags = selectedCategory
    ? flagOptions.find(cat => cat.category === selectedCategory)?.flags || []
    : [];

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className="w-5 h-5" />
            Relationship Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Health</span>
              <Badge variant={healthScore >= 0 ? "default" : "destructive"}>
                {healthStatus.label}
              </Badge>
            </div>
            
            <Progress value={healthPercentage} className="h-3" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>{stats?.greenFlags || 0} Green Flags</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span>{stats?.redFlags || 0} Red Flags</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>{stats?.checkInCount || 0} Check-ins</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <span>{stats?.averageSafetyRating?.toFixed(1) || "N/A"} Safety</span>
              </div>
            </div>

            <div className="text-xs text-neutral-500">
              Score: {healthScore} ({healthScore >= 0 ? "Positive Trend" : "Challenging Trend"})
              {healthScore < -3 && (
                <span className="block text-orange-600 font-medium mt-1">
                  Consider reflecting on this relationship pattern
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Tabs */}
      <Tabs defaultValue="add-flag" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add-flag">Log Flag</TabsTrigger>
          <TabsTrigger value="check-in">Emotional Check-in</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="add-flag" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log a Behavioral Flag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {flagOptions.map(category => (
                        <SelectItem key={category.category} value={category.category}>
                          {category.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Behavior</Label>
                  <Select 
                    value={selectedFlag} 
                    onValueChange={setSelectedFlag}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select behavior" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFlags.map(flag => (
                        <SelectItem key={flag.name} value={flag.name}>
                          <div className="flex items-center gap-2">
                            <Badge variant={flag.type === "green" ? "default" : "destructive"} className="w-2 h-2 p-0" />
                            {flag.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={flagNotes}
                  onChange={(e) => setFlagNotes(e.target.value)}
                  placeholder="Add context about this behavior..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={() => addFlagMutation.mutate({})}
                disabled={!selectedCategory || !selectedFlag || addFlagMutation.isPending}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Flag
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="check-in" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emotional Check-in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Feel Safe & Excited?</Label>
                  <Select 
                    value={checkInData.feelSafeAndExcited} 
                    onValueChange={(value) => setCheckInData(prev => ({ ...prev, feelSafeAndExcited: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unsure">Unsure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Feel Supported?</Label>
                  <Select 
                    value={checkInData.feelSupported} 
                    onValueChange={(value) => setCheckInData(prev => ({ ...prev, feelSupported: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unsure">Unsure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Emotional Tone Changed?</Label>
                  <Select 
                    value={checkInData.emotionalToneChanged} 
                    onValueChange={(value) => setCheckInData(prev => ({ ...prev, emotionalToneChanged: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unsure">Unsure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Overall Safety Rating (1-10)</Label>
                <Select 
                  value={checkInData.overallSafetyRating.toString()} 
                  onValueChange={(value) => setCheckInData(prev => ({ ...prev, overallSafetyRating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} - {i + 1 <= 3 ? "Low" : i + 1 <= 7 ? "Medium" : "High"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={checkInData.notes}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How are you feeling about this relationship today?"
                  rows={3}
                />
              </div>

              <Button 
                onClick={() => addCheckInMutation.mutate(checkInData)}
                disabled={addCheckInMutation.isPending}
                className="w-full"
              >
                Record Check-in
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Flags */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {flags.slice(0, 5).map((flag) => (
                    <div key={flag.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={flag.flagType === "green" ? "default" : "destructive"}>
                          {flag.flagType}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{flag.flagName}</p>
                          <p className="text-xs text-neutral-500">{flag.flagCategory}</p>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {new Date(flag.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {flags.length === 0 && (
                    <p className="text-sm text-neutral-500 text-center py-4">
                      No flags logged yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Check-ins */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {checkIns.slice(0, 5).map((checkIn) => (
                    <div key={checkIn.id} className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">
                          Safety: {checkIn.overallSafetyRating}/10
                        </Badge>
                        <span className="text-xs text-neutral-400">
                          {new Date(checkIn.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600 space-y-1">
                        <p>Safe & Excited: {checkIn.feelSafeAndExcited}</p>
                        <p>Supported: {checkIn.feelSupported}</p>
                        {checkIn.notes && (
                          <p className="italic">"{checkIn.notes}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {checkIns.length === 0 && (
                    <p className="text-sm text-neutral-500 text-center py-4">
                      No check-ins recorded yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}